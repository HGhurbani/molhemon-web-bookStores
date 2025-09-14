/**
 * اختبار صفحة الدفع والنظام الموحد للمدفوعات
 */

import unifiedPaymentApi from '../api/unifiedPaymentApi.js';
import logger from '../logger.js';

export async function testCheckoutSystem() {
  logger.info('🧪 بدء اختبار نظام الدفع...');
  
  try {
    // 1. تهيئة النظام
    logger.info('1️⃣ تهيئة النظام الموحد...');
    await unifiedPaymentApi.initialize();
    
    // 2. جلب مزودي الدفع
    logger.info('2️⃣ جلب مزودي الدفع...');
    const providersResult = await unifiedPaymentApi.getPaymentProviders();
    logger.info('مزودي الدفع:', providersResult);
    
    // 3. اختبار طرق الدفع المتاحة
    logger.info('3️⃣ اختبار طرق الدفع المتاحة...');
    const orderData = {
      currency: 'SAR',
      country: 'SA',
      amount: 100
    };
    
    const methodsResult = await unifiedPaymentApi.getAvailablePaymentMethods(orderData);
    logger.info('طرق الدفع المتاحة:', methodsResult);
    
    // 4. اختبار إنشاء Payment Intent للدفع عند الاستلام
    logger.info('4️⃣ اختبار إنشاء Payment Intent للدفع عند الاستلام...');
    const paymentData = {
      amount: 100,
      currency: 'SAR',
      orderId: 'test_order_123',
      customerId: 'test_customer_456',
      provider: 'cashOnDelivery'
    };
    
    const intentResult = await unifiedPaymentApi.createPaymentIntent(paymentData);
    logger.info('Payment Intent:', intentResult);
    
    // 5. اختبار إحصائيات الدفع
    logger.info('5️⃣ اختبار إحصائيات الدفع...');
    const statsResult = await unifiedPaymentApi.getPaymentStats();
    logger.info('إحصائيات الدفع:', statsResult);
    
    logger.info('✅ تم اختبار النظام بنجاح!');
    return { success: true, message: 'جميع الاختبارات نجحت' };
    
  } catch (error) {
    logger.error('❌ فشل في اختبار النظام:', error);
    return { success: false, error: error.message };
  }
}

// اختبار طرق الدفع المختلفة
export async function testPaymentMethods() {
  logger.info('🧪 اختبار طرق الدفع المختلفة...');
  
  const testCases = [
    { currency: 'SAR', country: 'SA', amount: 50 },
    { currency: 'USD', country: 'US', amount: 25 },
    { currency: 'AED', country: 'AE', amount: 75 }
  ];
  
  for (const testCase of testCases) {
    logger.info(`اختبار: ${testCase.currency} - ${testCase.country} - ${testCase.amount}`);
    const result = await unifiedPaymentApi.getAvailablePaymentMethods(testCase);
    logger.info('النتيجة:', result);
  }
}

// تصدير للاستخدام في وحدة التحكم
if (typeof window !== 'undefined') {
  window.testCheckoutSystem = testCheckoutSystem;
  window.testPaymentMethods = testPaymentMethods;
}










