
import React, { useState, useEffect } from 'react';
import { useCurrency, detectUserCurrency } from '@/lib/currencyContext.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Dashboard from '@/components/Dashboard.jsx';
import SEO from '@/components/SEO.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';

import HomePage from '@/pages/HomePage.jsx';
import BookDetailsPage from '@/pages/BookDetailsPage.jsx';
import AuthorPage from '@/pages/AuthorPage.jsx';
import CategoryPage from '@/pages/CategoryPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import CheckoutPage from '@/pages/CheckoutPage.jsx';
import UserProfilePage from '@/pages/UserProfilePage.jsx';
import OrderDetailsPage from '@/pages/OrderDetailsPage.jsx';
import DashboardOrderDetailsPage from '@/pages/DashboardOrderDetailsPage.jsx';
import TrackOrderPage from '@/pages/TrackOrderPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import AudiobookPage from '@/pages/AudiobookPage.jsx';
import EbookPage from '@/pages/EbookPage.jsx';
import ReadSamplePage from '@/pages/ReadSamplePage.jsx';
import ListenSamplePage from '@/pages/ListenSamplePage.jsx';
import EbookReaderPage from '@/pages/EbookReaderPage.jsx';
import AudiobookPlayerPage from '@/pages/AudiobookPlayerPage.jsx';
import SubscriptionCheckoutPage from '@/pages/SubscriptionCheckoutPage.jsx';
import SearchResultsPage from '@/pages/SearchResultsPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import ReturnPolicyPage from '@/pages/ReturnPolicyPage.jsx';
import AuthorsSectionPage from '@/pages/AuthorsSectionPage.jsx';
import DesignServicesPage from '@/pages/DesignServicesPage.jsx';
import PublishingServicesPage from '@/pages/PublishingServicesPage.jsx';
import PublishPage from '@/pages/PublishPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';
import BlogPage from '@/pages/BlogPage.jsx';
import BlogDetailsPage from '@/pages/BlogDetailsPage.jsx';
import BlogTestPage from '@/pages/BlogTestPage.jsx';
import HelpCenterPage from '@/pages/HelpCenterPage.jsx';
import DistributorsPage from '@/pages/DistributorsPage.jsx';
import FirebaseTestPage from '@/pages/FirebaseTestPage.jsx';
import ImageTestPage from '@/pages/ImageTestPage.jsx';
import StoreSettingsPage from '@/pages/StoreSettingsPage.jsx';
import AddToCartDialog from '@/components/AddToCartDialog.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ChatWidget from '@/components/ChatWidget.jsx';
import SplashScreen from '@/components/SplashScreen.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import RequireAdmin from '@/components/RequireAdmin.jsx';

import { sellers as initialSellers, branches as initialBranches, users as initialUsers, footerLinks, siteSettings as initialSiteSettings, paymentMethods as initialPaymentMethods } from '@/data/siteData.js';
import api from '@/lib/api.js';
import { TrendingUp, BookOpen, Users, DollarSign, Eye } from 'lucide-react';
import { useLanguage, defaultLanguages } from '@/lib/languageContext.jsx';
import { jwtAuthManager, firebaseAuth } from '@/lib/jwtAuth.js';
import { errorHandler } from '@/lib/errorHandler.js';

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [dashboardSection, setDashboardSection] = useState('overview');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { setLanguage, setLanguages, languages } = useLanguage();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState({ type: 'admin', name: 'الدعم' });
  const [dashboardStatsState, setDashboardStatsState] = useState([]);
  const [sellers, setSellers] = useState(() => {
    const stored = localStorage.getItem('sellers');
    return stored ? JSON.parse(stored) : initialSellers;
  });
  const [branches, setBranches] = useState(() => {
    const stored = localStorage.getItem('branches');
    return stored ? JSON.parse(stored) : initialBranches;
  });
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : initialUsers;
  });
  const [categoriesState, setCategoriesState] = useState([]);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders') || '[]'));
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem('payments') || '[]'));
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications') || '[]'));
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const stored = localStorage.getItem('paymentMethods');
    return stored ? JSON.parse(stored) : initialPaymentMethods;
  });
  const [currenciesState, setCurrenciesState] = useState(() => {
    const stored = localStorage.getItem('currencies');
    return stored ? JSON.parse(stored) : [];
  });
  const [plans, setPlans] = useState(() => JSON.parse(localStorage.getItem('plans') || '[]'));
  const [subscriptions, setSubscriptions] = useState(() => JSON.parse(localStorage.getItem('subscriptions') || '[]'));
  const [siteSettingsState, setSiteSettingsState] = useState(() => {
    const stored = localStorage.getItem('siteSettings');
    return stored ? { ...initialSiteSettings, ...JSON.parse(stored) } : initialSiteSettings;
  });
  const [heroSlidesState, setHeroSlidesState] = useState(() => {
    const stored = localStorage.getItem('heroSlides');
    return stored ? JSON.parse(stored) : [];
  });
  const [features, setFeatures] = useState([]);
  const [bannersState, setBannersState] = useState(() => {
    const stored = localStorage.getItem('banners');
    return stored ? JSON.parse(stored) : [];
  });
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [cartDialogBook, setCartDialogBook] = useState(null);
  const { setCurrencies: setCurrenciesContext, setCurrency } = useCurrency();

  const bestsellerBooks = React.useMemo(() => {
    return [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  }, [books]);

  const recentSearchBooks = React.useMemo(() => {
    return books.slice(3, 6).concat(books.slice(0, 3));
  }, [books]);

  // التحقق من حالة المصادقة عند تحميل التطبيق
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const user = jwtAuthManager.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsCustomerLoggedIn(true);
          
          // التحقق من صلاحيات المدير
          if (user.isAdmin || user.role === 'admin') {
            setIsAdminLoggedIn(true);
          }
        }
        
      } catch (error) {
        const errorObject = errorHandler.handleError(error, 'auth:status-check');
        console.error('Auth status check failed:', errorObject);
        
        // مسح حالة المصادقة في حالة الخطأ
        jwtAuthManager.clearTokens();
        setIsCustomerLoggedIn(false);
        setIsAdminLoggedIn(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  // مراقبة تغييرات حالة المصادقة
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChange(async ({ user, isAuthenticated }) => {
      if (isAuthenticated && user) {
        setCurrentUser(user);
        setIsCustomerLoggedIn(true);
        
        // التحقق من دور المستخدم في Firestore
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase.js');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          if (userData && (userData.role === 'admin' || userData.role === 'manager')) {
            setIsAdminLoggedIn(true);
          } else {
            setIsAdminLoggedIn(false);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          setIsAdminLoggedIn(false);
        }
      } else {
        setCurrentUser(null);
        setIsCustomerLoggedIn(false);
        setIsAdminLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // تحميل البيانات من Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsAppLoading(true);
        // تحميل البيانات المحفوظة محلياً أولاً
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
        const storedAuthors = localStorage.getItem('authors');
        if (storedAuthors) setAuthors(JSON.parse(storedAuthors));
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) setOrders(JSON.parse(storedOrders));
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) setSiteSettingsState(JSON.parse(storedSettings));
        const storedFeatures = localStorage.getItem('features');
        if (storedFeatures) setFeatures(JSON.parse(storedFeatures));
        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) setMessages(JSON.parse(storedMessages));

        // تحميل البيانات من Firebase
        const [b, a, c, s, o, pay, methods, currenciesData, languagesData, p, u, sliders, banners, feats, sellData, branchData, subs, msgs] = await Promise.all([
          api.getBooks().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:books');
            toast({
              title: "خطأ في تحميل الكتب",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getAuthors().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:authors');
            toast({
              title: "خطأ في تحميل المؤلفين",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getCategories().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:categories');
            toast({
              title: "خطأ في تحميل الفئات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getSettings().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:settings');
            toast({
              title: "خطأ في تحميل الإعدادات",
              description: errorObject.message,
              variant: "destructive"
            });
            return {};
          }),
          api.getOrders().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:orders');
            toast({
              title: "خطأ في تحميل الطلبات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getPayments().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:payments');
            toast({
              title: "خطأ في تحميل المدفوعات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getPaymentMethods().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:payment-methods');
            toast({
              title: "خطأ في تحميل طرق الدفع",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getCurrencies().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:currencies');
            toast({
              title: "خطأ في تحميل العملات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getLanguages().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:languages');
            toast({
              title: "خطأ في تحميل اللغات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getPlans().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:plans');
            toast({
              title: "خطأ في تحميل الخطط",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getUsers().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:users');
            toast({
              title: "خطأ في تحميل المستخدمين",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getSliders().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:sliders');
            toast({
              title: "خطأ في تحميل الشرائح",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getBanners().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:banners');
            toast({
              title: "خطأ في تحميل البانرات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getFeatures().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:features');
            toast({
              title: "خطأ في تحميل الميزات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getSellers().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:sellers');
            toast({
              title: "خطأ في تحميل البائعين",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getBranches().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:branches');
            toast({
              title: "خطأ في تحميل الفروع",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getSubscriptions().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:subscriptions');
            toast({
              title: "خطأ في تحميل الاشتراكات",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
          api.getMessages().catch(error => {
            const errorObject = errorHandler.handleError(error, 'data:messages');
            toast({
              title: "خطأ في تحميل الرسائل",
              description: errorObject.message,
              variant: "destructive"
            });
            return [];
          }),
        ]);

        // تحديث الحالة
        setBooks(b);
        setAuthors(a);
        setCategoriesState(c);
        setSiteSettingsState(prev => ({ ...prev, ...s }));
        setOrders(o);
        setPayments(pay);
        setPaymentMethods(methods);
        setCurrenciesState(currenciesData);
        setCurrenciesContext(currenciesData);
        setLanguages(languagesData.length ? languagesData : defaultLanguages);
        setPlans(p);
        setUsers(u);
        setHeroSlidesState(sliders);
        setBannersState(banners);
        setFeatures(feats);
        setSellers(sellData);
        setBranches(branchData);
        setSubscriptions(subs);
        setMessages(msgs);

        // حساب إحصائيات لوحة التحكم
        const sales = pay.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        setDashboardStatsState([
          { title: 'إجمالي الكتب', value: b.length, icon: BookOpen, color: 'bg-blue-500' },
          { title: 'المؤلفون', value: a.length, icon: Users, color: 'bg-green-500' },
          { title: 'المبيعات', value: `${sales.toLocaleString()} د.إ`, icon: DollarSign, color: 'bg-purple-500' },
          { title: 'المستخدمون', value: u.length, icon: Eye, color: 'bg-orange-500' },
        ]);

      } catch (error) {
        const errorObject = errorHandler.handleError(error, 'data:initial-load');
        toast({
          title: "خطأ في تحميل البيانات",
          description: errorObject.message,
          variant: "destructive"
        });
      } finally {
        // تأخير بسيط لتحسين تجربة التحميل وتجنب الوميض
        setTimeout(() => setIsAppLoading(false), 300);
      }
    };

    loadData();
  }, []);

  // حفظ البيانات في localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('authors', JSON.stringify(authors));
  }, [authors]);

  useEffect(() => {
    localStorage.setItem('sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('currencies', JSON.stringify(currenciesState));
    setCurrenciesContext(currenciesState);
  }, [currenciesState]);

  useEffect(() => {
    localStorage.setItem('plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettingsState));
  }, [siteSettingsState]);

  useEffect(() => {
    localStorage.setItem('heroSlides', JSON.stringify(heroSlidesState));
  }, [heroSlidesState]);

  useEffect(() => {
    localStorage.setItem('banners', JSON.stringify(bannersState));
  }, [bannersState]);

  useEffect(() => {
    localStorage.setItem('features', JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // تحديث إحصائيات لوحة التحكم
  useEffect(() => {
    const sales = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    setDashboardStatsState([
      { title: 'إجمالي الكتب', value: books.length, icon: BookOpen, color: 'bg-blue-500' },
      { title: 'المؤلفون', value: authors.length, icon: Users, color: 'bg-green-500' },
      { title: 'المبيعات', value: `${sales.toLocaleString()} د.إ`, icon: DollarSign, color: 'bg-purple-500' },
      { title: 'المستخدمون', value: users.length, icon: Eye, color: 'bg-orange-500' },
    ]);
  }, [books, authors, payments, users]);

  // تحديث عنوان الصفحة
  useEffect(() => {
    if (siteSettingsState.siteName) {
      document.title = siteSettingsState.siteName;
    }
  }, [siteSettingsState.siteName]);

  // تحديث اللغة الافتراضية
  useEffect(() => {
    if (siteSettingsState.defaultLanguage) {
      const lang = languages.find(l => l.code === siteSettingsState.defaultLanguage);
      if (lang) setLanguage(lang);
    }
  }, [siteSettingsState.defaultLanguage, setLanguage, languages]);

  // تحديث العملة الافتراضية
  useEffect(() => {
    if (!currenciesState.length) return;
    const defCode = siteSettingsState.defaultCurrency;
    if (siteSettingsState.detectCurrencyByCountry) {
      const cur = detectUserCurrency(currenciesState, defCode);
      setCurrency(cur);
    } else if (defCode) {
      const found = currenciesState.find(c => c.code === defCode);
      if (found) setCurrency(found);
    }
  }, [currenciesState, siteSettingsState.defaultCurrency, siteSettingsState.detectCurrencyByCountry, setCurrency]);

  // دوال معالجة الأحداث
  const handleAddToCart = (book) => {
    setCart((prevCart) => {
      const existingBook = prevCart.find(item => item.id === book.id);
      if (existingBook) {
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    setCartDialogBook(book);
    setCartDialogOpen(true);
  };

  const handleRemoveFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
    toast({
      title: "تم الحذف من السلة",
      description: "تم حذف المنتج من سلة التسوق.",
      variant: "destructive"
    });
  };

  const handleUpdateQuantity = (bookId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(bookId);
      return;
    }
    setCart(prevCart => prevCart.map(item => item.id === bookId ? {...item, quantity} : item));
  }

  const handleToggleWishlist = (book) => {
    setWishlist((prevWishlist) => {
      const isInWishlist = prevWishlist.find(item => item.id === book.id);
      if (isInWishlist) {
        toast({
          title: "تم الحذف من المفضلة",
          description: `تم حذف "${book.title}" من قائمة الرغبات.`,
          variant: "destructive"
        });
        return prevWishlist.filter(item => item.id !== book.id);
      } else {
        toast({
          title: "تمت الإضافة للمفضلة",
          description: `تم إضافة "${book.title}" إلى قائمة الرغبات.`,
        });
        return [...prevWishlist, book];
      }
    });
  };

  const handleOpenChat = (contact = { type: 'admin', name: 'الدعم' }) => {
    setChatContact(contact);
    setChatOpen(true);
  };
  
  const handleFeatureClick = (feature) => {
    if (feature === 'logout') {
      firebaseAuth.signOut().then(() => {
        toast({ title: 'تم تسجيل الخروج' });
      }).catch(error => {
        const errorObject = errorHandler.handleError(error, 'auth:signout');
        toast({
          title: 'خطأ في تسجيل الخروج',
          description: errorObject.message,
          variant: 'destructive'
        });
      });
      return;
    }
    if (feature.startsWith('change-language-')) {
      const code = feature.split('change-language-')[1];
      const lang = languages.find(l => l.code === code);
      if (lang) {
        setLanguage(lang);
        return;
      }
    }
    toast({
      title: "🚧 هذه الميزة غير مطبقة بعد",
      description: "لا تقلق! سيتم تطبيقها الأيام القادمة",
      duration: 3000,
    });
  };

  const PageLayout = ({ children, siteSettings }) => {
    const location = useLocation();
    return (
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { siteSettings });
          }
          return child;
        })}
      </motion.div>
    );
  };
  
  const MainLayout = ({ children, siteSettings }) => (
    <>
      <SEO
        title={siteSettings.siteName}
        description={siteSettings.description}
        keywords="كتب, متجر كتب, كتب صوتية, كتب إلكترونية, دار نشر"
      />
      <div className="min-h-screen bg-slate-100 text-gray-800">
        <Header
          handleFeatureClick={handleFeatureClick}
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          isCustomerLoggedIn={isCustomerLoggedIn}
          currentUser={currentUser}
          books={books}
          categories={categoriesState}
          siteSettings={siteSettings}
        />
        <div className="pb-16 md:pb-0">
          {children}
        </div>
        <Footer
          footerLinks={footerLinks}
          handleFeatureClick={handleFeatureClick}
          siteSettings={siteSettings}
        />
        <MobileBottomNav 
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        />
      </div>
    </>
  );

  if (isAppLoading) {
    return <SplashScreen siteSettings={siteSettingsState} />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="font-sans" dir="rtl">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Dashboard
                      dashboardStats={dashboardStatsState}
                      books={books}
                      authors={authors}
                      sellers={sellers}
                      branches={branches}
                      categories={categoriesState}
                      orders={orders}
                      payments={payments}
                      paymentMethods={paymentMethods}
                      plans={plans}
                      subscriptions={subscriptions}
                      dashboardSection={dashboardSection}
                      setDashboardSection={setDashboardSection}
                      handleFeatureClick={handleFeatureClick}
                      setBooks={setBooks}
                      setAuthors={setAuthors}
                      setSellers={setSellers}
                      setBranches={setBranches}
                      setCategories={setCategoriesState}
                      setOrders={setOrders}
                      setPayments={setPayments}
                      setPaymentMethods={setPaymentMethods}
                      currencies={currenciesState}
                      setCurrencies={setCurrenciesState}
                      languages={languages}
                      setLanguages={setLanguages}
                      setPlans={setPlans}
                      setSubscriptions={setSubscriptions}
                      users={users}
                      setUsers={setUsers}
                      messages={messages}
                      setMessages={setMessages}
                      notifications={notifications}
                      setNotifications={setNotifications}
                      siteSettings={siteSettingsState}
                      setSiteSettings={setSiteSettingsState}
                      sliders={heroSlidesState}
                      setSliders={setHeroSlidesState}
                      banners={bannersState}
                      setBanners={setBannersState}
                      features={features}
                      setFeatures={setFeatures}
                    />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/orders/:id"
                element={
                  <RequireAdmin>
                    <DashboardOrderDetailsPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <AdminLoginPage
                    onLogin={() => {
                      setIsAdminLoggedIn(true);
                      setIsCustomerLoggedIn(true);
                    }}
                    setCurrentUser={setCurrentUser}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  isCustomerLoggedIn ? (
                    <Navigate to="/profile" />
                  ) : (
                    <MainLayout siteSettings={siteSettingsState}>
                      <PageLayout siteSettings={siteSettingsState}>
                        <AuthPage onLogin={() => setIsCustomerLoggedIn(true)} />
                      </PageLayout>
                    </MainLayout>
                  )
                }
              />
              <Route path="/" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><HomePage books={books} authors={authors} heroSlides={heroSlidesState} banners={bannersState} categories={categoriesState} recentSearchBooks={recentSearchBooks} bestsellerBooks={bestsellerBooks} featuresData={features} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/book/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><BookDetailsPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} onOpenChat={handleOpenChat} /></PageLayout></MainLayout>} />
              <Route path="/author/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><AuthorPage authors={authors} books={books} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/search" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><SearchResultsPage books={books} categories={categoriesState} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/category/:categoryId" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><CategoryPage books={books} categories={categoriesState} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/cart" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><CartPage cart={cart} handleRemoveFromCart={handleRemoveFromCart} handleUpdateQuantity={handleUpdateQuantity} /></PageLayout></MainLayout>} />
              <Route
                path="/checkout"
                element={
                  isCustomerLoggedIn ? (
                    <MainLayout siteSettings={siteSettingsState}>
                      <PageLayout siteSettings={siteSettingsState}>
                        <CheckoutPage
                          cart={cart}
                          setCart={setCart}
                          setOrders={setOrders}
                          currentUser={currentUser}
                        />
                      </PageLayout>
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/subscribe/:planId"
                element={
                  isCustomerLoggedIn ? (
                    <MainLayout siteSettings={siteSettingsState}>
                      <PageLayout siteSettings={siteSettingsState}>
                        <SubscriptionCheckoutPage />
                      </PageLayout>
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isCustomerLoggedIn ? (
                    <MainLayout siteSettings={siteSettingsState}>
                      <PageLayout siteSettings={siteSettingsState}>
                        <UserProfilePage 
                          handleFeatureClick={handleFeatureClick}
                          currentUser={currentUser}
                        />
                      </PageLayout>
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/orders/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><OrderDetailsPage /></PageLayout></MainLayout>} />
              <Route path="/track-order" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><TrackOrderPage /></PageLayout></MainLayout>} />
              <Route path="/ebooks" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><EbookPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} wishlist={wishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/audiobooks" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><AudiobookPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} wishlist={wishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/read/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><ReadSamplePage books={books} /></PageLayout></MainLayout>} />
              <Route path="/reader/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><EbookReaderPage books={books} /></PageLayout></MainLayout>} />
              <Route path="/listen/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><ListenSamplePage books={books} /></PageLayout></MainLayout>} />
              <Route path="/player/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><AudiobookPlayerPage books={books} /></PageLayout></MainLayout>} />
              <Route path="/privacy-policy" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><PrivacyPolicyPage /></PageLayout></MainLayout>} />
              <Route path="/terms-of-service" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><TermsOfServicePage /></PageLayout></MainLayout>} />
              <Route path="/return-policy" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><ReturnPolicyPage /></PageLayout></MainLayout>} />
              <Route path="/authors" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><AuthorsSectionPage /></PageLayout></MainLayout>} />
              <Route path="/design-services" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><DesignServicesPage /></PageLayout></MainLayout>} />
              <Route path="/publishing-services" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><PublishingServicesPage /></PageLayout></MainLayout>} />
              <Route path="/publish" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><PublishPage /></PageLayout></MainLayout>} />
              <Route path="/about" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><AboutPage /></PageLayout></MainLayout>} />
              <Route path="/team" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><TeamPage /></PageLayout></MainLayout>} />
              <Route path="/blog" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><BlogPage /></PageLayout></MainLayout>} />
              <Route path="/blog/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><BlogDetailsPage /></PageLayout></MainLayout>} />
              <Route path="/blog-test" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><BlogTestPage /></PageLayout></MainLayout>} />
              <Route path="/help" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><HelpCenterPage /></PageLayout></MainLayout>} />
              <Route path="/distributors" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><DistributorsPage /></PageLayout></MainLayout>} />
              <Route path="/firebase-test" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><FirebaseTestPage /></PageLayout></MainLayout>} />
              <Route path="/image-test" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><ImageTestPage /></PageLayout></MainLayout>} />
<Route path="/store-settings" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><StoreSettingsPage /></PageLayout></MainLayout>} />
<Route path="*" element={<MainLayout siteSettings={siteSettingsState}><PageLayout siteSettings={siteSettingsState}><NotFoundPage /></PageLayout></MainLayout>} />
            </Routes>
          </AnimatePresence>
          <Toaster />
          <AddToCartDialog
            open={cartDialogOpen}
            onOpenChange={setCartDialogOpen}
            book={cartDialogBook}
            handleAddToCart={handleAddToCart}
            handleToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            authors={authors}
          />
          <ChatWidget
            open={chatOpen}
            onOpenChange={setChatOpen}
            contact={chatContact}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
