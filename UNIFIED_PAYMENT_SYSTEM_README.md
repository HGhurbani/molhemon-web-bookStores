# نظام المدفوعات الموحد الجديد
# Unified Payment System

## نظرة عامة
تم إعادة تصميم وبناء طبقة المدفوعات لتكون أكثر إنتاجية وأماناً، مع دعم مزودي الدفع العالمية والمحلية بطريقة موحدة ومتسقة.

## الميزات الجديدة

### 1. واجهة موحدة للمدفوعات
- **PaymentProvider Interface**: واجهة موحدة لجميع مزودي الدفع
- **PaymentManager**: مدير مركزي لتنسيق عمليات الدفع
- **UnifiedPaymentService**: خدمة موحدة لمعالجة المدفوعات
- **UnifiedPaymentAPI**: واجهة API موحدة للواجهة الأمامية

### 2. مزودي الدفع المدعومين

#### العالمية:
- **Stripe**: بطاقات ائتمان، Apple Pay، Google Pay
- **PayPal**: حسابات PayPal والبطاقات
- **Apple Pay**: الدفع عبر Apple
- **Google Pay**: الدفع عبر Google

#### المحلية:
- **Tabby**: الدفع بالتقسيط (الإمارات والسعودية)
- **Tamara**: الدفع بالتقسيط (السعودية)
- **STC Pay**: الدفع الإلكتروني (السعودية)
- **Mada**: شبكة المدفوعات السعودية
- **Qitaf**: الدفع بالتقسيط من البنك الأهلي
- **Fawry**: الدفع الإلكتروني (مصر)
- **PayFort**: بوابة دفع الشرق الأوسط
- **MyFatoorah**: بوابة دفع (العراق)
- **Cash on Delivery**: الدفع عند الاستلام

### 3. الميزات المتقدمة
- **Webhooks موحدة**: معالجة أحداث المدفوعات تلقائياً
- **إدارة العملاء**: حفظ طرق الدفع للعملاء
- **التقسيط**: دعم خطط التقسيط المختلفة
- **الاسترداد**: استرداد كامل وجزئي
- **الأمان**: تشفير البيانات، تحقق التوقيعات
- **تعدد العملات**: دعم عملات متعددة
- **تعدد اللغات**: رسائل خطأ ونجاح محلية

## البنية الجديدة

### الملفات الجديدة:
```
src/lib/payment/
├── PaymentProvider.js          # واجهة موحدة للمدفوعات
├── PaymentManager.js           # مدير المدفوعات
├── providers/
│   ├── StripeProvider.js       # مزود Stripe
│   ├── PayPalProvider.js       # مزود PayPal
│   ├── TabbyProvider.js        # مزود Tabby
│   └── CashOnDeliveryProvider.js # مزود الدفع عند الاستلام
├── config/
│   └── paymentConfig.js        # تكوين المدفوعات
└── services/
    └── UnifiedPaymentService.js # خدمة المدفوعات الموحدة

src/lib/api/
└── unifiedPaymentApi.js        # واجهة API الجديدة
```

### التحديثات:
- `src/lib/api.js`: تم تحديثه لاستخدام النظام الجديد
- `src/lib/paymentApi.js`: سيتم تحديثه لاستخدام النظام الجديد

## كيفية الاستخدام

### 1. تهيئة النظام
```javascript
import unifiedPaymentApi from './lib/api/unifiedPaymentApi.js';

// تهيئة النظام
await unifiedPaymentApi.initialize();
```

### 2. إنشاء عملية دفع
```javascript
const paymentData = {
  amount: 100.00,
  currency: 'SAR',
  orderId: 'order_123',
  customerId: 'customer_456',
  provider: 'stripe', // اختياري - سيتم اختيار أفضل مزود تلقائياً
  metadata: {
    description: 'شراء كتاب',
    customerEmail: 'customer@example.com'
  }
};

const result = await unifiedPaymentApi.createPaymentIntent(paymentData);
```

### 3. معالجة الدفع
```javascript
const paymentMethodData = {
  type: 'card',
  card: {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2025,
    cvc: '123'
  }
};

const result = await unifiedPaymentApi.confirmPayment(paymentId, paymentMethodData);
```

### 4. الحصول على طرق الدفع المتاحة
```javascript
const orderData = {
  amount: 100.00,
  currency: 'SAR',
  country: 'SA'
};

const methods = await unifiedPaymentApi.getAvailablePaymentMethods(orderData);
```

### 5. اختبار اتصال مزود
```javascript
const testResult = await unifiedPaymentApi.testProviderConnection('stripe');
```

## التكوين

### إعدادات المزودين
```javascript
// في Firebase Settings
{
  payments: {
    stripe: {
      enabled: true,
      testMode: true,
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookSecret: 'whsec_...'
    },
    paypal: {
      enabled: true,
      testMode: true,
      clientId: 'client_id_...',
      clientSecret: 'client_secret_...',
      webhookId: 'webhook_id_...'
    }
  }
}
```

### متغيرات البيئة المطلوبة
```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...

# PayPal
VITE_PAYPAL_CLIENT_ID=client_id_...
VITE_PAYPAL_CLIENT_SECRET=client_secret_...

# Tabby
VITE_TABBY_API_KEY=api_key_...
VITE_TABBY_SECRET_KEY=secret_key_...

# Tamara
VITE_TAMARA_API_KEY=api_key_...
VITE_TAMARA_SECRET_KEY=secret_key_...
```

## الأمان

### 1. تشفير البيانات
- تشفير مفاتيح API الحساسة
- تشفير بيانات البطاقات
- تشفير بيانات العملاء

### 2. تحقق التوقيعات
- تحقق توقيعات Webhook
- تحقق صحة البيانات
- منع التلاعب

### 3. Idempotency
- منع المعالجة المكررة
- ضمان الاتساق
- تتبع العمليات

### 4. Rate Limiting
- تحديد معدل الطلبات
- منع الإساءة
- حماية النظام

## الاختبار

### 1. اختبار الوحدات
```bash
# اختبار مزودي الدفع
npm test src/lib/payment/providers/

# اختبار مدير المدفوعات
npm test src/lib/payment/PaymentManager.js

# اختبار خدمة المدفوعات
npm test src/lib/services/UnifiedPaymentService.js
```

### 2. اختبار التكامل
```bash
# اختبار API المدفوعات
npm test src/lib/api/unifiedPaymentApi.js

# اختبار Webhooks
npm test src/lib/payment/webhooks/
```

### 3. اختبار القبول
```bash
# اختبار سيناريوهات الدفع
npm run test:acceptance:payments
```

## الترحيل

### 1. من النظام القديم
```javascript
// النظام القديم
const oldPayment = await PaymentService.createPayment(paymentData);

// النظام الجديد
const newPayment = await unifiedPaymentApi.createPaymentIntent(paymentData);
```

### 2. تحديث المكونات
```javascript
// تحديث PaymentProcessor
import unifiedPaymentApi from './lib/api/unifiedPaymentApi.js';

// استخدام API الجديد
const result = await unifiedPaymentApi.createPaymentIntent(paymentData);
```

### 3. تحديث DashboardSettings
```javascript
// تحديث إعدادات المدفوعات
const providers = await unifiedPaymentApi.getPaymentProviders();
const testResult = await unifiedPaymentApi.testProviderConnection('stripe');
```

## المراقبة والتتبع

### 1. السجلات
```javascript
// الحصول على سجل العمليات
const logs = await unifiedPaymentApi.getPaymentLogs(paymentId);
```

### 2. الإحصائيات
```javascript
// الحصول على إحصائيات المدفوعات
const stats = await unifiedPaymentApi.getPaymentStats();
```

### 3. الأخطاء
```javascript
// معالجة الأخطاء
try {
  const result = await unifiedPaymentApi.createPaymentIntent(paymentData);
} catch (error) {
  console.error('Payment error:', error.message);
  // معالجة الخطأ
}
```

## الدعم والمساعدة

### 1. الأخطاء الشائعة
- **خطأ في الاتصال**: تحقق من مفاتيح API
- **خطأ في التوقيع**: تحقق من Webhook Secret
- **خطأ في العملة**: تحقق من العملات المدعومة

### 2. حل المشاكل
```javascript
// اختبار الاتصال
const connectionTest = await unifiedPaymentApi.testProviderConnection('stripe');

// التحقق من الإعدادات
const settings = await unifiedPaymentApi.getProviderInfo('stripe');
```

### 3. التحديثات
- مراقبة تحديثات مزودي الدفع
- تحديث المكتبات بانتظام
- اختبار التحديثات قبل النشر

## خطة التطوير المستقبلية

### 1. مزودين جدد
- **Urway**: بوابة دفع سعودية
- **HyperPay**: بوابة دفع خليجية
- **PayTabs**: بوابة دفع إقليمية

### 2. ميزات متقدمة
- **الاشتراكات**: خطط متكررة
- **التقسيط المتقدم**: خطط مرنة
- **المحافظ الإلكترونية**: رصيد داخلي

### 3. تحسينات الأمان
- **PCI DSS**: امتثال كامل
- **3DS 2.0**: مصادقة متقدمة
- **التشفير المتقدم**: حماية إضافية

## المساهمة

### 1. إضافة مزود جديد
```javascript
// إنشاء مزود جديد
class NewProvider extends PaymentProvider {
  constructor(config) {
    super(config);
    // التهيئة
  }

  async createPaymentIntent(paymentData) {
    // تنفيذ إنشاء الدفع
  }

  async confirmPayment(paymentIntentId, paymentMethodData) {
    // تنفيذ تأكيد الدفع
  }
}
```

### 2. اختبار المزود الجديد
```javascript
// اختبار الوحدة
describe('NewProvider', () => {
  it('should create payment intent', async () => {
    // اختبار إنشاء الدفع
  });
});
```

### 3. توثيق المزود الجديد
```javascript
// إضافة التكوين
providers: {
  newProvider: {
    name: 'New Provider',
    displayName: 'New Provider',
    description: 'وصف المزود الجديد',
    // باقي الإعدادات
  }
}
```

---

## ملاحظات مهمة

1. **النسخ الاحتياطية**: احتفظ بنسخة احتياطية من النظام القديم
2. **الاختبار**: اختبر النظام الجديد في بيئة التطوير أولاً
3. **التدريج**: نفذ التحديث تدريجياً مع Feature Flag
4. **المراقبة**: راقب النظام بعد التحديث
5. **التوثيق**: وثق جميع التغييرات والإعدادات

---

*تم تطوير هذا النظام بواسطة فريق التطوير*
*آخر تحديث: ديسمبر 2024*










