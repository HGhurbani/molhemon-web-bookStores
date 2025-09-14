import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  CreditCard,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  TestTube,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import api from '@/lib/api.js';
import logger from '@/lib/logger.js';

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onMethodSelect, 
  hasPhysicalProducts = true,
  currency = 'SAR' 
}) => {
  const [availableMethods, setAvailableMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState({});
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    swiftCode: '',
    installmentPlan: '',
    nationalId: ''
  });

  useEffect(() => {
    loadPaymentMethods();
  }, [hasPhysicalProducts]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const settings = await api.storeSettings.getStoreSettings();
      
      if (!settings.paymentGateways) {
        setAvailableMethods([]);
        return;
      }

      const methods = [];
      
      // معالجة بوابات الدفع المفعلة
      Object.entries(settings.paymentGateways).forEach(([gatewayId, gateway]) => {
        if (gateway.enabled) {
          // إضافة طرق الدفع المدعومة لكل بوابة
          const supportedMethods = getSupportedMethods(gatewayId);
          
          supportedMethods.forEach(methodType => {
            const method = {
              id: `${gatewayId}_${methodType}`,
              gatewayId: gatewayId,
              type: methodType,
              name: getMethodName(gatewayId, methodType),
              description: getMethodDescription(gatewayId, methodType),
              icon: getMethodIcon(gatewayId, methodType),
              enabled: true,
              testMode: gateway.testMode || false,
              connected: checkGatewayConnection(gateway),
              fees: getMethodFees(gatewayId),
              processingTime: getProcessingTime(gatewayId),
              supportedCurrencies: getSupportedCurrencies(gatewayId),
              features: getMethodFeatures(gatewayId, methodType)
            };
            
            // فلترة الطرق حسب نوع المنتج
            if (shouldShowMethod(method, hasPhysicalProducts)) {
              methods.push(method);
            }
          });
        }
      });

      // إضافة الدفع عند الاستلام للمنتجات المادية
      if (hasPhysicalProducts) {
        methods.push({
          id: 'cash_on_delivery',
          gatewayId: 'manual',
          type: 'cash_on_delivery',
          name: 'الدفع عند الاستلام',
          description: 'الدفع نقداً عند استلام الطلب',
          icon: '💵',
          enabled: true,
          testMode: false,
          connected: true,
          fees: { percentage: 0, fixed: 0 },
          processingTime: 'عند الاستلام',
          supportedCurrencies: ['SAR'],
          features: ['بدون رسوم', 'آمن']
        });
      }

      setAvailableMethods(methods);
    } catch (error) {
      logger.error('Error loading payment methods:', error);
      toast({
        title: 'خطأ في تحميل طرق الدفع',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSupportedMethods = (gatewayId) => {
    const methodMap = {
      stripe: ['credit_card', 'debit_card', 'apple_pay', 'google_pay'],
      paypal: ['paypal'],
      mada: ['debit_card'],
      tabby: ['tabby'],
      tamara: ['tamara'],
      stc_pay: ['stc_pay'],
      urway: ['credit_card', 'debit_card'],
      manual: ['bank_transfer', 'cash_on_delivery']
    };
    
    return methodMap[gatewayId] || [];
  };

  const getMethodName = (gatewayId, methodType) => {
    const names = {
      stripe: {
        credit_card: 'بطاقة ائتمان',
        debit_card: 'بطاقة خصم',
        apple_pay: 'Apple Pay',
        google_pay: 'Google Pay'
      },
      paypal: {
        paypal: 'PayPal'
      },
      mada: {
        debit_card: 'مدى'
      },
      tabby: {
        tabby: 'Tabby'
      },
      tamara: {
        tamara: 'Tamara'
      },
      stc_pay: {
        stc_pay: 'STC Pay'
      },
      urway: {
        credit_card: 'بطاقة ائتمان',
        debit_card: 'بطاقة خصم'
      },
      manual: {
        bank_transfer: 'تحويل بنكي',
        cash_on_delivery: 'الدفع عند الاستلام'
      }
    };
    
    return names[gatewayId]?.[methodType] || methodType;
  };

  const getMethodDescription = (gatewayId, methodType) => {
    const descriptions = {
      stripe: {
        credit_card: 'دفع آمن بالبطاقات الائتمانية',
        debit_card: 'دفع آمن بالبطاقات المدنية',
        apple_pay: 'دفع سريع وآمن عبر Apple Pay',
        google_pay: 'دفع سريع وآمن عبر Google Pay'
      },
      paypal: {
        paypal: 'دفع آمن عبر حساب PayPal'
      },
      mada: {
        debit_card: 'دفع آمن عبر شبكة مدى'
      },
      tabby: {
        tabby: 'ادفع الآن أو لاحقاً مع Tabby'
      },
      tamara: {
        tamara: 'ادفع الآن أو لاحقاً مع Tamara'
      },
      stc_pay: {
        stc_pay: 'دفع آمن عبر STC Pay'
      },
      urway: {
        credit_card: 'دفع آمن بالبطاقات الائتمانية',
        debit_card: 'دفع آمن بالبطاقات المدنية'
      },
      manual: {
        bank_transfer: 'تحويل بنكي آمن',
        cash_on_delivery: 'الدفع عند استلام الطلب'
      }
    };
    
    return descriptions[gatewayId]?.[methodType] || 'طريقة دفع آمنة';
  };

  const getMethodIcon = (gatewayId, methodType) => {
    const icons = {
      stripe: {
        credit_card: 'https://www.pngfind.com/pngs/m/135-1358389_credit-card-logos-visa-hd-png-download.png',
        debit_card: 'https://www.pngfind.com/pngs/m/135-1358389_credit-card-logos-visa-hd-png-download.png',
        apple_pay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png',
        google_pay: 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png'
      },
      paypal: {
        paypal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png'
      },
      mada: {
        debit_card: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mada_Logo.svg'
      },
      tabby: {
        tabby: 'https://www.pfgrowth.com/wp-content/uploads/2023/03/tabby-logo-1.png'
      },
      tamara: {
        tamara: 'https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/254863/En_widget-ed683f0a-6601-4554-8901-71f984a2fcd7.png'
      },
      stc_pay: {
        stc_pay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Stc_pay.svg/1280px-Stc_pay.svg.png'
      },
      urway: {
        credit_card: 'https://www.pngfind.com/pngs/m/135-1358389_credit-card-logos-visa-hd-png-download.png',
        debit_card: 'https://www.pngfind.com/pngs/m/135-1358389_credit-card-logos-visa-hd-png-download.png'
      },
      manual: {
        bank_transfer: 'https://png.pngtree.com/png-vector/20220821/ourmid/pngtree-bank-transfer-icon-house-selected-transfer-vector-png-image_19626578.png',
        cash_on_delivery: '💵'
      }
    };
    
    return icons[gatewayId]?.[methodType] || 'https://www.pngfind.com/pngs/m/135-1358389_credit-card-logos-visa-hd-png-download.png';
  };

  // رابط شعار المزود من الإنترنت
  const getGatewayLogo = (gatewayId) => {
    const logos = {
      stripe: 'https://www.pngfind.com/pngs/m/135-1358389_credit-card-logos-visa-hd-png-download.png',
      paypal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png',
      mada: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mada_Logo.svg',
      tabby: 'https://www.pfgrowth.com/wp-content/uploads/2023/03/tabby-logo-1.png',
      tamara: 'https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/254863/En_widget-ed683f0a-6601-4554-8901-71f984a2fcd7.png',
      stc_pay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Stc_pay.svg/1280px-Stc_pay.svg.png',
      urway: 'https://www.urway.sa/assets/images/logo.svg',
      manual: 'https://png.pngtree.com/png-vector/20220821/ourmid/pngtree-bank-transfer-icon-house-selected-transfer-vector-png-image_19626578.png'
    };
    return logos[gatewayId] || 'https://cdn-icons-png.flaticon.com/512/2830/2830282.png';
  };

  // مكوّن عرض الشعار مع فولباك للأيقونة النصية
  const ProviderLogo = ({ gatewayId, methodType, alt, fallbackIcon, isSelected }) => {
    const [failed, setFailed] = useState(false);
    const logoSrc = getMethodIcon(gatewayId, methodType);
    
    // إذا كان الشعار نص (إيموجي) وليس رابط
    if (logoSrc.startsWith('💵') || logoSrc.startsWith('🏦') || logoSrc.startsWith('🅿️')) {
      return (
        <div className={`text-2xl ml-3 ${isSelected ? 'text-white' : ''}`}>{logoSrc}</div>
      );
    }
    
    if (failed) {
      return (
        <div className={`text-2xl ml-3 ${isSelected ? 'text-white' : ''}`}>{fallbackIcon}</div>
      );
    }
    
    return (
      <div className="ml-3">
        <img
          src={logoSrc}
          alt={alt}
          className={`h-6 w-auto ${isSelected ? 'filter invert brightness-0' : ''}`}
          onError={() => setFailed(true)}
        />
      </div>
    );
  };

  const getMethodFees = (gatewayId) => {
    const fees = {
      stripe: { percentage: 2.9, fixed: 0.30 },
      paypal: { percentage: 3.4, fixed: 0.35 },
      mada: { percentage: 1.5, fixed: 0.50 },
      tabby: { percentage: 0, fixed: 0 },
      tamara: { percentage: 0, fixed: 0 },
      stc_pay: { percentage: 1.0, fixed: 0.25 },
      urway: { percentage: 2.0, fixed: 0.30 },
      manual: { percentage: 0, fixed: 0 }
    };
    
    return fees[gatewayId] || { percentage: 0, fixed: 0 };
  };

  const getProcessingTime = (gatewayId) => {
    const times = {
      stripe: 'فوري',
      paypal: 'فوري',
      mada: 'فوري',
      tabby: 'فوري',
      tamara: 'فوري',
      stc_pay: 'فوري',
      urway: 'فوري',
      manual: '1-3 أيام عمل'
    };
    
    return times[gatewayId] || 'فوري';
  };

  const getSupportedCurrencies = (gatewayId) => {
    const currencies = {
      stripe: ['SAR', 'USD', 'EUR', 'GBP'],
      paypal: ['SAR', 'USD', 'EUR', 'GBP'],
      mada: ['SAR'],
      tabby: ['SAR', 'AED'],
      tamara: ['SAR', 'AED'],
      stc_pay: ['SAR'],
      urway: ['SAR', 'USD', 'EUR'],
      manual: ['SAR']
    };
    
    return currencies[gatewayId] || ['SAR'];
  };

  const getMethodFeatures = (gatewayId, methodType) => {
    const features = {
      stripe: ['3D Secure', 'حماية متقدمة', 'دعم عالمي'],
      paypal: ['حماية المشتري', 'دعم عالمي'],
      mada: ['3D Secure', 'محلي آمن'],
      tabby: ['تقسيط بدون فوائد', 'موافقة سريعة'],
      tamara: ['تقسيط بدون فوائد', 'موافقة سريعة'],
      stc_pay: ['محلي آمن', 'سريع'],
      urway: ['3D Secure', 'متعدد العملات'],
      manual: ['بدون رسوم', 'آمن']
    };
    
    return features[gatewayId] || ['آمن'];
  };

  const shouldShowMethod = (method, hasPhysicalProducts) => {
    // الدفع عند الاستلام متاح فقط للمنتجات المادية
    if (method.type === 'cash_on_delivery' && !hasPhysicalProducts) {
      return false;
    }
    
    // طرق الدفع الأخرى متاحة للجميع
    return true;
  };

  const checkGatewayConnection = (gateway) => {
    if (!gateway.config) return false;
    
    const requiredFields = {
      stripe: ['publishableKey', 'secretKey'],
      paypal: ['clientId', 'clientSecret'],
      mada: ['merchantId', 'apiKey'],
      tabby: ['publicKey', 'secretKey'],
      tamara: ['publicKey', 'secretKey'],
      stc_pay: ['merchantId', 'apiKey'],
      urway: ['merchantId', 'apiKey'],
      manual: []
    };
    
    const fields = requiredFields[gateway.id] || [];
    return fields.every(field => 
      gateway.config[field] && gateway.config[field].trim() !== ''
    );
  };

  const toggleSecretVisibility = (methodId) => {
    setShowSecrets(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }));
  };

  const handleMethodSelect = (method) => {
    onMethodSelect(method);
    
    // إظهار نموذج إدخال البيانات لطرق الدفع التي تتطلب بيانات إضافية
    const methodsRequiringData = [
      'credit_card', 'debit_card', 'apple_pay', 'google_pay', 
      'paypal', 'tabby', 'tamara', 'stc_pay', 'bank_transfer'
    ];
    
    if (methodsRequiringData.includes(method.type)) {
      setShowPaymentForm(true);
      // الانتقال إلى قسم إدخال البيانات
      setTimeout(() => {
        const formElement = document.getElementById('payment-form-section');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setShowPaymentForm(false);
      // إظهار رسالة تأكيد للطرق التي لا تتطلب بيانات إضافية
      toast({
        title: 'تم اختيار طريقة الدفع',
        description: `تم اختيار ${method.name} بنجاح`,
        variant: 'success'
      });
    }
  };

  const handlePaymentFormSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات حسب نوع طريقة الدفع
    const requiredFields = getRequiredFields(selectedMethod.type);
    const missingFields = requiredFields.filter(field => !paymentFormData[field]);
    
    if (missingFields.length > 0) {
      const fieldNames = {
        cardNumber: 'رقم البطاقة',
        expiryDate: 'تاريخ الانتهاء',
        cvv: 'رمز الأمان',
        cardholderName: 'اسم حامل البطاقة',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        bankName: 'اسم البنك',
        accountNumber: 'رقم الحساب',
        iban: 'رقم الآيبان',
        installmentPlan: 'خطة التقسيط'
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field] || field).join('، ');
      
      toast({
        title: 'بيانات الدفع مطلوبة',
        description: `يرجى إدخال: ${missingFieldNames}`,
        variant: 'destructive'
      });
      return;
    }
    
    // إضافة بيانات الدفع إلى طريقة الدفع المختارة
    const methodWithPaymentData = {
      ...selectedMethod,
      paymentData: paymentFormData
    };
    
    onMethodSelect(methodWithPaymentData);
    setShowPaymentForm(false);
    
    toast({
      title: 'تم حفظ بيانات الدفع',
      description: 'تم حفظ بيانات الدفع بنجاح',
      variant: 'success'
    });
  };

  const handlePaymentFormCancel = () => {
    setShowPaymentForm(false);
    setPaymentFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      email: '',
      phone: '',
      bankName: '',
      accountNumber: '',
      iban: '',
      swiftCode: '',
      installmentPlan: '',
      nationalId: ''
    });
  };

  // دالة لتحديد الحقول المطلوبة لكل طريقة دفع
  const getRequiredFields = (methodType) => {
    const fieldConfigs = {
      credit_card: ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'],
      debit_card: ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'],
      paypal: ['email'],
      stc_pay: ['phone'],
      tabby: ['phone', 'email', 'installmentPlan'],
      tamara: ['phone', 'email', 'installmentPlan'],
      bank_transfer: ['bankName', 'accountNumber', 'iban'],
      apple_pay: ['email', 'phone'],
      google_pay: ['email', 'phone']
    };
    
    return fieldConfigs[methodType] || [];
  };

  // دالة للحصول على عنوان النموذج
  const getFormTitle = (methodType) => {
    const titles = {
      credit_card: 'إدخال بيانات البطاقة الائتمانية',
      debit_card: 'إدخال بيانات البطاقة المدنية',
      paypal: 'إدخال بيانات PayPal',
      stc_pay: 'إدخال بيانات STC Pay',
      tabby: 'إدخال بيانات Tabby',
      tamara: 'إدخال بيانات Tamara',
      bank_transfer: 'إدخال بيانات التحويل البنكي',
      apple_pay: 'إدخال بيانات Apple Pay',
      google_pay: 'إدخال بيانات Google Pay'
    };
    
    return titles[methodType] || 'إدخال بيانات الدفع';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (availableMethods.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طرق دفع متاحة</h3>
          <p className="text-gray-600 mb-4">
            يرجى تفعيل طرق الدفع من لوحة التحكم أولاً
          </p>
          <Button
            onClick={() => window.open('/dashboard?section=payment-methods', '_blank')}
            variant="outline"
          >
            <CreditCard className="w-4 h-4 ml-2" />
            إعداد طرق الدفع
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">اختر طريقة الدفع</h3>
      
      <div className="space-y-3">
        {availableMethods.map((method) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${!method.connected ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => method.connected && handleMethodSelect(method)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ProviderLogo 
                  gatewayId={method.gatewayId}
                  methodType={method.type}
                  alt={method.name}
                  fallbackIcon={method.icon}
                  isSelected={selectedMethod?.id === method.id}
                />
                <div>
                  <h4 className={`${selectedMethod?.id === method.id ? 'text-white' : 'text-gray-900'} font-medium`}>{method.name}</h4>
                  <p className={`text-sm ${selectedMethod?.id === method.id ? 'text-white' : 'text-gray-600'}`}>{method.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {selectedMethod?.id === method.id && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                
                {method.testMode && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <TestTube className="w-3 h-3 ml-1" />
                    اختبار
                  </span>
                )}
                
                {!method.connected && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircle className="w-3 h-3 ml-1" />
                    غير مُعد
                  </span>
                )}
              </div>
            </div>
            
            {/* Method Details */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className={`w-4 h-4 ml-2 ${selectedMethod?.id === method.id ? 'text-white' : ''}`} />
                <span className={`${selectedMethod?.id === method.id ? 'text-white' : ''}`}>{method.processingTime}</span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className={`w-4 h-4 ml-2 ${selectedMethod?.id === method.id ? 'text-white' : ''}`} />
                <span className={`${selectedMethod?.id === method.id ? 'text-white' : ''}`}>
                  {method.fees.percentage > 0 
                    ? `${method.fees.percentage}% + ${method.fees.fixed} ${currency}`
                    : 'بدون رسوم'
                  }
                </span>
              </div>
              
              <div className="flex items-center">
                <Shield className={`w-4 h-4 ml-2 ${selectedMethod?.id === method.id ? 'text-white' : ''}`} />
                <span className={`${selectedMethod?.id === method.id ? 'text-white' : ''}`}>{method.features[0]}</span>
              </div>
            </div>
            
            {/* Features */}
            {method.features.length > 1 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {method.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {feature}
                    </span>
                  ))}
                  {method.features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      +{method.features.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {selectedMethod && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 ml-2" />
            <span className="text-sm font-medium text-green-800">
              تم اختيار: {selectedMethod.name}
            </span>
          </div>
        </div>
      )}

      {/* نموذج إدخال بيانات الدفع */}
      <AnimatePresence>
        {showPaymentForm && selectedMethod && (
          <motion.div
            id="payment-form-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {getFormTitle(selectedMethod.type)}
            </h4>
            
            <form onSubmit={handlePaymentFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* حقول البطاقات الائتمانية والمدنية */}
                {(selectedMethod.type === 'credit_card' || selectedMethod.type === 'debit_card') && (
                  <>
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">رقم البطاقة *</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentFormData.cardNumber}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryDate">تاريخ الانتهاء *</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={paymentFormData.expiryDate}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">رمز الأمان (CVV) *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={paymentFormData.cvv}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, cvv: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="cardholderName">اسم حامل البطاقة *</Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        placeholder="الاسم كما هو مكتوب على البطاقة"
                        value={paymentFormData.cardholderName}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                {/* حقول PayPal */}
                {selectedMethod.type === 'paypal' && (
                  <div className="md:col-span-2">
                    <Label htmlFor="email">البريد الإلكتروني لـ PayPal *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={paymentFormData.email}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                )}

                {/* حقول STC Pay */}
                {selectedMethod.type === 'stc_pay' && (
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">رقم الهاتف لـ STC Pay *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+966 50 123 4567"
                      value={paymentFormData.phone}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                )}

                {/* حقول Tabby و Tamara */}
                {(selectedMethod.type === 'tabby' || selectedMethod.type === 'tamara') && (
                  <>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={paymentFormData.phone}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={paymentFormData.email}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="installmentPlan">خطة التقسيط *</Label>
                      <select
                        id="installmentPlan"
                        value={paymentFormData.installmentPlan}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, installmentPlan: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">اختر خطة التقسيط</option>
                        <option value="3">3 أقساط</option>
                        <option value="6">6 أقساط</option>
                        <option value="12">12 قسط</option>
                      </select>
                    </div>
                  </>
                )}

                {/* حقول التحويل البنكي */}
                {selectedMethod.type === 'bank_transfer' && (
                  <>
                    <div>
                      <Label htmlFor="bankName">اسم البنك *</Label>
                      <Input
                        id="bankName"
                        type="text"
                        placeholder="مثال: البنك الأهلي السعودي"
                        value={paymentFormData.bankName}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accountNumber">رقم الحساب *</Label>
                      <Input
                        id="accountNumber"
                        type="text"
                        placeholder="1234567890"
                        value={paymentFormData.accountNumber}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="iban">رقم الآيبان *</Label>
                      <Input
                        id="iban"
                        type="text"
                        placeholder="SA1234567890123456789012"
                        value={paymentFormData.iban}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, iban: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                {/* حقول Apple Pay و Google Pay */}
                {(selectedMethod.type === 'apple_pay' || selectedMethod.type === 'google_pay') && (
                  <>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={paymentFormData.email}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={paymentFormData.phone}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                {/* حقول إضافية مشتركة */}
                {(selectedMethod.type === 'credit_card' || selectedMethod.type === 'debit_card' || selectedMethod.type === 'apple_pay' || selectedMethod.type === 'google_pay') && (
                  <>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={paymentFormData.email}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={paymentFormData.phone}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePaymentFormCancel}
                >
                  إلغاء
                </Button>
                <Button type="submit">
                  حفظ بيانات الدفع
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethodSelector;
