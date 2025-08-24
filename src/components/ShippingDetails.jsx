import React from 'react';
import { Truck, MapPin, Clock, Package, Globe, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ShippingDetails = ({ shipping, orderStatus }) => {
  if (!shipping) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'تم الشحن':
        return 'text-green-600 bg-green-100';
      case 'قيد الشحن':
        return 'text-blue-600 bg-blue-100';
      case 'قيد المعالجة':
        return 'text-yellow-600 bg-yellow-100';
      case 'تم التسليم':
        return 'text-green-700 bg-green-200';
      default:
        return 'text-gray-600 bg-gray-100';
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
      'OM': 'عمان',
      'EG': 'مصر',
      'JO': 'الأردن',
      'LB': 'لبنان',
      'MA': 'المغرب',
      'TN': 'تونس',
      'DZ': 'الجزائر'
    };
    return countries[countryCode] || countryCode;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Truck className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-600" />
          تفاصيل الشحن
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderStatus)}`}>
          {orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-500" />
            عنوان الشحن
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">الاسم:</span>
              <span className="font-medium text-gray-900">{shipping.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الهاتف:</span>
              <span className="font-medium text-gray-900">{shipping.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">البريد الإلكتروني:</span>
              <span className="font-medium text-gray-900">{shipping.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">العنوان:</span>
              <span className="font-medium text-gray-900 text-right">
                {shipping.street}, {shipping.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الدولة:</span>
              <span className="font-medium text-gray-900 flex items-center">
                <Globe className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                {getCountryName(shipping.country)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Method & Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <Package className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-500" />
            طريقة الشحن
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الطريقة:</span>
              <span className="font-medium text-gray-900">{getMethodName(shipping.method)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">التكلفة:</span>
              <span className={`font-medium ${shipping.cost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {shipping.cost === 0 ? 'مجاني' : `${shipping.cost} ريال`}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مدة التوصيل:</span>
              <span className="font-medium text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                {shipping.estimatedDays || 'غير محدد'}
              </span>
            </div>
            
            {shipping.details?.company && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">شركة الشحن:</span>
                <span className="font-medium text-gray-900">{shipping.details.company.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Timeline */}
      {shipping.details && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-500" />
            جدول الشحن
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">تم استلام الطلب</span>
              </div>
              
              {orderStatus === 'قيد المعالجة' && (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">قيد المعالجة</span>
                </div>
              )}
              
              {orderStatus === 'قيد الشحن' && (
                <>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">تم المعالجة</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">قيد الشحن</span>
                  </div>
                </>
              )}
              
              {orderStatus === 'تم الشحن' && (
                <>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">تم المعالجة</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">تم الشحن</span>
                  </div>
                </>
              )}
              
              {orderStatus === 'تم التسليم' && (
                <>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">تم المعالجة</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">تم الشحن</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">تم التسليم</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {shipping.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">ملاحظات إضافية</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">{shipping.notes}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ShippingDetails;
