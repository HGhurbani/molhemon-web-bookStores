// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Bookmark,
  ChevronDown,
  Briefcase,
  UserCircle,
  User,
  ShoppingBag,
  LogOut,
  LogIn,
  Menu,
  Book,
  Headphones,
  X,
  Home,
  FileText,
  MapPin,
  HelpCircle,
  Download,
  Truck,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu.jsx';
import { useCurrency } from '@/lib/currencyContext.jsx';
import { useLanguage } from '@/lib/languageContext.jsx';
import { useCart } from '@/lib/cartContext.jsx';
import { useAuth } from '@/lib/authContext.jsx';
import { useTranslation } from 'react-i18next';

const Header = ({ handleFeatureClick, books = [], categories = [], siteSettings = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches')) || [];
    } catch {
      return [];
    }
  });
  const [randomSuggestions, setRandomSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { currency, setCurrency, currencies } = useCurrency();
  const { language, setLanguage, languages } = useLanguage();
  const { cart } = useCart();
  const { isCustomer: isCustomerLoggedIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [hideTopRow, setHideTopRow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHideTopRow(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (books.length) {
      const randomTitles = [...books]
        .sort(() => 0.5 - Math.random())
        .slice(0, 8)
        .map(b => b.title);
      setRandomSuggestions(randomTitles);
    }
  }, [books]);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = books.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(term)) ||
        (b.author && b.author.toLowerCase().includes(term)) ||
        (b.isbn && b.isbn.toLowerCase().includes(term))
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [searchTerm, books]);

  const handleSearchSubmit = (term = searchTerm) => {
    const query = term.trim();
    if (!query) return;
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(t => t !== query)].slice(0, 8);
      return updated;
    });
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsMobileSearchOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
  };

  const DropdownWithSearch = ({ label, items, isCategory = false, hideOnMobile = false }) => {
    const [filterText, setFilterText] = useState('');
    const filteredItems = items.filter((item) => {
      const text = item.name || item;
      return text.toLowerCase().includes(filterText.toLowerCase());
    });

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className={`text-sm bg-white text-gray-400 hover:bg-white/80 px-2 py-2 rounded-md h-10 transition-all duration-200 ${hideOnMobile ? 'hidden lg:flex' : ''}`}
          >
            {label}
            <ChevronDown className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 transition-transform duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white shadow-lg rounded-md border border-gray-200 min-w-[200px]">
          <input
            type="text"
            placeholder="ابحث..."
            className="w-full px-3 py-2 text-sm border-b outline-none mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-t-md text-gray-900"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div className="max-h-48 overflow-auto">
          {filteredItems.map((item, index) => (
              <DropdownMenuItem key={index} asChild className="px-4 py-2 hover:bg-indigo-50 text-gray-700 transition-colors duration-150">
              {isCategory ? (
                <Link to={`/category/${item.id || item.toLowerCase().replace(/\s/g, '-')}`}>{item.name || item}</Link>
              ) : (
                <button onClick={() => handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'))} className="w-full text-right">
                  {item.name || item}
                </button>
              )}
            </DropdownMenuItem>
          ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderUserSection = () => {
    if (isCustomerLoggedIn) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200 transition-colors duration-200">
              <UserCircle className="w-4 h-4" />
              <span>حسابي</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent dir="rtl" align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800 min-w-[180px]">
            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-blue-50 transition-colors duration-150">
              <Link to="/profile?tab=wishlist" className="flex items-center">
                <Bookmark className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                مكتبتي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-blue-50 transition-colors duration-150">
              <Link to="/profile" className="flex items-center">
                <User className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                حسابي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-blue-50 transition-colors duration-150">
              <Link to="/profile?tab=orders" className="flex items-center">
                <ShoppingBag className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                مشترياتي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFeatureClick('logout')} className="flex items-center text-red-600 px-4 py-3 hover:bg-red-50 transition-colors duration-150">
              <LogOut className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link to="/login" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200 transition-colors duration-200">
        <UserCircle className="w-4 h-4" />
        <span>تسجيل الدخول / إنشاء حساب</span>
      </Link>
    );
  };

  const categoryItems = categories.length
    ? categories
    : [
        { id: 'fiction', name: 'الخيال' },
        { id: 'nonfiction', name: 'غير الخيال' },
        { id: 'kids', name: 'أطفال' },
        { id: 'science', name: 'علوم' },
      ];

  const deliveryItems = ["توصيل سريع", "شحن عادي", "استلام من المتجر"];

  const searchSuggestions = React.useMemo(() => {
    const randoms = randomSuggestions.filter(t => !recentSearches.includes(t));
    return recentSearches.concat(randoms).slice(0, 8);
  }, [recentSearches, randomSuggestions]);

  const MobileMenuItem = ({ to, icon: Icon, children, onClick, className = "" }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full ${className}`}
    >
      {to ? (
        <Link
          to={to}
          onClick={closeMobileMenu}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
        >
          {Icon && <Icon className="w-5 h-5 ml-3 rtl:mr-2 rtl:ml-0 text-blue-600" />}
          <span className="font-medium">{children}</span>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 text-right"
        >
          {Icon && <Icon className="w-5 h-5 ml-3 rtl:mr-2 rtl:ml-0 text-blue-600" />}
          <span className="font-medium">{children}</span>
        </button>
      )}
    </motion.div>
  );

  return (
    <>
      <header className="bg-blue-600 text-white sticky top-0 z-50 rounded-b-2xl mb-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Hidden on scroll */}
          <motion.div 
            className={`flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap pb-1 sm:pb-0 transition-all duration-300 ${hideTopRow ? 'max-h-0 opacity-0 overflow-hidden py-0' : 'py-2 max-h-20'}`}
            initial={false}
            animate={{ 
              maxHeight: hideTopRow ? 0 : 80,
              opacity: hideTopRow ? 0 : 1,
              paddingTop: hideTopRow ? 0 : 8,
              paddingBottom: hideTopRow ? 0 : 8
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
            {renderUserSection()}
            <span className="mx-2">|</span>
              <Link to="/ebooks" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-gray-200 transition-colors duration-200">
              <Book className="w-4 h-4" />
              <span>كتاب إلكتروني</span>
            </Link>
            <span className="mx-2">|</span>
              <Link to="/audiobooks" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-gray-200 transition-colors duration-200">
  <Headphones className="w-4 h-4" />
  <span>كتاب مسموع</span>
</Link>
            <span className="mx-2">|</span>
              <Link to="/track-order" className="hover:text-gray-200 transition-colors duration-200">{t('trackOrder')}</Link>
              <span className="mx-2">|</span>
              <Link to="/blog" className="hover:text-gray-200 transition-colors duration-200">المدونة</Link>
            <span className="mx-2">|</span>
              <button onClick={() => handleFeatureClick('download-app-top')} className="hover:text-gray-200 transition-colors duration-200">{t('downloadApp')}</button>
            <span className="mx-2">|</span>
              <Link to="/help" className="hover:text-gray-200 transition-colors duration-200">المساعدة</Link>
            <span className="mx-2">|</span>
              <Link to="/distributors" className="hover:text-gray-200 transition-colors duration-200">مواقعنا</Link>
            <span className="mx-2">|</span>
              <Link to="/publishing-services" className="hover:text-gray-200 transition-colors duration-200">إنشر معنا</Link>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xs text-white hover:bg-gray-500 hover:text-white p-1 h-auto transition-all duration-200">
                  <img alt={`علم ${currency.name}`} className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src={currency.flag} />
                  {currency.name}
                    <ChevronDown className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800 min-w-[160px]">
                {currencies.map(c => (
                    <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)} className="hover:bg-blue-50 flex items-center px-4 py-2 transition-colors duration-150">
                    <img alt={`علم ${c.name}`} className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src={c.flag} />
                    {c.name} | {c.code}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xs text-white hover:bg-gray-500 hover:text-white p-1 h-auto transition-all duration-200">
                  {language.name}
                    <ChevronDown className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800 min-w-[120px]">
                {languages.map(l => (
                    <DropdownMenuItem key={l.code} onClick={() => handleFeatureClick(`change-language-${l.code}`)} className="hover:bg-blue-50 px-4 py-2 transition-colors duration-150">
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </motion.div>

          {/* Main Header Row */}
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center">
                <img
                  alt={siteSettings.siteName || 'شعار ملهمون'}
                  className="h-10 w-auto mr-2 rtl:ml-2 rtl:mr-0"
                  src="https://darmolhimon.com/wp-content/uploads/2021/07/Dar.png"
                />
                <span className="sr-only">{siteSettings.siteName || 'ملهمون'}</span>
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-1 mx-4 lg:mx-8 flex items-center space-x-3 rtl:space-x-reverse">
              {/* Desktop Search - Hidden on Mobile */}
              <div className="relative flex-1 hidden md:block">
              <input
                type="text"
                placeholder="ابحث حسب العنوان، المؤلف، الكلمة المفتاحية، رقم ISBN..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm h-10 transition-all duration-200 text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
              />
                <AnimatePresence>
              {suggestions.length > 0 && (
                    <motion.ul 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-auto text-sm shadow-lg"
                    >
                  {suggestions.map((s) => (
                        <li key={s.id} className="px-3 py-2 hover:bg-gray-100 transition-colors duration-150">
                          <Link to={`/book/${s.id}`} state={{ book: s }} className="text-gray-900 hover:text-blue-600">{s.title}</Link>
                    </li>
                  ))}
                    </motion.ul>
              )}
                </AnimatePresence>
              <Button
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 h-8 text-white transition-all duration-200"
                onClick={() => handleSearchSubmit()}
                size="sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
              
              {/* Mobile Search Button - Visible only on Mobile */}
              <div className="md:hidden flex-1 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-gray-200 w-12 h-12 transition-all duration-200"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                >
                  <Search className="w-6 h-6" />
                </Button>
              </div>
              
            <DropdownWithSearch label="تصفح الفئات" items={categoryItems} isCategory hideOnMobile />
            <DropdownWithSearch label="العلامات التجارية" items={["دار الشروق", "دار الآداب", "مكتبة جرير"]} hideOnMobile />
            <DropdownWithSearch label="اختر طريقة التوصيل" items={deliveryItems} hideOnMobile />
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white hover:text-gray-200 w-10 h-10 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>

              <Button asChild variant="ghost" size="icon" className="text-white hover:text-gray-200 w-10 h-10 transition-all duration-200">
              <Link to="/profile?tab=wishlist">
                <Bookmark className="w-5 h-5" />
              </Link>
            </Button>

              <Button asChild variant="ghost" size="icon" className="relative text-white hover:text-gray-200 w-10 h-10 transition-all duration-200">
              <Link to="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center"
                    >
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </motion.span>
                )}
              </Link>
            </Button>
            </div>
          </div>

          {/* Search Suggestions Row */}
          <motion.div 
            className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-2 text-xs text-white overflow-x-auto whitespace-nowrap"
            initial={false}
            animate={{ 
              maxHeight: hideTopRow ? 0 : 40,
              opacity: hideTopRow ? 0 : 1,
              paddingTop: hideTopRow ? 0 : 8,
              paddingBottom: hideTopRow ? 0 : 8
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {searchSuggestions.map((item, idx) => (
              <motion.span 
                key={idx} 
                className="cursor-pointer hover:text-gray-200 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-500/20" 
                onClick={() => handleSearchSubmit(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileSearch}
            />
          )}
        </AnimatePresence>

        {/* Mobile Search Content */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-50 md:hidden p-4"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">البحث</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileSearch}
                  className="w-8 h-8 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث في الكتب..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchSubmit();
                      }
                    }}
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">اقتراحات البحث</h3>
                  <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchSubmit(item)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-600">تصفح سريع</h3>
                
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">الفئات</h4>
                  <div className="flex flex-wrap gap-2">
                    {categoryItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(`/category/${item.id}`);
                          closeMobileSearch();
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">العلامات التجارية</h4>
                  <div className="flex flex-wrap gap-2">
                    {["دار الشروق", "دار الآداب", "مكتبة جرير"].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'));
                          closeMobileSearch();
                        }}
                        className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">طرق التوصيل</h4>
                  <div className="flex flex-wrap gap-2">
                    {deliveryItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'));
                          closeMobileSearch();
                        }}
                        className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors duration-200"
                      >
                        {item}
                      </button>
            ))}
        </div>
      </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
              dir="rtl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">القائمة</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    className="w-8 h-8 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Main Navigation */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">الصفحات الرئيسية</h3>
                  <MobileMenuItem to="/" icon={Home}>الرئيسية</MobileMenuItem>
                  <MobileMenuItem to="/ebooks" icon={Book}>كتاب إلكتروني</MobileMenuItem>
                  <MobileMenuItem to="/audiobooks" icon={Headphones}>كتاب مسموع</MobileMenuItem>
                  <MobileMenuItem to="/track-order" icon={Truck}>تتبع الطلب</MobileMenuItem>
                  <MobileMenuItem to="/blog" icon={FileText}>المدونة</MobileMenuItem>
                  <MobileMenuItem to="/help" icon={HelpCircle}>المساعدة</MobileMenuItem>
                  <MobileMenuItem to="/distributors" icon={MapPin}>مواقعنا</MobileMenuItem>
                  <MobileMenuItem to="/publishing-services" icon={Building2}>إنشر معنا</MobileMenuItem>
                </div>

                {/* Categories */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">تصفح الفئات</h3>
                  {categoryItems.map((item, idx) => (
                    <MobileMenuItem key={idx} to={`/category/${item.id}`}>
                      {item.name}
                    </MobileMenuItem>
                  ))}
                </div>

                {/* Brands */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">العلامات التجارية</h3>
                  {["دار الشروق", "دار الآداب", "مكتبة جرير"].map((item, idx) => (
                    <MobileMenuItem 
                      key={idx} 
                      onClick={() => {
                        handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'));
                        closeMobileMenu();
                      }}
                    >
                      {item}
                    </MobileMenuItem>
                  ))}
                </div>

                {/* Delivery Options */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">اختر طريقة التوصيل</h3>
                  {deliveryItems.map((item, idx) => (
                    <MobileMenuItem 
                      key={idx} 
                      onClick={() => {
                        handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'));
                        closeMobileMenu();
                      }}
                    >
                      {item}
                    </MobileMenuItem>
                  ))}
                </div>

                {/* Admin Panel */}
                <div className="space-y-2 mb-6">
                  <MobileMenuItem to="/admin" icon={Briefcase}>لوحة التحكم</MobileMenuItem>
                </div>

                {/* User Section */}
                <div className="border-t pt-4">
                  {isCustomerLoggedIn ? (
                    <div className="space-y-2">
                      <MobileMenuItem to="/profile" icon={User}>حسابي</MobileMenuItem>
                      <MobileMenuItem to="/profile?tab=wishlist" icon={Bookmark}>مكتبتي</MobileMenuItem>
                      <MobileMenuItem to="/profile?tab=orders" icon={ShoppingBag}>مشترياتي</MobileMenuItem>
                      <MobileMenuItem 
                        onClick={() => {
                          handleFeatureClick('logout');
                          closeMobileMenu();
                        }}
                        icon={LogOut}
                        className="text-red-600"
                      >
                        تسجيل الخروج
                      </MobileMenuItem>
                    </div>
                  ) : (
                    <MobileMenuItem to="/login" icon={LogIn}>تسجيل الدخول / إنشاء حساب</MobileMenuItem>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
    </>
  );
};

export default Header;
