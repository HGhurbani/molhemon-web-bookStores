# 👨‍💻 دليل المطور - متجر ملهمون للكتب

## 🏗️ البنية التقنية

### **Frontend Stack:**
- **React 18** - مكتبة واجهة المستخدم
- **Vite** - أداة البناء السريعة
- **Tailwind CSS** - إطار عمل CSS
- **Framer Motion** - رسوم متحركة
- **React Router** - توجيه الصفحات
- **i18next** - الترجمة والتعدد اللغوي

### **Backend Stack:**
- **Firebase Firestore** - قاعدة بيانات NoSQL
- **Firebase Functions** - العمليات المعقدة
- **Firebase Storage** - تخزين الملفات
- **Firebase Auth** - المصادقة
- **Firebase Hosting** - استضافة الموقع

---

## 📁 هيكل المشروع

```
molhemon-web-bookStores/
├── functions/                 # Firebase Functions
│   ├── index.js              # Functions الرئيسية
│   └── package.json          # تبعيات Functions
├── shared/                    # ملفات مشتركة مثل المخططات
│   └── schemas.js            # مخططات البيانات الموحدة
├── src/
│   ├── components/           # مكونات React
│   │   ├── ui/              # مكونات واجهة المستخدم الأساسية
│   │   ├── Dashboard.jsx    # لوحة التحكم الرئيسية
│   │   └── ...
│   ├── pages/               # صفحات التطبيق
│   │   ├── CheckoutPage.jsx # صفحة إتمام الطلب
│   │   ├── StoreSettingsPage.jsx # صفحة إعدادات المتجر
│   │   └── ...
│   ├── lib/                 # مكتبات ووحدات مساعدة
│   │   ├── firebase.js      # إعداد Firebase
│   │   ├── firebaseApi.js   # Firebase API
│   │   ├── firebaseFunctions.js # Firebase Functions API
│   │   ├── api.js           # API الرئيسي
│   │   ├── services/        # خدمات إدارة البيانات
│   │   └── ...
│   └── locales/             # ملفات الترجمة
│       ├── ar.json          # العربية
│       └── en.json          # الإنجليزية
├── firebase.json            # إعدادات Firebase
├── firestore.rules          # قواعد Firestore
├── storage.rules            # قواعد Storage
└── .firebaserc              # إعدادات المشروع
```

## 📦 مشاركة المخططات

لتحقيق إعادة استخدام مخططات البيانات بين واجهة المستخدم ووظائف Firebase، تم نقلها إلى المسار `shared/schemas.js`.

- **الاستيراد داخل وظائف Firebase:**
```javascript
const { Schemas, validateData } = require('../shared/schemas.js');
```

- **الاستيراد داخل خدمات الواجهة:**
```javascript
import schemas from '../../../shared/schemas.js';
const { Schemas, validateData } = schemas;
```

---

## 🔧 أدوات التطوير

### **الأوامر الأساسية:**
```bash
# التطوير
npm run dev                   # تشغيل خادم التطوير
npm run build                 # بناء للإنتاج
npm run preview               # معاينة البناء

# Firebase
firebase emulators:start      # تشغيل Firebase Emulators
firebase deploy               # نشر كل شيء
firebase deploy --only hosting # نشر Hosting فقط
firebase deploy --only functions # نشر Functions فقط
```

### **Firebase Emulators:**
```bash
# تشغيل جميع Emulators
firebase emulators:start

# تشغيل Emulators محددة
firebase emulators:start --only firestore,functions,storage
```

**روابط Emulators:**
- **Firestore:** http://localhost:4000
- **Functions:** http://localhost:5001
- **Storage:** http://localhost:9199
- **UI:** http://localhost:4000

### 🧪 إنشاء بيئة اختبار منفصلة
1. انسخ ملف البيئة `.env` إلى `.env.test` وحدّث بيانات مشروع Firebase التجريبية.
2. استخدم `firebase use <project-id>` للتبديل إلى مشروع الاختبار.
3. شغّل التطبيق في وضع الاختبار باستخدام:
```bash
npm run dev -- --mode test
```
أو لبناء نسخة اختبار:
```bash
npm run build -- --mode test
```
---

## 🗄️ قاعدة البيانات (Firestore)

### **المجموعات الرئيسية:**

#### **الكتب (books):**
```javascript
{
  id: "book_id",
  title: "عنوان الكتاب",
  author: "اسم المؤلف",
  category: "الفئة",
  price: 50.00,
  originalPrice: 60.00,
  description: "وصف الكتاب",
  coverImage: "رابط الصورة",
  type: "physical|ebook|audiobook",
  stock: 100,
  rating: 4.5,
  reviews: 25,
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### **الطلبات (orders):**
```javascript
{
  id: "order_id",
  userId: "user_id",
  orderNumber: "ORD-2024-001",
  status: "pending|processing|shipped|delivered|cancelled",
  items: [
    {
      id: "book_id",
      title: "عنوان الكتاب",
      quantity: 2,
      price: 50.00,
      type: "physical"
    }
  ],
  total: 100.00,
  shippingAddress: {...},
  paymentMethod: "stripe|paypal|cash",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### **المستخدمين (users):**
```javascript
{
  id: "user_id",
  email: "user@example.com",
  displayName: "اسم المستخدم",
  role: "admin|manager|customer",
  addresses: [...],
  paymentMethods: [...],
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

---

## 🔐 Firebase Security Rules

### **Firestore Rules:**
```javascript
// مثال: قواعد الكتب
match /books/{bookId} {
  allow read: if true; // قراءة عامة
  allow write: if isManager(); // كتابة للمديرين فقط
}
```

### **Storage Rules:**
```javascript
// مثال: قواعد رفع الصور
match /book-covers/{allPaths=**} {
  allow read: if true;
  allow write: if isManager();
}
```

---

## 🚀 Firebase Functions

### **Functions المتاحة:**

#### **المدفوعات:**
```javascript
// Stripe Payment Intent
exports.createStripePaymentIntent = functions.https.onCall(...)

// PayPal Order
exports.createPayPalOrder = functions.https.onCall(...)
```

#### **الطلبات:**
```javascript
// معالجة الطلب
exports.processOrder = functions.https.onCall(...)
```

#### **الشحن:**
```javascript
// حساب تكلفة الشحن
exports.calculateShipping = functions.https.onCall(...)
```

#### **المخزون:**
```javascript
// تحديث المخزون
exports.updateStock = functions.https.onCall(...)
```

---

## 🎨 تطوير المكونات

### **إنشاء مكون جديد:**
```jsx
// src/components/NewComponent.jsx
import React from 'react';
import { Button } from './ui/button';

const NewComponent = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button onClick={onAction}>
        تنفيذ الإجراء
      </Button>
    </div>
  );
};

export default NewComponent;
```

### **استخدام Firebase API:**
```jsx
import { api } from '@/lib/api';

const MyComponent = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.getBooks();
        setBooks(data);
      } catch (error) {
        console.error('خطأ في جلب الكتب:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      {books.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
};
```

---

## 🌐 إضافة صفحة جديدة

### 1. **إنشاء الصفحة:**
```jsx
// src/pages/NewPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const NewPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {t('newPage.title')}
      </h1>
      <p>{t('newPage.description')}</p>
    </div>
  );
};

export default NewPage;
```

### 2. **إضافة التوجيه:**
```jsx
// src/App.jsx
import NewPage from './pages/NewPage';

// في Routes
<Route path="/new-page" element={<NewPage />} />
```

### 3. **إضافة الترجمة:**
```json
// src/locales/ar.json
{
  "newPage": {
    "title": "الصفحة الجديدة",
    "description": "وصف الصفحة الجديدة"
  }
}
```

---

## 🔧 إضافة خدمة جديدة

### **إنشاء خدمة:**
```javascript
// src/lib/services/NewService.js
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

class NewService {
  async createItem(data) {
    try {
      const docRef = await addDoc(collection(db, 'items'), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`خطأ في إنشاء العنصر: ${error.message}`);
    }
  }

  async getItems() {
    try {
      const snapshot = await getDocs(collection(db, 'items'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`خطأ في جلب العناصر: ${error.message}`);
    }
  }
}

export default new NewService();
```

### **استخدام الخدمة:**
```jsx
import newService from '@/lib/services/NewService';

const MyComponent = () => {
  const handleCreate = async () => {
    try {
      const id = await newService.createItem({
        name: 'عنصر جديد',
        description: 'وصف العنصر'
      });
      console.log('تم إنشاء العنصر:', id);
    } catch (error) {
      console.error('خطأ:', error.message);
    }
  };

  return <button onClick={handleCreate}>إنشاء عنصر</button>;
};
```

---

## 🧪 الاختبار

### **اختبار المكونات:**
```jsx
// src/components/__tests__/NewComponent.test.jsx
import { render, screen } from '@testing-library/react';
import NewComponent from '../NewComponent';

test('يعرض العنوان بشكل صحيح', () => {
  render(<NewComponent title="عنوان الاختبار" />);
  expect(screen.getByText('عنوان الاختبار')).toBeInTheDocument();
});
```

### **اختبار Firebase Functions:**
```javascript
// functions/test/index.test.js
const test = require('firebase-functions-test')();

describe('Cloud Functions', () => {
  test('should create payment intent', async () => {
    const wrapped = test.wrap(require('../index').createStripePaymentIntent);
    const data = { amount: 100, currency: 'SAR' };
    
    const result = await wrapped(data, { auth: { uid: 'test-user' } });
    expect(result.success).toBe(true);
  });
});
```

---

## 📊 المراقبة والتحليلات

### **Firebase Analytics:**
```javascript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

// تتبع حدث
logEvent(analytics, 'purchase', {
  currency: 'SAR',
  value: 100.00,
  items: ['book_id_1', 'book_id_2']
});
```

### **Firebase Performance:**
```javascript
import { getPerformance, trace } from 'firebase/performance';

const perf = getPerformance();
const trace = trace(perf, 'page_load');

trace.start();
// ... كود الصفحة
trace.stop();
```

---

## 🚀 النشر

### **النشر المحلي:**
```bash
# بناء المشروع
npm run build

# نشر على Firebase Hosting
firebase deploy --only hosting
```

### **النشر للإنتاج:**
```bash
# نشر كل شيء
firebase deploy

# نشر Functions فقط
firebase deploy --only functions

# نشر Rules فقط
firebase deploy --only firestore:rules
```

---

## 🔍 استكشاف الأخطاء

### **أخطاء Firebase:**
```bash
# عرض logs
firebase functions:log

# اختبار Functions محلياً
firebase emulators:start --only functions
```

### **أخطاء التطبيق:**
```bash
# فحص التبعيات
npm audit

# إعادة تثبيت التبعيات
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 الموارد المفيدة

### **الوثائق:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

### **الأدوات:**
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)

---

## 🤝 المساهمة

### **إرشادات المساهمة:**
1. Fork المشروع
2. أنشئ فرع للميزة الجديدة
3. اكتب الكود مع الاختبارات
4. تأكد من اتباع معايير الكود
5. أرسل Pull Request

### **معايير الكود:**
- استخدم ESLint و Prettier
- اكتب تعليقات باللغة العربية
- اتبع نمط التسمية الموحد
- اكتب اختبارات للميزات الجديدة

---

**🚀 استمتع بالتطوير مع متجر ملهمون!**
