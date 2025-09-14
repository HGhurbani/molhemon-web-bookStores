import { Order } from '../../models/Order.js';
import { OrderItem } from '../../models/OrderItem.js';
import { Shipping } from '../../models/Shipping.js';
import schemas from '../../../../shared/schemas.js';
import { errorHandler } from '../../errorHandler.js';
import firebaseApi from '../../firebase/baseApi.js';
import logger from '../../logger.js';
import { runTransaction, doc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.js';

const { Schemas, validateData } = schemas;

export async function createOrder(orderData) {
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
    let orderDocResult;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        orderDocResult = await runTransaction(db, async (transaction) => {
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

    order.id = orderDocResult.id;
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
