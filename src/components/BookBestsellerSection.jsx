import React from 'react';
import FormattedPrice from './FormattedPrice.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import {
  TrendingUp,
  Star,
  Heart,
  ShoppingCart as ShoppingCartIcon,
} from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';

const BestsellerCard = ({ book, handleAddToCart, handleToggleWishlist, index, isInWishlist, square = false }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="book-card group rounded-lg p-3 sm:p-4 border border-gray-200 flex flex-col justify-between overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div>
      <div className={`relative mb-3 sm:mb-4 ${square ? 'aspect-square' : 'aspect-[3/4]'} rounded-md overflow-hidden`}>
        <Link to={`/book/${book.id}`}>
          <img
            alt={`غلاف كتاب ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src="https://darmolhimon.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-10.40.18-AM-300x450.jpeg" />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full w-7 h-7 sm:w-8 sm:h-8 p-1 ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
          onClick={() => handleToggleWishlist(book)}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <Link to={`/book/${book.id}`}>
        <h3 className="font-semibold mb-1 text-xs sm:text-sm text-gray-800 truncate group-hover:text-blue-600">{book.title}</h3>
      </Link>
      <p className="text-gray-500 text-[10px] sm:text-xs mb-1 sm:mb-2 hover:text-blue-500">{book.author}</p>

      <div className="flex items-center mb-1 sm:mb-2 bg-gray-100 rounded-sm px-1 w-max">
        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 fill-blue-600" />
        <span className="text-[10px] sm:text-xs text-gray-600 mr-1.5 rtl:ml-1.5 rtl:mr-0">{book.rating.toFixed(1)}/5 ({book.reviews})</span>
      </div>

      <div className="flex items-baseline mb-1 sm:mb-2">
        {book.originalPrice && (
          <span className="text-gray-400 old-price text-[10px] sm:text-xs ml-1.5 rtl:mr-1.5 rtl:ml-0">
            <FormattedPrice value={book.originalPrice} />
          </span>
        )}
        <span className="font-bold text-blue-600 text-sm sm:text-lg"><FormattedPrice book={book} /></span>
      </div>
      <p className="text-[10px] sm:text-xs text-blue-600 bg-blue-600/10 rounded-sm px-1 mb-2 sm:mb-3">وفر: <FormattedPrice value={book.originalPrice && book.price ? (book.originalPrice - book.price) : 0} /></p>
    </div>

    <Button
      className="w-full text-[10px] sm:text-xs py-1.5 sm:py-2 h-auto bg-blue-600 text-white hover:bg-white hover:text-blue-600 hover:border-blue-600"
      variant="default"
      onClick={() => handleAddToCart(book)}
    >
      <ShoppingCartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 rtl:mr-1.5 rtl:ml-0" />
      أضف للسلة
    </Button>
    <p className="text-[9px] sm:text-xs text-gray-500 mt-2 text-center">متوفر أيضاً ككتاب صوتي</p>
  </motion.div>
);

const BookBestsellerSection = ({ books, handleAddToCart, handleToggleWishlist, wishlist, title, icon, bgColor = "bg-white", squareImages = false, likeCardStyle = false }) => {
  const IconComponent = icon || TrendingUp;
  return (
    <section className={`py-8 sm:py-10`}>
      <div className={`max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ${bgColor} p-4 rounded-[18px]`}>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse mb-3 sm:mb-0">
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <Link to={`/category/${title.toLowerCase().replace(/\s/g, '-')}`}>
            <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm px-2 py-1 h-auto rounded-md">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {books.slice(0, 6).map((book, index) => (
            likeCardStyle ? (
              <BestsellerCard
                key={`${book.id}-${index}-bestseller`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                index={index}
                isInWishlist={wishlist?.some((item) => item.id === book.id)}
                square={squareImages}
              />
            ) : (
              <BookCard
                key={`${book.id}-${index}-bestseller`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                index={index}
                isInWishlist={wishlist?.some((item) => item.id === book.id)}
                square={squareImages}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookBestsellerSection;