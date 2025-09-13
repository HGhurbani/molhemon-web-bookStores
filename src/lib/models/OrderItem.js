/**
 * نموذج عنصر الطلب
 */

export class OrderItem {
  constructor(data = {}) {
    this.id = data.id || null;
    this.orderId = data.orderId || null; // معرف الطلب المرتبط
    this.productId = data.productId || null;
    this.productType = data.productType || 'physical'; // physical, ebook, audio
    this.title = data.title || '';
    this.author = data.author || '';
    this.quantity = data.quantity || 1;
    this.unitPrice = data.unitPrice || 0;
    this.totalPrice = data.totalPrice || 0;
    this.currency = data.currency || 'SAR';
    
    // خصائص المنتجات المادية
    this.weight = data.weight || 0; // بالكيلوغرام
    this.dimensions = data.dimensions || { length: 0, width: 0, height: 0 };
    
      // خصائص المنتجات الرقمية
  this.downloadUrl = data.downloadUrl || null;
  this.accessExpiry = data.accessExpiry || null;
  this.fileSize = data.fileSize || null;
  this.isDelivered = data.isDelivered || false;
  this.deliveredAt = data.deliveredAt || null;
    
    // خصائص إضافية
    this.coverImage = data.coverImage || '';
    this.isbn = data.isbn || '';
    this.publisher = data.publisher || '';
    this.format = data.format || '';
    
    // حالة العنصر
    this.status = data.status || 'active';
    this.notes = data.notes || '';
    
    // تواريخ
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // حساب السعر الإجمالي
  calculateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
    return this.totalPrice;
  }

  // التحقق من نوع المنتج
  isPhysical() {
    return this.productType === 'physical';
  }

  isEbook() {
    return this.productType === 'ebook';
  }

  isAudiobook() {
    return this.productType === 'audiobook';
  }

  isDigital() {
    return this.productType === 'ebook' || this.productType === 'audiobook';
  }

  // تسليم المنتج الرقمي
  deliverDigitalProduct(downloadUrl, accessExpiry = null) {
    if (this.isDigital()) {
      this.downloadUrl = downloadUrl;
      this.accessExpiry = accessExpiry;
      this.isDelivered = true;
      this.deliveredAt = new Date();
      this.updatedAt = new Date();
    }
  }

  // التحقق من تسليم المنتج الرقمي
  isDigitalDelivered() {
    return this.isDigital() && this.isDelivered && this.downloadUrl;
  }

  // التحقق من صحة العنصر
  validate() {
    const errors = [];
    
    if (!this.productId) {
      errors.push('معرف المنتج مطلوب');
    }
    
    if (!this.title) {
      errors.push('عنوان المنتج مطلوب');
    }
    
    if (this.quantity <= 0) {
      errors.push('الكمية يجب أن تكون أكبر من صفر');
    }
    
    if (this.unitPrice < 0) {
      errors.push('السعر يجب أن يكون أكبر من أو يساوي صفر');
    }
    
    if (this.isPhysical() && this.weight < 0) {
      errors.push('الوزن يجب أن يكون أكبر من أو يساوي صفر');
    }
    
    return errors;
  }

  // تحويل إلى كائن عادي
  toObject() {
    return {
      id: this.id,
      orderId: this.orderId, // إضافة orderId
      productId: this.productId,
      productType: this.productType,
      productName: this.title, // إضافة productName للتوافق
      title: this.title,
      author: this.author,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
      currency: this.currency,
      weight: this.weight,
      dimensions: this.dimensions,
      downloadUrl: this.downloadUrl,
      accessExpiry: this.accessExpiry,
      fileSize: this.fileSize,
      isDelivered: this.isDelivered,
      deliveredAt: this.deliveredAt,
      coverImage: this.coverImage,
      isbn: this.isbn,
      publisher: this.publisher,
      format: this.format,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // إنشاء من كائن
  static fromObject(data) {
    return new OrderItem(data);
  }
}



