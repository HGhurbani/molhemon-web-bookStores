import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  CreditCard,
  Lock,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import paymentApi, { paymentUtils } from '@/lib/paymentApi.js';

const PaymentProcessor = ({ 
  orderData, 
  onPaymentSuccess, 
  onPaymentError, 
  buyerAccount = null,
  availableMethods = []
}) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [savedMethods, setSavedMethods] = useState([]);
  const [useSavedMethod, setUseSavedMethod] = useState(false);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState(null);

  useEffect(() => {
    if (buyerAccount) {
      loadSavedPaymentMethods();
    }
  }, [buyerAccount]);

  const loadSavedPaymentMethods = async () => {
    try {
      const methods = await paymentApi.getBuyerPaymentMethods(buyerAccount.id);
      setSavedMethods(methods);
    } catch (error) {
      console.error('Error loading saved payment methods:', error);
    }
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPaymentData({});
    setShowCardForm(false);
    setUseSavedMethod(false);
    setSelectedSavedMethod(null);
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePaymentData = () => {
    if (!selectedMethod) {
      toast({ title: 'يرجى اختيار طريقة دفع', variant: 'destructive' });
      return false;
    }

    if (useSavedMethod && !selectedSavedMethod) {
      toast({ title: 'يرجى اختيار طريقة دفع محفوظة', variant: 'destructive' });
      return false;
    }

    if (!useSavedMethod) {
      // Validate card data if not using saved method
      if (['visa', 'mastercard', 'amex'].includes(selectedMethod)) {
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
          toast({ title: 'يرجى إدخال جميع بيانات البطاقة', variant: 'destructive' });
          return false;
        }
      }
    }

    return true;
  };

  const processPayment = async () => {
    if (!validatePaymentData()) return;

    setIsProcessing(true);
    try {
      let paymentIntent;

      if (useSavedMethod && selectedSavedMethod) {
        // Use saved payment method
        paymentIntent = await paymentApi.createPaymentIntent({
          ...orderData,
          paymentMethodId: selectedSavedMethod.id,
          useSavedMethod: true
        });
      } else {
        // Create new payment intent
        paymentIntent = await paymentApi.createPaymentIntent({
          ...orderData,
          paymentMethod: selectedMethod,
          paymentData
        });
      }

      // Confirm payment
      const result = await paymentApi.confirmPayment(
        paymentIntent.id, 
        useSavedMethod ? selectedSavedMethod.id : null
      );

      if (result.status === 'succeeded') {
        // Save payment method if requested
        if (buyerAccount && paymentData.saveForFuture) {
          await paymentApi.saveBuyerPaymentMethod(buyerAccount.id, {
            type: selectedMethod,
            data: paymentData
          });
        }

        toast({ title: 'تم الدفع بنجاح!' });
        onPaymentSuccess(result);
      } else {
        throw new Error('فشل في معالجة الدفع');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({ 
        title: 'فشل في معالجة الدفع', 
        description: error.message,
        variant: 'destructive' 
      });
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getMethodIcon = (method) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      paypal: '🅿️',
      applePay: '🍎',
      googlePay: '📱',
      mada: '💳',
      stcPay: '📱',
      bankTransfer: '🏦',
      cashOnDelivery: '💵',
      bitcoin: '₿',
      ethereum: 'Ξ'
    };
    return icons[method] || '💳';
  };

  const getMethodName = (method) => {
    const names = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      paypal: 'PayPal',
      applePay: 'Apple Pay',
      googlePay: 'Google Pay',
      mada: 'مدى',
      stcPay: 'STC Pay',
      bankTransfer: 'تحويل بنكي',
      cashOnDelivery: 'الدفع عند الاستلام',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum'
    };
    return names[method] || method;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Payment Methods Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">اختر طريقة الدفع</h3>
        
        {/* Saved Payment Methods */}
        {buyerAccount && savedMethods.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
              <input
                type="checkbox"
                id="useSavedMethod"
                checked={useSavedMethod}
                onChange={(e) => setUseSavedMethod(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="useSavedMethod">استخدام طريقة دفع محفوظة</Label>
            </div>
            
            {useSavedMethod && (
              <div className="space-y-2">
                {savedMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedSavedMethod?.id === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSavedMethod(method)}
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="text-xl">{getMethodIcon(method.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium">{getMethodName(method.type)}</p>
                        <p className="text-sm text-gray-500">
                          {method.maskedData || 'طريقة دفع محفوظة'}
                        </p>
                      </div>
                      {selectedSavedMethod?.id === method.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Available Payment Methods */}
        {!useSavedMethod && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableMethods.map((method) => (
              <div
                key={method}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-2xl">{getMethodIcon(method)}</span>
                  <div>
                    <p className="font-medium">{getMethodName(method)}</p>
                    <p className="text-sm text-gray-500">
                      {method === 'cashOnDelivery' ? 'الدفع عند الاستلام' : 'دفع آمن'}
                    </p>
                  </div>
                  {selectedMethod === method && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Form */}
      {selectedMethod && !useSavedMethod && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">تفاصيل الدفع</h3>
          
          {/* Credit Card Form */}
          {['visa', 'mastercard', 'amex'].includes(selectedMethod) && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <Input
                  id="cardNumber"
                  value={paymentData.cardNumber || ''}
                  onChange={(e) => handlePaymentDataChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate || ''}
                    onChange={(e) => handlePaymentDataChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    value={paymentData.cvv || ''}
                    onChange={(e) => handlePaymentDataChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardholderName">اسم حامل البطاقة</Label>
                <Input
                  id="cardholderName"
                  value={paymentData.cardholderName || ''}
                  onChange={(e) => handlePaymentDataChange('cardholderName', e.target.value)}
                  placeholder="اسم حامل البطاقة"
                />
              </div>
              
              {buyerAccount && (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="saveForFuture"
                    checked={paymentData.saveForFuture || false}
                    onChange={(e) => handlePaymentDataChange('saveForFuture', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="saveForFuture">حفظ البطاقة للاستخدام المستقبلي</Label>
                </div>
              )}
            </div>
          )}

          {/* PayPal Form */}
          {selectedMethod === 'paypal' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🅿️</div>
              <p className="text-gray-600 mb-4">
                سيتم توجيهك إلى PayPal لإكمال عملية الدفع
              </p>
              <Button
                onClick={processPayment}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                    جاري التوجيه...
                  </>
                ) : (
                  'المتابعة إلى PayPal'
                )}
              </Button>
            </div>
          )}

          {/* Digital Wallets */}
          {['applePay', 'googlePay', 'mada', 'stcPay'].includes(selectedMethod) && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{getMethodIcon(selectedMethod)}</div>
              <p className="text-gray-600 mb-4">
                سيتم فتح {getMethodName(selectedMethod)} لإكمال عملية الدفع
              </p>
              <Button
                onClick={processPayment}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                    جاري الفتح...
                  </>
                ) : (
                  `استخدام ${getMethodName(selectedMethod)}`
                )}
              </Button>
            </div>
          )}

          {/* Bank Transfer */}
          {selectedMethod === 'bankTransfer' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">تفاصيل الحساب البنكي</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>اسم البنك:</strong> بنك ملهمون</p>
                  <p><strong>رقم الحساب:</strong> 1234567890</p>
                  <p><strong>IBAN:</strong> SA0380000000608010167519</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                سيتم إرسال تفاصيل التحويل إلى بريدك الإلكتروني
              </p>
            </div>
          )}

          {/* Cash on Delivery */}
          {selectedMethod === 'cashOnDelivery' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💵</div>
              <p className="text-gray-600 mb-4">
                الدفع عند استلام الطلب
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  سيتم إضافة رسوم إضافية للدفع عند الاستلام
                </p>
              </div>
            </div>
          )}

          {/* Cryptocurrency */}
          {['bitcoin', 'ethereum'].includes(selectedMethod) && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">عنوان المحفظة</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>العملة:</strong> {selectedMethod === 'bitcoin' ? 'Bitcoin (BTC)' : 'Ethereum (ETH)'}</p>
                  <p><strong>العنوان:</strong> {selectedMethod === 'bitcoin' ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' : '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                سيتم إرسال تفاصيل الدفع إلى بريدك الإلكتروني
              </p>
            </div>
          )}
        </div>
      )}

      {/* Payment Summary */}
      {orderData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">ملخص الدفع</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{paymentUtils.formatAmount(orderData.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <span>{paymentUtils.formatAmount(orderData.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>الضريبة</span>
              <span>{paymentUtils.formatAmount(orderData.tax)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>المجموع الكلي</span>
                <span>{paymentUtils.formatAmount(orderData.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Payment Button */}
      {selectedMethod && (
        <div className="flex justify-end">
          <Button
            onClick={processPayment}
            disabled={isProcessing || (!useSavedMethod && !selectedMethod)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                جاري معالجة الدفع...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                إتمام الدفع
              </>
            )}
          </Button>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Lock className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">
            جميع المعاملات محمية بتقنيات التشفير المتقدمة
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentProcessor; 