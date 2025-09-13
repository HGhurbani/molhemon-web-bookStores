/**
 * اختبار سريع لمفاتيح Stripe
 * Quick Stripe Keys Test
 */

// المفاتيح المقدمة من المستخدم
const STRIPE_KEYS = {
  publishableKey: 'pk_test_51S2YPM6oNIQf9kuOLOZwM3ZB6gUXMSQxyDSvRiAO41nQpdRXwfT2XbDs98HWofgJcWF4DrzrLGqfrrfxrY9QwxYt00D8Dg04xJ',
  secretKey: 'sk_test_51S2YPM6oNIQf9kuOfRxcUtopsY1WydSX3wLmOiejogF5PbZ2PlAYmz0KABEECtZunyo3VPgISLUIa0higgi9ol6s00JPRmxVR3',
  webhookSecret: '' // اختياري
};

// التعبيرات النمطية المحدثة
const VALIDATION_PATTERNS = {
  publishableKey: /^pk_(test|live)_[a-zA-Z0-9]{24,}$/,
  secretKey: /^sk_(test|live)_[a-zA-Z0-9]{24,}$/,
  webhookSecret: /^whsec_[a-zA-Z0-9]{32,}$/
};

/**
 * اختبار مفاتيح Stripe
 */
function testStripeKeys() {
  console.log('🔍 اختبار مفاتيح Stripe...\n');
  
  const results = {};
  const errors = [];
  
  // اختبار Publishable Key
  console.log('1. اختبار Publishable Key:');
  console.log(`   المفتاح: ${STRIPE_KEYS.publishableKey}`);
  
  if (!STRIPE_KEYS.publishableKey) {
    errors.push('Publishable Key مطلوب');
    results.publishableKey = false;
  } else if (!VALIDATION_PATTERNS.publishableKey.test(STRIPE_KEYS.publishableKey)) {
    errors.push('Publishable Key يجب أن يبدأ بـ pk_test_ أو pk_live_');
    results.publishableKey = false;
  } else {
    console.log('   ✅ صحيح');
    results.publishableKey = true;
  }
  
  // اختبار Secret Key
  console.log('\n2. اختبار Secret Key:');
  console.log(`   المفتاح: ${STRIPE_KEYS.secretKey.substring(0, 20)}...`);
  
  if (!STRIPE_KEYS.secretKey) {
    errors.push('Secret Key مطلوب');
    results.secretKey = false;
  } else if (!VALIDATION_PATTERNS.secretKey.test(STRIPE_KEYS.secretKey)) {
    errors.push('Secret Key يجب أن يبدأ بـ sk_test_ أو sk_live_');
    results.secretKey = false;
  } else {
    console.log('   ✅ صحيح');
    results.secretKey = true;
  }
  
  // اختبار Webhook Secret (اختياري)
  console.log('\n3. اختبار Webhook Secret:');
  if (!STRIPE_KEYS.webhookSecret) {
    console.log('   ⚠️ Webhook Secret غير مطلوب (اختياري)');
    results.webhookSecret = 'optional';
  } else if (!VALIDATION_PATTERNS.webhookSecret.test(STRIPE_KEYS.webhookSecret)) {
    errors.push('Webhook Secret يجب أن يبدأ بـ whsec_');
    results.webhookSecret = false;
  } else {
    console.log('   ✅ صحيح');
    results.webhookSecret = true;
  }
  
  // النتيجة النهائية
  console.log('\n📊 النتيجة النهائية:');
  console.log('==================');
  
  const allValid = results.publishableKey && results.secretKey;
  
  if (allValid) {
    console.log('✅ جميع المفاتيح صحيحة!');
    console.log('🎉 يمكنك الآن استخدام Stripe في النظام');
  } else {
    console.log('❌ هناك أخطاء في المفاتيح:');
    errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }
  
  // معلومات إضافية
  console.log('\n📋 معلومات إضافية:');
  console.log('==================');
  
  const publishableKeyType = STRIPE_KEYS.publishableKey.includes('test') ? 'Test' : 'Live';
  const secretKeyType = STRIPE_KEYS.secretKey.includes('test') ? 'Test' : 'Live';
  
  console.log(`- Publishable Key Type: ${publishableKeyType}`);
  console.log(`- Secret Key Type: ${secretKeyType}`);
  
  if (publishableKeyType !== secretKeyType) {
    console.log('⚠️ تحذير: المفاتيح من بيئات مختلفة (Test vs Live)');
  }
  
  // إعدادات النظام المقترحة
  console.log('\n⚙️ إعدادات النظام المقترحة:');
  console.log('==========================');
  
  console.log(JSON.stringify({
    enabled: true,
    testMode: publishableKeyType === 'Test',
    settings: {
      publishableKey: STRIPE_KEYS.publishableKey,
      secretKey: STRIPE_KEYS.secretKey,
      webhookSecret: STRIPE_KEYS.webhookSecret || ''
    }
  }, null, 2));
  
  return {
    success: allValid,
    results,
    errors
  };
}

/**
 * اختبار الاتصال بـ Stripe
 */
async function testStripeConnection() {
  console.log('\n🌐 اختبار الاتصال بـ Stripe...');
  
  try {
    // محاكاة اختبار الاتصال
    const response = await fetch('https://api.stripe.com/v1/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_KEYS.secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ الاتصال بـ Stripe ناجح');
      return true;
    } else {
      console.log('❌ فشل الاتصال بـ Stripe');
      return false;
    }
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
    return false;
  }
}

/**
 * تشغيل الاختبارات
 */
async function runTests() {
  console.log('🚀 بدء اختبار مفاتيح Stripe\n');
  
  // اختبار المفاتيح
  const keyTest = testStripeKeys();
  
  // اختبار الاتصال (إذا كانت المفاتيح صحيحة)
  if (keyTest.success) {
    await testStripeConnection();
  }
  
  console.log('\n✨ انتهى الاختبار');
  
  return keyTest;
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (typeof window === 'undefined') {
  // Node.js environment
  runTests().catch(console.error);
} else {
  // Browser environment
  window.testStripeKeys = testStripeKeys;
  window.testStripeConnection = testStripeConnection;
  window.runTests = runTests;
}

export { testStripeKeys, testStripeConnection, runTests };










