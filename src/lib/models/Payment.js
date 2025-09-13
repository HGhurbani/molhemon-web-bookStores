/**
 * نموذج المدفوعات
 */

export class Payment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.orderId = data.orderId || null;
    this.customerId = data.customerId || null;
    this.amount = data.amount || 0;
    this.currency = data.currency || 'SAR';
    this.paymentMethod = data.paymentMethod || null;
    this.paymentMethodId = data.paymentMethodId || null;
    this.paymentStatus = data.paymentStatus || 'pending';
    this.transactionId = data.transactionId || null;
    this.gatewayResponse = data.gatewayResponse || {};
    this.paymentDetails = data.paymentDetails || {};
    
    // معلومات الدفع
    this.cardLast4 = data.cardLast4 || null;
    this.cardBrand = data.cardBrand || null;
    this.cardExpiryMonth = data.cardExpiryMonth || null;
    this.cardExpiryYear = data.cardExpiryYear || null;
    
    // معلومات العميل
    this.customerEmail = data.customerEmail || null;
    this.customerPhone = data.customerPhone || null;
    this.billingAddress = data.billingAddress || {};
    
    // معلومات إضافية
    this.description = data.description || '';
    this.metadata = data.metadata || {};
    this.notes = data.notes || '';
    
    // تواريخ
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.processedAt = data.processedAt || null;
    this.failedAt = data.failedAt || null;
    this.refundedAt = data.refundedAt || null;
    
    // معلومات الاسترداد
    this.refundAmount = data.refundAmount || 0;
    this.refundReason = data.refundReason || '';
    this.refundStatus = data.refundStatus || 'none';
  }

  // تحديث حالة الدفع
  updateStatus(newStatus, additionalData = {}) {
    this.paymentStatus = newStatus;
    this.updatedAt = new Date();
    
    switch (newStatus) {
      case 'processing':
        this.processedAt = new Date();
        break;
      case 'failed':
        this.failedAt = new Date();
        if (additionalData.error) {
          this.gatewayResponse.error = additionalData.error;
        }
        break;
      case 'refunded':
        this.refundedAt = new Date();
        if (additionalData.refundAmount) {
          this.refundAmount = additionalData.refundAmount;
        }
        if (additionalData.refundReason) {
          this.refundReason = additionalData.refundReason;
        }
        break;
    }
  }

  // إضافة معلومات البطاقة
  setCardInfo(cardInfo) {
    this.cardLast4 = cardInfo.last4;
    this.cardBrand = cardInfo.brand;
    this.cardExpiryMonth = cardInfo.expMonth;
    this.cardExpiryYear = cardInfo.expYear;
  }

  // إضافة استجابة البوابة
  setGatewayResponse(response) {
    this.gatewayResponse = response;
    this.transactionId = response.transactionId || response.id;
  }

  // التحقق من صحة الدفع
  validate() {
    const errors = [];
    
    if (!this.orderId) {
      errors.push('معرف الطلب مطلوب');
    }
    
    if (!this.customerId) {
      errors.push('معرف العميل مطلوب');
    }
    
    if (this.amount <= 0) {
      errors.push('مبلغ الدفع يجب أن يكون أكبر من صفر');
    }
    
    if (!this.paymentMethod) {
      errors.push('طريقة الدفع مطلوبة');
    }
    
    return errors;
  }

  // تحويل إلى كائن عادي
  toObject() {
    return {
      id: this.id,
      orderId: this.orderId,
      customerId: this.customerId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      paymentMethodId: this.paymentMethodId,
      paymentStatus: this.paymentStatus,
      transactionId: this.transactionId,
      gatewayResponse: this.gatewayResponse,
      paymentDetails: this.paymentDetails,
      cardLast4: this.cardLast4,
      cardBrand: this.cardBrand,
      cardExpiryMonth: this.cardExpiryMonth,
      cardExpiryYear: this.cardExpiryYear,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      billingAddress: this.billingAddress,
      description: this.description,
      metadata: this.metadata,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      processedAt: this.processedAt,
      failedAt: this.failedAt,
      refundedAt: this.refundedAt,
      refundAmount: this.refundAmount,
      refundReason: this.refundReason,
      refundStatus: this.refundStatus
    };
  }

  // إنشاء من كائن
  static fromObject(data) {
    return new Payment(data);
  }
}

// حالات الدفع
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

// طرق الدفع
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  CRYPTOCURRENCY: 'cryptocurrency',
  MANUAL: 'manual'
};

// حالات الاسترداد
export const REFUND_STATUSES = {
  NONE: 'none',
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};





