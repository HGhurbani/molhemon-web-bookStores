import React, { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import FormattedPrice from './FormattedPrice.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { paymentMethods as paymentMethodTemplates } from '@/data/siteData.js';
import logger from '@/lib/logger.js';
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
  Truck,
  LogOut,
  AlertCircle,
  Clock,
  Maximize2,
  ExternalLink
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

// Enhanced Header Component
const DashboardHeader = ({ searchQuery, setSearchQuery, user }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'طلب جديد', message: 'تم استلام طلب جديد #12345', time: '5 دقائق', unread: true },
    { id: 2, title: 'رسالة جديدة', message: 'رسالة من عميل جديد', time: '10 دقائق', unread: true },
    { id: 3, title: 'تحديث النظام', message: 'تم تحديث النظام بنجاح', time: '1 ساعة', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في النظام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-3 bg-gray-50 border-gray-200 rounded-xl h-11 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
            <Button size="sm" variant="outline" className="text-gray-600 hover:text-blue-600">
              <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              إضافة سريعة
            </Button>
            <Button size="sm" variant="outline" className="text-gray-600 hover:text-green-600">
              <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              تصدير
            </Button>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                <p className="text-sm text-gray-500">{unreadCount} إشعار جديد</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t">
                <Button variant="ghost" className="w-full text-sm">
                  عرض جميع الإشعارات
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-colors">
            <Mail className="w-5 h-5" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div className="text-right rtl:text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Bruce Wayne</p>
                  <p className="text-xs text-gray-500">مدير النظام</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-medium">BW</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Sidebar Component
const DashboardSidebar = ({ dashboardSection, setDashboardSection, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'overview', name: 'نظرة عامة', nameEn: 'Overview', icon: BarChart3, badge: null },
    { id: 'books', name: 'إدارة الكتب', nameEn: 'Books', icon: BookOpen, badge: '236' },
    { id: 'audiobooks', name: 'الكتب الصوتية', nameEn: 'Audiobooks', icon: Headphones, badge: '42' },
    { id: 'inventory', name: 'إدارة المخزون', nameEn: 'Inventory', icon: Boxes, badge: null },
    { id: 'authors', name: 'المؤلفون', nameEn: 'Authors', icon: Users, badge: '89' },
    { id: 'sellers', name: 'البائعون', nameEn: 'Sellers', icon: Store, badge: null },
    { id: 'branches', name: 'الفروع', nameEn: 'Branches', icon: MapPin, badge: null },
    { id: 'categories', name: 'الأصناف', nameEn: 'Categories', icon: BookOpen, badge: null },
    { id: 'orders', name: 'الطلبات', nameEn: 'Orders', icon: Package, badge: '15' },
    { id: 'customers', name: 'العملاء', nameEn: 'Customers', icon: UserCheck, badge: '1.2k' },
    { id: 'users', name: 'المستخدمون', nameEn: 'Users', icon: User, badge: null },
    { id: 'payments', name: 'المدفوعات', nameEn: 'Payments', icon: CreditCard, badge: null },
    { id: 'payment-methods', name: 'طرق الدفع', nameEn: 'Payment Methods', icon: Wallet, badge: null },
    { id: 'currencies', name: 'العملات', nameEn: 'Currencies', icon: DollarSign, badge: null },
    { id: 'languages', name: 'اللغات', nameEn: 'Languages', icon: Globe, badge: null },
    { id: 'google-merchant', name: 'Google Merchant', nameEn: 'Google Merchant', icon: ShoppingCart, badge: null },
    { id: 'plans', name: 'الخطط', nameEn: 'Plans', icon: DollarSign, badge: null },
    { id: 'subscriptions', name: 'العضويات', nameEn: 'Subscriptions', icon: Crown, badge: null },
    { id: 'messages', name: 'الرسائل', nameEn: 'Messages', icon: MessageCircle, badge: '5' },
    { id: 'features', name: 'المميزات', nameEn: 'Features', icon: Zap, badge: null },
    { id: 'sliders', name: 'السلايدر', nameEn: 'Sliders', icon: Image, badge: null },
    { id: 'banners', name: 'البانرات', nameEn: 'Banners', icon: Image, badge: null },
    { id: 'settings', name: 'الإعدادات', nameEn: 'Settings', icon: Settings, badge: null },
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
    { id: 'currencies', name: 'العملات', icon: DollarSign },
    { id: 'languages', name: 'اللغات', icon: Globe },
    { id: 'google-merchant', name: 'Google Merchant', icon: ShoppingCart },
    { id: 'plans', name: 'الخطط', icon: DollarSign },
    { id: 'subscriptions', name: 'العضويات', icon: Crown },
    { id: 'ratings', name: 'تقييمات الكتب', icon: Star },
    { id: 'messages', name: 'الرسائل', icon: MessageCircle },
    { id: 'features', name: 'المميزات', icon: Zap },
    { id: 'sliders', name: 'السلايدر', icon: Image },
    { id: 'banners', name: 'البانرات', icon: Image },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ];

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed left-0 rtl:right-0 rtl:left-auto top-0 h-full w-72 bg-white border-r rtl:border-l rtl:border-r-0 border-gray-200 z-50 lg:relative lg:translate-x-0 shadow-xl lg:shadow-none`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">مولهمون</span>
              <p className="text-xs text-blue-100">لوحة التحكم</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white hover:bg-opacity-20" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, name, nameEn, icon: IconComponent, badge }) => (
            <motion.button
              key={id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between space-x-3 rtl:space-x-reverse px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                dashboardSection === id
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-4 rtl:border-l-4 rtl:border-r-0 border-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => {
                setDashboardSection(id);
                setSidebarOpen(false);
              }}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${dashboardSection === id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="font-medium">{name}</span>
              </div>
              {badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  dashboardSection === id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button
            asChild
            variant="outline"
            className="w-full hover:bg-white transition-colors"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              العودة للموقع
              <ExternalLink className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </>
  );
};

// Enhanced Stats Card Component
const StatsCard = ({ title, value, change, changeType, icon: IconComponent, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      gradient: "from-blue-500 to-blue-600"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      gradient: "from-green-500 to-green-600"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
      gradient: "from-purple-500 to-purple-600"
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      gradient: "from-orange-500 to-orange-600"
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      gradient: "from-red-500 to-red-600"
    }
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          {change && (
            <div className="flex items-center">
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1 rtl:ml-1 rtl:mr-0" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600 mr-1 rtl:ml-1 rtl:mr-0" />
              )}
              <span className={`text-sm font-semibold ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
              <span className="text-xs text-gray-500 mr-1 rtl:ml-1 rtl:mr-0">من الشهر الماضي</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${classes.gradient} flex items-center justify-center shadow-lg`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className={`absolute top-0 right-0 w-20 h-20 ${classes.bg} rounded-full opacity-30 -mr-10 -mt-10`}></div>
    </motion.div>
  );
};

// Enhanced Data Table Component
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
  exportable = false,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
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

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
    >
      {/* Enhanced Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{filteredData.length} عنصر</p>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rtl:pr-9 rtl:pl-3 w-64 h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تصفية
              </Button>
            )}
            {exportable && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تصدير
              </Button>
            )}
            {selectedItems.length > 0 && (
              <Button variant="outline" size="sm" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                حذف ({selectedItems.length})
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md">
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-600">جاري التحميل...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right rtl:text-right">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-4 text-right rtl:text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item, index) => (
                <motion.tr
                  key={item.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
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
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            عرض {startIndex + 1} إلى {Math.min(startIndex + itemsPerPage, filteredData.length)} من {filteredData.length} عنصر
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg"
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
                  className={`rounded-lg ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
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
              className="rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Enhanced Chart Component
const SalesChart = () => {
  return (
    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-500">مخطط المبيعات سيظهر هنا قريباً</p>
    </div>
  );
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
  const statuses = ['قيد المعالجة', 'قيد الشحن', 'تم التوصيل', 'ملغي'];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">تقرير المبيعات</h3>
          <p className="text-sm text-gray-500 mt-1">اطلع على أداء مبيعاتك الشهرية</p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            هذا الشهر
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>تصدير البيانات</DropdownMenuItem>
              <DropdownMenuItem>طباعة التقرير</DropdownMenuItem>
              <DropdownMenuItem>مشاركة</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-gray-900">4,650.80 AED</div>
        <div className="flex items-center text-sm">
          <ArrowUpRight className="w-4 h-4 text-green-600 mr-1 rtl:ml-1 rtl:mr-0" />
          <span className="text-green-600 font-semibold">+236.48 (+4.5%)</span>
          <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">مقارنة بالشهر الماضي</span>
        </div>
      </div>

      <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">مخطط المبيعات التفاعلي</p>
          <p className="text-sm text-gray-500 mt-1">سيتم عرض البيانات هنا</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-4 rtl:space-x-reverse text-sm">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">1d</button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">7d</button>
          <button className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">30d</button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">3m</button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">1y</button>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          تحديث
        </Button>
      </div>
    </motion.div>
  );
};

// Rest of the components remain the same but with enhanced styling...
// (TransactionTable, DashboardOverview, BookForm, DashboardBooks, DashboardChat, DashboardOrderDetails components)

// Enhanced Overview Dashboard
const DashboardOverview = ({ dashboardStats, orders = [] }) => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مرحباً بك، Bruce</h1>
            <p className="text-blue-100 text-lg">إليك نظرة سريعة على أداء متجرك اليوم</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">الإحصائيات الرئيسية</h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="rounded-xl"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي المنتجات"
          value="2,156"
          change="+12.5%"
          changeType="increase"
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="الطلبات المكتملة"
          value="1,428"
          change="+8.2%"
          changeType="increase"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="إجمالي الإيرادات"
          value="45,280 AED"
          change="+15.3%"
          changeType="increase"
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="عدد العملاء"
          value="3,247"
          change="+5.7%"
          changeType="increase"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts and Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        <div className="space-y-6">
          {/* Sales by Countries - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">المبيعات حسب البلدان</h3>
                <p className="text-sm text-gray-500 mt-1">توزيع الإيرادات جغرافياً</p>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { country: 'الإمارات العربية المتحدة', flag: '🇦🇪', amount: '2,156.00', percentage: 45, change: '+25.6%', up: true },
                { country: 'المملكة العربية السعودية', flag: '🇸🇦', amount: '1,646.00', percentage: 35, change: '+16.3%', up: true },
                { country: 'مصر', flag: '🇪🇬', amount: '826.00', percentage: 15, change: '+10.5%', up: true },
                { country: 'قطر', flag: '🇶🇦', amount: '624.00', percentage: 12, change: '+7.4%', up: true },
                { country: 'الكويت', flag: '🇰🇼', amount: '456.00', percentage: 8, change: '-5.6%', up: false }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3 rtl:ml-3 rtl:mr-0">{item.flag}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.country}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2 rtl:ml-2 rtl:mr-0">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">${item.amount}</span>
                      </div>
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Popular Products - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">المنتجات الشائعة</h3>
                <p className="text-sm text-gray-500 mt-1">الأكثر مبيعاً هذا الشهر</p>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { title: 'The Shadow King', author: 'Biography & Memoir', price: '60.00', sales: 245, trend: 'up' },
                { title: 'Before you choose medicine', author: 'Comics & Graphic Novels', price: '60.00', sales: 189, trend: 'up' },
                { title: 'Kingdom of Ash and Blood', author: 'Biography & Memoir', price: '60.00', sales: 156, trend: 'down' }
              ].map((book, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mr-3 rtl:ml-3 rtl:mr-0 shadow-sm"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{book.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-medium text-gray-700">{book.sales} مبيعة</span>
                        {book.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1 rtl:ml-1 rtl:mr-0" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-500 mr-1 rtl:ml-1 rtl:mr-0" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">${book.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-xl flex-col">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs">إضافة كتاب</span>
              </Button>
              <Button variant="outline" className="h-12 rounded-xl flex-col">
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs">عميل جديد</span>
              </Button>
              <Button variant="outline" className="h-12 rounded-xl flex-col">
                <Package className="w-5 h-5 mb-1" />
                <span className="text-xs">إدارة الطلبات</span>
              </Button>
              <Button variant="outline" className="h-12 rounded-xl flex-col">
                <BarChart3 className="w-5 h-5 mb-1" />
                <span className="text-xs">التقارير</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TransactionTable orders={orders.slice(0, 8)} />
      </motion.div>
    </div>
  );
};

// Transaction Table Component (keeping the existing logic but with enhanced styling)
const TransactionTable = ({ orders = [] }) => {
  const columns = [
    { 
      key: 'id', 
      header: 'رقم الطلب', 
      render: (value) => (
        <span className="font-mono text-blue-600 font-medium">#{value}</span>
      )
    },
    { 
      key: 'items', 
      header: 'المنتجات', 
      render: (items) => (
        <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm font-medium">
          {items?.length || 0} منتج
        </span>
      )
    },
    { 
      key: 'format', 
      header: 'النوع', 
      render: () => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
          كتاب ورقي
        </span>
      )
    },
    { 
      key: 'date', 
      header: 'التاريخ',
      render: (date) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{date}</div>
          <div className="text-gray-500 text-xs">منذ ساعتين</div>
        </div>
      )
    },
    { 
      key: 'total', 
      header: 'المبلغ', 
      render: (value) => (
        <div className="text-right">
          <FormattedPrice value={value} className="font-bold text-gray-900" />
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'الحالة', 
      render: (status) => {
        const statusConfig = {
          'مكتمل': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
          'قيد المراجعة': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
          'ملغي': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
          'قيد التنفيذ': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Activity }
        };

        const config = statusConfig[status] || statusConfig['قيد المراجعة'];
        const IconComponent = config.icon;

        return (
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
            <IconComponent className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
            {status}
          </span>
        );
      }
    }
  ];

  return (
    <DataTable
      title="المعاملات الأخيرة"
      data={orders}
      columns={columns}
      searchable={true}
      filterable={true}
      exportable={true}
    />
  );
};

// Main Dashboard Component remains the same but with enhanced animations
const Dashboard = ({ dashboardStats, books, authors, sellers, branches, customers, categories, orders, payments, paymentMethods, currencies, languages, plans, subscriptions, users, messages, dashboardSection, setDashboardSection, handleFeatureClick, setBooks, setAuthors, setSellers, setBranches, setCustomers, setCategories, setOrders, setPayments, setPaymentMethods, setCurrencies, setLanguages, setPlans, setSubscriptions, setUsers, setMessages, siteSettings, setSiteSettings, sliders, setSliders, banners, setBanners, features, setFeatures }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sectionTitles = {
    overview: '🏠 نظرة عامة',
    books: '📚 إدارة الكتب',
    audiobooks: '🎧 الكتب الصوتية',
    inventory: '📦 إدارة المخزون',
    authors: '✍️ المؤلفون',
    sellers: '🏪 البائعون',
    branches: '📍 الفروع',
    orders: '🛒 الطلبات',
    customers: '👥 العملاء',
    users: '👤 المستخدمون',
    payments: '💳 المدفوعات',
    'payment-methods': '💰 طرق الدفع',
    currencies: '💱 العملات',
    languages: '🌐 اللغات',
    'google-merchant': '🛍️ Google Merchant',
    plans: '📋 خطط الاشتراك',
    subscriptions: '👑 العضويات',
    messages: '💬 الرسائل',
    features: '⚡ المميزات',
    sliders: '🖼️ السلايدر',
    banners: '🎨 البانرات',
    settings: '⚙️ الإعدادات',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
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

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">{sectionTitles[dashboardSection]}</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {dashboardSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardOverview dashboardStats={dashboardStats} orders={orders} />
              </motion.div>
            )}

            {dashboardSection === 'books' && (
              <motion.div
                key="books"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardBooks 
                  books={books} 
                  setBooks={setBooks} 
                  authors={authors} 
                  categories={categories} 
                  currencies={currencies} 
                />
              </motion.div>
            )}

            {!['overview', 'books', 'messages', 'order-details'].includes(dashboardSection) && (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Settings className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {sectionTitles[dashboardSection]}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  هذا القسم قيد التطوير حالياً. سيتم إضافة المزيد من الميزات قريباً لتحسين تجربتك.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => handleFeatureClick('section-development')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    طلب تطوير هذا القسم
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setDashboardSection('overview')}
                  >
                    <Home className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    العودة للنظرة العامة
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Simplified Book Form and other components for space...
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
    >
      <div className="flex items-center justify-between mb-8">
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
      <div className="space-y-4">
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
          <h2 className="text-2xl font-bold text-gray-900">
            {book ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
          </h2>
          <p className="text-gray-500 mt-1">املأ البيانات المطلوبة بعناية</p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
            <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">اسم الكتاب *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Kingdom of Ash and Blood"
            className="mt-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="author" className="text-sm font-semibold text-gray-700">اسم المؤلف *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="اسم المؤلف"
            className="mt-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700">وصف الكتاب</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={6}
            placeholder="اكتب وصفاً مفصلاً عن الكتاب..."
            className="mt-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        </form>
      </div>
    </motion.div>
  );
};

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
    { key: 'id', header: 'الرقم' },
    { 
      key: 'coverImage', 
      header: 'الغلاف',
      render: (coverImage, book) => (
        <div className="w-12 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden shadow-sm">
          <img 
            src={coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
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
      )
    },
    { 
      key: 'title', 
      header: 'اسم الكتاب',
      render: (title) => (
        <div className="font-semibold text-gray-900">{title}</div>
      )
    },
    { 
      key: 'category', 
      header: 'الفئة',
      render: (category) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
          {category}
        </span>
      )
    },
    { 
      key: 'author', 
      header: 'المؤلف',
      render: (author) => (
        <div className="text-gray-700 font-medium">{author}</div>
      )
    },
    { 
      key: 'description', 
      header: 'الوصف', 
      render: (desc) => (
        <div className="text-gray-600 text-sm">
          {desc?.substring(0, 50)}...
        </div>
      )
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


const DashboardSettings = ({ siteSettings, setSiteSettings, currencies = [] }) => {
  const [formData, setFormData] = useState(siteSettings);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الكتب</h1>
          <p className="text-gray-500 mt-1">إدارة مكتبتك الرقمية بسهولة</p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button variant="default" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl">
            📖 كتاب ورقي
          </Button>
          <Button variant="outline" className="rounded-xl">
            💻 كتاب إلكتروني
          </Button>
        </div>
      </motion.div>


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


const Dashboard = ({ dashboardStats, books, authors, sellers, branches, customers, categories, orders, payments, paymentMethods, currencies, languages, plans, subscriptions, users, messages, dashboardSection, setDashboardSection, handleFeatureClick, setBooks, setAuthors, setSellers, setBranches, setCustomers, setCategories, setOrders, setPayments, setPaymentMethods, setCurrencies, setLanguages, setPlans, setSubscriptions, setUsers, setMessages, siteSettings, setSiteSettings, sliders, setSliders, banners, setBanners, features, setFeatures }) => {
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
    ratings: 'تقييمات الكتب',
    messages: 'الرسائل',
    features: 'المميزات',
    sliders: 'السلايدر',
    banners: 'البانرات',
    settings: 'الإعدادات',
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
          logger.error('Failed to load ratings', err);
        }
      })();
    }
  }, [dashboardSection]);

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
        {dashboardSection === 'languages' && <DashboardLanguages languages={languages} setLanguages={setLanguages} />}
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
        {dashboardSection === 'ratings' && (
          <DashboardRatings ratings={ratings} setRatings={setRatings} books={books} />
        )}
        {dashboardSection === 'messages' && (
          <DashboardMessages messages={messages} />
        )}
        {dashboardSection === 'features' && <DashboardFeatures features={features} setFeatures={setFeatures} />}
        {dashboardSection === 'sliders' && <DashboardSliders sliders={sliders} setSliders={setSliders} />}
        {dashboardSection === 'banners' && <DashboardBanners banners={banners} setBanners={setBanners} />}
        {dashboardSection === 'settings' && (
          <DashboardSettings
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            currencies={currencies}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;