/**
 * مزود الدفع عند الاستلام
 * Cash on Delivery Payment Provider
 */

import { PaymentProvider, UNIFIED_PAYMENT_STATUSES } from './PaymentProvider.js';

export class CashOnDeliveryProvider extends PaymentProvider {
  constructor(config = {}) {
    super({
      ...config,
      providerName: 'cash_on_delivery',
      displayName: 'الدفع عند الاستلام',
      supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
      supportedPaymentMethods: ['cash_on_delivery'],
      processingTime: 'Upon delivery',
      fees: { percentage: 0, fixed: 0 }
    });

    this.maxAmount = config.maxAmount || 1000;
    this.codFee = config.codFee || 15;
  }

  /**
   * تهيئة مزود الدفع عند الاستلام
   */
  async initialize() {
    try {
      this.logOperation('initialize', { testMode: this.isTestMode });
      return { success: true };
    } catch (error) {
      this.logOperation('initialize_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * اختبار الاتصال
   */
  async testConnection() {
    try {
      this.logOperation('test_connection', { success: true });
      return {
        success: true,
        message: 'الدفع عند الاستلام متاح',
        provider: 'cash_on_delivery',
        testMode: this.isTestMode
      };
    } catch (error) {
      this.logOperation('test_connection_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * إنشاء Payment Intent
   */
  async createPaymentIntent(paymentData) {
    try {
      const { amount, currency, customerId, metadata = {} } = paymentData;

      // التحقق من الحد الأقصى للمبلغ
      if (amount > this.maxAmount) {
        throw new Error(`المبلغ يتجاوز الحد الأقصى المسموح (${this.maxAmount} ${currency})`);
      }

      // حساب رسوم الدفع عند الاستلام
      const codFeeAmount = this.calculateCodFee(amount);
      const totalAmount = amount + codFeeAmount;

      const intentData = {
        id: `cod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        totalAmount: totalAmount,
        codFee: codFeeAmount,
        currency: currency,
        customerId: customerId,
        status: 'pending',
        metadata: {
          ...metadata,
          orderId: metadata.orderId,
          customerEmail: metadata.customerEmail,
          customerPhone: metadata.customerPhone,
          customerName: metadata.customerName,
          shippingAddress: metadata.shippingAddress
        },
        createdAt: new Date().toISOString()
      };

      this.logOperation('create_payment_intent', { 
        amount, 
        totalAmount,
        codFee: codFeeAmount,
        currency, 
        intentId: intentData.id 
      });

      return {
        id: intentData.id,
        status: this.mapPaymentStatus(intentData.status),
        amount: intentData.amount,
        totalAmount: intentData.totalAmount,
        codFee: intentData.codFee,
        currency: intentData.currency,
        created: intentData.createdAt,
        metadata: intentData.metadata
      };
    } catch (error) {
      this.logOperation('create_payment_intent_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * تأكيد الدفع
   */
  async confirmPayment(paymentIntentId, paymentMethodData = {}) {
    try {
      // في الدفع عند الاستلام، التأكيد يتم عند الاستلام الفعلي
      // هنا نعيد حالة "pending" حتى يتم الاستلام
      
      this.logOperation('confirm_payment', { 
        intentId: paymentIntentId, 
        status: 'pending_delivery' 
      });

      return {
        id: paymentIntentId,
        status: UNIFIED_PAYMENT_STATUSES.PENDING,
        message: 'سيتم الدفع عند استلام الطلب',
        deliveryInstructions: this.getDeliveryInstructions()
      };
    } catch (error) {
      this.logOperation('confirm_payment_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * إلغاء الدفع
   */
  async cancelPayment(paymentIntentId) {
    try {
      this.logOperation('cancel_payment', { 
        intentId: paymentIntentId 
      });

      return {
        id: paymentIntentId,
        status: UNIFIED_PAYMENT_STATUSES.CANCELLED,
        cancelledAt: new Date().toISOString()
      };
    } catch (error) {
      this.logOperation('cancel_payment_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * استرداد الدفع
   */
  async refundPayment(paymentIntentId, amount, reason) {
    try {
      // في الدفع عند الاستلام، الاسترداد يتم يدوياً
      this.logOperation('refund_payment', { 
        intentId: paymentIntentId, 
        amount 
      });

      return {
        id: `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        status: 'pending',
        reason: reason,
        createTime: new Date().toISOString(),
        note: 'سيتم معالجة الاسترداد يدوياً'
      };
    } catch (error) {
      this.logOperation('refund_payment_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * معالجة Webhook
   */
  async handleWebhook(webhookData, signature) {
    try {
      // الدفع عند الاستلام لا يستخدم webhooks
      // ولكن يمكن محاكاة الأحداث
      const event = webhookData;
      let unifiedEvent = null;

      switch (event.type) {
        case 'delivery.completed':
          unifiedEvent = {
            type: 'payment.captured',
            paymentIntentId: event.data.paymentIntentId,
            status: UNIFIED_PAYMENT_STATUSES.CAPTURED,
            amount: event.data.amount,
            currency: event.data.currency,
            deliveryDate: event.data.deliveryDate
          };
          break;

        case 'delivery.failed':
          unifiedEvent = {
            type: 'payment.failed',
            paymentIntentId: event.data.paymentIntentId,
            status: UNIFIED_PAYMENT_STATUSES.FAILED,
            error: event.data.failureReason
          };
          break;

        default:
          unifiedEvent = {
            type: 'unknown',
            originalEvent: event
          };
      }

      this.logOperation('handle_webhook', { 
        eventType: event.type, 
        unifiedType: unifiedEvent.type 
      });

      return unifiedEvent;
    } catch (error) {
      this.logOperation('handle_webhook_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * التحقق من صحة التوقيع
   */
  async verifySignature(payload, signature) {
    try {
      // الدفع عند الاستلام لا يستخدم توقيعات
      return true;
    } catch (error) {
      this.logOperation('verify_signature_error', error);
      return false;
    }
  }

  /**
   * الحصول على حالة الدفع
   */
  async getPaymentStatus(paymentIntentId) {
    try {
      // محاكاة الحصول على حالة الدفع
      return {
        id: paymentIntentId,
        status: UNIFIED_PAYMENT_STATUSES.PENDING,
        amount: 0, // سيتم تحديده عند الاستلام
        currency: 'SAR',
        message: 'في انتظار الاستلام'
      };
    } catch (error) {
      this.logOperation('get_payment_status_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * إنشاء عميل
   */
  async createCustomer(customerData) {
    try {
      return {
        id: customerData.email || customerData.phone,
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone
      };
    } catch (error) {
      this.logOperation('create_customer_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * حفظ طريقة دفع للعميل
   */
  async savePaymentMethod(customerId, paymentMethodData) {
    try {
      return {
        id: 'cash_on_delivery',
        type: 'cash_on_delivery',
        customerId: customerId
      };
    } catch (error) {
      this.logOperation('save_payment_method_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * الحصول على طرق الدفع المحفوظة للعميل
   */
  async getCustomerPaymentMethods(customerId) {
    try {
      return [{
        id: 'cash_on_delivery',
        type: 'cash_on_delivery',
        customerId: customerId
      }];
    } catch (error) {
      this.logOperation('get_customer_payment_methods_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * حذف طريقة دفع محفوظة
   */
  async deletePaymentMethod(customerId, paymentMethodId) {
    try {
      return { success: true };
    } catch (error) {
      this.logOperation('delete_payment_method_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * التحقق من صحة البيانات
   */
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('المبلغ يجب أن يكون أكبر من صفر');
    }

    if (paymentData.amount > this.maxAmount) {
      errors.push(`المبلغ يتجاوز الحد الأقصى المسموح (${this.maxAmount} ${paymentData.currency})`);
    }

    if (!paymentData.currency) {
      errors.push('العملة مطلوبة');
    }

    if (!this.config.supportedCurrencies.includes(paymentData.currency)) {
      errors.push(`العملة ${paymentData.currency} غير مدعومة`);
    }

    if (!paymentData.metadata?.customerPhone) {
      errors.push('رقم الهاتف مطلوب للتواصل عند الاستلام');
    }

    if (!paymentData.metadata?.shippingAddress) {
      errors.push('عنوان الشحن مطلوب');
    }

    return errors;
  }

  /**
   * تحويل حالة الدفع إلى الحالة الموحدة
   */
  mapPaymentStatus(codStatus) {
    const statusMap = {
      'pending': UNIFIED_PAYMENT_STATUSES.PENDING,
      'pending_delivery': UNIFIED_PAYMENT_STATUSES.PENDING,
      'delivered': UNIFIED_PAYMENT_STATUSES.CAPTURED,
      'cancelled': UNIFIED_PAYMENT_STATUSES.CANCELLED,
      'failed': UNIFIED_PAYMENT_STATUSES.FAILED
    };

    return statusMap[codStatus] || UNIFIED_PAYMENT_STATUSES.PENDING;
  }

  /**
   * تحويل خطأ الدفع عند الاستلام إلى خطأ موحد
   */
  mapError(codError) {
    const errorMap = {
      'AMOUNT_EXCEEDED': 'المبلغ يتجاوز الحد المسموح',
      'INVALID_PHONE': 'رقم الهاتف غير صحيح',
      'INVALID_ADDRESS': 'عنوان الشحن غير صحيح',
      'DELIVERY_NOT_AVAILABLE': 'التوصيل غير متاح في هذا العنوان',
      'CUSTOMER_NOT_FOUND': 'العميل غير موجود'
    };

    const errorCode = codError.code || 'unknown_error';
    const message = errorMap[errorCode] || codError.message || 'خطأ غير معروف';

    return {
      code: errorCode,
      message,
      provider: 'cash_on_delivery',
      originalError: codError
    };
  }

  /**
   * حساب رسوم الدفع عند الاستلام
   */
  calculateCodFee(amount) {
    // رسوم ثابتة أو نسبة من المبلغ
    return this.codFee;
  }

  /**
   * الحصول على تعليمات الاستلام
   */
  getDeliveryInstructions() {
    return {
      title: 'تعليمات الدفع عند الاستلام',
      instructions: [
        'سيتم التواصل معك عبر الهاتف لتأكيد موعد التوصيل',
        'احضر المبلغ المطلوب بالعملة المحلية',
        'سيتم تسليم الطلب مقابل الدفع',
        'احتفظ بالإيصال كدليل على الدفع'
      ],
      contactInfo: {
        phone: '+966501234567',
        email: 'support@darmolhimon.com'
      }
    };
  }

  /**
   * التحقق من توفر الدفع عند الاستلام
   */
  isAvailable(amount, currency, country) {
    return (
      amount <= this.maxAmount &&
      this.config.supportedCurrencies.includes(currency) &&
      this.config.supportedCountries.includes(country)
    );
  }

  /**
   * الحصول على معلومات إضافية
   */
  getAdditionalInfo() {
    return {
      maxAmount: this.maxAmount,
      codFee: this.codFee,
      deliveryInstructions: this.getDeliveryInstructions(),
      supportedCountries: this.config.supportedCountries,
      processingTime: this.config.processingTime
    };
  }
}










