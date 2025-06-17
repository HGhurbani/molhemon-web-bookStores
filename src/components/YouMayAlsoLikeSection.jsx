
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Star, Heart, ShoppingCart as ShoppingCartIcon } from 'lucide-react';

const YouMayAlsoLikeSection = ({ books, handleAddToCart, handleToggleWishlist, wishlist, authors }) => {
  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">قد يعجبك ايضا</h2>
          </div>
          <Link to="/category/you-may-like">
            <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {books.slice(0,6).map((book, index) => {
            const isInWishlist = wishlist?.some(item => item.id === book.id);
            return (
            <motion.div
              key={`${book.id}-${index}-you-may-like`}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="book-card group rounded-lg p-3 sm:p-4 border border-gray-200 flex flex-col justify-between bg-white overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <div className="relative mb-3 sm:mb-4 aspect-[3/4] rounded-md overflow-hidden">
                  <Link to={`/book/${book.id}`}>
                    <img    
                      alt={`غلاف كتاب ${book.title}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src="https://images.unsplash.com/photo-1572119003128-d110c07af847" />
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
                <Link to={`/author/${book.authorId || (authors.find(a=>a.name === book.author) || {}).id || 'unknown'}`}>
                  <p className="text-gray-500 text-[10px] sm:text-xs mb-1 sm:mb-2 hover:text-blue-500">{book.author}</p>
                </Link>
                
                <div className="flex items-center mb-1 sm:mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                          i < Math.floor(book.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500 mr-1.5 rtl:ml-1.5 rtl:mr-0">({book.reviews}%)</span>
                </div>
                
                <div className="flex items-baseline mb-1 sm:mb-2">
                  <span className="font-bold text-blue-600 text-sm sm:text-lg">{book.price.toFixed(2)} ر.س</span>
                  {book.originalPrice && (
                    <span className="text-gray-400 line-through text-[10px] sm:text-xs mr-1.5 rtl:ml-1.5 rtl:mr-0">
                      {book.originalPrice.toFixed(2)} ر.س
                    </span>
                  )}
                </div>
                 <p className="text-[10px] sm:text-xs text-green-600 mb-2 sm:mb-3">وفر: {(book.originalPrice && book.price ? (book.originalPrice - book.price).toFixed(2) : '0.00')} ر.س</p>
              </div>
              
              <Button 
                className={`w-full text-[10px] sm:text-xs py-1.5 sm:py-2 h-auto ${index % 2 === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                variant={index % 2 === 0 ? 'default' : 'outline'}
                onClick={() => handleAddToCart(book)}
              >
                 <ShoppingCartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 rtl:mr-1.5 rtl:ml-0" />
                أضف للسلة
              </Button>
              <p className="text-[9px] sm:text-xs text-gray-500 mt-2 text-center">متوفر أيضاً ككتاب صوتي</p>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLikeSection;
