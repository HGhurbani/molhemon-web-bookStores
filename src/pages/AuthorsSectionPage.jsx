import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import firebaseApi from '@/lib/firebaseApi';
import SocialMediaIcons from '@/components/SocialMediaIcons.jsx';
import logger from '@/lib/logger.js';

const AuthorsSectionPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await firebaseApi.getAuthors();
        setAuthors(response);
      } catch (error) {
        logger.error('Error fetching authors:', error);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحميل المؤلفين...</p>
      </div>
    );
  }

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
          تعرف على كتابنا
        </h1>
        <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600 leading-relaxed">
          <p>
            في دار ملهمون، نفخر بتقديم مجتمع نابض بالحياة ومتنامي من الكتاب والشعراء ورواة القصص وقادة الفكر من جميع أنحاء الشرق الأوسط وخارجه. يُضفي كتابنا الحيوية على أصواتهم المتنوعة وأفكارهم القوية وخيالهم الرحب - صفحة تلو الأخرى.
          </p>
          <p>
            سواء كنت تبحث عن قصص أدبية، أو كتب تنمية ذاتية، أو فانتازيا، أو قصص أطفال، ستجد وجهات نظر أصيلة ورؤى ثقافية راسخة من خلال المبدعين المميزين على منصتنا. نحتفي بكل صوت - من الكتاب الجدد إلى الكتاب الحائزين على جوائز.
          </p>
        </div>
      </motion.div>

      {/* Authors Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {authors.map((author, index) => (
          <motion.div
            key={author.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-6xl">📚</div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {author.name}
              </h3>
              {author.englishName && (
                <p className="text-gray-500 text-sm text-center mb-2">
                  {author.englishName}
                </p>
              )}
              {author.genre && (
                <div className="text-center mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {author.genre}
                  </span>
                </div>
              )}
              
              {/* الوصف مع إمكانية التوسيع */}
              <div className="flex-grow">
                <p className="text-gray-600 text-sm leading-relaxed text-center line-clamp-3">
                  {author.bio || author.description || 'مؤلف في دار ملهمون للنشر'}
                </p>
                
                {/* زر مشاهدة المزيد إذا كان الوصف طويل */}
                {(author.bio || author.description) && (author.bio?.length > 100 || author.description?.length > 100) && (
                  <div className="text-center mt-2">
                    <Link 
                      to={`/author/${author.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                    >
                      مشاهدة المزيد
                      <ArrowLeft className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                    </Link>
                  </div>
                )}
              </div>
              
              {/* وسائل التواصل الاجتماعي */}
              {author.socialMedia && (
                <div className="flex justify-center mt-3 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">تابع المؤلف</p>
                    <SocialMediaIcons 
                      socialMedia={author.socialMedia} 
                      size="w-4 h-4"
                    />
                  </div>
                </div>
              )}
              
              {author.followers && (
                <div className="text-center mt-3">
                  <span className="text-gray-500 text-sm">
                    {author.followers} متابع
                  </span>
                </div>
              )}
              
              {/* زر الانتقال لصفحة المؤلف */}
              <div className="text-center mt-4">
                <Link 
                  to={`/author/${author.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  عرض الملف الشخصي
                  <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

             {/* Call to Action Section */}
       <motion.div
         className="bg-blue-900 rounded-lg p-8 md:p-12 text-center text-white"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.4 }}
       >
         <h2 className="text-3xl md:text-4xl font-bold mb-4">
           هل أنت كاتب وترغب بمشاركة قصتك ؟
         </h2>
         <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
           انضم إلى شبكتنا المتنامية وانشر مع دارمولهيمون اليوم.
         </p>
         <Button 
           onClick={() => window.location.href = '/publish'}
           className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-lg flex items-center mx-auto"
         >
           <ArrowLeft className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
           انشر معنا
         </Button>
       </motion.div>
    </div>
  );
};

export default AuthorsSectionPage;
