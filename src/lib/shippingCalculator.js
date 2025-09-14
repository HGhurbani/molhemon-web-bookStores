// خدمة حساب الشحن المحسنة
import { siteSettings } from '@/data/siteData.js';
import firebaseApi from './firebaseApi.js';
import logger from './logger.js';

export class ShippingCalculator {
  constructor() {
    this.settings = siteSettings.shipping;
    this.methods = this.settings.methods;
    this.firebaseMethods = null;
  }

  // تحميل طرق الشحن من Firebase
  async loadFirebaseMethods() {
    try {
      this.firebaseMethods = await firebaseApi.getShippingMethods();
      return this.firebaseMethods;
    } catch (error) {
      logger.error('Error loading shipping methods from Firebase:', error);
      return null;
    }
  }

  // الحصول على طرق الشحن (Firebase أولاً، ثم الافتراضية)
  getMethods() {
    if (this.firebaseMethods && this.firebaseMethods.length > 0) {
      const methods = {};
      this.firebaseMethods.forEach(method => {
        methods[method.id] = {
          enabled: method.enabled,
          name: method.name,
          price: method.price,
          days: method.days
        };
      });
      return methods;
    }
    return this.methods;
  }

  /**
   * حساب تكلفة الشحن للكتاب
   */
  calculateBookShipping(book, shippingMethod, country = 'SA') {
    if (!book || book.type !== 'physical') {
      return { cost: 0, available: true, method: null };
    }

    const methods = this.getMethods();
    const method = methods[shippingMethod];
    if (!method || !method.enabled) {
      return { cost: 0, available: false, method: null };
    }

    // التحقق من الشروط
    const validation = this.validateShippingConditions(book, method, country);
    if (!validation.valid) {
      return { 
        cost: 0, 
        available: false, 
        method: method.name,
        error: validation.error 
      };
    }

    // حساب التكلفة
    let cost = method.price;
    
    // إضافة تكلفة الوزن الإضافي
    if (book.weight && book.weight > 1) {
      const extraWeight = book.weight - 1; // أول كيلو مجاني
      cost += extraWeight * this.settings.costPerKg;
    }

    // إضافة تكلفة الأبعاد الإضافية
    if (book.dimensions) {
      const volume = this.calculateVolume(book.dimensions);
      const volumeCost = this.calculateVolumeCost(volume);
      cost += volumeCost;
    }

    return {
      cost: Math.round(cost * 100) / 100, // تقريب إلى رقمين عشريين
      available: true,
      method: method.name,
      estimatedDays: method.days,
      weight: book.weight || 0,
      dimensions: book.dimensions || null
    };
  }

  /**
   * حساب تكلفة الشحن للطلب
   */
  calculateOrderShipping(items, shippingMethod, country = 'SA') {
    const physicalItems = items.filter(item => item.type === 'physical');
    
    if (physicalItems.length === 0) {
      return { cost: 0, available: true, method: null };
    }

    const methods = this.getMethods();
    const method = methods[shippingMethod];
    if (!method || !method.enabled) {
      return { cost: 0, available: false, method: null };
    }

    // حساب الوزن الإجمالي
    const totalWeight = physicalItems.reduce((sum, item) => {
      return sum + ((item.weight || 0) * item.quantity);
    }, 0);

    // حساب الأبعاد الإجمالية
    const totalDimensions = this.calculateTotalDimensions(physicalItems);

    // التحقق من الشروط
    const validation = this.validateOrderConditions(totalWeight, totalDimensions, method, country);
    if (!validation.valid) {
      return { 
        cost: 0, 
        available: false, 
        method: method.name,
        error: validation.error 
      };
    }

    // حساب التكلفة
    let cost = method.price;
    
    // إضافة تكلفة الوزن الإضافي
    if (totalWeight > 1) {
      const extraWeight = totalWeight - 1; // أول كيلو مجاني
      cost += extraWeight * this.settings.costPerKg;
    }

    // إضافة تكلفة الأبعاد الإضافية
    if (totalDimensions) {
      const volume = this.calculateVolume(totalDimensions);
      const volumeCost = this.calculateVolumeCost(volume);
      cost += volumeCost;
    }

    return {
      cost: Math.round(cost * 100) / 100,
      available: true,
      method: method.name,
      estimatedDays: method.days,
      totalWeight,
      totalDimensions
    };
  }

  /**
   * الحصول على طرق الشحن المتاحة للكتاب
   */
  getAvailableMethodsForBook(book, country = 'SA') {
    if (!book || book.type !== 'physical') {
      return [];
    }

    const availableMethods = [];
    const methods = this.getMethods();

    Object.entries(methods).forEach(([methodId, method]) => {
      if (!method.enabled) return;

      const validation = this.validateShippingConditions(book, method, country);
      if (validation.valid) {
        const calculation = this.calculateBookShipping(book, methodId, country);
        availableMethods.push({
          id: methodId,
          name: method.name,
          cost: calculation.cost,
          estimatedDays: method.days,
          description: method.conditions?.description || ''
        });
      }
    });

    return availableMethods.sort((a, b) => a.cost - b.cost);
  }

  /**
   * التحقق من شروط الشحن للكتاب
   */
  validateShippingConditions(book, method, country) {
    const conditions = method.conditions || {};

    // التحقق من الوزن الأقصى
    if (conditions.maxWeight && book.weight > conditions.maxWeight) {
      return {
        valid: false,
        error: `الوزن يتجاوز الحد الأقصى المسموح (${conditions.maxWeight} كجم)`
      };
    }

    // التحقق من الأبعاد
    if (book.dimensions) {
      const maxDimensions = this.settings.maxDimensions;
      if (book.dimensions.length > maxDimensions.length ||
          book.dimensions.width > maxDimensions.width ||
          book.dimensions.height > maxDimensions.height) {
        return {
          valid: false,
          error: `الأبعاد تتجاوز الحد الأقصى المسموح`
        };
      }
    }

    // التحقق من الدولة
    if (conditions.countries && !conditions.countries.includes(country)) {
      return {
        valid: false,
        error: `طريقة الشحن غير متاحة في ${country}`
      };
    }

    return { valid: true };
  }

  /**
   * التحقق من شروط الشحن للطلب
   */
  validateOrderConditions(totalWeight, totalDimensions, method, country) {
    const conditions = method.conditions || {};

    // التحقق من الوزن الأقصى
    if (conditions.maxWeight && totalWeight > conditions.maxWeight) {
      return {
        valid: false,
        error: `الوزن الإجمالي يتجاوز الحد الأقصى المسموح (${conditions.maxWeight} كجم)`
      };
    }

    // التحقق من الأبعاد
    if (totalDimensions) {
      const maxDimensions = this.settings.maxDimensions;
      if (totalDimensions.length > maxDimensions.length ||
          totalDimensions.width > maxDimensions.width ||
          totalDimensions.height > maxDimensions.height) {
        return {
          valid: false,
          error: `الأبعاد الإجمالية تتجاوز الحد الأقصى المسموح`
        };
      }
    }

    // التحقق من الدولة
    if (conditions.countries && !conditions.countries.includes(country)) {
      return {
        valid: false,
        error: `طريقة الشحن غير متاحة في ${country}`
      };
    }

    return { valid: true };
  }

  /**
   * حساب الحجم
   */
  calculateVolume(dimensions) {
    if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height) {
      return 0;
    }
    return dimensions.length * dimensions.width * dimensions.height;
  }

  /**
   * حساب تكلفة الحجم
   */
  calculateVolumeCost(volume) {
    // تكلفة إضافية للحجم الكبير
    if (volume > 1000) { // أكثر من 1000 سم مكعب
      return Math.floor(volume / 1000) * 10; // 10 ريال لكل 1000 سم مكعب
    }
    return 0;
  }

  /**
   * حساب الأبعاد الإجمالية للطلب
   */
  calculateTotalDimensions(items) {
    if (items.length === 0) return null;

    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    items.forEach(item => {
      if (item.dimensions) {
        maxLength = Math.max(maxLength, item.dimensions.length || 0);
        maxWidth = Math.max(maxWidth, item.dimensions.width || 0);
        totalHeight += (item.dimensions.height || 0) * item.quantity;
      }
    });

    return {
      length: maxLength,
      width: maxWidth,
      height: totalHeight
    };
  }

  /**
   * التحقق من الشحن المجاني
   */
  checkFreeShipping(orderTotal, items, country = 'SA') {
    if (orderTotal >= this.settings.freeShippingThreshold) {
      const physicalItems = items.filter(item => item.type === 'physical');
      if (physicalItems.length > 0) {
        const freeMethod = this.methods.free;
        if (freeMethod && freeMethod.enabled) {
          const totalWeight = physicalItems.reduce((sum, item) => {
            return sum + ((item.weight || 0) * item.quantity);
          }, 0);

          if (totalWeight <= freeMethod.conditions.maxWeight) {
            return {
              available: true,
              method: 'free',
              cost: 0,
              estimatedDays: freeMethod.days
            };
          }
        }
      }
    }

    return { available: false };
  }

  /**
   * الحصول على معلومات الشحن
   */
  getShippingInfo() {
    return {
      methods: this.methods,
      settings: this.settings,
      weightUnit: this.settings.weightUnit,
      dimensionUnit: this.settings.dimensionUnit
    };
  }
}

// إنشاء مثيل افتراضي
export const shippingCalculator = new ShippingCalculator();


