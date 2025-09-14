/**
 * خدمة إدارة المدفوعات
 */

import { Payment, PAYMENT_STATUSES, PAYMENT_METHODS } from '../models/Payment.js';
import { errorHandler } from '../errorHandler.js';
import firebaseApi from '../firebaseApi.js';
import logger from '../logger.js';

export class PaymentService {
  constructor() {
    this.collectionName = 'payments';
  }

  /**
   * إنشاء عملية دفع جديدة
   */
  async createPayment(paymentData) {
    try {
      // إنشاء نموذج الدفع
      const payment = new Payment(paymentData);
      
      // التحقق من صحة البيانات
      const validationErrors = payment.validate();
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/payment-invalid',
          `خطأ في بيانات الدفع: ${validationErrors.join(', ')}`,
          'payment-creation'
        );
      }

      // حفظ الدفع في Firebase
      const paymentDoc = await firebaseApi.addToCollection(this.collectionName, payment.toObject());
      payment.id = paymentDoc.id;

      return payment.toObject();

    } catch (error) {
      throw errorHandler.handleError(error, 'payment-creation');
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

      let result;
      
      // معالجة الدفع حسب الطريقة
      switch (paymentMethod) {
        case PAYMENT_METHODS.CREDIT_CARD:
        case PAYMENT_METHODS.DEBIT_CARD:
          result = await this.processCardPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.PAYPAL:
          result = await this.processPayPalPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.APPLE_PAY:
          result = await this.processApplePayPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.GOOGLE_PAY:
          result = await this.processGooglePayPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.BANK_TRANSFER:
          result = await this.processBankTransferPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.CASH_ON_DELIVERY:
          result = await this.processCashOnDeliveryPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.CRYPTOCURRENCY:
          result = await this.processCryptoPayment(payment, paymentDetails);
          break;
        case PAYMENT_METHODS.MANUAL:
          result = await this.processManualPayment(payment, paymentDetails);
          break;
        default:
          throw errorHandler.createError(
            'VALIDATION',
            'payment/unsupported-method',
            'طريقة الدفع غير مدعومة',
            `payment-process:${paymentId}`
          );
      }

      // تحديث حالة الدفع
      if (result.success) {
        await this.updatePaymentStatus(paymentId, 'completed', {
          transactionId: result.transactionId,
          gatewayResponse: result.gatewayResponse
        });
      } else {
        await this.updatePaymentStatus(paymentId, 'failed', {
          error: result.error
        });
      }

      return result;

    } catch (error) {
      // تحديث حالة الدفع إلى "فشل"
      await this.updatePaymentStatus(paymentId, 'failed', {
        error: error.message
      });
      
      throw errorHandler.handleError(error, `payment-process:${paymentId}`);
    }
  }

  /**
   * معالجة دفع البطاقة
   */
  async processCardPayment(payment, cardDetails) {
    try {
      // هنا يتم ربط بوابات الدفع الفعلية
      // مثل Stripe, PayFort, MyFatoorah
      
      // محاكاة معالجة الدفع
      const isSuccess = Math.random() > 0.1; // 90% نجاح
      
      if (isSuccess) {
        // تحديث معلومات البطاقة
        payment.setCardInfo({
          last4: cardDetails.number.slice(-4),
          brand: cardDetails.brand || 'visa',
          expMonth: cardDetails.expMonth,
          expYear: cardDetails.expYear
        });

        return {
          success: true,
          transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewayResponse: {
            status: 'success',
            message: 'تم الدفع بنجاح'
          }
        };
      } else {
        return {
          success: false,
          error: 'فشل في معالجة الدفع'
        };
      }

    } catch (error) {
      throw errorHandler.handleError(error, 'card-payment');
    }
  }

  /**
   * معالجة دفع PayPal
   */
  async processPayPalPayment(payment, paypalDetails) {
    try {
      // محاكاة معالجة PayPal
      const isSuccess = Math.random() > 0.05; // 95% نجاح
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewayResponse: {
            status: 'success',
            message: 'تم الدفع عبر PayPal بنجاح'
          }
        };
      } else {
        return {
          success: false,
          error: 'فشل في معالجة دفع PayPal'
        };
      }

    } catch (error) {
      throw errorHandler.handleError(error, 'paypal-payment');
    }
  }

  /**
   * معالجة دفع Apple Pay
   */
  async processApplePayPayment(payment, applePayDetails) {
    try {
      // محاكاة معالجة Apple Pay
      const isSuccess = Math.random() > 0.05; // 95% نجاح
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `AP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewayResponse: {
            status: 'success',
            message: 'تم الدفع عبر Apple Pay بنجاح'
          }
        };
      } else {
        return {
          success: false,
          error: 'فشل في معالجة دفع Apple Pay'
        };
      }

    } catch (error) {
      throw errorHandler.handleError(error, 'apple-pay-payment');
    }
  }

  /**
   * معالجة دفع Google Pay
   */
  async processGooglePayPayment(payment, googlePayDetails) {
    try {
      // محاكاة معالجة Google Pay
      const isSuccess = Math.random() > 0.05; // 95% نجاح
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `GP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewayResponse: {
            status: 'success',
            message: 'تم الدفع عبر Google Pay بنجاح'
          }
        };
      } else {
        return {
          success: false,
          error: 'فشل في معالجة دفع Google Pay'
        };
      }

    } catch (error) {
      throw errorHandler.handleError(error, 'google-pay-payment');
    }
  }

  /**
   * معالجة التحويل البنكي
   */
  async processBankTransferPayment(payment, bankDetails) {
    try {
      // التحويل البنكي يتم تأكيده يدوياً
      return {
        success: true,
        transactionId: `BT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewayResponse: {
          status: 'pending',
          message: 'تم إرسال تفاصيل التحويل البنكي، سيتم التأكيد خلال 24-48 ساعة'
        }
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'bank-transfer-payment');
    }
  }

  /**
   * معالجة الدفع عند الاستلام
   */
  async processCashOnDeliveryPayment(payment, codDetails) {
    try {
      // الدفع عند الاستلام
      return {
        success: true,
        transactionId: `COD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewayResponse: {
          status: 'pending',
          message: 'سيتم الدفع عند استلام الطلب'
        }
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'cash-on-delivery-payment');
    }
  }

  /**
   * معالجة دفع العملات الرقمية
   */
  async processCryptoPayment(payment, cryptoDetails) {
    try {
      // محاكاة معالجة العملات الرقمية
      const isSuccess = Math.random() > 0.1; // 90% نجاح
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `CRYPTO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewayResponse: {
            status: 'success',
            message: 'تم الدفع بالعملة الرقمية بنجاح'
          }
        };
      } else {
        return {
          success: false,
          error: 'فشل في معالجة الدفع بالعملة الرقمية'
        };
      }

    } catch (error) {
      throw errorHandler.handleError(error, 'crypto-payment');
    }
  }

  /**
   * معالجة الدفع اليدوي
   */
  async processManualPayment(payment, manualDetails) {
    try {
      // الدفع اليدوي (مثل الدفع عند الاستلام أو التحويل البنكي)
      return {
        success: true,
        transactionId: `MANUAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewayResponse: {
          status: 'pending',
          message: 'سيتم معالجة الدفع يدوياً'
        }
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'manual-payment');
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
      throw errorHandler.handleError(error, `payment:${paymentId}`);
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
      throw errorHandler.handleError(error, `order-payments:${orderId}`);
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
      throw errorHandler.handleError(error, `payment-status:${paymentId}`);
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
      throw errorHandler.handleError(error, `payment-refund:${paymentId}`);
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
      throw errorHandler.handleError(error, 'payment-stats');
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
      throw errorHandler.handleError(error, 'payment-methods:get');
    }
  }

  /**
   * معالجة الدفع عبر Tabby
   */
  async processTabbyPayment(payment, paymentDetails) {
    try {
      // محاكاة معالجة الدفع عبر Tabby
      const result = {
        success: true,
        transactionId: `tabby_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'تم معالجة الدفع عبر Tabby بنجاح',
        installmentPlan: paymentDetails.installmentPlan || 4,
        monthlyPayment: payment.amount / (paymentDetails.installmentPlan || 4)
      };
      
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, 'tabby-payment-process');
    }
  }

  /**
   * معالجة الدفع عبر Tamara
   */
  async processTamaraPayment(payment, paymentDetails) {
    try {
      // محاكاة معالجة الدفع عبر Tamara
      const result = {
        success: true,
        transactionId: `tamara_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'تم معالجة الدفع عبر Tamara بنجاح',
        installmentPlan: paymentDetails.installmentPlan || 3,
        monthlyPayment: payment.amount / (paymentDetails.installmentPlan || 3)
      };
      
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, 'tamara-payment-process');
    }
  }

  /**
   * معالجة الدفع عبر STC Pay
   */
  async processSTCPayPayment(payment, paymentDetails) {
    try {
      // محاكاة معالجة الدفع عبر STC Pay
      const result = {
        success: true,
        transactionId: `stc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'تم معالجة الدفع عبر STC Pay بنجاح'
      };
      
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, 'stc-payment-process');
    }
  }

  /**
   * معالجة الدفع عبر Urway
   */
  async processUrwayPayment(payment, paymentDetails) {
    try {
      // محاكاة معالجة الدفع عبر Urway
      const result = {
        success: true,
        transactionId: `urway_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'تم معالجة الدفع عبر Urway بنجاح'
      };
      
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, 'urway-payment-process');
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
