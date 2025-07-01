import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Award, Star, Play, Clock, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const AudiobookPage = () => {
  // Mock data
  const sampleBooks = [
    { id: 1, title: "بلسماً لأحزان", cover: "https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg" },
    { id: 2, title: "حارة الثعبان", cover: "https://darmolhimon.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-10.40.18-AM-300x450.jpeg" },
    { id: 3, title: "لا تحدث من السقيفة", cover: "https://darmolhimon.com/wp-content/uploads/2025/05/موج-300x428.jpeg" },
    { id: 4, title: "غزوفة البروكش", cover: "https://darmolhimon.com/wp-content/uploads/2024/08/قبل-ان-تختالر-الطب-300x454.jpeg" },
    { id: 5, title: "كن غريباً طيباً", cover: "https://darmolhimon.com/wp-content/uploads/2021/04/سشي-300x440.jpeg" },
    { id: 6, title: "رسائل من النبي", cover: "https://darmolhimon.com/wp-content/uploads/2022/06/photo_2022-06-06_14-49-17-300x443.jpg" },
    { id: 7, title: "السرخسيات المهجورة", cover: "https://darmolhimon.com/wp-content/uploads/2022/11/1-300x448.jpg" },
    { id: 8, title: "مائة عام من العزلة", cover: "https://darmolhimon.com/wp-content/uploads/2024/07/ريلا-في-انجلسايد-300x450.jpeg" },
    { id: 9, title: "انتقيطة", cover: "https://darmolhimon.com/wp-content/uploads/2022/01/be-stylish-with-lama-300x447.png" },
    { id: 10, title: "مذكرات من العالم القديم", cover: "https://darmolhimon.com/wp-content/uploads/2025/01/لا-تلتفت-إلى-الوراء-300x449.jpeg" },
    { id: 11, title: "بلى بالنجوم", cover: "https://darmolhimon.com/wp-content/uploads/2025/01/لا-تلتفت-إلى-الوراء-300x449.jpeg" },
    { id: 12, title: "في وجوه شاحبة", cover: "https://darmolhimon.com/wp-content/uploads/2025/01/لا-تلتفت-إلى-الوراء-300x449.jpeg" }
  ];

  const infiniteBooks = Array(15).fill(sampleBooks.slice(0, 10)).flat();

  const plans = [
    {
      id: 'basic',
      name: 'الأساسية',
      price: '$9.99',
      duration: 'شهرياً',
      features: [
        'كتب إلكترونية غير محدودة',
        'استماع محدود للكتب الصوتية (مثلاً: 1 ساعة شهرياً)',
        'وصول إلى مجموعات مختارة'
      ]
    },
    {
      id: 'pro',
      name: 'المحترفة',
      price: '$14.99',
      duration: 'شهرياً',
      popular: true,
      features: [
        'جميع المميزات المميزة',
        'كتب إلكترونية وصوتية غير محدودة',
        'تنزيل الكتب دون اتصال',
        'وصول إلى جميع المجموعات'
      ]
    },
    {
      id: 'family',
      name: 'العائلية',
      price: '$49.99',
      duration: 'شهرياً',
      features: [
        'مشاركة مع ٥ أفراد',
        'الرقابة الأبوية',
        'ملفات تعريف شخصية',
        'جميع مميزات الباقة المحترفة'
      ]
    }
  ];

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      {/* Main Book Cover positioned at the bottom right of its section */}


      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[500px] sm:h-[600px] overflow-hidden rounded-xl shadow-2xl bg-blue-950 text-white mt-8"
      >
        {/* Background Grid - Clear and visible book covers */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 p-6 opacity-100"> {/* Changed opacity to 100 */}
            {infiniteBooks.slice(0, 24).map((book, index) => (
              <div
                key={`bg-book-${book.id}-${index}`}
                className="aspect-square"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dark overlay to ensure text readability */}
        <div className="inset-0 bg-blue-950/80"></div>

        {/* Content - Text positioned on the right side at the bottom */}
        <div className="absolute bottom-0 right-0 p-6 sm:p-8 z-10 text-left rtl:text-right max-w-lg"> {/* Adjusted positioning and text alignment */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
            اختر باقة الاستماع المناسبة لك
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6">
            قصص بلا حدود، رواة خبراء، أينما كنت.
          </p>
          <button
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full shadow-lg text-base sm:text-lg px-6 py-3 transition-colors"
          >
            تجربة مجانية لمدة ٧ أيام
          </button>
          <p className="text-white/70 text-xs sm:text-sm mt-3">
            التجديد التلقائي - إلغِ في أي وقت
          </p>
        </div>
      </motion.section>
      <motion.div
        className="flex justify-end items-end w-full" /* Changed to justify-end and items-end */
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-48 h-64 sm:w-60 sm:h-80 flex-shrink-0 z-30 mb-[50px] md:mt-[-260px] mr-0 md:mr-16 lg:ml-24"> {/* Added negative margin-bottom and right margin for positioning */}
          <img
            src="https://darmolhimon.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-10.40.18-AM-300x450.jpeg"
            alt="روميليا والأسد"
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center cursor-pointer">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          {/* Button below the book cover */}
          <Button
            className="absolute -bottom-12 sm:-bottom-16 w-full py-3 rounded-xl font-medium transition-all duration-200 bg-[#E4E6FF] hover:bg-[#d6d8f2] text-[#315dfb] border border-[#E4E6FF] text-base sm:text-lg px-6 shadow-md"
        >
            تصفح الكتب الصوتية
          </Button>
        </div>
      </motion.div>
      <section className="mt-10 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">استمتع بقراءة واستماع غير محدودين</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
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
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-sm mr-1">{plan.duration}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-right">
                      <Check className="w-4 h-4 text-blue-500 mt-0.5 ml-2 rtl:mr-2 rtl:ml-0 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-5">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                      : 'bg-[#E4E6FF] hover:bg-[#d6d8f2] text-[#315dfb] border border-[#E4E6FF]'
                  }`}
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
          <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12">
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              {sampleBooks.slice(0, 4).map((book, index) => (
                <motion.div
                  key={book.id}
                  className="relative group cursor-pointer aspect-square" // Added aspect-square here
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
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
                </motion.div>
              ))}
            </div>
<div className="md:w-1/2 text-right" dir="rtl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">قصص مختارة بعناية</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                تابع مؤلفات أو رواة في مسلسلاتك المفضلة، واحصل على توصيات
                مخصصة بناء على ما استمعت إليه سابقاً.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-base py-3 px-8 shadow-lg hover:shadow-xl rounded-lg transition-all">
                تجربة مجانية لمدة ٧ أيام
              </button>
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
                  className="w-full h-auto object-cover rounded-lg shadow-lg aspect-square" // Added aspect-square here
                  src={book.cover}
                  alt={book.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                />
              ))}
            </div>

<div className="md:w-1/2 text-right" dir="rtl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">في أي وقت، وفي أي مكان.</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                استمع إلى الكتب الصوتية المفضلة لديك أينما كنت. قم بتنزيل كتبك للاستماع إليها دون اتصال بالإنترنت.
              </p>
              <Button className="bg-[#E4E6FF] hover:bg-[#d6d8f2] text-[#315dfb] border border-[#E4E6FF] text-base px-8 py-3 rounded-xl font-medium shadow-md transition-all">
                تصفح الكتب الصوتية
              </Button>
            </div>
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