
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Tag, Box, Download, HelpCircle, MapPin, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';

const TopBar = ({ handleFeatureClick }) => {
  const topNavItems = [
    { icon: UserCircle, text: 'بروس وين', action: 'profile-top', link: '/profile' },
    { icon: Tag, text: 'قائمة الرغبات', action: 'wishlist-top', link: '/profile?tab=wishlist' },
    { icon: Box, text: 'تتبع الطلب', action: 'track-order-top', link: '/profile?tab=orders' },
    { icon: Download, text: 'حمل تطبيقنا', action: 'download-app-top' },
    { icon: HelpCircle, text: 'مساعدة', action: 'help-top' },
    { icon: MapPin, text: 'مواقعنا', action: 'locations-top' },
  ];

  return (
    <div className="bg-blue-700 text-white text-xs py-2">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2 sm:mb-0 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0">
          {topNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const content = (
              <>
                <IconComponent className="w-4 h-4" />
                <span>{item.text}</span>
              </>
            );
            return item.link ? (
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
          })}
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                <img  alt="علم الإمارات العربية المتحدة" className="w-5 h-3 ml-1 object-contain rtl:mr-1 rtl:ml-0" src="https://images.unsplash.com/photo-1670490706888-23eff3fc3eac" />
                الإمارات | UAE
                <ChevronDown className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
              <DropdownMenuItem onClick={() => handleFeatureClick('change-country-ksa')} className="hover:bg-blue-50 flex items-center">
                <img  alt="علم المملكة العربية السعودية" className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src="https://images.unsplash.com/photo-1648614154065-a7726d454c59" />
                المملكة العربية السعودية | KSA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFeatureClick('change-country-eg')} className="hover:bg-blue-50 flex items-center">
                 <img  alt="علم مصر" className="w-5 h-3 ml-2 object-contain rtl:mr-2 rtl:ml-0" src="https://images.unsplash.com/photo-1674634330349-b131b31b9fa3" />
                مصر | EG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-xs text-white hover:bg-blue-600 hover:text-white p-1 h-auto">
                <Globe className="w-3 h-3 ml-1 rtl:mr-1 rtl:ml-0" />
                English
                <ChevronDown className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 text-gray-800">
              <DropdownMenuItem onClick={() => handleFeatureClick('change-language-ar')} className="hover:bg-blue-50">
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFeatureClick('change-language-fr')} className="hover:bg-blue-50">
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
