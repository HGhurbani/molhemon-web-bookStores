# دليل إعداد Stripe 💳

## نظرة عامة

دليل شامل لإعداد بوابة الدفع Stripe في نظام متجر الكتب.

## المفاتيح المطلوبة

### 1. Publishable Key
- **النوع**: مفتاح عام (آمن للعرض في المتصفح)
- **التنسيق**: `pk_test_...` أو `pk_live_...`
- **الاستخدام**: في الواجهة الأمامية للمتجر

### 2. Secret Key
- **النوع**: مفتاح سري (يجب إخفاؤه)
- **التنسيق**: `sk_test_...` أو `sk_live_...`
- **الاستخدام**: في الخادم للعمليات الحساسة

### 3. Webhook Secret (اختياري)
- **النوع**: مفتاح للتوقيع
- **التنسيق**: `whsec_...`
- **الاستخدام**: للتحقق من صحة Webhooks

## كيفية الحصول على المفاتيح

### 1. إنشاء حساب Stripe
1. انتقل إلى [stripe.com](https://stripe.com)
2. أنشئ حساب جديد
3. أكمل عملية التحقق

### 2. الوصول للمفاتيح
1. انتقل إلى [Dashboard](https://dashboard.stripe.com)
2. اختر **Developers** من القائمة الجانبية
3. اختر **API keys**
4. ستجد المفاتيح هناك

### 3. المفاتيح المتاحة
```
Publishable key: pk_test_51S2YPM6oNIQf9kuOLOZwM3ZB6gUXMSQxyDSvRiAO41nQpdRXwfT2XbDs98HWofgJcWF4DrzrLGqfrrfxrY9QwxYt00D8Dg04xJ
Secret key: sk_test_51S2YPM6oNIQf9kuOfRxcUtopsY1WydSX3wLmOiejogF5PbZ2PlAYmz0KABEECtZunyo3VPgISLUIa0higgi9ol6s00JPRmxVR3
```

## إعداد Stripe في النظام

### 1. في لوحة التحكم
1. انتقل إلى **الإعدادات** → **طرق الدفع**
2. ابحث عن **Stripe**
3. اضغط على **تعديل** أو **إضافة**

### 2. إدخال المفاتيح
```javascript
// إعدادات Stripe
{
  enabled: true,
  testMode: true, // أو false للإنتاج
  settings: {
    publishableKey: 'pk_test_51S2YPM6oNIQf9kuOLOZwM3ZB6gUXMSQxyDSvRiAO41nQpdRXwfT2XbDs98HWofgJcWF4DrzrLGqfrrfxrY9QwxYt00D8Dg04xJ',
    secretKey: 'sk_test_51S2YPM6oNIQf9kuOfRxcUtopsY1WydSX3wLmOiejogF5PbZ2PlAYmz0KABEECtZunyo3VPgISLUIa0higgi9ol6s00JPRmxVR3',
    webhookSecret: '' // اختياري
  }
}
```

### 3. إعدادات البيئة (اختياري)
```env
# في ملف .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51S2YPM6oNIQf9kuOLOZwM3ZB6gUXMSQxyDSvRiAO41nQpdRXwfT2XbDs98HWofgJcWF4DrzrLGqfrrfxrY9QwxYt00D8Dg04xJ
VITE_STRIPE_SECRET_KEY=sk_test_51S2YPM6oNIQf9kuOfRxcUtopsY1WydSX3wLmOiejogF5PbZ2PlAYmz0KABEECtZunyo3VPgISLUIa0higgi9ol6s00JPRmxVR3
```

## التحقق من صحة المفاتيح

### 1. التعبيرات النمطية المستخدمة
```javascript
// Publishable Key
/^pk_(test|live)_[a-zA-Z0-9]{24,}$/

// Secret Key
/^sk_(test|live)_[a-zA-Z0-9]{24,}$/

// Webhook Secret (اختياري)
/^whsec_[a-zA-Z0-9]{32,}$/
```

### 2. اختبار المفاتيح
```javascript
// اختبار مفاتيح صحيحة
const testKeys = {
  publishableKey: 'pk_test_51S2YPM6oNIQf9kuOLOZwM3ZB6gUXMSQxyDSvRiAO41nQpdRXwfT2XbDs98HWofgJcWF4DrzrLGqfrrfxrY9QwxYt00D8Dg04xJ',
  secretKey: 'sk_test_51S2YPM6oNIQf9kuOfRxcUtopsY1WydSX3wLmOiejogF5PbZ2PlAYmz0KABEECtZunyo3VPgISLUIa0higgi9ol6s00JPRmxVR3'
};

const result = await unifiedPaymentApi.validateProviderKeys('stripe', testKeys);
console.log('نتيجة التحقق:', result);
```

## إعداد Webhooks (اختياري)

### 1. إنشاء Webhook
1. في Stripe Dashboard، انتقل إلى **Developers** → **Webhooks**
2. اضغط على **Add endpoint**
3. أدخل URL الخاص بك: `https://yourdomain.com/api/webhooks/stripe`
4. اختر الأحداث المطلوبة:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

### 2. الحصول على Webhook Secret
1. بعد إنشاء Webhook، ستجد **Signing secret**
2. انسخ المفتاح الذي يبدأ بـ `whsec_`
3. أضفه في إعدادات النظام

## الأخطاء الشائعة وحلولها

### 1. "Publishable Key يجب أن يبدأ بـ pk_test_ أو pk_live_"
**السبب**: مفتاح غير صحيح أو تنسيق خاطئ
**الحل**: تأكد من نسخ المفتاح بالكامل من Stripe Dashboard

### 2. "Secret Key يجب أن يبدأ بـ sk_test_ أو sk_live_"
**السبب**: مفتاح غير صحيح أو تنسيق خاطئ
**الحل**: تأكد من نسخ المفتاح بالكامل من Stripe Dashboard

### 3. "Webhook Secret مطلوب"
**السبب**: النظام يتطلب Webhook Secret
**الحل**: تم تحديث النظام لجعل Webhook Secret اختياري

### 4. "مفتاح غير صالح"
**السبب**: المفتاح من بيئة مختلفة (test vs live)
**الحل**: تأكد من استخدام مفاتيح من نفس البيئة

## اختبار Stripe

### 1. بطاقات الاختبار
```javascript
// بطاقة ناجحة
const successCard = {
  number: '4242424242424242',
  expMonth: 12,
  expYear: 2025,
  cvc: '123'
};

// بطاقة فاشلة
const failureCard = {
  number: '4000000000000002',
  expMonth: 12,
  expYear: 2025,
  cvc: '123'
};
```

### 2. اختبار الدفع
```javascript
// إنشاء طلب اختبار
const testPayment = {
  amount: 1000, // 10.00 ريال
  currency: 'SAR',
  paymentMethod: 'card',
  card: successCard
};

const result = await unifiedPaymentApi.createPayment(testPayment);
console.log('نتيجة الدفع:', result);
```

## الأمان

### 1. حماية المفاتيح
- **لا تشارك** Secret Key أبداً
- **استخدم** متغيرات البيئة للمفاتيح الحساسة
- **تحقق** من صحة المفاتيح قبل الاستخدام

### 2. أفضل الممارسات
- استخدم **Test Mode** للتطوير
- اختبر **جميع سيناريوهات الدفع**
- راقب **سجلات الأخطاء** بانتظام

### 3. التحقق من التوقيعات
```javascript
// التحقق من توقيع Webhook
const isValid = await stripe.verifySignature(
  webhookData,
  signature,
  webhookSecret
);
```

## الانتقال للإنتاج

### 1. تغيير المفاتيح
1. في Stripe Dashboard، انتقل إلى **Live** mode
2. انسخ المفاتيح الجديدة
3. حدث إعدادات النظام

### 2. إعدادات الإنتاج
```javascript
{
  enabled: true,
  testMode: false, // تغيير إلى false
  settings: {
    publishableKey: 'pk_live_...',
    secretKey: 'sk_live_...',
    webhookSecret: 'whsec_...'
  }
}
```

### 3. اختبار الإنتاج
1. اختبر ببطاقة حقيقية صغيرة
2. تحقق من استلام الأموال
3. اختبر عملية الاسترداد

## الدعم

### في حالة المشاكل
1. **تحقق من المفاتيح**: تأكد من صحتها
2. **راجع السجلات**: ابحث عن أخطاء في Console
3. **اختبر الاتصال**: تأكد من وصول الطلبات لـ Stripe
4. **راجع التوثيق**: [Stripe Documentation](https://stripe.com/docs)

### روابط مفيدة
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)

---

**تم التطوير بواسطة**: فريق تطوير متجر الكتب  
**تاريخ التحديث**: ديسمبر 2024  
**الإصدار**: 1.0.0










