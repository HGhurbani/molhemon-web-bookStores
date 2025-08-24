import React, { useState, useEffect } from 'react';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import { getPriceForCurrency, useCurrency } from '@/lib/currencyContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { Lock, ShoppingBag, Truck, MapPin, Globe, Clock, Package } from 'lucide-react';
import api from '@/lib/api.js';
import ShippingService from '@/lib/shippingService.js';

const CheckoutPage = ({ cart, setCart, setOrders }) => {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    country: 'SA', // افتراضي السعودية
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [shippingService, setShippingService] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');
  const [availableShippingOptions, setAvailableShippingOptions] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingDetails, setShippingDetails] = useState(null);

  const { currency } = useCurrency();
  const totalPrice = cart.reduce((sum, item) => sum + getPriceForCurrency(item, currency.code) * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // قائمة الدول المتاحة
  const countries = [
    { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
    { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
    { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
    { code: 'QA', name: 'قطر', flag: '🇶🇦' },
    { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
    { code: 'OM', name: 'عمان', flag: '🇴🇲' },
    { code: 'EG', name: 'مصر', flag: '🇪🇬' },
    { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
    { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
    { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
    { code: 'TN', name: 'تونس', flag: '🇹🇳' },
    { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' }
  ];

  useEffect(() => {
    // تحميل طرق الدفع
    api.getPaymentMethods().then((data) => {
      setPaymentMethods(data);
      if (data[0]) setSelectedPaymentMethod(data[0].id);
    }).catch(() => {});

    // تحميل إعدادات الشحن
    api.getSettings().then((settings) => {
      const service = new ShippingService(settings);
      setShippingService(service);
      updateShippingOptions(service, shippingAddress.country, totalPrice);
    }).catch(() => {
      // استخدام إعدادات افتراضية
      const defaultService = createDefaultShippingService();
      setShippingService(defaultService);
      updateShippingOptions(defaultService, shippingAddress.country, totalPrice);
    });
  }, []);

  // تحديث خيارات الشحن عند تغيير الدولة أو إجمالي الطلب
  useEffect(() => {
    if (shippingService) {
      updateShippingOptions(shippingService, shippingAddress.country, totalPrice);
    }
  }, [shippingAddress.country, totalPrice, shippingService]);

  // تحديث خيارات الشحن
  const updateShippingOptions = (service, country, orderTotal) => {
    const options = service.getAvailableShippingOptions(country, orderTotal);
    setAvailableShippingOptions(options);
    
    // تحديد طريقة الشحن الافتراضية
    if (options.length > 0) {
      const defaultMethod = options.find(opt => opt.method === selectedShippingMethod) || options[0];
      setSelectedShippingMethod(defaultMethod.method);
      setShippingCost(defaultMethod.cost);
      setShippingDetails(defaultMethod);
    }
  };

  // تحديث طريقة الشحن
  const handleShippingMethodChange = (method) => {
    setSelectedShippingMethod(method);
    const selectedOption = availableShippingOptions.find(opt => opt.method === method);
    if (selectedOption) {
      setShippingCost(selectedOption.cost);
      setShippingDetails(selectedOption);
    }
  };

  // تحديث عنوان الشحن
  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const hasPhysical = cart.some(item => item.type === 'physical' || !item.type);
  const actualProductSubtotal = totalPrice;
  const actualShippingCost = hasPhysical ? shippingCost : 0;
  const actualFinalTotal = actualProductSubtotal + actualShippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('customerLoggedIn')) {
      toast({ title: 'يجب تسجيل الدخول لإتمام الشراء', variant: 'destructive' });
      navigate('/login');
      return;
    }

    const customerId = localStorage.getItem('currentUserId');
    const total = actualFinalTotal;
    
    const orderData = {
      customer_id: customerId,
      seller_id: null,
      total,
      status: 'قيد المعالجة',
      shipping: {
        ...shippingAddress,
        method: selectedShippingMethod,
        cost: actualShippingCost,
        details: shippingDetails,
        estimatedDays: shippingDetails?.estimatedDays || 'غير محدد'
      },
      items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
    };

    try {
      if (selectedPaymentMethod === 1) {
        await api.createStripePaymentIntent({
          amount: Math.round(total * 100),
          currency: currency.code.toLowerCase(),
        });
      } else if (selectedPaymentMethod === 2) {
        await api.createPayPalOrder({
          amount: total.toFixed(2),
          currency: currency.code,
        });
      }
      
      const newOrder = await api.addOrder(orderData);
      await api.addPayment({
        customer_id: customerId,
        order_id: newOrder.id,
        subscription_id: null,
        payment_method_id: selectedPaymentMethod,
        coupon_id: null,
        amount: total,
        status: 'paid'
      });
      
      setOrders(prev => [newOrder, ...(prev || [])]);
      toast({ title: 'تم استلام الطلب بنجاح!' });
      setCart([]);
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({ title: 'حدث خطأ أثناء إنشاء الطلب', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">إتمام الطلب</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Address */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                    عنوان الشحن
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) => handleAddressChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleAddressChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">الدولة</Label>
                      <select
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="street">العنوان التفصيلي</Label>
                      <Input
                        id="street"
                        value={shippingAddress.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Method Selection */}
                {hasPhysical && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Truck className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                      طريقة الشحن
                    </h2>
                    
                    {availableShippingOptions.length > 0 ? (
                      <div className="space-y-3">
                        {availableShippingOptions.map((option) => (
                          <div
                            key={option.method}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedShippingMethod === option.method
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleShippingMethodChange(option.method)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <input
                                  type="radio"
                                  name="shippingMethod"
                                  checked={selectedShippingMethod === option.method}
                                  onChange={() => handleShippingMethodChange(option.method)}
                                  className="w-4 h-4 text-blue-600 border-gray-300"
                                />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {option.method === 'standard' ? 'الشحن العادي' :
                                     option.method === 'express' ? 'الشحن السريع' :
                                     option.method === 'pickup' ? 'استلام من المتجر' : option.method}
                                  </h3>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Clock className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                                    {option.estimatedDays}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  {option.freeShipping ? (
                                    <span className="text-green-600">مجاني</span>
                                  ) : (
                                    <FormattedPrice amount={option.cost} currency={currency.code} />
                                  )}
                                </p>
                                {option.company && (
                                  <p className="text-sm text-gray-500">
                                    <Package className="w-4 h-4 inline mr-1 rtl:ml-1 rtl:mr-0" />
                                    {option.company.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Truck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>لا توجد خيارات شحن متاحة لهذه الدولة</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Lock className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                    طريقة الدفع
                  </h2>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => setSelectedPaymentMethod(method.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300"
                          />
                          <span className="font-medium text-gray-700">{method.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  إتمام الطلب
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                ملخص الطلب
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        <FormattedPrice amount={getPriceForCurrency(item, currency.code) * item.quantity} currency={currency.code} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">إجمالي المنتجات:</span>
                  <span className="font-medium">
                    <FormattedPrice amount={actualProductSubtotal} currency={currency.code} />
                  </span>
                </div>
                
                {hasPhysical && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن:</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">مجاني</span>
                      ) : (
                        <FormattedPrice amount={shippingCost} currency={currency.code} />
                      )}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">الإجمالي:</span>
                    <span className="text-lg font-bold text-blue-600">
                      <FormattedPrice amount={actualFinalTotal} currency={currency.code} />
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Shipping Info */}
              {hasPhysical && shippingDetails && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">معلومات الشحن</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>طريقة الشحن: {shippingDetails.method === 'standard' ? 'الشحن العادي' :
                                       shippingDetails.method === 'express' ? 'الشحن السريع' :
                                       shippingDetails.method === 'pickup' ? 'استلام من المتجر' : shippingDetails.method}</p>
                    <p>مدة التوصيل: {shippingDetails.estimatedDays}</p>
                    {shippingDetails.company && (
                      <p>شركة الشحن: {shippingDetails.company.name}</p>
                    )}
                    {shippingDetails.country && (
                      <p>الدولة: {countries.find(c => c.code === shippingDetails.country)?.name}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;