# إصلاح مشاكل أذونات Firebase

## المشكلة
كانت هناك أخطاء في أذونات Firebase تمنع الوصول إلى البيانات:
- `permission-denied` للوصول إلى collections مختلفة
- عدم وجود قواعد أمان لبعض المجموعات

## الحلول المطبقة

### 1. تحديث قواعد الأمان في Firestore
تم إضافة قواعد أمان للمجموعات المفقودة:

```javascript
// Currencies collection
match /currencies/{currencyId} {
  allow read: if true;
  allow write: if isManager();
}

// Languages collection
match /languages/{languageId} {
  allow read: if true;
  allow write: if isManager();
}

// Shipping methods collection
match /shipping_methods/{methodId} {
  allow read: if true;
  allow write: if isManager();
}

// Payment methods collection (global)
match /payment_methods/{methodId} {
  allow read: if true;
  allow write: if isManager();
}
```

### 2. تحسين معالجة الأخطاء
تم إضافة معالجة خاصة لأخطاء الأذونات:

- رسائل خطأ واضحة باللغة العربية
- توجيه المستخدم لتسجيل الدخول كمدير
- معالجة graceful للأخطاء

### 3. تطبيق القواعد الجديدة

#### خطوات التطبيق:

1. **نشر قواعد الأمان الجديدة:**
```bash
firebase deploy --only firestore:rules
```

2. **التحقق من الأذونات:**
- تأكد من أن المستخدم الحالي له دور `admin` أو `manager`
- تحقق من أن المستخدم مسجل دخول

3. **اختبار النظام:**
- جرب الوصول إلى لوحة التحكم
- تحقق من تحميل الطلبات والمدفوعات
- تأكد من عمل إدارة الشحن

### 4. إعداد المستخدمين

#### إنشاء مستخدم مدير:
```javascript
// في Firebase Console أو عبر الكود
const userData = {
  uid: 'user-id',
  email: 'admin@example.com',
  role: 'admin', // أو 'manager'
  displayName: 'مدير النظام'
};
```

#### التحقق من دور المستخدم:
```javascript
// في الكود
const user = auth.currentUser;
const userDoc = await firestore.collection('users').doc(user.uid).get();
const userRole = userDoc.data().role;

if (userRole === 'admin' || userRole === 'manager') {
  // يمكن الوصول للبيانات
} else {
  // عرض رسالة خطأ
}
```

### 5. استكشاف الأخطاء

#### إذا استمرت المشاكل:

1. **تحقق من تسجيل الدخول:**
```javascript
console.log('User:', auth.currentUser);
console.log('User role:', userRole);
```

2. **تحقق من قواعد الأمان:**
- تأكد من نشر القواعد الجديدة
- تحقق من صحة syntax في firestore.rules

3. **تحقق من البيانات:**
- تأكد من وجود بيانات في المجموعات
- تحقق من بنية البيانات

### 6. الأمان

#### نصائح الأمان:
- لا تسمح بالوصول العام للكتابة
- استخدم أدوار محددة للمستخدمين
- راجع الأذونات بانتظام
- استخدم Firebase Security Rules Simulator للاختبار

#### مثال على دور المستخدم:
```javascript
// في users collection
{
  uid: "user-id",
  email: "user@example.com",
  role: "admin", // admin, manager, user
  displayName: "اسم المستخدم",
  createdAt: "2024-01-01T00:00:00Z"
}
```

## النتيجة المتوقعة

بعد تطبيق هذه الإصلاحات:
- ✅ لا توجد أخطاء permission-denied
- ✅ يمكن الوصول لجميع البيانات في لوحة التحكم
- ✅ رسائل خطأ واضحة ومفيدة
- ✅ أمان محسن للنظام

## ملاحظات مهمة

1. **نشر القواعد:** تأكد من نشر قواعد الأمان الجديدة
2. **اختبار شامل:** اختبر جميع أجزاء النظام
3. **النسخ الاحتياطي:** احتفظ بنسخة احتياطية من القواعد القديمة
4. **المراقبة:** راقب logs Firebase للتحقق من عدم وجود أخطاء جديدة

