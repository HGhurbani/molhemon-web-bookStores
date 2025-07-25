import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast.js';
import api from '@/lib/api.js';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import { Check, Award, Star } from 'lucide-react';

const EbookPage = ({ books, authors, handleAddToCart, handleToggleWishlist, wishlist, handleFeatureClick }) => {
  const [localWishlist, setLocalWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  useEffect(() => {
    setLocalWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  }, [wishlist]);

  const onToggleWishlist = (book) => {
    handleToggleWishlist(book);
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setLocalWishlist(stored);
  };

  const ebooks = books.filter(
    (book) =>
      book.format === 'كتاب إلكتروني' || book.type === 'ebook' || book.category === 'ebooks'
  );

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setPlans(await api.getPlans({ type: 'package', packageType: 'ebook' }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundImage: "url('https://i.ibb.co/3Y7PkFH7/image-1318.png')" }}
        className="relative p-6 sm:p-8 rounded-xl shadow-2xl flex items-center text-white overflow-hidden"
      >
        <div className="absolute inset-0 z-0" />
        
        {/* SVG لتطبيق المنحنى المطلوب باللون الجديد #9774FF */}
        <svg
          className="absolute inset-y-0 right-0 w-full md:w-1/2 z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path 
            d="M 0 0 C 40 0, 40 100, 0 100 L 100 100 L 100 0 Z" 
            fill="#9774FF" // تم تغيير اللون هنا
          />
        </svg>

        <div className="relative z-20 p-6 sm:p-8 text-center md:text-right max-w-lg md:max-w-md">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">اكتشف أكثر من ٧٠٠٠٠ كتاب إلكتروني</h1>
          <p className="text-lg sm:text-xl mb-1">نحن باقة القراءة المناسبة لك</p>
          <p className="text-white-100 text-sm sm:text-base mb-6">اكتشف آلاف الكتب من الأطفال، إلى %٥٠ خصم وأكثر في أي وقت</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full shadow-lg"
            onClick={() => handleFeatureClick ? handleFeatureClick('free-ebook-trial') : toast({ title: 'تم اختيار التجربة المجانية!' })}
          >
            تجربة مجانية لمدة ٧ أيام
          </Button>
        </div>

      </motion.section>

      <section className="mt-10 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">استمتع بقراءة واستماع غير محدودين</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg border p-6 ${plan.featured ? 'border-orange-400' : 'border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plan.name}
                  {plan.featured && (
                    <span className="ml-2 rtl:mr-2 text-xs text-orange-600 font-semibold">الأكثر شيوعاً</span>
                  )}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 text-sm mr-1">{plan.duration} يوم</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-6 text-center" dangerouslySetInnerHTML={{ __html: plan.description }} />
              <Button className="w-full bg-[#E4E6FF] hover:bg-[#d6d8f2] text-[#315dfb] border border-[#E4E6FF]" onClick={() => toast({ title: `تم اختيار ${plan.name}` })}>
                اختر باقتك
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-slate-100 rounded-xl mt-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">الكتب الإلكترونية الأكثر مبيعاً</h2>
            </div>
            <Link to="/category/ebook-bestseller">
              <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm px-2 py-1 h-auto rounded-md">
                شاهد المزيد
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {ebooks.slice(0,6).map((book, index) => (
              <BookCard
                key={`${book.id}-${index}-ebook`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={onToggleWishlist}
                index={index}
                isInWishlist={localWishlist?.some(item => item.id === book.id)}
                authors={authors}
                square={false}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-white rounded-xl">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">دار ملهمون أوريجينالز</h2>
            </div>
            <Link to="/category/molhimon-ebook-originals">
              <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm px-2 py-1 h-auto rounded-md">
                شاهد المزيد
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {ebooks.slice(6,12).map((book, index) => (
              <BookCard
                key={`${book.id}-${index}-orig`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={onToggleWishlist}
                index={index}
                isInWishlist={localWishlist?.some(item => item.id === book.id)}
                authors={authors}
                square={false}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 bg-gray-100 py-12 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-start mb-6">
              <Check className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">أعمال دارملهمون الأصلية</h3>
            <p className="text-gray-600 text-sm leading-relaxed">اكتشف محتوى حصرياً مؤلفاً خصيصاً من دار ملهمون. محتوى شيق ومصمم خصيصاً لقُرّاء الموهوبين.</p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-start mb-6">
              <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">بيئة آمنة للأطفال</h3>
            <p className="text-gray-600 text-sm leading-relaxed">دع أطفالك يستكشف المغامرات في وضع الأطفال - مكان آمن مع كتب الأطفال فقط لديا ما يناسبهم جميعاً.</p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex justify-start mb-6">
              <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="7" y="2" width="10" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">مكتبة لا تنتهي</h3>
            <p className="text-gray-600 text-sm leading-relaxed">أكثر من 700,000 كتاب - بشتى لغات، اعتل من قبلك العالمية واستمتع بها أو اكتشف منها حكيراً.</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default EbookPage;