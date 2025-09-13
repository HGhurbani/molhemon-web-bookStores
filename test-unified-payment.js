/**
 * اختبار بسيط لنظام المدفوعات الموحد
 * Simple test for Unified Payment System
 */

// تشغيل الاختبار في المتصفح
console.log('🚀 بدء اختبار نظام المدفوعات الموحد...');

// استيراد النظام الجديد
import unifiedPaymentApi from './src/lib/api/unifiedPaymentApi.js';

async function testUnifiedPaymentSystem() {
  try {
    console.log('📋 1. تهيئة النظام...');
    await unifiedPaymentApi.initialize();
    console.log('✅ تم تهيئة النظام بنجاح');

    console.log('🏦 2. جلب مزودي الدفع...');
    const providersResult = await unifiedPaymentApi.getPaymentProviders();
    console.log('✅ مزودي الدفع:', providersResult.providers?.length || 0);

    console.log('📊 3. جلب إحصائيات المدفوعات...');
    const statsResult = await unifiedPaymentApi.getPaymentStats();
    console.log('✅ الإحصائيات:', statsResult.stats);

    console.log('💳 4. إنشاء عملية دفع تجريبية...');
    const paymentData = {
      amount: 100.00,
      currency: 'SAR',
      orderId: 'test_order_123',
      customerId: 'test_customer_456',
      metadata: {
        description: 'اختبار الدفع',
        customerEmail: 'test@example.com'
      }
    };

    const paymentResult = await unifiedPaymentApi.createPaymentIntent(paymentData);
    console.log('✅ تم إنشاء عملية الدفع:', paymentResult.paymentIntent?.id);

    console.log('🔗 5. اختبار اتصال Stripe...');
    const testResult = await unifiedPaymentApi.testProviderConnection('stripe');
    console.log('✅ نتيجة اختبار Stripe:', testResult.success);

    console.log('🎉 انتهى الاختبار بنجاح!');
    
    return {
      success: true,
      providers: providersResult.providers?.length || 0,
      stats: statsResult.stats,
      paymentId: paymentResult.paymentIntent?.id
    };

  } catch (error) {
    console.error('❌ فشل في الاختبار:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// تشغيل الاختبار
testUnifiedPaymentSystem().then(result => {
  console.log('📋 نتيجة الاختبار:', result);
});

// تصدير الدالة للاستخدام في وحدة تحكم المتصفح
window.testUnifiedPaymentSystem = testUnifiedPaymentSystem;










