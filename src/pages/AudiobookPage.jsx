import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import { Check, Award, Star } from 'lucide-react';

const AudiobookPage = ({ books, authors, handleAddToCart, handleToggleWishlist, wishlist, handleFeatureClick }) => {
  const [localWishlist, setLocalWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  useEffect(() => {
    setLocalWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  }, [wishlist]);

  const onToggleWishlist = (book) => {
    handleToggleWishlist(book);
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setLocalWishlist(stored);
  };

  const audiobooks = books.filter(book => book.type === 'audiobook' || book.id % 2 === 0);

  const plans = [
    {
      name: 'الأساسية',
      price: '$9.99',
      features: ['وصول غير محدود', 'محتوى جديد أسبوعياً', 'إلغاء في أي وقت']
    },
    {
      name: 'العائلية',
      price: '$14.99',
      popular: true,
      features: ['كل مميزات الأساسية', 'حتى 5 حسابات', 'مزامنة عبر الأجهزة']
    },
    {
      name: 'السنوية',
      price: '$99.99',
      features: ['أفضل قيمة', 'دفع واحد سنوياً', 'خصم 20%']
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">أختر باقة الاستماع المناسبة لك</h1>
          <p className="text-blue-100 text-sm sm:text-base mb-6 mx-auto md:mx-0 rtl:md:ml-auto rtl:md:mr-0">
قصص بلا حدود، رواة خبراء، أينما كنت.          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full shadow-lg"
            onClick={() => handleFeatureClick('free-trial-7-days')}
          >
تجربة مجانية لمدة ٧ أيام          </Button>
        </div>
        <img
          alt="غلاف كتاب ما تبقى من البقايا"
          className="w-48 h-auto rounded-lg shadow-xl mt-6 md:mt-0 md:mr-6 rtl:md:ml-6 rtl:md:mr-0"
          src="https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg"
        />
      </motion.section>

      <section className="mt-10 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">استمتع بقراءة واستماع غير محدودين</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center relative ${plan.popular ? 'border-2 border-blue-600' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {plan.popular && (
                <span className="absolute -top-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">الأكثر شعبية</span>
              )}
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
                onClick={() => toast({ title: `اخترت الباقة ${plan.name}!` })}
              >
                اختر هذه الباقة
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-inner text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">قصص مختارة بعناية</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">استمتع بقصصنا الصوتية الأكثر مبيعًا، وقصص الدراما والحركة، وأكثر من 2000 قصة ورواية.</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-base py-3 px-8 shadow-lg hover:shadow-xl"
            onClick={() => handleFeatureClick('browse-all-stories')}
          >
            تصفح جميع القصص
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[1,2,3].map((n,i) => (
              <motion.img
                key={n}
                className="w-full h-40 object-cover rounded-lg"
                src={`https://source.unsplash.com/random/300x30${n}?book`}
                alt={`غلاف قصة صوتية ${n}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
          <div className="flex space-x-3 rtl:space-x-reverse">
            {[1,2].map((n,i) => (
              <motion.img
                key={n}
                className="w-40 h-40 object-cover rounded-full shadow-lg"
                src={`https://source.unsplash.com/random/200x20${n}?listener`}
                alt="مستمع لكتاب صوتي"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </div>
          <div className="text-center md:text-right rtl:md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">في أي وقت. وفي أي مكان.</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">استمع إلى الكتب الصوتية المفضلة لديك أينما كنت. قم بتنزيل كتبك للاستماع إليها دون اتصال بالإنترنت.</p>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white text-base py-3 px-8 shadow-lg hover:shadow-xl"
              onClick={() => handleFeatureClick('browse-audiobooks')}
            >
              تصفح الكتب الصوتية
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-slate-100 rounded-xl mb-8 sm:mb-10 mt-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">الكتب الصوتية الأكثر مبيعًا</h2>
            </div>
            <Link to="/category/audiobook-bestseller">
              <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm px-2 py-1 h-auto rounded-md">
                شاهد المزيد
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {audiobooks.slice(0,6).map((book, index) => (
              <BookCard
                key={`${book.id}-${index}-bestsell`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={onToggleWishlist}
                index={index}
                isInWishlist={localWishlist?.some(item => item.id === book.id)}
                authors={authors}
                square={true}
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
            <Link to="/category/molhimon-originals">
              <Button className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm px-2 py-1 h-auto rounded-md">
                شاهد المزيد
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {audiobooks.slice(6,12).map((book, index) => (
              <BookCard
                key={`${book.id}-${index}-orig`}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={onToggleWishlist}
                index={index}
                isInWishlist={localWishlist?.some(item => item.id === book.id)}
                authors={authors}
                square={true}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AudiobookPage;
