
import { BookOpen, Users, TrendingUp, Award, Headphones, Smartphone, Gift, Menu, DollarSign, Eye, Truck, Briefcase, Zap, Search as SearchIcon, Heart } from 'lucide-react';

export const heroSlides = [
  {
    id: 1,
    titleLine1: null,
    titleLine2: null,
    imgPlaceholder: null,
    alt: null,
    discount: null,
    description: null,
  },
  {
    id: 2,
    titleLine1: null,
    titleLine2: null,
    imgPlaceholder: null,
    alt: null,
    discount: null,
    description: null,
  },
  {
    id: 3,
    titleLine1: null,
    titleLine2: null,
    imgPlaceholder: null,
    alt: null,
    discount: null,
    description: null,
  },
];



export const categories = [
  { id: 'books', name: 'الكتب', icon: 'BookOpen' },
  { id: 'fiction', name: 'الخيال', icon: 'BookOpen' },
  { id: 'nonfiction', name: 'غير الخيال', icon: 'BookOpen' },
  { id: 'ebooks', name: 'إلكترونية', icon: 'Smartphone' },
  { id: 'audiobooks', name: 'صوتية', icon: 'Headphones' },
  { id: 'teen', name: 'المراهقين', icon: 'Users' },
  { id: 'kids', name: 'الأطفال', icon: 'Gift' },
  { id: 'trending', name: 'رائجة', icon: 'TrendingUp'},
  { id: 'deals', name: 'العروض', icon: 'DollarSign' },
  { id: 'bestseller', name: 'الأكثر مبيعاً', icon: 'Award' },
  { id: 'etc1', name: 'إلخ', icon: 'Menu' },
  { id: 'etc2', name: 'إلخ', icon: 'Menu' }
];

export const books = [
  {
    id: 1,
    title: 'عمرنا الآن ستة',
    author: 'ليلي ويليامز',
    authorId: 1,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.4,
    reviews: 296,
    category: 'kids',
    imgPlaceholder: 'غلاف كتاب عمرنا الآن ستة لأطفال مرسومين',
    description: 'مجموعة قصصية ساحرة تأخذ الأطفال في رحلة خيالية مليئة بالمغامرات والشخصيات المحببة. تعلمهم قيم الصداقة والشجاعة وحب الاستكشاف.',
    isbn: '978-3-16-148410-0',
    publisher: 'دار الفراشة للنشر',
    publishDate: '2023-05-15',
    pages: 120,
    format: 'غلاف ورقي',
    coverImage: '',
    type: 'physical',
    deliveryMethod: 'شحن عادي',
    sampleAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ''
  },
  {
    id: 2,
    title: 'أحاديث داخلية',
    author: 'دينا خوجة',
    authorId: 4,
    price: 60.00,
    prices: { AED: 60.00, SAR: 60.00 },
    originalPrice: 75.00,
    rating: 4.8,
    reviews: 350,
    category: 'nonfiction',
    imgPlaceholder: 'غلاف كتاب أحاديث داخلية رسم خطي لوجه امرأة',
    description: 'كتاب تأملي عميق يستكشف خبايا النفس البشرية والعلاقات الإنسانية. تقدم الكاتبة رؤى ملهمة حول كيفية تحقيق التوازن الداخلي والسلام النفسي.',
    isbn: '978-1-23-456789-7',
    publisher: 'دار الحكمة للنشر',
    publishDate: '2024-01-20',
    pages: 250,
    format: 'غلاف مقوى',
    coverImage: '',
    type: 'physical',
    deliveryMethod: 'توصيل سريع',
    tags: ''
  },
  {
    id: 3,
    title: 'ما تبقى من البقايا',
    author: 'كلارك كينت',
    authorId: 3,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.2,
    reviews: 180,
    category: 'fiction',
    imgPlaceholder: 'غلاف كتاب ما تبقى من البقايا مع تدرجات بنية',
    description: 'رواية مثيرة تدور أحداثها في عالم ما بعد الكارثة، حيث يكافح الناجون من أجل البقاء وإعادة بناء الحضارة. مليئة بالتشويق والمفاجآت.',
    isbn: '978-0-98-765432-1',
    publisher: 'مكتبة المستقبل',
    publishDate: '2022-11-01',
    pages: 320,
    format: 'كتاب إلكتروني',
    coverImage: '',
    type: 'ebook',
    ebookFile: '',
    tags: ''
  },
   {
    id: 4,
    title: 'عمرنا الآن ستة (مكرر)',
    author: 'ليلي ويليامز',
    authorId: 1,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.4,
    reviews: 296,
    category: 'kids',
    imgPlaceholder: 'غلاف كتاب عمرنا الآن ستة بتصميم مختلف',
    description: 'وصف مكرر لكتاب عمرنا الآن ستة.',
    isbn: '978-3-16-148410-1',
    publisher: 'دار الفراشة للنشر',
    publishDate: '2023-05-15',
    pages: 120,
    format: 'غلاف ورقي',
    coverImage: '',
    type: 'physical',
    tags: ''
  },
  {
    id: 5,
    title: 'أحاديث داخلية (مكرر)',
    author: 'دينا خوجة',
    authorId: 4,
    price: 60.00,
    prices: { AED: 60.00, SAR: 60.00 },
    originalPrice: 75.00,
    rating: 4.8,
    reviews: 350,
    category: 'nonfiction',
    imgPlaceholder: 'غلاف كتاب أحاديث داخلية بتصميم مختلف',
    description: 'وصف مكرر لكتاب أحاديث داخلية.',
    isbn: '978-1-23-456789-8',
    publisher: 'دار الحكمة للنشر',
    publishDate: '2024-01-20',
    pages: 250,
    format: 'غلاف مقوى',
    coverImage: '',
    type: 'physical',
    tags: ''
  },
  {
    id: 6,
    title: 'ما تبقى من البقايا (مكرر)',
    author: 'كلارك كينت',
    authorId: 3,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.2,
    reviews: 180,
    category: 'fiction',
    imgPlaceholder: 'غلاف كتاب ما تبقى من البقايا بتصميم مختلف',
    description: 'وصف مكرر لكتاب ما تبقى من البقايا.',
    isbn: '978-0-98-765432-2',
    publisher: 'مكتبة المستقبل',
    publishDate: '2022-11-01',
    pages: 320,
    format: 'كتاب إلكتروني',
    coverImage: '',
    type: 'ebook',
    tags: ''
  }
];

export const recentSearchBooks = books.slice(3, 6).concat(books.slice(0,3));
export const bestsellerBooks = books.slice(0,6);


export const authors = [
  { id: 1, name: 'ليلي ويليامز', books: 15, imgPlaceholder: 'صورة ليلي ويليامز كرتونية', bio: 'ليلي ويليامز كاتبة متخصصة في أدب الأطفال، تتميز بقدرتها على خلق قصص آسرة وشخصيات لا تُنسى.' },
  { id: 2, name: 'ماك كارتني', books: 8, imgPlaceholder: 'صورة ماك كارتني كرتونية', bio: 'ماك كارتني روائي بريطاني معروف بأعماله في الخيال العلمي والتشويق.' },
  { id: 3, name: 'واشنطن', books: 12, imgPlaceholder: 'صورة واشنطن كرتونية', bio: 'مؤرخ وكاتب أمريكي، يركز في كتاباته على التاريخ الاجتماعي والثقافي.' },
  { id: 4, name: 'دينا خوجة', books: 6, imgPlaceholder: 'صورة ديانا روز كرتونية', bio: 'دينا خوجة كاتبة سعودية، اشتهرت بأعمالها التي تناقش قضايا المرأة والمجتمع.' },
  { id: 5, name: 'ناتالي', books: 10, imgPlaceholder: 'صورة ناتالي كرتونية', bio: 'ناتالي شاعرة وكاتبة فرنسية، تتميز كتاباتها بالعمق الفلسفي والجمال اللغوي.' },
  { id: 6, name: 'ليلي ويليامز مكرر', books: 15, imgPlaceholder: 'صورة ليلي ويليامز كرتونية مكررة', bio: 'ليلي ويليامز كاتبة متخصصة في أدب الأطفال، تتميز بقدرتها على خلق قصص آسرة وشخصيات لا تُنسى.' },
  { id: 7, name: 'ماك كارتني مكرر', books: 8, imgPlaceholder: 'صورة ماك كارتني كرتونية مكررة', bio: 'ماك كارتني روائي بريطاني معروف بأعماله في الخيال العلمي والتشويق.' },
  { id: 8, name: 'واشنطن مكرر', books: 12, imgPlaceholder: 'صورة واشنطن كرتونية مكررة', bio: 'مؤرخ وكاتب أمريكي، يركز في كتاباته على التاريخ الاجتماعي والثقافي.' },
  { id: 9, name: 'ديانا روز مكرر', books: 6, imgPlaceholder: 'صورة ديانا روز كرتونية مكررة', bio: 'دينا خوجة كاتبة سعودية، اشتهرت بأعمالها التي تناقش قضايا المرأة والمجتمع.' },
  { id: 10, name: 'ناتالي مكرر', books: 10, imgPlaceholder: 'صورة ناتالي كرتونية مكررة', bio: 'ناتالي شاعرة وكاتبة فرنسية، تتميز كتاباتها بالعمق الفلسفي والجمال اللغوي.' },
];

export const sellers = [
  { id: 1, name: 'مكتبة المعرفة', email: 'info@knowledge.ae', phone: '+971 50 111 2222' },
  { id: 2, name: 'دار الحكمة', email: 'contact@hikma.ae', phone: '+971 50 333 4444' },
];

export const branches = [
  {
    id: 1,
    name: 'الفرع الرئيسي',
    address: 'دبي، الإمارات',
    phone: '+971 4 123 4567',
    email: 'main@example.com',
    code: 'DXB',
    hours: {
      sun: '9-5',
      mon: '9-5',
      tue: '9-5',
      wed: '9-5',
      thu: '9-5',
      fri: '',
      sat: ''
    }
  },
  {
    id: 2,
    name: 'فرع أبوظبي',
    address: 'أبوظبي، الإمارات',
    phone: '+971 2 765 4321',
    email: 'abudhabi@example.com',
    code: 'AUH',
    hours: {
      sun: '9-5',
      mon: '9-5',
      tue: '9-5',
      wed: '9-5',
      thu: '9-5',
      fri: '',
      sat: ''
    }
  }
];

export const users = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '+971 55 111 1111' },
  { id: 2, name: 'سارة علي', email: 'sara@example.com', phone: '+971 55 222 2222' },
];

export const dashboardStats = [
  { title: 'إجمالي الكتب', value: '2,847', icon: BookOpen, color: 'bg-blue-500' },
  { title: 'المؤلفون', value: '156', icon: Users, color: 'bg-green-500' },
  { title: 'المبيعات اليوم', value: '1,234 د.إ', icon: DollarSign, color: 'bg-purple-500' },
  { title: 'الزوار', value: '8,945', icon: Eye, color: 'bg-orange-500' }
];

export const featuresData = [
  {
    icon: Briefcase,
    title: 'القراءة والمكافآت',
    description: 'انضم الآن لكسب كتب مجانية'
  },
  {
    icon: Gift,
    title: 'عروض ملهمون',
    description: 'وفر حتى 20% على أي منتج مؤهل'
  },
  {
    icon: Truck,
    title: 'الشحن المجاني',
    description: 'للطلبات أكثر من 100 درهم'
  },
  {
    icon: Smartphone,
    title: 'تطبيق الجوال',
    description: 'تسوق أسرع واكسب نقاط إضافية'
  },
];

export const footerLinks = [
  {
    title: 'حول ملهمون',
    links: [
      { text: 'من نحن', href: '/about-us' },
      { text: 'فريق الدار', href: '/team' },
      { text: 'المؤلفون', href: '/authors' },
      { text: 'قراء ملهمون', href: '#', action: 'molhemoon-readers-club' },
      { text: 'مقالات الدار', href: '/blog' },
    ],
  },
  {
    title: 'أكاديمية ملهمون',
    links: [
      { text: 'سجل كمدرب', href: '#', action: 'register-trainer' },
      { text: 'الدورات التدريبية', href: '/courses' },
      { text: 'استفسارات المدربين', href: '#', action: 'trainer-inquiries' },
      { text: 'قارئ ملهمون', href: '#', action: 'molhemoon-reader-program' },
    ],
  },
  {
    title: 'خدمات ملهمون',
    links: [
      { text: 'طلبات النشر', href: '/publishing-requests' },
      { text: 'خدمات التصميم والإنتاج', href: '/design-production-services' },
      { text: 'خدمة توزيع المطبوعات', href: '/distribution-services' },
      { text: 'طلب قائمة منشورات الدار', href: '#', action: 'request-publications-list' },
    ],
  },
  {
    title: 'خدمة العملاء',
    links: [
      { text: 'تتبع حالة الطلب', href: '/profile?tab=orders' },
      { text: 'بطاقة هدية ملهمون', href: '/gift-card' },
      { text: 'اتصل بنا', href: '/contact-us' },
      { text: '0097165551184', href: 'tel:0097165551184', action: 'call-support' },
    ],
  },
];
export const siteSettings = {
  siteName: 'ملهمون',
  description: 'دار ملهمون للنشر والتوزيع',
  contactEmail: 'info@molhemoon.com',
  contactPhone: '0097165551184',
  address: 'الإمارات العربية المتحدة',
  languages: 'ar,en',
  defaultLanguage: 'ar',
  defaultCurrency: 'AED',
  detectCurrencyByCountry: false,
  facebook: '',
  twitter: '',
  instagram: '',
  themeColor: '#1D4ED8',
  // New settings structure
  about: {
    pageTitle: 'About Us',
    urlSlug: '/about-us',
    metaTitle: '',
    metaDescription: '',
    headerTitle: 'Get to Know Darmolhimon',
    headerSubtitle: 'Your trusted platform for books, eBooks, and audiobooks',
    mainDescription: 'how Darmolhimon started, what you believe in, and how you help readers today.',
    missionStatement: 'To make literature and knowledge accessible in every format for everyone, everywhere.',
    visionStatement: 'To be the leading digital and physical bookstore platform in Southeast Asia.',
    coreValues: [
      { icon: 'Accessibility icon.JPG', title: 'Accessibility', description: 'Short 1-2 sentence value explanation' }
    ],
    heroImage: '',
    companyName: '',
    establishedYear: '',
    contactEmail: '',
    whatsappPhone: '',
    status: 'active'
  },
  checkout: {
    contactMethod: 'phone',
    fullName: 'last',
    companyName: 'dont',
    addressLine2: 'dont',
    shippingPhone: 'dont'
  },
  connection: {
    socialMedia: {
      facebook: { url: 'https://facebook.com/darmolhimon', enabled: true },
      instagram: { url: 'https://instagram.com/darmolhimon', enabled: true },
      tiktok: { url: 'https://instagram.com/darmolhimon', enabled: true },
      twitter: { url: 'https://x.com/darmolhimon', enabled: true },
      youtube: { url: 'https://youtube.com/@darmolhimon', enabled: true },
      linkedin: { url: 'https://linkedin.com/company/darmolhimon', enabled: true }
    },
    whatsapp: {
      number: '',
      message: 'Hi Darmolhimon, I\'d like to ask about a book.',
      days: 'Monday - Friday',
      from: '08.00',
      to: '22.00',
      showFloating: true
    }
  },
  payments: {
    paymentMethods: {
      visa: { 
        enabled: true, 
        name: 'Visa', 
        apiKey: '', 
        secretKey: '', 
        testMode: true,
        connected: false,
        icon: '💳'
      },
      mastercard: { 
        enabled: true, 
        name: 'Mastercard', 
        apiKey: '', 
        secretKey: '', 
        testMode: true,
        connected: false,
        icon: '💳'
      },
      amex: { 
        enabled: false, 
        name: 'American Express', 
        apiKey: '', 
        secretKey: '', 
        testMode: true,
        connected: false,
        icon: '💳'
      },
      paypal: { 
        enabled: false, 
        name: 'PayPal', 
        clientId: '', 
        secret: '', 
        testMode: true,
        connected: false,
        icon: '🅿️'
      },
      applePay: { 
        enabled: false, 
        name: 'Apple Pay', 
        merchantId: '', 
        certificate: '',
        connected: false,
        icon: '🍎'
      },
      googlePay: { 
        enabled: false, 
        name: 'Google Pay', 
        merchantId: '', 
        apiKey: '',
        connected: false,
        icon: '📱'
      },
      bankTransfer: { 
        enabled: false, 
        name: 'تحويل بنكي', 
        accountNumber: '', 
        bankName: '',
        connected: false,
        icon: '🏦'
      },
      cashOnDelivery: { 
        enabled: true, 
        name: 'الدفع عند الاستلام', 
        maxAmount: 1000,
        connected: true,
        icon: '💵'
      },
      bitcoin: { 
        enabled: false, 
        name: 'Bitcoin', 
        walletAddress: '',
        connected: false,
        icon: '₿'
      },
      ethereum: { 
        enabled: false, 
        name: 'Ethereum', 
        walletAddress: '',
        connected: false,
        icon: 'Ξ'
      },
      mada: { 
        enabled: true, 
        name: 'مدى', 
        merchantId: '', 
        apiKey: '',
        connected: false,
        icon: '💳'
      },
      stcPay: { 
        enabled: false, 
        name: 'STC Pay', 
        merchantId: '', 
        apiKey: '',
        connected: false,
        icon: '📱'
      },
      tabby: { 
        enabled: false, 
        name: 'تابي', 
        apiKey: '', 
        secretKey: '',
        testMode: true,
        connected: false,
        icon: '🛒'
      },
      tamara: { 
        enabled: false, 
        name: 'تمارا', 
        apiKey: '', 
        secretKey: '',
        testMode: true,
        connected: false,
        icon: '💳'
      },
      qitaf: { 
        enabled: false, 
        name: 'قطف', 
        merchantId: '', 
        apiKey: '',
        testMode: true,
        connected: false,
        icon: '💳'
      },
      fawry: { 
        enabled: false, 
        name: 'فوري', 
        merchantCode: '', 
        secureKey: '',
        testMode: true,
        connected: false,
        icon: '🏪'
      },
      payfort: { 
        enabled: false, 
        name: 'PayFort', 
        accessCode: '', 
        merchantIdentifier: '',
        shaRequestPhrase: '',
        shaResponsePhrase: '',
        testMode: true,
        connected: false,
        icon: '💳'
      },
      myfatoorah: { 
        enabled: false, 
        name: 'ماي فاتورة', 
        apiKey: '',
        testMode: true,
        connected: false,
        icon: '📄'
      }
    },
    currency: 'SAR',
    taxRate: 15,
    autoCapture: true,
    refundPolicy: 'full',
    buyerAccounts: {
      enabled: true,
      autoLink: true,
      requireVerification: true
    }
  },
  store: {
    name: 'ملهمون',
    description: 'دار ملهمون للنشر والتوزيع',
    logo: '',
    address: 'الإمارات العربية المتحدة',
    phone: '0097165551184',
    email: 'info@molhemoon.com',
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false }
    }
  },
  shipping: {
    methods: {
      standard: { enabled: true, name: 'الشحن العادي', price: 15, days: '3-5 أيام' },
      express: { enabled: true, name: 'الشحن السريع', price: 25, days: '1-2 أيام' },
      overnight: { enabled: false, name: 'الشحن الفوري', price: 50, days: '24 ساعة' }
    },
    freeShippingThreshold: 200,
    maxShippingDistance: 100
  },
  locations: {
    branches: [
      {
        name: 'الفرع الرئيسي',
        address: 'الإمارات العربية المتحدة',
        phone: '0097165551184',
        email: 'info@molhemoon.com',
        coordinates: { lat: 25.2048, lng: 55.2708 }
      }
    ]
  },
  notifications: {
    email: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      newProducts: false,
      promotions: false
    },
    sms: {
      orderConfirmation: false,
      orderShipped: false,
      orderDelivered: false,
      promotions: false
    },
    push: {
      orderUpdates: true,
      newProducts: false,
      promotions: false
    }
  },
  terms: {
    termsOfService: 'شروط وأحكام استخدام الموقع...',
    privacyPolicy: 'سياسة الخصوصية...',
    returnPolicy: 'سياسة الإرجاع والاستبدال...',
    shippingPolicy: 'سياسة الشحن والتوصيل...'
  }
};

export const paymentMethods = [
  { id: 1, name: 'Stripe', test_mode: false, config: { publishableKey: '', secretKey: '' } },
  { id: 2, name: 'PayPal', test_mode: false, config: { clientId: '', secret: '' } },
  { id: 3, name: 'Mada', test_mode: false, config: { merchantId: '', terminalId: '' } },
  { id: 4, name: 'Qitaf', test_mode: false, config: { merchantId: '', apiKey: '' } },
  { id: 5, name: 'Cash on Delivery', test_mode: false, config: {} },
  { id: 6, name: 'Tabby', test_mode: false, config: { apiKey: '', secretKey: '' } },
  { id: 7, name: 'Tamara', test_mode: false, config: { apiKey: '', secretKey: '' } },
  { id: 8, name: 'STC Pay', test_mode: false, config: { merchantId: '', secretKey: '' } },
  { id: 9, name: 'Apple Pay', test_mode: false, config: { merchantId: '' } },
  { id: 10, name: 'Fawry', test_mode: false, config: { merchantCode: '', secureKey: '' } },
  { id: 11, name: 'PayFort', test_mode: false, config: { accessCode: '', merchantIdentifier: '', shaRequestPhrase: '', shaResponsePhrase: '' } },
  { id: 12, name: 'MyFatoorah', test_mode: false, config: { apiKey: '' } }
];
