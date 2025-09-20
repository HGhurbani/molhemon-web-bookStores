// Error Handler System
import logger from './logger.js';
import {
  DEFAULT_LANGUAGE,
  getActiveLanguage,
  resolveLanguage as resolveLanguageCode,
} from './languageUtils.js';

class ErrorHandler {
  constructor() {
    this.errorTypes = {
      NETWORK: 'NETWORK_ERROR',
      AUTH: 'AUTH_ERROR',
      VALIDATION: 'VALIDATION_ERROR',
      FIREBASE: 'FIREBASE_ERROR',
      PAYMENT: 'PAYMENT_ERROR',
      UNKNOWN: 'UNKNOWN_ERROR'
    };
    
    this.errorMessages = {
      ar: {
        NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
        AUTH_ERROR: 'خطأ في المصادقة',
        VALIDATION_ERROR: 'بيانات غير صحيحة',
        FIREBASE_ERROR: 'خطأ في قاعدة البيانات',
        PAYMENT_ERROR: 'خطأ في عملية الدفع',
        UNKNOWN_ERROR: 'خطأ غير معروف',
        
        // رسائل خطأ محددة
        'auth/user-not-found': 'البريد الإلكتروني غير مسجل',
        'auth/wrong-password': 'كلمة المرور غير صحيحة',
        'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
        'auth/weak-password': 'كلمة المرور ضعيفة جداً',
        'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
        'auth/too-many-requests': 'تم تجاوز عدد المحاولات المسموح، حاول لاحقاً',
        'auth/network-request-failed': 'فشل في الاتصال بالشبكة',
        'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول',
        'auth/popup-blocked': 'تم حظر النافذة المنبثقة',
        'auth/permission-denied': 'لا تملك الصلاحية المطلوبة',
        'auth/unavailable': 'الخدمة غير متاحة حالياً',
        'auth/unauthenticated': 'لم يتم تسجيل الدخول',
        'auth/not-found': 'العنصر المطلوب غير موجود',
        'auth/invalid-argument': 'البيانات المرسلة غير صحيحة',
        'auth/resource-exhausted': 'تم استنفاذ الموارد، حاول لاحقاً',
        
        // أخطاء Firebase
        'firebase/not-found': 'المجموعة غير موجودة',
        'firebase/permission-denied': 'لا تملك صلاحية الوصول - يرجى تسجيل الدخول كمدير',
        'firebase/unavailable': 'Firebase غير متاح حالياً',
        'firebase/unauthenticated': 'لم يتم تسجيل الدخول',
        'firebase/invalid-argument': 'معرف العنصر غير صالح',
        'firebase/connection-failed': 'فشل الاتصال بفايربيس',
        'firebase/document-not-found': 'المستند غير موجود',

        // أخطاء العربة
        'cart/not-found': 'السلة غير موجودة',
        'cart/no-shipping-address': 'عنوان الشحن مطلوب',
        'cart/no-physical-items': 'لا توجد عناصر مادية للشحن',
        'cart/invalid-shipping-method': 'طريقة الشحن غير صالحة',
        'cart/invalid-payment-method': 'طريقة الدفع غير صالحة للسلة',
        'cart/invalid-discount': 'كود الخصم غير صالح',
        'cart/expired': 'انتهت صلاحية السلة',
        'cart-item/not-found': 'عنصر السلة غير موجود',

        // أخطاء التكوين
        'config/api-base-url-missing': 'رابط واجهة البرمجة غير مضبوط',

        // أخطاء العملاء
        'customer/not-found': 'العميل غير موجود',

        // أخطاء الإعدادات
        'settings/import-validation-failed': 'فشل التحقق من إعدادات الاستيراد',
        'settings/not-initialized': 'لم يتم تهيئة الإعدادات',
        'settings/validation-failed': 'فشل التحقق من الإعدادات',

        // أخطاء البوابات
        'gateway/not-found': 'بوابة الدفع غير موجودة',

        // أخطاء الطلبات
        'order/not-found': 'الطلب غير موجود',
        'order-not-found': 'الطلب غير موجود',
        'order/cannot-cancel': 'لا يمكن إلغاء الطلب',
        'order/cannot-modify': 'لا يمكن تعديل الطلب',
        'order/invalid-stage-transition': 'انتقال غير صالح بين مراحل الطلب',
        'order/creation-failed': 'فشل إنشاء الطلب',
        'database/order-creation-failed': 'فشل إنشاء الطلب في قاعدة البيانات',

        // أخطاء المنتجات
        'product/not-found': 'المنتج غير موجود',
        'product/not-digital': 'المنتج ليس رقمياً',
        'product/insufficient-stock': 'كمية المنتج غير كافية',

        // أخطاء الشحن
        'shipping/not-found': 'طريقة الشحن غير موجودة',

        // أخطاء الأذونات المحددة
        'permission-denied': 'لا تملك صلاحية الوصول - يرجى تسجيل الدخول كمدير',
        'insufficient-permissions': 'صلاحيات غير كافية - يرجى تسجيل الدخول كمدير',
        
        // أخطاء الشبكة
        'network/failed': 'فشل في الاتصال بالشبكة',
        'network/timeout': 'انتهت مهلة الاتصال',
        'network/offline': 'أنت غير متصل بالإنترنت',
        
        // أخطاء الدفع
        'payment/stripe-error': 'خطأ في معالجة الدفع عبر Stripe',
        'payment/paypal-error': 'خطأ في معالجة الدفع عبر PayPal',
        'payment/insufficient-funds': 'رصيد غير كافي',
        'payment/card-declined': 'تم رفض البطاقة',
        'payment/expired-card': 'البطاقة منتهية الصلاحية',
        'payment/invalid-cvv': 'رمز CVV غير صحيح',
        'payment/not-found': 'الدفعة غير موجودة',
        'payment/cannot-refund': 'لا يمكن استرداد الدفعة',
        'payment/unsupported-method': 'طريقة الدفع غير مدعومة',
        
        // أخطاء التحقق
        'validation/required': 'هذا الحقل مطلوب',
        'validation/email': 'البريد الإلكتروني غير صحيح',
        'validation/password': 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        'validation/phone': 'رقم الهاتف غير صحيح',
        'validation/price': 'السعر يجب أن يكون رقم موجب',
        'validation/isbn': 'رقم ISBN غير صحيح',
        'validation/date': 'التاريخ غير صحيح',
        'validation/file-size': 'حجم الملف كبير جداً',
        'validation/file-type': 'نوع الملف غير مدعوم',
        'validation/customer-creation-invalid': 'بيانات إنشاء العميل غير صالحة',
        'validation/customer-update-invalid': 'بيانات تحديث العميل غير صالحة',
        'validation/customer-invalid': 'بيانات العميل غير صالحة',
        'validation/checkout-invalid': 'بيانات إتمام الطلب غير صالحة',
        'validation/payment-invalid': 'بيانات الدفع غير صالحة',
        'validation/product-invalid': 'بيانات المنتج غير صالحة',
        'validation/shipping-invalid': 'بيانات الشحن غير صالحة',
        'validation/stock-unavailable': 'الكمية المطلوبة غير متوفرة',
        'validation/order-invalid': 'بيانات الطلب غير صالحة',
        'validation/order-missing': 'معلومات الطلب مفقودة',
        'validation/order-id-missing': 'معرف الطلب مطلوب',
        'validation/invalid-order-id': 'معرف الطلب غير صالح',
        'validation/user-id-missing': 'معرف المستخدم مطلوب',
        'validation/invalid-data': 'البيانات غير صالحة',
        'validation/missing-id': 'المعرف مطلوب',

        // أخطاء عامة
        'general/not-found': 'الصفحة المطلوبة غير موجودة',
        'general/server-error': 'خطأ في الخادم',
        'general/maintenance': 'الموقع في صيانة',
        'general/rate-limit': 'تم تجاوز الحد المسموح، حاول لاحقاً'
      },
      en: {
        NETWORK_ERROR: 'Network connection error',
        AUTH_ERROR: 'Authentication error',
        VALIDATION_ERROR: 'Invalid data',
        FIREBASE_ERROR: 'Database error',
        PAYMENT_ERROR: 'Payment processing error',
        UNKNOWN_ERROR: 'Unknown error',
        
        // Specific error messages
        'auth/user-not-found': 'Email not registered',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password too weak',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many attempts, try later',
        'auth/network-request-failed': 'Network connection failed',
        'auth/popup-closed-by-user': 'Login window closed',
        'auth/popup-blocked': 'Popup blocked by browser',
        'auth/permission-denied': 'Permission denied',
        'auth/unavailable': 'Service unavailable',
        'auth/unauthenticated': 'Not authenticated',
        'auth/not-found': 'Item not found',
        'auth/invalid-argument': 'Invalid data sent',
        'auth/resource-exhausted': 'Resources exhausted, try later',
        
        // Firebase errors
        'firebase/not-found': 'Collection not found',
        'firebase/permission-denied': 'Access denied',
        'firebase/unavailable': 'Firebase unavailable',
        'firebase/unauthenticated': 'Not authenticated',
        'firebase/invalid-argument': 'Invalid item ID',
        'firebase/connection-failed': 'Failed to connect to Firebase',
        'firebase/document-not-found': 'Document not found',

        // Cart errors
        'cart/not-found': 'Cart not found',
        'cart/no-shipping-address': 'Shipping address is required',
        'cart/no-physical-items': 'No physical items available for shipping',
        'cart/invalid-shipping-method': 'Invalid shipping method',
        'cart/invalid-payment-method': 'Invalid payment method for cart',
        'cart/invalid-discount': 'Invalid discount code',
        'cart/expired': 'Cart session expired',
        'cart-item/not-found': 'Cart item not found',

        // Configuration errors
        'config/api-base-url-missing': 'API base URL is not configured',

        // Customer errors
        'customer/not-found': 'Customer not found',

        // Settings errors
        'settings/import-validation-failed': 'Settings import validation failed',
        'settings/not-initialized': 'Settings have not been initialized',
        'settings/validation-failed': 'Settings validation failed',

        // Gateway errors
        'gateway/not-found': 'Payment gateway not found',

        // Order errors
        'order/not-found': 'Order not found',
        'order-not-found': 'Order not found',
        'order/cannot-cancel': 'Order cannot be cancelled',
        'order/cannot-modify': 'Order cannot be modified',
        'order/invalid-stage-transition': 'Invalid order stage transition',
        'order/creation-failed': 'Order creation failed',
        'database/order-creation-failed': 'Failed to create order in the database',

        // Product errors
        'product/not-found': 'Product not found',
        'product/not-digital': 'Product is not digital',
        'product/insufficient-stock': 'Insufficient product stock',

        // Shipping errors
        'shipping/not-found': 'Shipping method not found',

        // Network errors
        'network/failed': 'Network connection failed',
        'network/timeout': 'Connection timeout',
        'network/offline': 'You are offline',
        
        // Payment errors
        'payment/stripe-error': 'Stripe payment error',
        'payment/paypal-error': 'PayPal payment error',
        'payment/insufficient-funds': 'Insufficient funds',
        'payment/card-declined': 'Card declined',
        'payment/expired-card': 'Card expired',
        'payment/invalid-cvv': 'Invalid CVV',
        'payment/not-found': 'Payment not found',
        'payment/cannot-refund': 'Payment cannot be refunded',
        'payment/unsupported-method': 'Unsupported payment method',

        // Validation errors
        'validation/required': 'This field is required',
        'validation/email': 'Invalid email address',
        'validation/password': 'Password must be at least 8 characters',
        'validation/phone': 'Invalid phone number',
        'validation/price': 'Price must be a positive number',
        'validation/isbn': 'Invalid ISBN number',
        'validation/date': 'Invalid date',
        'validation/file-size': 'File size too large',
        'validation/file-type': 'File type not supported',
        'validation/type': 'Invalid value type',
        'validation/minLength': 'Value is shorter than the minimum length',
        'validation/maxLength': 'Value exceeds the maximum length',
        'validation/pattern': 'Value does not match the required pattern',
        'validation/customer-creation-invalid': 'Customer data is invalid',
        'validation/customer-update-invalid': 'Customer update data is invalid',
        'validation/customer-invalid': 'Customer data is invalid',
        'validation/checkout-invalid': 'Checkout data is invalid',
        'validation/payment-invalid': 'Payment information is invalid',
        'validation/product-invalid': 'Product data is invalid',
        'validation/shipping-invalid': 'Shipping data is invalid',
        'validation/stock-unavailable': 'Requested stock is unavailable',
        'validation/order-invalid': 'Order data is invalid',
        'validation/order-missing': 'Order information is missing',
        'validation/order-id-missing': 'Order ID is required',
        'validation/invalid-order-id': 'Invalid order ID',
        'validation/user-id-missing': 'User ID is required',
        'validation/invalid-data': 'Provided data is invalid',
        'validation/missing-id': 'Identifier is required',
        'validation/email-exists': 'Email already exists',

        // General errors
        'general/not-found': 'Page not found',
        'general/server-error': 'Server error',
        'general/maintenance': 'Site under maintenance',
        'general/rate-limit': 'Rate limit exceeded, try later'
      }
    };

    this.defaultLanguage = DEFAULT_LANGUAGE;
    this.languageResolver = () => getActiveLanguage();
  }

  setLanguageResolver(resolver) {
    if (typeof resolver === 'function') {
      this.languageResolver = resolver;
    }
  }

  resolveLanguage(language) {
    if (language) {
      return resolveLanguageCode(language);
    }

    if (typeof this.languageResolver === 'function') {
      const resolved = this.languageResolver();
      if (resolved) {
        return resolveLanguageCode(resolved);
      }
    }

    return this.defaultLanguage;
  }

  // تحديد نوع الخطأ
  getErrorType(error) {
    if (error.code && error.code.startsWith('auth/')) {
      return this.errorTypes.AUTH;
    }
    if (error.code && error.code.startsWith('firebase/')) {
      return this.errorTypes.FIREBASE;
    }
    if (error.code && error.code.startsWith('payment/')) {
      return this.errorTypes.PAYMENT;
    }
    if (error.code && error.code.startsWith('validation/')) {
      return this.errorTypes.VALIDATION;
    }
    if (error.message && error.message.includes('network')) {
      return this.errorTypes.NETWORK;
    }
    return this.errorTypes.UNKNOWN;
  }

  // الحصول على رسالة الخطأ
  getErrorMessage(error, language) {
    const resolvedLanguage = this.resolveLanguage(language);
    const lang = this.errorMessages[resolvedLanguage] || this.errorMessages[this.defaultLanguage];
    const fallbackLang = this.errorMessages[this.defaultLanguage];

    // البحث عن رسالة خطأ محددة
    if (error.code) {
      if (lang[error.code]) {
        return lang[error.code];
      }

      if (fallbackLang[error.code]) {
        return fallbackLang[error.code];
      }
    }

    // البحث عن رسالة خطأ عامة
    if (error.message) {
      if (lang[error.message]) {
        return lang[error.message];
      }

      if (fallbackLang[error.message]) {
        return fallbackLang[error.message];
      }
    }

    // استخدام رسالة الخطأ الأصلية
    if (error.message) {
      return error.message;
    }

    // رسالة افتراضية
    const errorType = this.getErrorType(error);
    return (
      lang[errorType] ||
      fallbackLang[errorType] ||
      fallbackLang.UNKNOWN_ERROR
    );
  }

  // معالجة الخطأ وإرجاع كائن منظم
  handleError(error, context = '', language) {
    const errorType = this.getErrorType(error);
    const resolvedLanguage = this.resolveLanguage(language);
    const message = this.getErrorMessage(error, resolvedLanguage);

    const errorObject = {
      type: errorType,
      code: error.code || 'unknown',
      message: message,
      originalError: error,
      context: context,
      language: resolvedLanguage,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };

    // تسجيل الخطأ
    this.logError(errorObject);
    
    return errorObject;
  }

  // تسجيل الأخطاء
  logError(errorObject) {
    const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
    if (env.VITE_APP_ENV === 'development') {
      logger.error('Error Handler:', errorObject);
    }
    
    // يمكن إضافة إرسال الأخطاء إلى خدمة مراقبة الأخطاء هنا
    // مثل Sentry أو LogRocket
  }

  // إنشاء خطأ مخصص
  createError(type, code, message, context = '', language) {
    const error = new Error(message);
    error.code = code;
    error.type = type;
    error.context = context;

    return this.handleError(error, context, language);
  }

  // التحقق من صحة البيانات
  validateData(data, schema) {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      if (rules.required && !value) {
        errors.push(this.createError(
          this.errorTypes.VALIDATION,
          `validation/required`,
          `الحقل ${field} مطلوب`,
          `validation:${field}`
        ));
        continue;
      }
      
      if (value && rules.type && typeof value !== rules.type) {
        errors.push(this.createError(
          this.errorTypes.VALIDATION,
          `validation/type`,
          `الحقل ${field} يجب أن يكون من نوع ${rules.type}`,
          `validation:${field}`
        ));
      }
      
      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(this.createError(
          this.errorTypes.VALIDATION,
          `validation/minLength`,
          `الحقل ${field} يجب أن يكون ${rules.minLength} أحرف على الأقل`,
          `validation:${field}`
        ));
      }
      
      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(this.createError(
          this.errorTypes.VALIDATION,
          `validation/maxLength`,
          `الحقل ${field} يجب أن يكون ${rules.maxLength} أحرف كحد أقصى`,
          `validation:${field}`
        ));
      }
      
      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push(this.createError(
          this.errorTypes.VALIDATION,
          `validation/pattern`,
          `الحقل ${field} لا يطابق النمط المطلوب`,
          `validation:${field}`
        ));
      }
    }
    
    return errors;
  }

  // معالجة أخطاء API
  handleApiError(response, context = '', language) {
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;

      return this.handleError(error, context, language);
    }

    return null;
  }

  // معالجة أخطاء Firebase
  handleFirebaseError(error, context = '', language) {
    if (error.code) {
      return this.handleError(error, context, language);
    }

    // أخطاء عامة
    if (error.message.includes('permission-denied')) {
      error.code = 'firebase/permission-denied';
    } else if (error.message.includes('not-found')) {
      error.code = 'firebase/not-found';
    } else if (error.message.includes('unavailable')) {
      error.code = 'firebase/unavailable';
    }

    return this.handleError(error, context, language);
  }

  // معالجة أخطاء الدفع
  handlePaymentError(error, context = '', language) {
    if (error.code && error.code.startsWith('payment/')) {
      return this.handleError(error, context, language);
    }

    // تحويل أخطاء Stripe
    if (error.type === 'StripeCardError') {
      error.code = `payment/${error.code}`;
    } else if (error.type === 'StripeInvalidRequestError') {
      error.code = 'payment/invalid-request';
    }

    return this.handleError(error, context, language);
  }

  // إعادة المحاولة مع تأخير
  async retryWithDelay(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
}

// إنشاء instance من Error Handler
export const errorHandler = new ErrorHandler();

// Export للاستخدام المباشر
export default errorHandler;

