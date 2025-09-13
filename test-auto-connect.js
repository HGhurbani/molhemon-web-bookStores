/**
 * اختبار الربط التلقائي مع مزودي الدفع
 * Auto Connect Test for Payment Providers
 */

console.log('🚀 بدء اختبار الربط التلقائي...');

// استيراد النظام الجديد
import unifiedPaymentApi from './src/lib/api/unifiedPaymentApi.js';

async function testAutoConnect() {
  try {
    console.log('📋 1. تهيئة النظام...');
    await unifiedPaymentApi.initialize();
    console.log('✅ تم تهيئة النظام');

    console.log('🔗 2. اختبار روابط الربط التلقائي...');
    
    // اختبار Stripe
    console.log('--- اختبار Stripe ---');
    const stripeLinks = await unifiedPaymentApi.getAutoConnectLinks('stripe');
    console.log('روابط Stripe:', stripeLinks);
    
    // اختبار PayPal
    console.log('--- اختبار PayPal ---');
    const paypalLinks = await unifiedPaymentApi.getAutoConnectLinks('paypal');
    console.log('روابط PayPal:', paypalLinks);
    
    // اختبار Tabby
    console.log('--- اختبار Tabby ---');
    const tabbyLinks = await unifiedPaymentApi.getAutoConnectLinks('tabby');
    console.log('روابط Tabby:', tabbyLinks);
    
    // اختبار Cash on Delivery
    console.log('--- اختبار Cash on Delivery ---');
    const codLinks = await unifiedPaymentApi.getAutoConnectLinks('cashOnDelivery');
    console.log('روابط COD:', codLinks);

    console.log('📖 3. اختبار تعليمات الربط...');
    
    // اختبار تعليمات Stripe
    const stripeInstructions = await unifiedPaymentApi.getConnectionInstructions('stripe');
    console.log('تعليمات Stripe:', stripeInstructions);
    
    // اختبار تعليمات PayPal
    const paypalInstructions = await unifiedPaymentApi.getConnectionInstructions('paypal');
    console.log('تعليمات PayPal:', paypalInstructions);

    console.log('🔍 4. اختبار التحقق من صحة المفاتيح...');
    
    // اختبار مفاتيح صحيحة
    const validStripeKeys = {
      publishableKey: 'pk_test_123456789012345678901234',
      secretKey: 'sk_test_123456789012345678901234',
      webhookSecret: 'whsec_12345678901234567890123456789012'
    };
    
    const validStripeValidation = await unifiedPaymentApi.validateProviderKeys('stripe', validStripeKeys);
    console.log('تحقق مفاتيح Stripe صحيحة:', validStripeValidation);
    
    // اختبار مفاتيح خاطئة
    const invalidStripeKeys = {
      publishableKey: 'invalid_key',
      secretKey: 'invalid_secret',
      webhookSecret: 'invalid_webhook'
    };
    
    const invalidStripeValidation = await unifiedPaymentApi.validateProviderKeys('stripe', invalidStripeKeys);
    console.log('تحقق مفاتيح Stripe خاطئة:', invalidStripeValidation);

    console.log('🎉 انتهى اختبار الربط التلقائي بنجاح!');
    
    return {
      success: true,
      stripeLinks: stripeLinks.success,
      paypalLinks: paypalLinks.success,
      tabbyLinks: tabbyLinks.success,
      codLinks: codLinks.success,
      stripeInstructions: stripeInstructions.success,
      paypalInstructions: paypalInstructions.success,
      validKeys: validStripeValidation.valid,
      invalidKeys: !invalidStripeValidation.valid
    };

  } catch (error) {
    console.error('❌ فشل في اختبار الربط التلقائي:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// تشغيل الاختبار
testAutoConnect().then(result => {
  console.log('📋 نتيجة اختبار الربط التلقائي:', result);
});

// تصدير الدالة للاستخدام في وحدة تحكم المتصفح
window.testAutoConnect = testAutoConnect;

// دالة لفتح روابط الربط
window.openAutoConnectLink = async (providerName, linkType) => {
  try {
    const result = await unifiedPaymentApi.openAutoConnectLink(providerName, linkType);
    console.log(`تم فتح ${linkType} لـ ${providerName}:`, result);
    return result;
  } catch (error) {
    console.error(`فشل في فتح ${linkType} لـ ${providerName}:`, error);
    return { success: false, error: error.message };
  }
};










