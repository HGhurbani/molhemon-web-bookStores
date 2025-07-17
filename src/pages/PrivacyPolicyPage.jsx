import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => (
  <div className="max-w-screen-md mx-auto p-6 bg-white rounded-lg shadow mt-6">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-bold mb-4"
    >
      سياسة الخصوصية
    </motion.h1>
    <p className="text-sm leading-6 text-gray-700">
      يتم توفير هذه الصفحة كنموذج عام لشرح كيفية جمع البيانات واستخدامها. يجب
      مراجعة محتوى السياسة ليتوافق مع متطلبات اللوائح مثل GDPR وCCPA.
    </p>
  </div>
);

export default PrivacyPolicyPage;
