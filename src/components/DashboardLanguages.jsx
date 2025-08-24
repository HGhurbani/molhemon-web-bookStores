import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { motion } from 'framer-motion';
import { Plus, Save, Edit, Trash2 } from 'lucide-react';

const DashboardLanguages = () => {
  const { i18n, t } = useTranslation();
  const [translations, setTranslations] = useState({
    ar: {
      'dashboard': 'لوحة التحكم',
      'books': 'الكتب',
      'orders': 'الطلبات',
      'users': 'المستخدمون',
      'search': 'بحث...',
      'add_book': 'إضافة كتاب جديد',
      'edit': 'تعديل',
      'delete': 'حذف',
      'save': 'حفظ',
      'cancel': 'إلغاء',
      'language': 'اللغة',
      'arabic': 'العربية',
      'english': 'الإنجليزية',
    },
    en: {
      'dashboard': 'Dashboard',
      'books': 'Books',
      'orders': 'Orders',
      'users': 'Users',
      'search': 'Search...',
      'add_book': 'Add New Book',
      'edit': 'Edit',
      'delete': 'Delete',
      'save': 'Save',
      'cancel': 'Cancel',
      'language': 'Language',
      'arabic': 'Arabic',
      'english': 'English',
    }
  });
  const [editingKey, setEditingKey] = useState(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState({ ar: '', en: '' });

  const handleSaveTranslation = (key, lang, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
    setEditingKey(null);
  };

  const handleAddTranslation = () => {
    if (newKey && newValue.ar && newValue.en) {
      setTranslations(prev => ({
        ar: { ...prev.ar, [newKey]: newValue.ar },
        en: { ...prev.en, [newKey]: newValue.en }
      }));
      setNewKey('');
      setNewValue({ ar: '', en: '' });
    }
  };

  const handleDeleteTranslation = (key) => {
    setTranslations(prev => ({
      ar: Object.fromEntries(Object.entries(prev.ar).filter(([k]) => k !== key)),
      en: Object.fromEntries(Object.entries(prev.en).filter(([k]) => k !== key))
    }));
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">إدارة اللغات والترجمات</h2>
        
        {/* إضافة ترجمة جديدة */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">إضافة ترجمة جديدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="مفتاح الترجمة"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="القيمة بالعربية"
              value={newValue.ar}
              onChange={(e) => setNewValue(prev => ({ ...prev, ar: e.target.value }))}
            />
            <Input
              placeholder="القيمة بالإنجليزية"
              value={newValue.en}
              onChange={(e) => setNewValue(prev => ({ ...prev, en: e.target.value }))}
            />
            <Button onClick={handleAddTranslation} className="bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              إضافة
            </Button>
          </div>
        </div>

        {/* جدول الترجمات */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">المفتاح</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">العربية</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(translations.ar).map((key) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{key}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingKey === `${key}-ar` ? (
                      <Input
                        defaultValue={translations.ar[key]}
                        onBlur={(e) => handleSaveTranslation(key, 'ar', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTranslation(key, 'ar', e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => setEditingKey(`${key}-ar`)} className="cursor-pointer hover:bg-gray-100 p-1 rounded">
                        {translations.ar[key]}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingKey === `${key}-en` ? (
                      <Input
                        defaultValue={translations.en[key]}
                        onBlur={(e) => handleSaveTranslation(key, 'en', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTranslation(key, 'en', e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => setEditingKey(`${key}-en`)} className="cursor-pointer hover:bg-gray-100 p-1 rounded">
                        {translations.en[key]}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingKey(`${key}-ar`)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTranslation(key)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardLanguages; 