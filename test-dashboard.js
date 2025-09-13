/**
 * اختبار سريع لوحة التحكم
 * Quick Dashboard Test
 */

console.log('🚀 بدء اختبار لوحة التحكم...');

// اختبار استيراد المكونات
try {
  console.log('✅ اختبار استيراد المكونات...');
  
  // اختبار unifiedPaymentApi
  import('./src/lib/api/unifiedPaymentApi.js').then(module => {
    console.log('✅ unifiedPaymentApi تم استيراده بنجاح');
    
    // اختبار تهيئة النظام
    const api = module.default;
    api.initialize().then(() => {
      console.log('✅ تم تهيئة نظام المدفوعات');
      
      // اختبار جلب مزودي الدفع
      return api.getPaymentProviders();
    }).then(result => {
      console.log('✅ مزودي الدفع:', result);
      
      // اختبار جلب الإحصائيات
      return api.getPaymentStats();
    }).then(result => {
      console.log('✅ إحصائيات المدفوعات:', result);
      
      console.log('🎉 جميع الاختبارات نجحت!');
    }).catch(error => {
      console.error('❌ فشل في اختبار API:', error);
    });
  }).catch(error => {
    console.error('❌ فشل في استيراد unifiedPaymentApi:', error);
  });
  
} catch (error) {
  console.error('❌ فشل في اختبار الاستيراد:', error);
}

// اختبار التبويبات المتاحة
const availableTabs = [
  'about',
  'store', 
  'payments',
  'shipping',
  'checkout',
  'locations',
  'notifications',
  'terms',
  'connection'
];

console.log('📋 التبويبات المتاحة:', availableTabs);

// اختبار مزودي الدفع المدعومين
const supportedPaymentProviders = [
  'stripe',
  'paypal', 
  'tabby',
  'cashOnDelivery'
];

console.log('💳 مزودي الدفع المدعومين:', supportedPaymentProviders);

// اختبار مزودي الشحن المدعومين
const supportedShippingProviders = [
  'saudiPost',
  'aramex',
  'dhl',
  'fedex',
  'naqel'
];

console.log('🚚 مزودي الشحن المدعومين:', supportedShippingProviders);

console.log('✅ انتهى اختبار لوحة التحكم');










