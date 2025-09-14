import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { 
  Search, 
  ShoppingBag, 
  Info, 
  CreditCard, 
  Truck, 
  Users,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';
import firebaseApi from '@/lib/firebaseApi';
import logger from '@/lib/logger.js';

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الأسئلة الشائعة من Firebase
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const faqsData = await firebaseApi.getFaqs();
        
        // ترتيب الأسئلة حسب الترتيب والفئة
        const sortedFaqs = faqsData.sort((a, b) => {
          if (a.orderIndex !== b.orderIndex) {
            return a.orderIndex - b.orderIndex;
          }
          return a.category.localeCompare(b.category);
        });
        
        setFaqs(sortedFaqs);
      } catch (error) {
        logger.error('Error fetching FAQs:', error);
        setError('حدث خطأ أثناء جلب الأسئلة الشائعة');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // الحصول على الفئات الفريدة
  const categories = [
    { id: 'all', title: 'جميع الأسئلة', icon: HelpCircle, color: 'bg-gray-100 text-gray-600' },
    ...Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean))).map(category => ({
      id: category,
      title: category,
      icon: HelpCircle,
      color: 'bg-blue-100 text-blue-600'
    }))
  ];

  // تصفية الأسئلة حسب البحث والفئة
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // البحث يتم تلقائياً من خلال useState
    // لا حاجة لتنفيذ إضافي هنا
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الأسئلة الشائعة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">لا توجد أسئلة شائعة متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        className="bg-blue-600 rounded-lg p-8 text-center text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          مرحبًا، كيف يمكننا مساعدتك؟
        </h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="...بحث"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-3 w-full py-3 text-lg border-0 focus:ring-2 focus:ring-white/50"
            />
          </div>
        </form>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              التصنيفات
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`p-4 rounded-lg text-center transition-all duration-200 hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-white shadow-lg transform scale-105'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-800">
                  {category.title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          الأسئلة الشائعة
        </h2>
        
        <div className="space-y-6">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border-b border-gray-200 pb-6 last:border-b-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <HelpCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feedback Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-lg text-gray-700 mb-4">
            هل كان هذا المقال مفيدًا؟
          </p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-green-50 hover:border-green-500 hover:text-green-600"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>نعم</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-red-50 hover:border-red-500 hover:text-red-600"
            >
              <ThumbsDown className="w-5 h-5" />
              <span>لا</span>
            </Button>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            مقالات ذات صلة
          </h3>
          <div className="space-y-3">
            {[
              'لماذا لا يمكنني تسجيل الدخول إلى حسابي في دار ملهمون؟',
              'كيف يمكنني تغيير كلمة مرور حسابي في دار ملهمون؟',
              'كيف أنشئ حساباً في دار ملهمون؟'
            ].map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="text-sm text-gray-700">
                  [حسابي] {article}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            لا تزال بحاجة للمساعدة؟
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            إذا لم تجد الإجابة التي تبحث عنها، لا تتردد في التواصل مع فريق الدعم لدينا. نحن هنا لمساعدتك!
          </p>
          <Button className="bg-white text-blue-600 px-8 py-3 text-lg hover:bg-gray-100">
            تواصل معنا
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenterPage;
