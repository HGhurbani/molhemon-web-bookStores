import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SEO from '@/components/SEO.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import { footerLinks } from '@/data/siteData.js';

const AuthPage = React.lazy(() => import('@/pages/AuthPage.jsx'));
const HomePage = React.lazy(() => import('@/pages/HomePage.jsx'));
const BookDetailsPage = React.lazy(() => import('@/pages/BookDetailsPage.jsx'));
const AuthorPage = React.lazy(() => import('@/pages/AuthorPage.jsx'));
const CategoryPage = React.lazy(() => import('@/pages/CategoryPage.jsx'));
const CartPage = React.lazy(() => import('@/pages/CartPage.jsx'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage.jsx'));
const UserProfilePage = React.lazy(() => import('@/pages/UserProfilePage.jsx'));
const OrderDetailsPage = React.lazy(() => import('@/pages/OrderDetailsPage.jsx'));
const TrackOrderPage = React.lazy(() => import('@/pages/TrackOrderPage.jsx'));
const AudiobookPage = React.lazy(() => import('@/pages/AudiobookPage.jsx'));
const EbookPage = React.lazy(() => import('@/pages/EbookPage.jsx'));
const ReadSamplePage = React.lazy(() => import('@/pages/ReadSamplePage.jsx'));
const ListenSamplePage = React.lazy(() => import('@/pages/ListenSamplePage.jsx'));
const EbookReaderPage = React.lazy(() => import('@/pages/EbookReaderPage.jsx'));
const AudiobookPlayerPage = React.lazy(() => import('@/pages/AudiobookPlayerPage.jsx'));
const SubscriptionCheckoutPage = React.lazy(() => import('@/pages/SubscriptionCheckoutPage.jsx'));
const SearchResultsPage = React.lazy(() => import('@/pages/SearchResultsPage.jsx'));
const PrivacyPolicyPage = React.lazy(() => import('@/pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage = React.lazy(() => import('@/pages/TermsOfServicePage.jsx'));
const ReturnPolicyPage = React.lazy(() => import('@/pages/ReturnPolicyPage.jsx'));
const AuthorsSectionPage = React.lazy(() => import('@/pages/AuthorsSectionPage.jsx'));
const DesignServicesPage = React.lazy(() => import('@/pages/DesignServicesPage.jsx'));
const PublishingServicesPage = React.lazy(() => import('@/pages/PublishingServicesPage.jsx'));
const PublishPage = React.lazy(() => import('@/pages/PublishPage.jsx'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage.jsx'));
const TeamPage = React.lazy(() => import('@/pages/TeamPage.jsx'));
const BlogPage = React.lazy(() => import('@/pages/BlogPage.jsx'));
const BlogDetailsPage = React.lazy(() => import('@/pages/BlogDetailsPage.jsx'));
const BlogTestPage = React.lazy(() => import('@/pages/BlogTestPage.jsx'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage.jsx'));
const DistributorsPage = React.lazy(() => import('@/pages/DistributorsPage.jsx'));
const StoreSettingsPage = React.lazy(() => import('@/pages/StoreSettingsPage.jsx'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage.jsx'));

const ShopRoutes = ({
  isCustomerLoggedIn,
  login,
  currentUser,
  books,
  authors,
  categories,
  cart,
  setCart,
  setOrders,
  handleAddToCart,
  handleRemoveFromCart,
  handleUpdateQuantity,
  handleToggleWishlist,
  handleFeatureClick,
  handleOpenChat,
  recentSearchBooks,
  bestsellerBooks,
  heroSlides,
  banners,
  wishlist,
  siteSettings,
  features,
  languages,
}) => {
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
        {React.Children.map(children, child =>
          React.isValidElement(child) ? React.cloneElement(child, { siteSettings }) : child
        )}
      </motion.div>
    );
  };

  const MainLayout = ({ children }) => (
    <>
      <SEO
        title={siteSettings.siteName}
        description={siteSettings.description}
        keywords="كتب, متجر كتب, كتب صوتية, كتب إلكترونية, دار نشر"
      />
      <div className="min-h-screen bg-slate-100 text-gray-800">
        <Header
          handleFeatureClick={handleFeatureClick}
          books={books}
          categories={categories}
          siteSettings={siteSettings}
          languages={languages}
        />
        <div className="pb-16 md:pb-0">{children}</div>
        <Footer
          footerLinks={footerLinks}
          handleFeatureClick={handleFeatureClick}
          siteSettings={siteSettings}
        />
        <MobileBottomNav />
      </div>
    </>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/login"
          element={
            isCustomerLoggedIn ? (
              <Navigate to="/profile" />
            ) : (
              <MainLayout>
                <PageLayout>
                  <AuthPage onLogin={login} />
                </PageLayout>
              </MainLayout>
            )
          }
        />
        <Route
          path="/"
          element={
            <MainLayout>
              <PageLayout>
                <HomePage
                  books={books}
                  authors={authors}
                  heroSlides={heroSlides}
                  banners={banners}
                  categories={categories}
                  recentSearchBooks={recentSearchBooks}
                  bestsellerBooks={bestsellerBooks}
                  featuresData={features}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                  handleFeatureClick={handleFeatureClick}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/book/:id"
          element={
            <MainLayout>
              <PageLayout>
                <BookDetailsPage
                  books={books}
                  authors={authors}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                  onOpenChat={handleOpenChat}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/author/:id"
          element={
            <MainLayout>
              <PageLayout>
                <AuthorPage
                  authors={authors}
                  books={books}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/search"
          element={
            <MainLayout>
              <PageLayout>
                <SearchResultsPage
                  books={books}
                  categories={categories}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <MainLayout>
              <PageLayout>
                <CategoryPage
                  books={books}
                  categories={categories}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <PageLayout>
                <CartPage
                  cart={cart}
                  handleRemoveFromCart={handleRemoveFromCart}
                  handleUpdateQuantity={handleUpdateQuantity}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            isCustomerLoggedIn ? (
              <MainLayout>
                <PageLayout>
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
              <MainLayout>
                <PageLayout>
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
              <MainLayout>
                <PageLayout>
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
        <Route
          path="/orders/:id"
          element={
            <MainLayout>
              <PageLayout>
                <OrderDetailsPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/track-order"
          element={
            <MainLayout>
              <PageLayout>
                <TrackOrderPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/ebooks"
          element={
            <MainLayout>
              <PageLayout>
                <EbookPage
                  books={books}
                  authors={authors}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  handleFeatureClick={handleFeatureClick}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/audiobooks"
          element={
            <MainLayout>
              <PageLayout>
                <AudiobookPage
                  books={books}
                  authors={authors}
                  handleAddToCart={handleAddToCart}
                  handleToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  handleFeatureClick={handleFeatureClick}
                />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/read/:id"
          element={
            <MainLayout>
              <PageLayout>
                <ReadSamplePage books={books} />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/reader/:id"
          element={
            <MainLayout>
              <PageLayout>
                <EbookReaderPage books={books} />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/listen/:id"
          element={
            <MainLayout>
              <PageLayout>
                <ListenSamplePage books={books} />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/player/:id"
          element={
            <MainLayout>
              <PageLayout>
                <AudiobookPlayerPage books={books} />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <MainLayout>
              <PageLayout>
                <PrivacyPolicyPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <MainLayout>
              <PageLayout>
                <TermsOfServicePage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/return-policy"
          element={
            <MainLayout>
              <PageLayout>
                <ReturnPolicyPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/authors"
          element={
            <MainLayout>
              <PageLayout>
                <AuthorsSectionPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/design-services"
          element={
            <MainLayout>
              <PageLayout>
                <DesignServicesPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/publishing-services"
          element={
            <MainLayout>
              <PageLayout>
                <PublishingServicesPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/publish"
          element={
            <MainLayout>
              <PageLayout>
                <PublishPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <PageLayout>
                <AboutPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/team"
          element={
            <MainLayout>
              <PageLayout>
                <TeamPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <PageLayout>
                <BlogPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <MainLayout>
              <PageLayout>
                <BlogDetailsPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/blog-test"
          element={
            <MainLayout>
              <PageLayout>
                <BlogTestPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/help"
          element={
            <MainLayout>
              <PageLayout>
                <HelpCenterPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/distributors"
          element={
            <MainLayout>
              <PageLayout>
                <DistributorsPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="/store-settings"
          element={
            <MainLayout>
              <PageLayout>
                <StoreSettingsPage />
              </PageLayout>
            </MainLayout>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <PageLayout>
                <NotFoundPage />
              </PageLayout>
            </MainLayout>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default ShopRoutes;

