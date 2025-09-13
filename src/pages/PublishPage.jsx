import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  Globe, 
  Languages, 
  BookOpen, 
  Shield, 
  Upload, 
  X,
  FileText,
  Check,
  User
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast.js';

const PublishPage = () => {
  const [formData, setFormData] = useState({
    authorName: '',
    publisherName: '',
    email: '',
    mobile: '',
    authorBio: '',
    bookTitle: '',
    bookDescription: '',
    language: 'العربية',
    format: '',
    notes: '',
    // حقول إضافية للكتب الورقية
    bookType: 'physical', // physical, ebook, audio
    translators: '',
    publicationYear: new Date().getFullYear(),
    coverType: 'paperback', // paperback, hardcover
    weight: '',
    dimensions: '',
    originalLanguage: 'الإنجليزية',
    translatedLanguage: 'العربية',
    pages: '',
    isbn: '',
    // حقول إضافية للكتب الإلكترونية
    fileFormat: 'PDF',
    fileSize: '',
    wordCount: '',
    // حقول إضافية للكتب الصوتية
    duration: '',
    narrator: '',
    audioQuality: 'high'
  });
  const [uploadedFile, setUploadedFile] = useState(null);

  const requirements = [
    'الحد الأدنى 20,000 كلمة... لا يوجد حد أقصى.',
    'يجب أن يكون العمل أصلياً. وغير منشور مسبقاً في أي وسيط مطبوع أو إلكتروني.',
    'يجب ألا يكون العمل منسوخاً أو مسروقاً من أعمال أخرى.',
    'يتم قبول الأعمال باللغة العربية العامية أو الفصحى.',
    'لن يتم قبول الأعمال غير المكتملة.',
    'يجب أن يكون العمل محرراً لغوياً.',
    'لا يوجد شرط للعمر أو البلد... المشاركة مفتوحة للجميع.',
    'إذا تم قبول العمل للنشر، سيتم التواصل مع المؤلف عبر البريد الإلكتروني المسجل في طلب التقديم.',
    'تتحمل دار النشر جميع تكاليف النشر إذا تم قبول العمل من قبل لجنة القراءة والتقييم.'
  ];

  const submissionSteps = [
    'إرسال مسودة الكتاب بصيغة Word عبر البريد الإلكتروني: info@darmolhimon.com',
    'ملخص الكتاب لا يتجاوز 400 كلمة.',
    'سيرة المؤلف.',
    'استجابة اللجنة تستغرق 30 يوماً عمل.',
    'ستتواصل إدارة النشر مع المؤلف عبر البريد الإلكتروني لإبلاغه بقبول أو رفض المادة من قبل لجنة القراءة، والاتفاق على باقي تفاصيل العقد، بما في ذلك حقوق النشر المطبوعة والإلكترونية.'
  ];

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
    
    if (!formData.authorName || !formData.email || !formData.bookTitle) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    try {
      // هنا يمكن إرسال البيانات إلى الخادم
              // Form data submitted successfully
      toast({
        title: 'تم الإرسال بنجاح',
        description: 'سنقوم بالتواصل معك قريباً'
      });
      
      // إعادة تعيين النموذج
      setFormData({
        authorName: '',
        publisherName: '',
        email: '',
        mobile: '',
        authorBio: '',
        bookTitle: '',
        bookDescription: '',
        language: 'العربية',
        format: '',
        notes: ''
      });
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الطلب',
        variant: 'destructive'
      });
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          انشر مع دار ملهمون
        </h1>
        <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600 leading-relaxed">
          <p>
            في دار ملهمون، نؤمن بأهمية كل صوت، وأن كل قصة تستحق أن تُسمع. تم تصميم منصة النشر لدينا لتمكين المؤلفين والناشرين ورواة القصص في جميع أنحاء الشرق الأوسط من مشاركة أعمالهم مع مجتمع متنامٍ من القراء الشغوفين.
          </p>
          <p>
            سواء كنت ناشراً معروفاً أو كاتباً طموحاً، نجعل من السهل عليك الوصول إلى جمهور يقدر كلماتك، من الكتب الورقية إلى الكتب الرقمية والكتب الصوتية الغامرة. تدعم دار ملهمون تنسيقات متعددة، مما يساعدك على تعزيز وجودك في عالم القراءة الحديث.
          </p>
        </div>
      </motion.div>

      {/* Why Publish With Us Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          لماذا النشر معنا؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تواصل مع جمهور إقليمي
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              انشر أعمالك عبر الشرق الأوسط. تواصل مع القراء الذين يبحثون عن محتوى هادف وملائم.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              دعم العناوين العربية ومتعددة اللغات
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نحتفل بالتنوع اللغوي - قدم أعمالك باللغة العربية أو الإنجليزية أو كلاهما...
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تنسيقات متعددة مرحبا بك
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              قدم محتواك بصيغ إلكترونية وصوتية ومطبوعة. سنساعدك في عرضه بشكل جميل.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              شفافية في حقوق الملكية
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              تتبع الأداء، وإدارة المحتوى، وكسب حقوق الملكية العادلة بسهولة.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Submission Form */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            أرسل عملك
          </h2>
          <p className="text-gray-600 text-center mb-8">
            هل أنت مستعد لمشاركة قصتك مع العالم؟ املأ النموذج أدناه لبدء رحلة النشر مع دار ملهمون.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName" className="text-sm font-medium text-gray-700">
                  اسم المؤلف
                </Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder="أدخل اسم المؤلف"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="publisherName" className="text-sm font-medium text-gray-700">
                  اسم الناشر
                </Label>
                <Input
                  id="publisherName"
                  value={formData.publisherName}
                  onChange={(e) => handleInputChange('publisherName', e.target.value)}
                  placeholder="أدخل اسم الناشر"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  البريد الإلكتروني
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

            <div>
              <Label htmlFor="authorBio" className="text-sm font-medium text-gray-700">
                نبذة عن المؤلف
              </Label>
              <Textarea
                id="authorBio"
                value={formData.authorBio}
                onChange={(e) => handleInputChange('authorBio', e.target.value)}
                placeholder="اكتب نبذة مختصرة عن المؤلف..."
                rows={3}
                className="mt-1"
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
                required
              />
            </div>

            <div>
              <Label htmlFor="bookDescription" className="text-sm font-medium text-gray-700">
                وصف الكتاب
              </Label>
              <Textarea
                id="bookDescription"
                value={formData.bookDescription}
                onChange={(e) => handleInputChange('bookDescription', e.target.value)}
                placeholder="اكتب وصفاً مختصراً للكتاب..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bookType" className="text-sm font-medium text-gray-700">
                نوع الكتاب
              </Label>
              <select
                id="bookType"
                value={formData.bookType}
                onChange={(e) => handleInputChange('bookType', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="physical">كتاب ورقي</option>
                <option value="ebook">كتاب إلكتروني</option>
                <option value="audio">كتاب صوتي</option>
              </select>
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
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                الصيغة
              </Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="ebook"
                    checked={formData.format === 'ebook'}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">كتاب إلكتروني</span>
                </label>
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="audiobook"
                    checked={formData.format === 'audiobook'}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">كتاب صوتي</span>
                </label>
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="print"
                    checked={formData.format === 'print'}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">نسخة مطبوعة</span>
                </label>
              </div>
            </div>

            {/* حقول إضافية للكتب الورقية */}
            {formData.bookType === 'physical' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="translators" className="text-sm font-medium text-gray-700">
                      المترجمون
                    </Label>
                    <Input
                      id="translators"
                      value={formData.translators}
                      onChange={(e) => handleInputChange('translators', e.target.value)}
                      placeholder="أسماء المترجمين"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publicationYear" className="text-sm font-medium text-gray-700">
                      سنة النشر
                    </Label>
                    <Input
                      id="publicationYear"
                      type="number"
                      value={formData.publicationYear}
                      onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                      placeholder="2024"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coverType" className="text-sm font-medium text-gray-700">
                      نوع الغلاف
                    </Label>
                    <select
                      id="coverType"
                      value={formData.coverType}
                      onChange={(e) => handleInputChange('coverType', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="paperback">غلاف عادي</option>
                      <option value="hardcover">غلاف مقوى</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                      الوزن (كجم)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="0.5"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dimensions" className="text-sm font-medium text-gray-700">
                      الأبعاد
                    </Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      placeholder="مثال: 15×21 سم"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pages" className="text-sm font-medium text-gray-700">
                      عدد الصفحات
                    </Label>
                    <Input
                      id="pages"
                      type="number"
                      value={formData.pages}
                      onChange={(e) => handleInputChange('pages', e.target.value)}
                      placeholder="200"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalLanguage" className="text-sm font-medium text-gray-700">
                      اللغة الأصلية
                    </Label>
                    <Input
                      id="originalLanguage"
                      value={formData.originalLanguage}
                      onChange={(e) => handleInputChange('originalLanguage', e.target.value)}
                      placeholder="الإنجليزية"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="translatedLanguage" className="text-sm font-medium text-gray-700">
                      اللغة المترجم إليها
                    </Label>
                    <Input
                      id="translatedLanguage"
                      value={formData.translatedLanguage}
                      onChange={(e) => handleInputChange('translatedLanguage', e.target.value)}
                      placeholder="العربية"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="isbn" className="text-sm font-medium text-gray-700">
                    رقم ISBN
                  </Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    placeholder="978-0-000000-0-0"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {/* حقول إضافية للكتب الإلكترونية */}
            {formData.bookType === 'ebook' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fileFormat" className="text-sm font-medium text-gray-700">
                      صيغة الملف
                    </Label>
                    <select
                      id="fileFormat"
                      value={formData.fileFormat}
                      onChange={(e) => handleInputChange('fileFormat', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="PDF">PDF</option>
                      <option value="EPUB">EPUB</option>
                      <option value="MOBI">MOBI</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="wordCount" className="text-sm font-medium text-gray-700">
                      عدد الكلمات
                    </Label>
                    <Input
                      id="wordCount"
                      type="number"
                      value={formData.wordCount}
                      onChange={(e) => handleInputChange('wordCount', e.target.value)}
                      placeholder="50000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* حقول إضافية للكتب الصوتية */}
            {formData.bookType === 'audio' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                      مدة التشغيل
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="مثال: 5 ساعات 30 دقيقة"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="narrator" className="text-sm font-medium text-gray-700">
                      القارئ
                    </Label>
                    <Input
                      id="narrator"
                      value={formData.narrator}
                      onChange={(e) => handleInputChange('narrator', e.target.value)}
                      placeholder="اسم القارئ"
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}

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

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                ملاحظات أو متطلبات إضافية
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="اكتب أي ملاحظات أو متطلبات إضافية..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg"
              >
                أرسل عملك
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Right Column - Requirements and Steps */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* What Should I Prepare Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              ما الذي يجب علي تحضيره؟
            </h3>
            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Steps Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              كيفية التقديم
            </h3>
            <div className="space-y-3">
              {submissionSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              رأي المؤلف
            </h3>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                "ككاتب مستقل، من الصعب العثور على منصات تدعم الأصوات المحلية حقاً. أعطتني دار ملهمون وجوداً وتوجيهاً وجمهوراً يحب القصص الهادفة."
              </blockquote>
              <p className="font-semibold text-gray-800">عمار الفهيم</p>
              <p className="text-sm text-gray-600">شاعر وناشر</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublishPage;
