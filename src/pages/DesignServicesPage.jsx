import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  Pencil, 
  BookOpen, 
  User, 
  Printer, 
  Upload, 
  X,
  FileText
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast.js';
import firebaseApi from '@/lib/firebaseApi.js';
import logger from '@/lib/logger.js';

const DesignServicesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    bookTitle: '',
    type: '',
    email: '',
    mobile: '',
    services: [],
    notes: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      id: 'ebook',
      title: 'كتاب إلكتروني',
      icon: BookOpen
    },
    {
      id: 'audiobook',
      title: 'كتاب صوتي',
      icon: FileText
    },
    {
      id: 'print',
      title: 'نسخة مطبوعة',
      icon: Printer
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
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
    
    if (!formData.name || !formData.email || !formData.services.length) {
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
        services: formData.services,
        fileInfo: uploadedFile ? {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.file.type
        } : null,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // إرسال الطلب إلى Firebase
      await firebaseApi.addDesignRequest(requestData);
      
      toast({
        title: 'تم الإرسال بنجاح',
        description: 'سنقوم بالتواصل معك قريباً'
      });
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        bookTitle: '',
        type: '',
        email: '',
        mobile: '',
        services: [],
        notes: ''
      });
      setUploadedFile(null);
    } catch (error) {
      logger.error('Error submitting design request:', error);
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
          خدمات التصميم والإنتاج
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          أضف الحيوية على كتابك - بشكل رائع
        </h1>
        <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600 leading-relaxed">
          <p>
            في دار ملهمون، نؤمن بأن القصة العظيمة تستحق عرضاً عظيماً. نقدم خدمات تصميم وإنتاج شاملة ومهنية للمؤلفين والناشرين في جميع أنحاء الشرق الأوسط.
          </p>
          <p>
            سواء كان رواية أولى أو كتاباً مبيعاً، يضمن فريقنا الإبداعي والتقني أن يكون كتابك استثنائياً في الشكل والمحتوى عبر جميع التنسيقات.
          </p>
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          تشمل خدماتنا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pencil className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تصميم أغلفة الكتب
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              أغلفة مخصصة مصممة لجذب انتباه جمهورك، من كتب الأطفال المصورة إلى الروايات العصرية الأنيقة.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تنسيق التصميم الداخلي (الكتاب الإلكتروني والطباعة)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              تصميمات واضحة وسهلة القراءة محسنة للشاشات الرقمية والصفحات المطبوعة.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              العلامة التجارية وهوية المؤلف
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              بناء هوية قوية ومتسقة تعكس رؤيتك الإبداعية وتجذب جمهورك المستهدف.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Printer className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تجهيز الملفات
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              دعم كامل في تجهيز الملفات للتوزيع المادي، سواء للطباعة عند الطلب أو للطباعة بكميات كبيرة.
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
          اطلب خدمات التصميم والإنتاج لدينا
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          هل أنت مستعد للارتقاء بعرض كتابك؟ املأ النموذج أدناه، وسيتواصل معك فريقنا بتوصيات وأسعار مخصصة.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  الاسم
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
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
                      <p className="text-sm text-gray-600">قبل أن تختار الطب</p>
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
            </div>
          </div>

          {/* Required Services */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              الخدمات المطلوبة
            </Label>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-3 border rounded-md transition-colors ${
                    formData.services.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="services"
                    value={service.id}
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="sr-only"
                  />
                  <service.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {service.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              ملاحظات أو متطلبات إضافية
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="اكتب أي ملاحظات أو متطلبات إضافية..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'اطلب عرض سعر'}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Join Us Section */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          انضم إلى فريقنا
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
          إذا كنت مصمماً موهوباً وتريد أن تكون جزءاً من فريق دار ملهمون، تواصل معنا لفرص العمل المتاحة.
        </p>
        <a 
          href="mailto:careers@darmolhimon.com"
          className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          تواصل معنا
        </a>
      </motion.div>

      {/* Footer Banner */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 rounded-lg p-8 text-center text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            قصتك تستحق أن تلمع
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            لتبدع معا شيئًا جميلا. دارمولهيمون | صمم بهدف، أنتج بعناية.
          </p>
        </div>
        
        {/* Book Covers */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex space-x-4 rtl:space-x-reverse">
          <div className="w-24 h-32 bg-blue-500 rounded shadow-lg transform rotate-12"></div>
          <div className="w-24 h-32 bg-yellow-400 rounded shadow-lg transform -rotate-6"></div>
          <div className="w-24 h-32 bg-green-500 rounded shadow-lg transform rotate-12"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default DesignServicesPage;
