
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Bookmark, ChevronDown, Globe, Briefcase, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';

const Header = ({ handleFeatureClick, cartItemCount }) => {
  const renderDropdown = (label, items, isCategory = false) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md h-10">
          {label}
          <ChevronDown className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
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

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center">
                <img  alt="شعار ملهمون" className="h-10 w-auto mr-2 rtl:ml-2 rtl:mr-0" src="https://darmolhimon.com/wp-content/uploads/2024/09/Dar.png" />
               
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالعنوان، المؤلف، الكلمة المفتاحية، ISBN..."
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
          </div>

          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {renderDropdown("تصفح الفئات", categoryItems, true)}
            {renderDropdown("العلامات التجارية", ["دار الشروق", "دار الآداب", "مكتبة جرير"])}
            
            <Button asChild variant="ghost" size="icon" className="relative text-gray-600 hover:text-blue-600 w-10 h-10">
              <Link to="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 w-10 h-10">
              <Link to="/profile?tab=wishlist">
                <Bookmark className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 text-sm h-10"
            >
              <Link to="/admin">
                <Briefcase className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />
                لوحة التحكم
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 w-10 h-10">
              <Link to="/profile">
                <UserCircle className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
            {["recommendation search", "recent search", "recommendation search", "recent search", "recommendation search", "recent search", "recommendation search", "recent search"].map((item,idx) => (
                 <span key={idx} className="cursor-pointer hover:text-blue-600" onClick={() => handleFeatureClick(item.replace(/\s/g, '-'))}>{item}</span>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
