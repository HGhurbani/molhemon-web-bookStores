// وظائف معالجة الملفات واستخراج المعلومات
import { toast } from '@/components/ui/use-toast';

// استخراج عدد الصفحات من ملف PDF
export async function extractPagesFromPDF(file) {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/pdf') {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // البحث عن نمط عدد الصفحات في PDF
        const text = new TextDecoder().decode(uint8Array);
        const pageMatch = text.match(/\/Count\s+(\d+)/);
        
        if (pageMatch) {
          resolve(parseInt(pageMatch[1]));
        } else {
          // محاولة أخرى للبحث عن نمط مختلف
          const countMatch = text.match(/\/N\s+(\d+)/);
          if (countMatch) {
            resolve(parseInt(countMatch[1]));
          } else {
            resolve(null);
          }
        }
      } catch (error) {
        console.warn('تعذر استخراج عدد الصفحات من PDF:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      resolve(null);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// استخراج عدد الصفحات من ملف EPUB
export async function extractPagesFromEPUB(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.toLowerCase().endsWith('.epub')) {
      resolve(null);
      return;
    }

    // EPUB لا يحتوي على عدد صفحات ثابت، نستخدم تقدير تقريبي
    // متوسط 300 كلمة في الصفحة
    resolve(null);
  });
}

// استخراج عدد الصفحات من ملف DOCX
export async function extractPagesFromDOCX(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.toLowerCase().endsWith('.docx')) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // البحث عن معلومات الصفحات في DOCX
        const text = new TextDecoder().decode(uint8Array);
        const pageMatch = text.match(/<w:pgNum>(\d+)<\/w:pgNum>/);
        
        if (pageMatch) {
          resolve(parseInt(pageMatch[1]));
        } else {
          resolve(null);
        }
      } catch (error) {
        console.warn('تعذر استخراج عدد الصفحات من DOCX:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      resolve(null);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// استخراج عدد الصفحات من أي ملف
export async function extractPagesFromFile(file) {
  if (!file) return null;

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractPagesFromPDF(file);
    } else if (fileName.endsWith('.epub')) {
      return await extractPagesFromEPUB(file);
    } else if (fileName.endsWith('.docx') || fileType.includes('word')) {
      return await extractPagesFromDOCX(file);
    } else {
      return null;
    }
  } catch (error) {
    console.warn('خطأ في استخراج عدد الصفحات:', error);
    return null;
  }
}

// تحديد صيغة الملف
export function getFileFormat(file) {
  if (!file) return null;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
    return 'PDF';
  } else if (fileName.endsWith('.epub') || fileType === 'application/epub+zip') {
    return 'EPUB';
  } else if (fileName.endsWith('.mobi') || fileType === 'application/x-mobipocket-ebook') {
    return 'MOBI';
  } else if (fileName.endsWith('.docx') || fileType.includes('word')) {
    return 'DOCX';
  } else if (fileName.endsWith('.doc') || fileType.includes('word')) {
    return 'DOC';
  } else if (fileName.endsWith('.txt') || fileType === 'text/plain') {
    return 'TXT';
  } else if (fileName.endsWith('.mp3') || fileType === 'audio/mpeg') {
    return 'MP3';
  } else if (fileName.endsWith('.wav') || fileType === 'audio/wav') {
    return 'WAV';
  } else if (fileName.endsWith('.m4a') || fileType === 'audio/mp4') {
    return 'M4A';
  } else if (fileName.endsWith('.aac') || fileType === 'audio/aac') {
    return 'AAC';
  } else {
    return 'غير محدد';
  }
}

// حساب حجم الملف بتنسيق مقروء
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// استخراج مدة الملف الصوتي
export function extractAudioDuration(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('audio/')) {
      resolve(null);
      return;
    }

    const audio = new Audio();
    const reader = new FileReader();

    reader.onload = function(e) {
      audio.src = e.target.result;
      audio.onloadedmetadata = function() {
        const duration = audio.duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        
        let durationText = '';
        if (hours > 0) {
          durationText += `${hours} ساعة `;
        }
        if (minutes > 0) {
          durationText += `${minutes} دقيقة `;
        }
        if (seconds > 0 || durationText === '') {
          durationText += `${seconds} ثانية`;
        }
        
        resolve(durationText.trim());
      };
      
      audio.onerror = () => {
        resolve(null);
      };
    };

    reader.onerror = () => {
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
}

// معالجة ملف الكتاب واستخراج المعلومات
export async function processBookFile(file, bookType) {
  if (!file) return {};

  const fileInfo = {
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileFormat: getFileFormat(file),
    pages: null,
    duration: null
  };

  try {
    if (bookType === 'ebook' || bookType === 'physical') {
      // استخراج عدد الصفحات للملفات الإلكترونية
      fileInfo.pages = await extractPagesFromFile(file);
    } else if (bookType === 'audio') {
      // استخراج مدة الملف الصوتي
      fileInfo.duration = await extractAudioDuration(file);
    }

    return fileInfo;
  } catch (error) {
    console.warn('خطأ في معالجة ملف الكتاب:', error);
    return fileInfo;
  }
}

// التحقق من صحة نوع الملف
export function validateFileType(file, expectedType) {
  if (!file) return false;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  switch (expectedType) {
    case 'ebook':
      return fileName.endsWith('.pdf') || 
             fileName.endsWith('.epub') || 
             fileName.endsWith('.mobi') ||
             fileName.endsWith('.docx') ||
             fileName.endsWith('.doc') ||
             fileName.endsWith('.txt') ||
             fileType === 'application/pdf' ||
             fileType === 'application/epub+zip' ||
             fileType === 'application/x-mobipocket-ebook' ||
             fileType.includes('word') ||
             fileType === 'text/plain';
    
    case 'audio':
      return fileName.endsWith('.mp3') || 
             fileName.endsWith('.wav') || 
             fileName.endsWith('.m4a') ||
             fileName.endsWith('.aac') ||
             fileType.startsWith('audio/');
    
    case 'image':
      return fileName.endsWith('.jpg') || 
             fileName.endsWith('.jpeg') || 
             fileName.endsWith('.png') ||
             fileName.endsWith('.gif') ||
             fileName.endsWith('.webp') ||
             fileType.startsWith('image/');
    
    default:
      return true;
  }
}

// عرض رسالة خطأ للملف غير المدعوم
export function showFileTypeError(file, expectedType) {
  const fileType = getFileFormat(file);
  
  toast({
    title: 'نوع ملف غير مدعوم',
    description: `الملف "${file.name}" (${fileType}) غير مدعوم لنوع الكتاب المحدد.`,
    variant: 'destructive'
  });
}










