import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return <section className="h-[350px] md:h-[450px] bg-gray-200 flex items-center justify-center"><p>لا توجد شرائح لعرضها.</p></section>;
  }

  const currentSlide = slides[currentIndex];

  return (
    <>
    <section className="hero-section h-[350px] md:h-[450px] text-white relative overflow-hidden bg-slate-200">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, x: currentIndex % 2 === 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: currentIndex % 2 === 0 ? -100 : 100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img  
            alt={currentSlide.alt} 
            className="w-full h-full object-cover"
           src="https://darmolhimon.com/wp-content/uploads/2025/06/image-1264-1.png" />
          <div className="absolute inset-0 bg-black/30"></div>
        </motion.div>
      </AnimatePresence>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
          <motion.div
            key={`text-${currentSlide.id}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className={`max-w-lg md:max-w-xl ${currentSlide.discount ? 'mr-auto text-left rtl:ml-auto rtl:text-right' : 'ml-auto text-right rtl:mr-auto rtl:text-left'}`}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-shadow-lg">
              {currentSlide.titleLine1}
              <br />
              {currentSlide.titleLine2}
            </h1>
            {currentSlide.discount && (
              <div className="relative inline-block my-2">
                <div className="absolute -inset-1 sm:-inset-2 transform -rotate-2 bg-red-500 rounded-md"></div>
                <span className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white px-1.5 py-0.5">{currentSlide.discount} <span className="text-lg sm:text-xl">خصم</span></span>
              </div>
            )}
            {!currentSlide.discount && currentSlide.description && (
                <p className="text-sm sm:text-base mb-5 sm:mb-6 opacity-90 max-w-md">
                    {currentSlide.description}
                </p>
            )}
          </motion.div>
      </div>

      <button 
        onClick={prevSlide} 
        aria-label="الشريحة السابقة"
        className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-1.5 sm:p-2 rounded-full z-20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button 
        onClick={nextSlide} 
        aria-label="الشريحة التالية"
        className="absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-1.5 sm:p-2 rounded-full z-20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

    </section>
      <div className="flex justify-center mt-2 space-x-1.5 rtl:space-x-reverse">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ease-in-out ${currentIndex === index ? 'bg-blue-500 w-5 sm:w-6' : 'bg-white/50 hover:bg-white/70'}`}
          ></button>
        ))}
      </div>
    </>
  );

};

export default HeroSection;
