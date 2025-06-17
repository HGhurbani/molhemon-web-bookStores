
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Star, Heart, ShoppingCart as ShoppingCartIcon, Zap } from 'lucide-react';

const FlashSaleCountdown = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 0); 
    eventDate.setHours(eventDate.getHours() + 8, eventDate.getMinutes() + 24, eventDate.getSeconds() + 18);

    const difference = +eventDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse">
      {timeLeft.days > 0 && <span className="font-mono font-semibold text-sm bg-red-500 text-white px-1.5 py-0.5 rounded">{formatTime(timeLeft.days)}</span>}
      {timeLeft.days > 0 && <span className="text-red-500 font-bold text-sm">:</span>}
      <span className="font-mono font-semibold text-sm bg-red-500 text-white px-1.5 py-0.5 rounded">{formatTime(timeLeft.hours)}</span>
      <span className="text-red-500 font-bold text-sm">:</span>
      <span className="font-mono font-semibold text-sm bg-red-500 text-white px-1.5 py-0.5 rounded">{formatTime(timeLeft.minutes)}</span>
      <span className="text-red-500 font-bold text-sm">:</span>
      <span className="font-mono font-semibold text-sm bg-red-500 text-white px-1.5 py-0.5 rounded">{formatTime(timeLeft.seconds)}</span>
    </div>
  );
};


const BookCard = ({ book, handleAddToCart, handleToggleWishlist, index, isInWishlist, authors = [] }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 8px 15px rgba(0,0,0,0.08)" }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="book-card group rounded-lg p-2.5 sm:p-3 border border-gray-200 flex flex-col justify-between bg-white overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
  >
    <div>
      <div className="relative mb-2 sm:mb-3 aspect-[3/4] rounded-md overflow-hidden group">
        <Link to={`/book/${book.id}`}>
          <img     
            alt={`غلاف كتاب ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
           src="https://images.unsplash.com/photo-1605825176731-2538ff89cbc4" />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-1.5 right-1.5 bg-white/60 hover:bg-white rounded-full w-6 h-6 sm:w-7 sm:h-7 p-1 transition-opacity duration-200 ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}
          onClick={() => handleToggleWishlist(book)}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
                className="w-full text-[10px] sm:text-xs py-1 sm:py-1.5 h-auto bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleAddToCart(book)}
              >
                <ShoppingCartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 rtl:mr-1 rtl:ml-0" />
                أضف للسلة
            </Button>
        </div>
      </div>
      
      <Link to={`/book/${book.id}`}>
        <h3 className="font-semibold mb-0.5 text-[11px] sm:text-xs text-gray-800 truncate group-hover:text-blue-600">{book.title}</h3>
      </Link>
      <Link to={`/author/${book.authorId || (authors.find(a=>a.name === book.author) || {}).id || 'unknown'}`}>
        <p className="text-gray-500 text-[10px] sm:text-[11px] mb-1 sm:mb-1.5 hover:text-blue-500">{book.author}</p>
      </Link>
      
      <div className="flex items-center mb-1 sm:mb-1.5">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                i < Math.floor(book.rating) 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-[9px] sm:text-[10px] text-gray-500 mr-1 rtl:ml-1 rtl:mr-0">({book.reviews}%)</span>
      </div>
      
      <div className="flex items-baseline mb-1 sm:mb-1.5">
        <span className="font-bold text-blue-600 text-xs sm:text-sm">{book.price.toFixed(2)} ر.س</span>
        {book.originalPrice && (
          <span className="text-gray-400 line-through text-[9px] sm:text-[10px] mr-1 rtl:ml-1 rtl:mr-0">
            {book.originalPrice.toFixed(2)} ر.س
          </span>
        )}
      </div>
       <p className="text-[9px] sm:text-[10px] text-green-600">وفر: {(book.originalPrice && book.price ? (book.originalPrice - book.price).toFixed(2) : '0.00')} ر.س</p>
    </div>
  </motion.div>
);


const FlashSaleSection = ({ books, handleAddToCart, handleToggleWishlist, wishlist, authors }) => {
  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse mb-3 sm:mb-0">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Flash Sale</h2>
            <FlashSaleCountdown />
          </div>
          <Link to="/category/flash-sale">
            <Button variant="link" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm px-1 py-0.5 h-auto">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {books.slice(0,6).map((book, index) => (
            <BookCard 
              key={`${book.id}-${index}-flash`} 
              book={book} 
              handleAddToCart={handleAddToCart} 
              handleToggleWishlist={handleToggleWishlist} 
              index={index}
              isInWishlist={wishlist?.some(item => item.id === book.id)}
              authors={authors}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { BookCard };
export default FlashSaleSection;
