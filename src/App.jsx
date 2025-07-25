
import React, { useState, useEffect } from 'react';
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

import HomePage from '@/pages/HomePage.jsx';
import BookDetailsPage from '@/pages/BookDetailsPage.jsx';
import AuthorPage from '@/pages/AuthorPage.jsx';
import CategoryPage from '@/pages/CategoryPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import CheckoutPage from '@/pages/CheckoutPage.jsx';
import UserProfilePage from '@/pages/UserProfilePage.jsx';
import OrderDetailsPage from '@/pages/OrderDetailsPage.jsx';
import DashboardOrderDetailsPage from '@/pages/DashboardOrderDetailsPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import AudiobookPage from '@/pages/AudiobookPage.jsx';
import EbookPage from '@/pages/EbookPage.jsx';
import ReadSamplePage from '@/pages/ReadSamplePage.jsx';
import ListenSamplePage from '@/pages/ListenSamplePage.jsx';
import EbookReaderPage from '@/pages/EbookReaderPage.jsx';
import AudiobookPlayerPage from '@/pages/AudiobookPlayerPage.jsx';
import SearchResultsPage from '@/pages/SearchResultsPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import ReturnPolicyPage from '@/pages/ReturnPolicyPage.jsx';
import AddToCartDialog from '@/components/AddToCartDialog.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ChatWidget from '@/components/ChatWidget.jsx';

import { sellers as initialSellers, branches as initialBranches, customers as initialCustomers, footerLinks, siteSettings as initialSiteSettings, paymentMethods as initialPaymentMethods } from '@/data/siteData.js';
import api from '@/lib/api.js';
import { TrendingUp, BookOpen, Users, DollarSign, Eye } from 'lucide-react';
import { useLanguage, languages } from '@/lib/languageContext.jsx';

const App = () => {
  const [dashboardSection, setDashboardSection] = useState('overview');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('adminLoggedIn') === 'true');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(localStorage.getItem('customerLoggedIn') === 'true');
  const { setLanguage } = useLanguage();
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
  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem('customers');
    return stored ? JSON.parse(stored) : initialCustomers;
  });
  const [users, setUsers] = useState([]);
  const [categoriesState, setCategoriesState] = useState([]);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders') || '[]'));
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem('payments') || '[]'));
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const stored = localStorage.getItem('paymentMethods');
    return stored ? JSON.parse(stored) : initialPaymentMethods;
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

  const bestsellerBooks = React.useMemo(() => {
    return [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  }, [books]);

  const recentSearchBooks = React.useMemo(() => {
    return books.slice(3, 6).concat(books.slice(0, 3));
  }, [books]);

  useEffect(() => {
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
    (async () => {
      try {
        const [b, a, c, s, o, pay, methods, p, u, sliders, banners, feats, sellData, branchData, custData, subs] = await Promise.all([
          api.getBooks(),
          api.getAuthors(),
          api.getCategories(),
          api.getSettings(),
          api.getOrders(),
          api.getPayments(),
          api.getPaymentMethods(),
          api.getPlans(),
          api.getUsers(),
          api.getSliders(),
          api.getBanners(),
          api.getFeatures(),
          api.getSellers(),
          api.getBranches(),
          api.getCustomers(),
          api.getSubscriptions(),
        ]);
        setBooks(b);
        setAuthors(a);
        setCategoriesState(c);
        setSiteSettingsState(prev => ({ ...prev, ...s }));
        setOrders(o);
        setPayments(pay);
        setPaymentMethods(methods);
        setPlans(p);
        setUsers(u);
        setHeroSlidesState(sliders);
        setBannersState(banners);
        setFeatures(feats);
        setSellers(sellData);
        setBranches(branchData);
        setCustomers(custData);
        setSubscriptions(subs);
        const sales = pay.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        setDashboardStatsState([
          { title: 'إجمالي الكتب', value: b.length, icon: BookOpen, color: 'bg-blue-500' },
          { title: 'المؤلفون', value: a.length, icon: Users, color: 'bg-green-500' },
          { title: 'المبيعات', value: `${sales.toLocaleString()} د.إ`, icon: DollarSign, color: 'bg-purple-500' },
          { title: 'العملاء', value: custData.length, icon: Eye, color: 'bg-orange-500' },
        ]);
      } catch (err) {
        console.error('API fetch failed', err);
      }
    })();
  }, []);

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
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);


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
    const sales = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    setDashboardStatsState([
      { title: 'إجمالي الكتب', value: books.length, icon: BookOpen, color: 'bg-blue-500' },
      { title: 'المؤلفون', value: authors.length, icon: Users, color: 'bg-green-500' },
      { title: 'المبيعات', value: `${sales.toLocaleString()} د.إ`, icon: DollarSign, color: 'bg-purple-500' },
      { title: 'العملاء', value: customers.length, icon: Eye, color: 'bg-orange-500' },
    ]);
  }, [books, authors, payments, customers]);

  useEffect(() => {
    if (siteSettingsState.siteName) {
      document.title = siteSettingsState.siteName;
    }
  }, [siteSettingsState.siteName]);

  useEffect(() => {
    if (siteSettingsState.defaultLanguage) {
      const lang = languages.find(l => l.code === siteSettingsState.defaultLanguage);
      if (lang) setLanguage(lang);
    }
  }, [siteSettingsState.defaultLanguage, setLanguage]);

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
      localStorage.removeItem('customerLoggedIn');
      setIsCustomerLoggedIn(false);
      toast({ title: 'تم تسجيل الخروج' });
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

  const PageLayout = ({ children }) => {
    const location = useLocation();
    return (
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
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
          books={books}
          categories={categoriesState}
          siteSettings={siteSettings}
        />
        {children}
        <Footer
          footerLinks={footerLinks}
          handleFeatureClick={handleFeatureClick}
          siteSettings={siteSettings}
        />
      </div>
    </>
  );

  return (
    <Router>
      <ScrollToTop />
      <div className="font-sans" dir="rtl">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/admin"
              element={
                isAdminLoggedIn ? (
                  <Dashboard
                    dashboardStats={dashboardStatsState}
                    books={books}
                    authors={authors}
                    sellers={sellers}
                    branches={branches}
                    customers={customers}
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
                    setCustomers={setCustomers}
                    setCategories={setCategoriesState}
                    setOrders={setOrders}
                    setPayments={setPayments}
                    setPaymentMethods={setPaymentMethods}
                    setPlans={setPlans}
                    setSubscriptions={setSubscriptions}
                    users={users}
                    setUsers={setUsers}
                    siteSettings={siteSettingsState}
                    setSiteSettings={setSiteSettingsState}
                    sliders={heroSlidesState}
                    setSliders={setHeroSlidesState}
                    banners={bannersState}
                    setBanners={setBannersState}
                    features={features}
                    setFeatures={setFeatures}
                  />
                ) : (
                  <AdminLoginPage onLogin={() => setIsAdminLoggedIn(true)} />
                )
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                isAdminLoggedIn ? (
                  <DashboardOrderDetailsPage />
                ) : (
                  <AdminLoginPage onLogin={() => setIsAdminLoggedIn(true)} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isCustomerLoggedIn ? (
                  <Navigate to="/profile" />
                ) : (
                  <MainLayout siteSettings={siteSettingsState}><PageLayout><AuthPage onLogin={() => setIsCustomerLoggedIn(true)} /></PageLayout></MainLayout>
                )
              }
            />
            <Route path="/" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><HomePage books={books} authors={authors} heroSlides={heroSlidesState} banners={bannersState} categories={categoriesState} recentSearchBooks={recentSearchBooks} bestsellerBooks={bestsellerBooks} featuresData={features} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/book/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><BookDetailsPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} onOpenChat={handleOpenChat} /></PageLayout></MainLayout>} />
              <Route path="/author/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><AuthorPage authors={authors} books={books} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/search" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><SearchResultsPage books={books} categories={categoriesState} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/category/:categoryId" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><CategoryPage books={books} categories={categoriesState} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/cart" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><CartPage cart={cart} handleRemoveFromCart={handleRemoveFromCart} handleUpdateQuantity={handleUpdateQuantity} /></PageLayout></MainLayout>} />
              <Route
                path="/checkout"
                element={
                  isCustomerLoggedIn ? (
                    <MainLayout siteSettings={siteSettingsState}>
                      <PageLayout>
                        <CheckoutPage
                          cart={cart}
                          setCart={setCart}
                          setOrders={setOrders}
                        />
                      </PageLayout>
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/profile" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><UserProfilePage handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/orders/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><OrderDetailsPage /></PageLayout></MainLayout>} />
              <Route path="/ebooks" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><EbookPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} wishlist={wishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/audiobooks" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><AudiobookPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} wishlist={wishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/read/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><ReadSamplePage books={books} /></PageLayout></MainLayout>} />
              <Route path="/reader/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><EbookReaderPage books={books} /></PageLayout></MainLayout>} />
              <Route path="/listen/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><ListenSamplePage books={books} /></PageLayout></MainLayout>} />
              <Route path="/player/:id" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><AudiobookPlayerPage books={books} /></PageLayout></MainLayout>} />
              <Route path="/privacy-policy" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><PrivacyPolicyPage /></PageLayout></MainLayout>} />
              <Route path="/terms-of-service" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><TermsOfServicePage /></PageLayout></MainLayout>} />
              <Route path="/return-policy" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><ReturnPolicyPage /></PageLayout></MainLayout>} />
              <Route path="*" element={<MainLayout siteSettings={siteSettingsState}><PageLayout><NotFoundPage /></PageLayout></MainLayout>} />
            </Routes>
        </AnimatePresence>
        <Toaster />
        <AddToCartDialog
          open={cartDialogOpen}
          onOpenChange={setCartDialogOpen}
          book={cartDialogBook}
          recommendedBooks={books.filter(b => cartDialogBook ? b.id !== cartDialogBook.id : true).slice(0,6)}
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
  );
};

export default App;
