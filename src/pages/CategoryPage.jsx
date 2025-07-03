
import React, { useState, useEffect } from 'react';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import { getPriceForCurrency, useCurrency } from '@/lib/currencyContext.jsx';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import { Filter, ChevronDown, List, Grid } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu.jsx"
import { Slider } from "@/components/ui/slider.jsx"


const CategoryPage = ({ books, categories, handleAddToCart, handleToggleWishlist }) => {
  const { categoryId } = useParams();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { currency } = useCurrency();

  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(localWishlist);

    let currentBooks = [];
    if (categoryId === 'all' || !categoryId) {
      currentBooks = books;
      setCategoryName('جميع الكتب');
    } else if (categoryId === 'flash-sale') {
      currentBooks = books.filter(b => b.originalPrice); 
      setCategoryName('Flash Sale');
    } else if (categoryId === 'recent-search') {
      currentBooks = books.slice(0,10); 
      setCategoryName('Recent Search');
    } else if (categoryId === 'book-bestseller') {
      currentBooks = books.sort((a,b) => (b.reviews * b.rating) - (a.reviews * a.rating)).slice(0,12);
      setCategoryName('Book Bestseller');
    } else if (categoryId === 'you-may-like') {
      currentBooks = books.sort(() => 0.5 - Math.random()).slice(0,12);
      setCategoryName('قد يعجبك أيضاً');
    }
    else {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        currentBooks = books.filter(book => book.category === categoryId || book.category === category.name);
        setCategoryName(category.name);
      } else {
        currentBooks = books;
        setCategoryName(`فئة: ${categoryId}`);
      }
    }
    
    let sortedBooks = [...currentBooks];
    if (sortOption === 'price-asc') {
      sortedBooks.sort((a, b) => getPriceForCurrency(a, currency.code) - getPriceForCurrency(b, currency.code));
    } else if (sortOption === 'price-desc') {
      sortedBooks.sort((a, b) => getPriceForCurrency(b, currency.code) - getPriceForCurrency(a, currency.code));
    } else if (sortOption === 'rating') {
      sortedBooks.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'newest') {
      sortedBooks.sort((a,b) => (new Date(b.publishDate || 0)) - (new Date(a.publishDate || 0)));
    }

    sortedBooks = sortedBooks.filter(book => {
      const p = getPriceForCurrency(book, currency.code);
      return p >= priceRange[0] && p <= priceRange[1];
    });

    setFilteredBooks(sortedBooks);

  }, [categoryId, books, categories, sortOption, priceRange]);

  const onToggleWishlist = (book) => {
    handleToggleWishlist(book);
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(localWishlist);
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <nav className="text-sm text-gray-500 mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2 rtl:space-x-reverse">
          <li><Link to="/" className="hover:text-blue-600">الرئيسية</Link></li>
          <li><span>/</span></li>
          <li className="text-gray-700" aria-current="page">{categoryName}</li>
        </ol>
      </nav>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8"
      >
        {categoryName} ({filteredBooks.length} كتاب)
      </motion.h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                تصفية
                <ChevronDown className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4">
              <DropdownMenuLabel>نطاق السعر</DropdownMenuLabel>
              <Slider
                defaultValue={[0, 200]}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-3"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span><FormattedPrice value={priceRange[0]} /></span>
                <span><FormattedPrice value={priceRange[1]} /></span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>المؤلفون</DropdownMenuLabel>
               <DropdownMenuCheckboxItem>مؤلف 1</DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem>مؤلف 2</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                ترتيب حسب
                <ChevronDown className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSortOption('default')}>افتراضي</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption('price-asc')}>السعر: من الأقل للأعلى</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption('price-desc')}>السعر: من الأعلى للأقل</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption('rating')}>الأعلى تقييماً</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption('newest')}>الأحدث</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                <Grid className="w-5 h-5"/>
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                <List className="w-5 h-5"/>
            </Button>
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className={`grid gap-4 sm:gap-5 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
          {filteredBooks.map((book, index) => (
            <BookCard 
              key={book.id} 
              book={book} 
              handleAddToCart={handleAddToCart} 
              handleToggleWishlist={onToggleWishlist} 
              index={index}
              isInWishlist={wishlist.some(item => item.id === book.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-2">لا توجد كتب تطابق معايير البحث الحالية.</p>
          <p className="text-gray-500">حاول تعديل الفلاتر أو توسيع نطاق البحث.</p>
        </div>
      )}
      
      {filteredBooks.length > 15 && (
         <div className="mt-8 flex justify-center">
            <Button variant="outline">تحميل المزيد</Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
