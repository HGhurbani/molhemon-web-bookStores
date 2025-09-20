/**
 * خدمة إدارة المدفوعات
 */

import { Payment, PAYMENT_STATUSES, PAYMENT_METHODS } from '../models/Payment.js';
import schemas from '../../../shared/schemas.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';
import firebaseApi from '../firebase/baseApi.js';
import logger from '../logger.js';
import { paymentManager } from '../payment/PaymentManager.js';

const { Schemas, validateData } = schemas;

const handleErrorWithLanguage = (error, context) =>
  errorHandler.handleError(error, context, getActiveLanguage());

export class PaymentService {
  constructor() {
    this.collectionName = 'payments';
  }

  /**
   * تحويل طريقة الدفع إلى مزود المدفوعات المناسب
   */
  mapPaymentMethodToProvider(paymentMethod) {
    switch (paymentMethod) {
      case PAYMENT_METHODS.PAYPAL:
        return 'paypal';
      case PAYMENT_METHODS.CASH_ON_DELIVERY:
        return 'cash_on_delivery';
      default:
        return 'stripe';
    }
  }

  /**
   * إنشاء عملية دفع جديدة
   */
  async createPayment(paymentData) {
    try {
      // إنشاء نموذج الدفع
      const payment = new Payment(paymentData);

      // التحقق من صحة البيانات باستخدام المخطط الموحد
      const validationErrors = validateData(paymentData, Schemas.Payment);
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/payment-invalid',
          `خطأ في بيانات الدفع: ${validationErrors.join(', ')}`,
          'payment-creation'
        );
      }

      // إنشاء Payment Intent عبر مدير المدفوعات
      const paymentIntent = await paymentManager.createPaymentIntent({
        amount: payment.amount,
        currency: payment.currency,
        provider: this.mapPaymentMethodToProvider(payment.paymentMethod),
        metadata: payment.metadata
      });

      // حفظ معلومات المزود وPayment Intent
      payment.paymentDetails = {
        ...payment.paymentDetails,
        paymentIntentId: paymentIntent.id,
        provider: paymentIntent.provider,
        providerInfo: paymentIntent.providerInfo
      };
      payment.paymentStatus = paymentIntent.status;
      payment.gatewayResponse = paymentIntent;

      // حفظ الدفع في Firebase
      const paymentDoc = await firebaseApi.addToCollection(this.collectionName, payment.toObject());
      payment.id = paymentDoc.id;

      return { ...payment.toObject(), paymentIntent };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'payment-creation');
    }
  }

  /**
   * معالجة الدفع
   */
  async processPayment(paymentId, paymentMethod, paymentDetails) {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'payment/not-found',
          'عملية الدفع غير موجودة',
          `payment-process:${paymentId}`
        );
      }

      // تحديث حالة الدفع إلى "قيد المعالجة"
      await this.updatePaymentStatus(paymentId, 'processing');

      // تأكيد الدفع عبر مدير المدفوعات
      const result = await paymentManager.confirmPayment(
        payment.paymentDetails?.paymentIntentId,
        paymentDetails
      );

      // تحديد حالة الدفع بناءً على نتيجة البوابة
      const newStatus = ['succeeded', 'captured', 'completed'].includes(result.status)
        ? 'completed'
        : result.status === 'processing'
          ? 'processing'
          : 'failed';

      await this.updatePaymentStatus(paymentId, newStatus, {
        transactionId: result.id,
        gatewayResponse: result
      });

      return result;

    } catch (error) {
      // تحديث حالة الدفع إلى "فشل"
      await this.updatePaymentStatus(paymentId, 'failed', {
        error: error.message
      });
      
      throw handleErrorWithLanguage(error, `payment-process:${paymentId}`);
    }
  }


  /**
   * الحصول على دفع بواسطة المعرف
   */
  async getPaymentById(paymentId) {
    try {
      const paymentDoc = await firebaseApi.getDocById(this.collectionName, paymentId);
      if (!paymentDoc) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'payment/not-found',
          'عملية الدفع غير موجودة',
          `payment:${paymentId}`
        );
      }

      return new Payment(paymentDoc).toObject();

    } catch (error) {
      throw handleErrorWithLanguage(error, `payment:${paymentId}`);
    }
  }

  /**
   * الحصول على مدفوعات الطلب
   */
  async getOrderPayments(orderId) {
    try {
      const payments = await firebaseApi.getCollection(this.collectionName);
      return payments
        .filter(payment => payment.orderId === orderId)
        .map(payment => new Payment(payment).toObject());

    } catch (error) {
      throw handleErrorWithLanguage(error, `order-payments:${orderId}`);
    }
  }

  /**
   * تحديث حالة الدفع
   */
  async updatePaymentStatus(paymentId, newStatus, additionalData = {}) {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'payment/not-found',
          'عملية الدفع غير موجودة',
          `payment-status:${paymentId}`
        );
      }

      const paymentModel = new Payment(payment);
      paymentModel.updateStatus(newStatus, additionalData);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, paymentId, {
        paymentStatus: newStatus,
        updatedAt: new Date(),
        ...additionalData
      });

      return paymentModel.toObject();

    } catch (error) {
      throw handleErrorWithLanguage(error, `payment-status:${paymentId}`);
    }
  }

  /**
   * استرداد الدفع
   */
  async refundPayment(paymentId, amount, reason = '') {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'payment/not-found',
          'عملية الدفع غير موجودة',
          `payment-refund:${paymentId}`
        );
      }

      // التحقق من إمكانية الاسترداد
      if (payment.paymentStatus !== 'completed') {
        throw errorHandler.createError(
          'VALIDATION',
          'payment/cannot-refund',
          'لا يمكن استرداد هذا الدفع',
          `payment-refund:${paymentId}`
        );
      }

      // تحديث حالة الدفع
      await this.updatePaymentStatus(paymentId, 'refunded', {
        refundAmount: amount,
        refundReason: reason
      });

      return { success: true, message: 'تم استرداد الدفع بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, `payment-refund:${paymentId}`);
    }
  }

  /**
   * الحصول على إحصائيات المدفوعات
   */
  async getPaymentStats(customerId = null) {
    try {
      let payments = await firebaseApi.getCollection(this.collectionName);
      
      if (customerId) {
        payments = payments.filter(payment => payment.customerId === customerId);
      }

      const stats = {
        total: payments.length,
        completed: payments.filter(p => p.paymentStatus === 'completed').length,
        pending: payments.filter(p => p.paymentStatus === 'pending').length,
        failed: payments.filter(p => p.paymentStatus === 'failed').length,
        refunded: payments.filter(p => p.paymentStatus === 'refunded').length,
        totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        successRate: payments.length > 0 ? 
          (payments.filter(p => p.paymentStatus === 'completed').length / payments.length * 100).toFixed(2) : 0
      };

      return stats;

    } catch (error) {
      throw handleErrorWithLanguage(error, 'payment-stats');
    }
  }

  /**
   * التحقق من صحة بيانات البطاقة
   */
  validateCardDetails(cardDetails) {
    const errors = [];
    
    if (!cardDetails.number || cardDetails.number.length < 13 || cardDetails.number.length > 19) {
      errors.push('رقم البطاقة غير صحيح');
    }
    
    if (!cardDetails.expMonth || cardDetails.expMonth < 1 || cardDetails.expMonth > 12) {
      errors.push('شهر انتهاء الصلاحية غير صحيح');
    }
    
    if (!cardDetails.expYear || cardDetails.expYear < new Date().getFullYear()) {
      errors.push('سنة انتهاء الصلاحية غير صحيحة');
    }
    
    if (!cardDetails.cvc || cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) {
      errors.push('رمز الأمان غير صحيح');
    }
    
    return errors;
  }

  /**
   * الحصول على طرق الدفع المتاحة من إعدادات المتجر
   */
  async getAvailablePaymentMethods() {
    try {
      const storeSettings = await this.storeSettings.getStoreSettings();
      const availableMethods = [];
      
      // الحصول على طرق الدفع المفعلة
      for (const [methodId, method] of Object.entries(storeSettings.paymentMethods)) {
        if (method.enabled) {
          // التحقق من أن بوابة الدفع مفعلة
          const gateway = storeSettings.paymentGateways[method.gateway];
          if (gateway && gateway.enabled) {
            availableMethods.push({
              id: methodId,
              name: method.name,
              description: method.description,
              icon: method.icon,
              logo: method.logo,
              enabled: method.enabled,
              gateway: method.gateway,
              fees: method.fees,
              processingTime: method.processingTime,
              instructions: method.instructions,
              supportedCards: method.supportedCards,
              installmentOptions: method.installmentOptions
            });
          }
        }
      }
      
      return availableMethods;
    } catch (error) {
      throw handleErrorWithLanguage(error, 'payment-methods:get');
    }
  }

  /**
   * حساب رسوم الدفع
   */
  calculatePaymentFees(amount, paymentMethod) {
    try {
      const method = this.storeSettings.paymentMethods[paymentMethod];
      if (!method) {
        return 0;
      }
      
      const fees = method.fees;
      const percentageFee = (amount * fees.percentage) / 100;
      const totalFees = percentageFee + fees.fixed;
      
      return totalFees;
    } catch (error) {
      logger.error('Error calculating payment fees:', error);
      return 0;
    }
  }

  /**
   * التحقق من توفر طريقة الدفع
   */
  async isPaymentMethodAvailable(paymentMethodId) {
    try {
      const storeSettings = await this.storeSettings.getStoreSettings();
      const method = storeSettings.paymentMethods[paymentMethodId];
      
      if (!method || !method.enabled) {
        return false;
      }
      
      const gateway = storeSettings.paymentGateways[method.gateway];
      return gateway && gateway.enabled;
    } catch (error) {
      logger.error('Error checking payment method availability:', error);
      return false;
    }
  }
}

export default new PaymentService();
