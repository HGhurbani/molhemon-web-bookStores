
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';

const CartPage = ({ cart, handleRemoveFromCart, handleUpdateQuantity }) => {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-gray-700 mb-3">سلة التسوق فارغة</h1>
        <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link to="/">ابدأ التسوق الآن</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8"
      >
        سلة التسوق ({cart.reduce((sum, item) => sum + item.quantity, 0)} منتجات)
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="w-24 h-32 sm:w-20 sm:h-28 rounded-md overflow-hidden flex-shrink-0">
                <img  alt={`غلاف كتاب ${item.title}`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1572119003128-d110c07af847" />
              </div>
              <div className="flex-grow text-center sm:text-right rtl:sm:text-left">
                <Link to={`/book/${item.id}`}>
                  <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{item.title}</h2>
                </Link>
                <p className="text-sm text-gray-500">{item.author}</p>
                <p className="text-md font-bold text-blue-600 mt-1">{item.price.toFixed(2)} ر.س</p>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse my-3 sm:my-0">
                <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="h-8 w-8">
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-lg font-semibold text-gray-800 w-24 text-center sm:text-left rtl:sm:text-right">
                {(item.price * item.quantity).toFixed(2)} ر.س
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10">
                <Trash2 className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: cart.length * 0.1 + 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg sticky top-24"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5">ملخص الطلب</h2>
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-medium text-gray-800">{totalPrice.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الشحن:</span>
                <span className="font-medium text-green-600">مجاني</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-lg font-bold text-gray-800">الإجمالي:</span>
                <span className="text-xl font-bold text-blue-600">{totalPrice.toFixed(2)} ر.س</span>
              </div>
            </div>
            <Button asChild size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3">
              <Link to="/checkout">
                <CreditCard className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                الانتقال إلى الدفع
              </Link>
            </Button>
            <p className="text-xs text-gray-500 mt-3 text-center">سيتم تطبيق الضرائب عند الدفع.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
