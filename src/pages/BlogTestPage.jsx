import React from 'react';
import { Link } from 'react-router-dom';

const BlogTestPage = () => {
  const testArticles = [
    {
      id: 'test-1',
      title: 'مقال تجريبي 1',
      content: 'هذا مقال تجريبي للاختبار',
      excerpt: 'ملخص المقال التجريبي الأول',
      category: 'تقنية',
      author: 'مؤلف تجريبي',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-2',
      title: 'مقال تجريبي 2',
      content: 'هذا مقال تجريبي آخر للاختبار',
      excerpt: 'ملخص المقال التجريبي الثاني',
      category: 'أدب',
      author: 'مؤلف تجريبي',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">صفحة اختبار المدونة</h1>
      
      <div className="space-y-6">
        {testArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{article.title}</h2>
            <p className="text-gray-600 mb-4">{article.excerpt}</p>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link
                to={`/blog/${article.id}`}
                state={{ article }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                عرض المقال (مع state)
              </Link>
              
              <Link
                to={`/blog/${article.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                عرض المقال (بدون state)
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Link
          to="/blog"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          العودة إلى المدونة
        </Link>
      </div>
    </div>
  );
};

export default BlogTestPage;













