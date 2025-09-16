import { useTranslation } from 'react-i18next';
import { Search, Bell, Mail, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { i18n, t } = useTranslation();

  const handleChangeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button 
          className="sm:hidden p-2 text-gray-400 hover:text-gray-600"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={t('search')}
            className="pl-10 rtl:pr-10 rtl:pl-3 w-80"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Mail className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://ui-avatars.com/api/?name=Bruce+Wayne&background=6366f1&color=fff"
            alt="Bruce Wayne"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm">
            <p className="font-medium text-gray-900">Bruce Wayne</p>
            <p className="text-gray-500">brucewayne@gmail.com</p>
          </div>
        </div>
        <select
          value={i18n.language}
          onChange={e => handleChangeLang(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ar">{t('arabic')}</option>
          <option value="en">{t('english')}</option>
        </select>
      </div>
    </div>
  );
};

export default DashboardHeader; 