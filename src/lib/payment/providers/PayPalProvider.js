/**
 * مزود PayPal للمدفوعات
 * PayPal Payment Provider
 */

import { PaymentProvider, UNIFIED_PAYMENT_STATUSES } from './PaymentProvider.js';

export class PayPalProvider extends PaymentProvider {
  constructor(config = {}) {
    super({
      ...config,
      providerName: 'paypal',
      displayName: 'PayPal',
      supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'US', 'GB', 'DE', 'FR'],
      supportedPaymentMethods: ['paypal'],
      processingTime: '1-2 business days',
      fees: { percentage: 3.49, fixed: 0.49 }
    });

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.webhookId = config.webhookId;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * تهيئة PayPal
   */
  async initialize() {
    try {
      await this.getAccessToken();
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
      await this.getAccessToken();
      
      this.logOperation('test_connection', { success: true });
      return {
        success: true,
        message: 'تم الاتصال بـ PayPal بنجاح',
        provider: 'paypal',
        testMode: this.isTestMode
      };
    } catch (error) {
      this.logOperation('test_connection_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * الحصول على Access Token
   */
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const baseUrl = this.isTestMode 
        ? 'https://api-m.sandbox.paypal.com' 
        : 'https://api-m.paypal.com';

      const auth = btoa(`${this.clientId}:${this.clientSecret}`);
      
      const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      this.logOperation('get_access_token_error', error);
      throw error;
    }
  }

  /**
   * إنشاء Payment Intent (Order في PayPal)
   */
  async createPaymentIntent(paymentData) {
    try {
      const { amount, currency, customerId, metadata = {} } = paymentData;

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          custom_id: metadata.orderId,
          description: metadata.description || 'Payment for order'
        }],
        application_context: {
          return_url: metadata.returnUrl || `${window.location.origin}/payment/success`,
          cancel_url: metadata.cancelUrl || `${window.location.origin}/payment/cancel`,
          brand_name: metadata.brandName || 'Darmolhimon',
          user_action: 'PAY_NOW'
        }
      };

      const response = await this.makePayPalRequest('POST', '/v2/checkout/orders', orderData);
      
      this.logOperation('create_payment_intent', { 
        amount, 
        currency, 
        orderId: response.id 
      });

      return {
        id: response.id,
        status: this.mapPaymentStatus(response.status),
        amount: parseFloat(response.purchase_units[0].amount.value),
        currency: response.purchase_units[0].amount.currency_code,
        created: response.create_time,
        metadata: {
          orderId: metadata.orderId,
          customerEmail: metadata.customerEmail
        },
        links: response.links
      };
    } catch (error) {
      this.logOperation('create_payment_intent_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * تأكيد الدفع (Capture في PayPal)
   */
  async confirmPayment(paymentIntentId, paymentMethodData = {}) {
    try {
      const response = await this.makePayPalRequest('POST', `/v2/checkout/orders/${paymentIntentId}/capture`);
      
      this.logOperation('confirm_payment', { 
        orderId: paymentIntentId, 
        status: response.status 
      });

      return {
        id: response.id,
        status: this.mapPaymentStatus(response.status),
        amount: parseFloat(response.purchase_units[0].payments.captures[0].amount.value),
        currency: response.purchase_units[0].payments.captures[0].amount.currency_code,
        captureId: response.purchase_units[0].payments.captures[0].id,
        createTime: response.create_time,
        updateTime: response.update_time
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
      const response = await this.makePayPalRequest('POST', `/v2/checkout/orders/${paymentIntentId}/cancel`);
      
      this.logOperation('cancel_payment', { 
        orderId: paymentIntentId 
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
      // في PayPal، نحتاج إلى capture ID للاسترداد
      const order = await this.getPaymentStatus(paymentIntentId);
      const captureId = order.captureId;

      if (!captureId) {
        throw new Error('No capture found for refund');
      }

      const refundData = {
        amount: {
          value: amount.toString(),
          currency_code: order.currency
        },
        note_to_payer: reason || 'Refund requested'
      };

      const response = await this.makePayPalRequest('POST', `/v2/payments/captures/${captureId}/refund`, refundData);
      
      this.logOperation('refund_payment', { 
        orderId: paymentIntentId, 
        captureId, 
        amount 
      });

      return {
        id: response.id,
        amount: parseFloat(response.amount.value),
        currency: response.amount.currency_code,
        status: response.status,
        reason: reason,
        createTime: response.create_time
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

      switch (event.event_type) {
        case 'CHECKOUT.ORDER.APPROVED':
          unifiedEvent = {
            type: 'payment.authorized',
            paymentIntentId: event.resource.id,
            status: UNIFIED_PAYMENT_STATUSES.AUTHORIZED,
            amount: parseFloat(event.resource.amount.value),
            currency: event.resource.amount.currency_code,
            metadata: event.resource.custom_id
          };
          break;

        case 'PAYMENT.CAPTURE.COMPLETED':
          unifiedEvent = {
            type: 'payment.captured',
            paymentIntentId: event.resource.supplementary_data.related_ids.order_id,
            captureId: event.resource.id,
            status: UNIFIED_PAYMENT_STATUSES.CAPTURED,
            amount: parseFloat(event.resource.amount.value),
            currency: event.resource.amount.currency_code
          };
          break;

        case 'PAYMENT.CAPTURE.DENIED':
          unifiedEvent = {
            type: 'payment.failed',
            paymentIntentId: event.resource.supplementary_data.related_ids.order_id,
            status: UNIFIED_PAYMENT_STATUSES.FAILED,
            error: event.resource.status_details.reason
          };
          break;

        case 'PAYMENT.CAPTURE.REFUNDED':
          unifiedEvent = {
            type: 'payment.refunded',
            paymentIntentId: event.resource.supplementary_data.related_ids.order_id,
            refundId: event.resource.id,
            status: UNIFIED_PAYMENT_STATUSES.REFUNDED,
            amount: parseFloat(event.resource.amount.value),
            currency: event.resource.amount.currency_code
          };
          break;

        default:
          unifiedEvent = {
            type: 'unknown',
            originalEvent: event
          };
      }

      this.logOperation('handle_webhook', { 
        eventType: event.event_type, 
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
      // في البيئة الحقيقية، سيتم التحقق من التوقيع باستخدام PayPal SDK
      // محاكاة التحقق من التوقيع
      return signature && signature.startsWith('PAYPAL-');
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
      const response = await this.makePayPalRequest('GET', `/v2/checkout/orders/${paymentIntentId}`);
      
      return {
        id: response.id,
        status: this.mapPaymentStatus(response.status),
        amount: parseFloat(response.purchase_units[0].amount.value),
        currency: response.purchase_units[0].amount.currency_code,
        createTime: response.create_time,
        updateTime: response.update_time,
        captureId: response.purchase_units[0].payments?.captures?.[0]?.id
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
      // PayPal لا يدعم إنشاء عملاء منفصلين مثل Stripe
      // نعيد معرف العميل كما هو
      return {
        id: customerData.email, // نستخدم البريد الإلكتروني كمعرف
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
      // PayPal لا يدعم حفظ طرق دفع منفصلة
      // نعيد معرف PayPal كما هو
      return {
        id: 'paypal',
        type: 'paypal',
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
      // PayPal لا يدعم طرق دفع متعددة
      return [{
        id: 'paypal',
        type: 'paypal',
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
      // PayPal لا يدعم حذف طرق دفع منفصلة
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

    return errors;
  }

  /**
   * تحويل حالة الدفع إلى الحالة الموحدة
   */
  mapPaymentStatus(paypalStatus) {
    const statusMap = {
      'CREATED': UNIFIED_PAYMENT_STATUSES.PENDING,
      'SAVED': UNIFIED_PAYMENT_STATUSES.PENDING,
      'APPROVED': UNIFIED_PAYMENT_STATUSES.AUTHORIZED,
      'VOIDED': UNIFIED_PAYMENT_STATUSES.CANCELLED,
      'COMPLETED': UNIFIED_PAYMENT_STATUSES.CAPTURED,
      'PAYER_ACTION_REQUIRED': UNIFIED_PAYMENT_STATUSES.PENDING
    };

    return statusMap[paypalStatus] || UNIFIED_PAYMENT_STATUSES.PENDING;
  }

  /**
   * تحويل خطأ PayPal إلى خطأ موحد
   */
  mapError(paypalError) {
    const errorMap = {
      'INVALID_REQUEST': 'طلب غير صحيح',
      'UNAUTHORIZED': 'غير مصرح',
      'FORBIDDEN': 'محظور',
      'NOT_FOUND': 'غير موجود',
      'METHOD_NOT_ALLOWED': 'طريقة غير مسموحة',
      'UNSUPPORTED_MEDIA_TYPE': 'نوع وسائط غير مدعوم',
      'INTERNAL_SERVER_ERROR': 'خطأ في الخادم',
      'SERVICE_UNAVAILABLE': 'الخدمة غير متاحة'
    };

    const errorCode = paypalError.error || 'unknown_error';
    const message = errorMap[errorCode] || paypalError.message || 'خطأ غير معروف';

    return {
      code: errorCode,
      message,
      provider: 'paypal',
      originalError: paypalError
    };
  }

  /**
   * إجراء طلب إلى PayPal API
   */
  async makePayPalRequest(method, endpoint, data = null) {
    try {
      const accessToken = await this.getAccessToken();
      const baseUrl = this.isTestMode 
        ? 'https://api-m.sandbox.paypal.com' 
        : 'https://api-m.paypal.com';

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const options = {
        method,
        headers
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.logOperation('paypal_request_error', { 
        method, 
        endpoint, 
        error: error.message 
      });
      throw error;
    }
  }
}










