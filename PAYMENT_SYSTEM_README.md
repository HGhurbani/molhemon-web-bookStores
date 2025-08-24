# نظام المدفوعات - ملهمون

## نظرة عامة

تم تطوير نظام مدفوعات شامل ومتكامل لموقع ملهمون، يدعم جميع طرق الدفع الشائعة مع إمكانية ربط الحسابات والـ APIs تلقائياً.

## المميزات الرئيسية

### 1. طرق الدفع المدعومة

#### بطاقات الائتمان
- **Visa** - مع دعم API كامل
- **Mastercard** - مع دعم API كامل  
- **American Express** - مع دعم API كامل

#### المحافظ الرقمية
- **PayPal** - مع دعم Client ID و Secret
- **Apple Pay** - مع دعم Merchant ID و Certificate
- **Google Pay** - مع دعم Merchant ID و API Key

#### طرق الدفع المحلية
- **مدى (Mada)** - للعملاء السعوديين
- **STC Pay** - للعملاء السعوديين
- **تحويل بنكي** - مع تفاصيل الحساب البنكي

#### طرق الدفع البديلة
- **الدفع عند الاستلام** - مع حد أقصى للمبلغ
- **Bitcoin** - مع عنوان المحفظة
- **Ethereum** - مع عنوان المحفظة

### 2. تكامل حسابات المشترين

- **حفظ طرق الدفع** - للمشترين المسجلين
- **الربط التلقائي** - مع طرق الدفع المحفوظة
- **التحقق من الحساب** - للتأكد من صحة البيانات
- **إدارة طرق الدفع** - إضافة وحذف الطرق المحفوظة

### 3. إحصائيات وتحليلات

- **إجمالي المدفوعات** - تتبع إجمالي المدفوعات
- **معدل النجاح** - نسبة المعاملات الناجحة
- **طرق الدفع المتصلة** - عدد الطرق المفعلة
- **تحليلات مفصلة** - حسب الطريقة والفترة الزمنية

## الملفات الرئيسية

### 1. `src/components/DashboardSettings.jsx`
- إعدادات المدفوعات في لوحة التحكم
- إدارة طرق الدفع وربطها
- تكامل حسابات المشترين
- إحصائيات المدفوعات

### 2. `src/lib/paymentApi.js`
- API شامل لمعالجة المدفوعات
- ربط طرق الدفع بالحسابات
- معالجة المعاملات والاسترداد
- إدارة حسابات المشترين

### 3. `src/components/PaymentProcessor.jsx`
- معالج الدفع في صفحة الدفع
- واجهة اختيار طرق الدفع
- معالجة بيانات البطاقات
- دعم الطرق المحفوظة

### 4. `src/data/siteData.js`
- إعدادات المدفوعات الافتراضية
- تكوين طرق الدفع
- إعدادات حسابات المشترين

## إعداد النظام

### 1. متطلبات البيئة

```bash
# متغيرات البيئة المطلوبة
REACT_APP_API_URL=https://api.molhemoon.com
REACT_APP_PAYMENT_API_KEY=your_payment_api_key
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد قاعدة البيانات

```sql
-- جدول طرق الدفع
CREATE TABLE payment_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  connected BOOLEAN DEFAULT FALSE,
  credentials JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول حسابات المشترين
CREATE TABLE buyer_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  payment_method_id INT,
  masked_data VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- جدول المعاملات
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT NOT NULL,
  payment_method_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status ENUM('pending', 'succeeded', 'failed', 'refunded') DEFAULT 'pending',
  reference VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);
```

## استخدام النظام

### 1. إعداد طرق الدفع

```javascript
// في لوحة التحكم
import { PaymentsSettings } from '@/components/DashboardSettings';

// تفعيل طريقة دفع
const enablePaymentMethod = async (method) => {
  await paymentApi.connectPaymentMethod(method, {
    apiKey: 'your_api_key',
    secretKey: 'your_secret_key',
    testMode: true
  });
};
```

### 2. معالجة الدفع

```javascript
// في صفحة الدفع
import PaymentProcessor from '@/components/PaymentProcessor';

const CheckoutPage = () => {
  const handlePaymentSuccess = (result) => {
    // معالجة نجاح الدفع
    console.log('Payment successful:', result);
  };

  const handlePaymentError = (error) => {
    // معالجة فشل الدفع
    console.error('Payment failed:', error);
  };

  return (
    <PaymentProcessor
      orderData={{
        subtotal: 100,
        shipping: 15,
        tax: 15,
        total: 130
      }}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
      buyerAccount={currentUser}
      availableMethods={['visa', 'mastercard', 'paypal', 'mada']}
    />
  );
};
```

### 3. إدارة حسابات المشترين

```javascript
// حفظ طريقة دفع للمشترين
const savePaymentMethod = async (buyerId, paymentMethod) => {
  await paymentApi.saveBuyerPaymentMethod(buyerId, {
    type: 'visa',
    data: {
      cardNumber: '**** **** **** 1234',
      expiryDate: '12/25'
    }
  });
};

// جلب طرق الدفع المحفوظة
const getSavedMethods = async (buyerId) => {
  const methods = await paymentApi.getBuyerPaymentMethods(buyerId);
  return methods;
};
```

## API Endpoints

### طرق الدفع

```javascript
// ربط طريقة دفع
POST /payments/connect/{method}
{
  "credentials": {
    "apiKey": "your_api_key",
    "secretKey": "your_secret_key",
    "testMode": true
  }
}

// إلغاء ربط طريقة دفع
DELETE /payments/disconnect/{method}

// اختبار طريقة دفع
POST /payments/test/{method}
```

### معالجة المدفوعات

```javascript
// إنشاء نية الدفع
POST /payments/create-intent
{
  "amount": 130.00,
  "currency": "SAR",
  "paymentMethod": "visa",
  "paymentData": {
    "cardNumber": "4242424242424242",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}

// تأكيد الدفع
POST /payments/confirm/{paymentIntentId}
{
  "paymentMethodId": "pm_123456789"
}

// استرداد الدفع
POST /payments/refund/{paymentId}
{
  "amount": 130.00,
  "reason": "Customer request"
}
```

### حسابات المشترين

```javascript
// ربط حساب المشتري
POST /buyers/link-payment-methods
{
  "buyerId": 123,
  "paymentMethods": ["visa", "paypal"]
}

// جلب طرق الدفع المحفوظة
GET /buyers/{buyerId}/payment-methods

// حفظ طريقة دفع
POST /buyers/{buyerId}/payment-methods
{
  "type": "visa",
  "data": {
    "cardNumber": "**** **** **** 1234",
    "expiryDate": "12/25"
  }
}

// حذف طريقة دفع
DELETE /buyers/{buyerId}/payment-methods/{methodId}
```

## الأمان

### 1. تشفير البيانات

- جميع البيانات الحساسة مشفرة باستخدام AES-256
- كلمات المرور والـ API Keys محفوظة بشكل مشفر
- استخدام HTTPS لجميع الاتصالات

### 2. التحقق من الهوية

- استخدام JWT tokens للمصادقة
- التحقق من صلاحيات المستخدم
- تسجيل جميع العمليات للتدقيق

### 3. حماية من الاحتيال

- فحص المعاملات المشبوهة
- تحديد حدود المعاملات
- مراقبة الأنماط غير العادية

## الاختبار

### 1. اختبار طرق الدفع

```javascript
// اختبار بطاقة Visa
const testVisaPayment = async () => {
  const result = await paymentApi.processPayment({
    method: 'visa',
    amount: 100,
    testCard: '4242424242424242'
  });
  console.log('Test result:', result);
};

// اختبار PayPal
const testPayPalPayment = async () => {
  const result = await paymentApi.processPayment({
    method: 'paypal',
    amount: 100,
    testMode: true
  });
  console.log('Test result:', result);
};
```

### 2. اختبار حسابات المشترين

```javascript
// اختبار حفظ طريقة دفع
const testSavePaymentMethod = async () => {
  const result = await paymentApi.saveBuyerPaymentMethod(1, {
    type: 'visa',
    data: {
      cardNumber: '**** **** **** 1234',
      expiryDate: '12/25'
    }
  });
  console.log('Save result:', result);
};
```

## المراقبة والصيانة

### 1. مراقبة الأداء

- مراقبة معدل نجاح المعاملات
- تتبع أوقات الاستجابة
- مراقبة استخدام الموارد

### 2. النسخ الاحتياطي

- نسخ احتياطي يومي لقاعدة البيانات
- نسخ احتياطي للإعدادات
- خطة استعادة في حالة الطوارئ

### 3. التحديثات

- تحديثات أمنية دورية
- تحديث طرق الدفع الجديدة
- تحسين الأداء المستمر

## الدعم والمساعدة

### 1. التوثيق

- دليل المستخدم المفصل
- أمثلة عملية للاستخدام
- فيديوهات تعليمية

### 2. الدعم الفني

- فريق دعم متخصص
- رد سريع على الاستفسارات
- حل المشاكل التقنية

### 3. التدريب

- جلسات تدريب للموظفين
- ورش عمل للاستخدام الأمثل
- دعم مستمر للفريق

## الخلاصة

نظام المدفوعات في ملهمون يوفر حلاً شاملاً ومتكاملاً لمعالجة جميع أنواع المدفوعات، مع التركيز على الأمان والسهولة في الاستخدام. النظام يدعم جميع طرق الدفع الشائعة ويوفر تكاملاً سلساً مع حسابات المشترين.

---

**ملاحظة:** هذا النظام مصمم خصيصاً لموقع ملهمون ويمكن تخصيصه حسب الاحتياجات المحددة. 