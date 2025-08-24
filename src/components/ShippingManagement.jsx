import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';

const ShippingManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // بيانات تجريبية للطلبات
  const mockOrders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customerName: 'أحمد محمد',
      customerPhone: '+966501234567',
      shippingAddress: 'شارع الملك فهد، الرياض',
      shippingCountry: 'SA',
      shippingMethod: 'express',
      shippingCost: 30,
      orderTotal: 250,
      status: 'قيد المعالجة',
      createdAt: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-17',
      trackingNumber: null,
      shippingCompany: 'أرامكس'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customerName: 'فاطمة علي',
      customerPhone: '+966507654321',
      shippingAddress: 'شارع التحلية، جدة',
      shippingCountry: 'SA',
      shippingMethod: 'standard',
      shippingCost: 15,
      orderTotal: 180,
      status: 'قيد الشحن',
      createdAt: '2024-01-14T14:20:00Z',
      estimatedDelivery: '2024-01-18',
      trackingNumber: 'ARX123456789',
      shippingCompany: 'DHL'
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      customerName: 'محمد عبدالله',
      customerPhone: '+966509876543',
      shippingAddress: 'شارع العليا، الدمام',
      shippingCountry: 'SA',
      shippingMethod: 'pickup',
      shippingCost: 0,
      orderTotal: 120,
      status: 'تم التسليم',
      createdAt: '2024-01-13T09:15:00Z',
      estimatedDelivery: '2024-01-13',
      trackingNumber: null,
      shippingCompany: 'استلام من المتجر'
    }
  ];

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const filterOrders = () => {
    let filtered = orders;

    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلترة حسب الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المعالجة':
        return 'bg-yellow-100 text-yellow-800';
      case 'قيد الشحن':
        return 'bg-blue-100 text-blue-800';
      case 'تم الشحن':
        return 'bg-green-100 text-green-800';
      case 'تم التسليم':
        return 'bg-green-200 text-green-900';
      case 'معلق':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case 'standard':
        return 'الشحن العادي';
      case 'express':
        return 'الشحن السريع';
      case 'pickup':
        return 'استلام من المتجر';
      default:
        return method;
    }
  };

  const getCountryName = (countryCode) => {
    const countries = {
      'SA': 'المملكة العربية السعودية',
      'AE': 'الإمارات العربية المتحدة',
      'KW': 'الكويت',
      'QA': 'قطر',
      'BH': 'البحرين',
      'OM': 'عمان'
    };
    return countries[countryCode] || countryCode;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({ title: 'تم تحديث حالة الطلب بنجاح!' });
  };

  const addTrackingNumber = (orderId, trackingNumber) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, trackingNumber } : order
    ));
    toast({ title: 'تم إضافة رقم التتبع بنجاح!' });
  };

  const exportOrders = () => {
    // تصدير الطلبات إلى CSV
    const csvContent = [
      ['رقم الطلب', 'اسم العميل', 'الهاتف', 'العنوان', 'الدولة', 'طريقة الشحن', 'تكلفة الشحن', 'إجمالي الطلب', 'الحالة', 'تاريخ الإنشاء'],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerName,
        order.customerPhone,
        order.shippingAddress,
        getCountryName(order.shippingCountry),
        getMethodName(order.shippingMethod),
        order.shippingCost,
        order.orderTotal,
        order.status,
        new Date(order.createdAt).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shipping-orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الشحن</h1>
          <p className="text-gray-600">إدارة وتتبع جميع الطلبات والشحنات</p>
        </div>
        <Button onClick={exportOrders} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          تصدير البيانات
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">البحث</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rtl:right-3 rtl:left-auto" />
              <Input
                id="search"
                placeholder="البحث في الطلبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rtl:pr-10 rtl:pl-3"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">حالة الطلب</Label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">جميع الحالات</option>
              <option value="قيد المعالجة">قيد المعالجة</option>
              <option value="قيد الشحن">قيد الشحن</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التسليم">تم التسليم</option>
              <option value="معلق">معلق</option>
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
                  العنوان
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
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 rtl:ml-2 rtl:mr-0" />
                      <div>
                        <div className="text-sm text-gray-900">{order.shippingAddress}</div>
                        <div className="text-sm text-gray-500">{getCountryName(order.shippingCountry)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getMethodName(order.shippingMethod)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingCost === 0 ? 'مجاني' : `${order.shippingCost} ريال`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.shippingCompany}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        رقم التتبع: {order.trackingNumber}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Edit className="w-4 h-4" />
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">تفاصيل الطلب {selectedOrder.orderNumber}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">معلومات العميل</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium">{selectedOrder.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">معلومات الشحن</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">العنوان:</span>
                    <span className="font-medium">{selectedOrder.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الدولة:</span>
                    <span className="font-medium">{getCountryName(selectedOrder.shippingCountry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">طريقة الشحن:</span>
                    <span className="font-medium">{getMethodName(selectedOrder.shippingMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تكلفة الشحن:</span>
                    <span className="font-medium">
                      {selectedOrder.shippingCost === 0 ? 'مجاني' : `${selectedOrder.shippingCost} ريال`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">شركة الشحن:</span>
                    <span className="font-medium">{selectedOrder.shippingCompany}</span>
                  </div>
                </div>
              </div>

              {/* Order Status Management */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">إدارة حالة الطلب</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'قيد المعالجة')}
                      className={selectedOrder.status === 'قيد المعالجة' ? 'bg-yellow-600' : 'bg-gray-600'}
                    >
                      قيد المعالجة
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'قيد الشحن')}
                      className={selectedOrder.status === 'قيد الشحن' ? 'bg-blue-600' : 'bg-gray-600'}
                    >
                      قيد الشحن
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'تم الشحن')}
                      className={selectedOrder.status === 'تم الشحن' ? 'bg-green-600' : 'bg-gray-600'}
                    >
                      تم الشحن
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'تم التسليم')}
                      className={selectedOrder.status === 'تم التسليم' ? 'bg-green-700' : 'bg-gray-600'}
                    >
                      تم التسليم
                    </Button>
                  </div>

                  {/* Tracking Number Input */}
                  {selectedOrder.status === 'قيد الشحن' && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Input
                        placeholder="أدخل رقم التتبع"
                        value={selectedOrder.trackingNumber || ''}
                        onChange={(e) => addTrackingNumber(selectedOrder.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => addTrackingNumber(selectedOrder.id, selectedOrder.trackingNumber)}>
                        حفظ
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">ملخص الطلب</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">إجمالي المنتجات:</span>
                    <span className="font-medium">{selectedOrder.orderTotal - selectedOrder.shippingCost} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن:</span>
                    <span className="font-medium">
                      {selectedOrder.shippingCost === 0 ? 'مجاني' : `${selectedOrder.shippingCost} ريال`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-semibold">الإجمالي:</span>
                    <span className="text-gray-800 font-bold">{selectedOrder.orderTotal} ريال</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ShippingManagement;
