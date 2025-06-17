import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { CreditCard, Lock, ShoppingBag } from 'lucide-react';

const CheckoutPage = ({ cart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', address: '', city: '', country: 'الإمارات العربية المتحدة', zipCode: '',
    cardNumber: '', expiryDate: '', cvv: ''
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا سيتم دمج Stripe لاحقاً
    toast({
      title: "🚧 الدفع قيد الإنشاء",
      description: "سيتم تفعيل الدفع عبر Stripe قريباً. شكراً لصبرك! 🚀",
    });
    // افتراضياً، بعد "الدفع" الناجح، يتم توجيه المستخدم لصفحة تأكيد أو الرئيسية
    // navigate('/order-confirmation'); 
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
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
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center"
      >
        إتمام عملية الشراء
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">معلومات الشحن</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="country">الدولة</Label>
                  <Input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="zipCode">الرمز البريدي</Label>
                  <Input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">معلومات الدفع</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">رقم البطاقة</Label>
                  <div className="relative">
                    <Input type="text" name="cardNumber" id="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="xxxx xxxx xxxx xxxx" required className="pl-10 rtl:pr-10" />
                    <CreditCard className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
                    <Input type="text" name="expiryDate" id="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input type="text" name="cvv" id="cvv" value={formData.cvv} onChange={handleChange} placeholder="xxx" required />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">ملخص طلبك</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <img  alt={item.title} className="w-10 h-14 object-cover rounded-sm mr-2 rtl:ml-2 rtl:mr-0" src={item.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
                      <div>
                        <p className="text-gray-700 font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium">{(item.price * item.quantity).toFixed(2)} د.إ</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium text-gray-800">{totalPrice.toFixed(2)} د.إ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الشحن:</span>
                  <span className="font-medium text-green-600">مجاني</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span className="text-gray-800">الإجمالي:</span>
                  <span className="text-blue-600">{totalPrice.toFixed(2)} د.إ</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-lg py-3">
                <Lock className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                ادفع الآن بأمان
              </Button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                بالنقر على "ادفع الآن بأمان"، فإنك توافق على <Link to="/terms" className="text-blue-600 hover:underline">الشروط والأحكام</Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;