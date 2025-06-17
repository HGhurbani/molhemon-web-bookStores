
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';

const AuthorsSection = ({ authors }) => {
  return (
    <section className="py-8 sm:py-10 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">استكشف المؤلفين</h2>
          <Link to="/authors">
            <Button variant="link" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm px-1 py-0.5 h-auto">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-2.5 sm:gap-x-3 gap-y-3 sm:gap-y-4">
          {authors.slice(0,10).map((author, index) => (
            <motion.div
              key={`${author.id}-${index}`}
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-center group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link to={`/author/${author.id}`} className="block">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-1.5 sm:mb-2">
                   <img    
                      alt={`صورة المؤلف ${author.name}`} 
                      className="w-full h-full rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-sm group-hover:shadow-md"
                      src="https://darmolhimon.com/wp-content/uploads/2025/06/Group-162.png" />
                   <div className="absolute inset-0 rounded-full ring-1 ring-blue-500 ring-offset-1 ring-offset-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-medium text-[10px] sm:text-xs text-gray-700 group-hover:text-blue-600 transition-colors">{author.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <motion.div 
                className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <img    
                    alt="ملصق ترويجي لدار ملهمون يضم صور مؤلفين عالميين مشهورين باللونين الأبيض والأسود"
                    className="w-full h-auto rounded-md object-contain max-h-72"
                  src="https://darmolhimon.com/wp-content/uploads/2025/06/image-1.png" />
            </motion.div>
            <motion.div 
                className="bg-gradient-to-br from-blue-600 to-blue-600 p-3 sm:p-4 lg:p-6 rounded-lg shadow-md text-white overflow-hidden"
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay:0.1, ease: "easeOut" }}
            >
                 <img    
                    alt="عرض لكتب ديفيد هاوكينز مع صورته الشخصية وخلفية زرقاء متدرجة"
                    className="w-full h-auto rounded-md object-contain max-h-72"
                   src="https://darmolhimon.com/wp-content/uploads/2025/06/image.png" />
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default AuthorsSection;
