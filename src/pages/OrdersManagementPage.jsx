import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  Package,
  Truck,
  CreditCard,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Weight,
  BookOpen,
  Headphones,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import api from '@/lib/api.js';
import unifiedPaymentApi from '@/lib/api/unifiedPaymentApi.js';
import InvoiceGenerator from '@/components/InvoiceGenerator.jsx';

const OrdersManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    productType: 'all',
    dateRange: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    failedPayments: 0,
    successRate: 0,
    physicalBooks: 0,
    ebooks: 0,
    audiobooks: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  useEffect(() => {
    initializeSystem();
  }, []);

  const initializeSystem = async () => {
    try {
      setLoading(true);
      
      // تهيئة نظام المدفوعات
      await unifiedPaymentApi.initialize();
      
      // تحميل البيانات
      await Promise.all([
        loadOrders(),
        loadPayments(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Failed to initialize system:', error);
      toast({
        title: 'فشل في تهيئة النظام',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      // جلب الطلبات الحقيقية من API
      const result = await api.orders.getAll();
      if (result.success && result.data && result.data.length > 0) {
        setOrders(result.data);
        return;
      }
      
      // في حالة فشل API أو عدم وجود بيانات، استخدام البيانات التجريبية كـ fallback
      console.log('Using mock data as fallback');
      const mockOrders = [
        {
          id: 'ORD-001',
          orderNumber: '#1001',
          customerId: 'CUST-001',
          customerName: 'أحمد محمد',
          customerEmail: 'ahmed@example.com',
          customerPhone: '+966501234567',
          customerAddress: {
            street: 'شارع الملك فهد',
            city: 'الرياض',
            postalCode: '12345',
            country: 'SA'
          },
          items: [
            {
              id: 'PROD-001',
              name: 'كتاب الفيزياء الحديثة',
              type: 'physical', // physical, ebook, audiobook
              price: 150,
              quantity: 1,
              weight: 0.8, // للكتب الورقية
              dimensions: { length: 20, width: 15, height: 3 }, // سم
              isbn: '978-1234567890',
              publisher: 'دار النشر العلمية',
              publicationYear: 2023,
              pages: 350,
              coverType: 'غلاف مقوى',
              translators: ['محمد أحمد'],
              originalLanguage: 'الإنجليزية',
              translatedLanguage: 'العربية'
            },
            {
              id: 'PROD-002',
              name: 'كتاب الرياضيات الإلكتروني',
              type: 'ebook',
              price: 80,
              quantity: 1,
              fileFormat: 'PDF',
              fileSize: '15MB',
              wordCount: 50000,
              isDelivered: false,
              deliveredAt: null,
              downloadUrl: null
            }
          ],
          subtotal: 230,
          shippingCost: 25,
          tax: 34.5,
          total: 289.5,
          currency: 'SAR',
          status: 'ordered', // ordered, paid, shipped, delivered, reviewed
          currentStage: 'ordered',
          paymentStatus: 'pending', // pending, paid, failed, refunded
          paymentMethod: 'stripe',
          paymentIntentId: 'pi_1234567890',
          shippingMethod: 'saudiPost',
          trackingNumber: 'SP123456789',
          estimatedDelivery: '2024-01-15',
          createdAt: '2024-01-10T10:30:00Z',
          updatedAt: '2024-01-10T10:30:00Z',
          orderedAt: '2024-01-10T10:30:00Z',
          paidAt: null,
          shippedAt: null,
          deliveredAt: null,
          reviewedAt: null,
          notes: 'طلب عاجل'
        },
        {
          id: 'ORD-002',
          orderNumber: '#1002',
          customerId: 'CUST-002',
          customerName: 'فاطمة علي',
          customerEmail: 'fatima@example.com',
          customerPhone: '+966502345678',
          customerAddress: {
            street: 'شارع التحلية',
            city: 'جدة',
            postalCode: '23456',
            country: 'SA'
          },
          items: [
            {
              id: 'PROD-003',
              name: 'كتاب التاريخ الصوتي',
              type: 'audiobook',
              price: 120,
              quantity: 1,
              duration: '8:30:00', // ساعات:دقائق:ثواني
              narrator: 'أحمد حسن',
              audioQuality: 'HD',
              isDelivered: true,
              deliveredAt: '2024-01-08T14:25:00Z',
              downloadUrl: '/download/PROD-003?order=ORD-002'
            }
          ],
          subtotal: 120,
          shippingCost: 0, // الكتب الصوتية لا تحتاج شحن
          tax: 18,
          total: 138,
          currency: 'SAR',
          status: 'delivered',
          currentStage: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'paypal',
          paymentIntentId: 'pi_0987654321',
          shippingMethod: null,
          trackingNumber: null,
          estimatedDelivery: null,
          createdAt: '2024-01-08T14:20:00Z',
          updatedAt: '2024-01-09T16:45:00Z',
          orderedAt: '2024-01-08T14:20:00Z',
          paidAt: '2024-01-08T14:25:00Z',
          shippedAt: null,
          deliveredAt: '2024-01-09T16:45:00Z',
          reviewedAt: null,
          notes: ''
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast({
        title: 'فشل في تحميل الطلبات',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const loadPayments = async () => {
    try {
      const result = await unifiedPaymentApi.getPaymentStats();
      if (result.success && result.stats) {
        setPayments([{
          id: 'PAY-001',
          orderId: 'ORD-001',
          amount: 289.5,
          currency: 'SAR',
          method: 'stripe',
          status: 'pending',
          createdAt: '2024-01-10T10:30:00Z'
        }]);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const loadStats = async () => {
    try {
      const result = await unifiedPaymentApi.getPaymentStats();
      if (result.success && result.stats) {
        const physicalBooks = orders.filter(order => 
          order.items.some(item => item.type === 'physical')
        ).length;
        
        const ebooks = orders.filter(order => 
          order.items.some(item => item.type === 'ebook')
        ).length;
        
        const audiobooks = orders.filter(order => 
          order.items.some(item => item.type === 'audiobook')
        ).length;

        setStats({
          ...result.stats,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
          pendingOrders: orders.filter(order => order.status === 'ordered').length,
          completedOrders: orders.filter(order => order.status === 'reviewed').length,
          physicalBooks,
          ebooks,
          audiobooks
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setProcessing(true);
      
      // محاكاة تحديث حالة الطلب
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      
      toast({
        title: 'تم تحديث حالة الطلب بنجاح',
        variant: 'success'
      });
      
      loadStats(); // إعادة تحميل الإحصائيات
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: 'فشل في تحديث حالة الطلب',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const updateOrderStage = async (orderId, newStage) => {
    try {
      setProcessing(true);
      
      // تحديث مرحلة الطلب عبر API
      const result = await api.orders.updateStage(orderId, newStage);
      
      if (result.success) {
        // تحديث الطلبات المحلية
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: newStage, 
                currentStage: newStage,
                updatedAt: new Date().toISOString(),
                // تحديث التواريخ حسب المرحلة
                ...(newStage === 'paid' && { paidAt: new Date().toISOString() }),
                ...(newStage === 'shipped' && { shippedAt: new Date().toISOString() }),
                ...(newStage === 'delivered' && { deliveredAt: new Date().toISOString() }),
                ...(newStage === 'reviewed' && { reviewedAt: new Date().toISOString() })
              }
            : order
        ));
        
        const stageInfo = getStageInfo(newStage);
        toast({
          title: 'تم تحديث مرحلة الطلب بنجاح',
          description: `تم الانتقال إلى مرحلة: ${stageInfo.name}`,
          variant: 'success'
        });
        
        // إذا كانت المرحلة الجديدة هي 'paid' وكان هناك منتجات رقمية، قم بتسليمها
        if (newStage === 'paid') {
          const order = orders.find(o => o.id === orderId);
          if (order && order.items.some(item => item.type === 'ebook' || item.type === 'audiobook')) {
            await deliverDigitalProducts(orderId, order);
          }
        }
        
        loadStats(); // إعادة تحميل الإحصائيات
      } else {
        throw new Error(result.message || 'فشل في تحديث مرحلة الطلب');
      }
    } catch (error) {
      console.error('Failed to update order stage:', error);
      toast({
        title: 'فشل في تحديث مرحلة الطلب',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const deliverDigitalProducts = async (orderId, order) => {
    try {
      // تسليم المنتجات الرقمية
      const digitalItems = order.items.filter(item => 
        item.type === 'ebook' || item.type === 'audiobook'
      );
      
      for (const item of digitalItems) {
        // إنشاء رابط تحميل للمنتج
        const downloadUrl = await generateDownloadUrl(item.id, orderId);
        
        // تحديث حالة التسليم للمنتج
        await api.orders.updateOrderItem(item.id, {
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
          downloadUrl: downloadUrl
        });
      }
      
      // تحديث الطلبات المحلية
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? {
              ...o,
              items: o.items.map(item => 
                (item.type === 'ebook' || item.type === 'audiobook')
                  ? {
                      ...item,
                      isDelivered: true,
                      deliveredAt: new Date().toISOString(),
                      downloadUrl: `/download/${item.id}?order=${orderId}`
                    }
                  : item
              )
            }
          : o
      ));
      
      toast({
        title: 'تم تسليم المنتجات الرقمية',
        description: `تم إنشاء روابط التحميل لـ ${digitalItems.length} منتج رقمي`,
        variant: 'success'
      });
    } catch (error) {
      console.error('Failed to deliver digital products:', error);
      toast({
        title: 'فشل في تسليم المنتجات الرقمية',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const generateDownloadUrl = async (productId, orderId) => {
    try {
      // إنشاء رابط تحميل آمن
      const result = await api.products.generateDownloadUrl(productId, orderId);
      return result.downloadUrl || `/download/${productId}?order=${orderId}`;
    } catch (error) {
      console.error('Failed to generate download URL:', error);
      return `/download/${productId}?order=${orderId}`;
    }
  };

  const loadOrderDetails = async (orderId) => {
    try {
      setLoadingOrderDetails(true);
      
      // جلب تفاصيل الطلب الحقيقية من API
      const result = await api.orders.getById(orderId);
      if (result && result.order) {
        // استخدام البيانات الحقيقية من API فقط
        const fullOrderData = {
          ...result.order,
          items: result.items || [],
          // استخدام بيانات الدفع الحقيقية إذا كانت متوفرة
          paymentMethod: result.payment?.paymentMethod || result.order.paymentMethod,
          paymentStatus: result.payment?.paymentStatus || result.order.paymentStatus,
          paymentIntentId: result.payment?.paymentIntentId || result.order.paymentIntentId,
          // استخدام بيانات الشحن الحقيقية إذا كانت متوفرة
          shippingMethod: result.shipping?.shippingMethod || result.order.shippingMethod,
          trackingNumber: result.shipping?.trackingNumber || result.order.trackingNumber,
          estimatedDelivery: result.shipping?.estimatedDelivery || result.order.estimatedDelivery,
          shippingCost: result.shipping?.shippingCost || result.order.shippingCost
        };
        
        setSelectedOrder(fullOrderData);
        setShowOrderDetails(true);
        return;
      }
      
      // في حالة فشل API، استخدام البيانات المحلية
      const localOrder = orders.find(order => order.id === orderId);
      if (localOrder) {
        setSelectedOrder(localOrder);
        setShowOrderDetails(true);
      } else {
        throw new Error('الطلب غير موجود');
      }
      
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast({
        title: 'فشل في تحميل تفاصيل الطلب',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const refundPayment = async (orderId) => {
    try {
      setProcessing(true);
      
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('الطلب غير موجود');
      
      // استرداد المبلغ عبر API
      const result = await api.orders.refundPayment(orderId, {
        amount: order.total,
        reason: 'طلب العميل'
      });
      
      if (result.success) {
        // تحديث حالة الطلب
        setOrders(prev => prev.map(o => 
          o.id === orderId 
            ? { 
                ...o, 
                paymentStatus: 'refunded', 
                status: 'cancelled',
                currentStage: 'cancelled',
                updatedAt: new Date().toISOString()
              }
            : o
        ));
        
        toast({
          title: 'تم استرداد المبلغ بنجاح',
          description: `تم استرداد مبلغ ${order.total} ${order.currency}`,
          variant: 'success'
        });
      
      loadStats();
      } else {
        throw new Error(result.message || 'فشل في استرداد المبلغ');
      }
    } catch (error) {
      console.error('Failed to refund payment:', error);
      toast({
        title: 'فشل في استرداد المبلغ',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const calculateShippingCost = (items, shippingMethod) => {
    let totalWeight = 0;
    let hasPhysicalItems = false;
    
    items.forEach(item => {
      if (item.type === 'physical') {
        totalWeight += (item.weight || 0) * item.quantity;
        hasPhysicalItems = true;
      }
    });
    
    if (!hasPhysicalItems) return 0;
    
    // حساب تكلفة الشحن بناءً على الوزن والطريقة
    const baseCost = 15; // تكلفة أساسية
    const costPerKg = 5; // تكلفة لكل كيلو
    
    return baseCost + (totalWeight * costPerKg);
  };

  const getProductTypeIcon = (type) => {
    switch (type) {
      case 'physical': return <BookOpen className="w-4 h-4" />;
      case 'ebook': return <FileText className="w-4 h-4" />;
      case 'audiobook': return <Headphones className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getProductTypeName = (type) => {
    switch (type) {
      case 'physical': return 'كتاب ورقي';
      case 'ebook': return 'كتاب إلكتروني';
      case 'audiobook': return 'كتاب صوتي';
      default: return 'منتج';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageInfo = (stage) => {
    const stages = {
      'ordered': { name: 'تم الطلب', icon: '📝', color: 'blue' },
      'paid': { name: 'تم الدفع', icon: '💳', color: 'green' },
      'shipped': { name: 'تم الشحن', icon: '🚚', color: 'orange' },
      'delivered': { name: 'تم الاستلام', icon: '✅', color: 'green' },
      'reviewed': { name: 'تم التقييم', icon: '⭐', color: 'purple' }
    };
    return stages[stage] || stages['ordered'];
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (filters.paymentMethod !== 'all' && order.paymentMethod !== filters.paymentMethod) return false;
    if (filters.productType !== 'all' && !order.items.some(item => item.type === filters.productType)) return false;
    if (filters.search && !order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) && 
        !order.customerName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات والمدفوعات</h1>
          <p className="text-gray-600">إدارة طلبات العملاء والمدفوعات والشحنات</p>
        </div>
        <Button onClick={initializeSystem} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalRevenue.toFixed(2)} ريال</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">الطلبات المعلقة</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">معدل النجاح</p>
              <p className="text-2xl font-bold text-purple-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">الكتب الورقية</p>
              <p className="text-2xl font-bold text-blue-900">{stats.physicalBooks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">الكتب الإلكترونية</p>
              <p className="text-2xl font-bold text-green-900">{stats.ebooks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Headphones className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">الكتب الصوتية</p>
              <p className="text-2xl font-bold text-purple-900">{stats.audiobooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="search">البحث</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rtl:right-3 rtl:left-auto" />
              <Input
                id="search"
                placeholder="البحث في الطلبات..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 rtl:pr-10 rtl:pl-3"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">حالة الطلب</Label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">جميع المراحل</option>
              <option value="ordered">تم الطلب</option>
              <option value="paid">تم الدفع</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم الاستلام</option>
              <option value="reviewed">تم التقييم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">طريقة الدفع</Label>
            <select
              id="paymentMethod"
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">جميع الطرق</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="tabby">Tabby</option>
              <option value="cashOnDelivery">الدفع عند الاستلام</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="productType">نوع المنتج</Label>
            <select
              id="productType"
              value={filters.productType}
              onChange={(e) => setFilters(prev => ({ ...prev, productType: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">جميع الأنواع</option>
              <option value="physical">كتب ورقية</option>
              <option value="ebook">كتب إلكترونية</option>
              <option value="audiobook">كتب صوتية</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              فلترة متقدمة
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدفوعات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشحن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.total} {order.currency}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      <div className="text-xs text-gray-400">{order.customerEmail}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          {getProductTypeIcon(item.type)}
                          <span className="text-sm text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-500">({getProductTypeName(item.type)})</span>
                          {item.type === 'physical' && item.weight && (
                            <span className="text-xs text-gray-400">
                              <Weight className="w-3 h-3 inline mr-1" />
                              {item.weight} كجم
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus === 'pending' && 'معلق'}
                        {order.paymentStatus === 'paid' && 'مدفوع'}
                        {order.paymentStatus === 'failed' && 'فاشل'}
                        {order.paymentStatus === 'refunded' && 'مسترد'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.paymentMethod}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {order.shippingMethod ? (
                        <>
                          <div className="text-sm text-gray-900">{order.shippingMethod}</div>
                          {order.trackingNumber && (
                            <div className="text-xs text-gray-500">
                              رقم التتبع: {order.trackingNumber}
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="text-xs text-gray-400">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(order.estimatedDelivery).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-gray-400">لا يحتاج شحن</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      <span className="mr-1">{getStageInfo(order.status).icon}</span>
                      {getStageInfo(order.status).name}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadOrderDetails(order.id)}
                        disabled={loadingOrderDetails}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {order.status === 'ordered' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStage(order.id, 'paid')}
                          disabled={processing}
                          title="تأكيد الدفع"
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {order.status === 'paid' && order.items.some(item => item.type === 'physical') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStage(order.id, 'shipped')}
                          disabled={processing}
                          title="تأكيد الشحن"
                        >
                          <Truck className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStage(order.id, 'delivered')}
                          disabled={processing}
                          title="تأكيد التسليم"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {order.status === 'delivered' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStage(order.id, 'reviewed')}
                          disabled={processing}
                          title="تأكيد التقييم"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {order.paymentStatus === 'paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => refundPayment(order.id)}
                          disabled={processing}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          title="استرداد المبلغ"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowInvoice(true);
                        }}
                        title="طباعة الفاتورة"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                تفاصيل الطلب {selectedOrder.orderNumber}
                {loadingOrderDetails && (
                  <span className="ml-2 text-sm text-gray-500">(جاري التحميل...)</span>
                )}
              </h3>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowOrderDetails(false);
                    setShowInvoice(true);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  طباعة الفاتورة
                </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrderDetails(false)}
              >
                ✕
              </Button>
              </div>
            </div>
            
            {/* Order Status Progress */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">مراحل الطلب</h4>
              <div className="flex items-center justify-between relative">
                {['ordered', 'paid', 'shipped', 'delivered', 'reviewed'].map((stage, index) => {
                  const stageInfo = getStageInfo(stage);
                  const isActive = selectedOrder.currentStage === stage;
                  const isCompleted = ['ordered', 'paid', 'shipped', 'delivered', 'reviewed'].indexOf(selectedOrder.currentStage) >= index;
                  const isRelevant = stage === 'shipped' ? selectedOrder.items.some(item => item.type === 'physical') : true;
                  
                  if (!isRelevant) return null;
                  
                  return (
                    <div key={stage} className="flex flex-col items-center relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 ${
                        isCompleted 
                          ? 'bg-green-100 border-green-500 text-green-600' 
                          : isActive 
                            ? 'bg-blue-100 border-blue-500 text-blue-600' 
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        {stageInfo.icon}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${
                          isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {stageInfo.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stage === 'ordered' && selectedOrder.createdAt && new Date(selectedOrder.createdAt).toLocaleDateString('ar-SA')}
                          {stage === 'paid' && selectedOrder.paidAt && new Date(selectedOrder.paidAt).toLocaleDateString('ar-SA')}
                          {stage === 'shipped' && selectedOrder.shippedAt && new Date(selectedOrder.shippedAt).toLocaleDateString('ar-SA')}
                          {stage === 'delivered' && selectedOrder.deliveredAt && new Date(selectedOrder.deliveredAt).toLocaleDateString('ar-SA')}
                          {stage === 'reviewed' && selectedOrder.reviewedAt && new Date(selectedOrder.reviewedAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      {index < 4 && (
                        <div className={`absolute top-6 left-12 w-full h-0.5 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} style={{ width: 'calc(100% - 3rem)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  معلومات العميل
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-start">
                    <Home className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                    <div className="text-sm">
                      <div>{selectedOrder.customerAddress.street}</div>
                      <div>{selectedOrder.customerAddress.city}</div>
                      <div>{selectedOrder.customerAddress.postalCode}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  معلومات الدفع
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">طريقة الدفع:</span>
                    <span className="text-sm font-medium">{selectedOrder.paymentMethod || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">حالة الدفع:</span>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus === 'pending' && 'معلق'}
                      {selectedOrder.paymentStatus === 'paid' && 'مدفوع'}
                      {selectedOrder.paymentStatus === 'failed' && 'فاشل'}
                      {selectedOrder.paymentStatus === 'refunded' && 'مسترد'}
                      {!selectedOrder.paymentStatus && 'غير محدد'}
                    </div>
                  </div>
                  {selectedOrder.paymentIntentId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">معرف الدفع:</span>
                      <span className="text-sm font-medium font-mono">{selectedOrder.paymentIntentId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المبلغ:</span>
                    <span className="text-sm font-medium">{selectedOrder.total} {selectedOrder.currency}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  معلومات الشحن
                </h4>
                <div className="space-y-3">
                  {selectedOrder.shippingMethod ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">طريقة الشحن:</span>
                        <span className="text-sm font-medium">{selectedOrder.shippingMethod}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">رقم التتبع:</span>
                          <span className="text-sm font-medium">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">التسليم المتوقع:</span>
                          <span className="text-sm font-medium">
                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">تكلفة الشحن:</span>
                        <span className="text-sm font-medium">{selectedOrder.shippingCost} {selectedOrder.currency}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">لا يحتاج شحن (منتج رقمي)</div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                ملخص الطلب
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المجموع الفرعي:</span>
                    <span className="text-sm font-medium">{selectedOrder.subtotal} {selectedOrder.currency}</span>
                  </div>
                  {selectedOrder.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">تكلفة الشحن:</span>
                    <span className="text-sm font-medium">{selectedOrder.shippingCost} {selectedOrder.currency}</span>
                  </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">الضريبة (15%):</span>
                    <span className="text-sm font-medium">{selectedOrder.tax} {selectedOrder.currency}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">الإجمالي:</span>
                    <span className="text-sm font-bold">{selectedOrder.total} {selectedOrder.currency}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                المنتجات
              </h4>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
                        <div className="flex-shrink-0">
                        {getProductTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <div className="text-right">
                              <div className="text-sm font-medium">{item.price * item.quantity} {selectedOrder.currency}</div>
                              <div className="text-xs text-gray-500">{item.price} {selectedOrder.currency} × {item.quantity}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === 'physical' ? 'bg-blue-100 text-blue-800' :
                              item.type === 'ebook' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {getProductTypeName(item.type)}
                            </span>
                            
                            {/* Digital Product Status */}
                            {(item.type === 'ebook' || item.type === 'audiobook') && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.isDelivered ? 'تم التسليم' : 'في الانتظار'}
                              </span>
                            )}
                          </div>
                          
                          {/* Physical Book Details */}
                          {item.type === 'physical' && (
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Weight className="w-3 h-3 mr-1" />
                                الوزن: {item.weight} كجم
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                الأبعاد: {item.dimensions?.length}×{item.dimensions?.width}×{item.dimensions?.height} سم
                              </div>
                              <div>ISBN: {item.isbn}</div>
                              <div>الناشر: {item.publisher}</div>
                              <div>سنة النشر: {item.publicationYear}</div>
                              <div>الصفحات: {item.pages}</div>
                              <div>نوع الغلاف: {item.coverType}</div>
                              {item.translators && (
                                <div className="col-span-2">المترجمون: {item.translators.join(', ')}</div>
                              )}
                            </div>
                          )}
                          
                          {/* Ebook Details */}
                          {item.type === 'ebook' && (
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div>الصيغة: {item.fileFormat}</div>
                              <div>حجم الملف: {item.fileSize}</div>
                              <div className="col-span-2">عدد الكلمات: {item.wordCount?.toLocaleString()}</div>
                              {item.downloadUrl && (
                                <div className="col-span-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(item.downloadUrl, '_blank')}
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    تحميل الكتاب
                                  </Button>
                              </div>
                              )}
                            </div>
                          )}
                          
                          {/* Audiobook Details */}
                          {item.type === 'audiobook' && (
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div>المدة: {item.duration}</div>
                              <div>القارئ: {item.narrator}</div>
                              <div>جودة الصوت: {item.audioQuality}</div>
                              {item.downloadUrl && (
                                <div className="col-span-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(item.downloadUrl, '_blank')}
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    تحميل الكتاب الصوتي
                                  </Button>
                              </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {/* Stage Action Buttons */}
                {selectedOrder.status === 'ordered' && (
                  <Button
                    onClick={() => updateOrderStage(selectedOrder.id, 'paid')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    تأكيد الدفع
              </Button>
                )}
                
                {selectedOrder.status === 'paid' && selectedOrder.items.some(item => item.type === 'physical') && (
              <Button
                    onClick={() => updateOrderStage(selectedOrder.id, 'shipped')}
                    disabled={processing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    تأكيد الشحن
              </Button>
                )}
                
                {selectedOrder.status === 'shipped' && (
                  <Button
                    onClick={() => updateOrderStage(selectedOrder.id, 'delivered')}
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    تأكيد التسليم
                  </Button>
                )}
                
                {selectedOrder.status === 'delivered' && (
                  <Button
                    onClick={() => updateOrderStage(selectedOrder.id, 'reviewed')}
                    disabled={processing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    تأكيد التقييم
              </Button>
                )}
                
              {selectedOrder.paymentStatus === 'paid' && (
                <Button 
                  variant="outline" 
                  onClick={() => refundPayment(selectedOrder.id)}
                    disabled={processing}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                    <XCircle className="w-4 h-4 mr-2" />
                  استرداد المبلغ
                </Button>
              )}
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  إغلاق
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowOrderDetails(false);
                    setShowInvoice(true);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  طباعة الفاتورة
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">فاتورة الطلب {selectedOrder.orderNumber}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInvoice(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <InvoiceGenerator 
                order={selectedOrder}
                onPrint={() => window.print()}
                onDownload={() => {
                  toast({
                    title: 'جاري تحضير الفاتورة',
                    description: 'سيتم تحميل ملف PDF قريباً',
                    variant: 'success'
                  });
                }}
                onShare={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: 'تم نسخ الرابط',
                    description: 'تم نسخ رابط الطلب إلى الحافظة',
                    variant: 'success'
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementPage;
