
import React from 'react';
import HeroSection from '@/components/HeroSection.jsx';
import CategoriesSection from '@/components/CategoriesSection.jsx';
import FlashSaleSkeleton from '@/components/FlashSaleSkeleton.jsx';
import AuthorsSkeleton from '@/components/AuthorsSkeleton.jsx';
import RecentSearchSkeleton from '@/components/RecentSearchSkeleton.jsx';
import BookBestsellerSkeleton from '@/components/BookBestsellerSkeleton.jsx';
import FeaturesSkeleton from '@/components/FeaturesSkeleton.jsx';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FlashSaleSection = React.lazy(() => import('@/components/FlashSaleSection.jsx'));
const AuthorsSection = React.lazy(() => import('@/components/AuthorsSection.jsx'));
const RecentSearchSection = React.lazy(() => import('@/components/RecentSearchSection.jsx'));
const BookBestsellerSection = React.lazy(() => import('@/components/BookBestsellerSection.jsx'));
const FeaturesSection = React.lazy(() => import('@/components/FeaturesSection.jsx'));

const HomePage = ({
  books,
  authors,
  heroSlides,
  categories,
  recentSearchBooks,
  bestsellerBooks,
  featuresData: features,
  banners,
  handleAddToCart,
  handleToggleWishlist,
  wishlist,
  handleFeatureClick
}) => {
  const { t } = useTranslation();
  const displayedCategories = React.useMemo(() => {
    const list = categories.slice(0, 11);
    if (categories.length > 11) {
      list.push({ id: 'more', name: 'siteData.categories.more', icon: 'Menu' });
    }
    return list;
  }, [categories]);

  return (
    <>
      <HeroSection slides={heroSlides} />
      <CategoriesSection categories={displayedCategories} />
      <React.Suspense fallback={<FlashSaleSkeleton />}>
        <FlashSaleSection
          books={books}
          handleAddToCart={handleAddToCart}
          handleToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
        />
      </React.Suspense>
      <React.Suspense fallback={<AuthorsSkeleton />}>
        <AuthorsSection
          authors={authors}
        />
      </React.Suspense>
      <React.Suspense fallback={<RecentSearchSkeleton />}>
        <RecentSearchSection
          books={recentSearchBooks}
          handleAddToCart={handleAddToCart}
          handleToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
        />
      </React.Suspense>
      <React.Suspense fallback={<BookBestsellerSkeleton />}>
          <BookBestsellerSection
            books={bestsellerBooks}
            handleAddToCart={handleAddToCart}
            handleToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          title={t('home_bestsellers_audiobooks', { defaultValue: 'Top-selling audiobooks' })}
          icon={TrendingUp}
          squareImages
        />
      </React.Suspense>
      <React.Suspense fallback={<BookBestsellerSkeleton />}>
          <BookBestsellerSection
            books={bestsellerBooks.slice(0,3).concat(bestsellerBooks.slice(0,3))}
            handleAddToCart={handleAddToCart}
            handleToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          title={t('home_bestsellers_all_books', { defaultValue: 'Best-selling books' })}
          icon={TrendingUp}
          bgColor="bg-slate-100"
          likeCardStyle
        />
      </React.Suspense>
      <React.Suspense fallback={<FeaturesSkeleton />}>
        <FeaturesSection features={features} banners={banners} handleFeatureClick={handleFeatureClick} />
      </React.Suspense>
    </>
  );
};

export default HomePage;
