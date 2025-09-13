import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsletterSection = ({ handleFeatureClick }) => {
  return (
    <section className="py-10 sm:py-12 text-white rounded-t-2xl" style={{backgroundColor: '#585cc3'}}>
      <motion.div
        className="max-w-screen-lg mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y:25 }}
        whileInView={{ opacity: 1, y:0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="sm:w-1/2 text-right mb-4 sm:mb-0 sm:pr-4 rtl:sm:pl-4 rtl:sm:pr-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2.5 sm:mb-3">ابق على اطلاع</h2>
          <p className="text-sm sm:text-base opacity-90">
            اشترك في نشرتنا الإخبارية اليومية للحصول على آخر التحديثات التي تصل مباشرة إلى بريدك الوارد
          </p>
        </div>
        <form
            className="flex flex-col sm:flex-row max-w-sm sm:max-w-md bg-white/20 backdrop-blur-sm rounded-lg p-1 sm:p-1.5 shadow-lg focus-within:ring-2 focus-within:ring-white/80 sm:ml-auto rtl:sm:mr-auto"
            onSubmit={(e) => { e.preventDefault(); handleFeatureClick('newsletter-subscribe'); }}
        >
          <div className="relative flex-grow mb-1.5 sm:mb-0 sm:mr-1.5 rtl:sm:ml-1.5 rtl:sm:mr-0">
            <Mail className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-100 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none rtl:left-2.5 rtl:right-auto" />
            <input
              type="email"
              placeholder="أدخل عنوان بريدك الإلكتروني"
              className="w-full px-3 py-2 sm:py-2.5 pr-8 rtl:pl-8 rtl:pr-3 rounded-md text-white focus:outline-none text-xs sm:text-sm bg-transparent placeholder-slate-200"
              required
              aria-label="عنوان البريد الإلكتروني للاشتراك"
            />
          </div>
          <Button 
            type="submit"
            className="bg-white hover:bg-slate-100 text-blue-600 rounded-md px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
          >
            اشترك
            <Send className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
          </Button>
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;