import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { 
  Calendar, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon,
  ArrowLeft,
  BookOpenText,
  Tag,
  Eye,
  Heart
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast.js";
import firebaseApi from '@/lib/firebaseApi';
import logger from '@/lib/logger.js';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article || null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        // Fetching article with ID: {id}
        // Location state: {location.state}
        
        let articleData;
        
        // إذا كان المقال موجود في state، استخدمه
        if (location.state?.article) {
          // Using article from location state
          articleData = location.state.article;
        } else {
          // وإلا قم بجلب المقال من Firebase
          // Fetching article from Firebase
          articleData = await firebaseApi.getBlogPost(id);
        }
        
        if (articleData) {
          // Article data received successfully
          setArticle(articleData);
          
          // جلب المقالات ذات الصلة
          const allArticles = await firebaseApi.getBlogPosts();
          const related = allArticles
            .filter(a => a.id !== id && a.category === articleData.category)
            .slice(0, 3);
          setRelatedArticles(related);
          
          // زيادة عدد المشاهدات
          incrementViewCount(articleData.id);
        } else {
          logger.error('Article not found');
          setError('المقال غير موجود');
        }
      } catch (error) {
        logger.error('Error fetching article:', error);
        setError('حدث خطأ أثناء جلب المقال');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, location.state]);

  const incrementViewCount = async (articleId) => {
    try {
      // تحديث عدد المشاهدات في Firebase
      await firebaseApi.updateBlogPost(articleId, {
        viewCount: (article?.viewCount || 0) + 1
      });
      setViewCount((article?.viewCount || 0) + 1);
    } catch (error) {
      logger.error('Error updating view count:', error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'تم إزالة الإعجاب' : 'تم الإعجاب بالمقال',
      description: isLiked ? 'تم إزالة المقال من قائمة الإعجابات' : 'تم إضافة المقال إلى قائمة الإعجابات'
    });
  };

  const handleShare = (platform) => {
    if (!article) return;
    
    const url = window.location.href;
    const text = article.title;
    
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
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: 'تم نسخ الرابط',
          description: 'تم نسخ رابط المقال إلى الحافظة'
        });
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

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
          <p className="mt-4 text-gray-600">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'المقال غير موجود'}</p>
          <Link to="/blog">
            <Button className="mt-4">العودة إلى المدونة</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex space-x-2 rtl:space-x-reverse">
              <li><Link to="/" className="hover:text-blue-600">الرئيسية</Link></li>
              <li><span>/</span></li>
              <li><Link to="/blog" className="hover:text-blue-600">المدونة</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700" aria-current="page">{article.title}</li>
            </ol>
          </nav>
          
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
            العودة إلى المدونة
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {article.featured_image && (
                <div className="relative h-96">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                        {formatDate(article.createdAt)}
                      </span>
                      {article.author && (
                        <span className="flex items-center">
                          <User className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                          {article.author}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                        {viewCount || article.viewCount || 0} مشاهدة
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                    {article.excerpt && (
                      <p className="text-lg text-gray-200">{article.excerpt}</p>
                    )}
                  </div>
                </div>
              )}
              
              {!article.featured_image && (
                <div className="p-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                      {formatDate(article.createdAt)}
                    </span>
                    {article.author && (
                      <span className="flex items-center">
                        <User className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                        {article.author}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                      {viewCount || article.viewCount || 0} مشاهدة
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
                  {article.excerpt && (
                    <p className="text-lg text-gray-600">{article.excerpt}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Article Content */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Article Meta */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {article.category && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="text-sm text-gray-500">مشاركة:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="p-2 hover:bg-blue-50"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Twitter className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="p-2 hover:bg-blue-50"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="p-2 hover:bg-gray-50"
                  >
                    <LinkIcon className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Article Footer */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    آخر تحديث: {formatDate(article.updatedAt)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">مقالات ذات صلة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.id}`}
                      state={{ article: relatedArticle }}
                      className="group block"
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {relatedArticle.featured_image && (
                          <img
                            src={relatedArticle.featured_image}
                            alt={relatedArticle.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedArticle.excerpt || relatedArticle.content?.substring(0, 100) + '...'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-3">
                            <Calendar className="w-3 h-3 ml-1 rtl:mr-1 rtl:ml-0" />
                            {formatDate(relatedArticle.createdAt)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Author Info */}
              {article.author && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">عن الكاتب</h3>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">{article.author}</h4>
                    <p className="text-sm text-gray-600 mt-1">كاتب في دار ملهمون</p>
                  </div>
                </div>
              )}

              {/* Article Stats */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">إحصائيات المقال</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المشاهدات</span>
                    <span className="font-medium">{viewCount || article.viewCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تاريخ النشر</span>
                    <span className="font-medium">{formatDate(article.createdAt)}</span>
                  </div>
                  {article.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الفئة</span>
                      <span className="font-medium">{article.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-3">اشترك في النشرة البريدية</h3>
                <p className="text-blue-100 text-sm mb-4">
                  احصل على آخر المقالات والأخبار من دار ملهمون
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="w-full px-3 py-2 rounded-md text-gray-800 text-sm"
                  />
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    اشتراك
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
