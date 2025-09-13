import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { testFirebaseConnection, testAddBook } from '@/lib/firebaseTest';

const FirebaseTestPage = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    type: 'book'
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
      
      if (result.success) {
        toast({ 
          title: '✅ نجح الاختبار', 
          description: result.message,
          variant: 'default'
        });
      } else {
        toast({ 
          title: '❌ فشل الاختبار', 
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('خطأ في الاختبار:', error);
      toast({ 
        title: '❌ خطأ في الاختبار', 
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestAddBook = async () => {
    if (!bookData.title || !bookData.author) {
      toast({ 
        title: '❌ بيانات غير مكتملة', 
        description: 'العنوان والمؤلف مطلوبان',
        variant: 'destructive'
      });
      return;
    }

    setIsTesting(true);
    
    try {
      const result = await testAddBook({
        ...bookData,
        price: parseFloat(bookData.price) || 0
      });
      
      if (result.success) {
        toast({ 
          title: '✅ نجح إضافة الكتاب', 
          description: result.message,
          variant: 'default'
        });
        setBookData({ title: '', author: '', category: '', price: '', type: 'book' });
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
      setIsTesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🔥 اختبار Firebase
        </h1>
        
        <div className="space-y-8">
          {/* اختبار الاتصال */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              اختبار الاتصال
            </h2>
            <p className="text-gray-600 mb-4">
              اختبار الاتصال الأساسي بـ Firebase وقراءة البيانات
            </p>
            <Button 
              onClick={handleTestConnection}
              disabled={isTesting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTesting ? 'جاري الاختبار...' : 'اختبار الاتصال'}
            </Button>
            
            {testResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                testResult.success 
                  ? 'bg-green-100 border border-green-300 text-green-800' 
                  : 'bg-red-100 border border-red-300 text-red-800'
              }`}>
                <h3 className="font-semibold mb-2">
                  {testResult.success ? '✅ النتيجة:' : '❌ النتيجة:'}
                </h3>
                <p>{testResult.message || testResult.error}</p>
                {testResult.code && (
                  <p className="text-sm mt-2">رمز الخطأ: {testResult.code}</p>
                )}
              </div>
            )}
          </div>

          {/* اختبار إضافة كتاب */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              اختبار إضافة كتاب
            </h2>
            <p className="text-gray-600 mb-4">
              اختبار إضافة كتاب جديد إلى قاعدة البيانات
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="title">عنوان الكتاب *</Label>
                <Input
                  id="title"
                  value={bookData.title}
                  onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان الكتاب"
                />
              </div>
              
              <div>
                <Label htmlFor="author">المؤلف *</Label>
                <Input
                  id="author"
                  value={bookData.author}
                  onChange={(e) => setBookData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="أدخل اسم المؤلف"
                />
              </div>
              
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Input
                  id="category"
                  value={bookData.category}
                  onChange={(e) => setBookData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="أدخل الفئة"
                />
              </div>
              
              <div>
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  value={bookData.price}
                  onChange={(e) => setBookData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="أدخل السعر"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="type">النوع</Label>
              <select
                id="type"
                value={bookData.type}
                onChange={(e) => setBookData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border rounded-md p-2 mt-1"
              >
                <option value="book">كتاب</option>
                <option value="ebook">كتاب إلكتروني</option>
                <option value="audio">كتاب صوتي</option>
              </select>
            </div>
            
            <Button 
              onClick={handleTestAddBook}
              disabled={isTesting || !bookData.title || !bookData.author}
              className="bg-green-600 hover:bg-green-700"
            >
              {isTesting ? 'جاري الإضافة...' : 'إضافة الكتاب'}
            </Button>
          </div>

          {/* معلومات إضافية */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              معلومات إضافية
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• تأكد من أن لديك اتصال إنترنت مستقر</p>
              <p>• تأكد من أن قواعد الأمان في Firestore تسمح بالقراءة والكتابة</p>
              <p>• تأكد من أن مشروع Firebase نشط</p>
              <p>• تحقق من وحدة تحكم Firebase للأخطاء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTestPage;

