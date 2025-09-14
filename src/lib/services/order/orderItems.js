import { errorHandler } from '../../errorHandler.js';
import firebaseApi from '../../firebase/baseApi.js';

export async function updateOrderItem(itemId, updateData) {
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
