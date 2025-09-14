import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  BookOpen,
  User
} from 'lucide-react';
import { useCart } from '@/lib/cartContext.jsx';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: Home,
      path: '/',
      isActive: location.pathname === '/'
    },
    {
      id: 'orders',
      label: 'طلباتي',
      icon: ShoppingBag,
      path: '/orders',
      isActive: location.pathname.startsWith('/orders')
    },
    {
      id: 'cart',
      label: 'عربة التسوق',
      icon: ShoppingCart,
      path: '/cart',
      isActive: location.pathname === '/cart',
      badge: cartItemCount > 0 ? cartItemCount : null
    },
    {
      id: 'library',
      label: 'مكتبتي',
      icon: BookOpen,
      path: '/library',
      isActive: location.pathname.startsWith('/library')
    },
    {
      id: 'profile',
      label: 'الملف الشخصي',
      icon: User,
      path: '/profile',
      isActive: location.pathname.startsWith('/profile')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                item.isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <IconComponent 
                  className={`w-5 h-5 ${item.isActive ? 'text-blue-600' : 'text-gray-500'}`} 
                />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                item.isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
