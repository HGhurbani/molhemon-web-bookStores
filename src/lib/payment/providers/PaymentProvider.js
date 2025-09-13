/**
 * واجهة موحدة لمزودي المدفوعات
 * Payment Provider Interface
 */

export class PaymentProvider {
  constructor(config = {}) {
    this.config = config;
    this.isTestMode = config.testMode || false;
    this.providerName = config.providerName || 'unknown';
  }

  /**
   * تهيئة المزود
   */
  async initialize() {
    throw new Error('initialize() method must be implemented');
  }

  /**
   * اختبار الاتصال
   */
  async testConnection() {
    throw new Error('testConnection() method must be implemented');
  }

  /**
   * إنشاء Payment Intent
   */
  async createPaymentIntent(paymentData) {
    throw new Error('createPaymentIntent() method must be implemented');
  }

  /**
   * تأكيد الدفع
   */
  async confirmPayment(paymentIntentId, paymentMethodData) {
    throw new Error('confirmPayment() method must be implemented');
  }

  /**
   * إلغاء الدفع
   */
  async cancelPayment(paymentIntentId) {
    throw new Error('cancelPayment() method must be implemented');
  }

  /**
   * استرداد الدفع
   */
  async refundPayment(paymentIntentId, amount, reason) {
    throw new Error('refundPayment() method must be implemented');
  }

  /**
   * معالجة Webhook
   */
  async handleWebhook(webhookData, signature) {
    throw new Error('handleWebhook() method must be implemented');
  }

  /**
   * التحقق من صحة التوقيع
   */
  async verifySignature(payload, signature) {
    throw new Error('verifySignature() method must be implemented');
  }

  /**
   * الحصول على حالة الدفع
   */
  async getPaymentStatus(paymentIntentId) {
    throw new Error('getPaymentStatus() method must be implemented');
  }

  /**
   * إنشاء عميل
   */
  async createCustomer(customerData) {
    throw new Error('createCustomer() method must be implemented');
  }

  /**
   * حفظ طريقة دفع للعميل
   */
  async savePaymentMethod(customerId, paymentMethodData) {
    throw new Error('savePaymentMethod() method must be implemented');
  }

  /**
   * الحصول على طرق الدفع المحفوظة للعميل
   */
  async getCustomerPaymentMethods(customerId) {
    throw new Error('getCustomerPaymentMethods() method must be implemented');
  }

  /**
   * حذف طريقة دفع محفوظة
   */
  async deletePaymentMethod(customerId, paymentMethodId) {
    throw new Error('deletePaymentMethod() method must be implemented');
  }

  /**
   * التحقق من صحة البيانات
   */
  validatePaymentData(paymentData) {
    throw new Error('validatePaymentData() method must be implemented');
  }

  /**
   * الحصول على معلومات المزود
   */
  getProviderInfo() {
    return {
      name: this.providerName,
      displayName: this.config.displayName || this.providerName,
      supportedCurrencies: this.config.supportedCurrencies || [],
      supportedCountries: this.config.supportedCountries || [],
      supportedPaymentMethods: this.config.supportedPaymentMethods || [],
      processingTime: this.config.processingTime || '1-3 business days',
      fees: this.config.fees || { percentage: 0, fixed: 0 },
      testMode: this.isTestMode
    };
  }

  /**
   * تحويل حالة الدفع إلى الحالة الموحدة
   */
  mapPaymentStatus(providerStatus) {
    throw new Error('mapPaymentStatus() method must be implemented');
  }

  /**
   * تحويل خطأ المزود إلى خطأ موحد
   */
  mapError(providerError) {
    throw new Error('mapError() method must be implemented');
  }

  /**
   * تشفير البيانات الحساسة
   */
  encryptSensitiveData(data) {
    // يمكن تنفيذ التشفير هنا
    return data;
  }

  /**
   * فك تشفير البيانات الحساسة
   */
  decryptSensitiveData(encryptedData) {
    // يمكن تنفيذ فك التشفير هنا
    return encryptedData;
  }

  /**
   * تسجيل العمليات
   */
  logOperation(operation, data) {
    console.log(`[${this.providerName}] ${operation}:`, data);
  }
}

// حالات الدفع الموحدة
export const UNIFIED_PAYMENT_STATUSES = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  EXPIRED: 'expired'
};

// أنواع المدفوعات
export const PAYMENT_TYPES = {
  ONE_TIME: 'one_time',
  RECURRING: 'recurring',
  INSTALLMENT: 'installment'
};

// أنواع الاسترداد
export const REFUND_TYPES = {
  FULL: 'full',
  PARTIAL: 'partial'
};

