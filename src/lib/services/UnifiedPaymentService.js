/**
 * خدمة المدفوعات الموحدة الجديدة
 * Unified Payment Service
 */

import { paymentManager } from '../payment/PaymentManager.js';
import { Payment } from '../models/Payment.js';
import { errorHandler } from '../errorHandler.js';
import firebaseApi from '../firebaseApi.js';
import logger from '../logger.js';

export class UnifiedPaymentService {
  constructor() {
    this.collectionName = 'payments';
    this.isInitialized = false;
  }

  /**
   * تهيئة خدمة المدفوعات
   */
  async initialize() {
    try {
      // الحصول على إعدادات المدفوعات من Firebase
      const settings = await this.getPaymentSettings();
      
      // تهيئة مدير المدفوعات
      await paymentManager.initialize(settings);
      
      this.isInitialized = true;
      
      logger.info('Unified Payment Service initialized successfully');
      return { success: true };
    } catch (error) {
      logger.error('Unified Payment Service initialization failed:', error);
      throw error;
    }
  }

  /**
   * الحصول على إعدادات المدفوعات
   */
  async getPaymentSettings() {
    try {
      const settings = await firebaseApi.getSettings();
      return settings.payments || {};
    } catch (error) {
      logger.error('Failed to get payment settings:', error);
      return {};
    }
  }

  /**
   * إنشاء عملية دفع جديدة
   */
  async createPayment(paymentData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // إنشاء Payment Intent
      const paymentIntent = await paymentManager.createPaymentIntent(paymentData);
      
      // إنشاء سجل الدفع في Firebase
      const payment = new Payment({
        ...paymentData,
        paymentIntentId: paymentIntent.id,
        provider: paymentIntent.provider,
        status: paymentIntent.status,
        metadata: {
          ...paymentData.metadata,
          provider: paymentIntent.provider,
          providerInfo: paymentIntent.providerInfo
        }
      });

      const paymentDoc = await firebaseApi.addToCollection(this.collectionName, payment.toObject());
      payment.id = paymentDoc.id;

      return {
        ...payment.toObject(),
        paymentIntent: paymentIntent
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'payment-creation');
    }
  }

  /**
   * معالجة الدفع
   */
  async processPayment(paymentId, paymentMethodData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

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

      // تأكيد الدفع
      const result = await paymentManager.confirmPayment(
        payment.paymentIntentId, 
        paymentMethodData
      );

      // تحديث حالة الدفع
      if (result.status === 'captured' || result.status === 'completed') {
        await this.updatePaymentStatus(paymentId, 'completed', {
          transactionId: result.id,
          gatewayResponse: result
        });
      } else if (result.status === 'failed') {
        await this.updatePaymentStatus(paymentId, 'failed', {
          error: result.error || 'فشل في معالجة الدفع'
        });
      } else {
        await this.updatePaymentStatus(paymentId, result.status, {
          gatewayResponse: result
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
      if (!this.isInitialized) {
        await this.initialize();
      }

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

      // استرداد الدفع عبر مدير المدفوعات
      const refundResult = await paymentManager.refundPayment(
        payment.paymentIntentId, 
        amount, 
        reason
      );

      // تحديث حالة الدفع
      await this.updatePaymentStatus(paymentId, 'refunded', {
        refundAmount: amount,
        refundReason: reason,
        refundId: refundResult.id
      });

      return { success: true, message: 'تم استرداد الدفع بنجاح', refund: refundResult };

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
   * الحصول على طرق الدفع المتاحة
   */
  async getAvailablePaymentMethods(orderData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return paymentManager.getAvailablePaymentMethods(orderData);
    } catch (error) {
      throw errorHandler.handleError(error, 'payment-methods:get');
    }
  }

  /**
   * اختبار اتصال مزود محدد
   */
  async testProviderConnection(providerName) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await paymentManager.testProviderConnection(providerName);
    } catch (error) {
      throw errorHandler.handleError(error, `provider-test:${providerName}`);
    }
  }

  /**
   * معالجة Webhook
   */
  async handleWebhook(providerName, webhookData, signature) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const result = await paymentManager.handleWebhook(providerName, webhookData, signature);
      
      // تحديث حالة الدفع حسب الحدث
      if (result.type === 'payment.captured') {
        const payment = await this.getPaymentByIntentId(result.paymentIntentId);
        if (payment) {
          await this.updatePaymentStatus(payment.id, 'completed', {
            transactionId: result.paymentIntentId,
            gatewayResponse: result
          });
        }
      } else if (result.type === 'payment.failed') {
        const payment = await this.getPaymentByIntentId(result.paymentIntentId);
        if (payment) {
          await this.updatePaymentStatus(payment.id, 'failed', {
            error: result.error
          });
        }
      }

      return result;
    } catch (error) {
      throw errorHandler.handleError(error, `webhook:${providerName}`);
    }
  }

  /**
   * الحصول على دفع بواسطة Payment Intent ID
   */
  async getPaymentByIntentId(paymentIntentId) {
    try {
      const payments = await firebaseApi.getCollection(this.collectionName);
      const payment = payments.find(p => p.paymentIntentId === paymentIntentId);
      return payment ? new Payment(payment).toObject() : null;
    } catch (error) {
      throw errorHandler.handleError(error, `payment-by-intent:${paymentIntentId}`);
    }
  }

  /**
   * إنشاء عميل
   */
  async createCustomer(providerName, customerData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await paymentManager.createCustomer(providerName, customerData);
    } catch (error) {
      throw errorHandler.handleError(error, `customer-create:${providerName}`);
    }
  }

  /**
   * حفظ طريقة دفع للعميل
   */
  async savePaymentMethod(providerName, customerId, paymentMethodData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await paymentManager.savePaymentMethod(providerName, customerId, paymentMethodData);
    } catch (error) {
      throw errorHandler.handleError(error, `payment-method-save:${providerName}`);
    }
  }

  /**
   * الحصول على طرق الدفع المحفوظة للعميل
   */
  async getCustomerPaymentMethods(providerName, customerId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await paymentManager.getCustomerPaymentMethods(providerName, customerId);
    } catch (error) {
      throw errorHandler.handleError(error, `customer-payment-methods:${providerName}`);
    }
  }

  /**
   * حذف طريقة دفع محفوظة
   */
  async deletePaymentMethod(providerName, customerId, paymentMethodId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await paymentManager.deletePaymentMethod(providerName, customerId, paymentMethodId);
    } catch (error) {
      throw errorHandler.handleError(error, `payment-method-delete:${providerName}`);
    }
  }

  /**
   * تحديث إعدادات المدفوعات
   */
  async updatePaymentSettings(newSettings) {
    try {
      // تحديث الإعدادات في Firebase
      const currentSettings = await firebaseApi.getSettings();
      const updatedSettings = {
        ...currentSettings,
        payments: {
          ...currentSettings.payments,
          ...newSettings
        }
      };

      await firebaseApi.updateSettings(updatedSettings);

      // تحديث إعدادات مدير المدفوعات
      await paymentManager.updateSettings(newSettings);

      return { success: true };
    } catch (error) {
      throw errorHandler.handleError(error, 'payment-settings-update');
    }
  }

  /**
   * الحصول على معلومات المزودين
   */
  async getProviderInfo() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return paymentManager.getAvailableProviders();
    } catch (error) {
      throw errorHandler.handleError(error, 'provider-info');
    }
  }

  /**
   * التحقق من صحة بيانات الدفع
   */
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('المبلغ يجب أن يكون أكبر من صفر');
    }

    if (!paymentData.currency) {
      errors.push('العملة مطلوبة');
    }

    if (!paymentData.orderId) {
      errors.push('معرف الطلب مطلوب');
    }

    if (!paymentData.customerId) {
      errors.push('معرف العميل مطلوب');
    }

    return errors;
  }

  /**
   * حساب رسوم الدفع
   */
  calculatePaymentFees(amount, providerName) {
    try {
      const provider = paymentManager.getProvider(providerName);
      if (!provider) {
        return 0;
      }

      const info = provider.getProviderInfo();
      const fees = info.fees;
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
  async isPaymentMethodAvailable(providerName, orderData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const availableMethods = paymentManager.getAvailablePaymentMethods(orderData);
      return availableMethods.some(method => method.provider === providerName);
    } catch (error) {
      logger.error('Error checking payment method availability:', error);
      return false;
    }
  }
}

export default new UnifiedPaymentService();






