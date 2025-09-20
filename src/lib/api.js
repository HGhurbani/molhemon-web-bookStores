import firebaseApi from './firebaseApi';
import firebaseFunctionsApi from './firebaseFunctions';
import { errorHandler } from './errorHandler';
import { getActiveLanguage } from './languageUtils.js';
import CheckoutService from './services/CheckoutService.js';
import OrderService from './services/OrderService.js';
import PaymentService from './services/PaymentService.js';
import ShippingService from './services/ShippingService.js';
import ProductService from './services/ProductService.js';
import StoreSettingsService from './services/StoreSettingsService.js';
import CustomerService from './services/CustomerService.js';
import CartService from './services/CartService.js';
import unifiedPaymentApi from './api/unifiedPaymentApi.js';
import logger from './logger.js';
import * as encryptedCache from './encryptedCache.js';
import homeApi from './firebase/homeApi.js';
import { jwtAuthManager } from './jwtAuth.js';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  '';

const ensureArrayResponse = (payload, key) => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (key && Array.isArray(payload[key])) {
    return payload[key];
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const handleErrorWithLanguage = (error, context) =>
  errorHandler.handleError(error, context, getActiveLanguage());

async function requestUserData(userId, resource, { method = 'GET', body } = {}) {
  const context = `user-data:${resource}:${userId || 'anonymous'}`;

  try {
    if (!userId) {
      throw errorHandler.createError(
        errorHandler.errorTypes.VALIDATION,
        'validation/user-id-missing',
        'معرف المستخدم مطلوب لمزامنة البيانات',
        context
      );
    }

    if (!API_BASE_URL) {
      throw errorHandler.createError(
        errorHandler.errorTypes.UNKNOWN,
        'config/api-base-url-missing',
        'لم يتم تكوين عنوان الخادم لواجهات البرمجة',
        context
      );
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    if (jwtAuthManager && typeof jwtAuthManager.getIdToken === 'function') {
      const token = await jwtAuthManager.getIdToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/${resource}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const message = await response.text().catch(() => '');
      const errorMessage = message || `فشل في معالجة طلب ${resource}`;
      throw errorHandler.createError(
        errorHandler.errorTypes.NETWORK,
        `api/${resource}-${response.status}`,
        errorMessage,
        context
      );
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    throw handleErrorWithLanguage(error, context);
  }
}

const userDataApi = {
  getFavorites: async (userId) => {
    try {
      const response = await requestUserData(userId, 'favorites');
      return ensureArrayResponse(response, 'favorites');
    } catch (error) {
      throw handleErrorWithLanguage(error, `user-data:get-favorites:${userId}`);
    }
  },

  saveFavorites: async (userId, favorites = []) => {
    try {
      const response = await requestUserData(userId, 'favorites', {
        method: 'PUT',
        body: {
          favorites,
          updatedAt: new Date().toISOString()
        }
      });
      return response == null ? favorites : ensureArrayResponse(response, 'favorites');
    } catch (error) {
      throw handleErrorWithLanguage(error, `user-data:save-favorites:${userId}`);
    }
  },

  getCart: async (userId) => {
    try {
      const response = await requestUserData(userId, 'cart');
      return ensureArrayResponse(response, 'items');
    } catch (error) {
      throw handleErrorWithLanguage(error, `user-data:get-cart:${userId}`);
    }
  },

  saveCart: async (userId, cartItems = []) => {
    try {
      const response = await requestUserData(userId, 'cart', {
        method: 'PUT',
        body: {
          items: cartItems,
          updatedAt: new Date().toISOString()
        }
      });
      return response == null ? cartItems : ensureArrayResponse(response, 'items');
    } catch (error) {
      throw handleErrorWithLanguage(error, `user-data:save-cart:${userId}`);
    }
  }
};

// Firebase API هو الآن الخيار الوحيد مع Functions
const api = {
  ...firebaseApi,
  ...firebaseFunctionsApi,
  home: homeApi,

  // الحصول على الإعدادات مع كاش مشفر اختياري
  getSettings: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = await encryptedCache.getItem('siteSettings');
        if (cached) {
          return cached;
        }
      }
      const settings = await firebaseApi.getSettings();
      await encryptedCache.setItem('siteSettings', settings);
      return settings;
    } catch (error) {
      throw handleErrorWithLanguage(error, 'settings:get');
    }
  },

  // Google Merchant import - سيتم تنفيذها عبر Firebase Functions
  importGoogleMerchant: async (cfg = {}) => {
    const context = 'google-merchant:import';
    try {
      const result = await firebaseFunctionsApi.googleMerchant.importCatalog(cfg);

      if (!result?.success) {
        throw errorHandler.createError(
          errorHandler.errorTypes.UNKNOWN,
          result?.errorCode || 'google-merchant/import-failed',
          result?.message || 'فشل استيراد Google Merchant',
          context
        );
      }

      return result;
    } catch (error) {
      throw handleErrorWithLanguage(error, context);
    }
  },

  // Stripe Payment Intent - تم تحديثها لاستخدام Firebase Functions
  createStripePaymentIntent: async (data) => {
    try {
      return await firebaseFunctionsApi.payments.createStripeIntent(data);
    } catch (error) {
      throw handleErrorWithLanguage(error, 'stripe:payment-intent');
    }
  },

  // PayPal Order - تم تحديثها لاستخدام Firebase Functions
  createPayPalOrder: async (data) => {
    try {
      return await firebaseFunctionsApi.payments.createPayPalOrder(data);
    } catch (error) {
      throw handleErrorWithLanguage(error, 'paypal:order');
    }
  },

  // تحديث الإعدادات مع معالجة أخطاء محسنة
  updateSettings: async (settings) => {
    try {
      // التحقق من صحة البيانات
      const validationSchema = {
        siteName: { required: true, type: 'string', minLength: 2 },
        description: { required: true, type: 'string', minLength: 10 },
        defaultLanguage: { required: true, type: 'string' },
        adminDefaultLanguage: { required: true, type: 'string' },
        defaultCurrency: { required: true, type: 'string' }
      };

      const validationErrors = errorHandler.validateData(settings, validationSchema);
      if (validationErrors.length > 0) {
        throw validationErrors[0];
      }

      // اختبار اتصال Firebase
      try {
        const testDoc = await firebaseApi.getSettings();
      } catch (testError) {
        throw errorHandler.createError(
          'FIREBASE',
          'firebase/connection-failed',
          'لا يمكن الاتصال بـ Firebase. تحقق من اتصالك بالإنترنت وإعدادات Firebase.',
          'settings:update:connection-test'
        );
      }
      
      // تحديث الإعدادات عبر Firebase
      const result = await firebaseApi.updateSettings(settings);

      // تخزين في كاش مشفر للوصول السريع
      await encryptedCache.setItem('siteSettings', settings);

      return result;
    } catch (error) {
      throw handleErrorWithLanguage(error, 'settings:update');
    }
  },

  // دوال إضافية للتحقق من صحة البيانات
  validateBookData: (bookData) => {
    const schema = {
      title: { required: true, type: 'string', minLength: 2 },
      author: { required: true, type: 'string', minLength: 2 },
      price: { required: true, type: 'number', min: 0 },
      category: { required: true, type: 'string' },
      description: { required: true, type: 'string', minLength: 10 }
    };
    
    return errorHandler.validateData(bookData, schema);
  },

  validateUserData: (userData) => {
    const schema = {
      email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      displayName: { required: true, type: 'string', minLength: 2 },
      phone: { required: false, type: 'string', pattern: /^[\+]?[1-9][\d]{0,15}$/ }
    };
    
    return errorHandler.validateData(userData, schema);
  },

  // === خدمات إدارة الطلبات الجديدة ===

  // خدمة إدارة الطلبات
  orders: {
    // إنشاء طلب جديد
    create: async (orderData) => {
      try {
        return await CheckoutService.createOrderWithCheckout(orderData);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'order:create');
      }
    },

    // معالجة الطلب مع Firebase Functions
    process: async (orderData, paymentData) => {
      try {
        return await firebaseFunctionsApi.orders.process(orderData, paymentData);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'order:process');
      }
    },

    // الحصول على طلب بواسطة المعرف
    getById: async (orderId) => {
      try {
        return await CheckoutService.getOrderDetails(orderId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:get:${orderId}`);
      }
    },

    // الحصول على طلبات العميل
    getCustomerOrders: async (customerId, status = null) => {
      try {
        return await CheckoutService.getCustomerOrders(customerId, status);
      } catch (error) {
        throw handleErrorWithLanguage(error, `orders:customer:${customerId}`);
      }
    },

    // تحديث حالة الطلب
    updateStatus: async (orderId, newStatus, notes = '') => {
      try {
        return await CheckoutService.updateOrderStatus(orderId, newStatus, notes);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:status:${orderId}`);
      }
    },

    // تحديث مرحلة الطلب
    updateStage: async (orderId, newStage, notes = '') => {
      try {
        return await OrderService.updateOrderStage(orderId, newStage, notes);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:stage:${orderId}`);
      }
    },

    // إلغاء الطلب
    cancel: async (orderId, reason = '') => {
      try {
        return await CheckoutService.cancelOrder(orderId, reason);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:cancel:${orderId}`);
      }
    },

    // إضافة منتج إلى الطلب
    addItem: async (orderId, itemData) => {
      try {
        return await CheckoutService.addItemToOrder(orderId, itemData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:add-item:${orderId}`);
      }
    },

    // إزالة منتج من الطلب
    removeItem: async (orderId, itemId) => {
      try {
        return await CheckoutService.removeItemFromOrder(orderId, itemId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:remove-item:${orderId}`);
      }
    },

    // إعادة حساب إجمالي الطلب
    recalculateTotal: async (orderId) => {
      try {
        return await CheckoutService.recalculateOrderTotal(orderId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:recalculate:${orderId}`);
      }
    },

    // الحصول على إحصائيات الطلبات
    getStats: async (customerId = null) => {
      try {
        return await CheckoutService.getOrderStats(customerId);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'orders:stats');
      }
    },

    // معالجة إتمام الطلب
    processCheckout: async (cartId, checkoutData) => {
      try {
        // التحقق من صحة البيانات أولاً
        if (!checkoutData.customerInfo) {
          throw new Error('معلومات العميل مطلوبة');
        }
        
        if (!checkoutData.customerInfo.name || checkoutData.customerInfo.name.trim() === '') {
          throw new Error('اسم العميل مطلوب');
        }
        
        if (!checkoutData.customerInfo.email || checkoutData.customerInfo.email.trim() === '') {
          throw new Error('البريد الإلكتروني مطلوب');
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(checkoutData.customerInfo.email)) {
          throw new Error('البريد الإلكتروني غير صحيح');
        }
        
        if (!checkoutData.items || checkoutData.items.length === 0) {
          throw new Error('يجب أن يحتوي الطلب على منتج واحد على الأقل');
        }
        
        // إنشاء الطلب باستخدام CheckoutService
        const orderResult = await CheckoutService.createOrderWithCheckout({
          customerId: checkoutData.customerId,
          customerInfo: checkoutData.customerInfo,
          items: checkoutData.items,
          shippingAddress: checkoutData.shippingAddress,
          shippingMethod: checkoutData.shippingMethod,
          paymentMethod: checkoutData.paymentMethod,
          paymentDetails: {
            paymentIntentId: checkoutData.paymentIntentId
          },
          notes: checkoutData.notes || ''
        });
        
        // التحقق من وجود الطلب في النتيجة
        if (!orderResult || !orderResult.order) {
          throw new Error('فشل في إنشاء الطلب - لم يتم إرجاع بيانات الطلب');
        }

        // التحقق من وجود معرف الطلب
        if (!orderResult.order.id) {
          logger.error('API - Order ID is missing in result:', orderResult);
          throw new Error('فشل في الحصول على معرف الطلب من الخادم');
        }

        logger.debug('API - Order result:', {
          hasOrder: !!orderResult.order,
          orderId: orderResult.order.id,
          orderNumber: orderResult.order.orderNumber
        });

        return {
          id: orderResult.order.id,
          orderNumber: orderResult.order.orderNumber,
          success: true,
          order: orderResult.order
        };
      } catch (error) {
        throw handleErrorWithLanguage(error, 'order:checkout');
      }
    },

    // الحصول على جميع الطلبات
    getAll: async (filters = {}) => {
      try {
        return await OrderService.getAllOrders(filters);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'orders:get-all');
      }
    },

    // الحصول على طلبات العميل (مختصر)
    getOrders: async (customerId = null) => {
      try {
        if (customerId) {
          return await CheckoutService.getCustomerOrders(customerId);
        } else {
          return await OrderService.getAllOrders();
        }
      } catch (error) {
        throw handleErrorWithLanguage(error, 'orders:get');
      }
    },

    // تحديث عنصر في الطلب
    updateOrderItem: async (itemId, updateData) => {
      try {
        return await OrderService.updateOrderItem(itemId, updateData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order-item:update:${itemId}`);
      }
    },

    // حذف طلب
    delete: async (orderId) => {
      try {
        return await OrderService.deleteOrder(orderId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:delete:${orderId}`);
      }
    },

    // استرداد المبلغ
    refundPayment: async (orderId, refundData) => {
      try {
        return await OrderService.refundOrderPayment(orderId, refundData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `order:refund:${orderId}`);
      }
    }
  },

  // خدمة إدارة المدفوعات - تم تحديثها لاستخدام النظام الموحد
  payments: {
    // إنشاء عملية دفع
    create: async (paymentData) => {
      try {
        return await unifiedPaymentApi.createPaymentIntent(paymentData);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'payment:create');
      }
    },

    // معالجة الدفع
    process: async (paymentId, paymentMethodData) => {
      try {
        return await unifiedPaymentApi.confirmPayment(paymentId, paymentMethodData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:process:${paymentId}`);
      }
    },

    // الحصول على دفع بواسطة المعرف
    getById: async (paymentId) => {
      try {
        return await unifiedPaymentApi.getPaymentById(paymentId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:get:${paymentId}`);
      }
    },

    // تحديث حالة الدفع
    updateStatus: async (paymentId, newStatus, additionalData = {}) => {
      try {
        // في النظام الموحد، يتم تحديث الحالة تلقائياً
        return await unifiedPaymentApi.getPaymentById(paymentId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:status:${paymentId}`);
      }
    },

    // استرداد الدفع
    refund: async (paymentId, amount, reason = '') => {
      try {
        return await unifiedPaymentApi.refundPayment(paymentId, amount, reason);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:refund:${paymentId}`);
      }
    },

    // الحصول على إحصائيات المدفوعات
    getStats: async (customerId = null) => {
      try {
        return await unifiedPaymentApi.getPaymentStats(customerId);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'payments:stats');
      }
    },

    // الحصول على طرق الدفع المتاحة
    getAvailableMethods: async (orderData) => {
      try {
        return await unifiedPaymentApi.getAvailablePaymentMethods(orderData);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'payment:methods:get');
      }
    },

    // اختبار اتصال مزود محدد
    testProviderConnection: async (providerName) => {
      try {
        return await unifiedPaymentApi.testProviderConnection(providerName);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:provider-test:${providerName}`);
      }
    },

    // تحديث إعدادات المدفوعات
    updateSettings: async (settings) => {
      try {
        return await unifiedPaymentApi.updatePaymentSettings(settings);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'payment:settings:update');
      }
    },

    // الحصول على مزودي المدفوعات
    getProviders: async () => {
      try {
        return await unifiedPaymentApi.getPaymentProviders();
      } catch (error) {
        throw handleErrorWithLanguage(error, 'payment:providers:get');
      }
    },

    // إنشاء عميل
    createCustomer: async (providerName, customerData) => {
      try {
        return await unifiedPaymentApi.createCustomer(providerName, customerData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:customer-create:${providerName}`);
      }
    },

    // حفظ طريقة دفع للعميل
    savePaymentMethod: async (providerName, customerId, paymentMethodData) => {
      try {
        return await unifiedPaymentApi.savePaymentMethod(providerName, customerId, paymentMethodData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:method-save:${providerName}`);
      }
    },

    // الحصول على طرق الدفع المحفوظة للعميل
    getCustomerPaymentMethods: async (providerName, customerId) => {
      try {
        return await unifiedPaymentApi.getCustomerPaymentMethods(providerName, customerId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:customer-methods:${providerName}`);
      }
    },

    // حذف طريقة دفع محفوظة
    deletePaymentMethod: async (providerName, customerId, paymentMethodId) => {
      try {
        return await unifiedPaymentApi.deletePaymentMethod(providerName, customerId, paymentMethodId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:method-delete:${providerName}`);
      }
    },

    // حساب رسوم الدفع
    calculateFees: async (amount, providerName) => {
      try {
        return await unifiedPaymentApi.calculatePaymentFees(amount, providerName);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:fees:${providerName}`);
      }
    },

    // التحقق من توفر طريقة الدفع
    isMethodAvailable: async (providerName, orderData) => {
      try {
        return await unifiedPaymentApi.isPaymentMethodAvailable(providerName, orderData);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:method-availability:${providerName}`);
      }
    },

    // معالجة Webhook
    handleWebhook: async (providerName, webhookData, signature) => {
      try {
        return await unifiedPaymentApi.handleWebhook(providerName, webhookData, signature);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:webhook:${providerName}`);
      }
    },

    // إلغاء الدفع
    cancel: async (paymentId, reason = '') => {
      try {
        return await unifiedPaymentApi.cancelPayment(paymentId, reason);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:cancel:${paymentId}`);
      }
    },

    // الحصول على معلومات مزود محدد
    getProviderInfo: async (providerName) => {
      try {
        return await unifiedPaymentApi.getProviderInfo(providerName);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:provider-info:${providerName}`);
      }
    },

    // الحصول على سجل العمليات
    getLogs: async (paymentId, limit = 10) => {
      try {
        return await unifiedPaymentApi.getPaymentLogs(paymentId, limit);
      } catch (error) {
        throw handleErrorWithLanguage(error, `payment:logs:${paymentId}`);
      }
    }
  },

  // خدمة إدارة الشحن
  shipping: {
    // إنشاء معلومات شحن
    create: async (shippingData) => {
      try {
        return await ShippingService.createShipping(shippingData);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'shipping:create');
      }
    },

    // حساب تكلفة الشحن باستخدام Firebase Functions
    calculateCost: async (orderItems, shippingAddress, shippingMethod) => {
      try {
        return await firebaseFunctionsApi.shipping.calculate(orderItems, shippingAddress, shippingMethod);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'shipping:cost-calculation');
      }
    },

    // الحصول على طرق الشحن المتاحة
    getAvailableMethods: (country, orderTotal) => {
      return ShippingService.getAvailableShippingMethods(country, orderTotal);
    },

    // تحديث حالة الشحن
    updateStatus: async (shippingId, newStatus, notes = '') => {
      try {
        return await ShippingService.updateShippingStatus(shippingId, newStatus, notes);
      } catch (error) {
        throw handleErrorWithLanguage(error, `shipping:status:${shippingId}`);
      }
    },

    // إضافة رقم التتبع
    addTracking: async (shippingId, trackingNumber, shippingCompany = null) => {
      try {
        return await ShippingService.addTrackingNumber(shippingId, trackingNumber, shippingCompany);
      } catch (error) {
        throw handleErrorWithLanguage(error, `shipping:tracking:${shippingId}`);
      }
    },

    // الحصول على إحصائيات الشحن
    getStats: async () => {
      try {
        return await ShippingService.getShippingStats();
      } catch (error) {
        throw handleErrorWithLanguage(error, 'shipping:stats');
      }
    }
  },

  // خدمة إدارة المنتجات
  products: {
    // إنشاء منتج جديد
    create: async (productData) => {
      try {
        return await ProductService.createProduct(productData);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'product:create');
      }
    },

    // الحصول على منتج بواسطة المعرف
    getById: async (productId) => {
      try {
        return await ProductService.getProductById(productId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `product:get:${productId}`);
      }
    },

    // الحصول على جميع المنتجات
    getAll: async (filters = {}) => {
      try {
        return await ProductService.getAllProducts(filters);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'products:get-all');
      }
    },

    // البحث في المنتجات
    search: async (query, filters = {}) => {
      try {
        return await ProductService.searchProducts(query, filters);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'products:search');
      }
    },

    // الحصول على المنتجات حسب النوع
    getByType: async (type) => {
      try {
        return await ProductService.getProductsByType(type);
      } catch (error) {
        throw handleErrorWithLanguage(error, `products:type:${type}`);
      }
    },

    // تحديث المخزون باستخدام Firebase Functions
    updateStock: async (productId, quantity, operation = 'decrease') => {
      try {
        return await firebaseFunctionsApi.inventory.updateStock(productId, quantity, operation);
      } catch (error) {
        throw handleErrorWithLanguage(error, `product:stock:${productId}`);
      }
    },

    // التحقق من توفر المخزون
    checkStock: async (productId, requestedQuantity) => {
      try {
        return await ProductService.checkStockAvailability(productId, requestedQuantity);
      } catch (error) {
        throw handleErrorWithLanguage(error, `product:stock-check:${productId}`);
      }
    },

    // الحصول على المنتجات الأكثر مبيعاً
    getBestSellers: async (limit = 10) => {
      try {
        return await ProductService.getBestSellers(limit);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'products:best-sellers');
      }
    },

    // الحصول على المنتجات الجديدة
    getNew: async (limit = 10) => {
      try {
        return await ProductService.getNewProducts(limit);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'products:new');
      }
    },

    // الحصول على المنتجات المخفضة
    getDiscounted: async (limit = 10) => {
      try {
        return await ProductService.getDiscountedProducts(limit);
      } catch (error) {
        throw handleErrorWithLanguage(error, 'products:discounted');
      }
    },

    // الحصول على إحصائيات المنتجات
    getStats: async () => {
      try {
        return await ProductService.getProductStats();
      } catch (error) {
        throw handleErrorWithLanguage(error, 'products:stats');
      }
    },

    // إنشاء رابط تحميل للمنتج
    generateDownloadUrl: async (productId, orderId) => {
      try {
        return await ProductService.generateDownloadUrl(productId, orderId);
      } catch (error) {
        throw handleErrorWithLanguage(error, `product:download-url:${productId}`);
      }
    }
  },

  // دالة للتحقق من حالة الاتصال
  checkConnection: async () => {
    try {
      await firebaseApi.getSettings();
      return { connected: true, message: 'متصل بـ Firebase بنجاح' };
    } catch (error) {
      return { 
        connected: false, 
        message: errorHandler.getErrorMessage(error),
        error: handleErrorWithLanguage(error, 'connection:check')
      };
    }
  },

  // دالة لإعادة المحاولة مع تأخير
  retryOperation: async (operation, maxRetries = 3, delay = 1000) => {
    return errorHandler.retryWithDelay(operation, maxRetries, delay);
  },

  // === خدمات إعدادات المتجر والعملاء ===
  storeSettings: StoreSettingsService,
  customers: CustomerService,
  
  // دوال مساعدة للعملاء
  getOrCreateCustomer: async (customerId, userData = {}) => {
    try {
      return await CustomerService.getOrCreateCustomer(customerId, userData);
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:get-or-create-customer:${customerId}`);
    }
  },
  
  // دالة مساعدة لإضافة عنوان للعميل
  addCustomerAddress: async (customerId, addressData, userData = {}) => {
    try {
      return await CustomerService.addCustomerAddress(customerId, addressData, userData);
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:add-customer-address:${customerId}`);
    }
  },
  
  // دالة مساعدة لإضافة طريقة دفع للعميل
  addCustomerPaymentMethod: async (customerId, paymentData) => {
    try {
      return await CustomerService.addCustomerPaymentMethod(customerId, paymentData);
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:add-customer-payment:${customerId}`);
    }
  },
  
  // دالة مساعدة لتحديث بيانات العميل
  updateCustomer: async (customerId, updateData) => {
    try {
      return await CustomerService.updateCustomer(customerId, updateData);
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:update-customer:${customerId}`);
    }
  },
  
  // دالة مساعدة للحصول على بيانات العميل
  getCustomer: async (customerId) => {
    try {
      return await CustomerService.getCustomerById(customerId);
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:get-customer:${customerId}`);
    }
  },
  
  // دالة مساعدة للحصول على عناوين العميل
  getCustomerAddresses: async (customerId) => {
    try {
      const customer = await CustomerService.getOrCreateCustomer(customerId);
      return customer.addresses || [];
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:get-customer-addresses:${customerId}`);
    }
  },
  
  // دالة مساعدة للحصول على طرق دفع العميل
  getCustomerPaymentMethods: async (customerId) => {
    try {
      const customer = await CustomerService.getOrCreateCustomer(customerId);
      return customer.paymentMethods || [];
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:get-customer-payment-methods:${customerId}`);
    }
  },
  
  // دالة مساعدة للحصول على بيانات العميل الكاملة
  getCustomerData: async (customerId, userData = {}) => {
    try {
      // محاولة جلب العميل الموجود أولاً
      try {
        const customer = await CustomerService.getCustomerById(customerId);
        return {
          ...customer,
          addresses: customer.addresses || [],
          paymentMethods: customer.paymentMethods || []
        };
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إذا لم يكن العميل موجوداً، إنشاؤه مع البيانات الممررة
          const customer = await CustomerService.getOrCreateCustomer(customerId, userData);
          return {
            ...customer,
            addresses: customer.addresses || [],
            paymentMethods: customer.paymentMethods || []
          };
        } else {
          throw error;
        }
      }
    } catch (error) {
      throw handleErrorWithLanguage(error, `api:get-customer-data:${customerId}`);
    }
  },
  userData: userDataApi,
  cart: CartService
};

export default api;
