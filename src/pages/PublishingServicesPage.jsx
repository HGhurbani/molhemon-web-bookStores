import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  Copyright, 
  BookOpen, 
  Globe, 
  ThumbsUp, 
  Upload, 
  X,
  FileText,
  Check
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast.js';
import firebaseApi from '@/lib/firebaseApi.js';

const PublishingServicesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    bookTitle: '',
    type: '',
    language: 'العربية',
    email: '',
    mobile: '',
    format: '',
    targetRegions: 'الإمارات العربية المتحدة',
    notes: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(3),
        file: file
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // تحضير البيانات للإرسال
      const requestData = {
        ...formData,
        fileInfo: uploadedFile ? {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.file.type
        } : null,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // إرسال الطلب إلى Firebase
      await firebaseApi.addPublishingRequest(requestData);
      
      toast({
        title: 'تم الإرسال بنجاح',
        description: 'سنقوم بالتواصل معك قريباً'
      });
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        bookTitle: '',
        type: '',
        language: 'العربية',
        email: '',
        mobile: '',
        format: '',
        targetRegions: 'الإمارات العربية المتحدة',
        notes: ''
      });
      setUploadedFile(null);
    } catch (error) {
      console.error('Error submitting publishing request:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm mb-4">
          خدمات النشر والتوزيع
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          من مخطوطتك إلى أيدي القراء - بسلاسة
        </h1>
        <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600 leading-relaxed">
          <p>
            في دار ملهمون، لا نساعدك في النشر فحسب، بل نساعدك في الوصول إلى القراء في كل مكان. خدمات النشر والتوزيع لدينا مصممة لدعم المؤلفين والناشرين والمبدعين المستعدين لمشاركة أعمالهم عبر الشرق الأوسط وخارجه.
          </p>
          <p>
            سواء كنت تنشر رواية أولى، أو كتاباً تعليمياً، أو مجموعة من الكتب متعددة اللغات، تضمن منصتنا أن يتم نشر كتابك بشكل مهني وتوزيعه بفعالية عبر القنوات المناسبة - رقمياً ومادياً.
          </p>
        </div>
      </motion.div>

      {/* What We Offer Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          ما نقدمه
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copyright className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              مساعدة في الحصول على رقم ISBN وحقوق النشر
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نساعدك في الحصول على التسجيل الرسمي وحماية ملكيتك الفكرية.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              النشر متعدد التنسيقات
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              احصل على كتابك موزعاً ككتاب إلكتروني، وكتاب صوتي، ونسخة مطبوعة - جميعها تدار من خلال منصة واحدة.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              التوزيع الإقليمي والدولي
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              انضم إلى سوق دار ملهمون المتنامي، بالإضافة إلى تجار التجزئة والمكتبات الخارجية من خلال شراكاتنا التوزيعية الموسعة.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              دعم النشر والتوزيع
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نساعد في تعزيز ظهور أعمالك من خلال ميزات الصفحة الرئيسية، والعروض الترويجية الموسمية، والقوائم المختارة.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Request Form Section */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          طلب دعم النشر والتوزيع
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          هل ترغب بالبدء؟ املأ نموذج الطلب أدناه، وسيراجع فريق النشر لدينا احتياجاتك ويتواصل معك بشأن الخطوات التالية.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  الاسم الكامل / جهة النشر
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل أو اسم جهة النشر"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bookTitle" className="text-sm font-medium text-gray-700">
                  عنوان الكتاب
                </Label>
                <Input
                  id="bookTitle"
                  value={formData.bookTitle}
                  onChange={(e) => handleInputChange('bookTitle', e.target.value)}
                  placeholder="أدخل عنوان الكتاب"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  النوع
                </Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="أدخل نوع الكتاب"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                  اللغة
                </Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="العربية">العربية</option>
                  <option value="English">English</option>
                  <option value="Français">Français</option>
                  <option value="Español">Español</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  حمل مخطوطة/نموذجاً
                </Label>
                <div className="mt-1">
                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                        <span className="text-xs text-gray-500">({uploadedFile.size} Kb)</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">حمل مخطوطة/نموذجاً</p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".doc,.docx,.pdf,.txt"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        اختر ملف
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  عنوان البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  رقم الجوال
                </Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="أدخل رقم جوالك"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  الصيغة
                </Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="indesign"
                      checked={formData.format === 'indesign'}
                      onChange={(e) => handleInputChange('format', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      خدمة التصميم الداخلي باستخدام برنامج إنديزاين
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="cover"
                      checked={formData.format === 'cover'}
                      onChange={(e) => handleInputChange('format', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      خدمة تصميم الغلاف
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="targetRegions" className="text-sm font-medium text-gray-700">
                  المناطق المستهدفة
                </Label>
                <select
                  id="targetRegions"
                  value={formData.targetRegions}
                  onChange={(e) => handleInputChange('targetRegions', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                  <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                  <option value="مصر">مصر</option>
                  <option value="الأردن">الأردن</option>
                  <option value="لبنان">لبنان</option>
                  <option value="المغرب">المغرب</option>
                  <option value="العراق">العراق</option>
                  <option value="الكويت">الكويت</option>
                  <option value="قطر">قطر</option>
                  <option value="البحرين">البحرين</option>
                  <option value="عمان">عمان</option>
                  <option value="اليمن">اليمن</option>
                  <option value="السودان">السودان</option>
                  <option value="تونس">تونس</option>
                  <option value="الجزائر">الجزائر</option>
                  <option value="ليبيا">ليبيا</option>
                  <option value="سوريا">سوريا</option>
                  <option value="فلسطين">فلسطين</option>
                  <option value="أوروبا">أوروبا</option>
                  <option value="أمريكا الشمالية">أمريكا الشمالية</option>
                  <option value="أمريكا الجنوبية">أمريكا الجنوبية</option>
                  <option value="آسيا">آسيا</option>
                  <option value="أفريقيا">أفريقيا</option>
                  <option value="أستراليا">أستراليا</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              ملاحظات أو متطلبات خاصة
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="اكتب أي ملاحظات أو متطلبات خاصة..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'اطلب عرض سعر'}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Join Us Section */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          انضم إلى فريقنا
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
          إذا كنت متخصصاً في النشر والتوزيع وتريد أن تكون جزءاً من فريق دار ملهمون، تواصل معنا لفرص العمل المتاحة.
        </p>
        <a 
          href="mailto:careers@darmolhimon.com"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          تواصل معنا
        </a>
      </motion.div>

      {/* Footer Banner */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-8 text-center text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            قصتك تستحق أن تلمع
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            لتبدع معا شيئًا جميلًا. دارمولهيمون | صمم بهدف، أنتج بعناية.
          </p>
        </div>
        
        {/* Book Covers */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex space-x-4 rtl:space-x-reverse">
          <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-orange-500 rounded shadow-lg transform rotate-12"></div>
          <div className="w-24 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded shadow-lg transform -rotate-6"></div>
          <div className="w-24 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded shadow-lg transform rotate-12"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublishingServicesPage;
