/**
 * نموذج إعدادات المتجر
 */

import logger from '../logger.js';

export class StoreSettings {
  constructor(data = {}) {
    // إعدادات عامة
    this.storeName = data.storeName || 'Molhem Book Store';
    this.storeDescription = data.storeDescription || '';
    this.storeLogo = data.storeLogo || '';
    this.storeEmail = data.storeEmail || 'admin@molhemon.com';
    this.storePhone = data.storePhone || '';
    this.storeAddress = data.storeAddress || {};
    
    // إعدادات العملة
    this.defaultCurrency = data.defaultCurrency || 'SAR';
    this.currencySymbol = data.currencySymbol || 'ر.س';
    this.currencyPosition = data.currencyPosition || 'right'; // left, right
    
    // إعدادات الضرائب
    this.taxEnabled = data.taxEnabled || true;
    this.taxRate = data.taxRate || 0.15; // 15% ضريبة القيمة المضافة
    this.taxIncluded = data.taxIncluded || false; // الضريبة مشمولة في السعر أم لا
    
    // إعدادات الشحن
    this.shippingEnabled = data.shippingEnabled || true;
    this.freeShippingThreshold = data.freeShippingThreshold || 200; // شحن مجاني للطلبات فوق 200 ريال
    this.shippingMethods = data.shippingMethods || this.getDefaultShippingMethods();
    this.shippingZones = data.shippingZones || this.getDefaultShippingZones();
    
    // إعدادات الدفع
    this.paymentEnabled = data.paymentEnabled || true;
    this.paymentMethods = data.paymentMethods || this.getDefaultPaymentMethods();
    this.paymentGateways = data.paymentGateways || this.getDefaultPaymentGateways();
    
    // إعدادات الطلبات
    this.orderAutoConfirmation = data.orderAutoConfirmation || false;
    this.orderCancellationWindow = data.orderCancellationWindow || 24; // ساعات
    this.minOrderAmount = data.minOrderAmount || 0;
    this.maxOrderAmount = data.maxOrderAmount || 10000;
    
    // إعدادات المخزون
    this.lowStockThreshold = data.lowStockThreshold || 5;
    this.outOfStockBehavior = data.outOfStockBehavior || 'hide'; // hide, show, backorder
    
    // إعدادات العملاء
    this.guestCheckout = data.guestCheckout || true;
    this.customerRegistration = data.customerRegistration || true;
    this.customerVerification = data.customerVerification || false;
    
    // إعدادات الإشعارات
    this.emailNotifications = data.emailNotifications || true;
    this.smsNotifications = data.smsNotifications || false;
    this.pushNotifications = data.pushNotifications || false;
    
    // تواريخ
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.updatedBy = data.updatedBy || null;
  }

  // الحصول على طرق الشحن الافتراضية
  getDefaultShippingMethods() {
    return {
      free: {
        id: 'free',
        name: 'شحن مجاني',
        description: 'شحن مجاني للطلبات التي تزيد عن 200 ريال',
        cost: 0,
        estimatedDays: '3-5 أيام',
        enabled: true,
        conditions: {
          minOrderAmount: 200,
          maxWeight: 10,
          countries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA']
        }
      },
      standard: {
        id: 'standard',
        name: 'شحن عادي',
        description: 'شحن اقتصادي',
        cost: 15,
        estimatedDays: '3-5 أيام',
        enabled: true,
        conditions: {
          maxWeight: 20,
          countries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'EG', 'JO', 'LB', 'SY', 'IQ', 'IR', 'TR']
        }
      },
      express: {
        id: 'express',
        name: 'شحن سريع',
        description: 'شحن سريع',
        cost: 25,
        estimatedDays: '1-2 أيام',
        enabled: true,
        conditions: {
          maxWeight: 15,
          countries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'EG', 'JO', 'LB', 'SY', 'IQ', 'IR', 'TR']
        }
      },
      overnight: {
        id: 'overnight',
        name: 'شحن فوري',
        description: 'شحن فوري (24 ساعة)',
        cost: 50,
        estimatedDays: '24 ساعة',
        enabled: true,
        conditions: {
          maxWeight: 5,
          countries: ['SA'] // متاح فقط داخل السعودية
        }
      },
      pickup: {
        id: 'pickup',
        name: 'استلام من المتجر',
        description: 'استلام الطلب من المتجر',
        cost: 0,
        estimatedDays: 'فوري',
        enabled: true,
        conditions: {
          countries: ['SA']
        }
      }
    };
  }

  // الحصول على مناطق الشحن الافتراضية
  getDefaultShippingZones() {
    return {
      saudi_arabia: {
        id: 'saudi_arabia',
        name: 'المملكة العربية السعودية',
        countries: ['SA'],
        shippingMethods: ['free', 'standard', 'express', 'overnight', 'pickup'],
        baseCost: 0
      },
      gulf_cooperation: {
        id: 'gulf_cooperation',
        name: 'دول مجلس التعاون الخليجي',
        countries: ['AE', 'KW', 'BH', 'OM', 'QA'],
        shippingMethods: ['free', 'standard', 'express'],
        baseCost: 20
      },
      middle_east: {
        id: 'middle_east',
        name: 'الشرق الأوسط',
        countries: ['EG', 'JO', 'LB', 'SY', 'IQ', 'IR', 'TR'],
        shippingMethods: ['standard', 'express'],
        baseCost: 50
      },
      international: {
        id: 'international',
        name: 'دولي',
        countries: ['*'],
        shippingMethods: ['standard', 'express'],
        baseCost: 100
      }
    };
  }

  // الحصول على طرق الدفع الافتراضية
  getDefaultPaymentMethods() {
    return {
      credit_card: {
        id: 'credit_card',
        name: 'بطاقة ائتمان',
        description: 'Visa, Mastercard, American Express',
        icon: '💳',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
        enabled: true,
        gateway: 'stripe',
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        supportedCards: ['visa', 'mastercard', 'amex'],
        processingTime: 'instant'
      },
      debit_card: {
        id: 'debit_card',
        name: 'بطاقة مدى',
        description: 'بطاقة مدى السعودية',
        icon: '💳',
        logo: 'https://www.mastercard.com/content/dam/public/brandresources/assets/img/logos/mastercard/logo-80.svg',
        enabled: true,
        gateway: 'mada',
        fees: {
          percentage: 1.5,
          fixed: 0.20
        },
        supportedCards: ['mada'],
        processingTime: 'instant'
      },
      paypal: {
        id: 'paypal',
        name: 'PayPal',
        description: 'PayPal',
        icon: '🅿️',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/2560px-PayPal_logo.svg.png',
        enabled: true,
        gateway: 'paypal',
        fees: {
          percentage: 3.5,
          fixed: 0.35
        },
        supportedCards: ['paypal'],
        processingTime: 'instant'
      },
      apple_pay: {
        id: 'apple_pay',
        name: 'Apple Pay',
        description: 'Apple Pay',
        icon: '🍎',
        logo: 'https://developer.apple.com/design/human-interface-guidelines/technologies/apple-pay/images/apple-pay-mark_2x.png',
        enabled: true,
        gateway: 'stripe',
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        supportedCards: ['apple_pay'],
        processingTime: 'instant',
        deviceRequired: 'ios'
      },
      google_pay: {
        id: 'google_pay',
        name: 'Google Pay',
        description: 'Google Pay',
        icon: '📱',
        logo: 'https://developers.google.com/static/wallet/images/gpay-logo.png',
        enabled: true,
        gateway: 'stripe',
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        supportedCards: ['google_pay'],
        processingTime: 'instant',
        deviceRequired: 'android'
      },
      bank_transfer: {
        id: 'bank_transfer',
        name: 'تحويل بنكي',
        description: 'تحويل بنكي مباشر',
        icon: '🏦',
        logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830282.png',
        enabled: true,
        gateway: 'manual',
        fees: {
          percentage: 0,
          fixed: 0
        },
        supportedCards: ['bank_transfer'],
        processingTime: '2-3 business days',
        instructions: 'سيتم إرسال تفاصيل الحساب البنكي عبر البريد الإلكتروني'
      },
      cash_on_delivery: {
        id: 'cash_on_delivery',
        name: 'الدفع عند الاستلام',
        description: 'الدفع عند استلام الطلب',
        icon: '💵',
        logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830282.png',
        enabled: true,
        gateway: 'manual',
        fees: {
          percentage: 0,
          fixed: 5 // رسوم إضافية للدفع عند الاستلام
        },
        supportedCards: ['cash'],
        processingTime: 'upon delivery',
        instructions: 'ادفع عند استلام طلبك'
      },
      // طرق دفع إضافية
      tabby: {
        id: 'tabby',
        name: 'Tabby',
        description: 'ادفع على 4 أقساط بدون فوائد',
        icon: '📅',
        logo: 'https://tabby.ai/static/images/logo.svg',
        enabled: false,
        gateway: 'tabby',
        fees: {
          percentage: 0,
          fixed: 0
        },
        supportedCards: ['tabby'],
        processingTime: 'instant',
        instructions: 'ادفع على 4 أقساط بدون فوائد أو رسوم إضافية',
        installmentOptions: [2, 3, 4]
      },
      tamara: {
        id: 'tamara',
        name: 'Tamara',
        description: 'ادفع على 3 أقساط بدون فوائد',
        icon: '📅',
        logo: 'https://tamara.co/assets/images/logo.svg',
        enabled: false,
        gateway: 'tamara',
        fees: {
          percentage: 0,
          fixed: 0
        },
        supportedCards: ['tamara'],
        processingTime: 'instant',
        instructions: 'ادفع على 3 أقساط بدون فوائد أو رسوم إضافية',
        installmentOptions: [2, 3]
      },
      stc_pay: {
        id: 'stc_pay',
        name: 'STC Pay',
        description: 'محفظة STC الإلكترونية',
        icon: '📱',
        logo: 'https://www.stcpay.com.sa/assets/images/logo.svg',
        enabled: false,
        gateway: 'stc_pay',
        fees: {
          percentage: 0,
          fixed: 0
        },
        supportedCards: ['stc_pay'],
        processingTime: 'instant',
        instructions: 'ادفع عبر محفظة STC الإلكترونية'
      },
      urway: {
        id: 'urway',
        name: 'Urway',
        description: 'بوابة دفع متكاملة',
        icon: '🌐',
        logo: 'https://urway.com/assets/images/logo.svg',
        enabled: false,
        gateway: 'urway',
        fees: {
          percentage: 2.5,
          fixed: 0.25
        },
        supportedCards: ['visa', 'mastercard', 'mada'],
        processingTime: 'instant',
        instructions: 'بوابة دفع آمنة ومتطورة'
      }
    };
  }

  // الحصول على بوابات الدفع الافتراضية
  getDefaultPaymentGateways() {
    return {
      stripe: {
        id: 'stripe',
        name: 'Stripe',
        enabled: false,
        config: {
          publishableKey: '',
          secretKey: '',
          webhookSecret: ''
        },
        supportedMethods: ['credit_card', 'apple_pay', 'google_pay'],
        supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP']
      },
      paypal: {
        id: 'paypal',
        name: 'PayPal',
        enabled: false,
        config: {
          clientId: '',
          clientSecret: '',
          mode: 'sandbox' // sandbox, live
        },
        supportedMethods: ['paypal'],
        supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP']
      },
      mada: {
        id: 'mada',
        name: 'مدى',
        enabled: false,
        config: {
          merchantId: '',
          terminalId: '',
          apiKey: ''
        },
        supportedMethods: ['debit_card'],
        supportedCurrencies: ['SAR']
      },
      manual: {
        id: 'manual',
        name: 'يدوي',
        enabled: true,
        config: {},
        supportedMethods: ['bank_transfer', 'cash_on_delivery'],
        supportedCurrencies: ['SAR']
      },
      tabby: {
        id: 'tabby',
        name: 'Tabby',
        enabled: false,
        config: {
          publicKey: '',
          secretKey: '',
          webhookSecret: ''
        },
        supportedMethods: ['tabby'],
        supportedCurrencies: ['SAR', 'AED'],
        sandboxMode: true
      },
      tamara: {
        id: 'tamara',
        name: 'Tamara',
        enabled: false,
        config: {
          publicKey: '',
          secretKey: '',
          webhookSecret: ''
        },
        supportedMethods: ['tamara'],
        supportedCurrencies: ['SAR', 'AED'],
        sandboxMode: true
      },
      stc_pay: {
        id: 'stc_pay',
        name: 'STC Pay',
        enabled: false,
        config: {
          merchantId: '',
          apiKey: '',
          webhookSecret: ''
        },
        supportedMethods: ['stc_pay'],
        supportedCurrencies: ['SAR'],
        sandboxMode: true
      },
      urway: {
        id: 'urway',
        name: 'Urway',
        enabled: false,
        config: {
          merchantId: '',
          terminalId: '',
          apiKey: '',
          webhookSecret: ''
        },
        supportedMethods: ['credit_card', 'debit_card'],
        supportedCurrencies: ['SAR', 'AED', 'USD'],
        sandboxMode: true
      }
    };
  }

  // التحقق من صحة الإعدادات
  validate() {
    const errors = [];
    
    if (!this.storeName || this.storeName.trim().length === 0) {
      errors.push('اسم المتجر مطلوب');
    }
    
    if (this.storeEmail && !this.isValidEmail(this.storeEmail)) {
      errors.push('البريد الإلكتروني غير صحيح');
    }
    
    if (this.taxEnabled && (this.taxRate < 0 || this.taxRate > 1)) {
      errors.push('نسبة الضريبة يجب أن تكون بين 0 و 1');
    }
    
    if (this.freeShippingThreshold < 0) {
      errors.push('حد الشحن المجاني يجب أن يكون أكبر من أو يساوي صفر');
    }
    
    if (this.minOrderAmount < 0) {
      errors.push('الحد الأدنى للطلب يجب أن يكون أكبر من أو يساوي صفر');
    }
    
    if (this.maxOrderAmount <= 0) {
      errors.push('الحد الأقصى للطلب يجب أن يكون أكبر من صفر');
    }
    
    if (this.minOrderAmount >= this.maxOrderAmount) {
      errors.push('الحد الأدنى للطلب يجب أن يكون أقل من الحد الأقصى');
    }
    
    return errors;
  }

  // التحقق من صحة البريد الإلكتروني
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // الحصول على طرق الشحن المتاحة لمنطقة معينة
  getAvailableShippingMethods(country, orderAmount = 0, productWeight = 0) {
    logger.debug('Getting available shipping methods:', {
      country,
      orderAmount,
      productWeight,
      shippingMethods: this.shippingMethods
    });
    
    const availableMethods = [];
    const rejectedMethods = [];
    
    // تنظيف كود الدولة
    const cleanCountry = country ? country.toUpperCase().trim() : 'SA';
    
    // إذا كانت الدولة "OTHER" أو غير مدعومة، استخدم طريقة الشحن الاحتياطية
    const isUnsupportedCountry = cleanCountry === 'OTHER' || 
      !['SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'EG', 'JO', 'LB', 'SY', 'IQ', 'IR', 'TR'].includes(cleanCountry);
    
    Object.values(this.shippingMethods).forEach(method => {
      logger.debug('Checking method:', method.name, 'enabled:', method.enabled);
      
      if (!method.enabled) {
        rejectedMethods.push({
          method: method.name,
          reason: 'disabled'
        });
        return;
      }
      
      // التحقق من الشروط
      const conditions = method.conditions || {};
      
      // التحقق من الحد الأدنى للطلب
      if (conditions.minOrderAmount && orderAmount < conditions.minOrderAmount) {
        logger.debug('Method rejected due to min order amount:', method.name);
        rejectedMethods.push({
          method: method.name,
          reason: 'min_order_amount',
          details: `الحد الأدنى للطلب: ${conditions.minOrderAmount} ريال، المطلوب: ${orderAmount} ريال`
        });
        return;
      }
      
      // التحقق من الوزن الأقصى
      if (conditions.maxWeight && productWeight > conditions.maxWeight) {
        logger.debug('Method rejected due to max weight:', method.name);
        rejectedMethods.push({
          method: method.name,
          reason: 'max_weight',
          details: `الوزن الأقصى: ${conditions.maxWeight} كجم، الوزن الحالي: ${productWeight} كجم`
        });
        return;
      }
      
      // التحقق من الدول المدعومة
      if (conditions.countries && conditions.countries.length > 0) {
        const supportedCountries = conditions.countries.map(c => c.toUpperCase());
        if (!supportedCountries.includes(cleanCountry)) {
          logger.debug('Method rejected due to country:', method.name, 'Country:', cleanCountry, 'Supported:', supportedCountries);
          rejectedMethods.push({
            method: method.name,
            reason: 'country_not_supported',
            details: `الدولة ${cleanCountry} غير مدعومة. الدول المدعومة: ${supportedCountries.join(', ')}`
          });
          return;
        }
      }
      
      logger.debug('Method accepted:', method.name);
      availableMethods.push(method);
    });
    
    // إذا كانت الدولة غير مدعومة أو لم توجد طرق متاحة، أضف طرق احتياطية
    if (isUnsupportedCountry || availableMethods.length === 0) {
      logger.debug('Unsupported country or no shipping methods available, adding fallback methods');
      
      // إضافة طريقة شحن احتياطية للدول غير المدعومة
      availableMethods.push({
        id: 'fallback_standard',
        name: 'شحن عادي (احتياطي)',
        description: isUnsupportedCountry ? 
          `شحن عادي للدول غير المدعومة (${cleanCountry})` : 
          'شحن عادي احتياطي',
        cost: isUnsupportedCountry ? 75 : 50,
        estimatedDays: isUnsupportedCountry ? '7-14 أيام' : '5-10 أيام',
        enabled: true,
        isFallback: true,
        conditions: {
          countries: ['*'] // متاح لجميع الدول
        }
      });
      
      // إضافة طريقة شحن سريع احتياطية للدول غير المدعومة
      if (isUnsupportedCountry) {
        availableMethods.push({
          id: 'fallback_express',
          name: 'شحن سريع (احتياطي)',
          description: `شحن سريع للدول غير المدعومة (${cleanCountry})`,
          cost: 120,
          estimatedDays: '3-7 أيام',
          enabled: true,
          isFallback: true,
          conditions: {
            countries: ['*'] // متاح لجميع الدول
          }
        });
      }
    }
    
    logger.debug('Final available methods:', availableMethods);
    logger.debug('Rejected methods:', rejectedMethods);
    
    return availableMethods;
  }

  // الحصول على طرق الدفع المتاحة
  getAvailablePaymentMethods() {
    return Object.values(this.paymentMethods).filter(method => method.enabled);
  }

  // الحصول على بوابات الدفع المتاحة
  getAvailablePaymentGateways() {
    return Object.values(this.paymentGateways).filter(gateway => gateway.enabled);
  }

  // حساب تكلفة الشحن
  calculateShippingCost(country, orderAmount, productWeight, shippingMethodId) {
    const method = this.shippingMethods[shippingMethodId];
    if (!method || !method.enabled) {
      return { cost: 0, available: false };
    }
    
    // التحقق من الشحن المجاني
    if (shippingMethodId === 'free' && orderAmount >= this.freeShippingThreshold) {
      return { cost: 0, available: true };
    }
    
    // حساب التكلفة الأساسية
    let cost = method.cost;
    
    // إضافة تكلفة المنطقة
    const zone = this.getShippingZoneByCountry(country);
    if (zone) {
      cost += zone.baseCost;
    }
    
    // إضافة تكلفة الوزن الإضافي
    if (method.conditions.maxWeight && productWeight > method.conditions.maxWeight) {
      const extraWeight = productWeight - method.conditions.maxWeight;
      cost += extraWeight * 5; // 5 ريال لكل كيلو إضافي
    }
    
    return { cost, available: true };
  }

  // الحصول على منطقة الشحن حسب الدولة
  getShippingZoneByCountry(country) {
    return Object.values(this.shippingZones).find(zone => 
      zone.countries.includes(country) || zone.countries.includes('*')
    );
  }

  // تحديث الإعدادات
  updateSettings(newSettings) {
    Object.assign(this, newSettings);
    this.updatedAt = new Date();
  }

  // تحويل إلى كائن عادي
  toObject() {
    return {
      storeName: this.storeName,
      storeDescription: this.storeDescription,
      storeLogo: this.storeLogo,
      storeEmail: this.storeEmail,
      storePhone: this.storePhone,
      storeAddress: this.storeAddress,
      defaultCurrency: this.defaultCurrency,
      currencySymbol: this.currencySymbol,
      currencyPosition: this.currencyPosition,
      taxEnabled: this.taxEnabled,
      taxRate: this.taxRate,
      taxIncluded: this.taxIncluded,
      shippingEnabled: this.shippingEnabled,
      freeShippingThreshold: this.freeShippingThreshold,
      shippingMethods: this.shippingMethods,
      shippingZones: this.shippingZones,
      paymentEnabled: this.paymentEnabled,
      paymentMethods: this.paymentMethods,
      paymentGateways: this.paymentGateways,
      orderAutoConfirmation: this.orderAutoConfirmation,
      orderCancellationWindow: this.orderCancellationWindow,
      minOrderAmount: this.minOrderAmount,
      maxOrderAmount: this.maxOrderAmount,
      lowStockThreshold: this.lowStockThreshold,
      outOfStockBehavior: this.outOfStockBehavior,
      guestCheckout: this.guestCheckout,
      customerRegistration: this.customerRegistration,
      customerVerification: this.customerVerification,
      emailNotifications: this.emailNotifications,
      smsNotifications: this.smsNotifications,
      pushNotifications: this.pushNotifications,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy
    };
  }

  // إنشاء من كائن
  static fromObject(data) {
    return new StoreSettings(data);
  }
}

export default StoreSettings;

