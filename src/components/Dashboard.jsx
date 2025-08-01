import React, { useState, useEffect } from 'react';
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
  Search,
  Filter,
  Calendar,
  Download,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  Mail,
  Phone,
  MapPinIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Printer,
  RefreshCw,
  FileText,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
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
import { Link } from 'react-router-dom';

const confirmDelete = () => window.confirm('هل أنت متأكد من الحذف؟');

// Header Component
const DashboardHeader = ({ searchQuery, setSearchQuery, user }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rtl:pr-10 rtl:pl-3 bg-gray-50 border-gray-200 rounded-xl h-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Mail className="w-5 h-5" />
        </Button>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="text-right rtl:text-left">
            <p className="text-sm font-medium text-gray-900">Bruce Wayne</p>
            <p className="text-xs text-gray-500">bruce@example.com</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">BW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const DashboardSidebar = ({ dashboardSection, setDashboardSection, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'overview', name: 'نظرة عامة', nameEn: 'Overview', icon: BarChart3 },
    { id: 'books', name: 'إدارة الكتب', nameEn: 'Books', icon: BookOpen },
    { id: 'audiobooks', name: 'الكتب الصوتية', nameEn: 'Audiobooks', icon: Headphones },
    { id: 'inventory', name: 'إدارة المخزون', nameEn: 'Inventory', icon: Boxes },
    { id: 'authors', name: 'المؤلفون', nameEn: 'Authors', icon: Users },
    { id: 'sellers', name: 'البائعون', nameEn: 'Sellers', icon: Store },
    { id: 'branches', name: 'الفروع', nameEn: 'Branches', icon: MapPin },
    { id: 'categories', name: 'الأصناف', nameEn: 'Categories', icon: BookOpen },
    { id: 'orders', name: 'الطلبات', nameEn: 'Orders', icon: Package },
    { id: 'customers', name: 'العملاء', nameEn: 'Customers', icon: UserCheck },
    { id: 'users', name: 'المستخدمون', nameEn: 'Users', icon: User },
    { id: 'payments', name: 'المدفوعات', nameEn: 'Payments', icon: CreditCard },
    { id: 'payment-methods', name: 'طرق الدفع', nameEn: 'Payment Methods', icon: Wallet },
    { id: 'currencies', name: 'العملات', nameEn: 'Currencies', icon: DollarSign },
    { id: 'languages', name: 'اللغات', nameEn: 'Languages', icon: Globe },
    { id: 'google-merchant', name: 'Google Merchant', nameEn: 'Google Merchant', icon: ShoppingCart },
    { id: 'plans', name: 'الخطط', nameEn: 'Plans', icon: DollarSign },
    { id: 'subscriptions', name: 'العضويات', nameEn: 'Subscriptions', icon: Crown },
    { id: 'messages', name: 'الرسائل', nameEn: 'Messages', icon: MessageCircle },
    { id: 'features', name: 'المميزات', nameEn: 'Features', icon: Zap },
    { id: 'sliders', name: 'السلايدر', nameEn: 'Sliders', icon: Image },
    { id: 'banners', name: 'البانرات', nameEn: 'Banners', icon: Image },
    { id: 'settings', name: 'الإعدادات', nameEn: 'Settings', icon: Settings }
  ];

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className={`fixed left-0 rtl:right-0 rtl:left-auto top-0 h-full w-64 bg-white border-r rtl:border-l rtl:border-r-0 border-gray-200 transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 rtl:-translate-x-0' : '-translate-x-full rtl:translate-x-full'}`}>

        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">مولهمون</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, name, nameEn, icon: IconComponent }) => (
            <button
              key={id}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                dashboardSection === id
                  ? 'bg-blue-50 text-blue-700 border-r-2 rtl:border-l-2 rtl:border-r-0 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => {
                setDashboardSection(id);
                setSidebarOpen(false);
              }}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-200">
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              العودة للموقع
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, changeType, icon: IconComponent, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1 rtl:ml-1 rtl:mr-0" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600 mr-1 rtl:ml-1 rtl:mr-0" />
              )}
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${colorClasses[color]}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Table Component
const DataTable = ({ 
  title, 
  data = [], 
  columns = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  addButtonText = "إضافة جديد",
  searchable = true,
  filterable = false,
  exportable = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = searchQuery 
    ? data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rtl:pr-9 rtl:pl-3 w-64 h-9"
                />
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تصفية
              </Button>
            )}
            {exportable && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تصدير
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-right rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            عرض {startIndex + 1} إلى {Math.min(startIndex + itemsPerPage, filteredData.length)} من {filteredData.length} عنصر
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 text-white" : ""}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Chart Component
const SalesChart = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">تقرير المبيعات</h3>
          <p className="text-sm text-gray-500 mt-1">اطلع على مبيعاتك</p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            هذا الشهر
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">4,650.80 AED</div>
        <div className="flex items-center text-sm">
          <ArrowUpRight className="w-4 h-4 text-green-600 mr-1 rtl:ml-1 rtl:mr-0" />
          <span className="text-green-600 font-medium">+236.48 (+4.5%)</span>
        </div>
      </div>

      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">مخطط المبيعات</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-4 rtl:space-x-reverse text-sm">
          <span className="text-gray-600">1d</span>
          <span className="text-gray-600">7d</span>
          <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">30d</span>
          <span className="text-gray-600">3m</span>
          <span className="text-gray-600">1y</span>
        </div>
      </div>
    </div>
  );
};

// Transaction Table Component
const TransactionTable = ({ orders = [] }) => {
  const columns = [
    { key: 'id', header: 'الطلب', render: (value) => `#${value}` },
    { key: 'items', header: 'المنتجات', render: (items) => items?.length || 0 },
    { key: 'format', header: 'النوع', render: () => 'كتاب ورقي' },
    { key: 'date', header: 'التاريخ' },
    { key: 'total', header: 'السعر', render: (value) => <FormattedPrice value={value} /> },
    { 
      key: 'status', 
      header: 'الحالة', 
      render: (status) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          status === 'مكتمل' 
            ? 'bg-green-100 text-green-800'
            : status === 'قيد المراجعة'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    }
  ];

  return (
    <DataTable
      title="آخر المعاملات"
      data={orders.slice(0, 5)}
      columns={columns}
      searchable={false}
      filterable={true}
      exportable={true}
    />
  );
};

// Overview Dashboard
const DashboardOverview = ({ dashboardStats, orders = [] }) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي المنتجات"
          value="236"
          change="+3.5%"
          changeType="increase"
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="الطلبات المكتملة"
          value="128"
          change="+4.8%"
          changeType="increase"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="الطلبات الملغية"
          value="16"
          change="+1.2%"
          changeType="increase"
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title="أهم المنتجات"
          value="120"
          change="+4.5%"
          changeType="increase"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        <div className="space-y-6">
          {/* Sales by Countries */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">المبيعات حسب البلدان</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">اطلع على مبيعاتك</p>

            <div className="space-y-4">
              {[
                { country: 'الإمارات العربية المتحدة', flag: '🇦🇪', amount: '2,156.00', change: '+25.6%', up: true },
                { country: 'المملكة العربية السعودية', flag: '🇸🇦', amount: '1,646.00', change: '+16.3%', up: true },
                { country: 'مصر', flag: '🇪🇬', amount: '826.00', change: '+10.5%', up: true },
                { country: 'قطر', flag: '🇶🇦', amount: '624.00', change: '+7.4%', up: true },
                { country: 'الكويت', flag: '🇰🇼', amount: '456.00', change: '-5.6%', up: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-3 rtl:ml-3 rtl:mr-0">{item.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.country}</p>
                      <p className="text-xs text-gray-500">${item.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {item.up ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600 mr-1 rtl:ml-1 rtl:mr-0" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600 mr-1 rtl:ml-1 rtl:mr-0" />
                    )}
                    <span className={`text-sm font-medium ${item.up ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">المنتجات الشائعة</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">إجمالي 12.6k زائر</p>

            <div className="space-y-4">
              {[
                { title: 'The Shadow King', author: 'Biography & Memoir', price: '60.00' },
                { title: 'Before you choose medicine', author: 'Comics & Graphic Novels', price: '60.00' },
                { title: 'Kingdom of Ash and Blood', author: 'Biography & Memoir', price: '60.00' }
              ].map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-12 bg-gray-200 rounded mr-3 rtl:ml-3 rtl:mr-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${book.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable orders={orders} />
    </div>
  );
};

// Book Form Component (simplified for space)
const BookForm = ({ book, onSubmit, onCancel, authors, categories, currencies }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    description: '',
    ...book
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {book ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
        </h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            حفظ
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">اسم الكتاب</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Kingdom of Ash and Blood"
            required
          />
        </div>

        <div>
          <Label htmlFor="pages">الصفحات</Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
            placeholder="312"
          />
        </div>

        <div>
          <Label htmlFor="author">اسم المؤلف</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Washington DC"
            required
          />
        </div>

        <div>
          <Label htmlFor="cover">الغلاف</Label>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button type="button" variant="outline" size="sm">اختر ملف</Button>
            <span className="text-sm text-gray-500">Kingdom of Ash and Blood Cover.JPG</span>
          </div>
        </div>

        <div>
          <Label htmlFor="category">فئة الكتاب</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Comics & Graphic Novels</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="bookPages">صفحات الكتاب</Label>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button type="button" variant="outline" size="sm">اختر ملف</Button>
            <span className="text-sm text-gray-500">Kingdom of Ash and Blood Cover.EPUB</span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="description">وصف الكتاب</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
          />
        </div>
      </form>
    </div>
  );
};

// Books Dashboard
const DashboardBooks = ({ books, setBooks, authors, categories, currencies }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleAdd = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirmDelete()) return;
    try {
      await api.deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
      toast({ title: 'تم الحذف بنجاح!' });
    } catch (e) {
      toast({ title: 'حدث خطأ أثناء الحذف', variant: 'destructive' });
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingBook) {
        const updated = await api.updateBook(editingBook.id, data);
        setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
        toast({ title: 'تم التعديل بنجاح!' });
      } else {
        const newBook = await api.addBook(data);
        setBooks(prev => [newBook, ...prev]);
        toast({ title: 'تمت الإضافة بنجاح!' });
      }
      setShowForm(false);
      setEditingBook(null);
    } catch (e) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  if (showForm) {
    return (
      <BookForm
        book={editingBook}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingBook(null);
        }}
        authors={authors}
        categories={categories}
        currencies={currencies}
      />
    );
  }

  const columns = [
    { key: 'id', header: 'رقم' },
    { 
      key: 'coverImage', 
      header: 'غلاف الكتاب',
      render: (coverImage, book) => (
        <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
          <img 
            src={coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    { key: 'title', header: 'اسم الكتاب' },
    { key: 'category', header: 'فئة الكتاب' },
    { key: 'author', header: 'اسم المؤلف' },
    { key: 'description', header: 'وصف الكتاب', render: (desc) => desc?.substring(0, 50) + '...' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            كتاب ورقي
          </Button>
          <Button variant="outline">
            كتاب إلكتروني
          </Button>
        </div>
      </div>

      <DataTable
        title="قائمة الكتب"
        data={books}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="إضافة كتاب جديد"
        searchable={true}
        filterable={true}
        exportable={true}
      />
    </div>
  );
};

// Chat Component (simplified)
const DashboardChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: 'Diana Rose', status: 'User', message: 'It is a long established fact', time: '11:18 AM', avatar: '👩' },
    { id: 2, name: 'Lily Williams', status: 'User', message: 'It is a long established fact', time: '11:18 AM', avatar: '👩' },
    { id: 3, name: 'Clark Kent', status: 'User', message: 'It is a long established fact', time: '11:18 AM', avatar: '👨' }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[600px] flex">
      {/* Users List */}
      <div className="w-80 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="بحث..." className="pl-9 rtl:pr-9 rtl:pl-3" />
          </div>
        </div>

        <div className="overflow-y-auto">
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                  <span className="text-lg">{user.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <span className="text-xs text-gray-500">{user.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{user.status}</p>
                  <p className="text-sm text-gray-500 truncate">{user.message}</p>
                </div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                  <span>{selectedUser.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.status}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="text-center">
                <p className="text-sm text-gray-500">07:16 PM</p>
              </div>

              <div className="flex">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hi! I'm looking for the book "What remain of the remains". Do you still have it in stock?</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hi there! Yes, "What remain of the remains" is currently in stock. Would you like the hardcover or paperback edition?</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Input placeholder="اكتب رسالتك..." className="flex-1" />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  إرسال رسالة
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">اختر محادثة للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Details Component (simplified)
const DashboardOrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h1 className="text-2xl font-bold text-gray-900">#{order.id}</h1>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              مدفوع
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              في الانتظار
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="outline">إعادة</Button>
            <Button variant="outline">استرداد</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">تعديل الطلب</Button>
          </div>
        </div>

        <p className="text-gray-600 mb-6">Order / Order Details / #{order.id} - 15 May, 2025</p>

        {/* Progress */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">التقدم</h3>
          <div className="flex items-center justify-between">
            {[
              { title: 'تم الطلب', subtitle: '04-10-2025 11:45', icon: Package, active: true, completed: true },
              { title: 'تم الدفع', subtitle: '04-10-2025 11:45', icon: CreditCard, active: true, completed: true },
              { title: 'تم الشحن', subtitle: '04-10-2025 11:45', icon: Truck, active: true, completed: false },
              { title: 'تم الاستلام', subtitle: '04-10-2025 11:45', icon: CheckCircle, active: false, completed: false },
              { title: 'تم التقييم', subtitle: '04-10-2025 11:45', icon: Star, active: false, completed: false }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-blue-600 text-white' : step.active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2">{step.title}</p>
                <p className="text-xs text-gray-500">{step.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">تاريخ الشحن المقدر: 31 May 2025</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            وضع علامة كجاهز للشحن
          </Button>
        </div>
      </div>

      {/* Order Summary and Customer Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-16 bg-gray-200 rounded mr-4 rtl:ml-4 rtl:mr-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Before You Choose Medicine</p>
                    <p className="text-sm text-gray-500">by Lily Williams</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-4 rtl:ml-4 rtl:mr-0">جاهز</span>
                  <span className="text-sm text-gray-600">الكمية: 1</span>
                  <p className="font-medium text-gray-900">45.00 ℗</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الخط الزمني للطلب</h3>
            <div className="space-y-4">
              {[
                { title: 'تم بدء التغليف', subtitle: 'تأكيد من قبل Mc Cartney', time: '15 May 2025 - 11:18 am', status: 'completed' },
                { title: 'تم إرسال الفاتورة للعميل', subtitle: 'تم إرسال بريد إلكتروني للفاتورة إلى mc.cartney@gmail.com', time: '15 May 2025 - 11:18 am', status: 'completed' },
                { title: 'تم إنشاء الفاتورة', subtitle: 'تم إنشاء الفاتورة من قبل Mc Cartney', time: '15 May 2025 - 11:18 am', status: 'completed' }
              ].map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{event.subtitle}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي للبضائع</span>
                <span className="font-medium">105.00 ℗</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">خصم</span>
                <span className="font-medium">0.00 ℗</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي للشحن</span>
                <span className="font-medium">10.00 ℗</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ضريبة</span>
                <span className="font-medium">0.00 ℗</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>الإجمالي</span>
                <span>105.00 ℗</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الدفع</h3>
            <div className="flex items-center mb-4">
              <div className="w-8 h-6 bg-red-600 rounded mr-3 rtl:ml-3 rtl:mr-0"></div>
              <div>
                <p className="font-medium text-gray-900">Master Card</p>
                <p className="text-sm text-gray-500">**** **** **** 5060</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">معرف المعاملة:</span>
                <span className="font-medium">#101251133</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">اسم حامل البطاقة:</span>
                <span className="font-medium">Mc Cartney</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل العميل</h3>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 rtl:ml-3 rtl:mr-0"></div>
              <div>
                <p className="font-medium text-gray-900">Mc Cartney</p>
                <p className="text-sm text-gray-500">mc.cartney@gmail.com</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">رقم الاتصال</span>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <p className="font-medium">009716012345</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">عنوان الشحن</span>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <p className="font-medium">Gwaah Tower,<br />65, 47 Street, Al sawan,<br />Ajman, 78856,<br />United Arab Emirates<br />009716012345</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button variant="outline" className="flex-1">
                <Printer className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                طباعة
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ dashboardStats, books, authors, sellers, branches, customers, categories, orders, payments, paymentMethods, currencies, languages, plans, subscriptions, users, messages, dashboardSection, setDashboardSection, handleFeatureClick, setBooks, setAuthors, setSellers, setBranches, setCustomers, setCategories, setOrders, setPayments, setPaymentMethods, setCurrencies, setLanguages, setPlans, setSubscriptions, setUsers, setMessages, siteSettings, setSiteSettings, sliders, setSliders, banners, setBanners, features, setFeatures }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    currencies: 'العملات',
    languages: 'اللغات',
    'google-merchant': 'Google Merchant',
    plans: 'خطط الاشتراك',
    subscriptions: 'العضويات',
    messages: 'الرسائل',
    features: 'المميزات',
    sliders: 'السلايدر',
    banners: 'البانرات',
    settings: 'الإعدادات',
  };

  // Mock order for order details demo
  const mockOrder = {
    id: '11331133',
    date: '2025-05-15',
    total: 105.00,
    status: 'قيد المعالجة',
    items: [
      { id: 1, title: 'Before You Choose Medicine', price: 45.00, quantity: 1 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        dashboardSection={dashboardSection} 
        setDashboardSection={setDashboardSection} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{sectionTitles[dashboardSection]}</h1>
          <div></div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {dashboardSection === 'overview' && <DashboardOverview dashboardStats={dashboardStats} orders={orders} />}
          {dashboardSection === 'books' && (
            <DashboardBooks 
              books={books} 
              setBooks={setBooks} 
              authors={authors} 
              categories={categories} 
              currencies={currencies} 
            />
          )}
          {dashboardSection === 'messages' && <DashboardChat />}
          {dashboardSection === 'order-details' && <DashboardOrderDetails order={mockOrder} />}

          {/* Add other sections as needed */}
          {!['overview', 'books', 'messages', 'order-details'].includes(dashboardSection) && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">قسم {sectionTitles[dashboardSection]}</h3>
              <p className="text-gray-600 mb-4">هذا القسم قيد التطوير حالياً</p>
              <Button onClick={() => handleFeatureClick('section-development')}>
                طلب تطوير هذا القسم
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;