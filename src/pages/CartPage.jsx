import React from 'react';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import { getPriceForCurrency, useCurrency } from '@/lib/currencyContext.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Heart, ChevronLeft, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';

const CartPage = ({ cart, handleRemoveFromCart, handleUpdateQuantity }) => {
  const { currency } = useCurrency();
  const totalPrice = cart.reduce((sum, item) => sum + getPriceForCurrency(item, currency.code) * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [isSelectAllChecked, setIsSelectAllChecked] = React.useState(false);

  React.useEffect(() => {
    if (cart.length === 0) {
      setIsSelectAllChecked(false);
    }
  }, [cart.length]);

  // Example logic for discounts based on total price
  const discountThreshold = 105.00; // Example: Discount if total is over 105 AED
  const discountAmount = 5.00; // Example: 5 AED discount

  const appliedDiscount = totalPrice >= discountThreshold ? discountAmount : 0;
  const finalTotal = totalPrice - appliedDiscount;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-gray-700 mb-3">سلة التسوق فارغة</h1>
        <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link to="/">ابدأ التسوق الآن</Link>
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
          <li className="text-gray-700" aria-current="page">سلة التسوق</li>
        </ol>
      </nav>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8"
      >
        عربة التسوق
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items and Discounts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-5 gap-4 py-3 px-4 bg-gray-100 rounded-lg font-semibold text-gray-600 text-sm">
            <div className="col-span-2">المنتج</div>
            <div className="text-center">سعر الوحدة</div>
            <div className="text-center">الكمية</div>
            <div className="text-right">السعر الإجمالي</div>
          </div>

          {/* Cart Items */}
          {cart.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 text-sm relative"
            >
              <div className="grid grid-cols-5 sm:grid-cols-5 w-full items-center gap-4">
                {/* Product Info */}
                <div className="col-span-2 flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img alt={`غلاف كتاب ${item.title}`} className="w-full h-full object-cover" src={item.coverImage || 'https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg'} />
                  </div>
                  <div className="flex-grow">
                    <Link to={`/book/${item.id}`} state={{ book: item }} className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
                      {item.title}
                    </Link>
                    <p className="text-gray-500 text-xs">{item.author}</p>
                    {item.originalPrice && (
                      <p className="text-[10px] text-green-600">وفر <FormattedPrice value={item.originalPrice - getPriceForCurrency(item, currency.code)} /></p>
                    )}
                  </div>
                </div>

                {/* Unit Price */}
                <div className="text-center">
                  <span className="font-bold text-blue-600"><FormattedPrice book={item} /></span>
                  {item.originalPrice && (
                    <span className="text-gray-400 line-through text-xs block"><FormattedPrice value={item.originalPrice} /></span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 text-gray-600 hover:bg-gray-100">
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 text-gray-600 hover:bg-gray-100">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Total Price for Item */}
                <div className="text-right font-semibold text-gray-800">
                  <FormattedPrice value={getPriceForCurrency(item, currency.code) * item.quantity} />
                </div>
              </div>
              
              {/* Delete Button (Absolute positioned to match image) */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveFromCart(item.id)} 
                className="absolute top-2 left-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 p-1"
                aria-label="حذف المنتج من السلة"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}

          {/* Discount/Coupon Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: cart.length * 0.05 + 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-green-700">
              <Tag className="w-4 h-4" />
              {totalPrice < discountThreshold ? (
                <span>أضف <span className="font-bold"><FormattedPrice value={discountThreshold - totalPrice} /></span> للحصول على خصم <span className="font-bold"><FormattedPrice value={discountAmount} /></span></span>
              ) : (
                <span>تم تطبيق خصم <span className="font-bold"><FormattedPrice value={discountAmount} /></span> على طلبك!</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-grow w-full sm:w-auto">
                <Input type="text" placeholder="أدخل رمز القسيمة" className="w-full pr-10 rtl:pl-10" />
                <Tag className="absolute right-3 rtl:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button variant="outline" className="w-full sm:w-auto px-6">تطبيق</Button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: cart.length * 0.05 + 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg sticky top-24"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5">ملخص الطلب</h2>
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي ({totalQuantity} منتجات):</span>
                <span className="font-medium text-gray-800"><FormattedPrice value={totalPrice} /></span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الخصم:</span>
                  <span className="font-medium text-red-600">-<FormattedPrice value={appliedDiscount} /></span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3 mt-3">
                <span className="text-lg font-bold text-gray-800">الإجمالي:</span>
                <span className="text-xl font-bold text-blue-600"><FormattedPrice value={finalTotal} /></span>
              </div>
              <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                <span className="block">💡 سيتم حساب سعر الشحن في صفحة إتمام الطلب</span>
                <span className="block">بعد اختيار طريقة الشحن المناسبة</span>
              </div>
            </div>

            <div className="flex items-center mb-5 text-sm text-gray-600 space-x-2 rtl:space-x-reverse">
              <Checkbox
                id="terms"
                checked={isSelectAllChecked}
                onChange={(checked) => setIsSelectAllChecked(Boolean(checked))}
              />
              <label htmlFor="terms" className="cursor-pointer">
                أختر الكل ({totalQuantity} منتجات)
              </label>
            </div>

            <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 text-white">
              <Link to="/checkout">
                <CreditCard className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                الاستمرار في الدفع
              </Link>
            </Button>

            <div className="flex justify-around text-sm text-gray-600 mt-4">
              <Button variant="ghost" size="sm" className="px-2">
                <Heart className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                نقل إلى قائمة الرغبات
              </Button>
              <Button variant="ghost" size="sm" className="px-2">
                <Trash2 className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                حذف
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;