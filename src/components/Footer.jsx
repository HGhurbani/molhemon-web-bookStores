
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import NewsletterSection from '@/components/NewsletterSection.jsx';

const Footer = ({ footerLinks, handleFeatureClick, siteSettings = {} }) => {
  return (
    <>
    <NewsletterSection handleFeatureClick={handleFeatureClick} />
    <footer className="bg-[#2E3192] text-white pt-10 sm:pt-12 pb-5 sm:pb-6 rounded-t-2xl -mt-6 sm:-mt-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center mb-2.5">
              <img  alt="شعار ملهمون في الفوتر" className="h-9 w-auto mr-1.5 rtl:ml-1.5 rtl:mr-0" src="https://darmolhimon.com/wp-content/uploads/2021/07/Dar.png" />
   
            </Link>
            <p className="text-[11px] text-white mb-3">تواصل معنا على</p>
            <div className="flex space-x-2.5 rtl:space-x-reverse mb-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  aria-label={`تابعنا على ${Icon.displayName || `social icon ${index}`}`}
                  className="text-white hover:text-blue-200 transition-colors"
                  onClick={(e) => { e.preventDefault(); handleFeatureClick(`social-${Icon.displayName?.toLowerCase() || `icon${index}` }`);}}
                >
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
            <p className="text-[11px] text-white mb-1.5">متوفر على</p>
            <div className="flex flex-col sm:flex-row space-y-1.5 sm:space-y-0 sm:space-x-1.5 rtl:sm:space-x-reverse">
                <button onClick={() => handleFeatureClick('google-play')} aria-label="تحميل التطبيق من جوجل بلاي" className="border border-white text-white bg-transparent hover:bg-white/10 py-1.5 px-2.5 rounded-lg flex items-center text-[10px] sm:text-xs justify-center sm:justify-start">
                    <svg className="w-4 h-4 text-white ml-2 rtl:mr-2 rtl:ml-0" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
                        <path d="M325.3 234.3L104.7 6.6c-4.5-4.5-12.2-1.2-12.2 5.7v487.4c0 6.9 7.7 10.2 12.2 5.7l220.6-227.7-220.6-127zM352.3 256L142.6 138.2l158.4 91.8L352.3 256zM352.3 256l-51.3 26L142.6 373.8 352.3 256zM386.2 278.9l82.1 47.5c6.4 3.7 14.5-0.9 14.5-8.3V193.9c0-7.4-8.1-12-14.5-8.3l-82.1 47.5-51.3 23.5 51.3 23.5z"/>
                    </svg>
                    Google Play
                </button>
                <button onClick={() => handleFeatureClick('app-store')} aria-label="تحميل التطبيق من آب ستور" className="border border-white text-white bg-transparent hover:bg-white/10 py-1.5 px-2.5 rounded-lg flex items-center text-[10px] sm:text-xs justify-center sm:justify-start">
                    <svg className="w-4 h-4 text-white ml-2 rtl:mr-2 rtl:ml-0" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
                        <path d="M318.7 268.6c-.2-52.8 43.2-78 45-79.1-24.5-36-62.7-41-76.3-41.5-32.4-3.3-63.2 19.1-79.5 19.1-16.3 0-41.5-18.6-68.3-18.1-35.1.5-67.5 20.4-85.5 51.7-36.6 63.5-9.3 158.1 26.2 210 17.4 25.1 38.1 53.3 65.5 52.2 26.3-1 36.3-17 68-17 31.6 0 41 17 68.4 16.5 28.3-.5 46.2-25.5 63.6-50.7 20.1-29.3 28.4-57.8 28.7-59.3-.6-.3-55-21.1-55.2-83.1zM255 81.8c14.5-17.6 24.3-42.1 21.6-66.8-21 1-46.4 14-61.5 31.6-13.5 15.7-25.2 40.8-22 64.9 23.3 1.8 47.2-11.9 61.9-29.7z"/>
                    </svg>
                    App Store
                </button>
            </div>
            {siteSettings.contactEmail && (
              <p className="text-[11px] text-white mt-4">{siteSettings.contactEmail}</p>
            )}
            {siteSettings.contactPhone && (
              <p className="text-[11px] text-white">{siteSettings.contactPhone}</p>
            )}
            {siteSettings.address && (
              <p className="text-[11px] text-white">{siteSettings.address}</p>
            )}
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-sm sm:text-base text-white mb-3 sm:mb-4">{section.title}</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href === '#' || link.action ? (
                       <a
                        href={link.href}
                        className="text-white hover:text-blue-200 text-[11px] sm:text-xs transition-colors"
                        onClick={(e) => { e.preventDefault(); handleFeatureClick(link.action || link.text.toLowerCase().replace(/\s/g, '-'));}}
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-white hover:text-blue-200 text-[11px] sm:text-xs transition-colors"
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

        <div className="border-t border-slate-700/50 pt-5 sm:pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-white">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {siteSettings.siteName || 'ملهمون'}</p>
          <div className="flex space-x-2.5 sm:space-x-3 rtl:space-x-reverse mt-2 sm:mt-0">
            <Link to="/privacy-policy" className="hover:text-blue-200">سياسة الخصوصية</Link>
            <Link to="/terms-of-service" className="hover:text-blue-200">شروط الاستخدام</Link>
            <Link to="/return-policy" className="hover:text-blue-200">سياسة الإرجاع</Link>
          </div>
        </div>
      </div>
     
    </footer>
    </>
  );
};

export default Footer;
