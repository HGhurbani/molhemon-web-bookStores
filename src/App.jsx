
import React, { useState, useEffect, Suspense } from 'react';
import { useCurrency, detectUserCurrency } from '@/lib/currencyContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast.js';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { useAuth } from '@/lib/authContext.jsx';
import { useCart } from '@/lib/cartContext.jsx';
import { useFavorites } from '@/lib/favoritesContext.jsx';
import { useSettings } from '@/lib/settingsContext.jsx';
const AdminRoutes = React.lazy(() => import('@/routes/AdminRoutes.jsx'));
const ShopRoutes = React.lazy(() => import('@/routes/ShopRoutes.jsx'));
import AddToCartDialog from '@/components/AddToCartDialog.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ChatWidget from '@/components/ChatWidget.jsx';
import SplashScreen from '@/components/SplashScreen.jsx';

import { sellers as initialSellers, branches as initialBranches, paymentMethods as initialPaymentMethods } from '@/data/siteData.js';
import api from '@/lib/api.js';
import { TrendingUp, BookOpen, Users, DollarSign, Eye } from 'lucide-react';
import { useLanguage, defaultLanguages } from '@/lib/languageContext.jsx';
import { jwtAuthManager, firebaseAuth } from '@/lib/jwtAuth.js';
import { errorHandler } from '@/lib/errorHandler.js';

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [dashboardSection, setDashboardSection] = useState('overview');
  const { isAdmin: isAdminLoggedIn, isCustomer: isCustomerLoggedIn, currentUser, login } = useAuth();
  const { setLanguage, setLanguages, languages } = useLanguage();
  const { cart, setCart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { favorites: wishlist, toggleFavorite } = useFavorites();
  const { settings: siteSettingsState, setSettings: setSiteSettingsState } = useSettings();
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
  const [users, setUsers] = useState([]);
  const [categoriesState, setCategoriesState] = useState([]);
  const [orders, setOrders] = useState([]);
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

  // تحميل البيانات من Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsAppLoading(true);
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

  // تم إيقاف التخزين المحلي للمستخدمين والطلبات؛ يتم إدارة هذه البيانات عبر Firestore

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
    addToCart(book);
    setCartDialogBook(book);
    setCartDialogOpen(true);
  };

  const handleRemoveFromCart = (bookId) => {
    removeFromCart(bookId);
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
    updateQuantity(bookId, quantity);
  }

  const handleToggleWishlist = (book) => {
    const exists = wishlist.find(item => item.id === book.id);
    toggleFavorite(book);
    if (exists) {
      toast({
        title: "تم الحذف من المفضلة",
        description: `تم حذف \"${book.title}\" من قائمة الرغبات.`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "تمت الإضافة للمفضلة",
        description: `تم إضافة \"${book.title}\" إلى قائمة الرغبات.`,
      });
    }
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

  if (isAppLoading) {
    return <SplashScreen siteSettings={siteSettingsState} />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="font-sans" dir="rtl">
          <AnimatePresence mode="wait">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoutes
                      dashboardProps={{
                        dashboardStats: dashboardStatsState,
                        books,
                        authors,
                        sellers,
                        branches,
                        categories: categoriesState,
                        orders,
                        payments,
                        paymentMethods,
                        plans,
                        subscriptions,
                        dashboardSection,
                        setDashboardSection,
                        handleFeatureClick,
                        setBooks,
                        setAuthors,
                        setSellers,
                        setBranches,
                        setCategories: setCategoriesState,
                        setOrders,
                        setPayments,
                        setPaymentMethods,
                        currencies: currenciesState,
                        setCurrencies: setCurrenciesState,
                        languages,
                        setLanguages,
                        setPlans,
                        setSubscriptions,
                        users,
                        setUsers,
                        messages,
                        setMessages,
                        notifications,
                        setNotifications,
                        siteSettings: siteSettingsState,
                        setSiteSettings: setSiteSettingsState,
                        sliders: heroSlidesState,
                        setSliders: setHeroSlidesState,
                        banners: bannersState,
                        setBanners: setBannersState,
                        features,
                        setFeatures
                      }}
                    />
                  }
                />
                <Route
                  path="/*"
                  element={
                    <ShopRoutes
                      isCustomerLoggedIn={isCustomerLoggedIn}
                      login={login}
                      currentUser={currentUser}
                      books={books}
                      authors={authors}
                      categories={categoriesState}
                      cart={cart}
                      setCart={setCart}
                      setOrders={setOrders}
                      handleAddToCart={handleAddToCart}
                      handleRemoveFromCart={handleRemoveFromCart}
                      handleUpdateQuantity={handleUpdateQuantity}
                      handleToggleWishlist={handleToggleWishlist}
                      handleFeatureClick={handleFeatureClick}
                      handleOpenChat={handleOpenChat}
                      recentSearchBooks={recentSearchBooks}
                      bestsellerBooks={bestsellerBooks}
                      heroSlides={heroSlidesState}
                      banners={bannersState}
                      wishlist={wishlist}
                      siteSettings={siteSettingsState}
                      features={features}
                    />
                  }
                />
              </Routes>
            </Suspense>
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
