
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
  { id: 'books', name: 'siteData.categories.books', icon: 'BookOpen' },
  { id: 'fiction', name: 'siteData.categories.fiction', icon: 'BookOpen' },
  { id: 'nonfiction', name: 'siteData.categories.nonfiction', icon: 'BookOpen' },
  { id: 'ebooks', name: 'siteData.categories.ebooks', icon: 'Smartphone' },
  { id: 'audiobooks', name: 'siteData.categories.audiobooks', icon: 'Headphones' },
  { id: 'teen', name: 'siteData.categories.teen', icon: 'Users' },
  { id: 'kids', name: 'siteData.categories.kids', icon: 'Gift' },
  { id: 'trending', name: 'siteData.categories.trending', icon: 'TrendingUp'},
  { id: 'deals', name: 'siteData.categories.deals', icon: 'DollarSign' },
  { id: 'bestseller', name: 'siteData.categories.bestseller', icon: 'Award' },
  { id: 'etc1', name: 'siteData.categories.etc1', icon: 'Menu' },
  { id: 'etc2', name: 'siteData.categories.etc2', icon: 'Menu' }
];

export const books = [
  {
    id: 1,
    title: 'siteData.books.book1.title',
    author: 'siteData.books.book1.author',
    authorId: 1,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.4,
    reviews: 296,
    category: 'kids',
    imgPlaceholder: 'siteData.books.book1.imgPlaceholder',
    description: 'siteData.books.book1.description',
    isbn: '978-3-16-148410-0',
    publisher: 'siteData.books.book1.publisher',
    publishDate: '2023-05-15',
    pages: 120,
    format: 'siteData.books.book1.format',
    coverImage: '',
    type: 'physical',
    deliveryMethod: 'siteData.books.book1.deliveryMethod',
    sampleAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ''
  },
  {
    id: 2,
    title: 'siteData.books.book2.title',
    author: 'siteData.books.book2.author',
    authorId: 4,
    price: 60.00,
    prices: { AED: 60.00, SAR: 60.00 },
    originalPrice: 75.00,
    rating: 4.8,
    reviews: 350,
    category: 'nonfiction',
    imgPlaceholder: 'siteData.books.book2.imgPlaceholder',
    description: 'siteData.books.book2.description',
    isbn: '978-1-23-456789-7',
    publisher: 'siteData.books.book2.publisher',
    publishDate: '2024-01-20',
    pages: 250,
    format: 'siteData.books.book2.format',
    coverImage: '',
    type: 'physical',
    deliveryMethod: 'siteData.books.book2.deliveryMethod',
    tags: ''
  },
  {
    id: 3,
    title: 'siteData.books.book3.title',
    author: 'siteData.books.book3.author',
    authorId: 3,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.2,
    reviews: 180,
    category: 'fiction',
    imgPlaceholder: 'siteData.books.book3.imgPlaceholder',
    description: 'siteData.books.book3.description',
    isbn: '978-0-98-765432-1',
    publisher: 'siteData.books.book3.publisher',
    publishDate: '2022-11-01',
    pages: 320,
    format: 'siteData.books.book3.format',
    coverImage: '',
    type: 'ebook',
    ebookFile: '',
    tags: ''
  },
   {
    id: 4,
    title: 'siteData.books.book4.title',
    author: 'siteData.books.book4.author',
    authorId: 1,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.4,
    reviews: 296,
    category: 'kids',
    imgPlaceholder: 'siteData.books.book4.imgPlaceholder',
    description: 'siteData.books.book4.description',
    isbn: '978-3-16-148410-1',
    publisher: 'siteData.books.book4.publisher',
    publishDate: '2023-05-15',
    pages: 120,
    format: 'siteData.books.book4.format',
    coverImage: '',
    type: 'physical',
    tags: ''
  },
  {
    id: 5,
    title: 'siteData.books.book5.title',
    author: 'siteData.books.book5.author',
    authorId: 4,
    price: 60.00,
    prices: { AED: 60.00, SAR: 60.00 },
    originalPrice: 75.00,
    rating: 4.8,
    reviews: 350,
    category: 'nonfiction',
    imgPlaceholder: 'siteData.books.book5.imgPlaceholder',
    description: 'siteData.books.book5.description',
    isbn: '978-1-23-456789-8',
    publisher: 'siteData.books.book5.publisher',
    publishDate: '2024-01-20',
    pages: 250,
    format: 'siteData.books.book5.format',
    coverImage: '',
    type: 'physical',
    tags: ''
  },
  {
    id: 6,
    title: 'siteData.books.book6.title',
    author: 'siteData.books.book6.author',
    authorId: 3,
    price: 45.00,
    prices: { AED: 45.00, SAR: 45.00 },
    originalPrice: 60.00,
    rating: 4.2,
    reviews: 180,
    category: 'fiction',
    imgPlaceholder: 'siteData.books.book6.imgPlaceholder',
    description: 'siteData.books.book6.description',
    isbn: '978-0-98-765432-2',
    publisher: 'siteData.books.book6.publisher',
    publishDate: '2022-11-01',
    pages: 320,
    format: 'siteData.books.book6.format',
    coverImage: '',
    type: 'ebook',
    tags: ''
  }
];

export const recentSearchBooks = books.slice(3, 6).concat(books.slice(0,3));
export const bestsellerBooks = books.slice(0,6);


export const authors = [
  {
    id: 1,
    name: 'siteData.authors.author1.name',
    books: 15,
    imgPlaceholder: 'siteData.authors.author1.imgPlaceholder',
    bio: 'siteData.authors.author1.bio',
    socialMedia: {
      facebook: 'https://facebook.com/lilywilliams',
      twitter: 'https://twitter.com/lilywilliams',
      instagram: 'https://instagram.com/lilywilliams',
      website: 'https://lilywilliams.com'
    }
  },
  {
    id: 2,
    name: 'siteData.authors.author2.name',
    books: 8,
    imgPlaceholder: 'siteData.authors.author2.imgPlaceholder',
    bio: 'siteData.authors.author2.bio',
    socialMedia: {
      twitter: 'https://twitter.com/maccartney',
      linkedin: 'https://linkedin.com/in/maccartney',
      website: 'https://maccartney.com'
    }
  },
  {
    id: 3,
    name: 'siteData.authors.author3.name',
    books: 12,
    imgPlaceholder: 'siteData.authors.author3.imgPlaceholder',
    bio: 'siteData.authors.author3.bio',
    socialMedia: {
      facebook: 'https://facebook.com/washington',
      youtube: 'https://youtube.com/washington',
      website: 'https://washington.com'
    }
  },
  {
    id: 4,
    name: 'siteData.authors.author4.name',
    books: 6,
    imgPlaceholder: 'siteData.authors.author4.imgPlaceholder',
    bio: 'siteData.authors.author4.bio',
    socialMedia: {
      instagram: 'https://instagram.com/dinakhouja',
      twitter: 'https://twitter.com/dinakhouja',
      linkedin: 'https://linkedin.com/in/dinakhouja'
    }
  },
  {
    id: 5,
    name: 'siteData.authors.author5.name',
    books: 10,
    imgPlaceholder: 'siteData.authors.author5.imgPlaceholder',
    bio: 'siteData.authors.author5.bio',
    socialMedia: {
      facebook: 'https://facebook.com/natalie',
      instagram: 'https://instagram.com/natalie',
      website: 'https://natalie.com'
    }
  },
  {
    id: 6,
    name: 'siteData.authors.author6.name',
    books: 15,
    imgPlaceholder: 'siteData.authors.author6.imgPlaceholder',
    bio: 'siteData.authors.author6.bio',
    socialMedia: {
      facebook: 'https://facebook.com/lilywilliams2',
      twitter: 'https://twitter.com/lilywilliams2'
    }
  },
  {
    id: 7,
    name: 'siteData.authors.author7.name',
    books: 8,
    imgPlaceholder: 'siteData.authors.author7.imgPlaceholder',
    bio: 'siteData.authors.author7.bio',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/maccartney2'
    }
  },
  {
    id: 8,
    name: 'siteData.authors.author8.name',
    books: 12,
    imgPlaceholder: 'siteData.authors.author8.imgPlaceholder',
    bio: 'siteData.authors.author8.bio',
    socialMedia: {
      youtube: 'https://youtube.com/washington2'
    }
  },
  {
    id: 9,
    name: 'siteData.authors.author9.name',
    books: 6,
    imgPlaceholder: 'siteData.authors.author9.imgPlaceholder',
    bio: 'siteData.authors.author9.bio',
    socialMedia: {
      instagram: 'https://instagram.com/dianarose2'
    }
  },
  {
    id: 10,
    name: 'siteData.authors.author10.name',
    books: 10,
    imgPlaceholder: 'siteData.authors.author10.imgPlaceholder',
    bio: 'siteData.authors.author10.bio',
    socialMedia: {
      website: 'https://natalie2.com'
    }
  },
];

export const sellers = [
  { id: 1, name: 'siteData.sellers.seller1.name', email: 'info@knowledge.ae', phone: '+971 50 111 2222' },
  { id: 2, name: 'siteData.sellers.seller2.name', email: 'contact@hikma.ae', phone: '+971 50 333 4444' },
];

export const branches = [
  {
    id: 1,
    name: 'siteData.branches.branch1.name',
    address: 'siteData.branches.branch1.address',
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
    name: 'siteData.branches.branch2.name',
    address: 'siteData.branches.branch2.address',
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
  { title: 'siteData.dashboardStats.totalBooks', value: '2,847', icon: BookOpen, color: 'bg-blue-500' },
  { title: 'siteData.dashboardStats.authors', value: '156', icon: Users, color: 'bg-green-500' },
  { title: 'siteData.dashboardStats.salesToday', value: '1,234 د.إ', icon: DollarSign, color: 'bg-purple-500' },
  { title: 'siteData.dashboardStats.visitors', value: '8,945', icon: Eye, color: 'bg-orange-500' }
];

export const featuresData = [
  {
    id: 'reading-rewards',
    icon: Briefcase,
    title: 'siteData.features.readingRewards.title',
    description: 'siteData.features.readingRewards.description'
  },
  {
    id: 'molhemoon-deals',
    icon: Gift,
    title: 'siteData.features.molhemoonDeals.title',
    description: 'siteData.features.molhemoonDeals.description'
  },
  {
    id: 'free-shipping',
    icon: Truck,
    title: 'siteData.features.freeShipping.title',
    description: 'siteData.features.freeShipping.description'
  },
  {
    id: 'mobile-app',
    icon: Smartphone,
    title: 'siteData.features.mobileApp.title',
    description: 'siteData.features.mobileApp.description'
  },
];

export const footerLinks = [
  {
    id: 'about',
    title: 'siteData.footer.sections.about.title',
    links: [
      { id: 'about-us', text: 'siteData.footer.sections.about.links.aboutUs', href: '/about' },
      { id: 'team', text: 'siteData.footer.sections.about.links.team', href: '/team' },
      { id: 'authors', text: 'siteData.footer.sections.about.links.authors', href: '/authors' },
      { id: 'readers-club', text: 'siteData.footer.sections.about.links.readersClub', href: '#', action: 'molhemoon-readers-club' },
      { id: 'blog', text: 'siteData.footer.sections.about.links.blog', href: '/blog' },
    ],
  },
  {
    id: 'academy',
    title: 'siteData.footer.sections.academy.title',
    links: [
      { id: 'register-trainer', text: 'siteData.footer.sections.academy.links.registerTrainer', href: '#', action: 'register-trainer' },
      { id: 'courses', text: 'siteData.footer.sections.academy.links.courses', href: '/courses' },
      { id: 'trainer-inquiries', text: 'siteData.footer.sections.academy.links.trainerInquiries', href: '#', action: 'trainer-inquiries' },
      { id: 'reader-program', text: 'siteData.footer.sections.academy.links.readerProgram', href: '#', action: 'molhemoon-reader-program' },
    ],
  },
  {
    id: 'services',
    title: 'siteData.footer.sections.services.title',
    links: [
      { id: 'publishing-services', text: 'siteData.footer.sections.services.links.publishing', href: '/publishing-services' },
      { id: 'design-services', text: 'siteData.footer.sections.services.links.design', href: '/design-services' },
      { id: 'distribution-services', text: 'siteData.footer.sections.services.links.distribution', href: '/distribution-services' },
      { id: 'request-publications', text: 'siteData.footer.sections.services.links.requestPublications', href: '#', action: 'request-publications-list' },
    ],
  },
  {
    id: 'support',
    title: 'siteData.footer.sections.support.title',
    links: [
      { id: 'track-order', text: 'siteData.footer.sections.support.links.trackOrder', href: '/profile?tab=orders' },
      { id: 'gift-card', text: 'siteData.footer.sections.support.links.giftCard', href: '/gift-card' },
      { id: 'contact-us', text: 'siteData.footer.sections.support.links.contactUs', href: '/contact-us' },
      { id: 'call-support', text: 'siteData.footer.sections.support.links.supportPhone', href: 'tel:0097165551184', action: 'call-support' },
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
  adminDefaultLanguage: 'en',
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
      free: { 
        enabled: true, 
        name: 'شحن مجاني', 
        price: 0, 
        days: '3-5 أيام',
        conditions: {
          minOrderAmount: 200,
          maxWeight: 10,
          countries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA']
        }
      },
      standard: { 
        enabled: true, 
        name: 'الشحن العادي', 
        price: 15, 
        days: '3-5 أيام',
        conditions: {
          maxWeight: 20,
          countries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA']
        }
      },
      express: { 
        enabled: true, 
        name: 'الشحن السريع', 
        price: 25, 
        days: '1-2 أيام',
        conditions: {
          maxWeight: 15,
          countries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA']
        }
      },
      overnight: { 
        enabled: false, 
        name: 'الشحن الفوري', 
        price: 50, 
        days: '24 ساعة',
        conditions: {
          maxWeight: 5,
          countries: ['SA']
        }
      },
      pickup: { 
        enabled: true, 
        name: 'استلام من المتجر', 
        price: 0, 
        days: 'فوري',
        conditions: {
          countries: ['SA']
        }
      }
    },
    freeShippingThreshold: 200,
    maxShippingDistance: 100,
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    baseShippingCost: 15,
    costPerKg: 5,
    maxWeight: 30,
    maxDimensions: {
      length: 100,
      width: 100,
      height: 100
    }
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
    termsOfService: `شروط وأحكام استخدام الموقع

1. القبول بالشروط
باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام.

2. استخدام الموقع
يجب استخدام الموقع لأغراض قانونية ومشروعة فقط.

3. الملكية الفكرية
جميع المحتويات محمية بموجب حقوق الملكية الفكرية.

4. المسؤولية
لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة.

5. التعديلات
نحتفظ بحق تعديل هذه الشروط في أي وقت.

6. القانون المطبق
تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة.`,
    privacyPolicy: `سياسة الخصوصية

1. جمع المعلومات
نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو الشراء.

2. استخدام المعلومات
نستخدم معلوماتك لتقديم الخدمات وتحسين تجربتك.

3. حماية المعلومات
نطبق إجراءات أمنية صارمة لحماية معلوماتك الشخصية.

4. مشاركة المعلومات
لا نشارك معلوماتك مع أطراف ثالثة دون موافقتك.

5. ملفات تعريف الارتباط
نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع.

6. حقوقك
يمكنك طلب حذف أو تعديل معلوماتك في أي وقت.`,
    returnPolicy: `سياسة الإرجاع والاستبدال

1. شروط الإرجاع
يمكن إرجاع الكتب خلال 14 يوماً من تاريخ الاستلام.

2. الحالة المطلوبة
يجب أن تكون الكتب في حالة ممتازة وغير مستخدمة.

3. عملية الإرجاع
اتصل بنا أولاً للحصول على رقم إرجاع.

4. التكلفة
تكلفة الشحن للإرجاع على العميل.

5. الاستبدال
يمكن استبدال الكتاب بآخر من نفس القيمة.

6. المبالغ المستردة
يتم استرداد المبلغ خلال 5-7 أيام عمل.`,
    shippingPolicy: `سياسة الشحن والتوصيل

1. طرق الشحن
- الشحن العادي: 3-5 أيام عمل
- الشحن السريع: 1-2 أيام عمل
- الشحن الفوري: 24 ساعة

2. تكلفة الشحن
- الشحن العادي: 15 درهم
- الشحن السريع: 25 درهم
- الشحن الفوري: 50 درهم

3. الشحن المجاني
الشحن مجاني للطلبات التي تزيد عن 200 درهم.

4. مناطق التوصيل
نوصل لجميع أنحاء الإمارات العربية المتحدة.

5. تتبع الطلبات
يمكن تتبع طلبك من خلال رقم التتبع.

6. التأخير
نعتذر عن أي تأخير قد يحدث لأسباب خارجة عن إرادتنا.`
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
