/**
 * اختبار مبسط لنظام المدفوعات الموحد
 * Simple test for Unified Payment System
 */

console.log('🚀 بدء اختبار نظام المدفوعات الموحد...');

// استيراد النظام الجديد
import unifiedPaymentApi from './src/lib/api/unifiedPaymentApi.js';

async function testSimple() {
  try {
    console.log('📋 1. تهيئة النظام...');
    const initResult = await unifiedPaymentApi.initialize();
    console.log('✅ تهيئة النظام:', initResult);

    console.log('🏦 2. جلب مزودي الدفع...');
    const providersResult = await unifiedPaymentApi.getPaymentProviders();
    console.log('✅ مزودي الدفع:', providersResult);

    console.log('📊 3. جلب إحصائيات المدفوعات...');
    const statsResult = await unifiedPaymentApi.getPaymentStats();
    console.log('✅ الإحصائيات:', statsResult);

    console.log('🔗 4. اختبار اتصال Stripe...');
    const testResult = await unifiedPaymentApi.testProviderConnection('stripe');
    console.log('✅ نتيجة اختبار Stripe:', testResult);

    console.log('🎉 انتهى الاختبار بنجاح!');
    
    return {
      success: true,
      providers: providersResult.providers?.length || 0,
      stats: statsResult.stats
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
testSimple().then(result => {
  console.log('📋 نتيجة الاختبار:', result);
});

// تصدير الدالة للاستخدام في وحدة تحكم المتصفح
window.testSimple = testSimple;










