import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { processImageForStorage, getBase64Size, isImageSizeValid } from '@/lib/imageUtils';
import { testAddBook } from '@/lib/firebaseTest';

const ImageTestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState('');
  const [imageInfo, setImageInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookData, setBookData] = useState({
    title: 'اختبار معالجة الصور',
    author: 'مؤلف الاختبار',
    category: 'اختبار',
    price: 50,
    type: 'book'
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProcessedImage('');
      setImageInfo(null);
      
      // عرض معلومات الملف
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        const size = getBase64Size(base64);
        setImageInfo({
          originalSize: file.size,
          base64Size: size,
          isValid: isImageSizeValid(base64),
          dimensions: 'جاري التحميل...'
        });
        
        // الحصول على أبعاد الصورة
        const img = new Image();
        img.onload = () => {
          setImageInfo(prev => ({
            ...prev,
            dimensions: `${img.width} × ${img.height}`
          }));
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      toast({ 
        title: '❌ لا يوجد ملف محدد', 
        description: 'يرجى اختيار ملف صورة أولاً',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const processed = await processImageForStorage(selectedFile);
      setProcessedImage(processed);
      
      const processedSize = getBase64Size(processed);
      const isValid = isImageSizeValid(processed);
      
      toast({ 
        title: '✅ تمت معالجة الصورة', 
        description: `الحجم: ${(processedSize / 1024).toFixed(2)} KB`,
        variant: 'default'
      });
      
      // تحديث معلومات الصورة
      setImageInfo(prev => ({
        ...prev,
        processedSize,
        processedIsValid: isValid,
        compressionRatio: ((prev.originalSize - processedSize) / prev.originalSize * 100).toFixed(1)
      }));
      
    } catch (error) {
      console.error('خطأ في معالجة الصورة:', error);
      toast({ 
        title: '❌ خطأ في معالجة الصورة', 
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestAddBook = async () => {
    if (!processedImage) {
      toast({ 
        title: '❌ لا توجد صورة معالجة', 
        description: 'يرجى معالجة الصورة أولاً',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await testAddBook({
        ...bookData,
        coverImage: processedImage
      });
      
      if (result.success) {
        toast({ 
          title: '✅ نجح إضافة الكتاب', 
          description: 'تم إضافة الكتاب مع الصورة المعالجة بنجاح',
          variant: 'default'
        });
      } else {
        toast({ 
          title: '❌ فشل إضافة الكتاب', 
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('خطأ في إضافة الكتاب:', error);
      toast({ 
        title: '❌ خطأ في إضافة الكتاب', 
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🖼️ اختبار معالجة الصور
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* اختيار الملف */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                اختيار ملف الصورة
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageFile">اختر ملف صورة</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                </div>
                
                {selectedFile && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">معلومات الملف:</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>الاسم:</strong> {selectedFile.name}</p>
                      <p><strong>النوع:</strong> {selectedFile.type}</p>
                      <p><strong>الحجم:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleProcessImage}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? 'جاري المعالجة...' : 'معالجة الصورة'}
                </Button>
              </div>
            </div>

            {/* معلومات الصورة */}
            {imageInfo && (
              <div className="border rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  معلومات الصورة
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>الحجم الأصلي:</span>
                    <span className="font-mono">{(imageInfo.originalSize / 1024).toFixed(2)} KB</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>الحجم (Base64):</span>
                    <span className="font-mono">{(imageInfo.base64Size / 1024).toFixed(2)} KB</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>الأبعاد:</span>
                    <span className="font-mono">{imageInfo.dimensions}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>صالح للحفظ:</span>
                    <span className={imageInfo.isValid ? 'text-green-600' : 'text-red-600'}>
                      {imageInfo.isValid ? '✅ نعم' : '❌ لا'}
                    </span>
                  </div>
                  
                  {imageInfo.processedSize && (
                    <>
                      <div className="flex justify-between">
                        <span>الحجم بعد المعالجة:</span>
                        <span className="font-mono">{(imageInfo.processedSize / 1024).toFixed(2)} KB</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>نسبة الضغط:</span>
                        <span className="font-mono">{imageInfo.compressionRatio}%</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>صالح بعد المعالجة:</span>
                        <span className={imageInfo.processedIsValid ? 'text-green-600' : 'text-red-600'}>
                          {imageInfo.processedIsValid ? '✅ نعم' : '❌ لا'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* معاينة الصورة */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                معاينة الصورة
              </h2>
              
              {selectedFile && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">الصورة الأصلية:</h3>
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="الصورة الأصلية"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              
              {processedImage && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-600">الصورة المعالجة:</h3>
                  <img 
                    src={processedImage} 
                    alt="الصورة المعالجة"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* اختبار إضافة الكتاب */}
            {processedImage && (
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  اختبار إضافة الكتاب
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">عنوان الكتاب</Label>
                    <Input
                      id="title"
                      value={bookData.title}
                      onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="أدخل عنوان الكتاب"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="author">المؤلف</Label>
                    <Input
                      id="author"
                      value={bookData.author}
                      onChange={(e) => setBookData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="أدخل اسم المؤلف"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleTestAddBook}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'جاري الإضافة...' : 'إضافة الكتاب مع الصورة'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 border rounded-lg p-6 bg-blue-50">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">
            معلومات مهمة
          </h2>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• الحد الأقصى لحجم الصورة في Firestore: 1 ميجابايت (1,048,487 بايت)</p>
            <p>• سيتم ضغط الصور الكبيرة تلقائياً</p>
            <p>• إذا كانت الصورة كبيرة جداً، سيتم تجاهلها</p>
            <p>• الصور المضغوطة تحافظ على جودة مقبولة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTestPage;

