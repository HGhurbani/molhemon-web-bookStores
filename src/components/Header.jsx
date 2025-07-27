// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu.jsx';
import { useCurrency } from '@/lib/currencyContext.jsx';
import { useLanguage, useTranslation } from '@/lib/languageContext.jsx';

const Header = ({ handleFeatureClick, cartItemCount, isCustomerLoggedIn, books = [], categories = [], siteSettings = {} }) => {
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
  const { currency, setCurrency, currencies } = useCurrency();
  const { language, setLanguage, languages } = useLanguage();
  const t = useTranslation();
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
            className={`text-sm bg-white text-gray-400 hover:bg-white/80 px-2 py-2 rounded-md h-10 ${hideOnMobile ? 'hidden lg:flex' : ''}`}
          >
            {label}
            <ChevronDown className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white shadow-lg rounded-md border border-gray-200">
          <input
            type="text"
            placeholder="ابحث..."
            className="w-full px-2 py-1 text-sm border-b outline-none mb-1"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filteredItems.map((item, index) => (
            <DropdownMenuItem key={index} asChild className="px-4 py-2 hover:bg-indigo-50 text-gray-700">
              {isCategory ? (
                <Link to={`/category/${item.id || item.toLowerCase().replace(/\s/g, '-')}`}>{item.name || item}</Link>
              ) : (
                <button onClick={() => handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'))} className="w-full text-right">
                  {item.name || item}
                </button>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };


  const renderUserSection = () => {
    if (isCustomerLoggedIn) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
              <UserCircle className="w-4 h-4" />
              <span>حسابي</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent dir="rtl" align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
            <DropdownMenuItem asChild>
              <Link to="/profile?tab=wishlist" className="flex items-center">
                <Bookmark className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                مكتبتي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                حسابي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile?tab=orders" className="flex items-center">
                <ShoppingBag className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                مشترياتي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFeatureClick('logout')} className="flex items-center text-red-600">
              <LogOut className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link to="/login" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
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

  return (
    <>
    <header className="bg-blue-600 text-white sticky top-0 z-50 rounded-b-2xl mb-4">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap pb-1 sm:pb-0 transition-all duration-300 ${hideTopRow ? 'max-h-0 opacity-0 overflow-hidden py-0' : 'py-2 max-h-20'}`}>
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
            {renderUserSection()}
            <span className="mx-2">|</span>
            <Link to="/ebooks" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
              <Book className="w-4 h-4" />
              <span>كتاب إلكتروني</span>
            </Link>
            <span className="mx-2">|</span>
           <Link to="/audiobooks" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
  <Headphones className="w-4 h-4" />
  <span>كتاب مسموع</span>
</Link>
            <span className="mx-2">|</span>
           <Link to="/track-order" className="hover:text-blue-200">{t('trackOrder')}</Link>
            <span className="mx-2">|</span>
           <button onClick={() => handleFeatureClick('download-app-top')} className="hover:text-blue-200">{t('downloadApp')}</button>
            <span className="mx-2">|</span>
           <button onClick={() => handleFeatureClick('help-top')} className="hover:text-blue-200">{t('help')}</button>
            <span className="mx-2">|</span>
           <button onClick={() => handleFeatureClick('locations-top')} className="hover:text-blue-200">{t('locations')}</button>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                  <img alt={`علم ${currency.name}`} className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src={currency.flag} />
                  {currency.name}
                  <ChevronDown className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
                {currencies.map(c => (
                  <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)} className="hover:bg-blue-50 flex items-center">
                    <img alt={`علم ${c.name}`} className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src={c.flag} />
                    {c.name} | {c.code}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                  {language.name}
                  <ChevronDown className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
                {languages.map(l => (
                  <DropdownMenuItem key={l.code} onClick={() => handleFeatureClick(`change-language-${l.code}`)} className="hover:bg-blue-50">
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center">
                <img
                  alt={siteSettings.siteName || 'شعار ملهمون'}
                  className="h-10 w-auto mr-2 rtl:ml-2 rtl:mr-0"
                  src="https://darmolhimon.com/wp-content/uploads/2021/07/Dar.png"
                />
                {/* Keep site name for screen readers but hide visually */}
                <span className="sr-only">{siteSettings.siteName || 'ملهمون'}</span>
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-1 mx-4 lg:mx-8 flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث حسب العنوان، المؤلف، الكلمة المفتاحية، رقم ISBN..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-auto text-sm">
                  {suggestions.map((s) => (
                    <li key={s.id} className="px-3 py-2 hover:bg-gray-100">
                      <Link to={`/book/${s.id}`} state={{ book: s }}>{s.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 h-8 text-white"
                onClick={() => handleSearchSubmit()}
                size="sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <DropdownWithSearch label="تصفح الفئات" items={categoryItems} isCategory hideOnMobile />
            <DropdownWithSearch label="العلامات التجارية" items={["دار الشروق", "دار الآداب", "مكتبة جرير"]} hideOnMobile />
            <DropdownWithSearch label="اختر طريقة التوصيل" items={deliveryItems} hideOnMobile />
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-blue-200 w-10 h-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="md:hidden w-56">
                <DropdownMenuLabel className="text-xs text-gray-500">تصفح الفئات</DropdownMenuLabel>
                {categoryItems.map((item, idx) => (
                  <DropdownMenuItem key={idx} asChild className="px-4 py-2">
                    <Link to={`/category/${item.id}`}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-gray-500">العلامات التجارية</DropdownMenuLabel>
                {["دار الشروق", "دار الآداب", "مكتبة جرير"].map((item, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'))}
                    className="px-4 py-2"
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-gray-500">اختر طريقة التوصيل</DropdownMenuLabel>
                  {deliveryItems.map((item, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'))}
                      className="px-4 py-2"
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Briefcase className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            <Button asChild variant="ghost" size="icon" className="text-white hover:text-blue-200 w-10 h-10">
              <Link to="/profile?tab=wishlist">
                <Bookmark className="w-5 h-5" />
              </Link>
            </Button>


            <Button asChild variant="ghost" size="icon" className="relative text-white hover:text-blue-200 w-10 h-10">
              <Link to="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
            
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-2 text-xs text-white overflow-x-auto whitespace-nowrap">
            {searchSuggestions.map((item, idx) => (
                 <span key={idx} className="cursor-pointer hover:text-blue-200" onClick={() => handleSearchSubmit(item)}>{item}</span>
            ))}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
