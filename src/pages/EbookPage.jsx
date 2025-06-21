import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast.js';
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

  const ebooks = books.filter(book => book.format === 'كتاب إلكتروني' || book.type === 'ebook' || book.category === 'ebooks');

  const plans = [
    {
      name: 'الأساسية',
      price: '$9.99',
      features: ['الكتب الإلكترونية غير محدودة', '1 ساعة شهرياً', 'الوصول إلى مجموعات مختارة'],
      message: 'تم اختيار الباقة الأساسية!'
    },
    {
      name: 'المحترفة',
      price: '$14.99',
      features: ['الكتب الإلكترونية غير محدودة', 'غير محدودة ساعة استماع', 'وصول لمجموعات مختارة', 'تنزيل الكتب دون اتصال'],
      message: 'تم اختيار الباقة المحترفة!'
    },
    {
      name: 'العائلية',
      price: '$49.99',
      features: ['كتب إلكترونية', 'مشاركة مع ما يصل إلى ٥ أفراد', 'كتب ومقالات', 'فئات وميزات حصرية'],
      message: 'تم اختيار الباقة العائلية!'
    }
  ];

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between text-white"
      >
        <div className="text-center md:text-right rtl:md:text-left max-w-lg md:max-w-md">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">اكتشف أكثر من ٧٠٠٠٠ كتاب إلكتروني</h1>
          <p className="text-lg sm:text-xl mb-1">نحن باقة القراءة المناسبة لك</p>
          <p className="text-blue-100 text-sm sm:text-base mb-6">اكتشف آلاف الكتب من الأطفال، إلى %٥٠ خصم وأكثر في أي وقت</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full shadow-lg"
            onClick={() => handleFeatureClick ? handleFeatureClick('free-ebook-trial') : toast({ title: 'تم اختيار التجربة المجانية!' })}
          >
            تجربة مجانية لمدة ٧ أيام
          </Button>
        </div>
        <img
          alt="فتاة تقرأ كتاباً إلكترونياً على جهاز لوحي"
          className="w-48 h-auto rounded-lg shadow-xl mt-6 md:mt-0 md:mr-6 rtl:md:ml-6 rtl:md:mr-0"
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=260&q=80"
        />
      </motion.section>

      <section className="mt-10 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">استمتع بقراءة واستماع غير محدودين</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <p className="text-blue-600 font-bold mb-4">{plan.price}</p>
              <ul className="space-y-2 mb-4 w-full text-right">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 ml-2 rtl:mr-2 rtl:ml-0" />
                    <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => toast({ title: plan.message })}
              >
                اختر هذه الباقة
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

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2">أعمال دارملهمون الأصلية</h3>
          <p className="text-gray-600 text-sm mb-4">اكتشف أعمالنا الأصلية التي كتبها مؤلفو دار ملهمون حصرياً، تصفح جميع أعمالهم.</p>
          <Button onClick={() => handleFeatureClick && handleFeatureClick('browse-molhimon-originals')} className="bg-blue-600 hover:bg-blue-700 text-white">
            تصفح أعمالنا
          </Button>
        </motion.div>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-2">بيئة آمنة للأطفال</h3>
          <p className="text-gray-600 text-sm mb-4">بنية أمنة ومفيدة للأطفال، يمكنك التحكم بالمحتوى وتصفح الكتب باأمان مع أطفالك.</p>
          <Button onClick={() => handleFeatureClick && handleFeatureClick('discover-kids-plans')} className="bg-blue-600 hover:bg-blue-700 text-white">
            اكتشف باقاتنا
          </Button>
        </motion.div>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2">مكتبة ٣٦٥</h3>
          <p className="text-gray-600 text-sm mb-4">أكبر مكتبة في جيبك، أكثر من ٦٠٠٠٠ كتاب إلكتروني، استمتع بكتبك المفضلة يومياً.</p>
          <Button onClick={() => handleFeatureClick && handleFeatureClick('start-evaluation')} className="bg-blue-600 hover:bg-blue-700 text-white">
            ابدأ تقييمك
          </Button>
        </motion.div>
      </section>
    </main>
  );
};

export default EbookPage;
