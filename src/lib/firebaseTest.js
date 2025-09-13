import { db } from './firebase';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

// دالة اختبار اتصال Firebase
export async function testFirebaseConnection() {
  try {
    console.log('🔍 اختبار اتصال Firebase...');
    
    // اختبار الاتصال الأساسي
    if (!db) {
      throw new Error('Firebase DB غير متصل');
    }
    
    console.log('✅ Firebase DB متصل بنجاح');
    
    // اختبار قراءة مجموعة الكتب
    console.log('📚 اختبار قراءة مجموعة الكتب...');
    const booksSnapshot = await getDocs(collection(db, 'books'));
    console.log(`✅ تم قراءة ${booksSnapshot.size} كتاب بنجاح`);
    
    // اختبار إضافة كتاب تجريبي
    console.log('➕ اختبار إضافة كتاب تجريبي...');
    const testBook = {
      title: 'كتاب اختبار',
      author: 'مؤلف اختبار',
      category: 'اختبار',
      price: 0,
      type: 'test',
      createdAt: new Date(),
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'books'), testBook);
    console.log(`✅ تم إضافة كتاب تجريبي بنجاح، المعرف: ${docRef.id}`);
    
    // اختبار قراءة الكتاب المضاف
    console.log('📖 اختبار قراءة الكتاب المضاف...');
    const bookDoc = await getDoc(doc(db, 'books', docRef.id));
    if (bookDoc.exists()) {
      console.log('✅ تم قراءة الكتاب المضاف بنجاح');
      console.log('📋 بيانات الكتاب:', bookDoc.data());
    } else {
      throw new Error('فشل في قراءة الكتاب المضاف');
    }
    
    // حذف الكتاب التجريبي
    console.log('🗑️ حذف الكتاب التجريبي...');
    await deleteDoc(doc(db, 'books', docRef.id));
    console.log('✅ تم حذف الكتاب التجريبي بنجاح');
    
    console.log('🎉 جميع اختبارات Firebase نجحت!');
    return { success: true, message: 'Firebase يعمل بشكل صحيح' };
    
  } catch (error) {
    console.error('❌ خطأ في اختبار Firebase:', error);
    
    let errorMessage = 'خطأ غير معروف';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'خطأ في الصلاحيات. تأكد من قواعد الأمان في Firestore.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firebase غير متاح. تحقق من اتصالك بالإنترنت.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'لم يتم تسجيل الدخول. يرجى إعادة تسجيل الدخول.';
    } else if (error.code === 'not-found') {
      errorMessage = 'المجموعة غير موجودة. تحقق من إعدادات Firestore.';
    } else {
      errorMessage = error.message || 'خطأ غير معروف';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code,
      details: error
    };
  }
}

// دالة اختبار إضافة كتاب
export async function testAddBook(bookData) {
  try {
    console.log('➕ اختبار إضافة كتاب:', bookData);
    
    if (!db) {
      throw new Error('Firebase DB غير متصل');
    }
    
    // التحقق من صحة البيانات
    if (!bookData.title || !bookData.author) {
      throw new Error('البيانات غير مكتملة. العنوان والمؤلف مطلوبان.');
    }
    
    // إضافة الكتاب
    const docRef = await addDoc(collection(db, 'books'), {
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ تم إضافة الكتاب بنجاح، المعرف: ${docRef.id}`);
    
    // قراءة الكتاب المضاف
    const bookDoc = await getDoc(doc(db, 'books', docRef.id));
    const addedBook = { id: bookDoc.id, ...bookDoc.data() };
    
    return { 
      success: true, 
      book: addedBook,
      message: 'تم إضافة الكتاب بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إضافة الكتاب:', error);
    
    let errorMessage = 'خطأ غير معروف';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'لا تملك صلاحية إضافة كتب. تأكد من تسجيل الدخول كمدير.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firebase غير متاح. تحقق من اتصالك بالإنترنت.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'لم يتم تسجيل الدخول. يرجى إعادة تسجيل الدخول.';
    } else if (error.code === 'invalid-argument') {
      errorMessage = 'البيانات المرسلة غير صالحة. تحقق من صحة البيانات.';
    } else {
      errorMessage = error.message || 'خطأ غير معروف';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code,
      details: error
    };
  }
}

