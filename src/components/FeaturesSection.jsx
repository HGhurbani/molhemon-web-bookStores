import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturesSection = ({ features, banners = [], handleFeatureClick }) => {
  const { t } = useTranslation();
  return (
    <section className="py-8 sm:py-10 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feature, index) => {
            const IconComponent = typeof feature.icon === 'string' ? (Icons[feature.icon] || Icons.Star) : feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, boxShadow: "0 6px 12px rgba(0,0,0,0.06)" }}
                transition={{ type: "spring", stiffness: 250, damping: 10 }}
                className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm cursor-pointer space-x-3 rtl:space-x-reverse text-black"
                onClick={() => handleFeatureClick(feature.action || feature.id || String(feature.title))}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.25, delay: index * 0.08, ease: "easeOut" }}
              >
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base mb-1">{t(feature.title, { defaultValue: feature.title })}</h3>
                  <p className="text-[11px] sm:text-xs">{t(feature.description, { defaultValue: feature.description })}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-10 sm:mt-12 text-center"
          initial={{ opacity: 0, y:25 }}
          whileInView={{ opacity: 1, y:0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {banners.filter(b => b.group_size === 3).map((b, i) => (
                <img
                  key={i}
                  alt={b.alt}
                  className="w-full h-24 sm:h-32 object-cover rounded-md"
                  src={b.image_url}
                />
              ))}
            </div>
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