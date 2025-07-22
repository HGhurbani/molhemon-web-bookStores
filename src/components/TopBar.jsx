// src/components/TopBar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Tag, Box, Download, HelpCircle, MapPin, ChevronDown, Globe, Headphones, BookOpen } from 'lucide-react'; // Ensure Headphones and BookOpen are imported
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { useLanguage, useTranslation, languages } from '@/lib/languageContext.jsx';

const TopBar = ({ handleFeatureClick, isLoggedIn }) => {
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const userPhoto = 'https://images.unsplash.com/photo-1572119003128-d110c07af847';
  const topNavItems = [
    { icon: UserCircle, text: 'بروس وين', action: 'profile-top', link: '/profile' },
    { icon: BookOpen, text: 'كتاب إلكتروني', action: 'ebook-top', link: '/category/ebooks' }, // Assuming a category for ebooks or similar
    { icon: Headphones, text: 'كتاب مسموع', action: 'audiobook-top', link: '/audiobooks' }, // THIS IS THE MODIFIED ITEM
    { icon: Tag, text: 'قائمة الرغبات', action: 'wishlist-top', link: '/profile?tab=wishlist' },
    { icon: Box, text: t('trackOrder'), action: 'track-order-top', link: '/profile?tab=orders' },
    { icon: Download, text: t('downloadApp'), action: 'download-app-top' },
    { icon: HelpCircle, text: t('help'), action: 'help-top' },
    { icon: MapPin, text: t('locations'), action: 'locations-top' },
  ];

  return (
    <div className="bg-blue-600 text-white text-xs py-2">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="hidden sm:flex items-center space-x-3 rtl:space-x-reverse mb-2 sm:mb-0 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0">
          {topNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const content = (
              <>
                {index === 0 && isLoggedIn ? (
                  <img src={userPhoto} alt="صورة المستخدم" className="w-4 h-4 rounded-full" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
                <span>{item.text}</span>
              </>
            );
            const element = item.link ? (
              <Link
                key={index}
                to={item.link}
                className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200 transition-colors flex-shrink-0"
              >
                {content}
              </Link>
            ) : (
              <button
                key={index}
                className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-200 transition-colors flex-shrink-0"
                onClick={() => handleFeatureClick(item.action)}
              >
                {content}
              </button>
            );
            return (
              <React.Fragment key={index}>
                {element}
                {index < topNavItems.length - 1 && <span className="mx-2">|</span>}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                <img  alt="علم الإمارات العربية المتحدة" className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src="https://darmolhimon.com/wp-content/uploads/2025/06/united-arab-emirates-svgrepo-com.svg" />
                الإمارات | UAE
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
                <Globe className="w-3 h-3 ml-2 rtl:mr-2 rtl:ml-0" />
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
    </div>
  );
};

export default TopBar;