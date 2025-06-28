  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { Button } from '@/components/ui/button.jsx';
  import { toast } from '@/components/ui/use-toast.js';
  import { BookCard } from '@/components/FlashSaleSection.jsx';
  import { Check, Award, Star, Play, Clock, Headphones } from 'lucide-react';

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
        id: 'basic',
        name: 'الأساسية',
        price: '$9.99',
        duration: 'شهرياً',
        color: 'bg-white text-gray-800 border-gray-200',
        buttonColor: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
        features: [
          'كتب إلكترونية غير محدودة',
          'استماع محدود للكتب الصوتية (مثلاً: 1 ساعة شهرياً)',
          'وصول إلى مجموعات مختارة'
        ],
        message: 'تم اختيار الباقة الأساسية!'
      },
      {
        id: 'pro',
        name: 'المحترفة',
        price: '$14.99',
        duration: 'شهرياً',
        popular: true,
        color: 'bg-white text-gray-800 border-blue-600', // Changed background to white, border to blue
        buttonColor: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg', // Button remains blue
        features: [
          'جميع المميزات المميزة',
          'كتب إلكترونية وصوتية غير محدودة',
          'تنزيل الكتب دون اتصال',
          'وصول إلى جميع المجموعات'
        ],
        message: 'تم اختيار الباقة المحترفة!'
      },
      {
        id: 'family',
        name: 'العائلية',
        price: '$49.99',
        duration: 'شهرياً',
        color: 'bg-white text-gray-800 border-gray-200',
        buttonColor: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
        features: [
          'مشاركة مع ٥ أفراد',
          'الرقابة الأبوية',
          'ملفات تعريف شخصية',
          'جميع مميزات الباقة المحترفة'
        ],
        message: 'تم اختيار الباقة العائلية!'
      }
    ];

    // Sample book covers for the hero background grid and featured stories
    const sampleBooks = [
      { id: 1, title: "بلسماً لأحزان", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-1.jpg" },
      { id: 2, title: "حارة الثعبان", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-2.jpg" },
      { id: 3, title: "لا تحدث من السقيفة", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-3.jpg" },
      { id: 4, title: "غزوفة البروكش", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-4.jpg" },
      { id: 5, title: "كن غريباً طيباً", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-5.jpg" },
      { id: 6, title: "رسائل من النبي", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-6.jpg" },
      { id: 7, title: "السرخسيات المهجورة", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-7.jpg" },
      { id: 8, title: "مائة عام من العزلة", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-8.jpg" },
      { id: 9, title: "انتقيطة", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-9.jpg" },
      { id: 10, title: "مذكرات من العالم القديم", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-10.jpg" },
      { id: 11, title: "بلى بالنجوم", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-11.jpg" },
      { id: 12, title: "في وجوه شاحبة", cover: "https://darmolhimon.com/wp-content/uploads/2025/06/audiobook-cover-12.jpg" }
    ];

    return (
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[500px] sm:h-[600px] overflow-hidden rounded-xl shadow-2xl text-white"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 sm:p-6 opacity-40">
            {sampleBooks.slice(0, 10).map((book, index) => (
              <img
                key={`bg-book-${book.id}-${index}`}
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover rounded-md"
              />
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-purple-950 opacity-90"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 z-10">
            {/* Book Image and Small Audiobook Samples (Left side) */}
            <div className="flex flex-col items-center md:items-start flex-shrink-0 md:ml-10">
              <motion.div
                className="relative w-48 h-64 -mb-10 sm:-mb-16 rounded-lg shadow-xl"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <img
                  src="https://darmolhimon.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-10.40.18-AM-300x450.jpeg"
                  alt="روميليا والأسد"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
              
            </div>

            {/* Text and Button Section (Right side) */}
            <div className="text-center md:text-right rtl:md:text-left max-w-lg md:max-w-md md:mr-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight text-shadow-lg">
                اختر باقة الاستماع المناسبة لك
              </h1>
              <p className="text-lg sm:text-xl text-white-100 mb-6 mx-auto md:mx-0 rtl:md:ml-auto rtl:md:mr-0">
                قصص بلا حدود، رواة خبراء، أينما كنت.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 rounded-full shadow-lg text-base sm:text-lg px-6 py-3"
                onClick={() => handleFeatureClick('free-trial-7-days')}
              >
                تجربة مجانية لمدة ٧ أيام
              </Button>
              <p className="text-white-200 text-xs sm:text-sm mt-3">
                التجديد التلقائي - إلغِ في أي وقت
              </p>
            </div>
          </div>
        </motion.section>

        <section className="mt-10 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">استمتع بقراءة واستماع غير محدودين</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden flex flex-col items-center text-center transition-all duration-300 ${
                  plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    الأكثر شيوعاً
                  </div>
                )}

                <div className={`p-6 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.subtitle}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 text-sm mr-1">{plan.duration}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6 text-right">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5 ml-2 rtl:mr-2 rtl:ml-0 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-5">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                      plan.popular
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                    }`}
                    onClick={() => toast({ title: plan.message })}
                  >
                    اختر باقتك
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-white py-12 rounded-2xl">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12"> {/* Reversed order */}
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                {sampleBooks.slice(0, 4).map((book, index) => (
                  <motion.div
                    key={book.id}
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="aspect-[3/4] relative">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="md:w-1/2 text-center md:text-right rtl:md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">قصص مختارة بعناية</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  تابع مؤلفات أو رواة في مسلسلاتك المفضلة، واحصل على توصيات
                  مخصصة بناء على ما استمعت إليه سابقاً.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base py-3 px-8 shadow-lg hover:shadow-xl rounded-lg"
                  onClick={() => handleFeatureClick('free-trial-7-days')}
                >
                  تجربة مجانية لمدة ٧ أيام
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12 rounded-2xl mt-12">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                {sampleBooks.slice(4, 8).map((book, index) => (
                  <motion.img
                    key={book.id}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                    src={book.cover}
                    alt={book.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  />
                ))}
              </div>

              <div className="md:w-1/2 text-center md:text-right rtl:md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">في أي وقت، وفي أي مكان.</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  استمع إلى الكتب الصوتية المفضلة لديك أينما كنت. قم بتنزيل كتبك للاستماع إليها دون اتصال بالإنترنت.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base py-3 px-8 shadow-lg hover:shadow-xl rounded-lg"
                  onClick={() => handleFeatureClick('browse-audiobooks')}
                >
                  تصفح الكتب الصوتية
                </Button>
              </div>
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
              {audiobooks.slice(0, 6).map((book, index) => (
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
              {audiobooks.slice(6, 12).map((book, index) => (
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

        <section className="mt-12 bg-gray-100 py-12 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-sm text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Headphones className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">مكتبة فاخرة</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                آلاف الكتب التي تشمل الكتب العالمية والعربية مع
                أكثر من 500,000 كتاب مصوّر أو كتاب صوتي عالي الجودة
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-sm text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">بيئة آمنة للأطفال</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                بيئة آمنة مصممة خصيصاً للأطفال - معايير آمنة في البحث والتصفح -
                تطبيق منفصل للأطفال ضمان أمان البيانات
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-sm text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">أعمال دارملهمون الأصلية</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                احصل على إصدارات حصرية لأعمال جديدة للمؤلفين والمبدعين، مصممة خصيصاً لمنصة دار الهيمون
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    );
  };

  export default AudiobookPage;