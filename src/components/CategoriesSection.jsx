
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const CategoriesSection = ({ categories }) => {
  return (
    <section className="py-6 sm:py-8 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-3">
          {categories.map((category, index) => {
            const IconComponent = Icons[category.icon] || Icons.BookOpen;
            const link = category.id === 'more' ? '/category/all' : `/category/${category.id}`;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="category-icon group flex flex-col items-center p-2 sm:p-2.5 bg-white rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link to={link} className="flex flex-col items-center w-full">
                  <div className="bg-slate-100 p-2 sm:p-2.5 rounded-md mb-1.5 transition-colors duration-200 group-hover:bg-blue-500">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 transition-colors duration-200 group-hover:text-white" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] text-center text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-200">{category.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
