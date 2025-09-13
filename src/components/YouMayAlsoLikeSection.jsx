
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Star, Heart, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import FormattedPrice from './FormattedPrice.jsx';

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
            <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm sm:text-base px-2 py-1 h-auto rounded-md">
              شاهد المزيد
            </Button>
          </Link>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="block sm:hidden">
          <div className="flex gap-x-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {books.slice(0,6).map((book, index) => {
              const isInWishlist = wishlist?.some(item => item.id === book.id);
              return (
                <div key={`${book.id}-${index}-you-may-like-mobile`} className="flex-shrink-0 w-40">
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="book-card group rounded-lg p-3 border border-gray-200 flex flex-col justify-between bg-white overflow-hidden h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <div className="relative mb-3 aspect-[3/4] rounded-md overflow-hidden">
                        <Link to={`/book/${book.id}`} state={{ book }}>
                          <img
                            alt={`غلاف كتاب ${book.title}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src={book.coverImage || book.cover ||
                              'https://darmolhimon.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-10.40.18-AM-300x450.jpeg'}
                          />
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full w-7 h-7 p-1 ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
                          onClick={() => handleToggleWishlist(book)}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <Link to={`/book/${book.id}`} state={{ book }}>
                        <h3 className="font-semibold mb-1 text-xs text-gray-800 truncate group-hover:text-blue-600">{book.title}</h3>
                      </Link>
                      <Link to={`/author/${book.authorId || (authors.find(a=>a.name === book.author) || {}).id || 'unknown'}`}>
                        <p className="text-gray-500 text-[10px] mb-1 hover:text-blue-500">{book.author}</p>
                      </Link>
                      
                      <div className="flex items-center mb-1 bg-gray-100 rounded-sm px-1 w-max">
                        <Star className="w-3 h-3 text-blue-600 fill-blue-600" />
                        <span className="text-[10px] text-gray-600 mr-1.5 rtl:ml-1.5 rtl:mr-0">{Number(book.rating ?? 0).toFixed(1)}/5 ({book.reviews ?? 0})</span>
                      </div>
                      
                      {(() => {
                        const hasDiscount = book.price && book.originalPrice && book.price !== book.originalPrice;
                        return (
                          <>
                            <div className="flex items-baseline mb-1">
                              {hasDiscount && (
                                <span className="text-gray-400 old-price text-[10px] ml-1.5 rtl:mr-1.5 rtl:ml-0">
                                  <FormattedPrice value={book.originalPrice} />
                                </span>
                              )}
                              <span className="font-bold text-blue-600 text-sm">
                                {book.price ? (
                                  <FormattedPrice book={book} />
                                ) : (
                                  <FormattedPrice value={book.originalPrice} />
                                )}
                              </span>
                            </div>
                            {hasDiscount && (
                              <p className="text-[10px] text-blue-600 bg-blue-600/10 rounded-sm px-1 mb-2">
                                وفر: <FormattedPrice value={book.originalPrice - book.price} />
                              </p>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    
                    <Button 
                      className={`w-full text-[10px] py-1.5 h-auto ${index % 2 === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                      variant={index % 2 === 0 ? 'default' : 'outline'}
                      onClick={() => handleAddToCart(book)}
                    >
                       <ShoppingCartIcon className="w-3.5 h-3.5 ml-1.5 rtl:mr-1.5 rtl:ml-0" />
                      أضف للسلة
                    </Button>
                    <p className="text-[9px] text-gray-500 mt-2 text-center">متوفر أيضاً ككتاب صوتي</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books.slice(0,6).map((book, index) => {
            const isInWishlist = wishlist?.some(item => item.id === book.id);
            return (
            <motion.div
              key={`${book.id}-${index}-you-may-like`}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="book-card group rounded-lg p-4 border border-gray-200 flex flex-col justify-between bg-white overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <div className="relative mb-4 aspect-[3/4] rounded-md overflow-hidden">
                  <Link to={`/book/${book.id}`} state={{ book }}>
                    <img
                      alt={`غلاف كتاب ${book.title}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={book.coverImage || book.cover ||
                        'https://darmolhimon.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-10.40.18-AM-300x450.jpeg'}
                    />
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full w-8 h-8 p-1 ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
                    onClick={() => handleToggleWishlist(book)}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <Link to={`/book/${book.id}`} state={{ book }}>
                  <h3 className="font-semibold mb-1 text-sm text-gray-800 truncate group-hover:text-blue-600">{book.title}</h3>
                </Link>
                <Link to={`/author/${book.authorId || (authors.find(a=>a.name === book.author) || {}).id || 'unknown'}`}>
                  <p className="text-gray-500 text-xs mb-2 hover:text-blue-500">{book.author}</p>
                </Link>
                
                <div className="flex items-center mb-2 bg-gray-100 rounded-sm px-1 w-max">
                  <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                  <span className="text-xs text-gray-600 mr-1.5 rtl:ml-1.5 rtl:mr-0">{Number(book.rating ?? 0).toFixed(1)}/5 ({book.reviews ?? 0})</span>
                </div>
                
                {(() => {
                  const hasDiscount = book.price && book.originalPrice && book.price !== book.originalPrice;
                  return (
                    <>
                      <div className="flex items-baseline mb-2">
                        {hasDiscount && (
                          <span className="text-gray-400 old-price text-xs ml-1.5 rtl:mr-1.5 rtl:ml-0">
                            <FormattedPrice value={book.originalPrice} />
                          </span>
                        )}
                        <span className="font-bold text-blue-600 text-lg">
                          {book.price ? (
                            <FormattedPrice book={book} />
                          ) : (
                            <FormattedPrice value={book.originalPrice} />
                          )}
                        </span>
                      </div>
                      {hasDiscount && (
                        <p className="text-xs text-blue-600 bg-blue-600/10 rounded-sm px-1 mb-3">
                          وفر: <FormattedPrice value={book.originalPrice - book.price} />
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
              
              <Button 
                className={`w-full text-xs py-2 h-auto ${index % 2 === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                variant={index % 2 === 0 ? 'default' : 'outline'}
                onClick={() => handleAddToCart(book)}
              >
                 <ShoppingCartIcon className="w-4 h-4 ml-1.5 rtl:mr-1.5 rtl:ml-0" />
                أضف للسلة
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">متوفر أيضاً ككتاب صوتي</p>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLikeSection;
