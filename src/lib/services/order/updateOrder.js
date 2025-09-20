import { Order } from '../../models/Order.js';
import { errorHandler } from '../../errorHandler.js';
import { getActiveLanguage } from '../../languageUtils.js';
import firebaseApi from '../../firebase/baseApi.js';

const handleErrorWithLanguage = (error, context) =>
  errorHandler.handleError(error, context, getActiveLanguage());

export async function updateOrderStatus(orderId, newStatus, notes = '') {
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
    throw handleErrorWithLanguage(error, `order-status:${orderId}`);
  }
}

export async function updateOrderStage(orderId, newStage, notes = '') {
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
    throw handleErrorWithLanguage(error, `order-stage:${orderId}`);
  }
}
