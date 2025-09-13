/**
 * تكوين المدفوعات
 * Payment Configuration
 */

export const PAYMENT_CONFIG = {
  // الإعدادات العامة
  general: {
    defaultCurrency: 'SAR',
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    autoCapture: true,
    captureDelay: 0, // 0 = فوري، > 0 = مؤجل بالدقائق
    refundPolicy: {
      allowPartial: true,
      maxRefundDays: 30,
      requireReason: true
    },
    webhookRetries: 3,
    webhookTimeout: 30000, // 30 ثانية
    idempotencyEnabled: true,
    debugLogging: false
  },

  // تكوين المزودين
  providers: {
    stripe: {
      name: 'Stripe',
      displayName: 'Stripe',
      description: 'بوابة دفع عالمية تدعم البطاقات والمدفوعات الرقمية',
      icon: '💳',
      enabled: true,
      testMode: true,
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
        webhookSecret: '',
        webhookUrl: '',
        statementDescriptor: '',
        statementDescriptorSuffix: '',
        captureMethod: 'automatic', // automatic, manual
        confirmationMethod: 'automatic', // automatic, manual
        setupFutureUsage: 'off_session' // off_session, on_session
      }
    },

    paypal: {
      name: 'PayPal',
      displayName: 'PayPal',
      description: 'بوابة دفع عالمية تدعم الحسابات والبطاقات',
      icon: '🅿️',
      enabled: true,
      testMode: true,
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
        webhookId: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        intent: 'capture', // capture, authorize
        applicationContext: {
          brandName: '',
          landingPage: 'LOGIN', // LOGIN, BILLING, NO_PREFERENCE
          userAction: 'CONTINUE', // CONTINUE, PAY_NOW
          returnUrl: '',
          cancelUrl: ''
        }
      }
    },

    tabby: {
      name: 'Tabby',
      displayName: 'Tabby',
      description: 'خدمة الدفع بالتقسيط في الإمارات والسعودية',
      icon: '📅',
      enabled: true,
      testMode: true,
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
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: '',
        installmentPlans: [3, 6, 9, 12]
      }
    },

    tamara: {
      name: 'Tamara',
      displayName: 'Tamara',
      description: 'خدمة الدفع بالتقسيط في السعودية',
      icon: '🕒',
      enabled: true,
      testMode: true,
      priority: 4,
      supportedCountries: ['SA'],
      supportedCurrencies: ['SAR'],
      supportedMethods: ['installments'],
      fees: {
        percentage: 0,
        fixed: 0,
        currency: 'SAR'
      },
      limits: {
        minAmount: 100.00,
        maxAmount: 100000.00,
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
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: '',
        installmentPlans: [3, 6, 9, 12]
      }
    },

    stcpay: {
      name: 'STC Pay',
      displayName: 'STC Pay',
      description: 'خدمة الدفع الإلكتروني من STC',
      icon: '📱',
      enabled: true,
      testMode: true,
      priority: 5,
      supportedCountries: ['SA'],
      supportedCurrencies: ['SAR'],
      supportedMethods: ['mobile_wallet'],
      fees: {
        percentage: 1.5,
        fixed: 0,
        currency: 'SAR'
      },
      limits: {
        minAmount: 1.00,
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
        paymentMethods: false
      },
      settings: {
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: ''
      }
    },

    mada: {
      name: 'Mada',
      displayName: 'مدى',
      description: 'شبكة المدفوعات السعودية',
      icon: '💳',
      enabled: true,
      testMode: true,
      priority: 6,
      supportedCountries: ['SA'],
      supportedCurrencies: ['SAR'],
      supportedMethods: ['card'],
      fees: {
        percentage: 1.0,
        fixed: 0,
        currency: 'SAR'
      },
      limits: {
        minAmount: 1.00,
        maxAmount: 100000.00,
        currency: 'SAR'
      },
      features: {
        threeDS: true,
        recurring: false,
        refunds: true,
        partialRefunds: true,
        webhooks: true,
        customerManagement: false,
        paymentMethods: false
      },
      settings: {
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: ''
      }
    },

    qitaf: {
      name: 'Qitaf',
      displayName: 'قطاف',
      description: 'خدمة الدفع بالتقسيط من البنك الأهلي',
      icon: '🌳',
      enabled: true,
      testMode: true,
      priority: 7,
      supportedCountries: ['SA'],
      supportedCurrencies: ['SAR'],
      supportedMethods: ['installments'],
      fees: {
        percentage: 0,
        fixed: 0,
        currency: 'SAR'
      },
      limits: {
        minAmount: 200.00,
        maxAmount: 100000.00,
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
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: '',
        installmentPlans: [3, 6, 9, 12]
      }
    },

    fawry: {
      name: 'Fawry',
      displayName: 'فوري',
      description: 'خدمة الدفع الإلكتروني في مصر',
      icon: '💳',
      enabled: true,
      testMode: true,
      priority: 8,
      supportedCountries: ['EG'],
      supportedCurrencies: ['EGP'],
      supportedMethods: ['card', 'cash'],
      fees: {
        percentage: 2.0,
        fixed: 0,
        currency: 'EGP'
      },
      limits: {
        minAmount: 10.00,
        maxAmount: 50000.00,
        currency: 'EGP'
      },
      features: {
        threeDS: false,
        recurring: false,
        refunds: true,
        partialRefunds: true,
        webhooks: true,
        customerManagement: false,
        paymentMethods: false
      },
      settings: {
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: ''
      }
    },

    payfort: {
      name: 'PayFort',
      displayName: 'PayFort',
      description: 'بوابة دفع في الشرق الأوسط',
      icon: '🏦',
      enabled: true,
      testMode: true,
      priority: 9,
      supportedCountries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA'],
      supportedCurrencies: ['SAR', 'AED', 'KWD', 'BHD', 'OMR', 'QAR'],
      supportedMethods: ['card'],
      fees: {
        percentage: 2.5,
        fixed: 0,
        currency: 'USD'
      },
      limits: {
        minAmount: 1.00,
        maxAmount: 100000.00,
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
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: '',
        accessCode: ''
      }
    },

    myfatoorah: {
      name: 'MyFatoorah',
      displayName: 'MyFatoorah',
      description: 'بوابة دفع في العراق',
      icon: '💳',
      enabled: true,
      testMode: true,
      priority: 10,
      supportedCountries: ['IQ'],
      supportedCurrencies: ['IQD'],
      supportedMethods: ['card', 'cash'],
      fees: {
        percentage: 1.5,
        fixed: 0,
        currency: 'IQD'
      },
      limits: {
        minAmount: 1000.00,
        maxAmount: 10000000.00,
        currency: 'IQD'
      },
      features: {
        threeDS: false,
        recurring: false,
        refunds: true,
        partialRefunds: true,
        webhooks: true,
        customerManagement: false,
        paymentMethods: false
      },
      settings: {
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        webhookUrl: '',
        environment: 'sandbox', // sandbox, live
        merchantId: '',
        storeName: '',
        storeUrl: ''
      }
    },

    cashOnDelivery: {
      name: 'CashOnDelivery',
      displayName: 'الدفع عند الاستلام',
      description: 'الدفع نقداً عند استلام الطلب',
      icon: '💵',
      enabled: true,
      testMode: false,
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
  },

  // رسائل الخطأ
  errorMessages: {
    ar: {
      'payment/insufficient-funds': 'رصيد غير كافي',
      'payment/card-declined': 'تم رفض البطاقة',
      'payment/expired-card': 'البطاقة منتهية الصلاحية',
      'payment/invalid-cvc': 'رمز الأمان غير صحيح',
      'payment/processing-error': 'خطأ في معالجة الدفع',
      'payment/network-error': 'خطأ في الشبكة',
      'payment/timeout': 'انتهت مهلة الدفع',
      'payment/cancelled': 'تم إلغاء الدفع',
      'payment/not-found': 'عملية الدفع غير موجودة',
      'payment/already-processed': 'تم معالجة الدفع مسبقاً',
      'payment/invalid-amount': 'مبلغ غير صحيح',
      'payment/currency-not-supported': 'العملة غير مدعومة',
      'payment/country-not-supported': 'البلد غير مدعوم',
      'payment/method-not-available': 'طريقة الدفع غير متاحة',
      'payment/provider-unavailable': 'مزود الدفع غير متاح',
      'payment/webhook-error': 'خطأ في استقبال الإشعار',
      'payment/signature-invalid': 'توقيع غير صحيح',
      'payment/refund-failed': 'فشل في استرداد المبلغ',
      'payment/refund-not-allowed': 'لا يمكن استرداد هذا الدفع',
      'payment/partial-refund-exceeds': 'مبلغ الاسترداد يتجاوز المبلغ المدفوع'
    },
    en: {
      'payment/insufficient-funds': 'Insufficient funds',
      'payment/card-declined': 'Card declined',
      'payment/expired-card': 'Card expired',
      'payment/invalid-cvc': 'Invalid CVC',
      'payment/processing-error': 'Payment processing error',
      'payment/network-error': 'Network error',
      'payment/timeout': 'Payment timeout',
      'payment/cancelled': 'Payment cancelled',
      'payment/not-found': 'Payment not found',
      'payment/already-processed': 'Payment already processed',
      'payment/invalid-amount': 'Invalid amount',
      'payment/currency-not-supported': 'Currency not supported',
      'payment/country-not-supported': 'Country not supported',
      'payment/method-not-available': 'Payment method not available',
      'payment/provider-unavailable': 'Payment provider unavailable',
      'payment/webhook-error': 'Webhook error',
      'payment/signature-invalid': 'Invalid signature',
      'payment/refund-failed': 'Refund failed',
      'payment/refund-not-allowed': 'Refund not allowed',
      'payment/partial-refund-exceeds': 'Refund amount exceeds payment amount'
    }
  },

  // رسائل النجاح
  successMessages: {
    ar: {
      'payment/success': 'تم الدفع بنجاح',
      'payment/authorized': 'تم تفويض الدفع',
      'payment/captured': 'تم تحصيل الدفع',
      'payment/refunded': 'تم استرداد المبلغ',
      'payment/cancelled': 'تم إلغاء الدفع',
      'payment/pending': 'الدفع قيد المعالجة'
    },
    en: {
      'payment/success': 'Payment successful',
      'payment/authorized': 'Payment authorized',
      'payment/captured': 'Payment captured',
      'payment/refunded': 'Payment refunded',
      'payment/cancelled': 'Payment cancelled',
      'payment/pending': 'Payment pending'
    }
  }
};

export default PAYMENT_CONFIG;










