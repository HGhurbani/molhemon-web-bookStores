/**
 * واجهة API الجديدة للمدفوعات الموحدة - نسخة مبسطة مع الربط التلقائي
 * Unified Payment API - Simplified Version with Auto Connect
 */

class UnifiedPaymentAPI {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    this.isInitialized = false;
    this.providers = [];
    this.stats = {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      successRate: 0
    };
  }

  /**
   * تهيئة API المدفوعات
   */
  async initialize() {
    try {
      // تهيئة مزودي الدفع الافتراضيين
      this.providers = [
        {
          name: 'stripe',
          displayName: 'Stripe',
          description: 'بوابة دفع عالمية تدعم البطاقات والمدفوعات الرقمية',
          icon: '💳',
          enabled: true,
          testMode: true,
          connected: false,
          priority: 1,
          supportedCountries: ['SA', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'],
          supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          supportedMethods: ['card', 'apple_pay', 'google_pay'],
          fees: {
            percentage: 2.9,
            fixed: 0.30,
            currency: 'USD'
          },
          limits: {
            minAmount: 0.50,
            maxAmount: 999999.99,
            currency: 'USD'
          },
          features: {
            threeDS: true,
            recurring: true,
            refunds: true,
            partialRefunds: true,
            webhooks: true,
            customerManagement: true,
            paymentMethods: true
          },
          settings: {
            publishableKey: '',
            secretKey: '',
            webhookSecret: ''
          }
        },
        {
          name: 'paypal',
          displayName: 'PayPal',
          description: 'بوابة دفع عالمية تدعم الحسابات والبطاقات',
          icon: '🅿️',
          enabled: true,
          testMode: true,
          connected: false,
          priority: 2,
          supportedCountries: ['SA', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'],
          supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          supportedMethods: ['paypal', 'card'],
          fees: {
            percentage: 3.4,
            fixed: 0.35,
            currency: 'USD'
          },
          limits: {
            minAmount: 1.00,
            maxAmount: 10000.00,
            currency: 'USD'
          },
          features: {
            threeDS: false,
            recurring: true,
            refunds: true,
            partialRefunds: true,
            webhooks: true,
            customerManagement: false,
            paymentMethods: false
          },
          settings: {
            clientId: '',
            clientSecret: '',
            webhookId: ''
          }
        },
        {
          name: 'tabby',
          displayName: 'Tabby',
          description: 'خدمة الدفع بالتقسيط في الإمارات والسعودية',
          icon: '📅',
          enabled: true,
          testMode: true,
          connected: false,
          priority: 3,
          supportedCountries: ['SA', 'AE'],
          supportedCurrencies: ['SAR', 'AED'],
          supportedMethods: ['installments'],
          fees: {
            percentage: 0,
            fixed: 0,
            currency: 'SAR'
          },
          limits: {
            minAmount: 50.00,
            maxAmount: 50000.00,
            currency: 'SAR'
          },
          features: {
            threeDS: false,
            recurring: false,
            refunds: true,
            partialRefunds: true,
            webhooks: true,
            customerManagement: false,
            paymentMethods: false,
            installments: true
          },
          settings: {
            apiKey: '',
            secretKey: '',
            webhookSecret: ''
          }
        },
        {
          name: 'cashOnDelivery',
          displayName: 'الدفع عند الاستلام',
          description: 'الدفع نقداً عند استلام الطلب',
          icon: '💵',
          enabled: true,
          testMode: false,
          connected: true,
          priority: 100,
          supportedCountries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'EG'],
          supportedCurrencies: ['SAR', 'AED', 'KWD', 'BHD', 'OMR', 'QAR', 'EGP'],
          supportedMethods: ['cash'],
          fees: {
            percentage: 0,
            fixed: 15.00,
            currency: 'SAR'
          },
          limits: {
            minAmount: 0,
            maxAmount: 5000.00,
            currency: 'SAR'
          },
          features: {
            threeDS: false,
            recurring: false,
            refunds: false,
            partialRefunds: false,
            webhooks: false,
            customerManagement: false,
            paymentMethods: false
          },
          settings: {
            maxAmount: 5000.00,
            codFee: 15.00,
            codFeeCurrency: 'SAR',
            requireId: true,
            deliveryInstructions: 'يرجى إحضار هوية شخصية عند الاستلام'
          }
        }
      ];

      // قراءة إعدادات المتجر وتحديث حالة المزودين
      try {
        // محاولة قراءة إعدادات المتجر من localStorage أولاً
        const savedSettings = localStorage.getItem('siteSettings');
        if (savedSettings) {
          const storeSettings = JSON.parse(savedSettings);
          if (storeSettings.paymentGateways) {
            // تحديث حالة المزودين بناءً على إعدادات المتجر
            this.providers.forEach(provider => {
              const gatewaySettings = storeSettings.paymentGateways[provider.name];
              if (gatewaySettings) {
                provider.enabled = gatewaySettings.enabled;
                provider.testMode = gatewaySettings.testMode;
                // تحديث الإعدادات الأخرى حسب الحاجة
                if (gatewaySettings.config) {
                  provider.settings = {
                    ...provider.settings,
                    ...gatewaySettings.config
                  };
                }
              } else if (provider.name === 'cashOnDelivery') {
                // طريقة الدفع عند الاستلام مفعلة افتراضياً
                provider.enabled = true;
              }
            });
          }
          
          // قراءة إعدادات المدفوعات من النظام الموحد إذا كانت موجودة
          if (storeSettings.payments && storeSettings.payments.providers) {
            Object.entries(storeSettings.payments.providers).forEach(([providerName, providerData]) => {
              const provider = this.providers.find(p => p.name === providerName);
              if (provider) {
                provider.enabled = providerData.enabled;
                provider.testMode = providerData.testMode;
                if (providerData.settings) {
                  provider.settings = {
                    ...provider.settings,
                    ...providerData.settings
                  };
                }
              }
            });
          }
        }
      } catch (error) {
        console.log('Could not load store settings, using defaults');
      }

      this.isInitialized = true;
      console.log('Unified Payment API initialized successfully');
      console.log('Total providers initialized:', this.providers.length);
      console.log('Cash on Delivery enabled:', this.providers.find(p => p.name === 'cashOnDelivery')?.enabled);
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Unified Payment API:', error);
      throw error;
    }
  }

  /**
   * مزامنة إعدادات المزودين مع إعدادات لوحة التحكم
   */
  async syncWithDashboardSettings(dashboardProviders) {
    try {
      if (dashboardProviders && Array.isArray(dashboardProviders)) {
        this.providers.forEach(provider => {
          const dashboardProvider = dashboardProviders.find(dp => dp.name === provider.name);
          if (dashboardProvider) {
            provider.enabled = dashboardProvider.enabled;
            provider.testMode = dashboardProvider.testMode;
            provider.connected = dashboardProvider.connected;
            if (dashboardProvider.settings) {
              provider.settings = { ...provider.settings, ...dashboardProvider.settings };
            }
          }
        });
        console.log('Synced providers with dashboard settings');
      }
    } catch (error) {
      console.error('Failed to sync with dashboard settings:', error);
    }
  }

  /**
   * الحصول على مزودي المدفوعات
   */
  async getPaymentProviders() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      return {
        success: true,
        providers: this.providers
      };

    } catch (error) {
      console.error('Failed to get payment providers:', error);
      return {
        success: false,
        providers: [],
        error: error.message
      };
    }
  }

  /**
   * الحصول على إحصائيات المدفوعات
   */
  async getPaymentStats(customerId = null) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // إحصائيات تجريبية
      const stats = {
        total: 25,
        completed: 20,
        pending: 3,
        failed: 2,
        successRate: 80.0
      };
      
      return {
        success: true,
        stats: stats
      };

    } catch (error) {
      console.error('Failed to get payment stats:', error);
      return {
        success: false,
        stats: this.stats,
        error: error.message
      };
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

      // محاكاة اختبار الاتصال
      const provider = this.providers.find(p => p.name === providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1000));

      // محاكاة نجاح الاختبار إذا كان المزود مفعل
      const success = provider.enabled;
      
      // حفظ حالة الاتصال في localStorage
      if (success) {
        const currentSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        if (!currentSettings.payments) {
          currentSettings.payments = {};
        }
        if (!currentSettings.payments.providers) {
          currentSettings.payments.providers = {};
        }
        if (!currentSettings.payments.providers[providerName]) {
          currentSettings.payments.providers[providerName] = {};
        }
        currentSettings.payments.providers[providerName].connected = true;
        currentSettings.payments.providers[providerName].enabled = provider.enabled;
        currentSettings.payments.providers[providerName].testMode = provider.testMode;
        currentSettings.payments.providers[providerName].settings = provider.settings;
        
        localStorage.setItem('siteSettings', JSON.stringify(currentSettings));
        console.log(`Provider ${providerName} connection status saved to localStorage`);
      }
      
      return {
        success: success,
        message: success ? 'Connection successful' : 'Connection failed'
      };

    } catch (error) {
      console.error(`Failed to test provider connection: ${providerName}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * تحديث إعدادات المدفوعات
   */
  async updatePaymentSettings(settings) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // تحديث إعدادات المزودين
      Object.keys(settings).forEach(providerName => {
        const provider = this.providers.find(p => p.name === providerName);
        if (provider) {
          Object.assign(provider, settings[providerName]);
        }
      });

      // حفظ الإعدادات في localStorage
      const currentSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
      currentSettings.payments = {
        ...currentSettings.payments,
        providers: settings
      };
      localStorage.setItem('siteSettings', JSON.stringify(currentSettings));

      // حفظ الإعدادات في Firebase أيضاً
      try {
        const firebaseApi = await import('../firebaseApi.js');
        const currentFirebaseSettings = await firebaseApi.default.getSettings();
        const updatedFirebaseSettings = {
          ...currentFirebaseSettings,
          payments: {
            ...currentFirebaseSettings.payments,
            providers: settings
          }
        };
        await firebaseApi.default.updateSettings(updatedFirebaseSettings);
        console.log('Payment settings saved to Firebase successfully');
      } catch (firebaseError) {
        console.warn('Could not save to Firebase, but settings are saved locally:', firebaseError);
      }

      return { success: true };

    } catch (error) {
      console.error('Failed to update payment settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * الحصول على روابط الربط التلقائي
   */
  async getAutoConnectLinks(providerName) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const provider = this.providers.find(p => p.name === providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      // روابط الربط التلقائي لكل مزود
      const autoConnectLinks = {
        stripe: {
          dashboard: 'https://dashboard.stripe.com/register',
          apiKeys: 'https://dashboard.stripe.com/apikeys',
          webhooks: 'https://dashboard.stripe.com/webhooks',
          testCards: 'https://stripe.com/docs/testing#cards',
          documentation: 'https://stripe.com/docs',
          connectText: 'ربط حساب Stripe',
          description: 'احصل على مفاتيح API من لوحة تحكم Stripe'
        },
        paypal: {
          dashboard: 'https://developer.paypal.com/dashboard/',
          apiKeys: 'https://developer.paypal.com/dashboard/applications/sandbox',
          webhooks: 'https://developer.paypal.com/dashboard/webhooks',
          testAccounts: 'https://developer.paypal.com/docs/classic/lifecycle/sb-accounts/',
          documentation: 'https://developer.paypal.com/docs',
          connectText: 'ربط حساب PayPal',
          description: 'احصل على Client ID و Secret من لوحة تحكم PayPal'
        },
        tabby: {
          dashboard: 'https://tabby.ai/merchant/',
          apiKeys: 'https://tabby.ai/merchant/api-keys',
          webhooks: 'https://tabby.ai/merchant/webhooks',
          testCards: 'https://docs.tabby.ai/docs/testing',
          documentation: 'https://docs.tabby.ai',
          connectText: 'ربط حساب Tabby',
          description: 'احصل على API Key من لوحة تحكم Tabby'
        },
        cashOnDelivery: {
          dashboard: null,
          apiKeys: null,
          webhooks: null,
          testCards: null,
          documentation: null,
          connectText: 'تفعيل الدفع عند الاستلام',
          description: 'لا يحتاج إلى ربط - يعمل تلقائياً'
        }
      };

      return {
        success: true,
        links: autoConnectLinks[providerName] || {},
        provider: provider
      };

    } catch (error) {
      console.error('Failed to get auto connect links:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * فتح رابط الربط التلقائي
   */
  async openAutoConnectLink(providerName, linkType = 'dashboard') {
    try {
      const result = await this.getAutoConnectLinks(providerName);
      if (!result.success) {
        throw new Error(result.error);
      }

      const links = result.links;
      const url = links[linkType];

      if (!url) {
        throw new Error(`Link type ${linkType} not available for ${providerName}`);
      }

      // فتح الرابط في نافذة جديدة
      window.open(url, '_blank', 'noopener,noreferrer');

      return {
        success: true,
        message: `تم فتح ${linkType} لـ ${providerName}`,
        url: url
      };

    } catch (error) {
      console.error('Failed to open auto connect link:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * الحصول على تعليمات الربط
   */
  async getConnectionInstructions(providerName) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const instructions = {
        stripe: {
          title: 'ربط حساب Stripe',
          steps: [
            '1. اذهب إلى لوحة تحكم Stripe',
            '2. سجل حساب جديد أو سجل دخول',
            '3. اذهب إلى قسم API Keys',
            '4. انسخ Publishable Key و Secret Key',
            '5. اذهب إلى قسم Webhooks وأنشئ webhook جديد',
            '6. انسخ Webhook Secret',
            '7. أدخل المفاتيح في النموذج أدناه'
          ],
          tips: [
            'استخدم Test Keys للاختبار أولاً',
            'تأكد من تفعيل Webhook للدفع',
            'احتفظ بالمفاتيح في مكان آمن'
          ],
          requiredFields: ['publishableKey', 'secretKey', 'webhookSecret']
        },
        paypal: {
          title: 'ربط حساب PayPal',
          steps: [
            '1. اذهب إلى لوحة تحكم PayPal Developer',
            '2. سجل حساب جديد أو سجل دخول',
            '3. اذهب إلى قسم My Apps & Credentials',
            '4. أنشئ تطبيق جديد أو اختر موجود',
            '5. انسخ Client ID و Client Secret',
            '6. اذهب إلى قسم Webhooks وأنشئ webhook',
            '7. انسخ Webhook ID',
            '8. أدخل البيانات في النموذج أدناه'
          ],
          tips: [
            'استخدم Sandbox للاختبار أولاً',
            'تأكد من تفعيل Webhook للدفع',
            'احتفظ بالمفاتيح في مكان آمن'
          ],
          requiredFields: ['clientId', 'clientSecret', 'webhookId']
        },
        tabby: {
          title: 'ربط حساب Tabby',
          steps: [
            '1. اذهب إلى لوحة تحكم Tabby',
            '2. سجل حساب جديد أو سجل دخول',
            '3. اذهب إلى قسم API Keys',
            '4. انسخ API Key و Secret Key',
            '5. اذهب إلى قسم Webhooks وأنشئ webhook',
            '6. انسخ Webhook Secret',
            '7. أدخل المفاتيح في النموذج أدناه'
          ],
          tips: [
            'تأكد من تفعيل Webhook للدفع',
            'احتفظ بالمفاتيح في مكان آمن',
            'اختبر الدفع بالتقسيط أولاً'
          ],
          requiredFields: ['apiKey', 'secretKey', 'webhookSecret']
        },
        cashOnDelivery: {
          title: 'تفعيل الدفع عند الاستلام',
          steps: [
            '1. الدفع عند الاستلام مفعل تلقائياً',
            '2. يمكنك تعديل الحد الأقصى للمبلغ',
            '3. يمكنك تعديل رسوم الدفع عند الاستلام',
            '4. يمكنك تفعيل/تعطيل حسب الحاجة'
          ],
          tips: [
            'مناسب للطلبات المحلية',
            'لا يحتاج إلى ربط خارجي',
            'آمن ومضمون'
          ],
          requiredFields: ['maxAmount', 'codFee']
        }
      };

      return {
        success: true,
        instructions: instructions[providerName] || {}
      };

    } catch (error) {
      console.error('Failed to get connection instructions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * التحقق من صحة المفاتيح
   */
  async validateProviderKeys(providerName, keys) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const provider = this.providers.find(p => p.name === providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      const validationRules = {
        stripe: {
          publishableKey: {
            required: true,
            pattern: /^pk_(test|live)_[a-zA-Z0-9]{24,}$/,
            message: 'Publishable Key يجب أن يبدأ بـ pk_test_ أو pk_live_'
          },
          secretKey: {
            required: true,
            pattern: /^sk_(test|live)_[a-zA-Z0-9]{24,}$/,
            message: 'Secret Key يجب أن يبدأ بـ sk_test_ أو sk_live_'
          },
          webhookSecret: {
            required: false,
            pattern: /^whsec_[a-zA-Z0-9]{32,}$/,
            message: 'Webhook Secret يجب أن يبدأ بـ whsec_'
          }
        },
        paypal: {
          clientId: {
            required: true,
            pattern: /^[a-zA-Z0-9_-]{80}$/,
            message: 'Client ID يجب أن يكون 80 حرف'
          },
          clientSecret: {
            required: true,
            pattern: /^[a-zA-Z0-9_-]{80}$/,
            message: 'Client Secret يجب أن يكون 80 حرف'
          },
          webhookId: {
            required: true,
            pattern: /^[a-zA-Z0-9_-]{20}$/,
            message: 'Webhook ID يجب أن يكون 20 حرف'
          }
        },
        tabby: {
          apiKey: {
            required: true,
            pattern: /^[a-zA-Z0-9]{32}$/,
            message: 'API Key يجب أن يكون 32 حرف'
          },
          secretKey: {
            required: true,
            pattern: /^[a-zA-Z0-9]{32}$/,
            message: 'Secret Key يجب أن يكون 32 حرف'
          },
          webhookSecret: {
            required: true,
            pattern: /^[a-zA-Z0-9]{32}$/,
            message: 'Webhook Secret يجب أن يكون 32 حرف'
          }
        }
      };

      const rules = validationRules[providerName];
      if (!rules) {
        return { success: true, valid: true };
      }

      const errors = [];
      Object.keys(rules).forEach(key => {
        const rule = rules[key];
        const value = keys[key];

        if (rule.required && !value) {
          errors.push(`${key} مطلوب`);
        } else if (value && rule.pattern && !rule.pattern.test(value)) {
          errors.push(rule.message);
        }
      });

      return {
        success: true,
        valid: errors.length === 0,
        errors: errors
      };

    } catch (error) {
      console.error('Failed to validate provider keys:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * إنشاء Payment Intent
   */
  async createPaymentIntent(paymentData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // التحقق من صحة البيانات
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

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // محاكاة إنشاء Payment Intent مع دعم وضع الاختبار
      const isTestMode = paymentData.testMode || false;
      const paymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${isTestMode ? '_test' : ''}`,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.provider === 'cashOnDelivery' || paymentData.provider === 'cash_on_delivery' || paymentData.provider === 'manual' 
          ? 'requires_capture' 
          : 'requires_payment_method',
        provider: paymentData.provider || 'stripe',
        testMode: isTestMode,
        created: new Date().toISOString()
      };

      return {
        success: true,
        paymentIntent: paymentIntent,
        payment: {
          id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...paymentData,
          paymentIntentId: paymentIntent.id,
          status: 'pending'
        }
      };

    } catch (error) {
      console.error('Failed to create payment intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * تأكيد الدفع
   */
  async confirmPayment(paymentId, paymentMethodData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // محاكاة تأكيد الدفع مع دعم وضع الاختبار
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        result: {
          id: paymentId,
          status: 'succeeded',
          amount: 100.00,
          currency: 'SAR',
          testMode: paymentMethodData?.testMode || false
        }
      };

    } catch (error) {
      console.error('Failed to confirm payment:', error);
      return {
        success: false,
        error: error.message
      };
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

      // محاكاة استرداد الدفع
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'تم استرداد الدفع بنجاح',
        refund: {
          id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: amount,
          reason: reason,
          status: 'succeeded'
        }
      };

    } catch (error) {
      console.error('Failed to refund payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * الحصول على دفع بواسطة المعرف
   */
  async getPaymentById(paymentId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // محاكاة الحصول على الدفع
      const payment = {
        id: paymentId,
        amount: 100.00,
        currency: 'SAR',
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        payment: payment
      };

    } catch (error) {
      console.error('Failed to get payment:', error);
      return {
        success: false,
        error: error.message
      };
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

      // تصفية المزودين حسب البيانات المطلوبة
      console.log('Available providers before filtering:', this.providers.map(p => ({ name: p.name, enabled: p.enabled })));
      console.log('Order data:', orderData);
      
      const availableMethods = this.providers
        .filter(provider => {
          console.log(`Provider ${provider.name}: enabled=${provider.enabled}, testMode=${provider.testMode}, connected=${provider.connected}`);
          // السماح بالعرض إذا كان مفعل و (مربوط أو في وضع الاختبار)
          return provider.enabled && (provider.connected || provider.testMode);
        })
        .filter(provider => {
          const currencySupported = provider.supportedCurrencies.includes(orderData.currency);
          const countrySupported = provider.supportedCountries.includes(orderData.country);
          console.log(`Provider ${provider.name}: currency=${currencySupported}, country=${countrySupported}`);
          return currencySupported && countrySupported;
        })
        .map(provider => ({
          provider: provider.name,
          displayName: provider.displayName,
          icon: provider.icon,
          description: provider.description,
          fees: provider.fees,
          features: provider.features,
          testMode: provider.testMode,
          connected: provider.connected
        }));
      
      console.log('Final available methods:', availableMethods);

      // إذا لم توجد طرق دفع متاحة، أضف الدفع عند الاستلام كخيار افتراضي
      let finalMethods = availableMethods;
      if (finalMethods.length === 0) {
        const codProvider = this.providers.find(p => p.name === 'cashOnDelivery');
        if (codProvider && codProvider.enabled) {
          finalMethods = [{
            provider: codProvider.name,
            displayName: codProvider.displayName,
            icon: codProvider.icon,
            description: codProvider.description,
            fees: codProvider.fees,
            features: codProvider.features,
            testMode: codProvider.testMode,
            connected: codProvider.connected
          }];
          console.log('Added Cash on Delivery as fallback option');
        }
      }
      
      return {
        success: true,
        methods: finalMethods
      };

    } catch (error) {
      console.error('Failed to get available payment methods:', error);
      return {
        success: false,
        methods: [],
        error: error.message
      };
    }
  }

  /**
   * الحصول على معلومات مزود محدد
   */
  async getProviderInfo(providerName) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const provider = this.providers.find(p => p.name === providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      return {
        success: true,
        provider: provider
      };

    } catch (error) {
      console.error('Failed to get provider info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * إلغاء الدفع
   */
  async cancelPayment(paymentId, reason = '') {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // محاكاة إلغاء الدفع
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        result: {
          id: paymentId,
          status: 'cancelled',
          reason: reason
        }
      };

    } catch (error) {
      console.error('Failed to cancel payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * الحصول على سجل العمليات
   */
  async getPaymentLogs(paymentId, limit = 10) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // محاكاة سجل العمليات
      const logs = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          action: 'payment_created',
          status: 'pending',
          message: 'تم إنشاء عملية الدفع'
        },
        {
          id: '2',
          timestamp: new Date().toISOString(),
          action: 'payment_updated',
          status: 'completed',
          message: 'تم تحديث حالة الدفع'
        }
      ];

      return {
        success: true,
        logs: logs.slice(0, limit)
      };

    } catch (error) {
      console.error('Failed to get payment logs:', error);
      return {
        success: false,
        logs: [],
        error: error.message
      };
    }
  }
}

// تصدير نسخة واحدة من API
export default new UnifiedPaymentAPI();
