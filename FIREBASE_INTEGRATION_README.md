# دليل استخدام Firebase مع دار ملهمون للنشر

## نظرة عامة
تم تحديث نظام دار ملهمون للنشر ليعمل مع Firebase كقاعدة بيانات رئيسية. هذا يوفر مرونة أكبر وأداء أفضل مع إمكانية التوسع المستقبلي.

## إعداد Firebase

### 1. ملف الإعداد
يتم إعداد Firebase في `src/lib/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDbW7bX1m10rPyLtqxdec6f8I7u09-Dcq0",
  authDomain: "molhem-book-store.firebaseapp.com",
  projectId: "molhem-book-store",
  storageBucket: "molhem-book-store.appspot.com",
  messagingSenderId: "405854542171",
  appId: "1:405854542171:web:f5ec90eca02e261da8a27e",
  measurementId: "G-J7N2QML49Z"
};
```

### 2. المجموعات (Collections)
يتم استخدام Firestore مع المجموعات التالية:

#### مقالات المدونة (`blog_posts`)
```javascript
{
  title: "عنوان المقال",
  content: "محتوى المقال",
  excerpt: "ملخص المقال",
  category: "فئة المقال",
  author: "اسم المؤلف",
  status: "published|draft|archived",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### الأسئلة الشائعة (`faqs`)
```javascript
{
  question: "السؤال",
  answer: "الإجابة",
  category: "فئة السؤال",
  orderIndex: 0,
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### الموزعون (`distributors`)
```javascript
{
  name: "اسم الموزع",
  type: "physical|digital",
  region: "المنطقة",
  country: "الدولة",
  city: "المدينة",
  address: "العنوان",
  phone: "رقم الهاتف",
  email: "البريد الإلكتروني",
  website: "الموقع الإلكتروني",
  description: "الوصف",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### أعضاء الفريق (`team_members`)
```javascript
{
  name: "اسم العضو",
  position: "المنصب",
  bio: "السيرة الذاتية",
  email: "البريد الإلكتروني",
  linkedin: "رابط LinkedIn",
  twitter: "رابط Twitter",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### طلبات التصميم (`design_requests`)
```javascript
{
  customerName: "اسم العميل",
  email: "البريد الإلكتروني",
  serviceType: "نوع الخدمة",
  budget: "الميزانية",
  description: "وصف المشروع",
  status: "pending|approved|rejected|completed",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### طلبات النشر (`publishing_requests`)
```javascript
{
  authorName: "اسم المؤلف",
  bookTitle: "عنوان الكتاب",
  bookType: "نوع الكتاب",
  targetAudience: "الجمهور المستهدف",
  description: "وصف الكتاب",
  status: "pending|approved|rejected|completed",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### طلبات النشر مع دار ملهمون (`publish_with_us_requests`)
```javascript
{
  authorName: "اسم المؤلف",
  bookTitle: "عنوان الكتاب",
  bookType: "نوع الكتاب",
  targetAudience: "الجمهور المستهدف",
  description: "وصف الكتاب",
  status: "pending|approved|rejected|completed",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## استخدام Firebase API

### 1. استيراد Firebase API
```javascript
import firebaseApi from '@/lib/firebaseApi';
```

### 2. عمليات CRUD الأساسية

#### إنشاء (Create)
```javascript
// إضافة مقال جديد
const newPost = await firebaseApi.addBlogPost({
  title: "عنوان المقال",
  content: "محتوى المقال",
  category: "أدب"
});

// إضافة سؤال شائع
const newFaq = await firebaseApi.addFaq({
  question: "السؤال",
  answer: "الإجابة",
  category: "عام"
});
```

#### قراءة (Read)
```javascript
// جلب جميع المقالات
const posts = await firebaseApi.getBlogPosts();

// جلب مقال محدد
const post = await firebaseApi.getBlogPost(postId);

// جلب جميع الأسئلة الشائعة
const faqs = await firebaseApi.getFaqs();
```

#### تحديث (Update)
```javascript
// تحديث مقال
await firebaseApi.updateBlogPost(postId, {
  title: "العنوان الجديد",
  content: "المحتوى الجديد"
});

// تحديث سؤال شائع
await firebaseApi.updateFaq(faqId, {
  question: "السؤال الجديد",
  answer: "الإجابة الجديدة"
});
```

#### حذف (Delete)
```javascript
// حذف مقال
await firebaseApi.deleteBlogPost(postId);

// حذف سؤال شائع
await firebaseApi.deleteFaq(faqId);
```

### 3. إحصائيات لوحة التحكم
```javascript
const stats = await firebaseApi.getDashboardStats();
// النتيجة:
{
  books: 150,
  authors: 25,
  sales: 50000,
  users: 1000,
  blogPosts: 45,
  faqs: 20,
  distributors: 15,
  teamMembers: 8,
  designRequests: 12,
  publishingRequests: 8,
  publishWithUsRequests: 5
}
```

## إدارة البيانات في لوحة التحكم

### 1. قسم المدونة
- عرض قائمة المقالات
- إضافة مقال جديد
- تعديل المقالات الموجودة
- حذف المقالات
- تحديث تلقائي للبيانات

### 2. قسم الأسئلة الشائعة
- عرض الأسئلة الشائعة
- إضافة سؤال جديد
- تعديل الأسئلة الموجودة
- حذف الأسئلة
- ترتيب الأسئلة

### 3. قسم الموزعين
- عرض قائمة الموزعين
- إضافة موزع جديد
- تعديل معلومات الموزعين
- حذف الموزعين
- تصفية حسب النوع والمنطقة

### 4. قسم أعضاء الفريق
- عرض أعضاء الفريق
- إضافة عضو جديد
- تعديل معلومات الأعضاء
- حذف الأعضاء
- إدارة الروابط الاجتماعية

## معالجة الأخطاء

### 1. في العمليات
```javascript
try {
  const result = await firebaseApi.addBlogPost(data);
  toast({
    title: "نجح",
    description: "تم حفظ المقال بنجاح",
  });
} catch (error) {
  console.error('Error saving blog post:', error);
  toast({
    title: "خطأ",
    description: "حدث خطأ أثناء حفظ المقال",
    variant: "destructive",
  });
}
```

### 2. في جلب البيانات
```javascript
try {
  const posts = await firebaseApi.getBlogPosts();
  setBlogPosts(posts);
} catch (error) {
  console.error('Error fetching blog posts:', error);
  toast({
    title: "خطأ",
    description: "حدث خطأ أثناء جلب المقالات",
    variant: "destructive",
  });
}
```

## الأمان

### 1. Firebase Security Rules
يجب إعداد قواعد الأمان في Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بالقراءة للجميع
    match /{document=**} {
      allow read: if true;
    }
    
    // السماح بالكتابة للمستخدمين المصرح لهم فقط
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### 2. التحقق من البيانات
```javascript
// التحقق من الحقول المطلوبة
if (!blogForm.title || !blogForm.content) {
  toast({
    title: "خطأ",
    description: "يرجى ملء جميع الحقول المطلوبة",
    variant: "destructive",
  });
  return;
}
```

## الأداء

### 1. تحميل البيانات عند الطلب
```javascript
useEffect(() => {
  if (dashboardSection === 'blog') {
    fetchBlogPosts();
  }
}, [dashboardSection]);
```

### 2. تحديث تلقائي للبيانات
```javascript
// بعد إضافة مقال جديد
await firebaseApi.addBlogPost(data);
fetchBlogPosts(); // تحديث القائمة
```

### 3. معالجة الحالة
```javascript
const [blogPosts, setBlogPosts] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const fetchBlogPosts = async () => {
  setIsLoading(true);
  try {
    const posts = await firebaseApi.getBlogPosts();
    setBlogPosts(posts);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## التطوير المستقبلي

### 1. إضافة ميزات جديدة
- البحث والتصفية
- الصور والملفات
- نظام المستخدمين والصلاحيات
- التقارير والإحصائيات

### 2. تحسين الأداء
- التخزين المؤقت
- التحميل التدريجي
- التحسين للهواتف المحمولة

### 3. إضافة ميزات Firebase المتقدمة
- Firebase Authentication
- Firebase Storage
- Firebase Functions
- Firebase Analytics

## استكشاف الأخطاء

### 1. مشاكل الاتصال
- التحقق من إعدادات Firebase
- التحقق من قواعد الأمان
- التحقق من صحة البيانات

### 2. مشاكل الأداء
- مراقبة استخدام Firestore
- تحسين الاستعلامات
- تقليل عدد القراءات

### 3. مشاكل الأمان
- مراجعة قواعد الأمان
- التحقق من الصلاحيات
- مراقبة النشاط

---

**ملاحظة**: هذا النظام مصمم ليكون قابلاً للتوسع والتطوير. يمكن إضافة المزيد من الميزات والتحسينات حسب الحاجة.
