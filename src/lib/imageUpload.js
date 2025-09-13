import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// دالة رفع صورة للمدونة
export const uploadBlogImage = async (file, blogId) => {
  try {
    if (!file) {
      throw new Error('لم يتم تحديد ملف');
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      throw new Error('يجب أن يكون الملف صورة');
    }

    // التحقق من حجم الملف (أقل من 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
    }

    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const fileName = `blog_${blogId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `blog-images/${fileName}`);

    // رفع الملف مع metadata محسن
    const metadata = {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000', // cache لمدة سنة
      customMetadata: {
        'uploaded-by': 'blog-system',
        'original-name': file.name,
        'upload-date': new Date().toISOString()
      }
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // الحصول على رابط التحميل مع معاملات CORS
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      fileName: fileName,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    
    // رسائل خطأ أكثر تفصيلاً
    if (error.code === 'storage/unauthorized') {
      throw new Error('غير مصرح لك برفع الصور. يرجى تسجيل الدخول كمدير.');
    } else if (error.code === 'storage/quota-exceeded') {
      throw new Error('تم تجاوز الحد المسموح من التخزين.');
    } else if (error.code === 'storage/retry-limit-exceeded') {
      throw new Error('فشل في رفع الصورة بعد عدة محاولات. يرجى المحاولة مرة أخرى.');
    } else {
      throw new Error(`خطأ في رفع الصورة: ${error.message}`);
    }
  }
};

// دالة حذف صورة من المدونة
export const deleteBlogImage = async (imagePath) => {
  try {
    if (!imagePath) {
      throw new Error('لم يتم تحديد مسار الصورة');
    }

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    
    return true;
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    
    if (error.code === 'storage/object-not-found') {
      console.warn('الصورة غير موجودة في التخزين');
      return true; // نعتبر الحذف ناجح إذا لم تكن الصورة موجودة
    }
    
    throw error;
  }
};

// دالة رفع صورة متعددة للمدونة
export const uploadMultipleBlogImages = async (files, blogId) => {
  try {
    if (!files || files.length === 0) {
      throw new Error('لم يتم تحديد ملفات');
    }

    const uploadPromises = files.map(file => uploadBlogImage(file, blogId));
    const results = await Promise.all(uploadPromises);
    
    return results;
  } catch (error) {
    console.error('خطأ في رفع الصور المتعددة:', error);
    throw error;
  }
};

// دالة معاينة الصورة قبل الرفع
export const previewImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('لم يتم تحديد ملف'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// دالة ضغط الصورة
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // حساب الأبعاد الجديدة
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // رسم الصورة المضغوطة
      ctx.drawImage(img, 0, 0, width, height);

      // تحويل إلى Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('فشل في ضغط الصورة'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
    img.src = URL.createObjectURL(file);
  });
};

// دالة التحقق من صحة الصورة
export const validateImage = (file) => {
  const errors = [];
  
  // التحقق من النوع
  if (!file.type.startsWith('image/')) {
    errors.push('يجب أن يكون الملف صورة');
  }
  
  // التحقق من الحجم
  if (file.size > 5 * 1024 * 1024) {
    errors.push('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
  }
  
  // التحقق من الأبعاد
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        errors.push('أبعاد الصورة يجب أن تكون أكبر من 100×100 بكسل');
      }
      resolve(errors);
    };
    img.onerror = () => {
      errors.push('فشل في قراءة الصورة');
      resolve(errors);
    };
    img.src = URL.createObjectURL(file);
  });
};
