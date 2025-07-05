import React, { useState, useEffect } from 'react';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import { getPriceForCurrency, useCurrency } from '@/lib/currencyContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { Lock, ShoppingBag, Truck, MapPin } from 'lucide-react';
import api from '@/lib/api.js';

const CheckoutPage = ({ cart, setCart, setOrders }) => {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    country: '',
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);

  useEffect(() => {
    api.getPaymentMethods().then((data) => {
      setPaymentMethods(data);
      if (data[0]) setSelectedPaymentMethod(data[0].id);
    }).catch(() => {});
  }, []);

  const { currency } = useCurrency();
  const totalPrice = cart.reduce((sum, item) => sum + getPriceForCurrency(item, currency.code) * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Example logic for shipping and discounts based on total price
  const freeShippingThreshold = 150.00; // Example: Free shipping over 150 AED
  const hasPhysical = cart.some(item => item.type === 'physical' || !item.type);
  const shippingCost = hasPhysical
    ? (totalPrice >= freeShippingThreshold ? 0 : 25.00)
    : 0;

  // This is based on the image's total pricing, which seems to imply an existing discount
  const imageDisplayedProductSubtotal = 45.00 + 60.00; // From the image, two items
  const imageDisplayedShipping = 10.00;
  const imageDisplayedTotal = 115.00;

  // Let's use these values for the summary to match the image exactly if cart has 2 specific items,
  // otherwise, use dynamic calculation.
  const isCartMatchingImageExample = cart.length === 2 && 
                                     cart.some(item => item.title === 'قبل أن تختار الدواء') &&
                                     cart.some(item => item.title === 'حوار داخلي');

  const actualProductSubtotal = totalPrice;
  const actualShippingCost = shippingCost;
  const actualFinalTotal = totalPrice + shippingCost;


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
      shipping: shippingAddress,
      items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
    };
    try {
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
      localStorage.setItem('cart', '[]');
    } catch (err) {
      toast({ title: 'حدث خطأ أثناء إنشاء الطلب', variant: 'destructive' });
    }
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-gray-700 mb-3">لا يوجد شيء للدفع</h1>
        <p className="text-gray-500 mb-6">سلة التسوق فارغة. أضف بعض المنتجات أولاً.</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link to="/">العودة للتسوق</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <nav className="text-sm text-gray-500 mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2 rtl:space-x-reverse">
          <li><Link to="/" className="hover:text-blue-600">الرئيسية</Link></li>
          <li><span>/</span></li>
          <li className="text-gray-700" aria-current="page">الدفع</li>
        </ol>
      </nav>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-right"
      >
        الدفع
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Shipping Address & Products */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg space-y-6"
          >
            {/* Shipping Address Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <MapPin className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 text-blue-600" />
                عنوان الشحن
              </h2>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-3">
                <div>
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="street">العنوان</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">الدولة</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Required Products Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <ShoppingBag className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 text-blue-600" />
                  المنتجات المطلوبة
                </span>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-normal text-gray-600">
                    {/* Placeholder checkbox for "شركة هاي هاوس" */}
                    <input type="checkbox" id="companyCheckbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" defaultChecked/>
                    <label htmlFor="companyCheckbox">شركة هاي هاوس</label>
                </div>
              </h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img  alt={item.title} className="w-full h-full object-cover" src={item.coverImage || 'https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg'} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                        <p className="text-xs text-gray-500">{item.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800"><FormattedPrice value={getPriceForCurrency(item, currency.code) * item.quantity} /></p>
                      {item.originalPrice && (
                        <p className="text-[10px] text-red-500 line-through"><FormattedPrice value={item.originalPrice} /></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <Label htmlFor="sellerMessage">رسالة للبائع</Label>
                <Input id="sellerMessage" placeholder="اكتب رسالة للبائع..." />

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600 flex items-center">
                    <Truck className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 text-blue-600" />
                    خيار الشحن:
                  </span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm" className="bg-green-100 text-green-700 cursor-default">
                        ضمان التوصيل خلال 9 - 12 مارس
                    </Button>
                    <Button variant="link" size="sm" className="px-0 text-blue-600">
                        تتبع رسالتك
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold text-gray-700 border-t pt-4 mt-4">
                    <span>المجموع الفرعي للمنتج:</span>
                    <span><FormattedPrice value={actualProductSubtotal} /></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Payment Methods & Final Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24 space-y-6">
              {/* Payment Methods Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">طريقة الدفع</h2>
                <div className="space-y-2">
                  {paymentMethods.map((m) => (
                    <label key={m.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="payment_method"
                        value={m.id}
                        checked={selectedPaymentMethod === m.id}
                        onChange={() => setSelectedPaymentMethod(m.id)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Coupon Section (Based on the "اخر أو ادخل الرمز" part of the image) */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">قسيمة دارموهيمون</h2>
                <div className="flex items-center gap-2">
                    <Input placeholder="أدخل أو اختر الرمز" className="flex-grow" />
                    <Button variant="outline">تطبيق</Button>
                </div>
              </div>

              {/* Final Summary */}
              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي للمنتجات:</span>
                  <span className="font-medium text-gray-800"><FormattedPrice value={actualProductSubtotal} /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي للشحن:</span>
                  <span className="font-medium text-gray-800"><FormattedPrice value={actualShippingCost} /></span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                  <span className="text-gray-800">إجمالي الدفع:</span>
                  <span className="text-blue-600"><FormattedPrice value={actualFinalTotal} /></span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-lg py-3">
                <Lock className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                تأكيد الطلب
              </Button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;