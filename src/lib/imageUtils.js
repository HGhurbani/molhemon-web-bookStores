// دوال معالجة الصور وضغطها

import logger from './logger.js';

/**
 * ضغط الصورة إلى حجم أصغر
 * @param {File} file - ملف الصورة
 * @param {number} maxWidth - العرض الأقصى
 * @param {number} maxHeight - الارتفاع الأقصى
 * @param {number} quality - جودة الصورة (0.1 - 1.0)
 * @returns {Promise<Blob>} - الصورة المضغوطة
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // حساب الأبعاد الجديدة مع الحفاظ على النسبة
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // تعيين أبعاد الكانفاس
      canvas.width = width;
      canvas.height = height;
      
      // رسم الصورة المضغوطة
      ctx.drawImage(img, 0, 0, width, height);
      
      // تحويل إلى blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('فشل في ضغط الصورة'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * تحويل الصورة إلى Base64 مع ضغط
 * @param {File} file - ملف الصورة
 * @param {number} maxSizeKB - الحجم الأقصى بالكيلوبايت
 * @returns {Promise<string>} - الصورة كـ Base64
 */
export const imageToBase64 = async (file, maxSizeKB = 500) => {
  try {
    // التحقق من حجم الملف
    if (file.size <= maxSizeKB * 1024) {
      return await fileToBase64(file);
    }
    
    // ضغط الصورة إذا كانت كبيرة
    const compressedBlob = await compressImage(file, 800, 800, 0.7);
    
    // التحقق من الحجم بعد الضغط
    if (compressedBlob.size <= maxSizeKB * 1024) {
      return await blobToBase64(compressedBlob);
    }
    
    // ضغط أكثر إذا لزم الأمر
    const moreCompressedBlob = await compressImage(file, 600, 600, 0.5);
    return await blobToBase64(moreCompressedBlob);
    
  } catch (error) {
    logger.error('خطأ في معالجة الصورة:', error);
    throw new Error('فشل في معالجة الصورة');
  }
};

/**
 * تحويل ملف إلى Base64
 * @param {File} file - الملف
 * @returns {Promise<string>} - Base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
    reader.readAsDataURL(file);
  });
};

/**
 * تحويل Blob إلى Base64
 * @param {Blob} blob - Blob
 * @returns {Promise<string>} - Base64
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('فشل في قراءة Blob'));
    reader.readAsDataURL(blob);
  });
};

/**
 * التحقق من حجم الصورة
 * @param {string} base64String - الصورة كـ Base64
 * @returns {number} - الحجم بالبايت
 */
export const getBase64Size = (base64String) => {
  // إزالة header البيانات
  const base64Data = base64String.split(',')[1];
  // حساب الحجم
  return Math.ceil((base64Data.length * 3) / 4);
};

/**
 * التحقق من أن الصورة ضمن الحد المسموح
 * @param {string} base64String - الصورة كـ Base64
 * @param {number} maxSizeBytes - الحجم الأقصى بالبايت
 * @returns {boolean} - هل الصورة ضمن الحد
 */
export const isImageSizeValid = (base64String, maxSizeBytes = 1048487) => {
  const size = getBase64Size(base64String);
  return size <= maxSizeBytes;
};

/**
 * معالجة الصورة قبل الحفظ
 * @param {File|string} imageInput - ملف الصورة أو Base64
 * @returns {Promise<string>} - الصورة المعالجة كـ Base64
 */
export const processImageForStorage = async (imageInput) => {
  try {
    let base64Image;
    
    if (typeof imageInput === 'string') {
      // إذا كانت الصورة Base64 بالفعل
      base64Image = imageInput;
    } else if (imageInput instanceof File) {
      // إذا كانت الصورة ملف
      base64Image = await imageToBase64(imageInput, 800); // 800KB كحد أقصى
    } else {
      throw new Error('نوع الصورة غير مدعوم');
    }
    
    // التحقق من الحجم النهائي
    if (!isImageSizeValid(base64Image)) {
      throw new Error('الصورة كبيرة جداً حتى بعد الضغط. الحد الأقصى: 1 ميجابايت');
    }
    
    return base64Image;
    
  } catch (error) {
    logger.error('خطأ في معالجة الصورة:', error);
    throw new Error(`فشل في معالجة الصورة: ${error.message}`);
  }
};

