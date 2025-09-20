import { errorHandler } from '../../errorHandler.js';
import { getActiveLanguage } from '../../languageUtils.js';
import firebaseApi from '../../firebase/baseApi.js';

const handleErrorWithLanguage = (error, context) =>
  errorHandler.handleError(error, context, getActiveLanguage());

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
    throw handleErrorWithLanguage(error, `order-item:update:${itemId}`);
  }
}
