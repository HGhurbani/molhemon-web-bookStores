
import React from 'react';
import HeroSection from '@/components/HeroSection.jsx';
import CategoriesSection from '@/components/CategoriesSection.jsx';
import FlashSaleSection from '@/components/FlashSaleSection.jsx';
import AuthorsSection from '@/components/AuthorsSection.jsx';
import RecentSearchSection from '@/components/RecentSearchSection.jsx';
import BookBestsellerSection from '@/components/BookBestsellerSection.jsx';
import FeaturesSection from '@/components/FeaturesSection.jsx';
import { TrendingUp } from 'lucide-react';

const HomePage = ({ 
  books, 
  authors, 
  heroSlides, 
  categories, 
  recentSearchBooks, 
  bestsellerBooks, 
  featuresData, 
  handleAddToCart, 
  handleToggleWishlist,
  wishlist, 
  handleFeatureClick 
}) => {
  return (
    <>
      <HeroSection slides={heroSlides} />
      <CategoriesSection 
        categories={categories} 
      />
      <FlashSaleSection 
        books={books} 
        handleAddToCart={handleAddToCart} 
        handleToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
      />
      <AuthorsSection 
        authors={authors} 
      />
      <RecentSearchSection
        books={recentSearchBooks}
        handleAddToCart={handleAddToCart}
        handleToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
      />
      <BookBestsellerSection
        books={bestsellerBooks}
        handleAddToCart={handleAddToCart}
        handleToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
        title="الكتب الصوتية الأكثر مبيعاً"
        icon={TrendingUp}
        squareImages
      />
      <BookBestsellerSection
        books={bestsellerBooks.slice(0,3).concat(bestsellerBooks.slice(0,3))}
        handleAddToCart={handleAddToCart}
        handleToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
        title="الكتب الأكثر مبيعاً"
        icon={TrendingUp}
        bgColor="bg-slate-100"
        likeCardStyle
      />
      <FeaturesSection features={featuresData} handleFeatureClick={handleFeatureClick} />
    </>
  );
};

export default HomePage;
