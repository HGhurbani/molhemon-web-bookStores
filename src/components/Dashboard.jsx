
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import {
  BookOpen,
  Users,
  Settings,
  BarChart3,
  Package,
  UserCheck,
  DollarSign,
  Eye,
  Plus,
  Edit,
  Trash2,
  Star,
  Home,
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { toast } from '@/components/ui/use-toast.js';

import { Link } from 'react-router-dom';

const DashboardSidebar = ({ dashboardSection, setDashboardSection }) => {
  const navItems = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
    { id: 'books', name: 'إدارة الكتب', icon: BookOpen },
    { id: 'authors', name: 'المؤلفون', icon: Users },
    { id: 'categories', name: 'الأصناف', icon: BookOpen },
    { id: 'orders', name: 'الطلبات', icon: Package },
    { id: 'customers', name: 'العملاء', icon: UserCheck },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ];

  return (
    <div className="sidebar-nav w-64 bg-slate-800 text-slate-100 p-5 flex flex-col h-screen sticky top-0">
      <div className="flex items-center mb-8">
         <img  alt="شعار ملهمون في لوحة التحكم" className="h-10 w-auto mr-2 rtl:ml-2 rtl:mr-0" src="https://images.unsplash.com/photo-1660895815711-2a03b0334326" />
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ملهمون</h2>
          <span className="text-xs text-slate-400">لوحة التحكم</span>
        </div>
      </div>
      
      <nav className="space-y-1.5 flex-grow">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item w-full flex items-center p-3 text-sm rounded-lg transition-all duration-200 ${
                dashboardSection === item.id 
                  ? 'active bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-700 hover:text-white'
              }`}
              onClick={() => setDashboardSection(item.id)}
            >
              <IconComponent className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
              {item.name}
            </button>
          );
        })}
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
  );
};


const AuthorForm = ({ author, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', bio: '', imgPlaceholder: '', ...author });

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

  const handleAddAuthor = (data) => {
    const newAuthor = { id: Date.now(), books: 0, ...data };
    setAuthors(prev => [newAuthor, ...prev]);
    localStorage.setItem('authors', JSON.stringify([newAuthor, ...authors]));
    toast({ title: 'تمت الإضافة بنجاح!' });
    setShowForm(false);
  };

  const handleEditAuthor = (data) => {
    const updated = { ...editingAuthor, ...data };
    setAuthors(prev => prev.map(a => a.id === updated.id ? updated : a));
    localStorage.setItem('authors', JSON.stringify(authors.map(a => a.id === updated.id ? updated : a)));
    toast({ title: 'تم التعديل بنجاح!' });
    setShowForm(false);
    setEditingAuthor(null);
  };

  const handleDeleteAuthor = (id) => {
    setAuthors(prev => prev.filter(a => a.id !== id));
    localStorage.setItem('authors', JSON.stringify(authors.filter(a => a.id !== id)));
    toast({ title: 'تم الحذف بنجاح!', variant: 'destructive' });
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
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {authors.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{a.name}</td>
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

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ id: '', name: '', ...category });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-5 text-gray-700">{category ? 'تعديل الصنف' : 'إضافة صنف جديد'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="id">المعرف</Label>
          <Input id="id" name="id" value={formData.id} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
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

  const handleAdd = (data) => {
    const newCat = { ...data };
    setCategories(prev => [newCat, ...prev]);
    localStorage.setItem('categories', JSON.stringify([newCat, ...categories]));
    toast({ title: 'تمت الإضافة بنجاح!' });
    setShowForm(false);
  };

  const handleEdit = (data) => {
    setCategories(prev => prev.map(c => c.id === data.id ? data : c));
    localStorage.setItem('categories', JSON.stringify(categories.map(c => c.id === data.id ? data : c)));
    toast({ title: 'تم التعديل بنجاح!' });
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    localStorage.setItem('categories', JSON.stringify(categories.filter(c => c.id !== id)));
    toast({ title: 'تم الحذف بنجاح!', variant: 'destructive' });
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
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.id}</td>
                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{c.name}</td>
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

const DashboardOrders = ({ orders }) => (
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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.id}</td>
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.date}</td>
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.total.toFixed(2)} د.إ</td>
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

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
      })}
    </div>

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
        })}
      </div>
    </motion.div>
  </div>
);


const BookForm = ({ book, onSubmit, onCancel, authors, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    authorId: '',
    price: '',
    originalPrice: '',
    rating: '',
    reviews: '',
    category: '',
    description: '',
    imgPlaceholder: '',
    type: '',
    tags: '',
    coverImage: '',
    ...book
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          <div>
            <Label htmlFor="price">السعر</Label>
            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="originalPrice">السعر الأصلي (اختياري)</Label>
            <Input id="originalPrice" name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="rating">التقييم (0-5)</Label>
            <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} />
          </div>
           <div>
            <Label htmlFor="reviews">عدد المراجعات</Label>
            <Input id="reviews" name="reviews" type="number" value={formData.reviews} onChange={handleChange} />
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
            <Label htmlFor="type">النوع</Label>
            <Input id="type" name="type" value={formData.type} onChange={handleChange} />
          </div>
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


const DashboardBooks = ({ books, setBooks, authors, categories, handleFeatureClick }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleAddBook = (newBookData) => {
    const newBook = { 
      ...newBookData, 
      id: Date.now(), 
      price: parseFloat(newBookData.price) || 0,
      originalPrice: parseFloat(newBookData.originalPrice) || null,
      rating: parseFloat(newBookData.rating) || 0,
      reviews: parseInt(newBookData.reviews) || 0,
      author: authors.find(a => a.id === newBookData.authorId)?.name || 'مؤلف غير معروف'
    };
    setBooks(prev => [newBook, ...prev]);
    localStorage.setItem('books', JSON.stringify([newBook, ...books]));
    toast({ title: "تمت الإضافة بنجاح!", description: `تم إضافة كتاب "${newBook.title}".` });
    setShowForm(false);
  };

  const handleEditBook = (updatedBookData) => {
    const updatedBook = {
      ...updatedBookData,
      price: parseFloat(updatedBookData.price) || 0,
      originalPrice: parseFloat(updatedBookData.originalPrice) || null,
      rating: parseFloat(updatedBookData.rating) || 0,
      reviews: parseInt(updatedBookData.reviews) || 0,
      author: authors.find(a => a.id === updatedBookData.authorId)?.name || 'مؤلف غير معروف'
    };
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
    localStorage.setItem('books', JSON.stringify(books.map(b => b.id === updatedBook.id ? updatedBook : b)));
    toast({ title: "تم التعديل بنجاح!", description: `تم تعديل كتاب "${updatedBook.title}".` });
    setShowForm(false);
    setEditingBook(null);
  };

  const handleDeleteBook = (bookId) => {
    const bookToDelete = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    localStorage.setItem('books', JSON.stringify(books.filter(b => b.id !== bookId)));
    toast({ title: "تم الحذف بنجاح!", description: `تم حذف كتاب "${bookToDelete?.title}".`, variant: "destructive" });
  };

  if (showForm) {
    return <BookForm book={editingBook} onSubmit={editingBook ? handleEditBook : handleAddBook} onCancel={() => { setShowForm(false); setEditingBook(null); }} authors={authors} categories={categories} />;
  }

  return (
    <motion.div 
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 sm:mb-0">قائمة الكتب</h2>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
          onClick={() => { setEditingBook(null); setShowForm(true); }}
        >
          <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          إضافة كتاب جديد
        </Button>
      </div>

      <div className="dashboard-card rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">العنوان</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">المؤلف</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">السعر</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">التقييم</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-14 rounded-md mr-3 rtl:ml-3 rtl:mr-0 shadow-sm overflow-hidden flex-shrink-0">
                         <img  alt={`غلاف كتاب ${book.title} المصغر`} className="w-full h-full object-cover" src={book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">{book.author}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm">
                    {book.originalPrice && (
                      <span className="line-through text-red-500 ml-2 rtl:mr-2 rtl:ml-0">{book.originalPrice.toFixed(2)}</span>
                    )}
                    <span className={book.originalPrice ? 'text-red-600 font-bold' : 'text-gray-700'}>{book.price.toFixed(2)} د.إ</span>
                  </td>
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


const Dashboard = ({ dashboardStats, books, authors, categories, orders, dashboardSection, setDashboardSection, handleFeatureClick, setBooks, setAuthors, setCategories, setOrders }) => {
  const sectionTitles = {
    overview: 'نظرة عامة',
    books: 'إدارة الكتب',
    authors: 'المؤلفون',
    orders: 'الطلبات',
    customers: 'العملاء',
    settings: 'الإعدادات',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-gray-800">
      <DashboardSidebar dashboardSection={dashboardSection} setDashboardSection={setDashboardSection} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{sectionTitles[dashboardSection]}</h1>
        </div>

        {dashboardSection === 'overview' && <DashboardOverview dashboardStats={dashboardStats} />}
        {dashboardSection === 'books' && <DashboardBooks books={books} setBooks={setBooks} authors={authors} categories={categories} handleFeatureClick={handleFeatureClick} />}
        {dashboardSection === 'authors' && <DashboardAuthors authors={authors} setAuthors={setAuthors} />}
        {dashboardSection === 'categories' && <DashboardCategories categories={categories} setCategories={setCategories} />}
        {dashboardSection === 'orders' && <DashboardOrders orders={orders} />}
        {['customers', 'settings'].includes(dashboardSection) && (
          <PlaceholderSection sectionName={sectionTitles[dashboardSection]} handleFeatureClick={handleFeatureClick} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
