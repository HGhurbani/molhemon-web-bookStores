
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, BookOpenText, Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx'; 
import { toast } from "@/components/ui/use-toast.js";

const BookDetailsPage = ({ books, authors, handleAddToCart, handleToggleWishlist }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const currentBook = books.find(b => b.id.toString() === id);
    if (currentBook) {
      setBook(currentBook);
      const authorBooks = books.filter(b => b.author === currentBook.author && b.id !== currentBook.id);
      const categoryBooks = books.filter(b => b.category === currentBook.category && b.id !== currentBook.id && b.author !== currentBook.author);
      setRelatedBooks([...authorBooks, ...categoryBooks].slice(0, 6));

      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(localWishlist.some(item => item.id === currentBook.id));

    }
  }, [id, books]);

  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (book) {
      setIsInWishlist(localWishlist.some(item => item.id === book.id));
    }
  }, [book, handleToggleWishlist]);


  const authorDetails = authors.find(a => a.name === book?.author);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const onAddToCart = () => {
    handleAddToCart({ ...book, quantity });
  };
  
  const onToggleWishlist = () => {
    handleToggleWishlist(book);
    setIsInWishlist(!isInWishlist);
  };

  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري تحميل تفاصيل الكتاب...</div>;
  }

  const description = book.description || "لا يوجد وصف متوفر لهذا الكتاب حاليًا. نعمل على توفير أوصاف شاملة لجميع كتبنا. شكرًا لتفهمكم.";
  const displayedDescription = showFullDescription ? description : `${description.substring(0, 250)}${description.length > 250 ? '...' : ''}`;


  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <nav className="text-sm text-gray-500 mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2 rtl:space-x-reverse">
          <li><Link to="/" className="hover:text-blue-600">الرئيسية</Link></li>
          <li><span>/</span></li>
          <li><Link to={`/category/${book.category}`} className="hover:text-blue-600">{book.category || 'فئة غير محددة'}</Link></li>
          <li><span>/</span></li>
          <li className="text-gray-700" aria-current="page">{book.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] rounded-lg shadow-xl overflow-hidden mb-4">
              <img  
                alt={`غلاف كتاب ${book.title}`} 
                className="w-full h-full object-cover"
               src="https://images.unsplash.com/photo-1572119003128-d110c07af847" />
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                خصم {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden">
                  <img  alt={`صورة مصغرة للكتاب ${i}`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1572119003128-d110c07af847" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <div className="flex items-center mb-3 text-sm">
            <span className="text-gray-600">بواسطة:</span>
            <Link to={`/author/${authorDetails?.id || 'unknown'}`} className="text-blue-600 hover:underline font-medium mr-1 rtl:ml-1 rtl:mr-0">{book.author}</Link>
            <span className="text-gray-400 mx-2">|</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-gray-600 mr-1 rtl:ml-1 rtl:mr-0">({book.rating.toFixed(1)})</span>
              <span className="text-gray-400 mx-1">·</span>
              <span className="text-gray-600">{book.reviews} مراجعة</span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-blue-600">{book.price.toFixed(2)} ر.س</span>
            {book.originalPrice && (
              <span className="text-gray-400 line-through text-lg mr-2 rtl:ml-2 rtl:mr-0">{book.originalPrice.toFixed(2)} ر.س</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-5">
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} className="h-10 w-10 text-gray-600 hover:bg-gray-100 rounded-r-md rtl:rounded-l-md rtl:rounded-r-none">
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 text-lg font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-10 w-10 text-gray-600 hover:bg-gray-100 rounded-l-md rtl:rounded-r-md rtl:rounded-l-none">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={onAddToCart} size="lg" className="flex-grow bg-blue-600 hover:bg-blue-700 text-lg py-3 h-auto">
              <ShoppingCart className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
              أضف إلى السلة
            </Button>
            <Button variant="outline" size="icon" onClick={onToggleWishlist} className={`h-12 w-12 border-gray-300 ${isInWishlist ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-5">
            <div className="flex justify-around">
              <div className="text-center">
                <BookOpenText className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                <p className="text-xs text-gray-600">كتاب مطبوع</p>
                <p className="text-sm font-medium">{book.price.toFixed(2)} ر.س</p>
              </div>
              <div className="text-center opacity-50 cursor-not-allowed">
                <Headphones className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-400">كتاب صوتي</p>
                <p className="text-sm font-medium text-gray-400">قريباً</p>
              </div>
            </div>
          </div>
          
          <div className="mb-5">
            <h3 className="font-semibold text-gray-800 mb-2">حول الكتاب</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{displayedDescription}</p>
            {description.length > 250 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)} 
                className="text-blue-600 hover:underline text-sm mt-1"
              >
                {showFullDescription ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>

          <div className="mb-5">
            <h3 className="font-semibold text-gray-800 mb-3">تفاصيل المنتج</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-500">رقم ISBN-13:</div><div className="text-gray-700">{book.isbn || '9781401971373'}</div>
              <div className="text-gray-500">الناشر:</div><div className="text-gray-700">{book.publisher || 'دار نشر هاوس'}</div>
              <div className="text-gray-500">تاريخ النشر:</div><div className="text-gray-700">{book.publishDate || '24/12/2024'}</div>
              <div className="text-gray-500">البائع:</div><div className="text-gray-700">{book.seller || 'خدمات دار نشر بينجوين راندوم هاوس'}</div>
              <div className="text-gray-500">التنسيق:</div><div className="text-gray-700">{book.format || 'كتاب إلكتروني'}</div>
              <div className="text-gray-500">عدد الصفحات:</div><div className="text-gray-700">{book.pages || '257'}</div>
              <div className="text-gray-500">ترتيب المبيعات:</div><div className="text-gray-700">{book.salesRank || '77'}</div>
            </div>
          </div>

          <Button variant="outline" className="w-full text-gray-600 border-gray-300 hover:bg-gray-100" onClick={() => toast({title: "مشاركة المنتج", description:"🚧 هذه الميزة غير مطبقة بعد"})}>
            <Share2 className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
            مشاركة هذا المنتج
          </Button>
        </motion.div>
      </div>

      {relatedBooks.length > 0 && (
        <div className="mt-10 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">كتب ذات صلة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedBooks.map((relatedBook, index) => (
              <BookCard 
                key={relatedBook.id} 
                book={relatedBook} 
                handleAddToCart={handleAddToCart} 
                handleToggleWishlist={handleToggleWishlist} 
                index={index}
                isInWishlist={JSON.parse(localStorage.getItem('wishlist') || '[]').some(item => item.id === relatedBook.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
