
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { TrendingUp } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';

const BookBestsellerSection = ({ books, handleAddToCart, handleToggleWishlist, wishlist, title, icon, bgColor = "bg-white", squareImages = false }) => {
  const IconComponent = icon || TrendingUp;
  return (
    <section className={`py-8 sm:py-10 ${bgColor}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse mb-3 sm:mb-0">
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <Link to={`/category/${title.toLowerCase().replace(/\s/g, '-')}`}>
            <Button variant="link" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm px-1 py-0.5 h-auto">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {books.slice(0,6).map((book, index) => (
             <BookCard
                key={`${book.id}-${index}-bestseller`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                index={index}
                isInWishlist={wishlist?.some(item => item.id === book.id)}
                square={squareImages}
              />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookBestsellerSection;
