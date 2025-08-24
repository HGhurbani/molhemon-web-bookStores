// خدمة حساب الشحن التلقائي
class ShippingService {
  constructor(settings) {
    this.settings = settings;
    this.shippingMethods = settings?.shipping?.shippingMethods || {};
    this.countryRates = settings?.shipping?.countryShippingRates || [];
    this.autoCalculate = settings?.shipping?.autoCalculateShipping || false;
  }

  // حساب رسوم الشحن حسب الدولة ونوع الشحن
  calculateShipping(country, method, orderTotal = 0) {
    if (!this.autoCalculate) {
      return this.calculateBasicShipping(method, orderTotal);
    }

    const countryRate = this.countryRates.find(rate => rate.country === country);
    if (!countryRate) {
      return this.calculateBasicShipping(method, orderTotal);
    }

    const methodRate = countryRate[method];
    if (!methodRate) {
      return this.calculateBasicShipping(method, orderTotal);
    }

    // التحقق من الشحن المجاني
    if (orderTotal >= methodRate.freeThreshold) {
      return {
        cost: 0,
        method: method,
        country: country,
        freeShipping: true,
        estimatedDays: this.getEstimatedDays(method),
        company: this.getShippingCompany(method)
      };
    }

    return {
      cost: methodRate.price,
      method: method,
      country: country,
      freeShipping: false,
      estimatedDays: this.getEstimatedDays(method),
      company: this.getShippingCompany(method)
    };
  }

  // حساب الشحن الأساسي (بدون تحديد الدولة)
  calculateBasicShipping(method, orderTotal) {
    const methodData = this.shippingMethods[method];
    if (!methodData || !methodData.enabled) {
      return null;
    }

    const freeShippingThreshold = this.settings?.shipping?.freeShippingThreshold || 200;
    const isFreeShipping = orderTotal >= freeShippingThreshold;

    return {
      cost: isFreeShipping ? 0 : methodData.price,
      method: method,
      country: null,
      freeShipping: isFreeShipping,
      estimatedDays: this.getEstimatedDays(method),
      company: this.getShippingCompany(method)
    };
  }

  // الحصول على مدة التوصيل المقدرة
  getEstimatedDays(method) {
    const methodData = this.shippingMethods[method];
    return methodData?.days || 'غير محدد';
  }

  // الحصول على شركة الشحن
  getShippingCompany(method) {
    const companies = this.settings?.shipping?.shippingCompanies || [];
    const enabledCompanies = companies.filter(company => company.enabled);
    
    // توزيع الطلبات على شركات الشحن المتاحة
    if (enabledCompanies.length === 0) return null;
    
    // يمكن تطوير خوارزمية أكثر تعقيداً هنا
    const randomIndex = Math.floor(Math.random() * enabledCompanies.length);
    return enabledCompanies[randomIndex];
  }

  // الحصول على جميع خيارات الشحن المتاحة لدولة معينة
  getAvailableShippingOptions(country, orderTotal = 0) {
    const options = [];
    
    Object.keys(this.shippingMethods).forEach(method => {
      if (this.shippingMethods[method].enabled) {
        const shipping = this.calculateShipping(country, method, orderTotal);
        if (shipping) {
          options.push(shipping);
        }
      }
    });

    // ترتيب حسب السعر
    return options.sort((a, b) => a.cost - b.cost);
  }

  // التحقق من صحة إعدادات الشحن
  validateSettings() {
    const errors = [];
    
    if (!this.shippingMethods || Object.keys(this.shippingMethods).length === 0) {
      errors.push('يجب تحديد طرق الشحن على الأقل');
    }

    if (this.autoCalculate && (!this.countryRates || this.countryRates.length === 0)) {
      errors.push('يجب تحديد أسعار الشحن للدول عند تفعيل الحساب التلقائي');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // تحديث الإعدادات
  updateSettings(newSettings) {
    this.settings = newSettings;
    this.shippingMethods = newSettings?.shipping?.shippingMethods || {};
    this.countryRates = newSettings?.shipping?.countryShippingRates || [];
    this.autoCalculate = newSettings?.shipping?.autoCalculateShipping || false;
  }

  // الحصول على إحصائيات الشحن
  getShippingStats() {
    const stats = {
      totalMethods: Object.keys(this.shippingMethods).length,
      enabledMethods: Object.values(this.shippingMethods).filter(m => m.enabled).length,
      totalCountries: this.countryRates.length,
      autoCalculateEnabled: this.autoCalculate
    };

    return stats;
  }
}

// إنشاء خدمة شحن افتراضية
const createDefaultShippingService = () => {
  const defaultSettings = {
    shipping: {
      shippingMethods: {
        standard: { enabled: true, name: 'الشحن العادي', price: 25, days: '3-5 أيام' },
        express: { enabled: true, name: 'الشحن السريع', price: 50, days: '1-2 أيام' },
        pickup: { enabled: true, name: 'استلام من المتجر', price: 0, days: 'فوري' }
      },
      countryShippingRates: [
        {
          country: 'SA',
          countryName: 'المملكة العربية السعودية',
          standard: { price: 15, freeThreshold: 100 },
          express: { price: 30, freeThreshold: 200 },
          pickup: { price: 0, freeThreshold: 0 }
        }
      ],
      autoCalculateShipping: false
    }
  };

  return new ShippingService(defaultSettings);
};

export default ShippingService;
export { createDefaultShippingService };
