import { errorHandler } from '../../errorHandler.js';
import firebaseApi from '../../firebaseApi.js';

export async function refundOrderPayment(orderId, refundData) {
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
