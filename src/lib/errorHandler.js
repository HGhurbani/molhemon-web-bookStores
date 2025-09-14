// Error Handler System
import logger from './logger.js';

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
        
        // General errors
        'general/not-found': 'Page not found',
        'general/server-error': 'Server error',
        'general/maintenance': 'Site under maintenance',
        'general/rate-limit': 'Rate limit exceeded, try later'
      }
    };
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
  getErrorMessage(error, language = 'ar') {
    const lang = this.errorMessages[language] || this.errorMessages.ar;
    
    // البحث عن رسالة خطأ محددة
    if (error.code && lang[error.code]) {
      return lang[error.code];
    }
    
    // البحث عن رسالة خطأ عامة
    if (error.message && lang[error.message]) {
      return lang[error.message];
    }
    
    // استخدام رسالة الخطأ الأصلية
    if (error.message) {
      return error.message;
    }
    
    // رسالة افتراضية
    return lang[this.getErrorType(error)];
  }

  // معالجة الخطأ وإرجاع كائن منظم
  handleError(error, context = '') {
    const errorType = this.getErrorType(error);
    const message = this.getErrorMessage(error);
    
    const errorObject = {
      type: errorType,
      code: error.code || 'unknown',
      message: message,
      originalError: error,
      context: context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    
    // تسجيل الخطأ
    this.logError(errorObject);
    
    return errorObject;
  }

  // تسجيل الأخطاء
  logError(errorObject) {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      logger.error('Error Handler:', errorObject);
    }
    
    // يمكن إضافة إرسال الأخطاء إلى خدمة مراقبة الأخطاء هنا
    // مثل Sentry أو LogRocket
  }

  // إنشاء خطأ مخصص
  createError(type, code, message, context = '') {
    const error = new Error(message);
    error.code = code;
    error.type = type;
    error.context = context;
    
    return this.handleError(error, context);
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
  handleApiError(response, context = '') {
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      
      return this.handleError(error, context);
    }
    
    return null;
  }

  // معالجة أخطاء Firebase
  handleFirebaseError(error, context = '') {
    if (error.code) {
      return this.handleError(error, context);
    }
    
    // أخطاء عامة
    if (error.message.includes('permission-denied')) {
      error.code = 'firebase/permission-denied';
    } else if (error.message.includes('not-found')) {
      error.code = 'firebase/not-found';
    } else if (error.message.includes('unavailable')) {
      error.code = 'firebase/unavailable';
    }
    
    return this.handleError(error, context);
  }

  // معالجة أخطاء الدفع
  handlePaymentError(error, context = '') {
    if (error.code && error.code.startsWith('payment/')) {
      return this.handleError(error, context);
    }
    
    // تحويل أخطاء Stripe
    if (error.type === 'StripeCardError') {
      error.code = `payment/${error.code}`;
    } else if (error.type === 'StripeInvalidRequestError') {
      error.code = 'payment/invalid-request';
    }
    
    return this.handleError(error, context);
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

