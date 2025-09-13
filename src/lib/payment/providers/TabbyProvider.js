/**
 * مزود Tabby للمدفوعات المحلية
 * Tabby Payment Provider
 */

import { PaymentProvider, UNIFIED_PAYMENT_STATUSES } from './PaymentProvider.js';

export class TabbyProvider extends PaymentProvider {
  constructor(config = {}) {
    super({
      ...config,
      providerName: 'tabby',
      displayName: 'تابي',
      supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
      supportedPaymentMethods: ['installment'],
      processingTime: '3-12 months installment',
      fees: { percentage: 0, fixed: 0 } // بدون رسوم إضافية
    });

    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.webhookSecret = config.webhookSecret;
    this.baseUrl = this.isTestMode 
      ? 'https://api.tabby.dev' 
      : 'https://api.tabby.ai';
  }

  /**
   * تهيئة Tabby
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
      const response = await this.makeTabbyRequest('GET', '/v1/configuration');
      
      this.logOperation('test_connection', { success: true });
      return {
        success: true,
        message: 'تم الاتصال بـ Tabby بنجاح',
        provider: 'tabby',
        testMode: this.isTestMode
      };
    } catch (error) {
      this.logOperation('test_connection_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * إنشاء Payment Intent (Session في Tabby)
   */
  async createPaymentIntent(paymentData) {
    try {
      const { amount, currency, customerId, metadata = {} } = paymentData;
      const installmentPlan = metadata.installmentPlan || 4;

      const sessionData = {
        amount: amount.toString(),
        currency: currency,
        buyer: {
          email: metadata.customerEmail,
          phone: metadata.customerPhone,
          name: metadata.customerName
        },
        order: {
          reference_id: metadata.orderId,
          items: metadata.items || []
        },
        configuration: {
          available_products: ['installments'],
          installments: {
            count: installmentPlan
          }
        },
        lang: 'ar',
        merchant_urls: {
          success: metadata.returnUrl || `${window.location.origin}/payment/success`,
          failure: metadata.cancelUrl || `${window.location.origin}/payment/cancel`,
          cancel: metadata.cancelUrl || `${window.location.origin}/payment/cancel`
        }
      };

      const response = await this.makeTabbyRequest('POST', '/v1/sessions', sessionData);
      
      this.logOperation('create_payment_intent', { 
        amount, 
        currency, 
        sessionId: response.id,
        installmentPlan 
      });

      return {
        id: response.id,
        status: this.mapPaymentStatus(response.status),
        amount: parseFloat(response.amount),
        currency: response.currency,
        installmentPlan: installmentPlan,
        monthlyPayment: amount / installmentPlan,
        created: response.created_at,
        metadata: {
          orderId: metadata.orderId,
          customerEmail: metadata.customerEmail,
          installmentPlan: installmentPlan
        },
        checkoutUrl: response.payment_url
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
      const response = await this.makeTabbyRequest('GET', `/v1/sessions/${paymentIntentId}`);
      
      this.logOperation('confirm_payment', { 
        sessionId: paymentIntentId, 
        status: response.status 
      });

      return {
        id: response.id,
        status: this.mapPaymentStatus(response.status),
        amount: parseFloat(response.amount),
        currency: response.currency,
        installmentPlan: response.configuration?.installments?.count,
        monthlyPayment: parseFloat(response.amount) / (response.configuration?.installments?.count || 4),
        createTime: response.created_at,
        updateTime: response.updated_at
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
      const response = await this.makeTabbyRequest('POST', `/v1/sessions/${paymentIntentId}/cancel`);
      
      this.logOperation('cancel_payment', { 
        sessionId: paymentIntentId 
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
      const refundData = {
        amount: amount.toString(),
        reason: reason || 'Refund requested by customer'
      };

      const response = await this.makeTabbyRequest('POST', `/v1/sessions/${paymentIntentId}/refund`, refundData);
      
      this.logOperation('refund_payment', { 
        sessionId: paymentIntentId, 
        amount 
      });

      return {
        id: response.id,
        amount: parseFloat(response.amount),
        currency: response.currency,
        status: response.status,
        reason: reason,
        createTime: response.created_at
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
      // التحقق من صحة التوقيع
      const isValid = await this.verifySignature(webhookData, signature);
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      const event = webhookData;
      let unifiedEvent = null;

      switch (event.event) {
        case 'session.created':
          unifiedEvent = {
            type: 'payment.created',
            paymentIntentId: event.data.id,
            status: UNIFIED_PAYMENT_STATUSES.PENDING,
            amount: parseFloat(event.data.amount),
            currency: event.data.currency,
            installmentPlan: event.data.configuration?.installments?.count
          };
          break;

        case 'session.completed':
          unifiedEvent = {
            type: 'payment.captured',
            paymentIntentId: event.data.id,
            status: UNIFIED_PAYMENT_STATUSES.CAPTURED,
            amount: parseFloat(event.data.amount),
            currency: event.data.currency,
            installmentPlan: event.data.configuration?.installments?.count
          };
          break;

        case 'session.cancelled':
          unifiedEvent = {
            type: 'payment.cancelled',
            paymentIntentId: event.data.id,
            status: UNIFIED_PAYMENT_STATUSES.CANCELLED
          };
          break;

        case 'session.rejected':
          unifiedEvent = {
            type: 'payment.failed',
            paymentIntentId: event.data.id,
            status: UNIFIED_PAYMENT_STATUSES.FAILED,
            error: event.data.rejection_reason
          };
          break;

        case 'payment.refunded':
          unifiedEvent = {
            type: 'payment.refunded',
            paymentIntentId: event.data.session_id,
            refundId: event.data.id,
            status: UNIFIED_PAYMENT_STATUSES.REFUNDED,
            amount: parseFloat(event.data.amount),
            currency: event.data.currency
          };
          break;

        default:
          unifiedEvent = {
            type: 'unknown',
            originalEvent: event
          };
      }

      this.logOperation('handle_webhook', { 
        eventType: event.event, 
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
      // في البيئة الحقيقية، سيتم التحقق من التوقيع باستخدام HMAC
      // محاكاة التحقق من التوقيع
      return signature && signature.startsWith('TABBY-');
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
      const response = await this.makeTabbyRequest('GET', `/v1/sessions/${paymentIntentId}`);
      
      return {
        id: response.id,
        status: this.mapPaymentStatus(response.status),
        amount: parseFloat(response.amount),
        currency: response.currency,
        installmentPlan: response.configuration?.installments?.count,
        monthlyPayment: parseFloat(response.amount) / (response.configuration?.installments?.count || 4),
        createTime: response.created_at,
        updateTime: response.updated_at
      };
    } catch (error) {
      this.logOperation('get_payment_status_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * الحصول على خطط الأقساط المتاحة
   */
  async getInstallmentPlans(amount, currency) {
    try {
      const response = await this.makeTabbyRequest('GET', `/v1/configuration?amount=${amount}&currency=${currency}`);
      
      return response.available_products?.installments?.plans || [
        { count: 3, min_amount: 100, max_amount: 5000 },
        { count: 4, min_amount: 100, max_amount: 5000 },
        { count: 6, min_amount: 200, max_amount: 5000 },
        { count: 12, min_amount: 500, max_amount: 5000 }
      ];
    } catch (error) {
      this.logOperation('get_installment_plans_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * إنشاء عميل
   */
  async createCustomer(customerData) {
    try {
      // Tabby لا يدعم إنشاء عملاء منفصلين
      return {
        id: customerData.email,
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
      // Tabby لا يدعم حفظ طرق دفع منفصلة
      return {
        id: 'tabby_installment',
        type: 'installment',
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
        id: 'tabby_installment',
        type: 'installment',
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

    if (!paymentData.currency) {
      errors.push('العملة مطلوبة');
    }

    if (!this.config.supportedCurrencies.includes(paymentData.currency)) {
      errors.push(`العملة ${paymentData.currency} غير مدعومة`);
    }

    if (!paymentData.metadata?.customerEmail) {
      errors.push('البريد الإلكتروني مطلوب');
    }

    if (!paymentData.metadata?.customerPhone) {
      errors.push('رقم الهاتف مطلوب');
    }

    return errors;
  }

  /**
   * تحويل حالة الدفع إلى الحالة الموحدة
   */
  mapPaymentStatus(tabbyStatus) {
    const statusMap = {
      'created': UNIFIED_PAYMENT_STATUSES.PENDING,
      'pending': UNIFIED_PAYMENT_STATUSES.PENDING,
      'approved': UNIFIED_PAYMENT_STATUSES.AUTHORIZED,
      'completed': UNIFIED_PAYMENT_STATUSES.CAPTURED,
      'cancelled': UNIFIED_PAYMENT_STATUSES.CANCELLED,
      'rejected': UNIFIED_PAYMENT_STATUSES.FAILED,
      'expired': UNIFIED_PAYMENT_STATUSES.EXPIRED
    };

    return statusMap[tabbyStatus] || UNIFIED_PAYMENT_STATUSES.PENDING;
  }

  /**
   * تحويل خطأ Tabby إلى خطأ موحد
   */
  mapError(tabbyError) {
    const errorMap = {
      'INVALID_REQUEST': 'طلب غير صحيح',
      'UNAUTHORIZED': 'غير مصرح',
      'FORBIDDEN': 'محظور',
      'NOT_FOUND': 'غير موجود',
      'VALIDATION_ERROR': 'خطأ في التحقق من البيانات',
      'INSUFFICIENT_FUNDS': 'رصيد غير كافي',
      'LIMIT_EXCEEDED': 'تم تجاوز الحد المسموح',
      'INTERNAL_SERVER_ERROR': 'خطأ في الخادم'
    };

    const errorCode = tabbyError.code || 'unknown_error';
    const message = errorMap[errorCode] || tabbyError.message || 'خطأ غير معروف';

    return {
      code: errorCode,
      message,
      provider: 'tabby',
      originalError: tabbyError
    };
  }

  /**
   * إجراء طلب إلى Tabby API
   */
  async makeTabbyRequest(method, endpoint, data = null) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const options = {
        method,
        headers
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.logOperation('tabby_request_error', { 
        method, 
        endpoint, 
        error: error.message 
      });
      throw error;
    }
  }
}










