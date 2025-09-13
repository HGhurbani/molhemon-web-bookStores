/**
 * اختبار صفحة الدفع والنظام الموحد للمدفوعات
 */

import unifiedPaymentApi from '../api/unifiedPaymentApi.js';

export async function testCheckoutSystem() {
  console.log('🧪 بدء اختبار نظام الدفع...');
  
  try {
    // 1. تهيئة النظام
    console.log('1️⃣ تهيئة النظام الموحد...');
    await unifiedPaymentApi.initialize();
    
    // 2. جلب مزودي الدفع
    console.log('2️⃣ جلب مزودي الدفع...');
    const providersResult = await unifiedPaymentApi.getPaymentProviders();
    console.log('مزودي الدفع:', providersResult);
    
    // 3. اختبار طرق الدفع المتاحة
    console.log('3️⃣ اختبار طرق الدفع المتاحة...');
    const orderData = {
      currency: 'SAR',
      country: 'SA',
      amount: 100
    };
    
    const methodsResult = await unifiedPaymentApi.getAvailablePaymentMethods(orderData);
    console.log('طرق الدفع المتاحة:', methodsResult);
    
    // 4. اختبار إنشاء Payment Intent للدفع عند الاستلام
    console.log('4️⃣ اختبار إنشاء Payment Intent للدفع عند الاستلام...');
    const paymentData = {
      amount: 100,
      currency: 'SAR',
      orderId: 'test_order_123',
      customerId: 'test_customer_456',
      provider: 'cashOnDelivery'
    };
    
    const intentResult = await unifiedPaymentApi.createPaymentIntent(paymentData);
    console.log('Payment Intent:', intentResult);
    
    // 5. اختبار إحصائيات الدفع
    console.log('5️⃣ اختبار إحصائيات الدفع...');
    const statsResult = await unifiedPaymentApi.getPaymentStats();
    console.log('إحصائيات الدفع:', statsResult);
    
    console.log('✅ تم اختبار النظام بنجاح!');
    return { success: true, message: 'جميع الاختبارات نجحت' };
    
  } catch (error) {
    console.error('❌ فشل في اختبار النظام:', error);
    return { success: false, error: error.message };
  }
}

// اختبار طرق الدفع المختلفة
export async function testPaymentMethods() {
  console.log('🧪 اختبار طرق الدفع المختلفة...');
  
  const testCases = [
    { currency: 'SAR', country: 'SA', amount: 50 },
    { currency: 'USD', country: 'US', amount: 25 },
    { currency: 'AED', country: 'AE', amount: 75 }
  ];
  
  for (const testCase of testCases) {
    console.log(`اختبار: ${testCase.currency} - ${testCase.country} - ${testCase.amount}`);
    const result = await unifiedPaymentApi.getAvailablePaymentMethods(testCase);
    console.log('النتيجة:', result);
  }
}

// تصدير للاستخدام في وحدة التحكم
if (typeof window !== 'undefined') {
  window.testCheckoutSystem = testCheckoutSystem;
  window.testPaymentMethods = testPaymentMethods;
}










