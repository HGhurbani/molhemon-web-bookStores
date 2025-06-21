import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { CreditCard, Lock, ShoppingBag, Truck, Tag, MessageSquare, MapPin } from 'lucide-react'; // Added MapPin for address

const CheckoutPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  // Mock user data for display, in a real app this would come from user context or API
  const [shippingAddress, setShippingAddress] = useState({
    name: 'بروس وين',
    street: '65، شارع 47، العجمان، إمارة عجمان',
    city: 'عجمان',
    country: 'الإمارات العربية المتحدة',
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Example logic for shipping and discounts based on total price
  const freeShippingThreshold = 150.00; // Example: Free shipping over 150 AED
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 25.00; // Example shipping cost

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


  const handleSubmit = (e) => {
    e.preventDefault();
    const total = actualFinalTotal; // Use the actual calculated total
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      total,
      status: 'قيد المعالجة',
      items: cart.map(i => ({ id: i.id, title: i.title, quantity: i.quantity, price: i.price })) // Include price for better order tracking
    };
    const stored = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...stored]));
    toast({ title: 'تم استلام الطلب بنجاح!' });
    // تفريغ السلة بعد إتمام الطلب
    setCart([]);
    localStorage.setItem('cart', '[]');
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
              <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.country}</p>
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" size="sm" onClick={() => toast({title: "تغيير العنوان", description: "🚧 هذه الميزة غير مطبقة بعد"})}>تغيير</Button>
                  <Button variant="outline" size="sm" onClick={() => toast({title: "إضافة عنوان جديد", description: "🚧 هذه الميزة غير مطبقة بعد"})}>إضافة</Button>
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
                      <p className="font-semibold text-gray-800">{ (item.price * item.quantity).toFixed(2)} د.إ</p>
                      {item.originalPrice && (
                        <p className="text-[10px] text-red-500 line-through">{item.originalPrice.toFixed(2)} د.إ</p>
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
                    <span>{actualProductSubtotal.toFixed(2)} د.إ</span>
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
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-1">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                        <span className="text-xs text-gray-700">إضافة بطاقة</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-1">
                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_btn_Vert_lg.png" alt="PayPal" className="h-8 object-contain" />
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-1">
                        <img src="https://developer.apple.com/apple-pay/images/Apple-Pay-Mark_82x52.png" alt="Apple Pay" className="h-8 object-contain" />
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-1">
                        <img src="https://www.gstatic.com/instant/images/gpay_mark_rgb_120x35.png" alt="Google Pay" className="h-8 object-contain" />
                    </Button>
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
                  <span className="font-medium text-gray-800">{actualProductSubtotal.toFixed(2)} د.إ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي للشحن:</span>
                  <span className="font-medium text-gray-800">{actualShippingCost.toFixed(2)} د.إ</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                  <span className="text-gray-800">إجمالي الدفع:</span>
                  <span className="text-blue-600">{actualFinalTotal.toFixed(2)} د.إ</span>
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