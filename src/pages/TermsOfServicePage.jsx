import React from 'react';
import { motion } from 'framer-motion';

const TermsOfServicePage = ({ siteSettings = {} }) => {
  const termsContent = siteSettings?.terms?.termsOfService || 'شروط وأحكام استخدام الموقع...';

  return (
    <div className="max-w-screen-md mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4 text-gray-800"
      >
        شروط الاستخدام
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-gray max-w-none"
      >
        <div 
          className="text-sm leading-6 text-gray-700 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: termsContent.replace(/\n/g, '<br/>') }}
        />
      </motion.div>
    </div>
  );
};

export default TermsOfServicePage;
