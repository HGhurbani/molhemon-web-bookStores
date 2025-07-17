import React from 'react';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => (
  <div className="max-w-screen-md mx-auto p-6 bg-white rounded-lg shadow mt-6">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-bold mb-4"
    >
      شروط الاستخدام
    </motion.h1>
    <p className="text-sm leading-6 text-gray-700">
      هذه البنود وضعت كمثال لتحديد حقوق وواجبات المستخدمين. يرجى تعديلها بما
      يتوافق مع متطلبات عملكم والقوانين المحلية والدولية.
    </p>
  </div>
);

export default TermsOfServicePage;
