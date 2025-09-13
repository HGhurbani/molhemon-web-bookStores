
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Search } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';

const RecentSearchSection = ({ books, handleAddToCart, handleToggleWishlist, wishlist }) => {
  return (
    <section className="py-8 sm:py-10 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse mb-3 sm:mb-0">
            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">بحث حديث</h2>
          </div>
          <Link to="/category/recent-search">
            <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm px-2 py-1 h-auto rounded-md">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="block sm:hidden">
          <div className="flex gap-x-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {books.slice(0,6).map((book, index) => (
              <div key={`${book.id}-${index}-recent-mobile`} className="flex-shrink-0 w-40">
                <BookCard 
                  book={book} 
                  handleAddToCart={handleAddToCart} 
                  handleToggleWishlist={handleToggleWishlist} 
                  index={index}
                  isInWishlist={wishlist?.some(item => item.id === book.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.slice(0,6).map((book, index) => (
            <BookCard 
              key={`${book.id}-${index}-recent`} 
              book={book} 
              handleAddToCart={handleAddToCart} 
              handleToggleWishlist={handleToggleWishlist} 
              index={index}
              isInWishlist={wishlist?.some(item => item.id === book.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentSearchSection;
