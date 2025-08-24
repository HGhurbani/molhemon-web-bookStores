import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLanguages as languages } from '@/lib/languageContext.jsx';
import api from '@/lib/api.js';
import FormattedPrice from './FormattedPrice.jsx';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { paymentMethods as paymentMethodTemplates } from '@/data/siteData.js';
import {
  BookOpen,
  Users,
  Settings,
  BarChart3,
  Package,
  UserCheck,
  User,
  Store,
  DollarSign,
  CreditCard,
  Wallet,
  Eye,
  Plus,
  Edit,
  Trash2,
  Star,
  Crown,
  Home,
  Menu,
  X,
  Save,
  Image,
  Zap,
  Headphones,
  Boxes,
  Globe,
  ShoppingCart,
  MapPin,
  MessageCircle,
  Bell,
  LogOut,
  Mail,
  Search,
  Truck
} from 'lucide-react';
import * as AllIcons from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import RichTextEditor from './RichTextEditor.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog.jsx';
import { toast } from '@/components/ui/use-toast.js';
import CsvImportDialog from './CsvImportDialog.jsx';
import ChatWidget from './ChatWidget.jsx';
import DashboardChat from './DashboardChat.jsx';
import DashboardLanguages from './DashboardLanguages.jsx';
import DashboardAnalytics from './DashboardAnalytics.jsx';
import DashboardSettings from './DashboardSettings.jsx';
import DataTable from './DataTable.jsx';

import { Link } from 'react-router-dom';
import firebaseApi from '../lib/firebaseApi';
import { useLanguage } from '../lib/languageContext';
import { useCurrency } from '../lib/currencyContext';
import { useNavigate } from 'react-router-dom';
import ShippingManagement from './ShippingManagement.jsx';

const confirmDelete = () => window.confirm('هل أنت متأكد من الحذف؟');

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button 
          className="sm:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="البحث في الداشبورد..."
            className="pl-10 rtl:pr-10 rtl:pl-3 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Mail className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://ui-avatars.com/api/?name=Bruce+Wayne&background=6366f1&color=fff"
            alt="Bruce Wayne"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Bruce Wayne</p>
            <p className="text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardSidebar = ({ dashboardSection, setDashboardSection, sidebarOpen, setSidebarOpen }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'overview', name: t('overview'), icon: BarChart3 },
    { id: 'categories', name: t('categories'), icon: Package },
    { id: 'authors', name: t('authors'), icon: Users },
    { id: 'books', name: t('books'), icon: BookOpen },
    { id: 'audiobooks', name: t('audiobooks'), icon: Headphones },
    { id: 'orders', name: t('orders'), icon: Package },
    { id: 'subscriptions', name: t('subscriptions'), icon: Crown },
    { id: 'inventory', name: t('inventory'), icon: Boxes },
    { id: 'payments', name: t('payments'), icon: CreditCard },
    { id: 'users', name: t('users'), icon: UserCheck },
    { id: 'analytics', name: t('analytics'), icon: BarChart3 },
    { id: 'messages', name: t('messages'), icon: MessageCircle },
    { id: 'notifications', name: t('notifications'), icon: Bell },
    { id: 'promotions', name: t('promotions'), icon: Zap },
    { id: 'branches', name: t('branches'), icon: MapPin },
    { id: 'shipping', name: 'إدارة الشحن', icon: Truck },
    { id: 'marketing', name: t('marketing'), icon: Globe },
    { id: 'languages', name: t('languages'), icon: Globe },
    { id: 'settings', name: t('settings'), icon: Settings },
    { id: 'logout', name: t('logout'), icon: LogOut }
  ];

  return (
    <>
      <div className={`sidebar-nav w-64 bg-white border-r border-gray-200 flex flex-col h-screen sm:sticky top-0 transform transition-transform duration-200 fixed z-50 sm:relative ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">ملهمون</h1>
            <p className="text-sm text-gray-600">READIN للنشر والتوزيع</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ id, name, icon: IconComponent }) => (
            <button
              key={id}
              onClick={() => {
                setDashboardSection(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                dashboardSection === id 
                  ? 'bg-[#E8E8FF] text-[#5C5CFF]' 
                  : 'text-[#777777] hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${dashboardSection === id ? 'text-[#5C5CFF]' : 'text-[#777777]'}`} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};


const AuthorForm = ({ author, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', bio: '', image: '', imgPlaceholder: '', followers: 0, ...author });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{author ? 'تعديل المؤلف' : 'إضافة مؤلف جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="bio">نبذة</Label>
          <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
        </div>
        <div>
          <Label htmlFor="imgPlaceholder">وصف الصورة (لـ Unsplash)</Label>
          <Input id="imgPlaceholder" name="imgPlaceholder" value={formData.imgPlaceholder} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="image">الصورة</Label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
                reader.readAsDataURL(file);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {author ? 'حفظ التعديلات' : 'إضافة المؤلف'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardAuthors = ({ authors, setAuthors }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const handleAddAuthor = async (data) => {
    try {
      const newAuthor = await api.addAuthor(data);
      setAuthors(prev => [newAuthor, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEditAuthor = async (data) => {
    try {
      const updated = await api.updateAuthor(editingAuthor.id, data);
      setAuthors(prev => prev.map(a => a.id === updated.id ? updated : a));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingAuthor(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDeleteAuthor = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteAuthor(id);
      setAuthors(prev => prev.filter(a => a.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <AuthorForm author={editingAuthor} onSubmit={editingAuthor ? handleEditAuthor : handleAddAuthor} onCancel={() => { setShowForm(false); setEditingAuthor(null); }} />;
  }
  const columns = [
    { key: 'name', header: 'الاسم' },
    { key: 'booksCount', header: 'الكتب' },
    { key: 'soldCount', header: 'المباعة' },
    { key: 'followers', header: 'المتابعون' },
  ];

  return (
    <DataTable
      title="المؤلفون"
      data={authors}
      columns={columns}
      onAdd={() => { setEditingAuthor(null); setShowForm(true); }}
      onEdit={(author) => { setEditingAuthor(author); setShowForm(true); }}
      onDelete={handleDeleteAuthor}
      addButtonText="إضافة مؤلف"
    />
  );
};

const IconDropdown = ({ value, onChange, iconNames }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const Selected = value && AllIcons[value];
  const filtered = React.useMemo(
    () =>
      iconNames.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      ),
    [iconNames, search]
  );
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? (
            <span className="flex items-center">
              {Selected && (
                <Selected className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              )}
              {value}
            </span>
          ) : (
            'اختر أيقونة'
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-60 overflow-auto">
        <div className="p-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث..."
            className="h-8"
          />
        </div>
        {filtered.map((name) => {
          const Icon = AllIcons[name];
          return (
            <DropdownMenuItem
              key={name}
              onSelect={() => {
                onChange(name);
                setOpen(false);
              }}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', icon: '', ...category });
  const iconNames = React.useMemo(() => Object.keys(AllIcons).filter((name) => /^[A-Z]/.test(name)).sort(), []);

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, icon } = formData;
    onSubmit({ name, icon });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{category ? 'تعديل الصنف' : 'إضافة صنف جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="icon">الأيقونة</Label>
          <IconDropdown value={formData.icon} onChange={(val) => handleChange('icon', val)} iconNames={iconNames} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {category ? 'حفظ التعديلات' : 'إضافة الصنف'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardCategories = ({ categories, setCategories }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newCat = await api.addCategory(data);
      setCategories(prev => [newCat, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateCategory(editingCategory.id, data);
      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingCategory(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <CategoryForm category={editingCategory} onSubmit={editingCategory ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingCategory(null); }} />;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">الأصناف</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في الأصناف..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingCategory(null); setShowForm(true); }}>
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة صنف
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المعرف</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الأيقونة</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {AllIcons[c.icon] ? (
                      <React.Fragment>
                        {React.createElement(AllIcons[c.icon], { className: 'w-4 h-4 inline-block mr-2 rtl:ml-2 rtl:mr-0' })}
                        {c.icon}
                      </React.Fragment>
                    ) : (
                      c.icon
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingCategory(c); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
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

const SellerForm = ({ seller, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', ...seller });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleDescChange = (html) => setFormData(prev => ({ ...prev, description: html }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{seller ? 'تعديل البائع' : 'إضافة بائع جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">الهاتف</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {seller ? 'حفظ التعديلات' : 'إضافة البائع'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardSellers = ({ sellers, setSellers }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newSeller = await api.addSeller(data);
      setSellers(prev => [newSeller, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateSeller(editingSeller.id, data);
      setSellers(prev => prev.map(s => s.id === updated.id ? updated : s));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingSeller(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteSeller(id);
      setSellers(prev => prev.filter(s => s.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <SellerForm seller={editingSeller} onSubmit={editingSeller ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingSeller(null); }} />;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Sellers Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">البائعون</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في البائعين..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingSeller(null); setShowForm(true); }}>
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة بائع
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الهاتف</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingSeller(s); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
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

const BranchForm = ({ branch, onSubmit, onCancel }) => {
  const defaultHours = { sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '' };
  const [formData, setFormData] = useState(() => ({
    name: '',
    address: '',
    phone: '',
    email: '',
    code: '',
    hours: defaultHours,
    ...branch,
    hours: { ...defaultHours, ...(branch?.hours || {}) },
  }));

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleHoursChange = (day, value) =>
    setFormData(prev => ({ ...prev, hours: { ...prev.hours, [day]: value } }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{branch ? 'تعديل الفرع' : 'إضافة فرع جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="bname">الاسم</Label>
          <Input id="bname" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="baddress">العنوان</Label>
          <Input id="baddress" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="bphone">الهاتف</Label>
          <Input id="bphone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="bemail">البريد الإلكتروني</Label>
          <Input id="bemail" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="bcode">كود الفرع</Label>
          <Input id="bcode" name="code" value={formData.code} onChange={handleChange} />
        </div>
        <div>
          <Label>ساعات العمل (لكل يوم)</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {Object.keys(formData.hours).map(day => (
              <Input
                key={day}
                placeholder={day}
                value={formData.hours[day]}
                onChange={e => handleHoursChange(day, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {branch ? 'حفظ التعديلات' : 'إضافة الفرع'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardBranches = ({ branches, setBranches }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newBranch = await api.addBranch(data);
      setBranches(prev => [newBranch, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateBranch(editingBranch.id, data);
      setBranches(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingBranch(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteBranch(id);
      setBranches(prev => prev.filter(b => b.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <BranchForm branch={editingBranch} onSubmit={editingBranch ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingBranch(null); }} />;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Branches Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">الفروع</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في الفروع..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingBranch(null); setShowForm(true); }}>
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة فرع
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">العنوان</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الهاتف</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الكود</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingBranch(b); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4" /></Button>
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

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', ...customer });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{customer ? 'تعديل العميل' : 'إضافة عميل جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cname">الاسم</Label>
          <Input id="cname" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="cemail">البريد الإلكتروني</Label>
          <Input id="cemail" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="cphone">الهاتف</Label>
          <Input id="cphone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {customer ? 'حفظ التعديلات' : 'إضافة العميل'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const PlanForm = ({ plan, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    featured: false,
    plan_type: 'membership',
    package_type: 'ebook',
    ...plan,
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDescChange = (html) => setFormData(prev => ({ ...prev, description: html }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration, 10),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{plan ? 'تعديل الخطة' : 'إضافة خطة جديدة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="pname">الاسم</Label>
          <Input id="pname" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="pprice">السعر</Label>
          <Input id="pprice" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="pduration">المدة بالأيام</Label>
          <Input id="pduration" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="pdesc">الوصف</Label>
          <RichTextEditor value={formData.description} onChange={handleDescChange} className="mt-1" />
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input id="featured" type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
          <Label htmlFor="featured">مميزة</Label>
        </div>
        <div>
          <Label htmlFor="plan_type">نوع الخطة</Label>
          <select id="plan_type" name="plan_type" value={formData.plan_type} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
            <option value="membership">عضوية</option>
            <option value="package">باقة</option>
          </select>
        </div>
        {formData.plan_type === 'package' && (
          <div>
            <Label htmlFor="package_type">نوع الباقة</Label>
            <select id="package_type" name="package_type" value={formData.package_type || ''} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
              <option value="ebook">كتب إلكترونية</option>
              <option value="audio">كتب صوتية</option>
            </select>
          </div>
        )}
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {plan ? 'حفظ التعديلات' : 'إضافة الخطة'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer', ...user });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="uname">الاسم</Label>
          <Input id="uname" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="uemail">البريد الإلكتروني</Label>
          <Input id="uemail" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="upass">كلمة المرور</Label>
          <Input id="upass" type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="urole">الدور</Label>
          <select id="urole" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
            <option value="admin">مسؤول</option>
            <option value="author">مؤلف</option>
            <option value="seller">بائع</option>
            <option value="customer">مستخدم</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {user ? 'حفظ التعديلات' : 'إضافة المستخدم'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardUsers = ({ users, setUsers }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newUser = await api.addUser(data);
      setUsers(prev => [newUser, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateUser(editingUser.id, data);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingUser(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <UserForm user={editingUser} onSubmit={editingUser ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingUser(null); }} />;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">المستخدمون</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في المستخدمين..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingUser(null); setShowForm(true); }}>
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة مستخدم
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الدور</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingUser(u); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(u.id)}><Trash2 className="w-4 h-4" /></Button>
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

const DashboardPlans = ({ plans, setPlans }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newPlan = await api.addPlan(data);
      setPlans(prev => [newPlan, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updatePlan(editingPlan.id, data);
      setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingPlan(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deletePlan(id);
      setPlans(prev => prev.filter(p => p.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <PlanForm plan={editingPlan} onSubmit={editingPlan ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingPlan(null); }} />;
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">خطط الاشتراك</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingPlan(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة خطة
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعرف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">السعر</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المدة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">النوع</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">نوع الباقة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">مميزة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {plans.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.price}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.duration}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.plan_type}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.package_type || '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.featured ? '✔' : '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingPlan(p); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const SubscriptionForm = ({ subscription, users, plans, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_id: '',
    status: 'نشط',
    ...subscription,
  });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{subscription ? 'تعديل العضوية' : 'إضافة عضوية جديدة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="user">المستخدم</Label>
          <select id="user" name="customer_id" value={formData.customer_id} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required>
            <option value="">-- اختر مستخدم --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="plan">الخطة</Label>
          <select id="plan" name="plan_id" value={formData.plan_id} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required>
            <option value="">-- اختر خطة --</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="status">الحالة</Label>
          <Input id="status" name="status" value={formData.status} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {subscription ? 'حفظ التعديلات' : 'إضافة العضوية'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardSubscriptions = ({ subscriptions, setSubscriptions, users, plans }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newItem = await api.addSubscription(data);
      setSubscriptions(prev => [newItem, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateSubscription(editing.id, data);
      setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteSubscription(id);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <SubscriptionForm subscription={editing} users={users} plans={plans} onSubmit={editing ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">العضويات</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة عضوية
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعرف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">العميل</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الخطة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">تاريخ البداية</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">تاريخ الانتهاء</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الحالة</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {subscriptions.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{users.find(u => u.id === s.customer_id)?.name || '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{plans.find(p => p.id === s.plan_id)?.name || '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.start_date ? s.start_date.substring(0,10) : '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.end_date ? s.end_date.substring(0,10) : '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.status}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditing(s); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const SliderForm = ({ slider, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ image_url: '', link: '', alt: '', ...slider });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{slider ? 'تعديل صورة' : 'إضافة صورة جديدة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="image_url">الرابط المباشر للصورة</Label>
          <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="image_file">أو قم برفع صورة</Label>
          <input
            id="image_file"
            name="image_file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 1024 * 1024) {
                  toast({
                    title: 'حجم الصورة يتجاوز 1MB',
                    variant: 'destructive',
                  });
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () =>
                  setFormData((prev) => ({ ...prev, image_url: reader.result }));
                reader.readAsDataURL(file);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="link">رابط عند النقر</Label>
          <Input id="link" name="link" value={formData.link} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="alt">وصف بديل</Label>
          <Input id="alt" name="alt" value={formData.alt} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {slider ? 'حفظ التعديلات' : 'إضافة الصورة'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardSliders = ({ sliders, setSliders }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newItem = await api.addSlider(data);
      setSliders(prev => [newItem, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateSlider(editing.id, data);
      setSliders(prev => prev.map(s => s.id === updated.id ? updated : s));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteSlider(id);
      setSliders(prev => prev.filter(s => s.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <SliderForm slider={editing} onSubmit={editing ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">صور السلايدر</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة صورة
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعاينة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الرابط</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sliders.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap"><img src={s.image_url} alt={s.alt} className="w-24 h-14 object-cover rounded" /></td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700 break-all">{s.link}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditing(s); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const BannerForm = ({ banner, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ image_url: '', link: '', alt: '', group_size: 3, ...banner });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...formData, group_size: parseInt(formData.group_size, 10) }); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{banner ? 'تعديل بانر' : 'إضافة بانر جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="bimage_url">الرابط المباشر للصورة</Label>
          <Input id="bimage_url" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="bimage_file">أو قم برفع صورة</Label>
          <input
            id="bimage_file"
            name="bimage_file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 1024 * 1024) {
                  toast({
                    title: 'حجم الصورة يتجاوز 1MB',
                    variant: 'destructive',
                  });
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () =>
                  setFormData((prev) => ({ ...prev, image_url: reader.result }));
                reader.readAsDataURL(file);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="blink">رابط عند النقر</Label>
          <Input id="blink" name="link" value={formData.link} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="balt">وصف بديل</Label>
          <Input id="balt" name="alt" value={formData.alt} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="group_size">عدد الصور في المجموعة</Label>
          <Input id="group_size" name="group_size" type="number" min="1" max="3" value={formData.group_size} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {banner ? 'حفظ التعديلات' : 'إضافة البانر'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardBanners = ({ banners, setBanners }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newItem = await api.addBanner(data);
      setBanners(prev => [newItem, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateBanner(editing.id, data);
      setBanners(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <BannerForm banner={editing} onSubmit={editing ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">البانرات</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة بانر
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعاينة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المجموعة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {banners.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap"><img src={b.image_url} alt={b.alt} className="w-24 h-14 object-cover rounded" /></td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.group_size}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditing(b); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const FeatureForm = ({ feature, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ icon: '', title: '', description: '', ...feature });
  const iconNames = React.useMemo(
    () => Object.keys(AllIcons).filter((name) => /^[A-Z]/.test(name)).sort(),
    []
  );
  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{feature ? 'تعديل ميزة' : 'إضافة ميزة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="icon">الأيقونة</Label>
          <IconDropdown
            value={formData.icon}
            onChange={(val) => handleChange('icon', val)}
            iconNames={iconNames}
          />
        </div>
        <div>
          <Label htmlFor="title">العنوان</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">الوصف</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {feature ? 'حفظ التعديلات' : 'إضافة الميزة'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardFeatures = ({ features, setFeatures }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newItem = await api.addFeature(data);
      setFeatures(prev => [newItem, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateFeature(editing.id, data);
      setFeatures(prev => prev.map(f => f.id === updated.id ? updated : f));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteFeature(id);
      setFeatures(prev => prev.filter(f => f.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <FeatureForm feature={editing} onSubmit={editing ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">المميزات</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة ميزة
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الأيقونة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">العنوان</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
              {features.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">
                    {AllIcons[f.icon] ? (
                      <React.Fragment>
                        {React.createElement(AllIcons[f.icon], { className: 'w-4 h-4 inline-block mr-2 rtl:ml-2 rtl:mr-0' })}
                        {f.icon}
                      </React.Fragment>
                    ) : (
                      f.icon
                    )}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{f.title}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditing(f); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(f.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const DashboardMessages = ({ messages }) => {
  return <DashboardChat messages={messages} />;
};

const DashboardRatings = ({ ratings, setRatings, books }) => {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'غير معروف';

  const handleDelete = async (r) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteRating(r.bookId, r.id);
      setRatings(prev => prev.filter(x => x.id !== r.id));
      toast({ title: 'تم حذف التقييم' });
    } catch (e) {
      toast({ title: 'تعذر الحذف', variant: 'destructive' });
    }
  };

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">تقييمات الكتب</h2>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الكتاب</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">التقييم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">التعليق</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ratings.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{getBookTitle(r.bookId)}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{r.rating}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{r.comment || ''}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(r)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const OrderDetailsDialog = ({ open, onOpenChange, order, onUpdateStatus, onDelete }) => {
  if (!order) return null;
  const statuses = [
    { value: 'قيد المعالجة', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    { value: 'قيد الشحن', label: 'قيد الشحن', color: 'bg-blue-100 text-blue-800', icon: '🚚' },
    { value: 'تم التوصيل', label: 'تم التوصيل', color: 'bg-green-100 text-green-800', icon: '✅' },
    { value: 'ملغي', label: 'ملغي', color: 'bg-red-100 text-red-800', icon: '❌' },
  ];
  const statusObj = statuses.find(s => s.value === order.status) || statuses[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
        {/* رأس ملون */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">تفاصيل الطلب #{order.id}</h2>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusObj.color} bg-opacity-90`}> 
              <span className="mr-1">{statusObj.icon}</span> {statusObj.label}
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-white hover:text-gray-200 text-2xl font-bold">×</button>
        </div>

        {/* جسم البطاقة */}
        <div className="bg-white px-8 py-6 space-y-6">
          {/* معلومات العميل */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-gray-700 font-semibold mb-1">معلومات العميل</div>
              <div className="text-sm text-gray-600">{order.customerName || 'اسم العميل'}</div>
              <div className="text-sm text-gray-500">{order.customerEmail || 'email@example.com'}</div>
              <div className="text-sm text-gray-500">{order.customerPhone || '+971-5x-xxx-xxxx'}</div>
            </div>
            <div className="text-sm text-gray-500">
              <div>التاريخ: <span className="font-semibold text-gray-700">{order.date}</span></div>
              <div>طريقة الدفع: <span className="font-semibold text-gray-700">{order.paymentMethod || 'بطاقة ائتمان'}</span></div>
            </div>
          </div>

          {/* جدول المنتجات */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">المنتجات</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-right font-medium">الصورة</th>
                    <th className="text-right font-medium">المنتج</th>
                    <th className="text-right font-medium">الكمية</th>
                    <th className="text-right font-medium">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="bg-gray-50 rounded-lg">
                      <td className="py-2">
                        <img src={item.image || 'https://via.placeholder.com/40x60/6366f1/fff?text=Book'} alt={item.title} className="w-10 h-14 object-cover rounded shadow" />
                      </td>
                      <td className="py-2 font-medium text-gray-800">{item.title}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2 font-semibold text-blue-700">{item.price * item.quantity} AED</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4 mt-2">
            <div className="space-y-1">
              <div className="text-gray-700 font-semibold">ملخص الطلب</div>
              <div className="text-sm text-gray-600">الإجمالي: <span className="font-bold text-blue-700">{order.total} AED</span></div>
              <div className="text-sm text-gray-600">حالة الدفع: <span className="font-semibold text-green-600">{order.paymentStatus || 'مدفوع'}</span></div>
              <div className="text-sm text-gray-600">حالة التوصيل: <span className="font-semibold text-blue-600">{order.status}</span></div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <label htmlFor="status" className="text-sm text-gray-700 font-medium mb-1">تغيير حالة الطلب</label>
              <select
                id="status"
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="w-48 p-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex flex-row-reverse gap-3 pt-4 border-t mt-2">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700">طباعة الفاتورة</Button>
            <Button variant="destructive" className="px-6 py-2 rounded-lg font-semibold shadow" onClick={() => { onDelete(order.id); onOpenChange(false); }}>
              حذف الطلب
            </Button>
            <Button variant="outline" className="px-6 py-2 rounded-lg font-semibold shadow" onClick={() => onOpenChange(false)}>
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DashboardOrders = ({ orders, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    try {
      const updatedOrder = await api.updateOrder(id, { status });
      setOrders(orders.map(o => o.id === id ? updatedOrder : o));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(updatedOrder);
      }
      toast({ title: 'تم تحديث حالة الطلب' });
    } catch (e) {
      toast({ title: 'حدث خطأ أثناء التحديث. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
        setShowOrderDetails(false);
      }
      toast({ title: 'تم حذف الطلب' });
    } catch (e) {
      toast({ title: 'حدث خطأ أثناء الحذف. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleBackToOrders = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // استخدام البيانات الحقيقية مع إضافة بيانات تجريبية إذا لم تكن موجودة
  const allOrders = orders && orders.length > 0 ? orders : [
    {
      id: '11331133',
      customerName: 'Mc Cartney',
      customerEmail: 'mc.cartney@gmail.com',
      customerPhone: '009716012345',
      date: '15 May 2025',
      total: 105.00,
      paymentMethod: 'Master Card',
      paymentStatus: 'Paid',
      status: 'قيد المعالجة',
      shippingAddress: 'Cayan Tower, 65, 47 Street, Al sawan, Ajman, 78856, United Arab Emirates 009716012345',
      items: [
        {
          id: '1',
          title: 'Before You Choose Medicine',
          author: 'Lily Williams',
          quantity: 1,
          price: 45.00,
          originalPrice: 60.00,
          image: 'https://via.placeholder.com/40x60/6366f1/fff?text=Book',
          status: 'Ready'
        },
        {
          id: '2',
          title: 'Internal Conversation',
          author: 'Lara Croft',
          quantity: 1,
          price: 60.00,
          originalPrice: 75.00,
          image: 'https://via.placeholder.com/40x60/10b981/fff?text=Book',
          status: 'Ready'
        }
      ]
    },
    {
      id: '11341134',
      customerName: 'Lily Williams',
      customerEmail: 'lily.williams@example.com',
      customerPhone: '+971-50-123-4567',
      date: '15 May 2025',
      total: 160.00,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      status: 'قيد الشحن',
      items: [
        {
          id: '1',
          title: 'What Remain Of The Remains',
          author: 'Lily Williams',
          quantity: 2,
          price: 45.00,
          originalPrice: 45.00,
          image: 'https://via.placeholder.com/40x60/6366f1/fff?text=Book',
          status: 'Ready'
        },
        {
          id: '2',
          title: 'Kingdom of Ash and Blood',
          author: 'John Smith',
          quantity: 1,
          price: 70.00,
          originalPrice: 70.00,
          image: 'https://via.placeholder.com/40x60/10b981/fff?text=Book',
          status: 'Ready'
        }
      ]
    },
    {
      id: '11341135',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+971-55-987-6543',
      date: '14 May 2025',
      total: 120.00,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Unpaid',
      status: 'قيد المعالجة',
      items: [
        {
          id: '3',
          title: 'The Forsaken King',
          author: 'Jane Doe',
          quantity: 1,
          price: 120.00,
          originalPrice: 120.00,
          image: 'https://via.placeholder.com/40x60/f59e0b/fff?text=Book',
          status: 'Pending'
        }
      ]
    },
    {
      id: '11341136',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerPhone: '+971-52-456-7890',
      date: '13 May 2025',
      total: 200.00,
      paymentMethod: 'Apple Pay',
      paymentStatus: 'Refund',
      status: 'ملغي',
      items: [
        {
          id: '4',
          title: 'The Silent Echo',
          author: 'Mike Johnson',
          quantity: 1,
          price: 200.00,
          originalPrice: 200.00,
          image: 'https://via.placeholder.com/40x60/ef4444/fff?text=Book',
          status: 'Cancelled'
        }
      ]
    }
  ];

  // إذا كان يتم عرض تفاصيل الطلب
  if (showOrderDetails && selectedOrder) {
    return (
      <OrderDetailsView
        order={selectedOrder}
        onBack={handleBackToOrders}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteOrder}
      />
    );
  }

  const columns = [
    { key: 'id', header: 'رقم الطلب', render: id => `#${id}` },
    { key: 'customerName', header: 'اسم العميل' },
    { key: 'date', header: 'التاريخ' },
    { key: 'total', header: 'المبلغ الإجمالي', render: total => `${total} AED` },
    {
      key: 'paymentStatus',
      header: 'حالة الدفع',
      render: status => (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
          status === 'Paid'
            ? 'bg-green-100 text-green-800'
            : status === 'Unpaid'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status === 'Paid' ? 'مدفوع' : status === 'Unpaid' ? 'غير مدفوع' : 'مسترد'}
        </span>
      )
    },
    { key: 'paymentMethod', header: 'طريقة الدفع' },
    {
      key: 'status',
      header: 'حالة التوصيل',
      render: status => (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
          status === 'تم التوصيل'
            ? 'bg-green-100 text-green-800'
            : status === 'قيد الشحن'
            ? 'bg-blue-100 text-blue-800'
            : status === 'قيد المعالجة'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      render: (_ , order) => (
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewOrder(order)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors" title="تحميل">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors" title="تعديل">
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteOrder(order.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'إجمالي الطلبات', value: allOrders.length.toString(), change: '+34.5%', icon: Package, color: 'blue' },
          { title: 'الطلبات المكتملة', value: allOrders.filter(o => o.status === 'تم التوصيل').length.toString(), change: '+14.5%', icon: Package, color: 'green' },
          { title: 'الطلبات قيد المعالجة', value: allOrders.filter(o => o.status === 'قيد المعالجة').length.toString(), change: '+43.5%', icon: Package, color: 'orange' },
          { title: 'الطلبات الملغية', value: allOrders.filter(o => o.status === 'ملغي').length.toString(), change: '-8.5%', icon: Package, color: 'red' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-white',
            green: 'bg-green-500 text-white',
            orange: 'bg-orange-500 text-white',
            red: 'bg-red-500 text-white'
          };
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <svg className={`w-4 h-4 ml-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.change.startsWith('+') ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                    </svg>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${colorClasses[stat.color]}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Orders Table */}
      <DataTable title="الطلبات" data={allOrders} columns={columns} />
    </motion.div>
  );
};

// مكون عرض تفاصيل الطلب الجديد
const OrderDetailsView = ({ order, onBack, onUpdateStatus, onDelete }) => {
  const statuses = [
    { value: 'قيد المعالجة', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    { value: 'قيد الشحن', label: 'قيد الشحن', color: 'bg-blue-100 text-blue-800', icon: '🚚' },
    { value: 'تم التوصيل', label: 'تم التوصيل', color: 'bg-green-100 text-green-800', icon: '✅' },
    { value: 'ملغي', label: 'ملغي', color: 'bg-red-100 text-red-800', icon: '❌' },
  ];
  const statusObj = statuses.find(s => s.value === order.status) || statuses[0];

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">#{order.id}</h1>
              <p className="text-sm text-gray-500">Order / Order Details / #{order.id} - {order.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusObj.color}`}>
              {statusObj.icon} {statusObj.label}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {order.paymentStatus === 'Paid' ? 'مدفوع' : 'في الانتظار'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
              إرجاع
            </button>
            <button className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
              استرداد
            </button>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
              تعديل الطلب
            </button>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            تحديد كجاهز للشحن
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">التقدم</h3>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {[
              { step: 'تم الطلب', icon: '📄', date: '04-03-2025 11:04', completed: true },
              { step: 'تم الدفع', icon: '💰', date: '115.00 Đ - 04-03-2025 11:04', completed: true },
              { step: 'تم الشحن', icon: '🚚', date: '04-03-2025 11:04', completed: false },
              { step: 'تم الاستلام', icon: '📦', date: '04-03-2025 11:04', completed: false },
              { step: 'تم التقييم', icon: '⭐', date: '04-03-2025 11:04', completed: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  item.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-gray-700">{item.step}</div>
                  <div className="text-gray-500">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Estimate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-600">تقدير تاريخ الشحن:</span>
            <span className="text-sm font-medium text-gray-700">31 May 2025</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary - Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">ملخص الطلب</h3>
            
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">المنتج</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">السعر</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">الكمية</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">المجموع</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">${item.price}</div>
                          {item.originalPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">${item.originalPrice}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-700">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'Ready' ? 'جاهز' : 'قيد التحضير'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات العميل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <p className="text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <p className="text-gray-900">{order.customerEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <p className="text-gray-900">{order.customerPhone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                <p className="text-gray-900">{order.paymentMethod}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الشحن</label>
              <p className="text-gray-900 text-sm">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">إجراءات الطلب</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">تغيير الحالة:</label>
                <select 
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                <button 
                  onClick={() => onDelete(order.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  حذف الطلب
                </button>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                  طباعة الفاتورة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">ملخص الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-medium">${(order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الخصم:</span>
                <span className="font-medium text-green-600">-${(order.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الشحن:</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الضريبة:</span>
                <span className="font-medium">$0.00</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>المجموع الكلي:</span>
                <span className="text-blue-600">${order.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات الدفع</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">حالة الدفع:</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {order.paymentStatus === 'Paid' ? 'مدفوع' : 'في الانتظار'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ الطلب:</span>
                <span className="font-medium">{order.date}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات الشحن</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">طريقة الشحن:</span>
                <span className="font-medium">الشحن القياسي</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ الشحن المتوقع:</span>
                <span className="font-medium">31 May 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">وقت التوصيل:</span>
                <span className="font-medium">3-5 أيام عمل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary - Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">ملخص الطلب</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse p-4 border border-gray-200 rounded-lg">
                  <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded shadow" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">بقلم {item.author}</p>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'Ready' ? 'جاهز' : 'في الانتظار'}
                      </span>
                      <span className="text-sm text-gray-600">الكمية: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">{item.originalPrice} Đ</div>
                    <div className="text-lg font-semibold text-blue-600">{item.price} Đ</div>
                    <div className="text-sm font-medium text-gray-700">المجموع: {item.price * item.quantity} Đ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">جدول الطلب</h3>
            <div className="space-y-4">
              {[
                { event: 'تم بدء التعبئة', details: 'تأكيد من Mc Cartney', time: '15 May 2025 - 11:18 am' },
                { event: 'تم إرسال الفاتورة للعميل', details: 'تم إرسال الفاتورة إلى mc.cartney@gmail.com', time: '15 May 2025 - 11:18 am', action: 'إعادة إرسال الفاتورة' },
                { event: 'تم إنشاء الفاتورة', details: 'تم إنشاء الفاتورة بواسطة Mc Cartney', time: '15 May 2025 - 11:18 am', action: 'تحميل الفاتورة' },
                { event: 'دفع الطلب', details: 'باستخدام Master Card', time: '15 May 2025 - 11:18 am', status: 'مدفوع' },
                { event: 'تأكيد الطلب 4 بواسطة Mc Cartney', details: '', time: '15 May 2025 - 11:18 am', buttons: ['Order 1', 'Order 2'] }
              ].map((timeline, index) => (
                <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{timeline.event}</div>
                    <div className="text-sm text-gray-600">{timeline.details}</div>
                    <div className="text-xs text-gray-500 mt-1">{timeline.time}</div>
                    {timeline.action && (
                      <button className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                        {timeline.action}
                      </button>
                    )}
                    {timeline.status && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-2">
                        {timeline.status}
                      </span>
                    )}
                    {timeline.buttons && (
                      <div className="flex space-x-2 rtl:space-x-reverse mt-2">
                        {timeline.buttons.map((btn, btnIndex) => (
                          <button key={btnIndex} className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Order Summary - Financial */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">ملخص الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">إجمالي البضائع:</span>
                <span className="font-medium">{(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)} Đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الخصم:</span>
                <span className="font-medium">0.00 Đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الشحن:</span>
                <span className="font-medium">10.00 Đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الضريبة:</span>
                <span className="font-medium">0.00 Đ</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-blue-600">{order.total} Đ</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات الدفع</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">MC</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Master Card</div>
                  <div className="text-sm text-gray-600">xxxx xxxx xxxx 5060</div>
                </div>
              </div>
              <div className="text-sm">
                <div className="text-gray-600">معرف المعاملة: <span className="font-medium">#ID{order.id}</span></div>
                <div className="text-gray-600">اسم حامل البطاقة: <span className="font-medium">{order.customerName}</span></div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">تفاصيل العميل</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">{order.customerName ? order.customerName.charAt(0) : '?'}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{order.customerName || 'غير محدد'}</div>
                  <div className="text-sm text-gray-600">{order.customerEmail || 'غير محدد'}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">رقم الاتصال:</span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-medium">{order.customerPhone || 'غير محدد'}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">عنوان الشحن:</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {order.shippingAddress || 'عنوان الشحن'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button className="w-full px-4 py-3 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>طباعة</span>
            </button>
            <button className="w-full px-4 py-3 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>تحميل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🏪', label: 'الناشر', value: 'Darmolhimon' },
          { icon: '📅', label: 'التاريخ', value: order.date || 'غير محدد' },
          { icon: '👤', label: 'تم الدفع بواسطة', value: order.customerName || 'غير محدد' },
          { icon: '📄', label: 'مرجع الطلب', value: `#${order.id}` }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-sm text-gray-600 mb-1">{item.label}</div>
            <div className="font-medium text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const DashboardPayments = ({ payments, setPayments }) => {
  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
      toast({ title: 'تم حذف عملية الدفع' });
    } catch (e) {
      toast({ title: 'حدث خطأ أثناء الحذف. حاول مجدداً.', variant: 'destructive' });
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Payments Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">سجل المدفوعات</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في المدفوعات..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المعرف</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الطلب</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">القيمة</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.customer_name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.order_id || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
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

const PaymentMethodForm = ({ method, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: method?.name || '',
    test_mode: method?.test_mode || false,
    config: method?.config ? JSON.stringify(method.config, null, 2) : ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleTemplateChange = (e) => {
    const tpl = paymentMethodTemplates.find(t => t.id.toString() === e.target.value);
    setSelectedTemplate(e.target.value);
    if (tpl) {
      setFormData({
        name: tpl.name,
        test_mode: tpl.test_mode,
        config: JSON.stringify(tpl.config, null, 2)
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, ...payload } = formData;
    onSubmit(payload);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{method ? 'تعديل طريقة' : 'إضافة طريقة جديدة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="templateSelect">اختر من النماذج</Label>
          <select
            id="templateSelect"
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          >
            <option value="">-- اختر طريقة دفع --</option>
            {paymentMethodTemplates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="mname">الاسم</Label>
          <Input id="mname" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            id="mtest"
            name="test_mode"
            type="checkbox"
            checked={formData.test_mode}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <Label htmlFor="mtest" className="!mb-0">وضع الاختبار</Label>
        </div>
        <div>
          <Label htmlFor="mconfig">الإعدادات (JSON)</Label>
          <Textarea id="mconfig" name="config" value={formData.config} onChange={handleChange} rows={4} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {method ? 'حفظ التعديلات' : 'إضافة الطريقة'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardPaymentMethods = ({ paymentMethods, setPaymentMethods }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  const handleAdd = async (data) => {
    let parsed;
    if (data.config) {
      try {
        parsed = JSON.parse(data.config);
      } catch {
        toast({ title: 'صيغة JSON غير صالحة', variant: 'destructive' });
        return;
      }
    }
    try {
      const newItem = await api.addPaymentMethod({ ...data, config: parsed });
      setPaymentMethods(prev => [newItem, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    let parsed;
    if (data.config) {
      try {
        parsed = JSON.parse(data.config);
      } catch {
        toast({ title: 'صيغة JSON غير صالحة', variant: 'destructive' });
        return;
      }
    }
    try {
      const updated = await api.updatePaymentMethod(editingMethod.id, { ...data, config: parsed });
      setPaymentMethods(prev => prev.map(m => m.id === updated.id ? updated : m));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingMethod(null);
    } catch {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <PaymentMethodForm method={editingMethod} onSubmit={editingMethod ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingMethod(null); }} />;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Payment Methods Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">طرق الدفع</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في طرق الدفع..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingMethod(null); setShowForm(true); }}>
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة طريقة
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المعرف</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">وضع الاختبار</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الإعدادات</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentMethods.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.test_mode ? 'نعم' : 'لا'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.config ? '✔' : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingMethod(m); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4" /></Button>
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

const CurrencyForm = ({ currency, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ code: '', name: '', flag: '', symbol: '', ...currency });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{currency ? 'تعديل العملة' : 'إضافة عملة جديدة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="code">الكود</Label>
          <Input id="code" name="code" value={formData.code} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="flag">رابط العلم</Label>
          <Input id="flag" name="flag" value={formData.flag} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="symbol">رابط الرمز</Label>
          <Input id="symbol" name="symbol" value={formData.symbol} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {currency ? 'حفظ التعديلات' : 'إضافة العملة'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const DashboardCurrencies = ({ currencies, setCurrencies }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newItem = await api.addCurrency(data);
      setCurrencies(prev => [newItem, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateCurrency(editing.id, data);
      setCurrencies(prev => prev.map(c => c.id === updated.id ? updated : c));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditing(null);
    } catch {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteCurrency(id);
      setCurrencies(prev => prev.filter(c => c.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <CurrencyForm currency={editing} onSubmit={editing ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Currencies Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">العملات</h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في العملات..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة عملة
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المعرف</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الكود</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currencies.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditing(c); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
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

const LanguageForm = ({ language, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ code: '', name: '', ...language });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{language ? 'تعديل اللغة' : 'إضافة لغة جديدة'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="code">الكود</Label>
          <Input id="code" name="code" value={formData.code} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {language ? 'حفظ التعديلات' : 'إضافة اللغة'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

// DashboardLanguages component is now imported from separate file

const DashboardInventory = ({ books, setBooks }) => {
  const handleChange = (id, value) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, stock: value } : b));
  };
  const handleSave = async (id, stock) => {
    try {
      const updated = await api.updateBook(id, { stock: Number(stock) });
      setBooks(prev => prev.map(b => b.id === id ? updated : b));
      toast({ title: 'تم تحديث المخزون' });
    } catch {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">إدارة المخزون</h2>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الكتاب</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المخزون</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {books.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.title}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm">
                    <Input type="number" value={b.stock || 0} onChange={e => handleChange(b.id, e.target.value)} className="w-24" />
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm">
                    <Button size="sm" onClick={() => handleSave(b.id, b.stock)}>حفظ</Button>
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

const DashboardOverview = ({ dashboardStats, books, orders, payments }) => {
  const { t } = useTranslation();
  
  // حساب البيانات الحقيقية
  const totalProducts = books?.length || 0;
  const completedOrders = orders?.filter(o => o.status === 'تم التوصيل').length || 0;
  const cancelledOrders = orders?.filter(o => o.status === 'ملغي').length || 0;
  const bestProducts = books?.filter(b => b.rating >= 4).length || 0;
  
  // حساب إجمالي المبيعات
  const totalSales = payments?.reduce((sum, payment) => {
    return sum + (Number(payment.amount) || 0);
  }, 0) || 0;
  
  // حساب نسبة التغيير (مقارنة بالشهر السابق - محاكاة)
  const salesChange = '+4.5%'; // يمكن حسابها من البيانات الفعلية
  
  // أحدث المعاملات من البيانات الحقيقية
  const latestTransactions = orders?.slice(0, 3).map(order => {
    const orderItems = order.items || [];
    const firstItem = orderItems[0] || {};
    return {
      order: `#${order.id}`,
      item: firstItem.title || 'منتج غير محدد',
      format: firstItem.format || 'غير محدد',
      date: new Date(order.date || order.createdAt).toLocaleDateString('ar-SA'),
      price: `${order.total || 0} د.إ`,
      status: order.status === 'تم التوصيل' ? 'مكتمل' : 
               order.status === 'ملغي' ? 'ملغي' : 'قيد المعالجة'
    };
  }) || [];
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'إجمالي المنتجات', value: totalProducts.toString(), change: '+4.5%', icon: Boxes, color: 'blue' },
          { title: 'الطلبات المكتملة', value: completedOrders.toString(), change: '+14.5%', icon: Package, color: 'green' },
          { title: 'الطلبات الملغية', value: cancelledOrders.toString(), change: '-8.5%', icon: X, color: 'red' },
          { title: 'أفضل المنتجات', value: bestProducts.toString(), change: '+24.5%', icon: Star, color: 'orange' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-white',
            green: 'bg-green-500 text-white',
            red: 'bg-red-500 text-white',
            orange: 'bg-orange-500 text-white'
          };
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <svg className={`w-4 h-4 ml-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.change.startsWith('+') ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                    </svg>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${colorClasses[stat.color]}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sales Report Chart */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">تقرير المبيعات</h3>
            <p className="text-gray-600 text-sm">نظرة على مبيعاتك</p>
          </div>
          <select className="text-sm border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <option>إجمالي المبيعات</option>
            <option>المبيعات اليومية</option>
            <option>المبيعات الشهرية</option>
          </select>
        </div>
        
        <div className="mb-6">
          <div className="text-4xl font-bold text-gray-900">{totalSales.toLocaleString()} د.إ</div>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm font-medium">{salesChange}</span>
            <svg className="w-4 h-4 text-green-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          {['اليوم', 'الأسبوع', 'الشهر', '3 أشهر', 'السنة'].map((period, index) => (
            <button
              key={period}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                index === 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
          <div className="text-gray-500 text-sm">سيتم عرض الرسم البياني هنا</div>
        </div>
      </motion.div>

      {/* Latest Transactions */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">أحدث المعاملات</h3>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث..."
                className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
              defaultValue="2025-04-24"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الطلب</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المنتج</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الصيغة</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">السعر</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {latestTransactions.length > 0 ? (
                latestTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{transaction.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.format}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700">{transaction.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'مكتمل' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'ملغي'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    لا توجد معاملات حديثة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Congratulations Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold">تهانينا! 🎉</h3>
        </div>
        <p className="text-blue-100 mb-6">إليك ما يحدث في متجرك اليوم</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          عرض المزيد
        </button>
      </motion.div>
    </div>
  );
};


const BookForm = ({ book, onSubmit, onCancel, authors, categories, currencies, defaultType = '' }) => {
  const initialPrices = currencies.reduce((acc, c) => {
    acc[`price${c.code}`] = book?.prices?.[c.code] ?? (c.code === 'AED' ? book?.price ?? '' : '');
    return acc;
  }, {});

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    authorId: '',
    originalPrice: '',
    category: '',
    stock: '',
    description: '',
    imgPlaceholder: '',
    type: defaultType,
    sampleAudio: '',
    deliveryMethod: '',
    ebookFile: '',
    audioFile: '',
    narrator: '',
    audioLanguage: '',
    durationHours: '',
    durationMinutes: '',
    durationSeconds: '',
    tags: '',
    coverImage: '',
    ...(book ? (({ rating, reviews, ...rest }) => rest)(book) : {}),
    ...initialPrices,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prices = currencies.reduce((acc, c) => {
      acc[c.code] = parseFloat(formData[`price${c.code}`] || 0);
      return acc;
    }, {});
    const duration =
      (parseInt(formData.durationHours || 0, 10) * 3600) +
      (parseInt(formData.durationMinutes || 0, 10) * 60) +
      parseInt(formData.durationSeconds || 0, 10);
    onSubmit({
      ...formData,
      price: prices.AED,
      prices,
      duration,
      stock: parseInt(formData.stock || 0, 10),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-6 rounded-xl shadow-lg bg-white"
    >
      <h3 className="text-xl font-semibold mb-5 text-gray-700">
        {book
          ? 'تعديل الكتاب'
          : defaultType === 'audio'
          ? 'إضافة كتاب صوتي جديد'
          : defaultType === 'ebook'
          ? 'إضافة كتاب إلكتروني جديد'
          : defaultType === 'physical'
          ? 'إضافة كتاب ورقي جديد'
          : 'إضافة كتاب جديد'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">العنوان</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="authorId">المؤلف</Label>
            <select id="authorId" name="authorId" value={formData.authorId} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">اختر مؤلف</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>
          {currencies.map(c => (
            <div key={c.code}>
              <Label htmlFor={`price${c.code}`} className="flex items-center gap-1">
                السعر ({c.name})
                <img alt={`علم ${c.name}`} className="w-4 h-3 object-contain ml-1 rtl:mr-1 rtl:ml-0" src={c.flag} />
              </Label>
              <Input
                id={`price${c.code}`}
                name={`price${c.code}`}
                type="number"
                value={formData[`price${c.code}`]}
                onChange={handleChange}
                {...(c.code === 'AED' ? { required: true } : {})}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="originalPrice">السعر الأصلي (اختياري)</Label>
            <Input id="originalPrice" name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="category">الفئة</Label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">اختر فئة</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="stock">المخزون</Label>
            <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="type">نوع الكتاب</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">اختر نوع الكتاب</option>
              <option value="physical">كتاب ورقي (يتم توصيله)</option>
              <option value="ebook">كتاب إلكتروني</option>
              <option value="audio">كتاب صوتي</option>
            </select>
          </div>
          {formData.type === 'physical' && (
            <div>
              <Label htmlFor="deliveryMethod">طريقة التوصيل</Label>
              <Input id="deliveryMethod" name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} />
            </div>
          )}
          {formData.type === 'ebook' && (
            <div>
              <Label htmlFor="ebookFile">الملف الإلكتروني</Label>
              <input
                id="ebookFile"
                name="ebookFile"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFormData(prev => ({ ...prev, ebookFile: reader.result }));
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
          {formData.type === 'audio' && (
            <>
              <div>
                <Label htmlFor="audioFile">الملف الصوتي</Label>
                <input
                  id="audioFile"
                  name="audioFile"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, audioFile: reader.result }));
                        const audio = new Audio(reader.result);
                        audio.onloadedmetadata = () => {
                          const dur = audio.duration;
                          const hrs = Math.floor(dur / 3600);
                          const mins = Math.floor((dur % 3600) / 60);
                          const secs = Math.floor(dur % 60);
                          setFormData(prev => ({
                            ...prev,
                            durationHours: String(hrs),
                            durationMinutes: String(mins),
                            durationSeconds: String(secs),
                          }));
                        };
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="sampleAudio">رابط عينة صوتية</Label>
                <Input id="sampleAudio" name="sampleAudio" value={formData.sampleAudio} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="narrator">الراوي</Label>
                <Input id="narrator" name="narrator" value={formData.narrator} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="audioLanguage">اللغة</Label>
                <Input id="audioLanguage" name="audioLanguage" value={formData.audioLanguage} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="durationHours">الساعات</Label>
                  <Input id="durationHours" name="durationHours" type="number" value={formData.durationHours} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="durationMinutes">الدقائق</Label>
                  <Input id="durationMinutes" name="durationMinutes" type="number" value={formData.durationMinutes} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="durationSeconds">الثواني</Label>
                  <Input id="durationSeconds" name="durationSeconds" type="number" value={formData.durationSeconds} onChange={handleChange} />
                </div>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="tags">الوسوم</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="مثال: دراما, مغامرة" />
          </div>
          <div>
            <Label htmlFor="coverImage">صورة الغلاف</Label>
            <input id="coverImage" name="coverImage" type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setFormData(prev => ({ ...prev, coverImage: reader.result }));
                reader.readAsDataURL(file);
              }
            }} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <Label htmlFor="imgPlaceholder">وصف الصورة (لـ Unsplash)</Label>
            <Input id="imgPlaceholder" name="imgPlaceholder" value={formData.imgPlaceholder} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="description">الوصف</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
        </div>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {book ? 'حفظ التعديلات' : 'إضافة الكتاب'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};


const DashboardBooks = ({ books, setBooks, authors, categories, setCategories, currencies, handleFeatureClick, filterType, defaultType }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const filteredBooks = filterType ? books.filter(b => b.type === filterType) : books;

  const handleAddBook = async (data) => {
    try {
      const newBook = await api.addBook(data);
      setBooks(prev => [newBook, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEditBook = async (updatedBookData) => {
    try {
      const updated = await api.updateBook(updatedBookData.id, updatedBookData);
      setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingBook(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteBook(bookId);
      setBooks(prev => prev.filter(b => b.id !== bookId));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleImportBooks = async (list) => {
    let currentCategories = [...categories];
    for (const item of list) {
      try {
        let categoryId = item.category;
        if (item.category) {
          const names = String(item.category)
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
          for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let existing = currentCategories.find(
              (c) => c.id === name || c.name === name
            );
            if (!existing) {
              existing = await api.addCategory({ name, icon: 'BookOpen' });
              currentCategories = [...currentCategories, existing];
              setCategories((prev) => [...prev, existing]);
            }
            if (i === 0) categoryId = existing.id;
          }
        }
        const data = {
          ...item,
          category: categoryId,
          prices: { AED: item.price || 0 },
        };
        const newBook = await api.addBook(data);
        setBooks((prev) => [newBook, ...prev]);
      } catch (err) {
        console.error('Import error', err);
      }
    }
    toast({ title: 'تم الاستيراد بنجاح!' });
  };

  if (showForm) {
    return (
      <BookForm
        book={editingBook}
        onSubmit={editingBook ? handleEditBook : handleAddBook}
        onCancel={() => {
          setShowForm(false);
          setEditingBook(null);
        }}
        authors={authors}
        categories={categories}
        currencies={currencies}
        defaultType={defaultType}
      />
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Books Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {filterType === 'audio' ? 'الكتب الصوتية' : 'الكتب'}
            </h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-600">عرض:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في الكتب..."
                  className="pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white w-64"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                onClick={() => { setEditingBook(null); setShowForm(true); }}
              >
                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {filterType === 'audio'
                  ? 'إضافة كتاب صوتي جديد'
                  : filterType === 'ebook'
                  ? 'إضافة كتاب إلكتروني جديد'
                  : filterType === 'physical'
                  ? 'إضافة كتاب ورقي جديد'
                  : 'إضافة كتاب جديد'}
              </Button>
              <Button variant="outline" onClick={() => setImportOpen(true)}>
                استيراد من ملف CSV/JSON
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">العنوان</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المؤلف</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">السعر</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">المخزون</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">التقييم</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-14 rounded-md mr-3 rtl:ml-3 rtl:mr-0 shadow-sm overflow-hidden flex-shrink-0">
                         <img  alt={`غلاف كتاب ${book.title} المصغر`} className="w-full h-full object-cover" src={book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {book.originalPrice && (
                      <span className="line-through text-red-500 ml-2 rtl:mr-2 rtl:ml-0">
                        <FormattedPrice value={book.originalPrice} />
                      </span>
                    )}
                    <span className={book.originalPrice ? 'text-red-600 font-bold' : 'text-gray-700'}>
                      <FormattedPrice book={book} />
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.stock ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                      <span className="text-sm text-gray-700 mr-2 rtl:ml-2 rtl:mr-0">{book.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8"
                        onClick={() => { setEditingBook(book); setShowForm(true); }}
                        aria-label="تعديل الكتاب"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8"
                        onClick={() => handleDeleteBook(book.id)}
                        aria-label="حذف الكتاب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CsvImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={handleImportBooks} />
    </motion.div>
  );
};
const DashboardBooksTabs = (props) => {
  const [tab, setTab] = useState('ebook');

  return (
    <div className="space-y-5">
      <div className="border-b flex gap-2">
        <button
          className={`px-4 py-2 -mb-px border-b-2 ${
            tab === 'ebook'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setTab('ebook')}
        >
          الكتب الإلكترونية
        </button>
        <button
          className={`px-4 py-2 -mb-px border-b-2 ${
            tab === 'physical'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setTab('physical')}
        >
          الكتب الورقية
        </button>
      </div>
      {tab === 'ebook' && (
        <DashboardBooks {...props} filterType="ebook" defaultType="ebook" />
      )}
      {tab === 'physical' && (
        <DashboardBooks {...props} filterType="physical" defaultType="physical" />
      )}
    </div>
  );
};




const DashboardGoogleMerchant = ({ siteSettings, setSiteSettings }) => {
  const [formData, setFormData] = useState({
    googleMerchantId: siteSettings.googleMerchantId || '',
    googleApiKey: siteSettings.googleApiKey || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(formData);
      setSiteSettings((prev) => ({ ...prev, ...updated }));
      toast({ title: 'تم حفظ الإعدادات بنجاح!' });
    } catch (err) {
      toast({ title: 'تعذر حفظ البيانات. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleImport = async () => {
    try {
      await api.importGoogleMerchant({
        googleMerchantId: formData.googleMerchantId,
        googleApiKey: formData.googleApiKey,
      });
      toast({ title: 'تم استيراد الكتب بنجاح!' });
    } catch (err) {
      toast({ title: 'تعذر استيراد البيانات. حاول مجدداً.', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-6 rounded-xl shadow-lg bg-white"
    >
      <h3 className="text-xl font-semibold mb-5 text-gray-700">Google Merchant</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="googleMerchantId">Merchant ID</Label>
            <Input
              id="googleMerchantId"
              name="googleMerchantId"
              value={formData.googleMerchantId}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="googleApiKey">API Key</Label>
            <Input
              id="googleApiKey"
              name="googleApiKey"
              value={formData.googleApiKey}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" onClick={handleImport} variant="outline">
            استيراد من Google Merchant
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const PlaceholderSection = ({ sectionName, handleFeatureClick }) => (
  <motion.div
    className="dashboard-card p-10 rounded-xl shadow-lg text-center flex flex-col items-center justify-center min-h-[350px] bg-white"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg">
      <Settings className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">قسم {sectionName}</h3>
    <p className="text-gray-600 text-sm mb-5">هذا القسم قيد التطوير حالياً. نعمل بجد لإتاحته قريباً!</p>
    <Button 
      onClick={() => handleFeatureClick('section-development-request')}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
    >
      طلب تطوير هذا القسم
    </Button>
  </motion.div>
);


const Dashboard = ({ dashboardStats, books, authors, sellers, branches, categories, orders, payments, paymentMethods, currencies, languages, plans, subscriptions, users, messages, dashboardSection, setDashboardSection, handleFeatureClick, setBooks, setAuthors, setSellers, setBranches, setCategories, setOrders, setPayments, setPaymentMethods, setCurrencies, setLanguages, setPlans, setSubscriptions, setUsers, setMessages, siteSettings, setSiteSettings, sliders, setSliders, banners, setBanners, features, setFeatures }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  // State for real data
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalSales: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    recentOrders: [],
    topBooks: [],
    recentMessages: [],
    isLoading: true
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch real data from Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true }));
        
        // Fetch basic stats
        const dashboardStats = await firebaseApi.getDashboardStats();
        
        // Fetch orders
        const orders = await firebaseApi.getOrders();
        
        // Fetch recent messages
        const messages = await firebaseApi.getMessages();
        
        // Calculate additional stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Get top books (by sales/ratings)
        const books = await firebaseApi.getBooks();
        const topBooks = books
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);
        
        // Get recent messages (last 5)
        const recentMessages = messages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Calculate monthly growth (placeholder - you can implement actual growth calculation)
        const monthlyGrowth = 12.5; // This should be calculated from actual data
        
        setStats({
          totalBooks: dashboardStats.books,
          totalAuthors: dashboardStats.authors,
          totalSales: dashboardStats.sales,
          totalUsers: dashboardStats.users,
          totalOrders,
          totalRevenue,
          monthlyGrowth,
          recentOrders,
          topBooks,
          recentMessages,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const sectionTitles = {
    overview: t('overview'),
    books: t('books'),
    audiobooks: t('audiobooks'),
    inventory: t('inventory'),
    authors: t('authors'),
    sellers: t('authors'), // يمكن تغييرها لاحقاً
    branches: t('branches'),
    orders: t('orders'),
    users: t('users'),
    payments: t('payments'),
    'payment-methods': t('payments'), // يمكن تغييرها لاحقاً
    currencies: t('payments'), // يمكن تغييرها لاحقاً
    languages: t('languages'),
    'google-merchant': 'Google Merchant',
    plans: t('subscriptions'), // يمكن تغييرها لاحقاً
    subscriptions: t('subscriptions'),
    ratings: t('books'), // يمكن تغييرها لاحقاً
    messages: t('messages'),
    features: t('books'), // يمكن تغييرها لاحقاً
    sliders: t('books'), // يمكن تغييرها لاحقاً
    banners: t('books'), // يمكن تغييرها لاحقاً
    analytics: 'Analytics',
    settings: t('settings'),
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (dashboardSection === 'ratings') {
      (async () => {
        try {
          const r = await api.getAllRatings();
          setRatings(r);
        } catch (err) {
          console.error('Failed to load ratings', err);
        }
      })();
    }
  }, [dashboardSection]);

  return (
    <div className="min-h-screen bg-gray-100 flex text-gray-800 relative">
      <DashboardSidebar dashboardSection={dashboardSection} setDashboardSection={setDashboardSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{sectionTitles[dashboardSection]}</h1>
        </div>

        {dashboardSection === 'overview' && <DashboardOverview dashboardStats={dashboardStats} books={books} orders={orders} payments={payments} />}
        {dashboardSection === 'books' && (
          <DashboardBooksTabs
            books={books}
            setBooks={setBooks}
            authors={authors}
            categories={categories}
            setCategories={setCategories}
            currencies={currencies}
            handleFeatureClick={handleFeatureClick}
          />
        )}
        {dashboardSection === 'audiobooks' && (
          <DashboardBooks
            books={books}
            setBooks={setBooks}
            authors={authors}
            categories={categories}
            setCategories={setCategories}
            currencies={currencies}
            handleFeatureClick={handleFeatureClick}
            filterType="audio"
            defaultType="audio"
          />
        )}
        {dashboardSection === 'inventory' && (
          <DashboardInventory books={books} setBooks={setBooks} />
        )}
        {dashboardSection === 'authors' && <DashboardAuthors authors={authors} setAuthors={setAuthors} />}
        {dashboardSection === 'sellers' && <DashboardSellers sellers={sellers} setSellers={setSellers} />}
        {dashboardSection === 'branches' && <DashboardBranches branches={branches} setBranches={setBranches} />}
        {dashboardSection === 'categories' && <DashboardCategories categories={categories} setCategories={setCategories} />}
        {dashboardSection === 'orders' && <DashboardOrders orders={orders} setOrders={setOrders} />}
        {dashboardSection === 'payments' && <DashboardPayments payments={payments} setPayments={setPayments} />}
        {dashboardSection === 'payment-methods' && <DashboardPaymentMethods paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} />}
        {dashboardSection === 'currencies' && <DashboardCurrencies currencies={currencies} setCurrencies={setCurrencies} />}
        {dashboardSection === 'languages' && <DashboardLanguages />}
        {dashboardSection === 'google-merchant' && (
          <DashboardGoogleMerchant
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
          />
        )}
        {dashboardSection === 'users' && <DashboardUsers users={users} setUsers={setUsers} />}
        {dashboardSection === 'plans' && <DashboardPlans plans={plans} setPlans={setPlans} />}
        {dashboardSection === 'subscriptions' && (
          <DashboardSubscriptions
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
            users={users}
            plans={plans}
          />
        )}
        {dashboardSection === 'ratings' && (
          <DashboardRatings ratings={ratings} setRatings={setRatings} books={books} />
        )}
        {dashboardSection === 'messages' && (
          <DashboardMessages messages={messages} />
        )}
        {dashboardSection === 'features' && <DashboardFeatures features={features} setFeatures={setFeatures} />}
        {dashboardSection === 'sliders' && <DashboardSliders sliders={sliders} setSliders={setSliders} />}
        {dashboardSection === 'banners' && <DashboardBanners banners={banners} setBanners={setBanners} />}
        {dashboardSection === 'analytics' && (
          <DashboardAnalytics
            books={books}
            orders={orders}
            payments={payments}
            users={users}
          />
        )}
        {dashboardSection === 'settings' && (
          <DashboardSettings
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            currencies={currencies}
          />
        )}
        {/* Shipping Management Tab */}
        {activeTab === 'shipping' && (
          <ShippingManagement />
        )}
      </main>
      </div>
    </div>
  );
};

export default Dashboard;