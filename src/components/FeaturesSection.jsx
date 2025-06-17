import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({ features, handleFeatureClick }) => {
  return (
    <section className="py-8 sm:py-10 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index}
                whileHover={{ y: -4, boxShadow: "0 6px 12px rgba(0,0,0,0.06)" }}
                transition={{ type: "spring", stiffness: 250, damping: 10 }}
                className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm cursor-pointer group"
                onClick={() => handleFeatureClick(feature.title.toLowerCase().replace(/\s/g, '-'))}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.25, delay: index * 0.08, ease: "easeOut" }}
              >
                <div className={`bg-slate-100 p-2.5 sm:p-3 rounded-full inline-flex mb-2 sm:mb-3 transition-all duration-300 group-hover:bg-blue-500`}>
                    <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.color} transition-all duration-300 group-hover:text-white`} />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 group-hover:text-blue-600">{feature.title}</h3>
                <p className="text-gray-600 text-[11px] sm:text-xs">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="mt-10 sm:mt-12 text-center bg-white p-5 sm:p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y:25 }}
          whileInView={{ opacity: 1, y:0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <img   
                alt="ملصق ترويجي لمتجر ملهمون يعرض صور متنوعة لكتب وتطبيقات وخدمات"
                className="w-full max-w-3xl mx-auto h-auto rounded-md object-contain mb-4 sm:mb-6"
              src="https://images.unsplash.com/photo-1541359927273-d76820fc43f9" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2">ابحث عن مكانك في متجر ملهمون الإلكتروني</h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-lg md:max-w-xl mx-auto">
                أكثر من 5 ملايين كتاب جاهز للشحن، 3.6 مليون كتاب إلكتروني، و300,000 كتاب صوتي للتحميل الآن! خدمة الاستلام من السيارة متوفرة في معظم المتاجر!
            </p>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;