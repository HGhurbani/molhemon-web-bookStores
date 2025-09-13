# 🚀 النظام المتكامل لإدارة الطلبات والمدفوعات والشحن

## 📋 نظرة عامة

تم تطوير نظام متكامل لإدارة جميع جوانب المتجر الإلكتروني، بما في ذلك:
- **إدارة الطلبات والمدفوعات** - تتبع شامل للطلبات والمدفوعات
- **نظام المدفوعات الموحد** - دعم متعدد مزودي الدفع
- **إدارة الشحنات** - حساب تكلفة الشحن بناءً على الوزن
- **إدارة المنتجات** - دعم الكتب الورقية والإلكترونية والصوتية
- **تتبع الطلبات** - واجهة شاملة لتتبع حالة الطلبات

## 🏗️ البنية التقنية

### المكونات الرئيسية

#### 1. نظام المدفوعات الموحد (`unifiedPaymentApi.js`)
```javascript
// دعم مزودي الدفع
- Stripe (بطاقات الائتمان)
- PayPal (المحافظ الإلكترونية)
- Tabby (التقسيط)
- الدفع عند الاستلام
```

#### 2. إدارة الطلبات (`OrdersManagementPage.jsx`)
```javascript
// الميزات الرئيسية
- عرض إحصائيات شاملة
- فلترة متقدمة للطلبات
- إدارة حالات الطلبات
- استرداد المدفوعات
- تفاصيل المنتجات حسب النوع
```

#### 3. إدارة الشحنات (`ShippingManagement.jsx`)
```javascript
// حساب تكلفة الشحن
- حساب الوزن الإجمالي للكتب الورقية
- تكلفة أساسية + تكلفة لكل كيلو
- دعم مزودي الشحن المحليين
- تتبع الشحنات
```

#### 4. تتبع الطلبات (`TrackOrderPage.jsx`)
```javascript
// واجهة تتبع شاملة
- عرض تفاصيل المنتجات
- سجل تتبع الطلب
- معلومات الشحن والدفع
- حالة الطلب المحدثة
```

## 📦 أنواع المنتجات المدعومة

### 1. الكتب الورقية (Physical Books)
```javascript
{
  type: 'physical',
  weight: 0.8, // كجم
  dimensions: { length: 20, width: 15, height: 3 }, // سم
  isbn: '978-1234567890',
  publisher: 'دار النشر العلمية',
  publicationYear: 2023,
  pages: 350,
  coverType: 'غلاف مقوى',
  translators: ['محمد أحمد'],
  originalLanguage: 'الإنجليزية',
  translatedLanguage: 'العربية'
}
```

### 2. الكتب الإلكترونية (Ebooks)
```javascript
{
  type: 'ebook',
  fileFormat: 'PDF',
  fileSize: '15MB',
  wordCount: 50000
}
```

### 3. الكتب الصوتية (Audiobooks)
```javascript
{
  type: 'audiobook',
  duration: '8:30:00', // ساعات:دقائق:ثواني
  narrator: 'أحمد حسن',
  audioQuality: 'HD'
}
```

## 💳 نظام المدفوعات

### مزودي الدفع المدعومين

#### 1. Stripe
- **الميزات**: 3DS، اشتراكات، تقسيط
- **العملات**: SAR, USD, EUR
- **البلدان**: عالمي
- **الإعدادات**: `publishableKey`, `secretKey`

#### 2. PayPal
- **الميزات**: محافظ إلكترونية، تقسيط
- **العملات**: SAR, USD, EUR
- **البلدان**: عالمي
- **الإعدادات**: `clientId`, `clientSecret`

#### 3. Tabby
- **الميزات**: تقسيط، تأجيل الدفع
- **العملات**: SAR, AED
- **البلدان**: الخليج العربي
- **الإعدادات**: `apiKey`, `secretKey`

#### 4. الدفع عند الاستلام
- **الميزات**: دفع نقدي
- **العملات**: SAR
- **البلدان**: السعودية
- **الإعدادات**: لا تحتاج مفاتيح API

### إعدادات المدفوعات

```javascript
// في لوحة التحكم → الإعدادات → المدفوعات
{
  providers: {
    stripe: {
      enabled: true,
      testMode: true,
      settings: {
        publishableKey: 'pk_test_...',
        secretKey: 'sk_test_...'
      }
    },
    paypal: {
      enabled: true,
      testMode: false,
      settings: {
        clientId: 'client_id_...',
        clientSecret: 'client_secret_...'
      }
    }
  },
  currency: 'SAR',
  taxRate: 15,
  autoCapture: true
}
```

## 🚚 نظام الشحن

### مزودي الشحن المدعومين

#### 1. البريد السعودي
- **التكلفة الأساسية**: 15 ريال
- **التكلفة لكل كيلو**: 5 ريال
- **الوزن الأقصى**: 30 كجم
- **مدة التوصيل**: 3-5 أيام

#### 2. أرامكس
- **التكلفة الأساسية**: 30 ريال
- **التكلفة لكل كيلو**: 10 ريال
- **الوزن الأقصى**: 100 كجم
- **مدة التوصيل**: 1-2 أيام

#### 3. DHL
- **التكلفة الأساسية**: 50 ريال
- **التكلفة لكل كيلو**: 15 ريال
- **الوزن الأقصى**: 500 كجم
- **مدة التوصيل**: 3-7 أيام

### حساب تكلفة الشحن

```javascript
const calculateShippingCost = (totalWeight, shippingMethodId) => {
  const shippingMethod = availableShippingMethods.find(method => method.id === shippingMethodId);
  if (!shippingMethod) return 0;

  // تكلفة أساسية + تكلفة لكل كيلو
  const baseCost = shippingMethod.cost;
  const costPerKg = 5;
  
  return baseCost + (totalWeight * costPerKg);
};
```

## 📊 إحصائيات النظام

### إحصائيات الطلبات
```javascript
{
  totalOrders: 150,
  totalRevenue: 45000,
  pendingOrders: 25,
  completedOrders: 120,
  failedPayments: 5,
  successRate: 96.7,
  physicalBooks: 80,
  ebooks: 45,
  audiobooks: 25
}
```

### إحصائيات الشحن
```javascript
{
  totalOrders: 150,
  pendingShipping: 15,
  inTransit: 30,
  delivered: 105,
  totalWeight: 125.5, // كجم
  totalShippingCost: 3750 // ريال
}
```

## 🔧 الإعدادات والتكوين

### إعدادات المتجر
```javascript
// في لوحة التحكم → الإعدادات → تفاصيل المتجر
{
  storeName: 'مكتبة ملهمون',
  currency: 'SAR',
  tax: {
    enabled: true,
    rate: 15
  },
  shipping: {
    baseCost: 15,
    costPerKg: 5,
    maxWeight: 50
  }
}
```

### إعدادات المدفوعات
```javascript
// في لوحة التحكم → الإعدادات → المدفوعات
{
  autoConnect: true, // ربط تلقائي مع مزودي الدفع
  testMode: true, // وضع الاختبار
  webhooks: {
    enabled: true,
    url: 'https://yourdomain.com/api/webhooks'
  }
}
```

### إعدادات الشحن
```javascript
// في لوحة التحكم → الإعدادات → الشحن
{
  providers: {
    saudiPost: {
      enabled: true,
      basePrice: 15,
      pricePerKg: 5,
      maxWeight: 30
    },
    aramex: {
      enabled: true,
      basePrice: 30,
      pricePerKg: 10,
      maxWeight: 100
    }
  }
}
```

## 🚀 كيفية الاستخدام

### 1. إعداد النظام
```bash
# تشغيل التطبيق
npm run dev

# الوصول للوحة التحكم
http://localhost:5173/dashboard/settings
```

### 2. إعداد المدفوعات
1. انتقل إلى **لوحة التحكم → الإعدادات → المدفوعات**
2. اختر مزود الدفع المطلوب
3. اضغط على **"🔗 ربط تلقائي"** أو **"إعداد يدوي"**
4. أدخل مفاتيح API
5. اختبر الاتصال

### 3. إعداد الشحن
1. انتقل إلى **لوحة التحكم → الإعدادات → الشحن**
2. فعّل مزودي الشحن المطلوبين
3. أدخل إعدادات API لكل مزود
4. اختبر الاتصال

### 4. إدارة الطلبات
1. انتقل إلى **لوحة التحكم → إدارة الطلبات**
2. استعرض الإحصائيات الشاملة
3. استخدم الفلاتر للبحث
4. حدّث حالات الطلبات
5. أضف أرقام التتبع

### 5. تتبع الطلبات
1. انتقل إلى **تتبع الطلب**
2. أدخل رقم الطلب
3. استعرض التفاصيل الشاملة
4. تابع حالة الشحن

## 📱 الواجهات الرئيسية

### 1. لوحة التحكم
- **الإعدادات**: إدارة المتجر والمدفوعات والشحن
- **إدارة الطلبات**: تتبع شامل للطلبات والمدفوعات
- **إدارة الشحنات**: إدارة الشحنات والتتبع

### 2. إتمام الطلب
- اختيار طريقة الدفع
- حساب تكلفة الشحن تلقائياً
- إنشاء Payment Intent
- معالجة الدفع

### 3. تتبع الطلب
- عرض تفاصيل المنتجات
- سجل تتبع الطلب
- معلومات الشحن والدفع

## 🔒 الأمان والامتثال

### معايير الأمان
- **PCI SAQ A**: معيار أمان بطاقات الائتمان
- **تشفير البيانات**: تشفير مفاتيح API
- **تحقق التوقيع**: تحقق من صحة Webhooks
- **Rate Limiting**: حماية من الهجمات

### إعدادات الأمان
```javascript
{
  security: {
    pciCompliant: true,
    encryption: {
      enabled: true,
      algorithm: 'AES-256'
    },
    webhooks: {
      signatureVerification: true,
      timeout: 5000
    },
    rateLimiting: {
      enabled: true,
      maxRequests: 100,
      windowMs: 900000
    }
  }
}
```

## 🧪 الاختبار

### اختبار المدفوعات
```javascript
// اختبار Stripe
const testStripePayment = async () => {
  const paymentData = {
    amount: 100,
    currency: 'SAR',
    provider: 'stripe',
    testCard: '4242424242424242'
  };
  
  const result = await unifiedPaymentApi.createPaymentIntent(paymentData);
  console.log('Payment Result:', result);
};
```

### اختبار الشحن
```javascript
// اختبار حساب الشحن
const testShippingCalculation = () => {
  const items = [
    { type: 'physical', weight: 0.5, quantity: 2 },
    { type: 'physical', weight: 1.2, quantity: 1 }
  ];
  
  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  const shippingCost = calculateShippingCost(totalWeight, 'saudiPost');
  
  console.log('Total Weight:', totalWeight, 'kg');
  console.log('Shipping Cost:', shippingCost, 'SAR');
};
```

## 📈 المراقبة والتقارير

### تقارير المبيعات
- إجمالي المبيعات اليومية/الشهرية/السنوية
- تحليل المنتجات الأكثر مبيعاً
- تقارير المدفوعات الفاشلة
- معدل نجاح المدفوعات

### تقارير الشحن
- إجمالي تكلفة الشحن
- متوسط تكلفة الشحن للطلب
- تحليل مزودي الشحن
- تقارير التوصيل في الوقت المحدد

## 🔄 التحديثات والصيانة

### التحديثات التلقائية
- تحديث أسعار الشحن
- تحديث حالة الطلبات
- مزامنة المدفوعات
- تحديث أرقام التتبع

### النسخ الاحتياطية
- نسخ احتياطية يومية للبيانات
- حفظ سجلات المعاملات
- استرداد البيانات في حالة الطوارئ

## 📞 الدعم والمساعدة

### الوثائق
- [دليل المستخدم](docs/user-guide.md)
- [دليل المطور](docs/developer-guide.md)
- [API Documentation](docs/api-docs.md)

### الدعم الفني
- البريد الإلكتروني: support@molhemon.com
- الهاتف: +966501234567
- الدردشة المباشرة: متاحة في لوحة التحكم

## 🎯 الميزات المستقبلية

### الميزات المخططة
- دعم المزيد من مزودي الدفع
- نظام الولاء والنقاط
- التوصيات الذكية
- التحليلات المتقدمة
- تطبيق الهاتف المحمول

### التحسينات
- تحسين أداء النظام
- إضافة المزيد من خيارات الشحن
- تحسين واجهة المستخدم
- إضافة المزيد من التقارير

---

## 📝 ملاحظات مهمة

1. **البيانات التجريبية**: النظام يستخدم بيانات تجريبية للعرض
2. **مفاتيح API**: يجب استبدالها بمفاتيح حقيقية للإنتاج
3. **الأمان**: تأكد من تفعيل جميع إعدادات الأمان
4. **النسخ الاحتياطية**: قم بإعداد النسخ الاحتياطية المنتظمة
5. **المراقبة**: راقب النظام باستمرار للتأكد من الأداء الأمثل

---

**تم تطوير هذا النظام بواسطة فريق ملهمون** 🚀










