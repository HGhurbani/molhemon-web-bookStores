
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Bookmark,
  ChevronDown,
  Briefcase,
  UserCircle,
  Menu,
  Book,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu.jsx';

const Header = ({ handleFeatureClick, cartItemCount }) => {
  const renderDropdown = (label, items, isCategory = false) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="text-sm bg-white text-gray-400 hover:bg-white/80 px-2 py-2 rounded-md h-10">
          {label}
          <ChevronDown className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white shadow-lg rounded-md border border-gray-200">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild className="px-4 py-2 hover:bg-indigo-50 text-gray-700">
            {isCategory ? (
              <Link to={`/category/${item.id || item.toLowerCase().replace(/\s/g, '-')}`}>
                {item.name || item}
              </Link>
            ) : (
              <button onClick={() => handleFeatureClick(item.toLowerCase().replace(/\s/g, '-'))} className="w-full text-right">
                {item}
              </button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const categoryItems = [
    { id: 'fiction', name: 'الخيال' },
    { id: 'nonfiction', name: 'غير الخيال' },
    { id: 'kids', name: 'أطفال' },
    { id: 'science', name: 'علوم' },
  ];

  const deliveryItems = ["توصيل سريع", "شحن عادي", "استلام من المتجر"];

  return (
    <>
    <header className="bg-blue-600 text-white sticky top-0 z-50 rounded-b-2xl mb-4">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="hidden sm:flex items-center justify-between text-xs py-2">
          <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-x-auto whitespace-nowrap">
            <Link to="/profile" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
              <UserCircle className="w-4 h-4" />
              <span>بروس وين</span>
            </Link>
            <span className="mx-2">|</span>
            <button onClick={() => handleFeatureClick('ebook-top')} className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
              <Book className="w-4 h-4" />
              <span>كتاب إلكتروني</span>
            </button>
            <span className="mx-2">|</span>
           <Link to="/audiobooks" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200">
  <Headphones className="w-4 h-4" />
  <span>كتاب مسموع</span>
</Link>
            <span className="mx-2">|</span>
            <button onClick={() => handleFeatureClick('track-order-top')} className="hover:text-blue-200">تتبع الطلب</button>
            <span className="mx-2">|</span>
            <button onClick={() => handleFeatureClick('download-app-top')} className="hover:text-blue-200">حمل تطبيقنا</button>
            <span className="mx-2">|</span>
            <button onClick={() => handleFeatureClick('help-top')} className="hover:text-blue-200">المساعدة</button>
            <span className="mx-2">|</span>
            <button onClick={() => handleFeatureClick('locations-top')} className="hover:text-blue-200">مواقعنا</button>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                  <img  alt="علم الإمارات العربية المتحدة" className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src="https://darmolhimon.com/wp-content/uploads/2025/06/united-arab-emirates-svgrepo-com.svg" />
                  الإمارات العربية المتحدة | الإمارات العربية المتحدة
                  <ChevronDown className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
                <DropdownMenuItem onClick={() => handleFeatureClick('change-country-ksa')} className="hover:bg-blue-50 flex items-center">
                  <img  alt="علم المملكة العربية السعودية" className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src="https://cdn.countryflags.com/thumbs/saudi-arabia/flag-round-250.png" />
                  المملكة العربية السعودية | KSA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFeatureClick('change-country-eg')} className="hover:bg-blue-50 flex items-center">
                  <img  alt="علم مصر" className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src="https://vectorflags.s3.amazonaws.com/flags/eg-circle-01.png" />
                  مصر | EG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                  العربية
                  <ChevronDown className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
                <DropdownMenuItem onClick={() => handleFeatureClick('change-language-en')} className="hover:bg-blue-50">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFeatureClick('change-language-fr')} className="hover:bg-blue-50">
                  Français
                </DropdownMenuItem>
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
                <img  alt="شعار ملهمون" className="h-10 w-auto mr-2 rtl:ml-2 rtl:mr-0" src="https://darmolhimon.com/wp-content/uploads/2021/07/Dar.png" />
               
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-1 mx-4 lg:mx-8 flex items-center space-x-3 rtl:space-x-reverse">
            {renderDropdown("تصفح الفئات", categoryItems, true)}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث حسب العنوان، المؤلف، الكلمة المفتاحية، رقم ISBN..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm h-10"
                onFocus={() => handleFeatureClick('search-main-focus')}
                onChange={() => handleFeatureClick('search-main-change')}
              />
              <Button
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1 h-8 text-white"
                onClick={() => handleFeatureClick('search-main-button')}
                size="sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {renderDropdown("العلامات التجارية", ["دار الشروق", "دار الآداب", "مكتبة جرير"])}
            {renderDropdown("اختر طريقة التوصيل", deliveryItems)}
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
            {["بحث مقترح", "بحث حديث", "بحث مقترح", "بحث حديث", "بحث مقترح", "بحث حديث", "بحث مقترح", "بحث حديث"].map((item,idx) => (
                 <span key={idx} className="cursor-pointer hover:text-blue-200" onClick={() => handleFeatureClick(item.replace(/\s/g, '-'))}>{item}</span>
            ))}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
