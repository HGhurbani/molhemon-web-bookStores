import React, { useState, useEffect } from 'react';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Star, Heart, ShoppingCart, Share2, BookOpenText, Headphones, ChevronDown } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import YouMayAlsoLikeSection from '@/components/YouMayAlsoLikeSection.jsx';
import { toast } from "@/components/ui/use-toast.js";
import api from '@/lib/api.js';
import { getPriceForCurrency, useCurrency } from '@/lib/currencyContext.jsx';
import jwtAuthManager from '@/lib/jwtAuth.js';
import logger from '@/lib/logger.js';

const BookDetailsPage = ({ books, authors, handleAddToCart, handleToggleWishlist, onOpenChat }) => {
  const { id } = useParams();
  const location = useLocation();
  const { currency } = useCurrency();
  const [book, setBook] = useState(location.state?.book || null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stateBook = location.state?.book;
    const currentBook = stateBook && stateBook.id.toString() === id
      ? stateBook
      : books.find(b => b.id.toString() === id);

    if (currentBook) {
      setBook(currentBook);
      const authorBooks = books.filter(b => b.author === currentBook.author && b.id !== currentBook.id);
      const categoryBooks = books.filter(b => b.category === currentBook.category && b.id !== currentBook.id && b.author !== currentBook.author);
      setRelatedBooks([...authorBooks, ...categoryBooks].slice(0, 6));

      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(localWishlist.some(item => item.id === currentBook.id));

    }
  }, [id, books, location.state]);

  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (book) {
      setIsInWishlist(localWishlist.some(item => item.id === book.id));
    }
  }, [book, handleToggleWishlist]);

  useEffect(() => {
    if (!book) return;
    (async () => {
      try {
        const r = await api.getBookRatings(book.id);
        setRatings(r);
      } catch (e) {
        logger.error('Failed to fetch ratings', e);
      }
    })();
  }, [book]);

  // تحقق من أن المستخدم قام بشراء هذا الكتاب بالفعل
  useEffect(() => {
    (async () => {
      try {
        const user = jwtAuthManager.getCurrentUser();
        const loggedIn = !!user;
        setIsLoggedIn(loggedIn);
        if (!loggedIn || !book) {
          setHasPurchased(false);
          return;
        }

        const orders = await api.orders.getOrders(user.uid);
        const purchased = Array.isArray(orders) && orders.some((order) => {
          const items = order.items || [];
          const orderStatus = (order.status || '').toLowerCase();
          const paymentStatus = (order.paymentStatus || '').toLowerCase();
          const isPaid = ['paid', 'completed', 'succeeded', 'delivered'].some(s => orderStatus.includes(s) || paymentStatus.includes(s));
          return items.some((it) => String(it.productId || it.id) === String(book.id)) && (isPaid || !order.requiresPayment);
        });
        setHasPurchased(!!purchased);
      } catch (e) {
        logger.info('Failed to verify purchase for rating', e);
        setHasPurchased(false);
      }
    })();
  }, [book]);

  const authorDetails = authors.find(a => a.name === book?.author);

  const hasReadSample = Boolean(book?.ebookFile);
  const hasAudioSample = Boolean(book?.sampleAudio);

  const hasBook = book?.type !== 'audio';
  const hasAudiobook = Boolean(book?.audioFile || book?.sampleAudio);
  
  // تحديد نوع الكتاب
  const isPhysicalBook = book?.type === 'physical';
  const isEbook = book?.type === 'ebook';
  const isAudiobook = book?.type === 'audio';

  const [selectedFormat, setSelectedFormat] = useState(
    hasBook ? 'book' : hasAudiobook ? 'audio' : ''
  );

  useEffect(() => {
    setSelectedFormat(hasBook ? 'book' : hasAudiobook ? 'audio' : '');
  }, [book]);

  const onAddToCart = () => {
    const type = selectedFormat === 'audio' ? 'audio' : book.type;
    handleAddToCart({ ...book, quantity: 1, type });
  };

  const onToggleWishlist = () => {
    handleToggleWishlist(book);
    setIsInWishlist(!isInWishlist);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isLoggedIn || !hasPurchased) {
        toast({ title: 'غير مسموح', description: 'يمكن التقييم فقط بعد شراء المنتج.', variant: 'destructive' });
        return;
      }
      const user = jwtAuthManager.getCurrentUser();
      await api.addBookRating(book.id, { rating: ratingValue, comment, userId: user?.uid });
      const r = await api.getBookRatings(book.id);
      setRatings(r);
      setRatingValue(0);
      setComment('');
      toast({ title: 'تم إضافة تقييمك' });
    } catch (err) {
      toast({ title: 'تعذر إضافة التقييم. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري تحميل تفاصيل الكتاب...</div>;
  }

  const description = book.description || "لا يوجد وصف متوفر لهذا الكتاب حاليًا. نعمل على توفير أوصاف شاملة لجميع كتبنا. شكرًا لتفهمكم.";
  const displayedDescription = showFullDescription ? description : `${description.substring(0, 250)}${description.length > 250 ? '...' : ''}`;
  const avgRating = ratings.length
    ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
    : (book.rating ?? 0);

  const displayPrice = getPriceForCurrency(book, currency.code) || book.originalPrice || book.price || 0;

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
          <div className="relative aspect-[3/4] w-80 rounded-lg shadow-xl overflow-hidden">
            <img alt={`غلاف كتاب ${book.title}`} className="w-full h-full object-cover" src={book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
            {book.originalPrice && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                خصم {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2 w-80">
            {hasReadSample && (
              <Link to={`/read/${book.id}`} className="w-full">
                <Button variant="ghost" className="w-full bg-purple-700/10 text-purple-700 hover:bg-purple-700/20">
                  <BookOpenText className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 text-purple-700" />اقرأ عينة
                </Button>
              </Link>
            )}
            {hasAudioSample && (
              <Link to={`/listen/${book.id}`} className="w-full">
                <Button variant="ghost" className="w-full bg-purple-700/10 text-purple-700 hover:bg-purple-700/20">
                  <Headphones className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 text-purple-700" />عينة صوتية
                </Button>
              </Link>
            )}
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
            <span className="flex items-center"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mx-1" />{Number(avgRating ?? 0).toFixed(1)}/5 ({ratings.length})</span>
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
                {book.isbn && (
                  <>
                    <div className="text-gray-500">رقم ISBN:</div>
                    <div className="text-gray-700">{book.isbn}</div>
                  </>
                )}
                {book.publisher && (
                  <>
                    <div className="text-gray-500">دار النشر:</div>
                    <div className="text-gray-700">{book.publisher}</div>
                  </>
                )}
                {book.publicationYear && (
                  <>
                    <div className="text-gray-500">سنة النشر:</div>
                    <div className="text-gray-700">{book.publicationYear}</div>
                  </>
                )}
                {book.pages && (
                  <>
                    <div className="text-gray-500">عدد الصفحات:</div>
                    <div className="text-gray-700">{book.pages}</div>
                  </>
                )}
                {book.fileFormat && (
                  <>
                    <div className="text-gray-500">الصيغة:</div>
                    <div className="text-gray-700">{book.fileFormat}</div>
                  </>
                )}
                {book.fileSize && (
                  <>
                    <div className="text-gray-500">حجم الملف:</div>
                    <div className="text-gray-700">{book.fileSize}</div>
                  </>
                )}
                {book.salesRank && (
                  <>
                    <div className="text-gray-500">ترتيب المبيعات:</div>
                    <div className="text-gray-700">{book.salesRank}</div>
                  </>
                )}
                
                {/* حقول إضافية للكتب الورقية */}
                {isPhysicalBook && book.translators && (
                  <>
                    <div className="text-gray-500">المترجمون:</div>
                    <div className="text-gray-700">{book.translators}</div>
                  </>
                )}
                {isPhysicalBook && book.coverType && (
                  <>
                    <div className="text-gray-500">نوع الغلاف:</div>
                    <div className="text-gray-700">{book.coverType}</div>
                  </>
                )}
                {isPhysicalBook && book.weight && (
                  <>
                    <div className="text-gray-500">الوزن:</div>
                    <div className="text-gray-700">{book.weight} كجم</div>
                  </>
                )}
                {isPhysicalBook && book.dimensions && (
                  <>
                    <div className="text-gray-500">الأبعاد:</div>
                    <div className="text-gray-700">
                      {book.dimensions.length} × {book.dimensions.width} × {book.dimensions.height} سم
                    </div>
                  </>
                )}
                {isPhysicalBook && book.originalLanguage && (
                  <>
                    <div className="text-gray-500">اللغة الأصلية:</div>
                    <div className="text-gray-700">{book.originalLanguage}</div>
                  </>
                )}
                {isPhysicalBook && book.translatedLanguage && (
                  <>
                    <div className="text-gray-500">اللغة المترجم إليها:</div>
                    <div className="text-gray-700">{book.translatedLanguage}</div>
                  </>
                )}
                {isPhysicalBook && book.readCount && (
                  <>
                    <div className="text-gray-500">مرات القراءة:</div>
                    <div className="text-gray-700">{book.readCount} مرة</div>
                  </>
                )}
                {isPhysicalBook && book.weight && (
                  <>
                    <div className="text-gray-500">الوزن:</div>
                    <div className="text-gray-700">{book.weight} كجم</div>
                  </>
                )}
                {isPhysicalBook && book.dimensions && (
                  <>
                    <div className="text-gray-500">الأبعاد:</div>
                    <div className="text-gray-700">
                      {book.dimensions.length} × {book.dimensions.width} × {book.dimensions.height} سم
                    </div>
                  </>
                )}
                
                {/* حقول إضافية للكتب الإلكترونية */}
                {isEbook && book.wordCount && (
                  <>
                    <div className="text-gray-500">عدد الكلمات:</div>
                    <div className="text-gray-700">{book.wordCount}</div>
                  </>
                )}
                
                {/* حقول إضافية للكتب الصوتية */}
                {isAudiobook && book.duration && (
                  <>
                    <div className="text-gray-500">مدة التشغيل:</div>
                    <div className="text-gray-700">{book.duration}</div>
                  </>
                )}
                {isAudiobook && book.narrator && (
                  <>
                    <div className="text-gray-500">القارئ:</div>
                    <div className="text-gray-700">{book.narrator}</div>
                  </>
                )}
                {isAudiobook && book.audioQuality && (
                  <>
                    <div className="text-gray-500">جودة الصوت:</div>
                    <div className="text-gray-700">{book.audioQuality}</div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">{authorDetails?.bio || 'لا توجد نبذة متوفرة.'}</p>
            )}
          </div>

        </motion.div>

        <motion.div
          className="order-3 lg:order-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sticky top-24 space-y-4 mx-auto">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <div className={`grid gap-2 ${hasBook && hasAudiobook ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {hasBook && (
                  <label className={`border rounded-md p-2 text-center cursor-pointer ${selectedFormat === 'book' ? 'ring-2 ring-blue-600' : ''}`}> 
                    <input
                      type="radio"
                      name="format"
                      value="book"
                      className="sr-only"
                      checked={selectedFormat === 'book'}
                      onChange={() => setSelectedFormat('book')}
                    />
                    <p className="text-sm font-medium mb-1">كتاب</p>
                    <p className="text-lg font-bold text-blue-600"><FormattedPrice value={displayPrice} /></p>
                    <p className="text-xs text-green-600">متوفر فوراً</p>
                  </label>
                )}
                {hasAudiobook && (
                  <label className={`border rounded-md p-2 text-center cursor-pointer ${selectedFormat === 'audio' ? 'ring-2 ring-blue-600' : ''}`}> 
                    <input
                      type="radio"
                      name="format"
                      value="audio"
                      className="sr-only"
                      checked={selectedFormat === 'audio'}
                      onChange={() => setSelectedFormat('audio')}
                    />
                    <p className="text-sm font-medium mb-1">كتاب صوتي</p>
                    <p className="text-lg font-bold">0 د.إ</p>
                    <p className="text-xs text-gray-600">مع عضوية</p>
                  </label>
                )}
              </div>
              <div className="flex justify-between items-end text-sm">
                <div>
                  {book.originalPrice && (
                    <span className="line-through text-red-500 mr-2 rtl:ml-2 rtl:mr-0"><FormattedPrice value={book.originalPrice} /></span>
                  )}
                  <div className="text-2xl font-bold text-blue-600"><FormattedPrice value={displayPrice} /></div>
                </div>
                {book.originalPrice && (
                  <div className="text-green-600">وفر <FormattedPrice value={book.originalPrice - book.price} /></div>
                )}
              </div>
              <div className="mb-3">
                <Button onClick={onAddToCart} disabled={!selectedFormat} className="w-full bg-blue-600 hover:bg-blue-700 h-9"><ShoppingCart className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />أضف إلى السلة</Button>
              </div>
              <Button variant="secondary" className="w-full mb-3">اشتري الان بنقرة واحدة</Button>
              <div className="flex justify-around text-sm text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChat({ type: 'seller', name: book.seller || book.author })}
                  className="px-2"
                >
                  <i className="fa-solid fa-comments text-blue-600 ml-2 rtl:mr-2 rtl:ml-0" />
                  دردش
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleWishlist}
                  className="px-2"
                >
                  <Heart
                    className={`w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-blue-600'
                      }`}
                  />
                  قائمة الرغبات
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: 'مشاركة',
                      description: '🚧 هذه الميزة غير مطبقة بعد',
                    })
                  }
                  className="px-2"
                >
                  <Share2 className="w-4 h-4 text-blue-600 ml-2 rtl:mr-2 rtl:ml-0" />
                  مشاركة
                </Button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      <div className="rounded-lg shadow-sm p-4 mt-4">
        {isLoggedIn && hasPurchased ? (
          <form onSubmit={handleRatingSubmit} className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="ratingValue" className="text-sm">قيم الكتاب</Label>
              <select
                id="ratingValue"
                value={ratingValue}
                onChange={(e) => setRatingValue(parseInt(e.target.value))}
                className="border rounded p-1"
                required
              >
                <option value="">اختر</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تعليقك"
              rows={2}
            />
            <Button type="submit" className="bg-blue-600 text-white">إرسال التقييم</Button>
          </form>
        ) : (
          <div className="mb-6 text-sm text-gray-600">
            {isLoggedIn ? 'يمكنك تقييم المنتج بعد شرائه.' : 'سجل الدخول وقم بشراء المنتج لتتمكن من التقييم.'}
          </div>
        )}
        <div className="space-y-6">
          {ratings.map((r) => (
            <div key={r.id} className="border-b pb-4">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://i.pravatar.cc/40" alt="user" className="w-10 h-10 rounded-full border" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{r.userId || r.user_id || 'مستخدم'}</p>
                  <p className="text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : (r.created_at ? new Date(r.created_at).toLocaleDateString() : '')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              {r.comment && <p className="text-sm text-gray-700 mb-3">{r.comment}</p>}
            </div>
          ))}
          {ratings.length === 0 && <p className="text-sm">لا توجد تقييمات بعد.</p>}
        </div>
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
