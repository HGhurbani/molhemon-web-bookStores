/**
 * نموذج الشحن
 */

export class Shipping {
  constructor(data = {}) {
    console.log('Shipping constructor called with data:', data);
    
    this.id = data.id || null;
    this.orderId = data.orderId || null;
    this.customerId = data.customerId || null;
    this.shippingMethod = data.shippingMethod || 'standard';
    this.shippingCost = data.shippingCost || 0;
    this.currency = data.currency || 'SAR';
    
    // معلومات العنوان
    this.shippingAddress = data.shippingAddress || {
      name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      country: 'SA',
      postalCode: '',
      additionalInfo: ''
    };
    
    console.log('Shipping constructor result:', {
      orderId: this.orderId,
      customerId: this.customerId,
      shippingAddress: this.shippingAddress,
      phone: this.shippingAddress?.phone,
      name: this.shippingAddress?.name
    });
    
    // معلومات الشحن
    this.packageWeight = data.packageWeight || 0;
    this.packageDimensions = data.packageDimensions || {
      length: 0,
      width: 0,
      height: 0
    };
    this.packageCount = data.packageCount || 1;
    
    // معلومات التتبع
    this.trackingNumber = data.trackingNumber || null;
    this.trackingUrl = data.trackingUrl || null;
    this.shippingCompany = data.shippingCompany || null;
    this.shippingCompanyLogo = data.shippingCompanyLogo || null;
    
    // تواريخ الشحن
    this.estimatedPickup = data.estimatedPickup || null;
    this.estimatedDelivery = data.estimatedDelivery || null;
    this.actualPickup = data.actualPickup || null;
    this.actualDelivery = data.actualDelivery || null;
    
    // حالة الشحن
    this.status = data.status || 'pending';
    this.statusHistory = data.statusHistory || [];
    
    // معلومات إضافية
    this.notes = data.notes || '';
    this.specialInstructions = data.specialInstructions || '';
    this.insuranceAmount = data.insuranceAmount || 0;
    this.signatureRequired = data.signatureRequired || false;
    
    // تواريخ
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // تحديث حالة الشحن
  updateStatus(newStatus, notes = '') {
    this.status = newStatus;
    this.updatedAt = new Date();
    
    this.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      notes: notes
    });
    
    // تحديث التواريخ حسب الحالة
    switch (newStatus) {
      case 'picked_up':
        this.actualPickup = new Date();
        break;
      case 'delivered':
        this.actualDelivery = new Date();
        break;
    }
  }

  // حساب تكلفة الشحن
  calculateShippingCost() {
    let baseCost = 0;
    
    switch (this.shippingMethod) {
      case 'free':
        baseCost = 0;
        break;
      case 'standard':
        baseCost = this.calculateStandardShipping();
        break;
      case 'express':
        baseCost = this.calculateExpressShipping();
        break;
      case 'overnight':
        baseCost = this.calculateOvernightShipping();
        break;
      case 'pickup':
        baseCost = 0;
        break;
      default:
        baseCost = this.calculateStandardShipping();
    }
    
    // إضافة تكلفة التأمين
    if (this.insuranceAmount > 0) {
      baseCost += this.insuranceAmount * 0.01; // 1% من قيمة التأمين
    }
    
    this.shippingCost = baseCost;
    return baseCost;
  }

  // حساب الشحن العادي
  calculateStandardShipping() {
    let cost = 15; // تكلفة أساسية
    
    // إضافة تكلفة حسب الوزن
    if (this.packageWeight > 1) {
      cost += (this.packageWeight - 1) * 5; // 5 ريال لكل كيلو إضافي
    }
    
    // إضافة تكلفة حسب المسافة (مبسطة)
    const country = this.shippingAddress.country;
    if (country === 'SA') {
      // داخل السعودية
      cost += 0;
    } else if (['AE', 'KW', 'BH', 'OM', 'QA'].includes(country)) {
      // دول الخليج
      cost += 20;
    } else {
      // باقي الدول
      cost += 50;
    }
    
    return Math.min(cost, 100); // حد أقصى 100 ريال
  }

  // حساب الشحن السريع
  calculateExpressShipping() {
    let cost = 25; // تكلفة أساسية
    
    if (this.packageWeight > 1) {
      cost += (this.packageWeight - 1) * 8; // 8 ريال لكل كيلو إضافي
    }
    
    const country = this.shippingAddress.country;
    if (country === 'SA') {
      cost += 0;
    } else if (['AE', 'KW', 'BH', 'OM', 'QA'].includes(country)) {
      cost += 30;
    } else {
      cost += 80;
    }
    
    return Math.min(cost, 150); // حد أقصى 150 ريال
  }

  // حساب الشحن الفوري
  calculateOvernightShipping() {
    let cost = 50; // تكلفة أساسية
    
    if (this.packageWeight > 1) {
      cost += (this.packageWeight - 1) * 10; // 10 ريال لكل كيلو إضافي
    }
    
    const country = this.shippingAddress.country;
    if (country === 'SA') {
      cost += 0;
    } else if (['AE', 'KW', 'BH', 'OM', 'QA'].includes(country)) {
      cost += 50;
    } else {
      cost += 120;
    }
    
    return Math.min(cost, 200); // حد أقصى 200 ريال
  }

  // حساب الوزن الإجمالي
  calculateTotalWeight() {
    return this.packageWeight * this.packageCount;
  }

  // حساب الأبعاد الإجمالية
  calculateTotalDimensions() {
    return {
      length: this.packageDimensions.length * this.packageCount,
      width: this.packageDimensions.width,
      height: this.packageDimensions.height
    };
  }

  // التحقق من صحة معلومات الشحن
  validate() {
    const errors = [];
    
    if (!this.orderId) {
      errors.push('معرف الطلب مطلوب');
    }
    
    if (!this.customerId) {
      errors.push('معرف العميل مطلوب');
    }
    
    if (!this.shippingAddress.name) {
      errors.push('اسم المستلم مطلوب');
    }
    
    if (!this.shippingAddress.phone) {
      errors.push('رقم الهاتف مطلوب');
    }
    
    if (!this.shippingAddress.street) {
      errors.push('عنوان الشارع مطلوب');
    }
    
    if (!this.shippingAddress.city) {
      errors.push('المدينة مطلوبة');
    }
    
    if (!this.shippingAddress.country) {
      errors.push('الدولة مطلوبة');
    }
    
    if (this.packageWeight < 0) {
      errors.push('وزن الطرد يجب أن يكون أكبر من أو يساوي صفر');
    }
    
    return errors;
  }

  // تحويل إلى كائن عادي
  toObject() {
    return {
      id: this.id,
      orderId: this.orderId,
      customerId: this.customerId,
      shippingMethod: this.shippingMethod,
      shippingCost: this.shippingCost,
      currency: this.currency,
      shippingAddress: this.shippingAddress,
      packageWeight: this.packageWeight,
      packageDimensions: this.packageDimensions,
      packageCount: this.packageCount,
      trackingNumber: this.trackingNumber,
      trackingUrl: this.trackingUrl,
      shippingCompany: this.shippingCompany,
      shippingCompanyLogo: this.shippingCompanyLogo,
      estimatedPickup: this.estimatedPickup,
      estimatedDelivery: this.estimatedDelivery,
      actualPickup: this.actualPickup,
      actualDelivery: this.actualDelivery,
      status: this.status,
      statusHistory: this.statusHistory,
      notes: this.notes,
      specialInstructions: this.specialInstructions,
      insuranceAmount: this.insuranceAmount,
      signatureRequired: this.signatureRequired,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // إنشاء من كائن
  static fromObject(data) {
    return new Shipping(data);
  }
}

// طرق الشحن
export const SHIPPING_METHODS = {
  FREE: 'free',
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
  PICKUP: 'pickup'
};

// حالات الشحن
export const SHIPPING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  RETURNED: 'returned'
};




