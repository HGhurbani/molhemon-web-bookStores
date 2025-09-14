/**
 * خدمة إدارة الطلبات
 */

import { Order } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';
import { Payment } from '../models/Payment.js';
import { Shipping } from '../models/Shipping.js';
import schemas from '../../../functions/schemas.js';
import { errorHandler } from '../errorHandler.js';
import firebaseApi from '../firebaseApi.js';
import logger from '../logger.js';

import { runTransaction, doc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

const { Schemas, validateData } = schemas;

export class OrderService {
  constructor() {
    this.collectionName = 'orders';
  }

  /**
   * إنشاء طلب جديد
   */
  async createOrder(orderData) {
    try {
      // إنشاء نموذج الطلب
      const order = new Order(orderData);
      
      // التحقق من صحة البيانات باستخدام المخطط الموحد
      const validationErrors = validateData(orderData, Schemas.Order);
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/order-invalid',
          `خطأ في بيانات الطلب: ${validationErrors.join(', ')}`,
          'order-creation'
        );
      }

      // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
      const isPickup = orderData.shippingMethod === 'pickup' || 
                      orderData.shippingMethod?.name === 'استلام من المتجر' ||
                      orderData.shippingMethod?.id === 'pickup' ||
                      orderData.shippingMethod?.type === 'pickup';
      
      if (isPickup) {
        logger.debug('OrderService - Pickup method detected, setting shipping cost to 0');
        order.shippingCost = 0;
      }

      // حساب التكاليف
      order.calculateTotal();
      
      // التأكد من أن total موجود
      if (!order.totalAmount && order.totalAmount !== 0) {
        order.totalAmount = order.subtotal + order.shippingCost + order.taxAmount - order.discountAmount;
      }

      // إنشاء عناصر الطلب
      const orderItems = orderData.items.map(itemData => {
        const orderItem = new OrderItem({
          id: itemData.id || null,
          productId: itemData.productId || itemData.id,
          productType: itemData.productType || itemData.type || 'physical',
          title: itemData.title || itemData.name || itemData.productName || '',
          author: itemData.author || '',
          quantity: itemData.quantity || 1,
          unitPrice: itemData.unitPrice || itemData.price || 0,
          weight: itemData.weight || 0,
          dimensions: itemData.dimensions || { length: 0, width: 0, height: 0 },
          coverImage: itemData.coverImage || itemData.image || '',
          isbn: itemData.isbn || '',
          publisher: itemData.publisher || '',
          format: itemData.format || ''
        });
        orderItem.calculateTotalPrice();
        return orderItem;
      });
      
      // إضافة total للطلب
      order.total = order.totalAmount;

      // إعداد بيانات الحفظ
      const orderDataToSave = order.toObject();
      orderDataToSave.total = order.totalAmount; // إضافة total للتوافق
      orderDataToSave.createdAt = serverTimestamp();
      orderDataToSave.updatedAt = serverTimestamp();
      orderDataToSave.orderedAt = serverTimestamp();

      if (orderDataToSave.stageHistory && orderDataToSave.stageHistory.length > 0) {
        orderDataToSave.stageHistory[0].timestamp = firebaseApi.serverTimestamp();
      }
      
      logger.debug('OrderService - Order before saving to Firebase:', {
        subtotal: orderDataToSave.subtotal,
        shippingCost: orderDataToSave.shippingCost,
        taxAmount: orderDataToSave.taxAmount,
        total: orderDataToSave.total,
        totalAmount: orderDataToSave.totalAmount,
        createdAt: orderDataToSave.createdAt
      });
      const orderDoc = await firebaseApi.addToCollection(this.collectionName, orderDataToSave);
      logger.debug('Order document returned from Firebase:', orderDoc);
      
      // إضافة total إلى orderDoc إذا لم يكن موجوداً
      if (orderDoc && !orderDoc.total) {
        orderDoc.total = order.totalAmount;
      }
      
      // التحقق من وجود معرف الطلب
      if (!orderDoc || !orderDoc.id) {
        logger.error('OrderService - Failed to get order ID from Firebase:', {
          orderDoc,
          hasId: orderDoc?.id,
          orderDocKeys: orderDoc ? Object.keys(orderDoc) : 'N/A'
        });
        
        // إنشاء معرف احتياطي
        const fallbackId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        logger.info('OrderService - Using fallback order ID:', fallbackId);
        
        order.id = fallbackId;
        order.total = order.totalAmount;
        
        // محاولة إعادة حفظ الطلب مع المعرف الاحتياطي
        try {
          const orderDataWithId = { ...order.toObject(), id: fallbackId };
          await firebaseApi.updateCollection(this.collectionName, fallbackId, orderDataWithId);
          logger.debug('OrderService - Order saved with fallback ID successfully');
        } catch (retryError) {
          logger.error('OrderService - Failed to save order with fallback ID:', retryError);
          throw errorHandler.createError(
            'DATABASE',
            'database/order-creation-failed',
            'فشل في إنشاء الطلب - لم يتم الحصول على معرف الطلب من Firebase',
            'order-creation'
          );
        }
      } else {
        order.id = orderDoc.id;
        order.total = orderDoc.total || order.totalAmount;
        logger.debug('Order ID after assignment:', order.id);
        logger.debug('Order total after assignment:', order.total);
        orderDataToSave.stageHistory[0].timestamp = serverTimestamp();
      }

      const orderItemsData = orderItems.map(item => item.toObject());

      // تنفيذ المعاملة لحفظ الطلب وتحديث المخزون
      const maxRetries = 5;
      let orderDoc;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          orderDoc = await runTransaction(db, async (transaction) => {
            // التحقق من المخزون وتحديثه
            for (const item of orderItemsData) {
              const productRef = doc(db, 'books', item.productId);
              const productSnap = await transaction.get(productRef);
              if (!productSnap.exists()) {
                throw errorHandler.createError(
                  'NOT_FOUND',
                  'product/not-found',
                  'المنتج غير موجود',
                  `stock-update:${item.productId}`
                );
              }

              const currentStock = productSnap.data().stock || 0;
              if (currentStock < item.quantity) {
                throw errorHandler.createError(
                  'VALIDATION',
                  'validation/stock-unavailable',
                  `المخزون غير كافي للمنتج ${item.productId}`,
                  `stock-update:${item.productId}`
                );
              }

              transaction.update(productRef, { stock: currentStock - item.quantity });
            }

            // إنشاء مستند الطلب
            const orderRef = doc(collection(db, this.collectionName));
            transaction.set(orderRef, orderDataToSave);

            // حفظ عناصر الطلب
            for (const item of orderItemsData) {
              const itemRef = doc(collection(db, 'order_items'));
              transaction.set(itemRef, { ...item, orderId: orderRef.id });
            }

            return { id: orderRef.id };
          });
          break;
        } catch (txnError) {
          if (txnError.code === 'aborted' && attempt < maxRetries) {
            logger.info(`Transaction conflict detected, retrying... (${attempt})`);
            continue;
          }
          throw txnError;
        }
      }

      order.id = orderDoc.id;
      order.total = order.totalAmount;

      // تحديث orderId في عناصر الطلب بعد حفظ المعاملة
      for (const item of orderItems) {
        item.orderId = order.id;
      }

      logger.debug('Order ID after transaction:', order.id);

      // إنشاء معلومات الشحن (إذا كان هناك منتجات مادية) بعد الحصول على معرف الطلب
      let shipping = null;
      if (order.hasPhysicalItems()) {
        // التحقق من وجود معرف الطلب قبل إنشاء معلومات الشحن
        if (!order.id) {
          throw errorHandler.createError(
            'VALIDATION',
            'validation/order-id-missing',
            'معرف الطلب مفقود - لا يمكن إنشاء معلومات الشحن',
            'shipping-creation'
          );
        }
        
        // إعداد عنوان الشحن مع التأكد من وجود name
        const shippingAddress = {
          ...order.shippingAddress,
          name: order.shippingAddress.name || 
                (order.shippingAddress.firstName && order.shippingAddress.lastName 
                  ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                  : order.shippingAddress.firstName || order.shippingAddress.lastName || '')
        };
        
        shipping = new Shipping({
          orderId: order.id, // الآن order.id متوفر ومؤكد
          customerId: order.customerId,
          shippingMethod: order.shippingMethod,
          shippingAddress: shippingAddress,
          packageWeight: order.getTotalWeight(),
          packageDimensions: this.calculatePackageDimensions(orderItems),
          packageCount: orderItems.length
        });
        
        // التحقق من صحة بيانات الشحن
        logger.debug('Shipping data before validation:', {
          orderId: shipping.orderId,
          customerId: shipping.customerId,
          shippingAddress: shipping.shippingAddress,
          phone: shipping.shippingAddress?.phone,
          name: shipping.shippingAddress?.name
        });
        
        const shippingValidationErrors = shipping.validate();
        logger.debug('Shipping validation errors:', shippingValidationErrors);
        
        if (shippingValidationErrors.length > 0) {
          // حذف الطلب وعناصره إذا فشل التحقق من الشحن
          if (order.id) {
            try {
              await firebaseApi.deleteFromCollection(this.collectionName, order.id);
              // حذف عناصر الطلب (استخدام orderId للبحث)
              const orderItemsSnapshot = await firebaseApi.getCollection('order_items');
              const itemsToDelete = orderItemsSnapshot.filter(item => item.orderId === order.id);
              for (const item of itemsToDelete) {
                if (item.id) {
                  await firebaseApi.deleteFromCollection('order_items', item.id);
                }
              }
            } catch (deleteError) {
              logger.error('Error cleaning up order after shipping validation failure:', deleteError);
            }
          }
          throw errorHandler.createError(
            'VALIDATION',
            'validation/shipping-invalid',
            `خطأ في بيانات الشحن: ${shippingValidationErrors.join(', ')}`,
            'shipping-creation'
          );
        }
        
        shipping.calculateShippingCost();
        await firebaseApi.addToCollection('shipping', shipping.toObject());
      }

      const orderResult = order.toObject();
      orderResult.total = order.total || order.totalAmount;
      
      // تسجيل مفصل قبل الإرجاع
      logger.debug('OrderService - Final order result:', {
        id: orderResult.id,
        total: orderResult.total,
        totalAmount: orderResult.totalAmount,
        keys: Object.keys(orderResult)
      });
      logger.debug('OrderService - Order items count:', orderItems.length);
      logger.debug('OrderService - Has shipping:', !!shipping);
      
      const finalResult = {
        order: orderResult,
        items: orderItems.map(item => item.toObject()),
        shipping: shipping ? shipping.toObject() : null
      };
      
      logger.debug('OrderService - Returning final result:', {
        hasOrder: !!finalResult.order,
        orderId: finalResult.order?.id,
        itemsCount: finalResult.items?.length,
        hasShipping: !!finalResult.shipping
      });
      
      return finalResult;

    } catch (error) {
      throw errorHandler.handleError(error, 'order-creation');
    }
  }

  /**
   * الحصول على طلب بواسطة المعرف
   */
  async getOrderById(orderId) {
    try {
      // التحقق من صحة معرف الطلب
      if (!orderId || orderId === 'null' || orderId === 'undefined' || orderId.trim() === '') {
        logger.error('OrderService - Invalid order ID:', { orderId, type: typeof orderId });
        throw errorHandler.createError(
          'VALIDATION',
          'validation/invalid-order-id',
          'معرف الطلب غير صحيح',
          `order:${orderId}`
        );
      }
      
      logger.debug('OrderService - Getting order by ID:', orderId);
      
      const orderDoc = await firebaseApi.getDocById(this.collectionName, orderId);
      if (!orderDoc) {
        logger.error('OrderService - Order not found in Firebase:', { orderId });
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order:${orderId}`
        );
      }
      
      logger.debug('OrderService - Order found:', { id: orderDoc.id, status: orderDoc.status });

      const order = new Order(orderDoc);
      
      // الحصول على عناصر الطلب
      const itemsSnapshot = await firebaseApi.getCollection('order_items');
      const orderItems = itemsSnapshot
        .filter(item => item.orderId === orderId)
        .map(item => new OrderItem(item));

      // الحصول على معلومات الشحن
      const shippingSnapshot = await firebaseApi.getCollection('shipping');
      const shipping = shippingSnapshot
        .find(ship => ship.orderId === orderId);
      
      // الحصول على معلومات الدفع
      const paymentSnapshot = await firebaseApi.getCollection('payments');
      const payment = paymentSnapshot
        .find(pay => pay.orderId === orderId);

      return {
        order: order.toObject(),
        items: orderItems.map(item => item.toObject()),
        shipping: shipping ? new Shipping(shipping).toObject() : null,
        payment: payment ? new Payment(payment).toObject() : null
      };

    } catch (error) {
      throw errorHandler.handleError(error, `order:${orderId}`);
    }
  }

  /**
   * الحصول على جميع طلبات العميل
   */
  async getCustomerOrders(customerId, status = null) {
    try {
      let orders = await firebaseApi.getCollection(this.collectionName);
      
      // فلترة حسب العميل
      orders = orders.filter(order => order.customerId === customerId);
      
      // فلترة حسب الحالة
      if (status) {
        orders = orders.filter(order => order.status === status);
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return orders.map(order => new Order(order).toObject());

    } catch (error) {
      throw errorHandler.handleError(error, `customer-orders:${customerId}`);
    }
  }

  /**
   * تحديث حالة الطلب
   */
  async updateOrderStatus(orderId, newStatus, notes = '') {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order-status:${orderId}`
        );
      }

      // تحديث حالة الطلب
      const orderModel = new Order(order.order);
      orderModel.updateStatus(newStatus);
      
      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, orderId, {
        status: newStatus,
        updatedAt: new Date()
      });

      // إضافة ملاحظة إذا كانت موجودة
      if (notes) {
        await firebaseApi.addToCollection('order_notes', {
          orderId,
          note: notes,
          createdAt: new Date(),
          createdBy: 'system'
        });
      }

      return orderModel.toObject();

    } catch (error) {
      throw errorHandler.handleError(error, `order-status:${orderId}`);
    }
  }

  /**
   * تحديث مرحلة الطلب
   */
  async updateOrderStage(orderId, newStage, notes = '') {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order-stage:${orderId}`
        );
      }

      const orderModel = new Order(order.order);
      
      // التحقق من إمكانية الانتقال للمرحلة الجديدة
      if (!orderModel.canMoveToStage(newStage)) {
        throw errorHandler.createError(
          'VALIDATION',
          'order/invalid-stage-transition',
          'لا يمكن الانتقال لهذه المرحلة',
          `order-stage:${orderId}`
        );
      }

      // تحديث المرحلة
      orderModel.updateStage(newStage, notes);
      
      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, orderId, {
        currentStage: newStage,
        status: newStage,
        stageHistory: orderModel.stageHistory,
        updatedAt: new Date()
      });

      // معالجة خاصة حسب المرحلة
      await this.handleStageTransition(orderId, newStage, orderModel);

      return orderModel.toObject();

    } catch (error) {
      throw errorHandler.handleError(error, `order-stage:${orderId}`);
    }
  }

  /**
   * معالجة انتقال المرحلة
   */
  async handleStageTransition(orderId, newStage, orderModel) {
    try {
      switch (newStage) {
        case 'paid':
          // عند الدفع، تسليم المنتجات الرقمية فوراً
          if (orderModel.hasDigitalItems()) {
            await this.deliverDigitalProducts(orderId, orderModel);
          }
          break;
          
        case 'shipped':
          // عند الشحن، إرسال إشعار للعميل
          if (orderModel.hasPhysicalItems()) {
            await this.sendShippingNotification(orderId, orderModel);
          }
          break;
          
        case 'delivered':
          // عند التسليم، إرسال رابط التقييم
          await this.sendDeliveryNotification(orderId, orderModel);
          break;
          
        case 'reviewed':
          // عند التقييم، إكمال الطلب
          await this.completeOrder(orderId, orderModel);
          break;
      }
    } catch (error) {
      logger.error('Error handling stage transition:', error);
      // لا نوقف العملية إذا فشلت المعالجة الإضافية
    }
  }

  /**
   * تسليم المنتجات الرقمية
   */
  async deliverDigitalProducts(orderId, orderModel) {
    try {
      const digitalItems = orderModel.items.filter(item => 
        item.productType === 'ebook' || item.productType === 'audiobook'
      );

      for (const item of digitalItems) {
        // إنشاء رابط تحميل للمنتج الرقمي
        const downloadUrl = await this.generateDownloadUrl(item.productId, orderId);
        
        // تحديث عنصر الطلب
        item.deliverDigitalProduct(downloadUrl);
        
        // حفظ التحديث في قاعدة البيانات
        await firebaseApi.updateCollection('order_items', item.id, {
          downloadUrl: item.downloadUrl,
          isDelivered: item.isDelivered,
          deliveredAt: item.deliveredAt,
          updatedAt: new Date()
        });
      }

      // إرسال إشعار للعميل
      await this.sendDigitalDeliveryNotification(orderId, orderModel, digitalItems);
      
    } catch (error) {
      logger.error('Error delivering digital products:', error);
    }
  }

  /**
   * إنشاء رابط تحميل للمنتج الرقمي
   */
  async generateDownloadUrl(productId, orderId) {
    // محاكاة إنشاء رابط تحميل
    // في التطبيق الحقيقي، سيكون هذا رابطاً آمناً ومؤقتاً
    const timestamp = Date.now();
    const token = btoa(`${productId}-${orderId}-${timestamp}`);
    return `/download/${productId}?token=${token}&order=${orderId}`;
  }

  /**
   * إرسال إشعار تسليم المنتجات الرقمية
   */
  async sendDigitalDeliveryNotification(orderId, orderModel, digitalItems) {
    // محاكاة إرسال إشعار
    logger.debug(`Digital products delivered for order ${orderId}:`, digitalItems);
    
    // في التطبيق الحقيقي، سيتم إرسال إيميل أو إشعار للعميل
    // مع روابط التحميل
  }

  /**
   * إرسال إشعار الشحن
   */
  async sendShippingNotification(orderId, orderModel) {
    // محاكاة إرسال إشعار الشحن
    logger.debug(`Shipping notification sent for order ${orderId}`);
  }

  /**
   * إرسال إشعار التسليم
   */
  async sendDeliveryNotification(orderId, orderModel) {
    // محاكاة إرسال إشعار التسليم مع رابط التقييم
    logger.debug(`Delivery notification sent for order ${orderId}`);
  }

  /**
   * إكمال الطلب
   */
  async completeOrder(orderId, orderModel) {
    // محاكاة إكمال الطلب
    logger.debug(`Order ${orderId} completed successfully`);
  }

  /**
   * إلغاء الطلب
   */
  async cancelOrder(orderId, reason = '') {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order-cancel:${orderId}`
        );
      }

      // التحقق من إمكانية الإلغاء
      if (!this.canCancelOrder(order.order)) {
        throw errorHandler.createError(
          'VALIDATION',
          'order/cannot-cancel',
          'لا يمكن إلغاء هذا الطلب',
          `order-cancel:${orderId}`
        );
      }

      // تحديث حالة الطلب
      await this.updateOrderStatus(orderId, 'cancelled', reason);

      // إرجاع المنتجات إلى المخزون (إذا كانت مادية)
      if (order.order.hasPhysicalItems) {
        await this.returnItemsToInventory(order.items);
      }

      // إلغاء الدفع (إذا كان مدفوعاً)
      if (order.payment && order.payment.paymentStatus === 'paid') {
        await this.refundPayment(order.payment.id, reason);
      }

      return { success: true, message: 'تم إلغاء الطلب بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `order-cancel:${orderId}`);
    }
  }

  /**
   * إضافة منتج إلى الطلب
   */
  async addItemToOrder(orderId, itemData) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order-add-item:${orderId}`
        );
      }

      // التحقق من إمكانية إضافة المنتج
      if (!this.canModifyOrder(order.order)) {
        throw errorHandler.createError(
          'VALIDATION',
          'order/cannot-modify',
          'لا يمكن تعديل هذا الطلب',
          `order-add-item:${orderId}`
        );
      }

      // إنشاء عنصر الطلب
      const orderItem = new OrderItem(itemData);
      orderItem.calculateTotalPrice();

      // حفظ عنصر الطلب
      const savedItem = await firebaseApi.addToCollection('order_items', orderItem.toObject());

      // تحديث إجمالي الطلب
      await this.recalculateOrderTotal(orderId);

      return savedItem;

    } catch (error) {
      throw errorHandler.handleError(error, `order-add-item:${orderId}`);
    }
  }

  /**
   * إزالة منتج من الطلب
   */
  async removeItemFromOrder(orderId, itemId) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order-remove-item:${orderId}`
        );
      }

      // التحقق من إمكانية تعديل الطلب
      if (!this.canModifyOrder(order.order)) {
        throw errorHandler.createError(
          'VALIDATION',
          'order/cannot-modify',
          'لا يمكن تعديل هذا الطلب',
          `order-remove-item:${orderId}`
        );
      }

      // حذف عنصر الطلب
      await firebaseApi.deleteFromCollection('order_items', itemId);

      // تحديث إجمالي الطلب
      await this.recalculateOrderTotal(orderId);

      return { success: true, message: 'تم إزالة المنتج بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `order-remove-item:${orderId}`);
    }
  }

  /**
   * إعادة حساب إجمالي الطلب
   */
  async recalculateOrderTotal(orderId) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) return;

      const orderModel = new Order(order.order);
      orderModel.calculateTotal();

      // تحديث الطلب
      await firebaseApi.updateCollection(this.collectionName, orderId, {
        subtotal: orderModel.subtotal,
        shippingCost: orderModel.shippingCost,
        taxAmount: orderModel.taxAmount,
        total: orderModel.total,
        updatedAt: new Date()
      });

      return orderModel.total;

    } catch (error) {
      throw errorHandler.handleError(error, `order-recalculate:${orderId}`);
    }
  }

  /**
   * التحقق من إمكانية إلغاء الطلب
   */
  canCancelOrder(order) {
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    return cancellableStatuses.includes(order.status);
  }

  /**
   * التحقق من إمكانية تعديل الطلب
   */
  canModifyOrder(order) {
    const modifiableStatuses = ['pending', 'confirmed'];
    return modifiableStatuses.includes(order.status);
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
   * إرجاع المنتجات إلى المخزون
   */
  async returnItemsToInventory(items) {
    try {
      for (const item of items) {
        if (item.productId) {
          // تحديث المخزون في Firebase
          const product = await firebaseApi.getDocById('books', item.productId);
          if (product) {
            const newStock = (product.stock || 0) + item.quantity;
            await firebaseApi.updateCollection('books', item.productId, {
              stock: newStock,
              updatedAt: new Date()
            });
          }
        }
      }
    } catch (error) {
      logger.error('Error returning items to inventory:', error);
    }
  }

  /**
   * استرداد الدفع
   */
  async refundPayment(paymentId, reason) {
    try {
      // تحديث حالة الدفع
      await firebaseApi.updateCollection('payments', paymentId, {
        paymentStatus: 'refunded',
        refundReason: reason,
        refundedAt: new Date(),
        updatedAt: new Date()
      });

      return { success: true, message: 'تم استرداد الدفع بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `payment-refund:${paymentId}`);
    }
  }

  /**
   * الحصول على إحصائيات الطلبات
   */
  async getOrderStats(customerId = null) {
    try {
      let orders = await firebaseApi.getCollection(this.collectionName);
      
      if (customerId) {
        orders = orders.filter(order => order.customerId === customerId);
      }

      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
      };

      return stats;

    } catch (error) {
      throw errorHandler.handleError(error, 'order-stats');
    }
  }

  /**
   * الحصول على جميع الطلبات
   */
  async getAllOrders(filters = {}) {
    try {
      let orders = await firebaseApi.getCollection(this.collectionName);
      
      // تطبيق الفلاتر
      if (filters.status && filters.status !== 'all') {
        orders = orders.filter(order => order.status === filters.status);
      }
      
      if (filters.customerId) {
        orders = orders.filter(order => order.customerId === filters.customerId);
      }
      
      if (filters.dateFrom) {
        orders = orders.filter(order => new Date(order.createdAt) >= new Date(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        orders = orders.filter(order => new Date(order.createdAt) <= new Date(filters.dateTo));
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const processedOrders = orders.map(order => {
        // إذا لم يكن هناك معرف، استخدم orderNumber كمعرف مؤقت
        if (!order.id && order.orderNumber) {
          logger.info('Order ID is missing, using orderNumber as fallback:', order.orderNumber);
          order.id = order.orderNumber;
        }
        
        const orderObj = new Order(order);
        const result = orderObj.toObject();
        
        // التأكد من وجود معرف في النتيجة النهائية
        if (!result.id && result.orderNumber) {
          result.id = result.orderNumber;
          logger.info('Order ID was lost during processing, restored from orderNumber:', result.id);
        }
        
        return result;
      });

      return {
        success: true,
        data: processedOrders
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'orders:get-all');
    }
  }

  /**
   * تحديث عنصر في الطلب
   */
  async updateOrderItem(itemId, updateData) {
    try {
      await firebaseApi.updateCollection('order_items', itemId, {
        ...updateData,
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'تم تحديث عنصر الطلب بنجاح'
      };

    } catch (error) {
      throw errorHandler.handleError(error, `order-item:update:${itemId}`);
    }
  }

  /**
   * استرداد مبلغ الطلب
   */
  async refundOrderPayment(orderId, refundData) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `order-refund:${orderId}`
        );
      }

      // تحديث حالة الطلب
      await firebaseApi.updateCollection(this.collectionName, orderId, {
        paymentStatus: 'refunded',
        status: 'cancelled',
        currentStage: 'cancelled',
        refundReason: refundData.reason,
        refundedAt: new Date(),
        updatedAt: new Date()
      });

      // إذا كان هناك دفع مرتبط، قم بتحديثه
      if (order.payment) {
        await firebaseApi.updateCollection('payments', order.payment.id, {
          paymentStatus: 'refunded',
          refundAmount: refundData.amount,
          refundReason: refundData.reason,
          refundedAt: new Date(),
          updatedAt: new Date()
        });
      }

      return {
        success: true,
        message: 'تم استرداد المبلغ بنجاح'
      };

    } catch (error) {
      throw errorHandler.handleError(error, `order-refund:${orderId}`);
    }
  }

  /**
   * حذف طلب
   */
  async deleteOrder(orderId) {
    try {
      // التحقق من وجود الطلب
      const order = await firebaseApi.getDocById(this.collectionName, orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order-not-found',
          'الطلب غير موجود',
          `order-delete:${orderId}`
        );
      }

      // حذف الطلب
      await firebaseApi.deleteDoc(this.collectionName, orderId);

      // حذف عناصر الطلب المرتبطة
      const orderItems = await firebaseApi.getCollection('orderItems');
      const relatedItems = orderItems.filter(item => item.orderId === orderId);
      
      for (const item of relatedItems) {
        await firebaseApi.deleteDoc('orderItems', item.id);
      }

      // حذف بيانات الشحن المرتبطة
      if (order.shipping) {
        await firebaseApi.deleteDoc('shipping', order.shipping.id);
      }

      // حذف بيانات الدفع المرتبطة
      if (order.payment) {
        await firebaseApi.deleteDoc('payments', order.payment.id);
      }

      return {
        success: true,
        message: 'تم حذف الطلب بنجاح'
      };

    } catch (error) {
      throw errorHandler.handleError(error, `order-delete:${orderId}`);
    }
  }
}

export default new OrderService();
