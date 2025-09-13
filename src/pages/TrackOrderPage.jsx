import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Weight,
  BookOpen,
  FileText,
  Headphones,
  Calendar,
  DollarSign,
  CreditCard,
  AlertCircle,
  Search
} from 'lucide-react';
import api from '@/lib/api.js';
import unifiedPaymentApi from '@/lib/api/unifiedPaymentApi.js';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      // محاكاة جلب بيانات الطلب
      const mockOrder = {
        id: orderId.trim(),
        orderNumber: `#${orderId.trim()}`,
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
            type: 'physical',
            price: 150,
            quantity: 1,
            weight: 0.8,
            dimensions: { length: 20, width: 15, height: 3 },
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
            wordCount: 50000
          }
        ],
        subtotal: 230,
        shippingCost: 25,
        tax: 34.5,
        total: 289.5,
        currency: 'SAR',
        status: 'قيد الشحن',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentIntentId: 'pi_1234567890',
        shippingMethod: 'saudiPost',
        trackingNumber: 'SP123456789',
        estimatedDelivery: '2024-01-15',
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        notes: 'طلب عاجل',
        trackingHistory: [
          {
            status: 'تم إنشاء الطلب',
            description: 'تم استلام طلبك بنجاح',
            timestamp: '2024-01-10T10:30:00Z',
            location: 'الرياض'
          },
          {
            status: 'تم تأكيد الدفع',
            description: 'تم تأكيد عملية الدفع بنجاح',
            timestamp: '2024-01-10T10:35:00Z',
            location: 'الرياض'
          },
          {
            status: 'قيد المعالجة',
            description: 'جاري تحضير طلبك للشحن',
            timestamp: '2024-01-11T09:15:00Z',
            location: 'الرياض'
          },
          {
            status: 'تم الشحن',
            description: 'تم تسليم الطلب لشركة الشحن',
            timestamp: '2024-01-12T14:20:00Z',
            location: 'الرياض'
          }
        ]
      };

      if (orderId.trim() === '1001' || orderId.trim() === '1002') {
        setOrder(mockOrder);
      } else {
        setError('لم يتم العثور على الطلب');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث عن الطلب');
    } finally {
      setLoading(false);
    }
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
      case 'قيد المعالجة': return 'bg-yellow-100 text-yellow-800';
      case 'قيد الشحن': return 'bg-blue-100 text-blue-800';
      case 'تم التسليم': return 'bg-green-100 text-green-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getStatusStep = (status) => {
    switch (status) {
      case 'قيد المعالجة': return 1;
      case 'قيد الشحن': return 2;
      case 'تم التسليم': return 3;
      default: return 0;
    }
  };

  const steps = [
    { title: 'تم إنشاء الطلب', description: 'تم استلام طلبك بنجاح' },
    { title: 'قيد المعالجة', description: 'جاري تحضير طلبك للشحن' },
    { title: 'قيد الشحن', description: 'تم تسليم الطلب لشركة الشحن' },
    { title: 'تم التسليم', description: 'تم تسليم الطلب بنجاح' }
  ];

  const currentStep = getStatusStep(order?.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        تتبع الطلب
      </motion.h1>

      {/* نموذج البحث */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rtl:right-3 rtl:left-auto" />
        <Input
          placeholder="أدخل رقم الطلب"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
            className="pl-10 rtl:pr-10 rtl:pl-3"
        />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? 'جاري البحث...' : 'بحث'}
        </Button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* معلومات الطلب الأساسية */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">معلومات الطلب</h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">معلومات العميل</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{order.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-start">
                    <Home className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                    <div className="text-sm">
                      <div>{order.customerAddress.street}</div>
                      <div>{order.customerAddress.city}</div>
                      <div>{order.customerAddress.postalCode}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">ملخص الطلب</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">رقم الطلب:</span>
                    <span className="text-sm font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">تاريخ الطلب:</span>
                    <span className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المجموع:</span>
                    <span className="text-sm font-medium">{order.total} {order.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">حالة الدفع:</span>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === 'pending' && 'معلق'}
                      {order.paymentStatus === 'paid' && 'مدفوع'}
                      {order.paymentStatus === 'failed' && 'فاشل'}
                      {order.paymentStatus === 'refunded' && 'مسترد'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* تتبع حالة الطلب */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تتبع حالة الطلب</h3>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* خط التقدم */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* سجل التتبع */}
            {order.trackingHistory && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">سجل التتبع</h4>
                <div className="space-y-3">
                  {order.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.status}</p>
                        <p className="text-xs text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString('ar-SA')} - {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* معلومات الشحن */}
          {order.shippingMethod && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الشحن</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Truck className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{order.shippingMethod}</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">رقم التتبع:</span>
                      <span className="text-sm font-medium text-blue-600 mr-2"> {order.trackingNumber}</span>
                    </div>
                  )}
                  
                  {order.estimatedDelivery && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        موعد التوصيل المتوقع: {new Date(order.estimatedDelivery).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">تكلفة الشحن:</span>
                      <span className="text-sm font-medium">{order.shippingCost} {order.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الضريبة:</span>
                      <span className="text-sm font-medium">{order.tax} {order.currency}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">الإجمالي:</span>
                      <span className="text-sm font-bold">{order.total} {order.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* المنتجات */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات المطلوبة</h3>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      {getProductTypeIcon(item.type)}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{getProductTypeName(item.type)}</p>
                        <p className="text-sm text-gray-500">{item.price} {order.currency} × {item.quantity}</p>
                        
                        {/* تفاصيل الكتاب الورقي */}
                        {item.type === 'physical' && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-gray-500">
                              <Weight className="w-3 h-3 inline mr-1" />
                              الوزن: {item.weight} كجم
                            </div>
                            <div className="text-xs text-gray-500">
                              الأبعاد: {item.dimensions?.length}×{item.dimensions?.width}×{item.dimensions?.height} سم
                            </div>
                            <div className="text-xs text-gray-500">
                              ISBN: {item.isbn}
                            </div>
                            <div className="text-xs text-gray-500">
                              الناشر: {item.publisher}
                            </div>
                            <div className="text-xs text-gray-500">
                              سنة النشر: {item.publicationYear}
                            </div>
                            <div className="text-xs text-gray-500">
                              الصفحات: {item.pages}
                            </div>
                            <div className="text-xs text-gray-500">
                              نوع الغلاف: {item.coverType}
                            </div>
                            {item.translators && (
                              <div className="text-xs text-gray-500">
                                المترجمون: {item.translators.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* تفاصيل الكتاب الإلكتروني */}
                        {item.type === 'ebook' && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-gray-500">
                              الصيغة: {item.fileFormat}
                            </div>
                            <div className="text-xs text-gray-500">
                              حجم الملف: {item.fileSize}
                            </div>
                            <div className="text-xs text-gray-500">
                              عدد الكلمات: {item.wordCount?.toLocaleString()}
                            </div>
                          </div>
                        )}
                        
                        {/* تفاصيل الكتاب الصوتي */}
                        {item.type === 'audiobook' && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-gray-500">
                              المدة: {item.duration}
                            </div>
                            <div className="text-xs text-gray-500">
                              القارئ: {item.narrator}
                            </div>
                            <div className="text-xs text-gray-500">
                              جودة الصوت: {item.audioQuality}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.price * item.quantity} {order.currency}</div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>

          {/* معلومات الدفع */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الدفع</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <p className="text-sm text-gray-600">معرف الدفع: {order.paymentIntentId}</p>
              </div>
              
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المجموع الفرعي:</span>
                    <span className="text-sm font-medium">{order.subtotal} {order.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">تكلفة الشحن:</span>
                    <span className="text-sm font-medium">{order.shippingCost} {order.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">الضريبة:</span>
                    <span className="text-sm font-medium">{order.tax} {order.currency}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">الإجمالي:</span>
                    <span className="text-sm font-bold">{order.total} {order.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackOrderPage;
