import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  CheckCircle,
  Star,
  Download,
  FileText,
  Headphones,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Printer,
  Share2,
  Eye,
  AlertCircle,
  CheckSquare,
  Home
} from 'lucide-react';
import api from '@/lib/api.js';
import InvoiceGenerator from '@/components/InvoiceGenerator.jsx';
import UnifiedOrderDetails from '@/components/UnifiedOrderDetails.jsx';
import logger from '@/lib/logger.js';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // تسجيل مفصل لمعرف الطلب
  logger.debug('OrderDetailsPage - URL params:', { id, type: typeof id });

  useEffect(() => {
    // التحقق من وجود معرف الطلب قبل التحميل
    if (!id || id === 'null' || id === 'undefined') {
      logger.error('OrderDetailsPage - No valid order ID found in URL');
      setLoading(false);
      return;
    }
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      
      // التحقق من صحة معرف الطلب
      if (!id || id === 'null' || id === 'undefined' || id.trim() === '') {
        logger.error('OrderDetailsPage - Invalid order ID:', { id, type: typeof id });
        throw new Error('معرف الطلب غير صحيح');
      }
      
      logger.debug('OrderDetailsPage - Loading order with ID:', id);
      
      // جلب تفاصيل الطلب الحقيقية من Firebase
      const orderResult = await api.orders.getById(id);
      
      if (!orderResult || !orderResult.order) {
        logger.error('OrderDetailsPage - Order not found:', { id, orderResult });
        throw new Error('الطلب غير موجود');
      }

      const orderData = orderResult.order;
      const items = orderResult.items || [];
      const shipping = orderResult.shipping;
      const payment = orderResult.payment;

      logger.debug('Order data from Firebase:', orderData);
      logger.debug('Items from Firebase:', items);
      logger.debug('Shipping from Firebase:', shipping);
      logger.debug('Payment from Firebase:', payment);
      logger.debug('Shipping Address from orderData:', orderData.shippingAddress);
      logger.debug('Customer Address from orderData:', orderData.customerAddress);
      
      // حساب المجموع الفرعي من العناصر
      const calculatedSubtotal = items.reduce((sum, item) => {
        const price = item.unitPrice || item.price || 0;
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        logger.debug(`Item: ${item.title || item.name}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`);
        return sum + itemTotal;
      }, 0);
      
      logger.debug('Calculated subtotal from items:', calculatedSubtotal);
      logger.debug('Order subtotal from database:', orderData.subtotal);
      logger.debug('Order shipping cost:', orderData.shippingCost);
      logger.debug('Order tax amount:', orderData.taxAmount);
      logger.debug('Order total from database:', orderData.total);

      // تحويل البيانات إلى التنسيق المطلوب
      const formattedOrder = {
        id: orderData.id,
        orderNumber: orderData.orderNumber || `#${orderData.id.slice(-8).toUpperCase()}`,
        customerId: orderData.customerId,
        customerName: orderData.customerName || orderData.customerInfo?.name || 'غير محدد',
        customerEmail: orderData.customerEmail || orderData.customerInfo?.email || 'غير محدد',
        customerPhone: orderData.customerPhone || orderData.customerInfo?.phone || 'غير محدد',
        customerAddress: (() => {
          // محاولة الحصول على عنوان الشحن من مصادر مختلفة
          const shippingAddr = orderData.shippingAddress || orderData.customerAddress || orderData.shipping;
          
          if (typeof shippingAddr === 'object' && shippingAddr !== null) {
            return {
              name: shippingAddr.name || orderData.customerName || 'غير محدد',
              street: shippingAddr.street || shippingAddr.address || 'غير محدد',
              address2: shippingAddr.address2 || '',
              city: shippingAddr.city || 'غير محدد',
              state: shippingAddr.state || '',
              postalCode: shippingAddr.postalCode || '',
              country: shippingAddr.country || 'SA',
              phone: shippingAddr.phone || orderData.customerPhone || ''
            };
          }
          
          // عنوان افتراضي
          return {
            name: orderData.customerName || 'غير محدد',
            street: 'غير محدد',
            address2: '',
            city: 'غير محدد',
            state: '',
            postalCode: '',
            country: 'SA',
            phone: orderData.customerPhone || ''
          };
        })(),
        items: items.map(item => ({
          id: item.id || item.productId,
          name: item.title || item.name || item.productName || 'منتج غير محدد',
          type: item.productType || item.type || 'physical',
          price: item.unitPrice || item.price || 0,
          quantity: item.quantity || 1,
          weight: item.weight || 0,
          dimensions: item.dimensions || { length: 0, width: 0, height: 0 },
          isbn: item.isbn || '',
          publisher: item.publisher || '',
          publicationYear: item.publicationYear || '',
          pages: item.pages || 0,
          coverType: item.coverType || '',
          fileFormat: item.fileFormat || '',
          fileSize: item.fileSize || '',
          wordCount: item.wordCount || 0,
          isDelivered: item.isDelivered || false,
          deliveredAt: item.deliveredAt || null,
          downloadUrl: item.downloadUrl || null
        })),
        subtotal: orderData.subtotal || calculatedSubtotal,
        shippingCost: (() => {
          // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
          const shippingMethod = orderData.shippingMethod;
          const isPickup = shippingMethod === 'pickup' || 
                          shippingMethod?.name === 'استلام من المتجر' ||
                          shippingMethod?.id === 'pickup' ||
                          shippingMethod?.type === 'pickup';
          
          if (isPickup) {
            logger.debug('Pickup method detected, setting shipping cost to 0');
            return 0;
          }
          
          return orderData.shippingCost || 0;
        })(),
        tax: orderData.taxAmount || calculatedSubtotal * 0.15,
        discountAmount: orderData.discountAmount || 0,
        total: (() => {
          const finalSubtotal = orderData.subtotal || calculatedSubtotal;
          
          // حساب الشحن مع التحقق من طريقة الشحن
          const shippingMethod = orderData.shippingMethod;
          logger.debug('Shipping method data:', shippingMethod);
          logger.debug('Shipping method type:', typeof shippingMethod);
          logger.debug('Shipping method keys:', shippingMethod ? Object.keys(shippingMethod) : 'N/A');
          
          const isPickup = shippingMethod === 'pickup' || 
                          shippingMethod?.name === 'استلام من المتجر' ||
                          shippingMethod?.id === 'pickup' ||
                          shippingMethod?.type === 'pickup';
          
          logger.debug('Is pickup detected:', isPickup);
          
          const finalShipping = isPickup ? 0 : (orderData.shippingCost || 0);
          const finalTax = orderData.taxAmount || finalSubtotal * 0.15;
          const finalDiscount = orderData.discountAmount || 0;
          
          // حساب الإجمالي: المجموع الفرعي - الخصم + الشحن + الضريبة
          const finalTotal = finalSubtotal - finalDiscount + finalShipping + finalTax;
          
          logger.debug(`Final calculation: Subtotal: ${finalSubtotal}, Discount: ${finalDiscount}, Shipping: ${finalShipping} (pickup: ${isPickup}), Tax: ${finalTax}, Total: ${finalTotal}`);
          logger.debug(`Database values: orderData.total: ${orderData.total}, orderData.totalAmount: ${orderData.totalAmount}`);
          
          // إعطاء الأولوية للحساب الصحيح بدلاً من القيم المحفوظة
          return finalTotal;
        })(),
        currency: orderData.currency || 'SAR',
        status: orderData.status || 'pending',
        currentStage: orderData.currentStage || 'ordered',
        paymentStatus: orderData.paymentStatus || 'pending',
        paymentMethod: payment?.paymentMethod || orderData.paymentMethod?.name || orderData.paymentMethod?.gateway || 'غير محدد',
        paymentIntentId: payment?.paymentIntentId || orderData.paymentIntentId || 'غير محدد',
        shippingMethod: shipping?.method || orderData.shippingMethod?.name || orderData.shippingMethod?.id || 'غير محدد',
        trackingNumber: shipping?.trackingNumber || orderData.trackingNumber || null,
        estimatedDelivery: shipping?.estimatedDelivery || orderData.estimatedDelivery || null,
        createdAt: orderData.createdAt || orderData.orderedAt || new Date().toISOString(),
        updatedAt: orderData.updatedAt || new Date().toISOString(),
        orderedAt: orderData.orderedAt || orderData.createdAt || new Date().toISOString(),
        paidAt: orderData.paidAt || null,
        shippedAt: orderData.shippedAt || null,
        deliveredAt: orderData.deliveredAt || null,
        reviewedAt: orderData.reviewedAt || null,
        stageHistory: orderData.stageHistory || [
          {
            stage: 'ordered',
            timestamp: orderData.createdAt || new Date().toISOString(),
            notes: 'تم إنشاء الطلب'
          }
        ],
        notes: orderData.notes || ''
      };

      setOrder(formattedOrder);
      
      // إظهار رسالة النجاح إذا كان الطلب جديد
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        setShowSuccessMessage(true);
        // إخفاء الرسالة بعد 5 ثوان
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
    } catch (error) {
      logger.error('Failed to load order details:', error);
      
      // معالجة أنواع مختلفة من الأخطاء
      let errorMessage = error.message;
      if (error.message.includes('معرف الطلب غير صحيح')) {
        errorMessage = 'معرف الطلب غير صحيح. يرجى التحقق من الرابط.';
      } else if (error.message.includes('الطلب غير موجود')) {
        errorMessage = 'الطلب غير موجود. قد يكون تم حذفه أو أن الرابط غير صحيح.';
      } else if (error.message.includes('Firebase')) {
        errorMessage = 'خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.';
      }
      
      toast({
        title: 'فشل في تحميل تفاصيل الطلب',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStageInfo = (stage) => {
    const stages = {
      'ordered': { name: 'تم الطلب', icon: '📝', color: 'blue', description: 'تم استلام طلبك بنجاح' },
      'paid': { name: 'تم الدفع', icon: '💳', color: 'green', description: 'تم تأكيد الدفع بنجاح' },
      'shipped': { name: 'تم الشحن', icon: '🚚', color: 'orange', description: 'تم شحن طلبك وهو في الطريق إليك' },
      'delivered': { name: 'تم الاستلام', icon: '✅', color: 'green', description: 'تم تسليم طلبك بنجاح' },
      'reviewed': { name: 'تم التقييم', icon: '⭐', color: 'purple', description: 'تم تقييم الطلب بنجاح' }
    };
    return stages[stage] || stages['ordered'];
  };

  const getProductTypeIcon = (type) => {
    switch (type) {
      case 'physical': return <BookOpen className="w-5 h-5" />;
      case 'ebook': return <FileText className="w-5 h-5" />;
      case 'audiobook': return <Headphones className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
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

  const getStageColor = (stage) => {
    const colors = {
      'ordered': 'bg-blue-100 text-white border-blue-200',
      'paid': 'bg-green-100 text-green-800 border-green-200',
      'shipped': 'bg-orange-100 text-orange-800 border-orange-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'reviewed': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[stage] || colors['ordered'];
  };

  const handleDownload = (item) => {
    if (item.isDelivered && item.downloadUrl) {
      // محاكاة التحميل
      toast({
        title: 'بدء التحميل',
        description: `جاري تحميل ${item.name}`,
        variant: 'success'
      });
      // في التطبيق الحقيقي، سيتم فتح رابط التحميل
      window.open(item.downloadUrl, '_blank');
    }
  };

  const handlePrintInvoice = () => {
    setShowInvoice(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadInvoice = () => {
    // محاكاة تحميل PDF
    toast({
      title: 'جاري تحضير الفاتورة',
      description: 'سيتم تحميل ملف PDF قريباً',
      variant: 'success'
    });
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `طلب ${order.orderNumber}`,
        text: `تفاصيل طلب ${order.orderNumber}`,
        url: window.location.href
      });
    } else {
      // نسخ الرابط
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'تم نسخ الرابط',
        description: 'تم نسخ رابط الطلب إلى الحافظة',
        variant: 'success'
      });
    }
  };

  // إذا لم يكن هناك معرف طلب صحيح
  if (!id || id === 'null' || id === 'undefined') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">معرف الطلب غير صحيح</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على معرف صحيح للطلب في الرابط</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">الطلب غير موجود</h2>
          <p className="text-gray-600 mb-6">لا يمكن العثور على الطلب المطلوب</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const currentStageInfo = getStageInfo(order.currentStage);
  const hasPhysicalProducts = order.items.some(item => item.type === 'physical');
  const hasDigitalProducts = order.items.some(item => item.type === 'ebook' || item.type === 'audiobook');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  تم تأكيد طلبك بنجاح! 🎉
                </h3>
                <p className="text-green-700">
                  شكراً لك على ثقتك بنا. تم استلام طلبك وسيتم معالجته قريباً.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/my-orders')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                عرض مشترياتي
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Package className="w-4 h-4 mr-2" />
                متابعة التسوق
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Home className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تفاصيل الطلب</h1>
              <p className="text-gray-600 mt-1">طلب رقم: {order.orderNumber}</p>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button variant="outline" onClick={handlePrintInvoice}>
                <Printer className="w-4 h-4 mr-2" />
                طباعة الفاتورة
              </Button>
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="w-4 h-4 mr-2" />
                تحميل PDF
              </Button>
              <Button variant="outline" onClick={handleShareOrder}>
                <Share2 className="w-4 h-4 mr-2" />
                مشاركة
              </Button>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">حالة الطلب</h2>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(order.currentStage)}`}>
              <span className="mr-2">{currentStageInfo.icon}</span>
              {currentStageInfo.name}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{currentStageInfo.description}</p>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {['ordered', 'paid', 'shipped', 'delivered', 'reviewed'].map((stage, index) => {
                const stageInfo = getStageInfo(stage);
                const isCompleted = ['ordered', 'paid', 'shipped', 'delivered', 'reviewed'].indexOf(order.currentStage) >= index;
                const isCurrent = order.currentStage === stage;
                
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="text-xs text-gray-600 mt-1 text-center">{stageInfo.name}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ 
                  width: `${(['ordered', 'paid', 'shipped', 'delivered', 'reviewed'].indexOf(order.currentStage) / 4) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <UnifiedOrderDetails 
              order={order} 
              showActions={false} 
              isAdmin={false} 
            />
          </div>

          {/* Order Summary - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">رقم الطلب:</span>
                  <span className="text-sm font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">تاريخ الطلب:</span>
                  <span className="text-sm font-medium">
                    {(() => {
                      try {
                        if (!order.createdAt) return 'غير محدد';
                        
                        let date;
                        
                        // التعامل مع Firebase Timestamp
                        if (order.createdAt && typeof order.createdAt === 'object' && order.createdAt.toDate) {
                          date = order.createdAt.toDate();
                        } else if (order.createdAt && typeof order.createdAt === 'object' && order.createdAt.seconds) {
                          // التعامل مع Firebase Timestamp في شكل object
                          date = new Date(order.createdAt.seconds * 1000);
                        } else if (typeof order.createdAt === 'string' || typeof order.createdAt === 'number') {
                          date = new Date(order.createdAt);
                        } else {
                          return 'غير محدد';
                        }
                        
                        if (isNaN(date.getTime())) return 'غير محدد';
                        return date.toLocaleDateString('ar-SA');
                      } catch (error) {
                        logger.error('Date parsing error:', error, 'Value:', order.createdAt);
                        return 'غير محدد';
                      }
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">المجموع الفرعي:</span>
                  <span className="text-sm font-medium">{order.subtotal} {order.currency}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">الخصم:</span>
                    <span className="text-sm font-medium text-green-600">-{order.discountAmount} {order.currency}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">تكلفة الشحن:</span>
                  <span className="text-sm font-medium">
                    {order.shippingCost > 0 ? `${order.shippingCost} ${order.currency}` : 'استلام من المتجر'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">الضريبة:</span>
                  <span className="text-sm font-medium">{order.taxAmount || order.tax || 0} {order.currency}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي:</span>
                    <span>{order.total} {order.currency}</span>
                  </div>
                </div>
              </div>
              
              {order.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">ملاحظات:</h4>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">فاتورة الطلب {order.orderNumber}</h3>
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
                order={order}
                onPrint={handlePrintInvoice}
                onDownload={handleDownloadInvoice}
                onShare={handleShareOrder}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;