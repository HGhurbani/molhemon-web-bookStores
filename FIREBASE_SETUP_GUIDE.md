# 🚀 دليل إعداد وتشغيل متجر ملهمون - Firebase Backend

## 📋 نظرة عامة

تم تحويل المشروع ليعمل بالكامل على **Firebase** كـ backend، مما يوفر:
- **Firebase Firestore** - قاعدة بيانات NoSQL
- **Firebase Functions** - العمليات المعقدة
- **Firebase Storage** - تخزين الملفات
- **Firebase Authentication** - المصادقة
- **Firebase Hosting** - استضافة الموقع

## 🛠️ المتطلبات

### 1. **Node.js**
```bash
# تحقق من الإصدار
node --version  # يجب أن يكون 18 أو أعلى
npm --version
```

### 2. **Firebase CLI**
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login
```

### 3. **Git** (اختياري)
```bash
git --version
```

## 🔧 خطوات الإعداد

### 1. **استنساخ المشروع**
```bash
git clone [repository-url]
cd molhemon-web-bookStores
```

### 2. **تثبيت التبعيات**
```bash
# تثبيت تبعيات المشروع الرئيسي
npm install

# تثبيت تبعيات Firebase Functions
cd functions
npm install
cd ..
```

### 3. **إعداد Firebase Project**

#### أ. إنشاء مشروع Firebase جديد
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط على "Add project"
3. أدخل اسم المشروع: `molhem-book-store`
4. فعّل Google Analytics (اختياري)
5. أنشئ المشروع

#### ب. إعداد Firebase Services
1. **Firestore Database**
   - اذهب إلى Firestore Database
   - اضغط "Create database"
   - اختر "Start in test mode"
   - اختر موقع الخادم (أقرب للمنطقة)

2. **Authentication**
   - اذهب إلى Authentication
   - اضغط "Get started"
   - في تبويب "Sign-in method"
   - فعّل "Email/Password"
   - فعّل "Google" (اختياري)

3. **Storage**
   - اذهب إلى Storage
   - اضغط "Get started"
   - اختر "Start in test mode"
   - اختر موقع الخادم

4. **Functions**
   - اذهب إلى Functions
   - اضغط "Get started"
   - اتبع التعليمات

5. **Hosting**
   - اذهب إلى Hosting
   - اضغط "Get started"
   - اتبع التعليمات

### 4. **إعداد متغيرات البيئة**

#### أ. إنشاء ملف `.env`
```bash
# في جذر المشروع
touch .env
```

#### ب. إضافة متغيرات Firebase
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=molhem-book-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=molhem-book-store
VITE_FIREBASE_STORAGE_BUCKET=molhem-book-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# JWT Configuration
VITE_JWT_SECRET=your_super_secret_jwt_key

# App Configuration
VITE_APP_ENV=development
VITE_APP_NAME=Molhem Book Store

# Payment Gateways (Optional)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### ج. الحصول على Firebase Config
1. اذهب إلى Project Settings
2. في تبويب "General"
3. في قسم "Your apps"
4. اضغط على أيقونة Web
5. أدخل اسم التطبيق
6. انسخ Firebase config

### 5. **إعداد Firebase Functions**

#### أ. إعداد مفاتيح API للدفع
```bash
# Stripe
firebase functions:config:set stripe.secret_key="sk_test_your_stripe_secret_key"

# PayPal
firebase functions:config:set paypal.client_id="your_paypal_client_id"
firebase functions:config:set paypal.client_secret="your_paypal_client_secret"
```

#### ب. ربط المشروع بـ Firebase
```bash
# في جذر المشروع
firebase use --add

# اختر المشروع الذي أنشأته
# أدخل alias (مثل: default)
```

### 6. **نشر Firebase Rules**
```bash
# نشر Firestore Rules
firebase deploy --only firestore:rules

# نشر Storage Rules
firebase deploy --only storage
```

### 7. **نشر Firebase Functions**
```bash
# نشر Functions
firebase deploy --only functions
```

## 🚀 تشغيل المشروع

### 1. **وضع التطوير**
```bash
# تشغيل التطبيق
npm run dev

# في terminal منفصل - تشغيل Firebase Emulators
npm run firebase:emulators
```

### 2. **بناء للإنتاج**
```bash
# بناء التطبيق
npm run build

# نشر على Firebase Hosting
npm run firebase:deploy:hosting
```

### 3. **نشر كامل**
```bash
# نشر كل شيء
npm run firebase:deploy
```

## 📁 هيكل المشروع الجديد

```
molhemon-web-bookStores/
├── functions/                 # Firebase Functions
│   ├── index.js              # Functions الرئيسية
│   └── package.json          # تبعيات Functions
├── src/
│   ├── lib/
│   │   ├── firebase.js       # إعداد Firebase
│   │   ├── firebaseApi.js    # Firebase API
│   │   ├── firebaseFunctions.js # Firebase Functions API
│   │   └── api.js            # API الرئيسي
│   └── ...
├── firebase.json             # إعدادات Firebase
├── firestore.rules           # قواعد Firestore
├── storage.rules             # قواعد Storage
├── firestore.indexes.json    # فهارس Firestore
└── .firebaserc               # إعدادات المشروع
```

## 🔒 الأمان

### 1. **Firestore Security Rules**
- تم إعداد قواعد أمان شاملة
- تحكم في الوصول حسب دور المستخدم
- حماية البيانات الحساسة

### 2. **Storage Security Rules**
- تحكم في رفع الملفات
- حماية الملفات الحساسة
- تحكم في الوصول للملفات

### 3. **Functions Security**
- التحقق من المصادقة
- التحقق من الصلاحيات
- معالجة آمنة للمدفوعات

## 💳 إعداد المدفوعات

### 1. **Stripe**
```bash
# الحصول على مفاتيح Stripe
# من https://dashboard.stripe.com/apikeys

# إعداد في Firebase Functions
firebase functions:config:set stripe.secret_key="sk_test_..."
```

### 2. **PayPal**
```bash
# الحصول على مفاتيح PayPal
# من https://developer.paypal.com/

# إعداد في Firebase Functions
firebase functions:config:set paypal.client_id="..."
firebase functions:config:set paypal.client_secret="..."
```

## 📊 المراقبة والتحليلات

### 1. **Firebase Analytics**
- تتبع الاستخدام
- إحصائيات المبيعات
- تحليل السلوك

### 2. **Firebase Performance**
- مراقبة الأداء
- تحسين السرعة
- تتبع الأخطاء

### 3. **Firebase Crashlytics**
- تتبع الأخطاء
- تقارير الأعطال
- تحسين الاستقرار

## 🔧 استكشاف الأخطاء

### 1. **مشاكل الاتصال**
```bash
# التحقق من اتصال Firebase
firebase projects:list

# التحقق من الإعدادات
firebase use
```

### 2. **مشاكل Functions**
```bash
# عرض logs
firebase functions:log

# اختبار محلي
firebase emulators:start --only functions
```

### 3. **مشاكل Rules**
```bash
# اختبار Rules محلياً
firebase emulators:start --only firestore

# نشر Rules
firebase deploy --only firestore:rules
```

## 📈 النشر والإنتاج

### 1. **إعداد الإنتاج**
```bash
# تغيير إلى وضع الإنتاج
firebase use production

# نشر كل شيء
firebase deploy
```

### 2. **النسخ الاحتياطية**
- Firebase يقوم بنسخ احتياطية تلقائية
- يمكن إعداد نسخ احتياطية إضافية
- استرداد البيانات في حالة الطوارئ

### 3. **المراقبة**
- مراقبة الاستخدام
- تتبع التكاليف
- تحسين الأداء

## 🆘 الدعم والمساعدة

### 1. **الوثائق الرسمية**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Functions Documentation](https://firebase.google.com/docs/functions)

### 2. **المجتمع**
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

### 3. **الدعم الفني**
- البريد الإلكتروني: support@molhemon.com
- الهاتف: +966501234567

## ✅ قائمة التحقق

- [ ] تثبيت Node.js 18+
- [ ] تثبيت Firebase CLI
- [ ] إنشاء مشروع Firebase
- [ ] إعداد Firestore Database
- [ ] إعداد Authentication
- [ ] إعداد Storage
- [ ] إعداد Functions
- [ ] إعداد Hosting
- [ ] إنشاء ملف .env
- [ ] إضافة Firebase config
- [ ] إعداد مفاتيح الدفع
- [ ] ربط المشروع بـ Firebase
- [ ] نشر Rules
- [ ] نشر Functions
- [ ] اختبار التطبيق
- [ ] نشر للإنتاج

---

## 🎉 تهانينا!

لقد تم تحويل المشروع بنجاح ليعمل بالكامل على Firebase! 

**المميزات الجديدة:**
- ✅ سرعة عالية
- ✅ أمان محسن
- ✅ قابلية التوسع
- ✅ نسخ احتياطية تلقائية
- ✅ مراقبة شاملة
- ✅ تكلفة منخفضة

**الخطوات التالية:**
1. اختبار جميع الوظائف
2. إعداد البيانات التجريبية
3. نشر للإنتاج
4. مراقبة الأداء

---

**تم تطوير هذا النظام بواسطة فريق ملهمون** 🚀
