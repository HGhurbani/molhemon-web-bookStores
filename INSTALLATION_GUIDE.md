# 🚀 دليل التثبيت والإعداد - متجر ملهمون للكتب

## 📋 نظرة عامة

متجر ملهمون للكتب هو نظام متجر إلكتروني متكامل مبني بالكامل على **Firebase** كـ backend، مع واجهة مستخدم حديثة باستخدام **React** و **Vite**.

### 🏗️ البنية التقنية
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Firebase (Firestore + Functions + Storage + Auth + Hosting)
- **المدفوعات:** Stripe + PayPal + الدفع عند الاستلام
- **الشحن:** نظام شحن ذكي مع حساب تكلفة تلقائي

---

## 🛠️ المتطلبات الأساسية

### 1. **Node.js**
```bash
# تحقق من الإصدار (يجب أن يكون 18 أو أعلى)
node --version
npm --version
```

**تحميل Node.js:** [https://nodejs.org/](https://nodejs.org/)

### 2. **Git** (اختياري)
```bash
git --version
```

**تحميل Git:** [https://git-scm.com/](https://git-scm.com/)

### 3. **Firebase CLI**
```bash
# تثبيت Firebase CLI عالمياً
npm install -g firebase-tools

# التحقق من التثبيت
firebase --version
```

---

## 📥 خطوات التثبيت

### 1. **استنساخ المشروع**

#### أ. من GitHub:
```bash
git clone https://github.com/your-username/molhemon-web-bookStores.git
cd molhemon-web-bookStores
```

#### ب. تحميل ZIP:
1. اضغط على "Code" في GitHub
2. اختر "Download ZIP"
3. استخرج الملفات
4. افتح Terminal في مجلد المشروع

### 2. **تثبيت التبعيات**

```bash
# تثبيت تبعيات المشروع الرئيسي
npm install

# تثبيت تبعيات Firebase Functions
cd functions
npm install
cd ..
```

### 3. **إعداد Firebase**

#### أ. تسجيل الدخول إلى Firebase:
```bash
firebase login
```

#### ب. ربط المشروع بـ Firebase:
```bash
# عرض المشاريع المتاحة
firebase projects:list

# ربط المشروع (إذا لم يكن مربوطاً)
firebase use --add

# اختر المشروع: molhem-book-store
# أدخل alias: default
```

#### ج. التحقق من الربط:
```bash
firebase use
# يجب أن يظهر: Active Project: default (molhem-book-store)
```

---

## ⚙️ إعداد متغيرات البيئة

### 1. **إنشاء ملف .env**

```bash
# في جذر المشروع
touch .env
```

### 2. **إضافة متغيرات Firebase**

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDbW7bX1m10rPyLtqxdec6f8I7u09-Dcq0
VITE_FIREBASE_AUTH_DOMAIN=molhem-book-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=molhem-book-store
VITE_FIREBASE_STORAGE_BUCKET=molhem-book-store.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=405854542171
VITE_FIREBASE_APP_ID=1:405854542171:web:f5ec90eca02e261da8a27e
VITE_FIREBASE_MEASUREMENT_ID=G-J7N2QML49Z

# JWT Configuration
VITE_JWT_SECRET=molhem-book-store-super-secret-jwt-key-2024

# App Configuration
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000

# Payment Configuration (اختياري)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id

# Google Merchant Integration (اختياري)
VITE_GOOGLE_MERCHANT_ID=your-google-merchant-id
VITE_GOOGLE_API_KEY=your-google-api-key
```

> **ملاحظة:** المتغيرات أعلاه مُعدة مسبقاً للمشروع الحالي. لا تحتاج لتغييرها إلا إذا كنت تريد إعداد مشروع جديد.

---

## 🔧 إعداد Firebase Services

### 1. **Firestore Database**
```bash
# نشر Firestore Rules
firebase deploy --only firestore:rules

# نشر Firestore Indexes
firebase deploy --only firestore:indexes
```

### 2. **Firebase Storage**
```bash
# نشر Storage Rules
firebase deploy --only storage
```

### 3. **Firebase Functions**
```bash
# نشر Functions
firebase deploy --only functions
```

### 4. **Firebase Hosting**
```bash
# بناء المشروع أولاً
npm run build

# نشر على Hosting
firebase deploy --only hosting
```

---

## 🚀 تشغيل المشروع

### 1. **وضع التطوير**

```bash
# تشغيل التطبيق
npm run dev
```

سيتم تشغيل التطبيق على: `http://localhost:5173`

### 2. **تشغيل Firebase Emulators** (اختياري)

```bash
# في terminal منفصل
npm run firebase:emulators
```

سيتم تشغيل Emulators على:
- **Firestore:** http://localhost:4000
- **Functions:** http://localhost:5001
- **Storage:** http://localhost:9199

### 3. **بناء للإنتاج**

```bash
# بناء المشروع
npm run build

# معاينة البناء
npm run preview
```

---

## 📦 الأوامر المتاحة

### **أوامر التطوير:**
```bash
npm run dev              # تشغيل وضع التطوير
npm run build            # بناء للإنتاج
npm run preview          # معاينة البناء
```

### **أوامر Firebase:**
```bash
npm run firebase:emulators     # تشغيل Firebase Emulators
npm run firebase:deploy        # نشر كل شيء
npm run firebase:deploy:hosting    # نشر Hosting فقط
npm run firebase:deploy:functions   # نشر Functions فقط
npm run firebase:deploy:firestore   # نشر Firestore فقط
```

### **أوامر Firebase CLI:**
```bash
firebase login                    # تسجيل الدخول
firebase use                      # عرض المشروع النشط
firebase projects:list            # عرض المشاريع
firebase deploy                   # نشر كل شيء
firebase deploy --only hosting   # نشر Hosting فقط
firebase deploy --only functions # نشر Functions فقط
firebase deploy --only firestore:rules # نشر Firestore Rules فقط
```

---

## 🔒 إعداد الأمان

### 1. **Firestore Security Rules**
تم إعداد قواعد أمان شاملة في `firestore.rules`:
- قراءة عامة للكتب والفئات
- كتابة مقيدة للمديرين فقط
- حماية بيانات المستخدمين

### 2. **Storage Security Rules**
تم إعداد قواعد أمان في `storage.rules`:
- رفع الملفات للمستخدمين المسجلين
- حماية الملفات الحساسة
- تحكم في الوصول للملفات

### 3. **Authentication**
- دعم تسجيل الدخول بالبريد الإلكتروني
- دعم تسجيل الدخول بـ Google
- إدارة الجلسات بـ JWT

---

## 💳 إعداد المدفوعات (اختياري)

### 1. **Stripe**
```bash
# إعداد Stripe (إذا كنت تريد استخدامه)
firebase functions:config:set stripe.secret_key="sk_test_your_stripe_secret_key"
```

### 2. **PayPal**
```bash
# إعداد PayPal (إذا كنت تريد استخدامه)
firebase functions:config:set paypal.client_id="your_paypal_client_id"
firebase functions:config:set paypal.client_secret="your_paypal_client_secret"
```

> **ملاحظة:** المدفوعات تعمل حالياً في وضع الاختبار. لإنتاج حقيقي، تحتاج لمفاتيح إنتاج.

---

## 📊 إعداد البيانات التجريبية

### 1. **إضافة كتب تجريبية**
```bash
# يمكنك إضافة بيانات تجريبية عبر لوحة التحكم
# اذهب إلى: http://localhost:5173/dashboard
```

### 2. **إعداد المستخدمين**
```bash
# إنشاء حساب مدير
# اذهب إلى: http://localhost:5173/register
# أو استخدم Firebase Console
```

---

## 🔍 استكشاف الأخطاء

### 1. **مشاكل التثبيت**
```bash
# مسح node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install

# مسح functions/node_modules
rm -rf functions/node_modules
cd functions && npm install && cd ..
```

### 2. **مشاكل Firebase**
```bash
# التحقق من الاتصال
firebase projects:list

# التحقق من المشروع النشط
firebase use

# إعادة تسجيل الدخول
firebase logout
firebase login
```

### 3. **مشاكل البناء**
```bash
# مسح dist وإعادة البناء
rm -rf dist
npm run build
```

### 4. **مشاكل التطوير**
```bash
# إعادة تشغيل خادم التطوير
# اضغط Ctrl+C ثم
npm run dev
```

---

## 📱 الوصول للتطبيق

### **وضع التطوير:**
- **الموقع الرئيسي:** http://localhost:5173
- **لوحة التحكم:** http://localhost:5173/dashboard
- **إعدادات المتجر:** http://localhost:5173/store-settings

### **بعد النشر:**
- **الموقع الرئيسي:** https://molhem-book-store.web.app
- **لوحة التحكم:** https://molhem-book-store.web.app/dashboard
- **إعدادات المتجر:** https://molhem-book-store.web.app/store-settings

---

## 🎯 الخطوات التالية

### 1. **اختبار الوظائف**
- [ ] تسجيل الدخول/الخروج
- [ ] إضافة كتب جديدة
- [ ] إنشاء طلبات
- [ ] اختبار المدفوعات
- [ ] إدارة المخزون

### 2. **تخصيص المحتوى**
- [ ] إضافة شعار المتجر
- [ ] تخصيص الألوان
- [ ] إضافة محتوى الصفحات
- [ ] إعداد طرق الشحن

### 3. **النشر للإنتاج**
- [ ] إعداد مفاتيح إنتاج
- [ ] اختبار شامل
- [ ] نشر على Firebase Hosting
- [ ] إعداد النطاق المخصص

---

## 🆘 الدعم والمساعدة

### **الوثائق:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### **المجتمع:**
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

### **الدعم الفني:**
- **البريد الإلكتروني:** support@molhemon.com
- **الهاتف:** +966501234567
- **الموقع:** https://molhemon.com

---

## ✅ قائمة التحقق السريع

- [ ] تثبيت Node.js 18+
- [ ] تثبيت Firebase CLI
- [ ] استنساخ المشروع
- [ ] تثبيت التبعيات (`npm install`)
- [ ] تثبيت تبعيات Functions (`cd functions && npm install`)
- [ ] تسجيل الدخول Firebase (`firebase login`)
- [ ] ربط المشروع (`firebase use`)
- [ ] إنشاء ملف `.env`
- [ ] نشر Firebase Rules
- [ ] نشر Firebase Functions
- [ ] تشغيل التطبيق (`npm run dev`)
- [ ] اختبار الوظائف الأساسية

---

## 🎉 تهانينا!

لقد تم تثبيت وإعداد متجر ملهمون للكتب بنجاح! 

**المميزات المتاحة:**
- ✅ متجر إلكتروني متكامل
- ✅ إدارة شاملة للمنتجات
- ✅ نظام طلبات متقدم
- ✅ دعم المدفوعات المتعددة
- ✅ نظام شحن ذكي
- ✅ لوحة تحكم إدارية
- ✅ دعم متعدد اللغات
- ✅ تصميم متجاوب

**الخطوات التالية:**
1. استكشف لوحة التحكم
2. أضف منتجاتك الأولى
3. اختبر عملية الطلب
4. خصص إعدادات المتجر
5. انشر للإنتاج

---

**تم تطوير هذا النظام بواسطة فريق ملهمون** 🚀

**الموقع الرسمي:** https://molhemon.com  
**المتجر:** https://store.molhemon.com  
**المدونة:** https://blog.molhemon.com
