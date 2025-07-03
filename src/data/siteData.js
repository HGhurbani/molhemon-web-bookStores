
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
    type: 'both',
    sampleAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ''
  },
  {
    id: 2,
    title: 'أحاديث داخلية',
    author: 'دينا خوجة',
    authorId: 4,
    price: 60.00,
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
    type: '',
    tags: ''
  },
  {
    id: 3,
    title: 'ما تبقى من البقايا',
    author: 'كلارك كينت',
    authorId: 3,
    price: 45.00,
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
    type: '',
    tags: ''
  },
   {
    id: 4,
    title: 'عمرنا الآن ستة (مكرر)',
    author: 'ليلي ويليامز',
    authorId: 1,
    price: 45.00,
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
    type: '',
    tags: ''
  },
  {
    id: 5,
    title: 'أحاديث داخلية (مكرر)',
    author: 'دينا خوجة',
    authorId: 4,
    price: 60.00,
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
    type: '',
    tags: ''
  },
  {
    id: 6,
    title: 'ما تبقى من البقايا (مكرر)',
    author: 'كلارك كينت',
    authorId: 3,
    price: 45.00,
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
    type: '',
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

export const customers = [
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
  facebook: '',
  twitter: '',
  instagram: '',
  themeColor: '#1D4ED8',
  stripePublicKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  paypalSecret: ''
};
