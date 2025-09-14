/**
 * مزود Stripe للمدفوعات
 * Stripe Payment Provider
 */

import { PaymentProvider, UNIFIED_PAYMENT_STATUSES } from './PaymentProvider.js';

export class StripeProvider extends PaymentProvider {
  constructor(config = {}) {
    super({
      ...config,
      providerName: 'stripe',
      displayName: 'Stripe',
      supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
      supportedCountries: ['SA', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'AE', 'KW', 'QA', 'BH', 'OM'],
      supportedPaymentMethods: ['card'],
      processingTime: '1-2 business days',
      fees: { percentage: 2.9, fixed: 0.3 }
    });

    this.publishableKey = config.publishableKey;
    this.secretKey = config.secretKey;
    this.webhookSecret = config.webhookSecret;
    this.stripe = null;
  }

  /**
   * تهيئة Stripe
   */
  async initialize() {
    try {
      const { default: Stripe } = await import('stripe');
      this.stripe = new Stripe(this.secretKey, { apiVersion: '2023-10-16' });
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
      await this.stripe.balance.retrieve();
      this.logOperation('test_connection', { success: true });
      return {
        success: true,
        message: 'تم الاتصال بـ Stripe بنجاح',
        provider: 'stripe',
        testMode: this.isTestMode
      };
    } catch (error) {
      this.logOperation('test_connection_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * إنشاء عملية دفع
   */
  async createPayment(paymentData) {
    try {
      const { amount, currency, metadata = {} } = paymentData;
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata,
        payment_method_types: ['card'],
      });

      this.logOperation('create_payment', {
        amount,
        currency,
        paymentIntentId: intent.id
      });

      return {
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency.toUpperCase(),
        status: this.mapPaymentStatus(intent.status),
        clientSecret: intent.client_secret,
        metadata: intent.metadata
      };
    } catch (error) {
      this.logOperation('create_payment_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * واجهة PaymentProvider
   */
  async createPaymentIntent(paymentData) {
    return this.createPayment(paymentData);
  }

  /**
   * تأكيد الدفع
   */
  async confirmPayment(paymentIntentId, paymentMethodData = {}) {
    try {
      const intent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodData.paymentMethodId,
      });

      this.logOperation('confirm_payment', {
        paymentIntentId,
        status: intent.status
      });

      return {
        id: intent.id,
        status: this.mapPaymentStatus(intent.status),
        clientSecret: intent.client_secret,
        metadata: intent.metadata
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
      const intent = await this.stripe.paymentIntents.cancel(paymentIntentId);
      this.logOperation('cancel_payment', { paymentIntentId });
      return {
        id: intent.id,
        status: this.mapPaymentStatus(intent.status)
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
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason
      });

      this.logOperation('refund_payment', {
        paymentIntentId,
        refundId: refund.id,
        amount: refund.amount / 100
      });

      return {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency.toUpperCase(),
        status: this.mapPaymentStatus(refund.status),
        reason: refund.reason
      };
    } catch (error) {
      this.logOperation('refund_payment_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * معالجة Webhook
   */
  async handleWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      this.logOperation('handle_webhook', { type: event.type });
      return event;
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
      this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
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
      const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      this.logOperation('get_payment_status', { paymentIntentId, status: intent.status });
      return this.mapPaymentStatus(intent.status);
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
      const customer = await this.stripe.customers.create(customerData);
      this.logOperation('create_customer', { customerId: customer.id });
      return customer;
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
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodData.paymentMethodId,
        { customer: customerId }
      );
      this.logOperation('save_payment_method', {
        customerId,
        paymentMethodId: paymentMethod.id
      });
      return paymentMethod;
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
      const methods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
      this.logOperation('get_payment_methods', { customerId });
      return methods.data;
    } catch (error) {
      this.logOperation('get_payment_methods_error', error);
      throw this.mapError(error);
    }
  }

  /**
   * حذف طريقة دفع محفوظة
   */
  async deletePaymentMethod(customerId, paymentMethodId) {
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId);
      this.logOperation('delete_payment_method', { customerId, paymentMethodId });
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
  mapPaymentStatus(stripeStatus) {
    const statusMap = {
      'requires_payment_method': UNIFIED_PAYMENT_STATUSES.PENDING,
      'requires_confirmation': UNIFIED_PAYMENT_STATUSES.PENDING,
      'requires_action': UNIFIED_PAYMENT_STATUSES.PENDING,
      'processing': UNIFIED_PAYMENT_STATUSES.PENDING,
      'requires_capture': UNIFIED_PAYMENT_STATUSES.AUTHORIZED,
      'canceled': UNIFIED_PAYMENT_STATUSES.CANCELLED,
      'succeeded': UNIFIED_PAYMENT_STATUSES.CAPTURED,
      'requires_refund': UNIFIED_PAYMENT_STATUSES.REFUNDED,
      'partial_refund': UNIFIED_PAYMENT_STATUSES.PARTIALLY_REFUNDED,
    };

    return statusMap[stripeStatus] || UNIFIED_PAYMENT_STATUSES.PENDING;
  }

  /**
   * تحويل خطأ Stripe إلى خطأ موحد
   */
  mapError(stripeError) {
    const errorMap = {
      'card_declined': 'تم رفض البطاقة',
      'expired_card': 'البطاقة منتهية الصلاحية',
      'incorrect_cvc': 'رمز الأمان غير صحيح',
      'processing_error': 'خطأ في معالجة الدفع',
      'rate_limit': 'تم تجاوز حد الطلبات'
    };

    const errorCode = stripeError?.code || 'unknown_error';
    const message = errorMap[errorCode] || stripeError.message || 'خطأ غير معروف';

    return {
      code: errorCode,
      message,
      provider: 'stripe',
      originalError: stripeError
    };
  }
}

