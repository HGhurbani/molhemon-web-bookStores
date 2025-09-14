/**
 * نموذج الطلب
 */

import { OrderItem } from './OrderItem.js';
import logger from '../logger.js';

export class Order {
  constructor(data = {}) {
    this.id = data.id || null;
    this.orderNumber = data.orderNumber || this.generateOrderNumber();
    this.customerId = data.customerId || null;
    this.customerEmail = data.customerEmail || '';
    this.customerPhone = data.customerPhone || '';
    this.customerName = data.customerName || '';
    
    // عناصر الطلب
    this.items = (data.items || []).map(item => {
      // إذا كان العنصر من نوع OrderItem بالفعل، استخدمه كما هو
      if (item && typeof item.isPhysical === 'function' && typeof item.toObject === 'function') {
        return item;
      }
      // وإلا، أنشئ OrderItem جديد
      return new OrderItem({
        id: item.id || null,
        productId: item.productId || item.id,
        productName: item.productName || item.name || '',
        productType: item.productType || item.type || 'physical',
        unitPrice: item.unitPrice || item.price || 0,
        quantity: item.quantity || 1,
        weight: item.weight || 0
      });
    });
    this.itemCount = this.items.length;
    
    // الأسعار والتكاليف
    this.subtotal = data.subtotal || 0;
    this.shippingCost = data.shippingCost || 0;
    this.taxAmount = data.taxAmount || 0;
    this.discountAmount = data.discountAmount || 0;
    this.totalAmount = data.totalAmount || data.total || 0;
    this.currency = data.currency || 'SAR';
    
    logger.debug('Order constructor - Received data:', {
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      taxAmount: data.taxAmount,
      total: data.total,
      totalAmount: data.totalAmount
    });
    logger.debug('Order constructor - Set values:', {
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      taxAmount: this.taxAmount,
      totalAmount: this.totalAmount
    });
    
    // حالة الطلب
    this.status = data.status || 'pending';
    this.paymentStatus = data.paymentStatus || 'pending';
    this.shippingStatus = data.shippingStatus || 'pending';
    
    // معلومات الشحن
    this.shippingAddress = data.shippingAddress || {};
    this.shippingMethod = data.shippingMethod || 'standard';
    this.shippingId = data.shippingId || null;
    
    // معلومات الدفع
    this.paymentId = data.paymentId || null;
    this.paymentMethod = data.paymentMethod || null;
    
    // معلومات إضافية
    this.notes = data.notes || '';
    this.internalNotes = data.internalNotes || '';
    this.tags = data.tags || [];
    
    // تواريخ المراحل - سيتم تعيينها بواسطة Firebase serverTimestamp
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.orderedAt = data.orderedAt || null;
    this.paidAt = data.paidAt || null;
    this.shippedAt = data.shippedAt || null;
    this.deliveredAt = data.deliveredAt || null;
    this.reviewedAt = data.reviewedAt || null;
    this.cancelledAt = data.cancelledAt || null;
    
    // تتبع المراحل
    this.currentStage = data.currentStage || 'ordered';
    this.stageHistory = data.stageHistory || [
      {
        stage: 'ordered',
        timestamp: null, // سيتم تعيينه بواسطة Firebase serverTimestamp
        notes: 'تم إنشاء الطلب'
      }
    ];
    
    // معلومات التتبع
    this.trackingNumber = data.trackingNumber || null;
    this.estimatedDelivery = data.estimatedDelivery || null;
    
    // معلومات الضرائب
    this.taxRate = data.taxRate || 0.15; // 15% ضريبة القيمة المضافة
    this.taxExempt = data.taxExempt || false;
    
    // معلومات الخصم
    this.couponCode = data.couponCode || null;
    this.couponDiscount = data.couponDiscount || 0;
    
    // معلومات إضافية للطلبات
    this.source = data.source || 'website'; // website, mobile, admin, api
    this.ipAddress = data.ipAddress || null;
    this.userAgent = data.userAgent || null;
    
    // حساب الأسعار
    this.calculateTotal();
  }

  // إنشاء رقم طلب فريد
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  // إضافة عنصر للطلب
  addItem(item) {
    this.items.push(item);
    this.itemCount = this.items.length;
    this.calculateTotal();
  }

  // إزالة عنصر من الطلب
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.itemCount = this.items.length;
    this.calculateTotal();
  }

  // تحديث كمية عنصر
  updateItemQuantity(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.calculateTotalPrice();
      this.calculateTotal();
    }
  }

  // حساب المجموع
  calculateTotal() {
    // إذا لم تكن القيم محسوبة مسبقاً، احسبها من العناصر
    if (this.subtotal === 0 && this.items.length > 0) {
      this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    
    // إذا لم تكن الضريبة محسوبة مسبقاً، احسبها
    if (this.taxAmount === 0 && !this.taxExempt) {
      this.taxAmount = this.subtotal * this.taxRate;
    }
    
    // حساب الخصم
    const totalDiscount = this.discountAmount + this.couponDiscount;
    
    // حساب المجموع الإجمالي
    this.totalAmount = this.subtotal + this.shippingCost + this.taxAmount - totalDiscount;
    
    // التأكد من أن المجموع لا يكون سالب
    this.totalAmount = Math.max(0, this.totalAmount);
    
    // إضافة total للتوافق
    this.total = this.totalAmount;
    
    logger.debug('Order calculateTotal - Final values:', {
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      taxAmount: this.taxAmount,
      totalAmount: this.totalAmount
    });
    
    return this.totalAmount;
  }

  // تحديث حالة الطلب
  updateStatus(newStatus, notes = '') {
    this.status = newStatus;
    this.updatedAt = new Date();
    
    // تحديث التواريخ حسب الحالة
    switch (newStatus) {
      case 'paid':
        this.paidAt = new Date();
        break;
      case 'shipped':
        this.shippedAt = new Date();
        break;
      case 'delivered':
        this.deliveredAt = new Date();
        break;
      case 'cancelled':
        this.cancelledAt = new Date();
        break;
    }
    
    if (notes) {
      this.internalNotes += `\n${new Date().toISOString()}: ${notes}`;
    }
  }

  // تحديث مرحلة الطلب
  updateStage(newStage, notes = '') {
    const previousStage = this.currentStage;
    this.currentStage = newStage;
    this.updatedAt = new Date();
    
    // تحديث التواريخ حسب المرحلة
    switch (newStage) {
      case 'ordered':
        this.orderedAt = new Date();
        break;
      case 'paid':
        this.paidAt = new Date();
        break;
      case 'shipped':
        this.shippedAt = new Date();
        break;
      case 'delivered':
        this.deliveredAt = new Date();
        break;
      case 'reviewed':
        this.reviewedAt = new Date();
        break;
    }
    
    // إضافة إلى سجل المراحل
    this.stageHistory.push({
      stage: newStage,
      timestamp: new Date(),
      notes: notes || `تم الانتقال من ${previousStage} إلى ${newStage}`,
      previousStage: previousStage
    });
    
    // تحديث الحالة العامة
    this.status = newStage;
  }

  // الحصول على المرحلة التالية المتاحة
  getNextAvailableStage() {
    const stages = ['ordered', 'paid', 'shipped', 'delivered', 'reviewed'];
    const currentIndex = stages.indexOf(this.currentStage);
    
    if (currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    return null;
  }

  // التحقق من إمكانية الانتقال لمرحلة معينة
  canMoveToStage(targetStage) {
    const stages = ['ordered', 'paid', 'shipped', 'delivered', 'reviewed'];
    const currentIndex = stages.indexOf(this.currentStage);
    const targetIndex = stages.indexOf(targetStage);
    
    // يمكن الانتقال للمرحلة التالية فقط
    return targetIndex === currentIndex + 1;
  }

  // الحصول على معلومات المرحلة الحالية
  getCurrentStageInfo() {
    const stageInfo = {
      'ordered': { name: 'تم الطلب', icon: '📝', color: 'blue' },
      'paid': { name: 'تم الدفع', icon: '💳', color: 'green' },
      'shipped': { name: 'تم الشحن', icon: '🚚', color: 'orange' },
      'delivered': { name: 'تم الاستلام', icon: '✅', color: 'green' },
      'reviewed': { name: 'تم التقييم', icon: '⭐', color: 'purple' }
    };
    
    return stageInfo[this.currentStage] || stageInfo['ordered'];
  }

  // تحديث حالة الدفع
  updatePaymentStatus(newStatus) {
    this.paymentStatus = newStatus;
    this.updatedAt = new Date();
    
    if (newStatus === 'paid') {
      this.paidAt = new Date();
    }
  }

  // تحديث حالة الشحن
  updateShippingStatus(newStatus) {
    this.shippingStatus = newStatus;
    this.updatedAt = new Date();
    
    if (newStatus === 'shipped') {
      this.shippedAt = new Date();
    } else if (newStatus === 'delivered') {
      this.deliveredAt = new Date();
    }
  }

  // التحقق من وجود منتجات مادية
  hasPhysicalItems() {
    return this.items.some(item => item.productType === 'physical');
  }

  // التحقق من وجود منتجات رقمية
  hasDigitalItems() {
    return this.items.some(item => item.productType === 'ebook' || item.productType === 'audiobook');
  }

  // التحقق من وجود كتب إلكترونية
  hasEbooks() {
    return this.items.some(item => item.productType === 'ebook');
  }

  // التحقق من وجود كتب صوتية
  hasAudiobooks() {
    return this.items.some(item => item.productType === 'audiobook');
  }

  // الحصول على أنواع المنتجات في الطلب
  getProductTypes() {
    const types = new Set();
    this.items.forEach(item => {
      types.add(item.productType);
    });
    return Array.from(types);
  }

  // حساب الوزن الإجمالي
  getTotalWeight() {
    return this.items
      .filter(item => item.isPhysical())
      .reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);
  }

  // التحقق من صحة الطلب
  validate() {
    const errors = [];
    
    if (!this.customerId) {
      errors.push('معرف العميل مطلوب');
    }
    
    if (!this.customerEmail) {
      errors.push('البريد الإلكتروني مطلوب');
    } else {
      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.customerEmail)) {
        errors.push('البريد الإلكتروني غير صحيح');
      }
    }
    
    if (!this.customerName || this.customerName.trim() === '') {
      errors.push('اسم العميل مطلوب');
    }
    
    if (this.items.length === 0) {
      errors.push('الطلب يجب أن يحتوي على عنصر واحد على الأقل');
    }
    
    if (this.totalAmount < 0) {
      errors.push('المجموع الإجمالي لا يمكن أن يكون سالب');
    }
    
    if (this.hasPhysicalItems() && !this.shippingAddress.street) {
      errors.push('عنوان الشحن مطلوب للمنتجات المادية');
    }
    
    return errors;
  }

  // تحويل إلى كائن عادي
  toObject() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      customerId: this.customerId,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      customerName: this.customerName,
      items: this.items.map(item => item.toObject()),
      itemCount: this.itemCount,
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      taxAmount: this.taxAmount,
      discountAmount: this.discountAmount,
      totalAmount: this.totalAmount,
      total: this.total || this.totalAmount, // إضافة total للتوافق
      currency: this.currency,
      status: this.status,
      paymentStatus: this.paymentStatus,
      shippingStatus: this.shippingStatus,
      shippingAddress: this.shippingAddress,
      shippingMethod: this.shippingMethod,
      shippingId: this.shippingId,
      paymentId: this.paymentId,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      internalNotes: this.internalNotes,
      tags: this.tags,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
      updatedAt: this.updatedAt instanceof Date ? this.updatedAt.toISOString() : this.updatedAt,
      orderedAt: this.orderedAt instanceof Date ? this.orderedAt.toISOString() : this.orderedAt,
      paidAt: this.paidAt instanceof Date ? this.paidAt.toISOString() : this.paidAt,
      shippedAt: this.shippedAt instanceof Date ? this.shippedAt.toISOString() : this.shippedAt,
      deliveredAt: this.deliveredAt instanceof Date ? this.deliveredAt.toISOString() : this.deliveredAt,
      reviewedAt: this.reviewedAt instanceof Date ? this.reviewedAt.toISOString() : this.reviewedAt,
      cancelledAt: this.cancelledAt instanceof Date ? this.cancelledAt.toISOString() : this.cancelledAt,
      currentStage: this.currentStage,
      stageHistory: this.stageHistory,
      trackingNumber: this.trackingNumber,
      estimatedDelivery: this.estimatedDelivery,
      taxRate: this.taxRate,
      taxExempt: this.taxExempt,
      couponCode: this.couponCode,
      couponDiscount: this.couponDiscount,
      source: this.source,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent
    };
  }

  // إنشاء من كائن
  static fromObject(data) {
    return new Order(data);
  }
}

// حالات الطلب - المراحل الخمس الجديدة
export const ORDER_STATUSES = {
  // المرحلة 1: تم الطلب
  ORDERED: 'ordered',
  // المرحلة 2: تم الدفع
  PAID: 'paid',
  // المرحلة 3: تم الشحن (للمنتجات المادية فقط)
  SHIPPED: 'shipped',
  // المرحلة 4: تم الاستلام
  DELIVERED: 'delivered',
  // المرحلة 5: تم التقييم
  REVIEWED: 'reviewed',
  // حالات إضافية
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  ON_HOLD: 'on_hold'
};

// مراحل الطلب بالعربية
export const ORDER_STAGES = {
  ORDERED: { 
    id: 'ordered', 
    name: 'تم الطلب', 
    description: 'تم استلام طلبك بنجاح',
    icon: '📝',
    color: 'blue'
  },
  PAID: { 
    id: 'paid', 
    name: 'تم الدفع', 
    description: 'تم تأكيد الدفع بنجاح',
    icon: '💳',
    color: 'green'
  },
  SHIPPED: { 
    id: 'shipped', 
    name: 'تم الشحن', 
    description: 'تم شحن طلبك وهو في الطريق إليك',
    icon: '🚚',
    color: 'orange'
  },
  DELIVERED: { 
    id: 'delivered', 
    name: 'تم الاستلام', 
    description: 'تم تسليم طلبك بنجاح',
    icon: '✅',
    color: 'green'
  },
  REVIEWED: { 
    id: 'reviewed', 
    name: 'تم التقييم', 
    description: 'تم تقييم الطلب بنجاح',
    icon: '⭐',
    color: 'purple'
  }
};

// حالات الدفع
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
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



