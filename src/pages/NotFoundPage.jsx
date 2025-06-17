
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4 py-12 bg-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10, duration: 0.5 }}
        className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-md w-full"
      >
        <AlertTriangle className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-amber-500 mb-6" />
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم حذفها أو تغيير اسمها أو أنها غير متوفرة مؤقتاً.
        </p>
        <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base py-3 px-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Link to="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
