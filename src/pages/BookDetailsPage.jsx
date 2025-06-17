import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, BookOpenText, Headphones, ChevronDown } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import YouMayAlsoLikeSection from '@/components/YouMayAlsoLikeSection.jsx';
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
          className="order-1 lg:order-1 space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative aspect-[3/4] w-48 mx-auto rounded-lg shadow-xl overflow-hidden">
            <img alt={`غلاف كتاب ${book.title}`} className="w-full h-full object-cover" src={book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              خصم {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
            </span>
          </div>
          <div className="flex flex-col space-y-2 w-48 mx-auto">
            <Button variant="outline" className="w-full"><BookOpenText className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />اقرأ عينة</Button>
            <Button variant="outline" className="w-full"><Headphones className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />عينة صوتية</Button>
          </div>
        </motion.div>

        <motion.div
          className="order-2 lg:order-2 space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3">
            <span>بقلم </span>
            <Link to={`/author/${authorDetails?.id || 'unknown'}`} className="text-blue-600 hover:underline mx-1">{book.author}</Link>
            <span className="mx-1">(مؤلف)</span>
            <span className="mx-2">|</span>
            <span className="px-2 py-1 border rounded-full bg-white text-gray-800">{book.category}</span>
            <span className="mx-2">|</span>
            <span className="flex items-center"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mx-1" />{book.rating.toFixed(1)}/5</span>
            <span className="mx-2">|</span>
            <span>{book.salesRank || 0} نسخة مباعة</span>
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">حول الكتاب</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{displayedDescription}</p>
            {description.length > 250 && (
              <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-blue-600 hover:underline text-sm mt-1">
                {showFullDescription ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full border text-sm bg-white text-gray-800">{book.category}</span>
          </div>

          <hr className="mb-4" />

          <div className="mb-6">
            <div className="border-b mb-3 flex">
              <button onClick={() => setActiveTab('details')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>تفاصيل المنتج</button>
              <button onClick={() => setActiveTab('author')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'author' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>نبذة عن المؤلف</button>
            </div>
            {activeTab === 'details' ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                <div className="text-gray-500">رقم ISBN-13:</div><div className="text-gray-700">{book.isbn || '9781401971373'}</div>
                <div className="text-gray-500">الناشر:</div><div className="text-gray-700">{book.publisher || 'دار نشر هاوس'}</div>
                <div className="text-gray-500">البائع:</div><div className="text-gray-700">{book.seller || 'خدمات دار نشر بينجوين راندوم هاوس'}</div>
                <div className="text-gray-500">التنسيق:</div><div className="text-gray-700">{book.format || 'كتاب إلكتروني'}</div>
                <div className="text-gray-500">عدد الصفحات:</div><div className="text-gray-700">{book.pages || '257'}</div>
                <div className="text-gray-500">ترتيب المبيعات:</div><div className="text-gray-700">{book.salesRank || '77'}</div>
                <div className="text-gray-500">حجم الملف:</div><div className="text-gray-700">{book.fileSize || '—'}</div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">{authorDetails?.bio || 'لا توجد نبذة متوفرة.'}</p>
            )}
          </div>
          <Button variant="outline" className="w-full text-gray-600 border-gray-300 hover:bg-gray-100" onClick={() => toast({title: 'مشاركة المنتج', description:'🚧 هذه الميزة غير مطبقة بعد'})}>
            <Share2 className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
            مشاركة هذا المنتج
          </Button>
        </motion.div>

        <motion.div
          className="order-3 lg:order-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-md p-2 text-center">
                  <p className="text-sm font-medium mb-1">كتاب</p>
                  <p className="text-lg font-bold text-blue-600">{book.price.toFixed(2)} د.إ</p>
                  <p className="text-xs text-green-600">متوفر فوراً</p>
                </div>
                <div className="border rounded-md p-2 text-center">
                  <p className="text-sm font-medium mb-1">كتاب صوتي</p>
                  <p className="text-lg font-bold">0 د.إ</p>
                  <p className="text-xs text-gray-600">مع عضوية</p>
                </div>
              </div>
              <div className="flex justify-between items-end text-sm">
                <div>
                  {book.originalPrice && (
                    <span className="line-through text-red-500 mr-2 rtl:ml-2 rtl:mr-0">{book.originalPrice.toFixed(2)} د.إ</span>
                  )}
                  <div className="text-2xl font-bold text-blue-600">{book.price.toFixed(2)} د.إ</div>
                </div>
                {book.originalPrice && (
                  <div className="text-green-600">وفر {(book.originalPrice - book.price).toFixed(2)} د.إ</div>
                )}
              </div>
              <div className="flex items-center mb-3 space-x-2 rtl:space-x-reverse">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} className="h-8 w-8 text-gray-600 hover:bg-gray-100 rounded-r-md rtl:rounded-l-md rtl:rounded-r-none"><Minus className="w-4 h-4" /></Button>
                  <span className="px-3 text-sm font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-8 w-8 text-gray-600 hover:bg-gray-100 rounded-l-md rtl:rounded-r-md rtl:rounded-l-none"><Plus className="w-4 h-4" /></Button>
                </div>
                <Button onClick={onAddToCart} className="flex-grow bg-blue-600 hover:bg-blue-700 h-9"><ShoppingCart className="w-5 h-5 ml-1 rtl:mr-1 rtl:ml-0" />أضف إلى السلة</Button>
              </div>
              <Button variant="secondary" className="w-full mb-3">اشتري الان بنقرة واحدة</Button>
              <div className="flex justify-around text-sm text-gray-600">
                <Button variant="ghost" size="sm" onClick={() => toast({title:'دردشة', description:'🚧 هذه الميزة غير مطبقة بعد'})} className="px-2"><ChevronDown className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />دردش</Button>
                <Button variant="ghost" size="sm" onClick={onToggleWishlist} className="px-2"><Heart className={`w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />قائمة الرغبات</Button>
                <Button variant="ghost" size="sm" onClick={() => toast({title:'مشاركة', description:'🚧 هذه الميزة غير مطبقة بعد'})} className="px-2"><Share2 className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />مشاركة</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-800 mb-2">تقييمات العملاء</h3>
        <p className="text-gray-600 text-sm">🚧 هذه الميزة غير مطبقة بعد</p>
      </div>

      {relatedBooks.length > 0 && (
        <YouMayAlsoLikeSection
          books={relatedBooks}
          handleAddToCart={handleAddToCart}
          handleToggleWishlist={handleToggleWishlist}
          wishlist={JSON.parse(localStorage.getItem('wishlist') || '[]')}
          authors={authors}
        />
      )}
    </div>
  );
};

export default BookDetailsPage;
