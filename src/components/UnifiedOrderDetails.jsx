import React from 'react';
import { motion } from 'framer-motion';
import FormattedPrice from './FormattedPrice.jsx';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Truck,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import logger from '@/lib/logger.js';

/**
 * مكون موحد لعرض تفاصيل الطلب
 * يضمن عرض نفس البيانات في جميع الأماكن (لوحة التحكم وصفحة العميل)
 */
const UnifiedOrderDetails = ({ 
  order, 
  showActions = false, 
  onStatusUpdate, 
  onDelete,
  isAdmin = false 
}) => {
  
  // دالة موحدة لحساب المبلغ الإجمالي
  const calculateOrderTotal = (orderData) => {
    const subtotal = orderData.subtotal || 0;
    const taxAmount = orderData.taxAmount || 0;
    const discountAmount = orderData.discountAmount || 0;
    
    // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
    const shippingMethod = orderData.shippingMethod;
    const isPickup = shippingMethod === 'pickup' || 
                    shippingMethod?.name === 'استلام من المتجر' ||
                    shippingMethod?.id === 'pickup' ||
                    shippingMethod?.type === 'pickup' ||
                    orderData.shippingType === 'pickup';
    
    const shippingCost = isPickup ? 0 : (orderData.shippingCost || orderData.shippingAmount || 0);
    
    // حساب الإجمالي: المجموع الفرعي - الخصم + الشحن + الضريبة
    const total = subtotal - discountAmount + shippingCost + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      shippingCost,
      taxAmount,
      total,
      isPickup
    };
  };

  // دالة موحدة لتنسيق عنوان الشحن
  const formatShippingAddress = (orderData) => {
    const address = orderData.shippingAddress || orderData.customerAddress || orderData.address;
    
    if (address && typeof address === 'object') {
      return {
        name: address.name || address.firstName || orderData.customerName || 'غير محدد',
        street: address.street || address.address1 || '',
        address2: address.street2 || address.address2 || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || 'SA',
        phone: address.phone || orderData.customerPhone || ''
      };
    } else if (typeof address === 'string' && address.trim()) {
      return {
        name: orderData.customerName || 'غير محدد',
        street: address,
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'SA',
        phone: orderData.customerPhone || ''
      };
    } else {
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
    }
  };

  // دالة موحدة لتنسيق طريقة الدفع
  const formatPaymentMethod = (orderData) => {
    if (typeof orderData.paymentMethod === 'string') {
      return orderData.paymentMethod;
    }
    return orderData.paymentMethod?.name || orderData.paymentMethod?.gateway || 'غير محدد';
  };

  // دالة موحدة لتنسيق طريقة الشحن
  const formatShippingMethod = (orderData) => {
    if (typeof orderData.shippingMethod === 'string') {
      return orderData.shippingMethod;
    }
    return orderData.shippingMethod?.name || orderData.shippingMethod?.id || 'غير محدد';
  };

  // دالة موحدة لتنسيق التواريخ
  const formatDate = (dateValue) => {
    if (!dateValue) return 'غير محدد';
    
    try {
      let date;
      
      // التعامل مع Firebase Timestamp
      if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
        date = dateValue.toDate();
      } else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        // التعامل مع Firebase Timestamp في شكل object
        date = new Date(dateValue.seconds * 1000);
      } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        date = new Date(dateValue);
      } else {
        return 'غير محدد';
      }
      
      if (isNaN(date.getTime())) return 'غير محدد';
      
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      logger.error('Error formatting date:', error, 'Value:', dateValue);
      return 'غير محدد';
    }
  };

  // حساب القيم الموحدة
  const calculations = calculateOrderTotal(order);
  const shippingAddress = formatShippingAddress(order);
  const paymentMethod = formatPaymentMethod(order);
  const shippingMethod = formatShippingMethod(order);

  return (
    <div className="space-y-6">
      {/* معلومات العميل */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          معلومات العميل
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <User className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{order.customerName || 'غير محدد'}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{order.customerPhone || 'غير محدد'}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{order.customerEmail || 'غير محدد'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm">{formatDate(order.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
            <div className="text-sm">
              <div className="font-medium">{shippingAddress.name}</div>
              <div>{shippingAddress.street} {shippingAddress.address2}</div>
              <div>{shippingAddress.city}, {shippingAddress.postalCode}</div>
              <div>{shippingAddress.country}</div>
              {shippingAddress.phone && <div>الهاتف: {shippingAddress.phone}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* تفاصيل الطلب */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          تفاصيل الطلب
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">رقم الطلب:</span>
            <span className="font-medium">{order.orderNumber || `#${order.id?.slice(-8)?.toUpperCase() || 'N/A'}`}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">الحالة:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              order.status === 'delivered' || order.status === 'تم التوصيل' 
                ? 'bg-green-100 text-green-700' 
                : order.status === 'cancelled' || order.status === 'ملغي'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {order.status === 'pending' ? 'قيد المراجعة' : 
               order.status === 'confirmed' ? 'مؤكد' :
               order.status === 'shipped' ? 'تم الشحن' :
               order.status === 'delivered' ? 'تم التوصيل' :
               order.status === 'cancelled' ? 'ملغي' : order.status}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">طريقة الدفع:</span>
            <span className="font-medium">{paymentMethod}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">حالة الدفع:</span>
            <span className={`font-medium ${
              order.paymentStatus === 'paid' || order.paymentStatus === 'Paid' || order.paymentStatus === 'completed' 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              {order.paymentStatus === 'paid' || order.paymentStatus === 'Paid' || order.paymentStatus === 'completed' 
                ? 'مدفوع' 
                : 'في الانتظار'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">طريقة الشحن:</span>
            <span className="font-medium">{shippingMethod}</span>
          </div>
        </div>
      </div>

      {/* المنتجات */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.title || item.name || item.productName || 'منتج غير محدد'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.author || 'مؤلف غير محدد'}
                    </div>
                    <div className="text-xs text-gray-400">
                      الكمية: {item.quantity || 1}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    <FormattedPrice value={(item.unitPrice || item.price || 0) * (item.quantity || 1)} />
                  </div>
                  <div className="text-sm text-gray-500">
                    <FormattedPrice value={item.unitPrice || item.price || 0} /> لكل وحدة
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ملخص الطلب */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">المجموع الفرعي:</span>
            <span className="font-medium">
              <FormattedPrice value={calculations.subtotal} />
            </span>
          </div>
          
          {calculations.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">الخصم:</span>
              <span className="font-medium text-green-600">
                -<FormattedPrice value={calculations.discountAmount} />
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">الشحن:</span>
            <span className="font-medium">
              {calculations.isPickup ? (
                <span className="text-green-600">مجاني (استلام من المتجر)</span>
              ) : (
                <FormattedPrice value={calculations.shippingCost} />
              )}
            </span>
          </div>
          
          {calculations.taxAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">الضريبة:</span>
              <span className="font-medium">
                <FormattedPrice value={calculations.taxAmount} />
              </span>
            </div>
          )}
          
          <hr className="border-gray-200" />
          
          <div className="flex justify-between text-lg font-bold">
            <span>المجموع الكلي:</span>
            <span className="text-blue-600">
              <FormattedPrice value={calculations.total} />
            </span>
          </div>
        </div>
      </div>

      {/* إجراءات الطلب (للوحة التحكم فقط) */}
      {showActions && isAdmin && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات الطلب</h3>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button 
              onClick={() => onDelete && onDelete(order.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              حذف الطلب
            </button>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
              طباعة الفاتورة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedOrderDetails;
