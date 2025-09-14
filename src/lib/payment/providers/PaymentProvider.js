/**
 * واجهة موحدة لمزودي المدفوعات
 * Payment Provider Interface
 */

import crypto from 'crypto';
import logger from '../../logger.js';

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
    const keyHex = this.config.encryptionKey || process.env.PAYMENT_ENCRYPTION_KEY;
    if (!keyHex) {
      throw new Error('Encryption key not provided');
    }

    const key = Buffer.from(keyHex, 'hex');
    if (key.length !== 32) {
      throw new Error('Encryption key must be 32 bytes in hex');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
  }

  /**
   * فك تشفير البيانات الحساسة
   */
  decryptSensitiveData(encryptedData) {
    const keyHex = this.config.encryptionKey || process.env.PAYMENT_ENCRYPTION_KEY;
    if (!keyHex) {
      throw new Error('Encryption key not provided');
    }

    const key = Buffer.from(keyHex, 'hex');
    const [ivBase64, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }

  /**
   * تسجيل العمليات
   */
  logOperation(operation, data) {
    logger.debug(`[${this.providerName}] ${operation}:`, data);
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

