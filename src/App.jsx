
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useCurrency, detectUserCurrency } from '@/lib/currencyContext.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { useTranslation } from 'react-i18next';
import {
  defaultLanguages,
  ensureLanguageList,
  getStoredLanguageCode,
  getStoredLanguages,
  storeLanguageCode,
  storeLanguages,
} from '@/lib/languagePreferences.js';
import { jwtAuthManager, firebaseAuth } from '@/lib/jwtAuth.js';
import { errorHandler } from '@/lib/errorHandler.js';
import useDirection from '@/lib/useDirection.js';

const AppContent = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [dashboardSection, setDashboardSection] = useState('overview');
  const { t, i18n } = useTranslation();
  const activeLanguage = i18n.language || i18n.resolvedLanguage || 'ar';
  const handleErrorWithLanguage = useCallback(
    (error, context) => errorHandler.handleError(error, context, activeLanguage),
    [activeLanguage],
  );
  useDirection(i18n);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { isAdmin: isAdminLoggedIn, isCustomer: isCustomerLoggedIn, currentUser, login } = useAuth();
  const [languages, setLanguagesState] = useState(() => getStoredLanguages());
  const setLanguages = useCallback((nextLanguages) => {
    setLanguagesState((prev) => {
      const value = typeof nextLanguages === 'function' ? nextLanguages(prev) : nextLanguages;
      return ensureLanguageList(value);
    });
  }, []);
  const { cart, setCart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { favorites: wishlist, toggleFavorite } = useFavorites();
  const { settings: siteSettingsState, setSettings: setSiteSettingsState, refreshSettings } = useSettings();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState({ type: 'admin', name: t('app.chat.supportName', { defaultValue: 'Support' }) });
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

  const showDataLoadError = useCallback((resourceKey, errorObject) => {
    const genericTitle = t('app.toast.loadError.generic.title', { defaultValue: 'Error loading data' });
    toast({
      title: t(`app.toast.loadError.${resourceKey}.title`, { defaultValue: genericTitle }),
      description: t('app.toast.loadError.description', {
        message: errorObject.message,
        defaultValue: errorObject.message,
      }),
      variant: 'destructive',
    });
  }, [t]);

  const localizeBook = useCallback(
    (book) => ({
      ...book,
      title: t(book?.title, { defaultValue: book?.title }),
      author: t(book?.author, { defaultValue: book?.author }),
      description: t(book?.description, { defaultValue: book?.description }),
      imgPlaceholder: t(book?.imgPlaceholder, { defaultValue: book?.imgPlaceholder }),
      publisher: t(book?.publisher, { defaultValue: book?.publisher }),
      format: t(book?.format, { defaultValue: book?.format }),
      deliveryMethod: t(book?.deliveryMethod, { defaultValue: book?.deliveryMethod }),
    }),
    [t],
  );

  const localizeAuthor = useCallback(
    (author) => ({
      ...author,
      name: t(author?.name, { defaultValue: author?.name }),
      imgPlaceholder: t(author?.imgPlaceholder, { defaultValue: author?.imgPlaceholder }),
      bio: t(author?.bio, { defaultValue: author?.bio }),
    }),
    [t],
  );

  const localizeCategory = useCallback(
    (category) => ({
      ...category,
      name: t(category?.name, { defaultValue: category?.name }),
    }),
    [t],
  );

  const localizeFeature = useCallback(
    (feature) => ({
      ...feature,
      title: t(feature?.title, { defaultValue: feature?.title }),
      description: t(feature?.description, { defaultValue: feature?.description }),
    }),
    [t],
  );

  const localizeSeller = useCallback(
    (seller) => ({
      ...seller,
      name: t(seller?.name, { defaultValue: seller?.name }),
    }),
    [t],
  );

  const localizeBranch = useCallback(
    (branch) => ({
      ...branch,
      name: t(branch?.name, { defaultValue: branch?.name }),
      address: t(branch?.address, { defaultValue: branch?.address }),
    }),
    [t],
  );
  
  useEffect(() => {
    storeLanguages(languages);
  }, [languages]);

  useEffect(() => {
    setChatContact((prev) => {
      if (!prev || prev.type !== 'admin') {
        return prev;
      }
      const name = t('app.chat.supportName', { defaultValue: 'Support' });
      return prev.name === name ? prev : { ...prev, name };
    });
  }, [t]);
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

  const localizedBooks = React.useMemo(() => books.map(localizeBook), [books, localizeBook]);
  const localizedRecentSearchBooks = React.useMemo(() => recentSearchBooks.map(localizeBook), [recentSearchBooks, localizeBook]);
  const localizedBestsellerBooks = React.useMemo(() => bestsellerBooks.map(localizeBook), [bestsellerBooks, localizeBook]);
  const localizedAuthors = React.useMemo(() => authors.map(localizeAuthor), [authors, localizeAuthor]);
  const localizedCategories = React.useMemo(() => categoriesState.map(localizeCategory), [categoriesState, localizeCategory]);
  const localizedFeatures = React.useMemo(() => features.map(localizeFeature), [features, localizeFeature]);
  const localizedSellers = React.useMemo(() => sellers.map(localizeSeller), [sellers, localizeSeller]);
  const localizedBranches = React.useMemo(() => branches.map(localizeBranch), [branches, localizeBranch]);

  // تحميل البيانات من Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsAppLoading(true);
        // تحميل البيانات من Firebase
        const [b, a, c, _settings, o, pay, methods, currenciesData, languagesData, p, u, sliders, banners, feats, sellData, branchData, subs, msgs] = await Promise.all([
          api.getBooks().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:books');
            showDataLoadError('books', errorObject);
            return [];
          }),
          api.getAuthors().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:authors');
            showDataLoadError('authors', errorObject);
            return [];
          }),
          api.getCategories().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:categories');
            showDataLoadError('categories', errorObject);
            return [];
          }),
          refreshSettings(true).catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:settings');
            showDataLoadError('settings', errorObject);
            return {};
          }),
          api.getOrders().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:orders');
            showDataLoadError('orders', errorObject);
            return [];
          }),
          api.getPayments().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:payments');
            showDataLoadError('payments', errorObject);
            return [];
          }),
          api.getPaymentMethods().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:payment-methods');
            showDataLoadError('paymentMethods', errorObject);
            return [];
          }),
          api.getCurrencies().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:currencies');
            showDataLoadError('currencies', errorObject);
            return [];
          }),
          api.getLanguages().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:languages');
            showDataLoadError('languages', errorObject);
            return [];
          }),
          api.getPlans().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:plans');
            showDataLoadError('plans', errorObject);
            return [];
          }),
          api.getUsers().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:users');
            showDataLoadError('users', errorObject);
            return [];
          }),
          api.getSliders().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:sliders');
            showDataLoadError('sliders', errorObject);
            return [];
          }),
          api.getBanners().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:banners');
            showDataLoadError('banners', errorObject);
            return [];
          }),
          api.getFeatures().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:features');
            showDataLoadError('features', errorObject);
            return [];
          }),
          api.getSellers().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:sellers');
            showDataLoadError('sellers', errorObject);
            return [];
          }),
          api.getBranches().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:branches');
            showDataLoadError('branches', errorObject);
            return [];
          }),
          api.getSubscriptions().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:subscriptions');
            showDataLoadError('subscriptions', errorObject);
            return [];
          }),
          api.getMessages().catch(error => {
            const errorObject = handleErrorWithLanguage(error, 'data:messages');
            showDataLoadError('messages', errorObject);
            return [];
          }),
        ]);

        // تحديث الحالة
        setBooks(b);
        setAuthors(a);
        setCategoriesState(c);
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
          { title: 'siteData.dashboardStats.totalBooks', value: b.length, icon: BookOpen, color: 'bg-blue-500' },
          { title: 'siteData.dashboardStats.authors', value: a.length, icon: Users, color: 'bg-green-500' },
          { title: 'siteData.dashboardStats.salesToday', value: `${sales.toLocaleString()} د.إ`, icon: DollarSign, color: 'bg-purple-500' },
          { title: 'siteData.dashboardStats.visitors', value: u.length, icon: Eye, color: 'bg-orange-500' },
        ]);

      } catch (error) {
        const errorObject = handleErrorWithLanguage(error, 'data:initial-load');
        showDataLoadError('initialLoad', errorObject);
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
      { title: t('siteData.dashboardStats.totalBooks', { defaultValue: 'Total Books' }), value: books.length, icon: BookOpen, color: 'bg-blue-500' },
      { title: t('siteData.dashboardStats.authors', { defaultValue: 'Authors' }), value: authors.length, icon: Users, color: 'bg-green-500' },
      { title: t('siteData.dashboardStats.salesToday', { defaultValue: 'Sales' }), value: `${sales.toLocaleString()} د.إ`, icon: DollarSign, color: 'bg-purple-500' },
      { title: t('siteData.dashboardStats.visitors', { defaultValue: 'Visitors' }), value: users.length, icon: Eye, color: 'bg-orange-500' },
    ]);
  }, [books, authors, payments, users, t]);

  // تحديث عنوان الصفحة
  useEffect(() => {
    if (siteSettingsState.siteName) {
      document.title = siteSettingsState.siteName;
    }
  }, [siteSettingsState.siteName]);

  // تحديث اللغة الافتراضية
  useEffect(() => {
    const storedLanguage = getStoredLanguageCode();
    const preferredLanguageFromSettings =
      isAdmin && siteSettingsState.adminDefaultLanguage
        ? siteSettingsState.adminDefaultLanguage
        : siteSettingsState.defaultLanguage;

    const fallbackLanguage = languages.length ? languages[0].code : null;

    let nextLanguage = storedLanguage || preferredLanguageFromSettings || fallbackLanguage;

    if (nextLanguage && !languages.some((language) => language.code === nextLanguage)) {
      nextLanguage = fallbackLanguage;
    }

    if (!nextLanguage) {
      return;
    }

    if (i18n.language !== nextLanguage) {
      void i18n.changeLanguage(nextLanguage);
    }

    storeLanguageCode(nextLanguage);
  }, [
    i18n,
    isAdmin,
    languages,
    siteSettingsState.adminDefaultLanguage,
    siteSettingsState.defaultLanguage,
  ]);

  useEffect(() => {
    const activeLanguage = i18n.language || i18n.resolvedLanguage;
    if (activeLanguage) {
      storeLanguageCode(activeLanguage);
    }
  }, [i18n.language, i18n.resolvedLanguage]);

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
      title: t('app.toast.cart.remove.title', { defaultValue: 'Removed from cart' }),
      description: t('app.toast.cart.remove.description', { defaultValue: 'The item was removed from your cart.' }),
      variant: 'destructive'
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
        title: t('app.toast.wishlist.removed.title', { defaultValue: 'Removed from wishlist' }),
        description: t('app.toast.wishlist.removed.description', {
          book: t(book.title, { defaultValue: book.title }),
          defaultValue: `"${book.title}" was removed from your wishlist.`,
        }),
        variant: 'destructive'
      });
    } else {
      toast({
        title: t('app.toast.wishlist.added.title', { defaultValue: 'Added to wishlist' }),
        description: t('app.toast.wishlist.added.description', {
          book: t(book.title, { defaultValue: book.title }),
          defaultValue: `"${book.title}" was added to your wishlist.`,
        }),
      });
    }
  };

  const handleOpenChat = (contact = { type: 'admin', name: t('app.chat.supportName', { defaultValue: 'Support' }) }) => {
    setChatContact(contact);
    setChatOpen(true);
  };
  
  const handleFeatureClick = (feature) => {
    if (feature === 'logout') {
      firebaseAuth.signOut().then(() => {
        toast({ title: t('app.toast.logout.success', { defaultValue: 'You have been signed out.' }) });
      }).catch(error => {
        const errorObject = handleErrorWithLanguage(error, 'auth:signout');
        toast({
          title: t('app.toast.logout.error.title', { defaultValue: 'Sign out failed' }),
          description: t('app.toast.logout.error.description', {
            message: errorObject.message,
            defaultValue: errorObject.message,
          }),
          variant: 'destructive'
        });
      });
      return;
    }
    toast({
      title: t('app.toast.feature.unavailable.title', { defaultValue: 'This feature is coming soon' }),
      description: t('app.toast.feature.unavailable.description', { defaultValue: 'Hang tight! We are working on it.' }),
      duration: 3000,
    });
  };

  if (isAppLoading) {
    return <SplashScreen siteSettings={siteSettingsState} />;
  }

  return (
    <>
      <ScrollToTop />
      <div className="font-sans" dir={i18n.dir()}>
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
                      books={localizedBooks}
                      authors={localizedAuthors}
                      categories={localizedCategories}
                      cart={cart}
                      setCart={setCart}
                      setOrders={setOrders}
                      handleAddToCart={handleAddToCart}
                      handleRemoveFromCart={handleRemoveFromCart}
                      handleUpdateQuantity={handleUpdateQuantity}
                      handleToggleWishlist={handleToggleWishlist}
                      handleFeatureClick={handleFeatureClick}
                      handleOpenChat={handleOpenChat}
                      recentSearchBooks={localizedRecentSearchBooks}
                      bestsellerBooks={localizedBestsellerBooks}
                      heroSlides={heroSlidesState}
                      banners={bannersState}
                      wishlist={wishlist}
                      siteSettings={siteSettingsState}
                      features={localizedFeatures}
                      languages={languages}
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
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <Router>
      <AppContent />
    </Router>
  </ErrorBoundary>
);

export default App;
