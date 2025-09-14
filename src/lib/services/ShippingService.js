/**
 * خدمة إدارة الشحن
 */

import { Shipping, SHIPPING_METHODS, SHIPPING_STATUSES } from '../models/Shipping.js';
import { errorHandler } from '../errorHandler.js';
import firebaseApi from '../firebase/baseApi.js';

export class ShippingService {
  constructor() {
    this.collectionName = 'shipping';
  }

  /**
   * إنشاء معلومات شحن جديدة
   */
  async createShipping(shippingData) {
    try {
      // إنشاء نموذج الشحن
      const shipping = new Shipping(shippingData);
      
      // التحقق من صحة البيانات
      const validationErrors = shipping.validate();
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/shipping-invalid',
          `خطأ في بيانات الشحن: ${validationErrors.join(', ')}`,
          'shipping-creation'
        );
      }

      // حساب تكلفة الشحن
      shipping.calculateShippingCost();

      // حفظ معلومات الشحن في Firebase
      const shippingDoc = await firebaseApi.addToCollection(this.collectionName, shipping.toObject());
      shipping.id = shippingDoc.id;

      return shipping.toObject();

    } catch (error) {
      throw errorHandler.handleError(error, 'shipping-creation');
    }
  }

  /**
   * الحصول على معلومات الشحن بواسطة المعرف
   */
  async getShippingById(shippingId) {
    try {
      const shippingDoc = await firebaseApi.getDocById(this.collectionName, shippingId);
      if (!shippingDoc) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'shipping/not-found',
          'معلومات الشحن غير موجودة',
          `shipping:${shippingId}`
        );
      }

      return new Shipping(shippingDoc).toObject();

    } catch (error) {
      throw errorHandler.handleError(error, `shipping:${shippingId}`);
    }
  }

  /**
   * الحصول على معلومات الشحن للطلب
   */
  async getOrderShipping(orderId) {
    try {
      const shippingSnapshot = await firebaseApi.getCollection(this.collectionName);
      const shipping = shippingSnapshot.find(ship => ship.orderId === orderId);
      
      if (!shipping) {
        return null;
      }

      return new Shipping(shipping).toObject();

    } catch (error) {
      throw errorHandler.handleError(error, `order-shipping:${orderId}`);
    }
  }

  /**
   * تحديث حالة الشحن
   */
  async updateShippingStatus(shippingId, newStatus, notes = '') {
    try {
      const shipping = await this.getShippingById(shippingId);
      if (!shipping) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'shipping/not-found',
          'معلومات الشحن غير موجودة',
          `shipping-status:${shippingId}`
        );
      }

      const shippingModel = new Shipping(shipping);
      shippingModel.updateStatus(newStatus, notes);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, shippingId, {
        status: newStatus,
        updatedAt: new Date(),
        statusHistory: shippingModel.statusHistory
      });

      // إضافة ملاحظة إذا كانت موجودة
      if (notes) {
        await firebaseApi.addToCollection('shipping_notes', {
          shippingId,
          note: notes,
          createdAt: new Date(),
          createdBy: 'system'
        });
      }

      return shippingModel.toObject();

    } catch (error) {
      throw errorHandler.handleError(error, `shipping-status:${shippingId}`);
    }
  }

  /**
   * إضافة رقم التتبع
   */
  async addTrackingNumber(shippingId, trackingNumber, shippingCompany = null) {
    try {
      const shipping = await this.getShippingById(shippingId);
      if (!shipping) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'shipping/not-found',
          'معلومات الشحن غير موجودة',
          `shipping-tracking:${shippingId}`
        );
      }

      const shippingModel = new Shipping(shipping);
      shippingModel.addTrackingNumber(trackingNumber, shippingCompany);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, shippingId, {
        trackingNumber,
        trackingUrl: this.generateTrackingUrl(trackingNumber, shippingCompany),
        shippingCompany,
        updatedAt: new Date()
      });

      return shippingModel.toObject();

    } catch (error) {
      throw errorHandler.handleError(error, `shipping-tracking:${shippingId}`);
    }
  }

  /**
   * حساب تكلفة الشحن
   */
  async calculateShippingCost(orderItems, shippingAddress, shippingMethod) {
    try {
      const shipping = new Shipping({
        shippingMethod,
        shippingAddress,
        packageWeight: this.calculateTotalWeight(orderItems),
        packageDimensions: this.calculatePackageDimensions(orderItems),
        packageCount: orderItems.length
      });

      const cost = shipping.calculateShippingCost();
      
      return {
        cost,
        estimatedDelivery: this.getEstimatedDelivery(shippingMethod, shippingAddress.country),
        availableMethods: this.getAvailableShippingMethods(shippingAddress.country, cost)
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'shipping-cost-calculation');
    }
  }

  /**
   * الحصول على طرق الشحن المتاحة
   */
  getAvailableShippingMethods(country, orderTotal) {
    const methods = [];

    // الشحن المجاني
    if (orderTotal >= 200) { // إذا كان إجمالي الطلب 200 ريال أو أكثر
      methods.push({
        id: SHIPPING_METHODS.FREE,
        name: 'شحن مجاني',
        cost: 0,
        estimatedDays: '3-5 أيام',
        description: 'شحن مجاني للطلبات التي تزيد عن 200 ريال'
      });
    }

    // الشحن العادي
    methods.push({
      id: SHIPPING_METHODS.STANDARD,
      name: 'شحن عادي',
      cost: this.calculateStandardShippingCost(country),
      estimatedDays: '3-5 أيام',
      description: 'شحن اقتصادي'
    });

    // الشحن السريع
    methods.push({
      id: SHIPPING_METHODS.EXPRESS,
      name: 'شحن سريع',
      cost: this.calculateExpressShippingCost(country),
      estimatedDays: '1-2 أيام',
      description: 'شحن سريع'
    });

    // الشحن الفوري (متاح فقط داخل السعودية)
    if (country === 'SA') {
      methods.push({
        id: SHIPPING_METHODS.OVERNIGHT,
        name: 'شحن فوري',
        cost: this.calculateOvernightShippingCost(country),
        estimatedDays: '24 ساعة',
        description: 'شحن فوري'
      });
    }

    // الاستلام من المتجر
    methods.push({
      id: SHIPPING_METHODS.PICKUP,
      name: 'استلام من المتجر',
      cost: 0,
      estimatedDays: 'فوري',
      description: 'استلام الطلب من المتجر'
    });

    return methods;
  }

  /**
   * حساب تكلفة الشحن العادي
   */
  calculateStandardShippingCost(country) {
    let cost = 15; // تكلفة أساسية
    
    if (country === 'SA') {
      cost += 0; // داخل السعودية
    } else if (['AE', 'KW', 'BH', 'OM', 'QA'].includes(country)) {
      cost += 20; // دول الخليج
    } else {
      cost += 50; // باقي الدول
    }
    
    return Math.min(cost, 100); // حد أقصى 100 ريال
  }

  /**
   * حساب تكلفة الشحن السريع
   */
  calculateExpressShippingCost(country) {
    let cost = 25; // تكلفة أساسية
    
    if (country === 'SA') {
      cost += 0;
    } else if (['AE', 'KW', 'BH', 'OM', 'QA'].includes(country)) {
      cost += 30;
    } else {
      cost += 80;
    }
    
    return Math.min(cost, 150); // حد أقصى 150 ريال
  }

  /**
   * حساب تكلفة الشحن الفوري
   */
  calculateOvernightShippingCost(country) {
    let cost = 50; // تكلفة أساسية
    
    if (country === 'SA') {
      cost += 0;
    } else if (['AE', 'KW', 'BH', 'OM', 'QA'].includes(country)) {
      cost += 50;
    } else {
      cost += 120;
    }
    
    return Math.min(cost, 200); // حد أقصى 200 ريال
  }

  /**
   * حساب الوزن الإجمالي
   */
  calculateTotalWeight(items) {
    return items.reduce((total, item) => {
      if (item.type === 'physical' && item.weight) {
        return total + (item.weight * item.quantity);
      }
      return total;
    }, 0);
  }

  /**
   * حساب أبعاد الطرد
   */
  calculatePackageDimensions(items) {
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    items.forEach(item => {
      if (item.dimensions) {
        maxLength = Math.max(maxLength, item.dimensions.length);
        maxWidth = Math.max(maxWidth, item.dimensions.width);
        totalHeight += item.dimensions.height;
      }
    });

    return {
      length: maxLength,
      width: maxWidth,
      height: totalHeight
    };
  }

  /**
   * الحصول على تاريخ التوصيل المتوقع
   */
  getEstimatedDelivery(shippingMethod, country) {
    const today = new Date();
    let estimatedDays = 0;

    switch (shippingMethod) {
      case SHIPPING_METHODS.FREE:
      case SHIPPING_METHODS.STANDARD:
        estimatedDays = country === 'SA' ? 3 : 5;
        break;
      case SHIPPING_METHODS.EXPRESS:
        estimatedDays = country === 'SA' ? 1 : 2;
        break;
      case SHIPPING_METHODS.OVERNIGHT:
        estimatedDays = 1;
        break;
      case SHIPPING_METHODS.PICKUP:
        estimatedDays = 0;
        break;
      default:
        estimatedDays = 3;
    }

    if (estimatedDays === 0) {
      return today;
    }

    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + estimatedDays);
    return estimatedDate;
  }

  /**
   * إنشاء رابط التتبع
   */
  generateTrackingUrl(trackingNumber, shippingCompany) {
    if (!trackingNumber || !shippingCompany) {
      return null;
    }

    const companyUrls = {
      'أرامكس': `https://www.aramex.com/track/results?q=${trackingNumber}`,
      'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
      'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'استلام من المتجر': null
    };

    return companyUrls[shippingCompany] || null;
  }

  /**
   * الحصول على إحصائيات الشحن
   */
  async getShippingStats() {
    try {
      const shipping = await firebaseApi.getCollection(this.collectionName);
      
      const stats = {
        total: shipping.length,
        pending: shipping.filter(s => s.status === 'pending').length,
        confirmed: shipping.filter(s => s.status === 'confirmed').length,
        pickedUp: shipping.filter(s => s.status === 'picked_up').length,
        inTransit: shipping.filter(s => s.status === 'in_transit').length,
        outForDelivery: shipping.filter(s => s.status === 'out_for_delivery').length,
        delivered: shipping.filter(s => s.status === 'delivered').length,
        failed: shipping.filter(s => s.status === 'failed').length,
        returned: shipping.filter(s => s.status === 'returned').length,
        totalCost: shipping.reduce((sum, s) => sum + (s.shippingCost || 0), 0)
      };

      return stats;

    } catch (error) {
      throw errorHandler.handleError(error, 'shipping-stats');
    }
  }

  /**
   * البحث في الشحنات
   */
  async searchShipping(query, filters = {}) {
    try {
      let shipping = await firebaseApi.getCollection(this.collectionName);
      
      // فلترة حسب البحث
      if (query) {
        shipping = shipping.filter(ship => 
          ship.trackingNumber?.includes(query) ||
          ship.shippingAddress?.name?.includes(query) ||
          ship.shippingAddress?.phone?.includes(query)
        );
      }

      // فلترة حسب الحالة
      if (filters.status) {
        shipping = shipping.filter(ship => ship.status === filters.status);
      }

      // فلترة حسب طريقة الشحن
      if (filters.method) {
        shipping = shipping.filter(ship => ship.shippingMethod === filters.method);
      }

      // فلترة حسب الدولة
      if (filters.country) {
        shipping = shipping.filter(ship => ship.shippingAddress?.country === filters.country);
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      shipping.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return shipping.map(ship => new Shipping(ship).toObject());

    } catch (error) {
      throw errorHandler.handleError(error, 'shipping-search');
    }
  }

  /**
   * تحديث معلومات الشحن
   */
  async updateShipping(shippingId, updateData) {
    try {
      const shipping = await this.getShippingById(shippingId);
      if (!shipping) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'shipping/not-found',
          'معلومات الشحن غير موجودة',
          `shipping-update:${shippingId}`
        );
      }

      // إعادة حساب تكلفة الشحن إذا تم تغيير الطريقة
      if (updateData.shippingMethod && updateData.shippingMethod !== shipping.shippingMethod) {
        const shippingModel = new Shipping({ ...shipping, ...updateData });
        updateData.shippingCost = shippingModel.calculateShippingCost();
      }

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, shippingId, {
        ...updateData,
        updatedAt: new Date()
      });

      return { success: true, message: 'تم تحديث معلومات الشحن بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `shipping-update:${shippingId}`);
    }
  }

  /**
   * حذف معلومات الشحن
   */
  async deleteShipping(shippingId) {
    try {
      const shipping = await this.getShippingById(shippingId);
      if (!shipping) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'shipping/not-found',
          'معلومات الشحن غير موجودة',
          `shipping-delete:${shippingId}`
        );
      }

      // حذف معلومات الشحن
      await firebaseApi.deleteFromCollection(this.collectionName, shippingId);

      return { success: true, message: 'تم حذف معلومات الشحن بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `shipping-delete:${shippingId}`);
    }
  }
}

export default new ShippingService();
