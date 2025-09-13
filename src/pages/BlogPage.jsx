import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Search,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import firebaseApi from '@/lib/firebaseApi';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب المقالات من Firebase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const posts = await firebaseApi.getBlogPosts();
        
        // ترتيب المقالات حسب تاريخ الإنشاء
        const sortedPosts = posts.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.toDate() - a.createdAt.toDate();
          }
          return 0;
        });

        setArticles(sortedPosts);
        
        // تعيين أول مقال كمقال مميز
        if (sortedPosts.length > 0) {
          setFeaturedArticle(sortedPosts[0]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('حدث خطأ أثناء جلب المقالات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // تصفية المقالات حسب البحث
  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // الحصول على الفئات الفريدة من المقالات
  const categories = [...new Set(articles.map(article => article.category).filter(Boolean))];

  const handleShare = (platform) => {
    if (!featuredArticle) return;
    
    const url = window.location.href;
    const text = featuredArticle.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // تنسيق التاريخ
  const formatDate = (timestamp) => {
    if (!timestamp) return 'غير محدد';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المقالات...</p>
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

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">لا توجد مقالات متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
                         <div className="flex justify-between items-center">
               <h1 className="text-3xl font-bold text-gray-800 mb-2">
                 كورتساید: مدونة دار ملهمون
               </h1>
               <Link
                 to="/blog-test"
                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
               >
                 اختبار التنقل
               </Link>
             </div>
          </motion.div>

          {/* Featured Article */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={featuredArticle.featured_image || 'https://images.unsplash.com/photo-1572119003128-d110c07af847?w=800&h=600&fit=crop'}
                  alt={featuredArticle.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-gray-700">
                  {formatDate(featuredArticle.createdAt)}
                </div>
                {featuredArticle.category && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {featuredArticle.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <Link 
                  to={`/blog/${featuredArticle.id}`} 
                  state={{ article: featuredArticle }}
                  onClick={() => {
                    // Navigating to featured article
                  }}
                  className="block"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                    {featuredArticle.title}
                  </h2>
                </Link>
                {featuredArticle.author && (
                  <p className="text-gray-600 mb-4">
                    بقلم {featuredArticle.author}
                  </p>
                )}
                <p className="text-gray-700 mb-6">
                  {featuredArticle.excerpt || featuredArticle.content?.substring(0, 200) + '...'}
                </p>
                
                {/* Social Sharing */}
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-sm text-gray-600">مشاركة:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Articles List */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      src={article.featured_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop'}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdAt)}</span>
                      {article.category && (
                        <>
                          <span>•</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {article.category}
                          </span>
                        </>
                      )}
                    </div>
                                         <Link 
                       to={`/blog/${article.id}`} 
                       state={{ article }}
                       onClick={() => {
                         // Navigating to article
                       }}
                       className="block"
                     >
                       <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                         {article.title}
                       </h3>
                     </Link>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {article.excerpt || article.content?.substring(0, 150) + '...'}
                    </p>
                    {article.author && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500 mt-2">
                        <User className="w-4 h-4" />
                        <span>بقلم {article.author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                السابق
              </Button>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded">1</span>
                <span className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">2</span>
                <span className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">3</span>
                <span className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">4</span>
                <span className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">5</span>
                <span className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">6</span>
                <span className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">72</span>
              </div>
              <Button variant="outline" size="sm">
                التالي
                <ArrowRight className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Email Subscription */}
            <div className="bg-black text-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">
                كورتسايد في بريدك الإلكتروني
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                احصل على منشورات مدونة دار ملهمون أسبوعياً.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="bg-white text-black placeholder-gray-500"
                />
                <Button className="w-full bg-white text-black hover:bg-gray-100">
                  اشترك
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                جميع الفئات
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.05 }}
                  >
                    {category}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
