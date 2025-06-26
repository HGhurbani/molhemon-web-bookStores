import React, { useState, useEffect } from 'react';
import { Check, Award, Star, Play, Clock, Headphones } from 'lucide-react';

// Simple Button component replacement
const Button = ({ children, className, onClick, ...props }) => (
  <button
    className={`px-4 py-2 rounded font-medium transition-colors ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const AudiobookPage = () => {
  const books = [];
  const authors = [];
  const wishlist = [];
  const handleAddToCart = () => {};
  const handleToggleWishlist = () => {};
  const handleFeatureClick = (feature) => {
    console.log('Feature clicked:', feature);
  };
  const [localWishlist, setLocalWishlist] = useState(() => {
    // Using in-memory storage instead of localStorage
    return wishlist || [];
  });

  useEffect(() => {
    setLocalWishlist(wishlist || []);
  }, [wishlist]);

  const onToggleWishlist = (book) => {
    handleToggleWishlist(book);
    setLocalWishlist(prev => {
      const isInWishlist = prev.some(item => item.id === book.id);
      if (isInWishlist) {
        return prev.filter(item => item.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const audiobooks = books?.filter(book => book.type === 'audiobook' || book.id % 2 === 0) || [];

  // Sample book covers for the grid
  const sampleBooks = [
    { id: 1, title: "بلسماً لأحزان", cover: "https://source.unsplash.com/200x300?book1" },
    { id: 2, title: "حارة الثعبان", cover: "https://source.unsplash.com/200x300?book2" },
    { id: 3, title: "لا تحدث من السقيفة", cover: "https://source.unsplash.com/200x300?book3" },
    { id: 4, title: "غزوفة البروكش", cover: "https://source.unsplash.com/200x300?book4" },
    { id: 5, title: "كن غريباً طيباً", cover: "https://source.unsplash.com/200x300?book5" },
    { id: 6, title: "رسائل من النبي", cover: "https://source.unsplash.com/200x300?book6" },
    { id: 7, title: "السرخسيات المهجورة", cover: "https://source.unsplash.com/200x300?book7" },
    { id: 8, title: "مائة عام من العزلة", cover: "https://source.unsplash.com/200x300?book8" },
    { id: 9, title: "انتقيطة", cover: "https://source.unsplash.com/200x300?book9" },
    { id: 10, title: "مذكرات من العالم القديم", cover: "https://source.unsplash.com/200x300?book10" },
    { id: 11, title: "بلى بالنجوم", cover: "https://source.unsplash.com/200x300?book11" },
    { id: 12, title: "في وجوه شاحبة", cover: "https://source.unsplash.com/200x300?book12" }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'الأساسية',
      price: '$9.99',
      duration: 'شهرياً',
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      features: [
        'كتب إلكترونية غير محدودة', 
        'استماع محدود للكتب الصوتية', 
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
      color: 'bg-blue-500 text-white',
      buttonColor: 'bg-white text-blue-500 hover:bg-gray-100',
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
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      features: [
        'مشاركة مع ٥ أفراد',
        'الرقابة الأبوية', 
        'ملفات تعريف شخصية',
        'جميع مميزات الباقة المحترفة'
      ],
      message: 'تم اختيار الباقة العائلية!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header Section with Book Grid */}
      <div className="relative">
        {/* Book Grid Background */}
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2 p-6 opacity-60">
          {sampleBooks.map((book, index) => (
            <div key={book.id} className="aspect-[3/4] relative group">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-48 h-64 relative">
                  <img
                    src="https://source.unsplash.com/300x400?fairy-tale-book"
                    alt="روميليا والأسد"
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-4">أختر باقة الاستماع المناسبة لك</h1>
                  <p className="text-xl text-blue-200 mb-6">قصص بلا حدود، رواة خبراء، أينما كنت.</p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
                    onClick={() => handleFeatureClick('free-trial-7-days')}
                  >
                    تجربة مجانية لمدة ٧ أيام
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Section with Subscription Plans */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">استمتع بقراءة واستماع غير محدودين</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Headphones className="w-6 h-6" />
              <span>التجديد التلقائي - إلغ 99.5 شهرياً</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">إلغاء مجاني في أي وقت</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`${plan.color} p-8 rounded-2xl shadow-xl relative ${plan.popular ? 'ring-4 ring-white/50 scale-105' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm">
                      الأكثر شيوعاً
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">{plan.price}</div>
                  <div className="opacity-80">{plan.duration}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.buttonColor}`}
                  onClick={() => console.log(plan.message)}
                >
                  اختر باقتك
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Stories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">قصص مختارة بعناية</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              تابع مؤلفات أو رواة في مسلسلاتك المفضلة، واحصل على توصيات
              مخصصة بناء على ما استمعت إليه سابقاً.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
              onClick={() => handleFeatureClick('free-trial-7-days')}
            >
              تجربة مجانية لمدة ٧ أيام
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sampleBooks.slice(0, 4).map((book, index) => (
              <motion.div
                key={book.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
        </div>
      </div>

      {/* Anywhere, Anytime Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                {sampleBooks.slice(4, 8).map((book, index) => (
                  <motion.div
                    key={book.id}
                    className="aspect-[3/4] relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2 text-center md:text-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">في أي وقت، وفي أي مكان</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                تنقل بسلاسة بين قراءة الكتب الإلكترونية والاستماع إلى الكتب الصوتية.
                مثالية في أي نشاط من روتينك اليومي.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">التجديد التلقائي - إلغ 99.5 شهرياً</div>
                  <div className="text-sm text-gray-500">إلغاء مجاني في أي وقت</div>
                </div>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
                onClick={() => handleFeatureClick('free-trial-7-days')}
              >
                تجربة مجانية لمدة ٧ أيام
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">مكتبة فاخرة</h3>
              <p className="text-gray-600">
                آلاف الكتب التي تشمل الكتب العالمية والعربية مع
                أكثر من 500,000 كتاب مصوّر أو كتاب صوتي عالي الجودة
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">بيئة آمنة للأطفال</h3>
              <p className="text-gray-600">
                بيئة آمنة مصممة خصيصاً للأطفال - معايير آمنة في البحث والتصفح -
                تطبيق منفصل للأطفال ضمان أمان البيانات
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">أعمال داريونفون الأصلية</h3>
              <p className="text-gray-600">
                احصل على إصدارات حصرية لأعمال جديدة للمؤلفين والمبدعين، مصممة خصيصاً لمنصة دار الهيمون
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudiobookPage;