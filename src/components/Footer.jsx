
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const Footer = ({ footerLinks, handleFeatureClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-10 sm:pt-12 pb-5 sm:pb-6">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center mb-2.5">
              <img  alt="شعار ملهمون في الفوتر" className="h-9 w-auto mr-1.5 rtl:ml-1.5 rtl:mr-0" src="https://images.unsplash.com/photo-1651263260446-a4f31295a965" />
              <div>
                <span className="block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ملهمون</span>
                <span className="block text-[10px] text-slate-500">للنشر والتوزيع</span>
              </div>
            </Link>
            <p className="text-[11px] text-slate-500 mb-3">تواصل معنا على</p>
            <div className="flex space-x-2.5 rtl:space-x-reverse mb-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  aria-label={`تابعنا على ${Icon.displayName || `social icon ${index}`}`}
                  className="text-slate-500 hover:text-blue-400 transition-colors"
                  onClick={(e) => { e.preventDefault(); handleFeatureClick(`social-${Icon.displayName?.toLowerCase() || `icon${index}` }`);}}
                >
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mb-1.5">متوفر على</p>
            <div className="flex flex-col sm:flex-row space-y-1.5 sm:space-y-0 sm:space-x-1.5 rtl:sm:space-x-reverse">
                <button onClick={() => handleFeatureClick('google-play')} aria-label="تحميل التطبيق من جوجل بلاي" className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-2.5 rounded-md flex items-center text-[10px] sm:text-xs justify-center sm:justify-start">
                    <img  alt="أيقونة جوجل بلاي" className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" src="https://images.unsplash.com/photo-1679094837433-32484a621c74" />
                    Google Play
                </button>
                <button onClick={() => handleFeatureClick('app-store')} aria-label="تحميل التطبيق من آب ستور" className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-2.5 rounded-md flex items-center text-[10px] sm:text-xs justify-center sm:justify-start">
                    <img  alt="أيقونة آب ستور" className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" src="https://images.unsplash.com/photo-1620829868801-8a443f0370f3" />
                    App Store
                </button>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-sm sm:text-base text-slate-200 mb-3 sm:mb-4">{section.title}</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href === '#' || link.action ? (
                       <a
                        href={link.href}
                        className="text-slate-400 hover:text-blue-400 text-[11px] sm:text-xs transition-colors"
                        onClick={(e) => { e.preventDefault(); handleFeatureClick(link.action || link.text.toLowerCase().replace(/\s/g, '-'));}}
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-blue-400 text-[11px] sm:text-xs transition-colors"
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700/50 pt-5 sm:pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-slate-500">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} ملهمون</p>
          <div className="flex space-x-2.5 sm:space-x-3 rtl:space-x-reverse mt-2 sm:mt-0">
            <a href="#" className="hover:text-blue-400" onClick={(e) => {e.preventDefault(); handleFeatureClick('privacy-policy')}}>سياسة الخصوصية</a>
            <a href="#" className="hover:text-blue-400" onClick={(e) => {e.preventDefault(); handleFeatureClick('terms-of-use')}}>شروط الاستخدام</a>
          </div>
        </div>
      </div>
      <Button 
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-2.5 sm:p-3 z-50"
        size="icon"
        aria-label="فتح نافذة الدردشة"
        onClick={() => handleFeatureClick('chat-support')}
      >
        <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
      </Button>
    </footer>
  );
};

export default Footer;
