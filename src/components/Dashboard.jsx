import React, { useState, useEffect } from 'react';
import { currencies } from '@/lib/currencyContext.jsx';
import { languages } from '@/lib/languageContext.jsx';
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
  ShoppingCart,
  MapPin,
  MessageCircle
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

import { Link } from 'react-router-dom';

const confirmDelete = () => window.confirm('هل أنت متأكد من الحذف؟');

const DashboardSidebar = ({ dashboardSection, setDashboardSection, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
    { id: 'books', name: 'إدارة الكتب', icon: BookOpen },
    { id: 'audiobooks', name: 'الكتب الصوتية', icon: Headphones },
    { id: 'inventory', name: 'إدارة المخزون', icon: Boxes },
    { id: 'authors', name: 'المؤلفون', icon: Users },
    { id: 'sellers', name: 'البائعون', icon: Store },
    { id: 'branches', name: 'الفروع', icon: MapPin },
    { id: 'categories', name: 'الأصناف', icon: BookOpen },
    { id: 'orders', name: 'الطلبات', icon: Package },
    { id: 'customers', name: 'العملاء', icon: UserCheck },
    { id: 'users', name: 'المستخدمون', icon: User },
    { id: 'payments', name: 'المدفوعات', icon: CreditCard },
    { id: 'payment-methods', name: 'طرق الدفع', icon: Wallet },
    { id: 'google-merchant', name: 'Google Merchant', icon: ShoppingCart },
    { id: 'plans', name: 'الخطط', icon: DollarSign },
    { id: 'subscriptions', name: 'العضويات', icon: Crown },
    { id: 'messages', name: 'الرسائل', icon: MessageCircle },
    { id: 'features', name: 'المميزات', icon: Zap },
    { id: 'sliders', name: 'السلايدر', icon: Image },
    { id: 'banners', name: 'البانرات', icon: Image },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ];

  return (
    <>
      <div className={`sidebar-nav w-64 bg-slate-800 text-slate-100 p-5 flex flex-col h-screen sm:sticky top-0 transform transition-transform duration-200 fixed z-50 sm:relative ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
           <img alt="شعار ملهمون في لوحة التحكم" className="h-10 w-auto mr-2 rtl:ml-2 rtl:mr-0" src="https://darmolhimon.com/wp-content/uploads/2021/07/Dar.png" />
          <button className="sm:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="space-y-1.5 flex-grow overflow-y-auto">
          {navItems.map(({ id, name, icon: IconComponent }) => (
            <button
              key={id}
              className={`nav-item w-full flex items-center p-3 text-sm rounded-lg transition-all duration-200 ${
                dashboardSection === id
                  ? 'active bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-700 hover:text-white'
              }`}
              onClick={() => {
                setDashboardSection(id);
                setSidebarOpen(false);
              }}
            >
              <IconComponent className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
              {name}
            </button>
          ))}
        </nav>
        <Button
          asChild
          variant="outline"
          className="w-full mt-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Link to="/">
            <Home className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
            العودة للموقع
          </Link>
        </Button>
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

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة المؤلفين</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingAuthor(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة مؤلف
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الكتب</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المباعة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المتابعون</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {authors.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{a.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{a.booksCount}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{a.soldCount}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{a.followers}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingAuthor(a); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDeleteAuthor(a.id)}><Trash2 className="w-4 h-4" /></Button>
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
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة الأصناف</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingCategory(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة صنف
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعرف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الأيقونة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">
                  {AllIcons[c.icon] ? (
                    <React.Fragment>
                      {React.createElement(AllIcons[c.icon], { className: 'w-4 h-4 inline-block mr-2 rtl:ml-2 rtl:mr-0' })}
                      {c.icon}
                    </React.Fragment>
                  ) : (
                    c.icon
                  )}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
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
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة البائعين</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingSeller(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة بائع
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">البريد الإلكتروني</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الهاتف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sellers.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.email}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{s.phone}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
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
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة الفروع</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingBranch(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة فرع
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">العنوان</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الهاتف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">البريد الإلكتروني</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الكود</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {branches.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.address}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.phone}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.email}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{b.code}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
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

const DashboardCustomers = ({ customers, setCustomers }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleAdd = async (data) => {
    try {
      const newCustomer = await api.addCustomer(data);
      setCustomers(prev => [newCustomer, ...prev]);
      toast({ title: 'تمت الإضافة بنجاح!' });
      setShowForm(false);
    } catch (e) {
      toast({ title: 'تعذر إضافة العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await api.updateCustomer(editingCustomer.id, data);
      setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
      toast({ title: 'تم التعديل بنجاح!' });
      setShowForm(false);
      setEditingCustomer(null);
    } catch (e) {
      toast({ title: 'تعذر تعديل العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'تعذر حذف العنصر. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (showForm) {
    return <CustomerForm customer={editingCustomer} onSubmit={editingCustomer ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditingCustomer(null); }} />;
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة العملاء</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingCustomer(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة عميل
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">البريد الإلكتروني</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الهاتف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.email}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.phone}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8" onClick={() => { setEditingCustomer(c); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
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
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة المستخدمين</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingUser(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة مستخدم
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">البريد الإلكتروني</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الدور</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{u.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{u.role}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
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

const SubscriptionForm = ({ subscription, customers, plans, onSubmit, onCancel }) => {
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
          <Label htmlFor="customer">العميل</Label>
          <select id="customer" name="customer_id" value={formData.customer_id} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required>
            <option value="">-- اختر عميل --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

const DashboardSubscriptions = ({ subscriptions, setSubscriptions, customers, plans }) => {
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
    return <SubscriptionForm subscription={editing} customers={customers} plans={plans} onSubmit={editing ? handleEdit : handleAdd} onCancel={() => { setShowForm(false); setEditing(null); }} />;
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
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{customers.find(c => c.id === s.customer_id)?.name || '-'}</td>
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

const DashboardMessages = ({ messages, setMessages }) => {
  const [replyMap, setReplyMap] = useState({});

  const handleReply = async (id) => {
    const text = replyMap[id];
    if (!text) return;
    try {
      const updated = await api.updateMessage(id, { reply: text });
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setReplyMap((prev) => ({ ...prev, [id]: '' }));
      toast({ title: 'تم إرسال الرد' });
    } catch {
      toast({ title: 'حدث خطأ أثناء الإرسال', variant: 'destructive' });
    }
  };

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">رسائل العملاء</h2>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">البريد</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الرسالة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الرد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {messages.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.email}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.text}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  {m.reply ? (
                    m.reply
                  ) : (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={replyMap[m.id] || ''}
                        onChange={(e) => setReplyMap((prev) => ({ ...prev, [m.id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => handleReply(m.id)}>إرسال</Button>
                    </div>
                  )}
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
  const statuses = ['قيد المعالجة', 'قيد الشحن', 'تم التوصيل', 'ملغي'];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle>تفاصيل الطلب {order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p>التاريخ: {order.date}</p>
          <p>الإجمالي: <FormattedPrice value={order.total} /></p>
          <div>
            <Label htmlFor="status">الحالة</Label>
            <select
              id="status"
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="font-semibold mt-4 mb-2">المنتجات</h4>
            <ul className="space-y-1">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.title} × {item.quantity}</span>
                  <span><FormattedPrice value={item.price * item.quantity} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => { onDelete(order.id); onOpenChange(false); }}>
            حذف الطلب
          </Button>
          <DialogClose asChild>
            <Button variant="outline">إغلاق</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DashboardOrders = ({ orders, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    try {
      const updatedOrder = await api.updateOrder(id, { status });
      setOrders(orders.map(o => o.id === id ? updatedOrder : o));
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
      toast({ title: 'تم حذف الطلب' });
    } catch (e) {
      toast({ title: 'حدث خطأ أثناء الحذف. حاول مجدداً.', variant: 'destructive' });
    }
  };

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">الطلبات الواردة</h2>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">رقم الطلب</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">التاريخ</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجمالي</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الحالة</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.date}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700"><FormattedPrice value={o.total} /></td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.status}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <Button asChild size="icon" variant="ghost" className="text-slate-500 hover:bg-blue-100 hover:text-blue-700 w-8 h-8">
                      <Link to={`/admin/orders/${o.id}`}><Eye className="w-4 h-4" /></Link>
                    </Button>
                    <Button size="icon" variant="ghost" className="text-slate-500 hover:bg-red-100 hover:text-red-700 w-8 h-8" onClick={() => handleDeleteOrder(o.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteOrder}
      />
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
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">سجل المدفوعات</h2>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[400px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعرف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">العميل</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الطلب</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">القيمة</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الحالة</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.customer_name || '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.order_id || '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.amount}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{p.status}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
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
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">طرق الدفع</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { setEditingMethod(null); setShowForm(true); }}>
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة طريقة
        </Button>
      </div>
      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <table className="w-full min-w-[350px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المعرف</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الاسم</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">وضع الاختبار</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإعدادات</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paymentMethods.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.name}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.test_mode ? 'نعم' : 'لا'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{m.config ? '✔' : '-'}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm">
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
    </motion.div>
  );
};

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

const DashboardOverview = ({ dashboardStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {dashboardStats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="stats-card p-5 rounded-xl shadow-lg flex items-center justify-between bg-gradient-to-br from-blue-500 to-purple-600 text-white"
          >
            <div>
              <p className="text-blue-100 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-2.5 rounded-full bg-white/20`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </motion.div>
        );
      })
    }</div>

    <motion.div 
      className="dashboard-card p-6 rounded-xl shadow-lg bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-5 text-gray-700">النشاط الأخير</h3>
      <div className="space-y-3">
        {[
          { action: 'طلب جديد', details: 'طلب #1234 - 3 كتب', time: 'منذ 5 دقائق', icon: Package, iconColor: 'text-blue-500' },
          { action: 'كتاب جديد', details: 'تم إضافة "رواية جديدة"', time: 'منذ 15 دقيقة', icon: BookOpen, iconColor: 'text-green-500' },
          { action: 'مراجعة جديدة', details: 'تقييم 5 نجوم لكتاب "الحديث الصامت"', time: 'منذ 30 دقيقة', icon: UserCheck, iconColor: 'text-purple-500' },
          { action: 'عميل جديد', details: 'انضم أحمد محمد للموقع', time: 'منذ ساعة', icon: Users, iconColor: 'text-orange-500' }
        ].map((activity, index) => {
          const ActivityIcon = activity.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 rtl:ml-3 rtl:mr-0 ${activity.iconColor} bg-opacity-10 ${activity.iconColor.replace('text-', 'bg-')}`}>
                    <ActivityIcon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{activity.action}</p>
                  <p className="text-gray-600 text-xs">{activity.details}</p>
                </div>
              </div>
              <span className="text-gray-500 text-xs">{activity.time}</span>
            </div>
          );
        })
      }</div>
    </motion.div>
  </div>
);


const BookForm = ({ book, onSubmit, onCancel, authors, categories, defaultType = '' }) => {
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
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{book ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}</h3>
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


const DashboardBooks = ({ books, setBooks, authors, categories, setCategories, handleFeatureClick, filterType, defaultType }) => {
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
        defaultType={defaultType}
      />
    );
  }

  return (
    <motion.div 
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">
          {filterType === 'audio' ? 'قائمة الكتب الصوتية' : 'قائمة الكتب'}
        </h2>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
            onClick={() => { setEditingBook(null); setShowForm(true); }}
          >
            <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
            إضافة كتاب جديد
          </Button>
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            استيراد من ملف CSV/JSON
          </Button>
        </div>
      </div>

      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">العنوان</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المؤلف</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">السعر</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المخزون</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">التقييم</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-14 rounded-md mr-3 rtl:ml-3 rtl:mr-0 shadow-sm overflow-hidden flex-shrink-0">
                         <img  alt={`غلاف كتاب ${book.title} المصغر`} className="w-full h-full object-cover" src={book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </div>2
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{book.author}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm">
                    {book.originalPrice && (
                      <span className="line-through text-red-500 ml-2 rtl:mr-2 rtl:ml-0">
                        <FormattedPrice value={book.originalPrice} />
                      </span>
                    )}
                    <span className={book.originalPrice ? 'text-red-600 font-bold' : 'text-gray-700'}>
                      <FormattedPrice book={book} />
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{book.stock ?? 0}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                      <span className="text-sm text-gray-700 mr-2 rtl:ml-2 rtl:mr-0">{book.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium">
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


const DashboardSettings = ({ siteSettings, setSiteSettings }) => {
  const [formData, setFormData] = useState(siteSettings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(formData);
      setSiteSettings(updated);
      toast({ title: 'تم حفظ الإعدادات بنجاح!' });
    } catch (err) {
      toast({ title: 'تعذر حفظ البيانات. حاول مجدداً.', variant: 'destructive' });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-6 rounded-xl shadow-lg bg-white"
    >
      <h3 className="text-xl font-semibold mb-5 text-gray-700">إعدادات الموقع</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siteName">اسم الموقع</Label>
            <Input id="siteName" name="siteName" value={formData.siteName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
            <Input id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="contactPhone">رقم الهاتف</Label>
            <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address">العنوان</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
          </div>
          <div>
            <Label htmlFor="facebook">رابط فيسبوك</Label>
            <Input id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="twitter">رابط تويتر</Label>
            <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="instagram">رابط إنستغرام</Label>
            <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="themeColor">اللون الرئيسي</Label>
            <Input id="themeColor" name="themeColor" type="color" value={formData.themeColor} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="defaultLanguage">اللغة الافتراضية</Label>
            <select id="defaultLanguage" name="defaultLanguage" value={formData.defaultLanguage} onChange={handleChange} className="w-full border rounded p-2">
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="languages">اللغات المتاحة (افصل بينها بفاصلة)</Label>
            <Input id="languages" name="languages" value={formData.languages} onChange={handleChange} />
          </div>
          <div className="md:col-span-2 border-t pt-4">
            <h4 className="font-semibold mb-2">إعدادات الدفع</h4>
          </div>
          <div>
            <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
            <Input id="stripePublicKey" name="stripePublicKey" value={formData.stripePublicKey} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
            <Input id="stripeSecretKey" name="stripeSecretKey" value={formData.stripeSecretKey} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="paypalClientId">PayPal Client ID</Label>
            <Input id="paypalClientId" name="paypalClientId" value={formData.paypalClientId} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="paypalSecret">PayPal Secret</Label>
            <Input id="paypalSecret" name="paypalSecret" value={formData.paypalSecret} onChange={handleChange} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </motion.div>
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


const Dashboard = ({ dashboardStats, books, authors, sellers, branches, customers, categories, orders, payments, paymentMethods, plans, subscriptions, users, messages, dashboardSection, setDashboardSection, handleFeatureClick, setBooks, setAuthors, setSellers, setBranches, setCustomers, setCategories, setOrders, setPayments, setPaymentMethods, setPlans, setSubscriptions, setUsers, setMessages, siteSettings, setSiteSettings, sliders, setSliders, banners, setBanners, features, setFeatures }) => {
  const sectionTitles = {
    overview: 'نظرة عامة',
    books: 'إدارة الكتب',
    audiobooks: 'الكتب الصوتية',
    inventory: 'إدارة المخزون',
    authors: 'المؤلفون',
    sellers: 'البائعون',
    branches: 'الفروع',
    orders: 'الطلبات',
    customers: 'العملاء',
    users: 'المستخدمون',
    payments: 'المدفوعات',
    'payment-methods': 'طرق الدفع',
    'google-merchant': 'Google Merchant',
    plans: 'خطط الاشتراك',
    subscriptions: 'العضويات',
    messages: 'الرسائل',
    features: 'المميزات',
    sliders: 'السلايدر',
    banners: 'البانرات',
    settings: 'الإعدادات',
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex text-gray-800 relative">
      <DashboardSidebar dashboardSection={dashboardSection} setDashboardSection={setDashboardSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button className="sm:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{sectionTitles[dashboardSection]}</h1>
        </div>

        {dashboardSection === 'overview' && <DashboardOverview dashboardStats={dashboardStats} />}
        {dashboardSection === 'books' && (
          <DashboardBooks
            books={books}
            setBooks={setBooks}
            authors={authors}
            categories={categories}
            setCategories={setCategories}
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
        {dashboardSection === 'google-merchant' && (
          <DashboardGoogleMerchant
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
          />
        )}
        {dashboardSection === 'customers' && <DashboardCustomers customers={customers} setCustomers={setCustomers} />}
        {dashboardSection === 'users' && <DashboardUsers users={users} setUsers={setUsers} />}
        {dashboardSection === 'plans' && <DashboardPlans plans={plans} setPlans={setPlans} />}
        {dashboardSection === 'subscriptions' && (
          <DashboardSubscriptions
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
            customers={customers}
            plans={plans}
          />
        )}
        {dashboardSection === 'messages' && (
          <DashboardMessages messages={messages} setMessages={setMessages} />
        )}
        {dashboardSection === 'features' && <DashboardFeatures features={features} setFeatures={setFeatures} />}
        {dashboardSection === 'sliders' && <DashboardSliders sliders={sliders} setSliders={setSliders} />}
        {dashboardSection === 'banners' && <DashboardBanners banners={banners} setBanners={setBanners} />}
        {dashboardSection === 'settings' && (
          <DashboardSettings siteSettings={siteSettings} setSiteSettings={setSiteSettings} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;