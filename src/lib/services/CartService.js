/**
 * خدمة سلة التسوق المحسنة
 */

import { errorHandler } from '../errorHandler.js';
import firebaseApi from '../firebaseApi.js';
import ProductService from './ProductService.js';
import StoreSettingsService from './StoreSettingsService.js';

export class CartService {
  constructor() {
    this.collectionName = 'carts';
    this.productService = ProductService;
    this.storeSettings = StoreSettingsService;
  }

  /**
   * إنشاء سلة تسوق جديدة
   */
  async createCart(customerId = null) {
    try {
      const cart = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId,
        userId: customerId, // إضافة userId لقواعد Firestore
        items: [],
        subtotal: 0,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        currency: 'SAR',
        shippingAddress: null,
        billingAddress: null,
        shippingMethod: null,
        paymentMethod: null,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // تنتهي بعد 7 أيام
      };

      // حفظ السلة في Firebase (استخدام المعرف المخصص)
      await firebaseApi.setDocument(this.collectionName, cart.id, cart);

      return cart;

    } catch (error) {
      throw errorHandler.handleError(error, 'cart-creation');
    }
  }

  /**
   * الحصول على سلة التسوق
   */
  async getCart(cartId) {
    try {
      const cartDoc = await firebaseApi.getDocById(this.collectionName, cartId);
      if (!cartDoc) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'cart/not-found',
          'سلة التسوق غير موجودة',
          `cart:${cartId}`
        );
      }

      // التحقق من انتهاء صلاحية السلة
      if (new Date() > new Date(cartDoc.expiresAt)) {
        await this.clearExpiredCart(cartId);
        throw errorHandler.createError(
          'VALIDATION',
          'cart/expired',
          'سلة التسوق منتهية الصلاحية',
          `cart:${cartId}`
        );
      }

      return cartDoc;

    } catch (error) {
      throw errorHandler.handleError(error, `cart:${cartId}`);
    }
  }

  /**
   * الحصول على سلة التسوق مع إنشاء سلة جديدة إذا لم تكن موجودة
   */
  async getOrCreateCart(cartId, customerId) {
    try {
      // محاولة الحصول على السلة الموجودة
      try {
        return await this.getCart(cartId);
      } catch (error) {
        if (error.code === 'cart/not-found' || error.code === 'cart/expired') {
          // إنشاء سلة جديدة إذا لم تكن موجودة أو منتهية الصلاحية
          console.log(`Cart ${cartId} not found or expired, creating new cart for customer ${customerId}`);
          return await this.createCart(customerId);
        }
        throw error;
      }
    } catch (error) {
      throw errorHandler.handleError(error, `cart-get-or-create:${cartId}`);
    }
  }

  /**
   * الحصول على سلة تسوق العميل
   */
  async getCustomerCart(customerId) {
    try {
      const carts = await firebaseApi.getCollection(this.collectionName);
      const customerCart = carts.find(cart => cart.customerId === customerId);
      
      if (!customerCart) {
        // إنشاء سلة جديدة للعميل
        return await this.createCart(customerId);
      }

      // التحقق من انتهاء الصلاحية
      if (new Date() > new Date(customerCart.expiresAt)) {
        await this.clearExpiredCart(customerCart.id);
        return await this.createCart(customerId);
      }

      return customerCart;

    } catch (error) {
      throw errorHandler.handleError(error, `customer-cart:${customerId}`);
    }
  }

  /**
   * إضافة منتج إلى السلة
   */
  async addToCart(cartId, productData) {
    try {
      // استخدام getOrCreateCart لإنشاء سلة جديدة إذا لم تكن موجودة
      const cart = await this.getOrCreateCart(cartId, productData.customerId);
      
      // التحقق من توفر المنتج
      const product = await this.productService.getProductById(productData.productId);
      if (!product) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'product/not-found',
          'المنتج غير موجود',
          `cart-add:${cartId}`
        );
      }

      // التحقق من المخزون للمنتجات المادية
      if (product.type === 'physical') {
        const stockCheck = await this.productService.checkStockAvailability(
          product.id, 
          productData.quantity
        );
        if (!stockCheck.available) {
          throw errorHandler.createError(
            'VALIDATION',
            'product/insufficient-stock',
            stockCheck.message,
            `cart-add:${cartId}`
          );
        }
      }

      // التحقق من وجود المنتج في السلة
      const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex !== -1) {
        // تحديث الكمية
        cart.items[existingItemIndex].quantity += productData.quantity;
        cart.items[existingItemIndex].totalPrice = 
          cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].unitPrice;
      } else {
        // إضافة منتج جديد
        const cartItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          title: product.title,
          type: product.type, // physical, ebook, audio
          unitPrice: product.price,
          quantity: productData.quantity,
          totalPrice: product.price * productData.quantity,
          image: product.image,
          weight: product.weight || 0,
          dimensions: product.dimensions || null,
          metadata: {
            author: product.author,
            isbn: product.isbn,
            format: product.format,
            duration: product.duration, // للكتب الصوتية
            fileSize: product.fileSize // للكتب الإلكترونية
          }
        };
        
        cart.items.push(cartItem);
      }

      // إعادة حساب المجاميع
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-add:${cartId}`);
    }
  }

  /**
   * تحديث كمية منتج في السلة
   */
  async updateCartItemQuantity(cartId, itemId, newQuantity) {
    try {
      const cart = await this.getCart(cartId);
      const itemIndex = cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'cart-item/not-found',
          'المنتج غير موجود في السلة',
          `cart-update:${cartId}`
        );
      }

      const item = cart.items[itemIndex];
      
      // التحقق من المخزون للمنتجات المادية
      if (item.type === 'physical') {
        const stockCheck = await this.productService.checkStockAvailability(
          item.productId, 
          newQuantity
        );
        if (!stockCheck.available) {
          throw errorHandler.createError(
            'VALIDATION',
            'product/insufficient-stock',
            stockCheck.message,
            `cart-update:${cartId}`
          );
        }
      }

      // تحديث الكمية
      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].totalPrice = item.unitPrice * newQuantity;

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        items: cart.items,
        updatedAt: new Date()
      });

      // إعادة حساب المجاميع
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-update:${cartId}`);
    }
  }

  /**
   * إزالة منتج من السلة
   */
  async removeFromCart(cartId, itemId) {
    try {
      const cart = await this.getCart(cartId);
      const itemIndex = cart.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'cart-item/not-found',
          'المنتج غير موجود في السلة',
          `cart-remove:${cartId}`
        );
      }

      // إزالة المنتج
      cart.items.splice(itemIndex, 1);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        items: cart.items,
        updatedAt: new Date()
      });

      // إعادة حساب المجاميع
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-remove:${cartId}`);
    }
  }

  /**
   * إعادة حساب مجاميع السلة
   */
  async recalculateCart(cartId) {
    try {
      const cart = await this.getCart(cartId);
      
      // حساب المجموع الفرعي
      const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // حساب تكلفة الشحن (فقط للمنتجات المادية)
      let shippingCost = 0;
      if (cart.shippingAddress && cart.shippingMethod) {
        const physicalItems = cart.items.filter(item => item.type === 'physical');
        if (physicalItems.length > 0) {
          const totalWeight = physicalItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
          const shippingCalculation = await this.storeSettings.calculateShippingCost(
            cart.shippingAddress.country,
            subtotal,
            totalWeight,
            cart.shippingMethod
          );
          shippingCost = shippingCalculation.cost;
        }
      }

      // حساب الضريبة
      const storeSettings = await this.storeSettings.getStoreSettings();
      let taxAmount = 0;
      if (storeSettings.taxEnabled) {
        taxAmount = subtotal * storeSettings.taxRate;
      }

      // حساب الإجمالي
      const totalAmount = subtotal + shippingCost + taxAmount - (cart.discountAmount || 0);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        subtotal,
        shippingCost,
        taxAmount,
        totalAmount,
        updatedAt: new Date()
      });

      return {
        subtotal,
        shippingCost,
        taxAmount,
        totalAmount
      };

    } catch (error) {
      throw errorHandler.handleError(error, `cart-recalculate:${cartId}`);
    }
  }

  /**
   * تحديث عنوان الشحن
   */
  async updateShippingAddress(cartId, shippingAddress) {
    try {
      const cart = await this.getCart(cartId);
      
      // التحقق من وجود منتجات مادية
      const hasPhysicalItems = cart.items.some(item => item.type === 'physical');
      if (!hasPhysicalItems) {
        throw errorHandler.createError(
          'VALIDATION',
          'cart/no-physical-items',
          'لا توجد منتجات مادية في السلة تتطلب شحناً',
          `cart-shipping:${cartId}`
        );
      }

      // تحديث عنوان الشحن
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        shippingAddress,
        updatedAt: new Date()
      });

      // إعادة حساب الشحن
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-shipping:${cartId}`);
    }
  }

  /**
   * تحديث طريقة الشحن
   */
  async updateShippingMethod(cartId, shippingMethod) {
    try {
      const cart = await this.getCart(cartId);
      
      // التحقق من وجود عنوان شحن
      if (!cart.shippingAddress) {
        throw errorHandler.createError(
          'VALIDATION',
          'cart/no-shipping-address',
          'يجب تحديد عنوان الشحن أولاً',
          `cart-shipping-method:${cartId}`
        );
      }

      // التحقق من صحة طريقة الشحن
      const availableMethods = await this.storeSettings.getAvailableShippingMethods(
        cart.shippingAddress.country,
        cart.subtotal,
        this.calculateTotalWeight(cart.items)
      );

      const isValidMethod = availableMethods.some(method => method.id === shippingMethod);
      if (!isValidMethod) {
        throw errorHandler.createError(
          'VALIDATION',
          'cart/invalid-shipping-method',
          'طريقة الشحن غير متاحة',
          `cart-shipping-method:${cartId}`
        );
      }

      // تحديث طريقة الشحن
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        shippingMethod,
        updatedAt: new Date()
      });

      // إعادة حساب الشحن
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-shipping-method:${cartId}`);
    }
  }

  /**
   * تحديث طريقة الدفع
   */
  async updatePaymentMethod(cartId, paymentMethod) {
    try {
      const cart = await this.getCart(cartId);
      
      // التحقق من صحة طريقة الدفع
      const availableMethods = await this.storeSettings.getAvailablePaymentMethods();
      const isValidMethod = availableMethods.some(method => method.id === paymentMethod);
      
      if (!isValidMethod) {
        throw errorHandler.createError(
          'VALIDATION',
          'cart/invalid-payment-method',
          'طريقة الدفع غير متاحة',
          `cart-payment-method:${cartId}`
        );
      }

      // تحديث طريقة الدفع
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        paymentMethod,
        updatedAt: new Date()
      });

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-payment-method:${cartId}`);
    }
  }

  /**
   * تطبيق خصم على السلة
   */
  async applyDiscount(cartId, discountCode) {
    try {
      const cart = await this.getCart(cartId);
      
      // هنا يتم التحقق من صحة كود الخصم
      // يمكن ربطه بخدمة إدارة الخصومات
      const discount = await this.validateDiscountCode(discountCode);
      
      if (!discount) {
        throw errorHandler.createError(
          'VALIDATION',
          'cart/invalid-discount',
          'كود الخصم غير صحيح',
          `cart-discount:${cartId}`
        );
      }

      // حساب قيمة الخصم
      let discountAmount = 0;
      if (discount.type === 'percentage') {
        discountAmount = (cart.subtotal * discount.value) / 100;
      } else if (discount.type === 'fixed') {
        discountAmount = discount.value;
      }

      // تطبيق الخصم
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        discountCode,
        discountAmount,
        updatedAt: new Date()
      });

      // إعادة حساب المجاميع
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-discount:${cartId}`);
    }
  }

  /**
   * إزالة الخصم من السلة
   */
  async removeDiscount(cartId) {
    try {
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        discountCode: null,
        discountAmount: 0,
        updatedAt: new Date()
      });

      // إعادة حساب المجاميع
      await this.recalculateCart(cartId);

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-discount-remove:${cartId}`);
    }
  }

  /**
   * إضافة ملاحظات للسلة
   */
  async updateNotes(cartId, notes) {
    try {
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        notes,
        updatedAt: new Date()
      });

      return await this.getCart(cartId);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-notes:${cartId}`);
    }
  }

  /**
   * تحديث بيانات السلة
   */
  async updateCart(cartId, updateData) {
    try {
      // استخدام getOrCreateCart لإنشاء سلة جديدة إذا لم تكن موجودة
      const cart = await this.getOrCreateCart(cartId, updateData.customerId);
      
      // تحديث البيانات المسموحة
      const allowedFields = ['shippingAddress', 'billingAddress', 'paymentMethodId', 'shippingMethodId', 'notes'];
      const updateFields = {};
      
      allowedFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          updateFields[field] = updateData[field];
        }
      });
      
      updateFields.updatedAt = new Date();
      
      await firebaseApi.updateCollection(this.collectionName, cart.id, updateFields);

      // إعادة حساب المجاميع إذا تم تحديث عنوان أو طريقة الشحن
      if (updateData.shippingAddress || updateData.shippingMethodId) {
        await this.recalculateCart(cart.id);
      }

      return await this.getCart(cart.id);

    } catch (error) {
      throw errorHandler.handleError(error, `cart-update:${cartId}`);
    }
  }

  /**
   * مسح السلة
   */
  async clearCart(cartId) {
    try {
      await firebaseApi.updateCollection(this.collectionName, cartId, {
        items: [],
        subtotal: 0,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        shippingAddress: null,
        billingAddress: null,
        shippingMethod: null,
        paymentMethod: null,
        notes: '',
        updatedAt: new Date()
      });

      return { success: true, message: 'تم مسح السلة بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `cart-clear:${cartId}`);
    }
  }

  /**
   * حذف السلة
   */
  async deleteCart(cartId) {
    try {
      await firebaseApi.deleteFromCollection(this.collectionName, cartId);
      return { success: true, message: 'تم حذف السلة بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `cart-delete:${cartId}`);
    }
  }

  /**
   * مسح السلات منتهية الصلاحية
   */
  async clearExpiredCart(cartId) {
    try {
      await firebaseApi.deleteFromCollection(this.collectionName, cartId);
      return { success: true, message: 'تم مسح السلة منتهية الصلاحية' };

    } catch (error) {
      throw errorHandler.handleError(error, `cart-expired:${cartId}`);
    }
  }

  /**
   * حساب الوزن الإجمالي للمنتجات المادية
   */
  calculateTotalWeight(items) {
    return items
      .filter(item => item.type === 'physical')
      .reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  }

  /**
   * التحقق من صحة كود الخصم
   */
  async validateDiscountCode(discountCode) {
    try {
      // هنا يتم ربطه بخدمة إدارة الخصومات
      // للآن نعيد قيمة افتراضية
      return {
        code: discountCode,
        type: 'percentage', // percentage, fixed
        value: 10, // 10% خصم
        minAmount: 100,
        maxUses: 1000,
        usedCount: 0,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31')
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * الحصول على إحصائيات السلة
   */
  async getCartStats() {
    try {
      const carts = await firebaseApi.getCollection(this.collectionName);
      
      const stats = {
        total: carts.length,
        active: carts.filter(cart => new Date() <= new Date(cart.expiresAt)).length,
        expired: carts.filter(cart => new Date() > new Date(cart.expiresAt)).length,
        withItems: carts.filter(cart => cart.items.length > 0).length,
        empty: carts.filter(cart => cart.items.length === 0).length,
        totalItems: carts.reduce((sum, cart) => sum + cart.items.length, 0),
        totalValue: carts.reduce((sum, cart) => sum + (cart.totalAmount || 0), 0),
        averageItems: carts.length > 0 ? 
          (carts.reduce((sum, cart) => sum + cart.items.length, 0) / carts.length).toFixed(2) : 0,
        averageValue: carts.length > 0 ? 
          (carts.reduce((sum, cart) => sum + (cart.totalAmount || 0), 0) / carts.length).toFixed(2) : 0
      };

      return stats;

    } catch (error) {
      throw errorHandler.handleError(error, 'cart-stats');
    }
  }
}

export default new CartService();

