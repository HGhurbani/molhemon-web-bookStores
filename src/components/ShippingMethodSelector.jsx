import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, CheckCircle } from 'lucide-react';
import { shippingCalculator } from '@/lib/shippingCalculator.js';
import { toast } from '@/components/ui/use-toast.js';

const ShippingMethodSelector = ({ book, selectedMethod, onMethodChange, country = 'SA' }) => {
  const [availableMethods, setAvailableMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (book && book.type === 'physical') {
      const methods = shippingCalculator.getAvailableMethodsForBook(book, country);
      setAvailableMethods(methods);
      
      // اختيار الطريقة الأرخص تلقائياً إذا لم يتم اختيار طريقة
      if (!selectedMethod && methods.length > 0) {
        onMethodChange(methods[0].id);
      }
    }
    setLoading(false);
  }, [book, country, selectedMethod, onMethodChange]);

  const handleMethodSelect = (methodId) => {
    onMethodChange(methodId);
  };

  const getMethodIcon = (methodId) => {
    switch (methodId) {
      case 'free':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'standard':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'express':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'overnight':
        return <Truck className="w-5 h-5 text-red-600" />;
      case 'pickup':
        return <Package className="w-5 h-5 text-purple-600" />;
      default:
        return <Truck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMethodColor = (methodId) => {
    switch (methodId) {
      case 'free':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'standard':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case 'express':
        return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
      case 'overnight':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'pickup':
        return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!book || book.type !== 'physical') {
    return null;
  }

  if (availableMethods.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center text-yellow-800">
          <Package className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">لا توجد طرق شحن متاحة لهذا الكتاب</span>
        </div>
        <p className="text-xs text-yellow-600 mt-1">
          قد يكون السبب الوزن أو الأبعاد تتجاوز الحد المسموح
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <Truck className="w-4 h-4 mr-2" />
        طرق الشحن المتاحة
      </h4>
      
      <div className="space-y-2">
        {availableMethods.map((method) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label
              className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? `${getMethodColor(method.id)} ring-2 ring-blue-500`
                  : `${getMethodColor(method.id)}`
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => handleMethodSelect(method.id)}
                className="sr-only"
              />
              
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  {getMethodIcon(method.id)}
                  <div className="mr-3">
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {method.estimatedDays}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {method.cost === 0 ? 'مجاني' : `${method.cost} ريال`}
                  </div>
                  {method.description && (
                    <div className="text-xs text-gray-500">{method.description}</div>
                  )}
                </div>
              </div>
              
              {selectedMethod === method.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </label>
          </motion.div>
        ))}
      </div>

      {/* معلومات إضافية */}
      {(book.weight || book.dimensions) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>الوزن:</span>
              <span className="font-medium">{book.weight || 0} كجم</span>
            </div>
            {book.dimensions && (
              <div className="flex justify-between">
                <span>الأبعاد:</span>
                <span className="font-medium">
                  {book.dimensions.length} × {book.dimensions.width} × {book.dimensions.height} سم
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodSelector;










