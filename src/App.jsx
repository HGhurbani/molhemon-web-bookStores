
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Dashboard from '@/components/Dashboard.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import CustomerLoginPage from '@/pages/CustomerLoginPage.jsx';

import HomePage from '@/pages/HomePage.jsx';
import BookDetailsPage from '@/pages/BookDetailsPage.jsx';
import AuthorPage from '@/pages/AuthorPage.jsx';
import CategoryPage from '@/pages/CategoryPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import CheckoutPage from '@/pages/CheckoutPage.jsx';
import UserProfilePage from '@/pages/UserProfilePage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import AddToCartDialog from '@/components/AddToCartDialog.jsx';

import { categories as initialCategories, books as initialBooks, authors as initialAuthors, dashboardStats, footerLinks, featuresData, heroSlides, recentSearchBooks, bestsellerBooks } from '@/data/siteData.js';
import { TrendingUp } from 'lucide-react';

const App = () => {
  const [dashboardSection, setDashboardSection] = useState('overview');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('adminLoggedIn') === 'true');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(localStorage.getItem('customerLoggedIn') === 'true');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [books, setBooks] = useState(initialBooks);
  const [authors, setAuthors] = useState(initialAuthors);
  const [categoriesState, setCategoriesState] = useState(initialCategories);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders') || '[]'));
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [cartDialogBook, setCartDialogBook] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    const storedAuthors = localStorage.getItem('authors');
    if (storedAuthors) setAuthors(JSON.parse(storedAuthors));
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
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
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

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
  
  const handleFeatureClick = (feature) => {
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
  
  const MainLayout = ({ children }) => (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <Header
        handleFeatureClick={handleFeatureClick}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      {children}
      <Footer footerLinks={footerLinks} handleFeatureClick={handleFeatureClick} />
    </div>
  );

  return (
    <Router>
      <div className="font-sans" dir="rtl">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/admin"
              element={
                isAdminLoggedIn ? (
                  <Dashboard
                    dashboardStats={dashboardStats}
                    books={books}
                    authors={authors}
                    categories={categoriesState}
                    orders={orders}
                    dashboardSection={dashboardSection}
                    setDashboardSection={setDashboardSection}
                    handleFeatureClick={handleFeatureClick}
                    setBooks={setBooks}
                    setAuthors={setAuthors}
                    setCategories={setCategoriesState}
                    setOrders={setOrders}
                  />
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
                  <MainLayout><PageLayout><CustomerLoginPage onLogin={() => setIsCustomerLoggedIn(true)} /></PageLayout></MainLayout>
                )
              }
            />
            <Route path="/" element={<MainLayout><PageLayout><HomePage books={books} authors={authors} heroSlides={heroSlides} categories={categoriesState} recentSearchBooks={recentSearchBooks} bestsellerBooks={bestsellerBooks} featuresData={featuresData} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="/book/:id" element={<MainLayout><PageLayout><BookDetailsPage books={books} authors={authors} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/author/:id" element={<MainLayout><PageLayout><AuthorPage authors={authors} books={books} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/category/:categoryId" element={<MainLayout><PageLayout><CategoryPage books={books} categories={categoriesState} handleAddToCart={handleAddToCart} handleToggleWishlist={handleToggleWishlist} /></PageLayout></MainLayout>} />
              <Route path="/cart" element={<MainLayout><PageLayout><CartPage cart={cart} handleRemoveFromCart={handleRemoveFromCart} handleUpdateQuantity={handleUpdateQuantity} /></PageLayout></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><PageLayout><CheckoutPage cart={cart} setCart={setCart} /></PageLayout></MainLayout>} />
              <Route path="/profile" element={<MainLayout><PageLayout><UserProfilePage handleFeatureClick={handleFeatureClick} /></PageLayout></MainLayout>} />
              <Route path="*" element={<MainLayout><PageLayout><NotFoundPage /></PageLayout></MainLayout>} />
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
      </div>
    </Router>
  );
};

export default App;
