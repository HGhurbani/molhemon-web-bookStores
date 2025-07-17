import React from 'react';
import { motion } from 'framer-motion';

const ReturnPolicyPage = () => (
  <div className="max-w-screen-md mx-auto p-6 bg-white rounded-lg shadow mt-6">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-bold mb-4"
    >
      سياسة الإرجاع
    </motion.h1>
    <p className="text-sm leading-6 text-gray-700">
      تحتوي هذه الصفحة على إرشادات عامة حول كيفية إرجاع المنتجات. يجب تخصيص
      التفاصيل بما يتوافق مع سياسات المتجر والقوانين السارية.
    </p>
  </div>
);

export default ReturnPolicyPage;
