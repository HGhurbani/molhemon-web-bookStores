/**
 * مدير المدفوعات الموحد
 * Unified Payment Manager
 */

import { StripeProvider } from './providers/StripeProvider.js';
import { PayPalProvider } from './providers/PayPalProvider.js';
import { TabbyProvider } from './providers/TabbyProvider.js';
import { CashOnDeliveryProvider } from './providers/CashOnDeliveryProvider.js';
import { UNIFIED_PAYMENT_STATUSES } from './providers/PaymentProvider.js';
import logger from '../logger.js';

export class PaymentManager {
  constructor() {
    this.providers = new Map();
    this.activeProvider = null;
    this.settings = null;
    this.isInitialized = false;
  }

  /**
   * تهيئة مدير المدفوعات
   */
  async initialize(settings) {
    try {
      this.settings = settings;
      
      // تهيئة مزودي المدفوعات
      await this.initializeProviders();
      
      // تحديد المزود النشط
      this.activeProvider = this.getActiveProvider();
      
      this.isInitialized = true;
      
      logger.info('Payment Manager initialized successfully');
      return { success: true };
    } catch (error) {
      logger.error('Payment Manager initialization failed:', error);
      throw error;
    }
  }

  /**
   * تهيئة مزودي المدفوعات
   */
  async initializeProviders() {
    const providerConfigs = {
      stripe: {
        publishableKey: this.settings?.stripe?.publishableKey,
        secretKey: this.settings?.stripe?.secretKey,
        webhookSecret: this.settings?.stripe?.webhookSecret,
        testMode: this.settings?.stripe?.testMode || false
      },
      paypal: {
        clientId: this.settings?.paypal?.clientId,
        clientSecret: this.settings?.paypal?.clientSecret,
        webhookId: this.settings?.paypal?.webhookId,
        testMode: this.settings?.paypal?.testMode || false
      },
      tabby: {
        apiKey: this.settings?.tabby?.apiKey,
        secretKey: this.settings?.tabby?.secretKey,
        webhookSecret: this.settings?.tabby?.webhookSecret,
        testMode: this.settings?.tabby?.testMode || false
      },
      cash_on_delivery: {
        maxAmount: this.settings?.cashOnDelivery?.maxAmount || 1000,
        codFee: this.settings?.cashOnDelivery?.codFee || 15,
        testMode: false
      }
    };

    // إنشاء مزودي المدفوعات
    if (providerConfigs.stripe.publishableKey && providerConfigs.stripe.secretKey) {
      this.providers.set('stripe', new StripeProvider(providerConfigs.stripe));
    }

    if (providerConfigs.paypal.clientId && providerConfigs.paypal.clientSecret) {
      this.providers.set('paypal', new PayPalProvider(providerConfigs.paypal));
    }

    if (providerConfigs.tabby.apiKey && providerConfigs.tabby.secretKey) {
      this.providers.set('tabby', new TabbyProvider(providerConfigs.tabby));
    }

    // الدفع عند الاستلام متاح دائماً
    this.providers.set('cash_on_delivery', new CashOnDeliveryProvider(providerConfigs.cash_on_delivery));

    // تهيئة جميع المزودين
    for (const [name, provider] of this.providers) {
      try {
        await provider.initialize();
        logger.info(`Provider ${name} initialized successfully`);
      } catch (error) {
        logger.error(`Provider ${name} initialization failed:`, error);
      }
    }
  }

  /**
   * الحصول على المزود النشط
   */
  getActiveProvider() {
    // يمكن تحديد المزود النشط حسب الإعدادات أو تلقائياً
    const priorityProviders = ['stripe', 'paypal', 'tabby', 'cash_on_delivery'];
    
    for (const providerName of priorityProviders) {
      const provider = this.providers.get(providerName);
      if (provider) {
        return provider;
      }
    }
    
    return null;
  }

  /**
   * الحصول على مزود محدد
   */
  getProvider(providerName) {
    return this.providers.get(providerName);
  }

  /**
   * الحصول على جميع المزودين المتاحين
   */
  getAvailableProviders() {
    const available = [];
    
    for (const [name, provider] of this.providers) {
      const info = provider.getProviderInfo();
      available.push({
        name,
        ...info,
        isActive: provider === this.activeProvider
      });
    }
    
    return available;
  }

  /**
   * اختبار اتصال مزود محدد
   */
  async testProviderConnection(providerName) {
    try {
      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      return await provider.testConnection();
    } catch (error) {
      logger.error(`Provider ${providerName} connection test failed:`, error);
      throw error;
    }
  }

  /**
   * إنشاء Payment Intent
   */
  async createPaymentIntent(paymentData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const { provider: requestedProvider, ...data } = paymentData;
      
      // تحديد المزود المناسب
      const provider = requestedProvider ? 
        this.providers.get(requestedProvider) : 
        this.selectBestProvider(data);

      if (!provider) {
        throw new Error('No suitable payment provider found');
      }

      // التحقق من صحة البيانات
      const validationErrors = provider.validatePaymentData(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      // إنشاء Payment Intent
      const result = await provider.createPaymentIntent(data);
      
      // إضافة معلومات المزود
      result.provider = provider.providerName;
      result.providerInfo = provider.getProviderInfo();

      return result;
    } catch (error) {
      logger.error('Payment Intent creation failed:', error);
      throw error;
    }
  }

  /**
   * اختيار أفضل مزود للدفع
   */
  selectBestProvider(paymentData) {
    const { amount, currency, country = 'SA' } = paymentData;
    
    // ترتيب المزودين حسب الأولوية
    const providerPriority = [
      { name: 'stripe', weight: 100 },
      { name: 'paypal', weight: 90 },
      { name: 'tabby', weight: 80 },
      { name: 'cash_on_delivery', weight: 70 }
    ];

    let bestProvider = null;
    let bestScore = 0;

    for (const { name, weight } of providerPriority) {
      const provider = this.providers.get(name);
      if (!provider) continue;

      const info = provider.getProviderInfo();
      
      // حساب نقاط المزود
      let score = weight;

      // التحقق من دعم العملة
      if (!info.supportedCurrencies.includes(currency)) {
        score -= 50;
      }

      // التحقق من دعم الدولة
      if (!info.supportedCountries.includes(country)) {
        score -= 30;
      }

      // التحقق من الحد الأقصى للمبلغ (للدفع عند الاستلام)
      if (name === 'cash_on_delivery' && amount > provider.maxAmount) {
        score -= 100;
      }

      // التحقق من الحد الأدنى للمبلغ (للأقساط)
      if (name === 'tabby' && amount < 100) {
        score -= 50;
      }

      if (score > bestScore) {
        bestScore = score;
        bestProvider = provider;
      }
    }

    return bestProvider;
  }

  /**
   * تأكيد الدفع
   */
  async confirmPayment(paymentIntentId, paymentMethodData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      // تحديد المزود من معرف Payment Intent
      const provider = this.getProviderFromPaymentIntent(paymentIntentId);
      if (!provider) {
        throw new Error('Payment provider not found for this intent');
      }

      const result = await provider.confirmPayment(paymentIntentId, paymentMethodData);
      
      // إضافة معلومات المزود
      result.provider = provider.providerName;

      return result;
    } catch (error) {
      logger.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  /**
   * إلغاء الدفع
   */
  async cancelPayment(paymentIntentId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.getProviderFromPaymentIntent(paymentIntentId);
      if (!provider) {
        throw new Error('Payment provider not found for this intent');
      }

      return await provider.cancelPayment(paymentIntentId);
    } catch (error) {
      logger.error('Payment cancellation failed:', error);
      throw error;
    }
  }

  /**
   * استرداد الدفع
   */
  async refundPayment(paymentIntentId, amount, reason) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.getProviderFromPaymentIntent(paymentIntentId);
      if (!provider) {
        throw new Error('Payment provider not found for this intent');
      }

      return await provider.refundPayment(paymentIntentId, amount, reason);
    } catch (error) {
      logger.error('Payment refund failed:', error);
      throw error;
    }
  }

  /**
   * معالجة Webhook
   */
  async handleWebhook(providerName, webhookData, signature) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      const result = await provider.handleWebhook(webhookData, signature);
      
      // إضافة معلومات المزود
      result.provider = providerName;

      return result;
    } catch (error) {
      logger.error('Webhook handling failed:', error);
      throw error;
    }
  }

  /**
   * الحصول على حالة الدفع
   */
  async getPaymentStatus(paymentIntentId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.getProviderFromPaymentIntent(paymentIntentId);
      if (!provider) {
        throw new Error('Payment provider not found for this intent');
      }

      return await provider.getPaymentStatus(paymentIntentId);
    } catch (error) {
      logger.error('Payment status retrieval failed:', error);
      throw error;
    }
  }

  /**
   * تحديد المزود من معرف Payment Intent
   */
  getProviderFromPaymentIntent(paymentIntentId) {
    if (paymentIntentId.startsWith('pi_')) {
      return this.providers.get('stripe');
    } else if (paymentIntentId.startsWith('PAY-')) {
      return this.providers.get('paypal');
    } else if (paymentIntentId.startsWith('tabby_')) {
      return this.providers.get('tabby');
    } else if (paymentIntentId.startsWith('cod_')) {
      return this.providers.get('cash_on_delivery');
    }
    
    // إذا لم نتمكن من تحديد المزود، نجرب جميع المزودين
    for (const provider of this.providers.values()) {
      try {
        // محاولة الحصول على حالة الدفع من كل مزود
        provider.getPaymentStatus(paymentIntentId);
        return provider;
      } catch (error) {
        // استمر للمزود التالي
        continue;
      }
    }
    
    return null;
  }

  /**
   * إنشاء عميل
   */
  async createCustomer(providerName, customerData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      return await provider.createCustomer(customerData);
    } catch (error) {
      logger.error('Customer creation failed:', error);
      throw error;
    }
  }

  /**
   * حفظ طريقة دفع للعميل
   */
  async savePaymentMethod(providerName, customerId, paymentMethodData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      return await provider.savePaymentMethod(customerId, paymentMethodData);
    } catch (error) {
      logger.error('Payment method saving failed:', error);
      throw error;
    }
  }

  /**
   * الحصول على طرق الدفع المحفوظة للعميل
   */
  async getCustomerPaymentMethods(providerName, customerId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      return await provider.getCustomerPaymentMethods(customerId);
    } catch (error) {
      logger.error('Customer payment methods retrieval failed:', error);
      throw error;
    }
  }

  /**
   * حذف طريقة دفع محفوظة
   */
  async deletePaymentMethod(providerName, customerId, paymentMethodId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Payment Manager not initialized');
      }

      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      return await provider.deletePaymentMethod(customerId, paymentMethodId);
    } catch (error) {
      logger.error('Payment method deletion failed:', error);
      throw error;
    }
  }

  /**
   * الحصول على طرق الدفع المتاحة للطلب
   */
  getAvailablePaymentMethods(orderData) {
    const { amount, currency, country = 'SA' } = orderData;
    const availableMethods = [];

    for (const [name, provider] of this.providers) {
      const info = provider.getProviderInfo();
      
      // التحقق من التوافق
      const isCurrencySupported = info.supportedCurrencies.includes(currency);
      const isCountrySupported = info.supportedCountries.includes(country);
      const isAmountValid = this.isAmountValidForProvider(name, amount);

      if (isCurrencySupported && isCountrySupported && isAmountValid) {
        availableMethods.push({
          provider: name,
          displayName: info.displayName,
          icon: this.getProviderIcon(name),
          fees: info.fees,
          processingTime: info.processingTime,
          supportedPaymentMethods: info.supportedPaymentMethods,
          additionalInfo: this.getProviderAdditionalInfo(name, amount)
        });
      }
    }

    return availableMethods;
  }

  /**
   * التحقق من صحة المبلغ للمزود
   */
  isAmountValidForProvider(providerName, amount) {
    switch (providerName) {
      case 'cash_on_delivery':
        const codProvider = this.providers.get('cash_on_delivery');
        return amount <= codProvider.maxAmount;
      case 'tabby':
        return amount >= 100; // الحد الأدنى للأقساط
      default:
        return true;
    }
  }

  /**
   * الحصول على أيقونة المزود
   */
  getProviderIcon(providerName) {
    const icons = {
      stripe: '💳',
      paypal: '🅿️',
      tabby: '🛒',
      cash_on_delivery: '💵'
    };
    return icons[providerName] || '💳';
  }

  /**
   * الحصول على معلومات إضافية للمزود
   */
  getProviderAdditionalInfo(providerName, amount) {
    switch (providerName) {
      case 'tabby':
        return {
          installmentPlans: [3, 4, 6, 12],
          monthlyPayments: [3, 4, 6, 12].map(months => ({
            months,
            amount: (amount / months).toFixed(2)
          }))
        };
      case 'cash_on_delivery':
        const codProvider = this.providers.get('cash_on_delivery');
        return {
          codFee: codProvider.codFee,
          totalAmount: amount + codProvider.codFee
        };
      default:
        return {};
    }
  }

  /**
   * تحديث الإعدادات
   */
  async updateSettings(newSettings) {
    try {
      this.settings = { ...this.settings, ...newSettings };
      
      // إعادة تهيئة المزودين
      await this.initializeProviders();
      
      // تحديث المزود النشط
      this.activeProvider = this.getActiveProvider();
      
      return { success: true };
    } catch (error) {
      logger.error('Settings update failed:', error);
      throw error;
    }
  }

  /**
   * الحصول على إحصائيات المدفوعات
   */
  async getPaymentStats() {
    try {
      const stats = {
        totalProviders: this.providers.size,
        activeProvider: this.activeProvider?.providerName,
        availableMethods: this.getAvailablePaymentMethods({
          amount: 100,
          currency: 'SAR',
          country: 'SA'
        }).length
      };

      return stats;
    } catch (error) {
      logger.error('Payment stats retrieval failed:', error);
      throw error;
    }
  }
}

// إنشاء نسخة واحدة من مدير المدفوعات
export const paymentManager = new PaymentManager();










