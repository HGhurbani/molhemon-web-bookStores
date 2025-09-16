import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import PaymentMethodSelector from '@/components/PaymentMethodSelector.jsx';
import ProgressBar from '@/components/ProgressBar.jsx';
import { useCurrency } from '@/lib/currencyContext.jsx';
import { jwtAuthManager } from '@/lib/jwtAuth.js';
import { auth } from '@/lib/firebase.js';
import { errorHandler } from '@/lib/errorHandler.js';
import api from '@/lib/api.js';
import unifiedPaymentApi from '@/lib/api/unifiedPaymentApi.js';
import firebaseApi from '@/lib/firebaseApi.js';
import logger from '@/lib/logger.js';
import '@/lib/test/checkoutTest.js'; // استيراد ملف الاختبار
import {
  Lock,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  User,
  Check,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Globe
} from 'lucide-react';

const CheckoutPage = ({ cart, setCart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  
  // دالة تنسيق السعر
  const formatPrice = (amount) => {
    if (typeof amount !== 'number') return '0';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency?.code || 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // حالة المستخدم الحالي
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // بيانات الطلب
  const [orderData, setOrderData] = useState({
    customerId: null,
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    },
    shippingAddress: null,
    billingAddress: null,
    paymentMethod: null,
    shippingMethod: null,
    notes: ''
  });

  // إعدادات المتجر
  const [storeSettings, setStoreSettings] = useState(null);
  
  // بيانات العميل المحفوظة
  const [customerData, setCustomerData] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);

  // خيارات الشحن والدفع المتاحة
  const [availableShippingMethods, setAvailableShippingMethods] = useState([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);

  // حالة النماذج
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  // حالة التحميل والمعالجة
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // متغير لتأخير الحفظ وحالة الحفظ
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // حالة التقدم في خطوات الطلب
  const steps = [
    { id: 'personal', label: 'المعلومات الشخصية' },
    { id: 'address', label: 'العنوان' },
    { id: 'payment', label: 'الدفع' },
    { id: 'review', label: 'المراجعة' }
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps] = useState(steps.length);

  // حساب إجمالي الطلب
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = (() => {
    // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
    if (!orderData.shippingMethod) {
      logger.debug('No shipping method selected');
      return 0;
    }
    
    logger.debug('CheckoutPage - Shipping method:', orderData.shippingMethod);
    logger.debug('CheckoutPage - Shipping method keys:', Object.keys(orderData.shippingMethod));
    
    const isPickup = orderData.shippingMethod.id === 'pickup' || 
                    orderData.shippingMethod.name === 'استلام من المتجر' ||
                    orderData.shippingMethod.type === 'pickup';
    
    logger.debug('CheckoutPage - Is pickup:', isPickup);
    logger.debug('CheckoutPage - Original cost:', orderData.shippingMethod.cost);
    
    const finalCost = isPickup ? 0 : (orderData.shippingMethod.cost || 0);
    logger.debug('CheckoutPage - Final shipping cost:', finalCost);
    
    return finalCost;
  })();
  const taxAmount = storeSettings?.tax?.enabled ? (subtotal * (storeSettings.tax.rate / 100)) : 0;
  const discountAmount = orderData.discountAmount || 0;
  const total = subtotal - discountAmount + shippingCost + taxAmount;
  
  logger.debug('CheckoutPage - Total calculation:', {
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    total
  });

  // تحقق من وجود منتجات فيزيائية (تحتاج شحن)
  const hasPhysicalProducts = cart.some(item => item.type === 'physical');

  // دوال مساعدة لطرق الدفع
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
        credit_card: '💳',
        debit_card: '💳',
        apple_pay: '🍎',
        google_pay: '📱'
      },
      paypal: {
        paypal: '🅿️'
      },
      mada: {
        debit_card: '💳'
      },
      tabby: {
        tabby: '📱'
      },
      tamara: {
        tamara: '🛍️'
      },
      stc_pay: {
        stc_pay: '📱'
      },
      urway: {
        credit_card: '💳',
        debit_card: '💳'
      },
      manual: {
        bank_transfer: '🏦',
        cash_on_delivery: '💵'
      }
    };
    
    return icons[gatewayId]?.[methodType] || '💳';
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

  // دالة حساب تكلفة الشحن بناءً على الوزن والطريقة
  const calculateShippingCost = (totalWeight, shippingMethodId) => {
    const shippingMethod = availableShippingMethods.find(method => method.id === shippingMethodId);
    if (!shippingMethod) return 0;

    // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
    const isPickup = shippingMethodId === 'pickup' || 
                    shippingMethod.name === 'استلام من المتجر' ||
                    shippingMethod.type === 'pickup';
    
    if (isPickup) {
      logger.debug('Pickup method detected in calculateShippingCost, returning 0');
      return 0;
    }

    // تكلفة أساسية + تكلفة لكل كيلو
    const baseCost = shippingMethod.cost;
    const costPerKg = 5; // يمكن جعلها قابلة للتخصيص من إعدادات الشحن
    
    return baseCost + (totalWeight * costPerKg);
  };

  // تهيئة نظام المدفوعات الموحد
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        
        // جلب إعدادات المتجر
        const settings = await api.storeSettings.getStoreSettings();
        logger.debug('Store settings loaded:', settings);
        
        setStoreSettings(settings);
        
        // تحميل طرق الدفع من النظام الجديد
        const paymentMethods = [];
        
        if (settings.paymentGateways) {
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
                  paymentMethods.push(method);
                }
              });
            }
          });
        }

        // إضافة الدفع عند الاستلام للمنتجات المادية
        if (hasPhysicalProducts) {
          paymentMethods.push({
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

        setAvailablePaymentMethods(paymentMethods);
        logger.debug('Payment methods loaded:', paymentMethods);
        
        // جلب طرق الشحن المتاحة (فقط للمنتجات الفيزيائية)
        if (hasPhysicalProducts) {
          try {
            const shippingMethods = await api.storeSettings.getAvailableShippingMethods();
            setAvailableShippingMethods(shippingMethods);
          } catch (error) {
            logger.error('Error loading shipping methods:', error);
            // استخدام طرق شحن افتراضية في حالة الفشل
            const defaultShippingMethods = [
              {
                id: 'standard',
                name: 'الشحن العادي',
                description: 'توصيل خلال 3-5 أيام عمل',
                cost: 25,
                estimatedDays: '3-5',
                enabled: true,
                features: ['تتبع الشحن', 'تأمين الشحن']
              },
              {
                id: 'express',
                name: 'الشحن السريع',
                description: 'توصيل سريع خلال 1-2 أيام عمل',
                cost: 50,
                estimatedDays: '1-2',
                enabled: true,
                features: ['تتبع الشحن', 'توصيل سريع']
              }
            ];
            setAvailableShippingMethods(defaultShippingMethods);
          }
        }
        
        // جلب بيانات العميل إذا كان مسجل دخول
        const user = auth.currentUser;
        if (user) {
          try {
            let customerData = await api.getCustomerData(user.uid);
            if (!customerData) {
              customerData = await api.createCustomer({
                uid: user.uid,
                name: user.displayName || '',
                email: user.email || '',
                phone: user.phoneNumber || ''
              });
            }
            
            if (customerData) {
              setOrderData(prev => ({
                ...prev,
                customerId: user.uid,
                customerInfo: {
                  name: customerData.name || user.displayName || '',
                  email: customerData.email || user.email || '',
                  phone: customerData.phone || user.phoneNumber || ''
                }
              }));
            }
          } catch (error) {
            logger.error('Failed to load/create customer data:', error);
            setOrderData(prev => ({
              ...prev,
              customerId: user.uid,
              customerInfo: {
                name: user.displayName || '',
                email: user.email || '',
                phone: user.phoneNumber || ''
              }
            }));
          }
          
          // جلب العناوين المحفوظة
          try {
            const addresses = await api.getCustomerAddresses(user.uid);
            setSavedAddresses(addresses || []);
          } catch (error) {
            setSavedAddresses([]);
          }
          
          // جلب طرق الدفع المحفوظة
          try {
            const paymentMethods = await api.getCustomerPaymentMethods(user.uid);
            setSavedPaymentMethods(paymentMethods || []);
          } catch (error) {
            setSavedPaymentMethods([]);
          }
        } else {
          // Guest checkout - generate temporary customerId
          const tempCustomerId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          setOrderData(prev => ({
            ...prev,
            customerId: tempCustomerId
          }));
        }
      } catch (error) {
        logger.error('Failed to initialize checkout:', error);
        toast({
          title: 'فشل في تهيئة صفحة الدفع',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [hasPhysicalProducts]);

  // useEffect للتحقق من وجود طرق دفع متاحة
  useEffect(() => {
          if (availablePaymentMethods.length === 0) {
      logger.debug('No payment methods available, adding emergency methods');
            const emergencyMethods = [];
            
      // إضافة الدفع عند الاستلام للمنتجات المادية
      if (hasPhysicalProducts) {
              emergencyMethods.push({
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
      
      setAvailablePaymentMethods(emergencyMethods);
    }
  }, [availablePaymentMethods.length, hasPhysicalProducts]);

  // مراقبة حالة المصادقة وتحديث البيانات
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && isLoggedIn) {
        logger.debug('Firebase auth state changed in checkout:', firebaseUser);
        
        // تحديث البيانات من Firebase إذا كانت متوفرة
        const updatedCustomerInfo = {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || ''
        };
        
        logger.debug('Updating customer info from Firebase:', updatedCustomerInfo);
        setOrderData(prev => ({
          ...prev,
          customerInfo: {
            ...prev.customerInfo,
            ...updatedCustomerInfo
          }
        }));
        
        // تحديث البيانات في JWT أيضاً
        if (currentUser) {
          const updatedJWTData = {
            ...currentUser,
            displayName: firebaseUser.displayName || currentUser.displayName,
            email: firebaseUser.email || currentUser.email,
            phoneNumber: firebaseUser.phoneNumber || currentUser.phoneNumber
          };
          
          try {
            jwtAuthManager.updateUserData(updatedJWTData);
            logger.debug('JWT data updated in checkout successfully');
          } catch (error) {
            logger.error('Failed to update JWT data in checkout:', error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn, currentUser]);

  // تنظيف timeout عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);

      // التحقق من حالة المصادقة
      const user = jwtAuthManager.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        
        // محاولة جلب البيانات من Firebase مباشرة إذا كانت البيانات المحفوظة فارغة
        let displayName = user.displayName;
        let phoneNumber = user.phoneNumber;
        
        // التحقق من Firebase auth للحصول على أحدث البيانات
        if (auth.currentUser) {
          displayName = auth.currentUser.displayName || displayName || '';
          phoneNumber = auth.currentUser.phoneNumber || phoneNumber || '';
          logger.debug('Got data from Firebase auth:', { displayName, phoneNumber });
        }
        
        // تعبئة البيانات الأساسية من المستخدم
        logger.debug('User data for checkout:', { displayName, email: user.email, phoneNumber });
        setOrderData(prev => ({
          ...prev,
          customerId: user.uid,
          customerInfo: {
            name: displayName || '',
            email: user.email || '',
            phone: phoneNumber || ''
          }
        }));
      } else {
        // إذا لم يكن هناك مستخدم، انتظار قليلاً ثم المحاولة مرة أخرى
        logger.debug('No user found, waiting for auth...');
        setTimeout(() => {
          const retryUser = jwtAuthManager.getCurrentUser();
          if (retryUser) {
            initializeCheckout();
          } else {
            logger.debug('Still no user, redirecting to home');
            navigate('/');
          }
        }, 2000);
        return;
      }

      // تحميل إعدادات المتجر
      try {
        const settings = await api.storeSettings.getStoreSettings();
        setStoreSettings(settings);
      } catch (error) {
        logger.error('Error loading store settings:', error);
        // لا نوقف العملية إذا فشل تحميل الإعدادات
        // يمكن أن يكون هناك مشكلة في الاتصال أو الخادم
      }

      // تحميل بيانات العميل إذا كان مسجل دخول (تم تحميلها بالفعل في useEffect السابق)
      if (user && customerData) {
        // تحديث العناوين وطرق الدفع من بيانات العميل المحملة
        setSavedAddresses(customerData.addresses || []);
        setSavedPaymentMethods(customerData.paymentMethods || []);

        // تعبئة البيانات من الملف الشخصي إذا كانت متوفرة
        logger.debug('Customer data already loaded:', customerData);
        if (customerData && (customerData.firstName || customerData.lastName || customerData.displayName)) {
          const customerName = (customerData.firstName || customerData.displayName || '') + ' ' + (customerData.lastName || '');
          const customerPhone = customerData.phone || (auth.currentUser?.phoneNumber) || '';
          
          logger.debug('Using customer profile data:', { customerName, customerPhone });
          setOrderData(prev => ({
            ...prev,
            customerInfo: {
              name: customerName.trim() || prev.customerInfo.name,
              email: customerData.email || user.email,
              phone: customerPhone || prev.customerInfo.phone
            },
            shippingAddress: customerData.addresses?.find(addr => addr.isDefault && addr.type === 'shipping'),
            billingAddress: customerData.addresses?.find(addr => addr.isDefault && addr.type === 'billing'),
            paymentMethod: customerData.paymentMethods?.find(pm => pm.isDefault)
          }));
        } else {
          // إذا لم تكن بيانات العميل متوفرة، استخدم البيانات الأساسية من المستخدم
          logger.debug('Customer profile incomplete, using basic user data');
        }
      }

      // تحميل طرق الدفع المتاحة من النظام الموحد
      try {
        const orderData = {
          amount: total,
          currency: currency?.code || 'SAR',
          country: 'SA'
        };

        const response = await unifiedPaymentApi.getAvailablePaymentMethods(orderData);
        
        if (response.success) {
          // تحويل البيانات إلى التنسيق المطلوب للمكون
          const convertedMethods = response.methods.map(method => ({
            id: method.provider,
            name: method.displayName,
            description: method.description,
            gateway: method.provider,
            logo: null,
            icon: method.icon,
            enabled: true,
            processingTime: 'فوري',
            installmentOptions: method.features?.installments ? ['3', '6', '12'] : null,
            fees: method.fees
          }));
          // إضافة طرق الدفع من إعدادات المتجر إذا كانت متاحة
          const storePaymentMethods = [];
          if (storeSettings?.paymentMethods) {
            Object.values(storeSettings.paymentMethods).forEach(method => {
              if (method.enabled) {
                storePaymentMethods.push({
                  id: method.id,
                  name: method.name,
                  description: method.description,
                  gateway: method.gateway,
                  logo: method.logo,
                  icon: method.icon,
                  enabled: method.enabled,
                  processingTime: method.processingTime,
                  installmentOptions: method.installmentOptions,
                  fees: method.fees
                });
              }
            });
          }
          
          // دمج طرق الدفع من النظام الموحد مع طرق الدفع من إعدادات المتجر
          const allMethods = [...convertedMethods];
          storePaymentMethods.forEach(storeMethod => {
            if (!allMethods.find(m => m.id === storeMethod.id)) {
              allMethods.push(storeMethod);
            }
          });
          
          setAvailablePaymentMethods(allMethods);
          logger.debug('Available payment methods after conversion:', allMethods);
          logger.debug('Cash on Delivery found:', allMethods.find(m => m.id === 'cashOnDelivery' || m.id === 'cash_on_delivery'));
        } else {
          logger.error('Failed to load payment methods:', response.error);
          // في حالة فشل تحميل طرق الدفع، أضف طريقة الدفع عند الاستلام كخيار احتياطي (فقط للمنتجات المادية)
          const fallbackMethods = [];
          if (storeSettings?.paymentMethods?.cash_on_delivery?.enabled && hasPhysicalProducts) {
            fallbackMethods.push({
              id: 'cash_on_delivery',
              name: 'الدفع عند الاستلام',
              description: 'الدفع عند استلام الطلب',
              gateway: 'manual',
              logo: null,
              icon: '💵',
              enabled: true,
              processingTime: 'upon delivery',
              installmentOptions: null,
              fees: { percentage: 0, fixed: 5 }
            });
          }
          setAvailablePaymentMethods(fallbackMethods);
          logger.debug('Using fallback payment methods in second location:', fallbackMethods);
        }
              } catch (error) {
          logger.error('Error loading payment methods:', error);
          // في حالة فشل تحميل طرق الدفع، أضف طريقة الدفع عند الاستلام كخيار احتياطي (فقط للمنتجات المادية)
          const fallbackMethods = hasPhysicalProducts ? [{
            id: 'cash_on_delivery',
            name: 'الدفع عند الاستلام',
            description: 'الدفع عند استلام الطلب',
            gateway: 'manual',
            logo: null,
            icon: '💵',
            enabled: true,
            processingTime: 'upon delivery',
            installmentOptions: null,
            fees: { percentage: 0, fixed: 5 }
          }] : [];
          setAvailablePaymentMethods(fallbackMethods);
          logger.debug('Using emergency fallback payment methods:', fallbackMethods);
        }

      // تحميل طرق الشحن المتاحة (فقط للمنتجات الفيزيائية)
      if (hasPhysicalProducts) {
        try {
          // حساب الوزن الإجمالي للمنتجات الفيزيائية
          const totalWeight = cart
            .filter(item => item.type === 'physical')
            .reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0); // وزن افتراضي 0.5 كجم للكتاب
          
          // استخدام البلد الافتراضي إذا لم يتم تحديد عنوان الشحن بعد
          const country = orderData.shippingAddress?.country || 'SA';
          
          const shippingMethods = await api.storeSettings.getAvailableShippingMethods(
            country,
            subtotal,
            totalWeight
          );
          
          logger.debug('Loaded shipping methods:', shippingMethods);
          setAvailableShippingMethods(shippingMethods);
        } catch (error) {
          logger.error('Error loading shipping methods:', error);
          // لا نوقف العملية إذا فشل تحميل طرق الشحن
          // يمكن أن يكون هناك مشكلة في الاتصال أو الخادم
        }
      }

    } catch (error) {
      logger.error('Error in initializeCheckout:', error);
      
      // عرض رسالة الخطأ فقط إذا كان هناك خطأ حقيقي
      if (error.message && !error.message.includes('auth/user-not-found') && !error.message.includes('auth/invalid-email')) {
        const errorObject = errorHandler.handleError(error, 'checkout:initialize');
        setTimeout(() => {
          toast({
            title: 'خطأ في تحميل بيانات الطلب',
            description: errorObject.message,
            variant: 'destructive'
          });
        }, 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = async (address) => {
    // التأكد من وجود رقم الهاتف في العنوان المختار
    const addressWithPhone = {
      ...address,
      phone: address.phone || orderData.customerInfo.phone || ''
    };
    
    setOrderData(prev => ({
      ...prev,
      shippingAddress: addressWithPhone
    }));

    // تحديث طرق الشحن عند تغيير العنوان
    if (hasPhysicalProducts) {
      try {
        const totalWeight = cart
          .filter(item => item.type === 'physical')
          .reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0); // وزن افتراضي 0.5 كجم للكتاب
        
        const shippingMethods = await api.storeSettings.getAvailableShippingMethods(
          addressWithPhone.country || 'SA',
          subtotal,
          totalWeight
        );
        
        logger.debug('Updated shipping methods:', shippingMethods);
        setAvailableShippingMethods(shippingMethods);
      } catch (error) {
        logger.error('Error updating shipping methods:', error);
      }
    }
  };

  const handlePaymentSelect = (paymentMethod) => {
    setOrderData(prev => ({
      ...prev,
      paymentMethod: paymentMethod
    }));
  };

  const handleShippingMethodSelect = (shippingMethod) => {
    setOrderData(prev => ({
      ...prev,
      shippingMethod: shippingMethod
    }));
  };

  const handleAddNewAddress = async (addressData) => {
    try {
      if (isLoggedIn) {
        // تمرير بيانات المستخدم الحالي مع العنوان
        const userData = {
          email: currentUser.email || orderData.customerInfo.email,
          displayName: currentUser.displayName || orderData.customerInfo.name,
          phone: currentUser.phoneNumber || orderData.customerInfo.phone
        };
        const newAddress = await api.addCustomerAddress(currentUser.uid, addressData, userData);
        setSavedAddresses(prev => [...prev, newAddress]);
        
        // التأكد من وجود رقم الهاتف في العنوان
        const addressWithPhone = {
          ...newAddress,
          phone: newAddress.phone || orderData.customerInfo.phone || ''
        };
        
        setOrderData(prev => ({
          ...prev,
          shippingAddress: addressWithPhone
        }));
      } else {
        // للمستخدمين غير المسجلين - إضافة رقم الهاتف من customerInfo إذا لم يكن موجوداً
        const addressWithPhone = {
          ...addressData,
          phone: addressData.phone || orderData.customerInfo.phone || ''
        };
        setOrderData(prev => ({
          ...prev,
          shippingAddress: addressWithPhone
        }));
      }
      setShowAddressForm(false);
      setTimeout(() => {
        toast({
          title: 'تم إضافة العنوان بنجاح',
          variant: 'success'
        });
      }, 0);
    } catch (error) {
      const errorObject = errorHandler.handleError(error, 'checkout:add-address');
      setTimeout(() => {
        toast({
          title: 'خطأ في إضافة العنوان',
          description: errorObject.message,
          variant: 'destructive'
        });
      }, 0);
    }
  };

  const handleAddNewPaymentMethod = async (paymentData) => {
    try {
      if (isLoggedIn) {
        const newPayment = await api.addCustomerPaymentMethod(currentUser.uid, paymentData);
        setSavedPaymentMethods(prev => [...prev, newPayment]);
        setOrderData(prev => ({
          ...prev,
          paymentMethod: newPayment
        }));
      } else {
        // للمستخدمين غير المسجلين
        setOrderData(prev => ({
          ...prev,
          paymentMethod: paymentData
        }));
      }
      setShowPaymentForm(false);
      setTimeout(() => {
        toast({
          title: 'تم إضافة طريقة الدفع بنجاح',
          variant: 'success'
        });
      }, 0);
    } catch (error) {
      const errorObject = errorHandler.handleError(error, 'checkout:add-payment');
      setTimeout(() => {
        toast({
          title: 'خطأ في إضافة طريقة الدفع',
          description: errorObject.message,
          variant: 'destructive'
        });
      }, 0);
    }
  };

  // حفظ بيانات العميل عند التعديل
  const handleCustomerInfoUpdate = async (info) => {
    setOrderData(prev => ({ ...prev, customerInfo: info }));
    
    // حفظ البيانات في ملف العميل إذا كان مسجل دخول مع تأخير لتجنب الحفظ المتكرر
    if (isLoggedIn && currentUser) {
      // إلغاء المهلة السابقة
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
             // تعيين مهلة جديدة للحفظ
       const newTimeout = setTimeout(async () => {
         try {
           setIsSaving(true);
           logger.debug('Saving customer data:', info);
           // تحديث أو إنشاء ملف العميل
           await api.updateCustomer(currentUser.uid, {
             firstName: info.name.split(' ')[0] || '',
             lastName: info.name.split(' ').slice(1).join(' ') || '',
             email: info.email,
             phone: info.phone
           });
           
           logger.debug('Customer data saved successfully');
         } catch (error) {
           logger.error('Error saving customer data:', error);
           // لا نعرض خطأ للمستخدم لأن الطلب يمكن أن يستمر
         } finally {
           setIsSaving(false);
         }
       }, 1000); // تأخير لثانية واحدة
      
      setSaveTimeout(newTimeout);
    }
  };

    const getValidationStatus = () => {
    try {
      // لقطات تشخيصية كاملة للحالة الحالية
      logger.debug('[Checkout][DEBUG] orderData snapshot:', JSON.parse(JSON.stringify(orderData)));
      logger.debug('[Checkout][DEBUG] hasPhysicalProducts:', hasPhysicalProducts);
      logger.debug('[Checkout][DEBUG] storeSettings.paymentGateways keys:', Object.keys(storeSettings?.paymentGateways || {}));
      if (orderData?.paymentMethod) {
        logger.debug('[Checkout][DEBUG] selected paymentMethod:', orderData.paymentMethod);
        logger.debug('[Checkout][DEBUG] selected gateway enabled?:', storeSettings?.paymentGateways?.[orderData.paymentMethod.gatewayId || orderData.paymentMethod.gateway]?.enabled);
      }

      if (!orderData?.customerInfo?.name || !orderData?.customerInfo?.email) {
        return { ok: false, reason: 'missing_customer' };
      }

      if (hasPhysicalProducts) {
        if (!orderData?.shippingAddress) {
          return { ok: false, reason: 'missing_shipping_address' };
        }
        if (!orderData?.shippingMethod) {
          return { ok: false, reason: 'missing_shipping_method' };
        }
      }

      if (!orderData?.paymentMethod) {
        return { ok: false, reason: 'missing_payment_method' };
      }

      // التحقق من أن بوابة الدفع مفعلة
      const gatewayKey = orderData?.paymentMethod?.gatewayId || orderData?.paymentMethod?.gateway;
      const gateway = gatewayKey ? storeSettings?.paymentGateways?.[gatewayKey] : null;
      
      // إذا لم تكن البوابة موجودة في storeSettings، تحقق من طرق الدفع المباشرة
      if (!gateway) {
        // للطرق المباشرة، نعتبرها صالحة
        const directPaymentMethods = ['manual', 'cash_on_delivery', 'cashOnDelivery', 'bank_transfer', 'wallet'];
        if (directPaymentMethods.includes(gatewayKey)) {
          return { ok: true };
        }
        return { ok: false, reason: 'gateway_not_found', details: gatewayKey };
      }
      if (!gateway.enabled) {
        return { ok: false, reason: 'gateway_disabled', details: gatewayKey };
      }

      return { ok: true };
    } catch (e) {
      logger.error('[Checkout][DEBUG] validation error:', e);
      return { ok: false, reason: 'unknown' };
    }
  };

  const validateOrder = () => getValidationStatus().ok;

  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return Boolean(orderData.customerInfo?.name && orderData.customerInfo?.email);
      case 1:
        if (!hasPhysicalProducts) {
          return true;
        }
        return Boolean(orderData.shippingAddress && orderData.shippingMethod);
      case 2:
        return Boolean(orderData.paymentMethod);
      case 3:
        return validateOrder();
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1 && isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const canProceedToNext = isStepValid(currentStep);

  const getStepRequirementMessage = () => {
    if (currentStep === 0 && !isStepValid(0)) {
      return 'يرجى إدخال الاسم والبريد الإلكتروني للمتابعة.';
    }
    if (currentStep === 1 && hasPhysicalProducts && !isStepValid(1)) {
      return 'يرجى اختيار عنوان وطريقة الشحن قبل المتابعة.';
    }
    if (currentStep === 2 && !isStepValid(2)) {
      return 'يرجى اختيار طريقة الدفع قبل المتابعة.';
    }
    return '';
  };

  const stepRequirementMessage =
    currentStep < totalSteps - 1 && !canProceedToNext ? getStepRequirementMessage() : '';

  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      // عرض رسائل الخطأ المناسبة عند محاولة إتمام الطلب
      if (!orderData.customerInfo.name || !orderData.customerInfo.email) {
        toast({
          title: 'بيانات العميل مطلوبة',
          description: 'يرجى إدخال الاسم والبريد الإلكتروني',
          variant: 'destructive'
        });
        return;
      }

                  if (hasPhysicalProducts && !orderData.shippingAddress) {
              toast({
                title: 'عنوان الشحن مطلوب',
                description: 'يرجى اختيار أو إضافة عنوان شحن',
                variant: 'destructive'
              });
              return;
            }

            if (hasPhysicalProducts && !orderData.shippingMethod) {
              toast({
                title: 'طريقة الشحن مطلوبة',
                description: 'يرجى اختيار طريقة شحن',
                variant: 'destructive'
              });
              return;
            }

      if (!orderData.paymentMethod) {
        toast({
          title: 'طريقة الدفع مطلوبة',
          description: 'يرجى اختيار طريقة دفع',
          variant: 'destructive'
        });
        return;
      }

      // التحقق من أن مزود الدفع مفعل
      if (orderData.paymentMethod) {
        const provider = availablePaymentMethods.find(p => p.id === orderData.paymentMethod.id || p.gatewayId === orderData.paymentMethod.gatewayId || p.gateway === orderData.paymentMethod.gateway);
        if (!provider) {
          toast({
            title: 'مزود الدفع غير متاح',
            description: 'طريقة الدفع المختارة غير متاحة حالياً',
            variant: 'destructive'
          });
          return;
        }
      }

      return;
    }

    try {
      setProcessing(true);

      // إنشاء سلة التسوق
      const cartResult = await api.cart.createCart(orderData.customerId);
      
      // إضافة المنتجات إلى السلة
      for (const item of cart) {
        await api.cart.addToCart(cartResult.id, {
          productId: item.id,
          quantity: item.quantity,
          type: item.type,
          customerId: orderData.customerId
        });
      }
      
      // تحديث بيانات السلة
      const cartUpdateData = {
        shippingAddress: orderData.shippingAddress,
        paymentMethodId: orderData.paymentMethod.id,
        notes: orderData.notes,
        customerId: orderData.customerId
      };
      
      // إضافة shippingMethodId فقط إذا كان موجوداً
      if (orderData.shippingMethod?.id) {
        cartUpdateData.shippingMethodId = orderData.shippingMethod.id;
      }
      
      await api.cart.updateCart(cartResult.id, cartUpdateData);

      // حساب تكلفة الشحن بناءً على نوع المنتجات والوزن
      let calculatedShippingCost = 0;
      if (hasPhysicalProducts && orderData.shippingMethod) {
        const totalWeight = cart
          .filter(item => item.type === 'physical')
          .reduce((sum, item) => {
            const itemWeight = (item.weight || 0) * item.quantity;
            logger.debug('Item weight calculation:', {
              productName: item.name || item.title,
              weight: item.weight || 0,
              quantity: item.quantity,
              totalWeight: itemWeight
            });
            return sum + itemWeight;
          }, 0);
        
        logger.debug('Shipping calculation:', {
          totalWeight,
          shippingMethod: orderData.shippingMethod.id,
          baseCost: orderData.shippingMethod.cost,
          costPerKg: 5,
          calculatedCost: orderData.shippingMethod.cost + (totalWeight * 5)
        });
        
        // حساب تكلفة الشحن بناءً على الوزن والطريقة المختارة
        calculatedShippingCost = calculateShippingCost(totalWeight, orderData.shippingMethod.id);
      }

      // إنشاء Payment Intent باستخدام النظام الموحد مع دعم وضع الاختبار
      const paymentData = {
        amount: total,
        currency: currency?.code || 'SAR',
        orderId: cartResult.id,
        customerId: orderData.customerId,
        provider: orderData.paymentMethod.gatewayId || orderData.paymentMethod.gateway || orderData.paymentMethod.id,
        testMode: orderData.paymentMethod.testMode || false,
        metadata: {
          description: `طلب من ${orderData.customerInfo.name}`,
          customerEmail: orderData.customerInfo.email,
          customerPhone: orderData.customerInfo.phone,
          shippingMethod: orderData.shippingMethod?.id,
          shippingCost: calculatedShippingCost,
          totalWeight: cart
            .filter(item => item.type === 'physical')
            .reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0),
          testMode: orderData.paymentMethod.testMode || false
        }
      };

      const paymentIntent = await unifiedPaymentApi.createPaymentIntent(paymentData);
      
      if (!paymentIntent.success) {
        throw new Error(paymentIntent.error || 'فشل في إنشاء عملية الدفع');
      }

      // تأكيد الدفع للطرق الإلكترونية (غير الدفع عند الاستلام والتحويل البنكي)
      const providerKey = (orderData.paymentMethod.gatewayId || orderData.paymentMethod.gateway || orderData.paymentMethod.id || '').toLowerCase();
      const methodType = (orderData.paymentMethod.type || '').toLowerCase();
      const isManualLike = providerKey === 'manual' || methodType === 'cash_on_delivery' || methodType === 'bank_transfer' || providerKey === 'cashondelivery' || providerKey === 'cash_on_delivery';

      if (!isManualLike) {
        const confirmResult = await unifiedPaymentApi.confirmPayment(
          paymentIntent.paymentIntent.id,
          {
            ...orderData.paymentMethod.paymentData,
            amount: total,
            currency: currency?.code || 'SAR',
            testMode: orderData.paymentMethod.testMode || false,
            provider: providerKey,
          }
        );
        if (!confirmResult.success) {
          throw new Error(confirmResult.error || 'فشل تأكيد عملية الدفع');
        }
      }

      // معالجة إتمام الطلب
      logger.debug('Checkout data before processing:', {
        customerId: orderData.customerId,
        customerInfo: orderData.customerInfo,
        shippingAddress: orderData.shippingAddress,
        shippingMethod: orderData.shippingMethod,
        paymentMethod: orderData.paymentMethod,
        hasPhysicalProducts: hasPhysicalProducts
      });

      // Validate required data before processing
      if (!orderData.customerId) {
        logger.error('Missing customerId in checkout data:', orderData);
        throw new Error('معرف العميل مطلوب');
      }
      
      if (!orderData.customerInfo || !orderData.customerInfo.name || !orderData.customerInfo.email) {
        logger.error('Missing customer info in checkout data:', orderData);
        throw new Error('معلومات العميل مطلوبة');
      }
      
      const checkoutData = {
        customerId: orderData.customerId,
        customerInfo: orderData.customerInfo,
        paymentIntentId: paymentIntent.paymentIntent.id,
        saveCustomerData: isLoggedIn,
        items: cart,
        hasPhysicalProducts: hasPhysicalProducts,
        hasDigitalProducts: !hasPhysicalProducts,
        shippingAddress: orderData.shippingAddress,
        shippingMethod: orderData.shippingMethod,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        // إضافة حسابات التكلفة
        subtotal: subtotal,
        shippingCost: calculatedShippingCost,
        taxAmount: taxAmount,
        total: total
      };

      const orderResult = await api.orders.processCheckout(cartResult.id, checkoutData);

      logger.debug('CheckoutPage - Raw order result:', orderResult);

      // التحقق من وجود معرف الطلب
      if (!orderResult || !orderResult.id) {
        logger.error('CheckoutPage - Order ID is missing after checkout:', orderResult);
        
        // محاولة استخدام معرفات بديلة
        const fallbackId = orderResult?.order?.id || orderResult?.orderNumber || `temp_${Date.now()}`;
        logger.info('CheckoutPage - Using fallback ID:', fallbackId);
        
        if (fallbackId && fallbackId !== `temp_${Date.now()}`) {
          orderResult.id = fallbackId;
        } else {
          throw new Error('فشل في الحصول على معرف الطلب بعد إتمام الشراء');
        }
      }

      logger.debug('CheckoutPage - Order created successfully:', {
        id: orderResult.id,
        orderNumber: orderResult.orderNumber,
        success: orderResult.success
      });

      // مسح السلة
      setCart([]);

      setTimeout(() => {
        const isDigitalOnly = !hasPhysicalProducts;
        const isTestMode = orderData.paymentMethod.testMode || false;
        toast({
          title: 'تم إنشاء الطلب بنجاح',
          description: isDigitalOnly 
            ? `رقم الطلب: ${orderResult.orderNumber || orderResult.id} - المنتجات متاحة للتحميل فوراً${isTestMode ? ' (وضع الاختبار)' : ''}`
            : `رقم الطلب: ${orderResult.orderNumber || orderResult.id}${isTestMode ? ' (وضع الاختبار)' : ''}`,
          variant: 'success'
        });
      }, 0);

      // التحقق النهائي من معرف الطلب قبل الانتقال
      if (!orderResult.id || orderResult.id === 'null' || orderResult.id === 'undefined') {
        logger.error('CheckoutPage - Final check failed, order ID is still invalid:', orderResult.id);
        throw new Error('فشل في الحصول على معرف صحيح للطلب');
      }

      // الانتقال لصفحة تأكيد الطلب مع رسالة النجاح
      logger.debug('CheckoutPage - Navigating to order page with ID:', orderResult.id);
      navigate(`/orders/${orderResult.id}?success=true`);

    } catch (error) {
      const errorObject = errorHandler.handleError(error, 'checkout:place-order');
      logger.error('CheckoutPage - Order creation failed:', errorObject);
      
      setTimeout(() => {
        toast({
          title: 'خطأ في إنشاء الطلب',
          description: errorObject.message,
          variant: 'destructive'
        });
      }, 0);

      // في حالة فشل إنشاء الطلب، إعادة توجيه المستخدم إلى صفحة الطلبات
      setTimeout(() => {
        navigate('/my-orders');
      }, 3000);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">لا توجد منتجات في السلة لإتمام الطلب</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            العودة للتسوق
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar steps={steps} currentStep={currentStep} totalSteps={totalSteps} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
          <p className="mt-2 text-gray-600">راجع طلبك وأكمل عملية الشراء</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معلومات الطلب */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 0 && (
              <CustomerInfoSection
                customerInfo={orderData.customerInfo}
                isLoggedIn={isLoggedIn}
                onUpdate={handleCustomerInfoUpdate}
                isSaving={isSaving}
              />
            )}

            {currentStep === 1 && (
              hasPhysicalProducts ? (
                <>
                  <ShippingAddressSection
                    selectedAddress={orderData.shippingAddress}
                    savedAddresses={savedAddresses}
                    isLoggedIn={isLoggedIn}
                    onAddressSelect={handleAddressSelect}
                    onAddNewAddress={handleAddNewAddress}
                    showForm={showAddressForm}
                    setShowForm={setShowAddressForm}
                  />

                  {orderData.shippingAddress && (
                    <ShippingMethodSection
                      availableMethods={availableShippingMethods}
                      selectedMethod={orderData.shippingMethod}
                      onMethodSelect={handleShippingMethodSelect}
                      shippingAddress={orderData.shippingAddress}
                      cartTotal={subtotal}
                      formatPrice={formatPrice}
                    />
                  )}
                </>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-3">✅</div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">منتجات رقمية</h3>
                      <p className="text-sm text-green-700">
                        المنتجات متاحة فوراً بعد الدفع. لا حاجة للشحن.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}

            {currentStep === 2 && (
              <PaymentMethodSection
                availableMethods={availablePaymentMethods}
                savedMethods={savedPaymentMethods}
                selectedMethod={orderData.paymentMethod}
                isLoggedIn={isLoggedIn}
                onMethodSelect={handlePaymentSelect}
                onAddNewMethod={handleAddNewPaymentMethod}
                showForm={showPaymentForm}
                setShowForm={setShowPaymentForm}
                storeSettings={storeSettings}
                hasPhysicalProducts={hasPhysicalProducts}
              />
            )}

            {currentStep === 3 && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ملاحظات إضافية</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="أي ملاحظات أو طلبات خاصة..."
                    value={orderData.notes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <ReviewSection
                  orderData={orderData}
                  hasPhysicalProducts={hasPhysicalProducts}
                  formatPrice={formatPrice}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  taxAmount={taxAmount}
                  total={total}
                />
              </>
            )}

            {currentStep < totalSteps - 1 && stepRequirementMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {stepRequirementMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="sm:w-auto w-full"
              >
                السابق
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!canProceedToNext}
                  className="checkout-button sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
                >
                  التالي
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={!validateOrder() || processing}
                  className="checkout-button sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري المعالجة...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" />
                      تأكيد الطلب
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shippingCost={shippingCost}
              taxAmount={taxAmount}
              total={total}
              currency={currency}
              storeSettings={storeSettings}
              onPlaceOrder={handlePlaceOrder}
              processing={processing}
              canPlaceOrder={validateOrder() && currentStep === totalSteps - 1}
              formatPrice={formatPrice}
              orderData={orderData}
              hasPhysicalProducts={hasPhysicalProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون معلومات العميل
const CustomerInfoSection = ({ customerInfo, isLoggedIn, onUpdate, isSaving }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          معلومات العميل
        </h3>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              مسجل دخول
            </span>
          )}
          {isSaving && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center font-medium shadow-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
              💾 جاري الحفظ...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">الاسم الكامل *</Label>
          <Input
            id="customerName"
            value={customerInfo.name}
            onChange={(e) => onUpdate({ ...customerInfo, name: e.target.value })}
            placeholder="أدخل الاسم الكامل"
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">البريد الإلكتروني *</Label>
          <Input
            id="customerEmail"
            type="email"
            value={customerInfo.email}
            onChange={(e) => onUpdate({ ...customerInfo, email: e.target.value })}
            placeholder="أدخل البريد الإلكتروني"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="customerPhone">رقم الهاتف</Label>
          <Input
            id="customerPhone"
            value={customerInfo.phone}
            onChange={(e) => onUpdate({ ...customerInfo, phone: e.target.value })}
            placeholder="أدخل رقم الهاتف"
          />
        </div>
        
        {/* عرض البيانات المحفوظة */}
        {isLoggedIn && (customerInfo.name || customerInfo.email || customerInfo.phone) && (
          <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>البيانات المحفوظة:</strong>
              {customerInfo.name && ` ${customerInfo.name}`}
              {customerInfo.email && ` - ${customerInfo.email}`}
              {customerInfo.phone && ` - ${customerInfo.phone}`}
            </p>
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-white">
            <strong>نصيحة:</strong> سجل دخولك لحفظ بياناتك وتسريع عمليات الشراء المستقبلية
          </p>
        </div>
      )}
      
      {isLoggedIn && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>معلومات:</strong> يمكنك تعديل بياناتك حسب الحاجة. سيتم حفظ التغييرات في ملفك الشخصي.
          </p>
        </div>
      )}
    </div>
  );
};

// مكون عناوين الشحن
const ShippingAddressSection = ({
  selectedAddress,
  savedAddresses,
  isLoggedIn,
  onAddressSelect,
  onAddNewAddress,
  showForm,
  setShowForm
}) => {
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'SA',
    phone: '',
    isDefault: false
  });

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    onAddNewAddress(newAddress);
    setNewAddress({
      type: 'shipping',
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'SA',
      phone: '',
      isDefault: false
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          عنوان الشحن
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center checkout-button"
        >
          <Plus className="w-4 h-4 mr-1" />
          إضافة عنوان جديد
        </Button>
      </div>

      {/* العناوين المحفوظة */}
      {savedAddresses.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">العناوين المحفوظة</h4>
          <div className="space-y-2">
            {savedAddresses.map((address, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors checkout-address-card ${
                  selectedAddress?.id === address.id
                    ? 'border-blue-500 bg-blue-50 checkout-selected'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onAddressSelect(address)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {address.firstName && address.lastName 
                        ? `${address.firstName} ${address.lastName}` 
                        : address.name || 'عنوان بدون اسم'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.street}, {address.city}, {address.country}
                    </p>
                    {address.phone && (
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    )}
                  </div>
                  {selectedAddress?.id === address.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                {address.isDefault && (
                  <span className="inline-block mt-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    العنوان الافتراضي
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نموذج إضافة عنوان جديد */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4"
          >
            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">الاسم الأول *</Label>
                  <Input
                    id="firstName"
                    value={newAddress.firstName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">اسم العائلة *</Label>
                  <Input
                    id="lastName"
                    value={newAddress.lastName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="company">اسم الشركة (اختياري)</Label>
                  <Input
                    id="company"
                    value={newAddress.company}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="street">العنوان *</Label>
                  <Input
                    id="street"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">المدينة *</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">المنطقة/الولاية</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">الرمز البريدي</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="country">الدولة *</Label>
                  <select
                    id="country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 checkout-select-white"
                    required
                  >
                    <option value="SA">المملكة العربية السعودية</option>
                    <option value="AE">الإمارات العربية المتحدة</option>
                    <option value="KW">الكويت</option>
                    <option value="QA">قطر</option>
                    <option value="BH">البحرين</option>
                    <option value="OM">عمان</option>
                    <option value="EG">مصر</option>
                    <option value="JO">الأردن</option>
                    <option value="LB">لبنان</option>
                    <option value="SY">سوريا</option>
                    <option value="IQ">العراق</option>
                    <option value="IR">إيران</option>
                    <option value="TR">تركيا</option>
                    <option value="OTHER">دولة أخرى</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                {isLoggedIn && (
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">جعل هذا العنوان الافتراضي</span>
                    </label>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="checkout-button">
                  إلغاء
                </Button>
                <Button type="submit" className="checkout-button">إضافة العنوان</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// مكون طرق الشحن
const ShippingMethodSection = ({
  availableMethods,
  selectedMethod,
  onMethodSelect,
  shippingAddress,
  cartTotal,
  formatPrice
}) => {
  logger.debug('ShippingMethodSection rendered with:', {
    availableMethods,
    selectedMethod,
    shippingAddress,
    cartTotal
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
        <Truck className="w-5 h-5 mr-2" />
        طريقة الشحن
      </h3>

      {/* رسالة توضيحية للدول غير المدعومة */}
      {availableMethods.some(method => method.isFallback) && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>ملاحظة:</strong> الدولة المحددة غير مدعومة بالكامل. تم توفير طرق شحن احتياطية قد تكون أعلى تكلفة.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {availableMethods && availableMethods.length > 0 ? (
          availableMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors checkout-shipping-card ${
                selectedMethod?.id === method.id
                  ? 'border-blue-500 bg-blue-50 checkout-selected'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onMethodSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {selectedMethod?.id === method.id && (
                    <Check className={`w-5 h-5 mr-2 ${selectedMethod?.id === method.id ? 'text-white' : 'text-blue-600'}`} />
                  )}
                  <div>
                    <p className={`${selectedMethod?.id === method.id ? 'text-white' : ''} font-medium`}>
                      {method.name}
                      {method.isFallback && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          احتياطي
                        </span>
                      )}
                    </p>
                    <p className={`text-sm ${selectedMethod?.id === method.id ? 'text-white' : 'text-gray-600'}`}>{method.description}</p>
                    {method.estimatedDays && (
                      <p className={`text-xs ${selectedMethod?.id === method.id ? 'text-white' : 'text-gray-500'}`}>
                        التوصيل خلال {method.estimatedDays} أيام عمل
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${selectedMethod?.id === method.id ? 'text-white' : ''} font-semibold`}>
                    {method.cost === 0 ? 'مجاني' : formatPrice(method.cost)}
                  </p>
                  {method.freeThreshold && cartTotal < method.freeThreshold && (
                    <p className={`text-xs ${selectedMethod?.id === method.id ? 'text-white' : 'text-gray-500'}`}>
                      مجاني للطلبات أكثر من {formatPrice(method.freeThreshold)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">⚠️</div>
            <p className="text-gray-600">لا توجد طرق شحن متاحة حالياً</p>
            <p className="text-sm text-gray-500 mt-1">
              قد يكون السبب:
            </p>
            <ul className="text-xs text-gray-500 mt-2 text-right">
              <li>• العنوان المحدد غير مدعوم</li>
              <li>• الوزن الإجمالي يتجاوز الحد المسموح</li>
              <li>• قيمة الطلب أقل من الحد الأدنى المطلوب</li>
            </ul>
            <p className="text-sm text-gray-500 mt-3">
              يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// مكون طرق الدفع - مبسط باستخدام المكون الجديد
const PaymentMethodSection = ({
  availableMethods,
  savedMethods,
  selectedMethod,
  isLoggedIn,
  onMethodSelect,
  onAddNewMethod,
  showForm,
  setShowForm,
  storeSettings,
  hasPhysicalProducts
}) => {
  return (
    <PaymentMethodSelector
      selectedMethod={selectedMethod}
      onMethodSelect={onMethodSelect}
      hasPhysicalProducts={hasPhysicalProducts}
      currency="SAR"
    />
  );
};

// مكون مراجعة البيانات قبل إتمام الطلب
const ReviewSection = ({
  orderData,
  hasPhysicalProducts,
  formatPrice,
  subtotal,
  shippingCost,
  taxAmount,
  total
}) => {
  const customerInfo = orderData.customerInfo || {};
  const shippingAddress = orderData.shippingAddress;
  const shippingMethod = orderData.shippingMethod;
  const paymentMethod = orderData.paymentMethod;

  const renderAddressLine = () => {
    if (!shippingAddress) {
      return 'لم يتم اختيار عنوان الشحن بعد.';
    }

    const parts = [shippingAddress.street, shippingAddress.city, shippingAddress.state, shippingAddress.country]
      .filter(Boolean)
      .join(', ');

    return parts || 'لم يتم توفير تفاصيل العنوان.';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Check className="w-5 h-5 mr-2 text-green-600" />
          مراجعة البيانات
        </h3>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center text-gray-900 font-semibold mb-2">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              بيانات العميل
            </div>
            <p className="text-sm text-gray-700">{customerInfo.name || 'لم يتم إدخال الاسم'}</p>
            <p className="text-sm text-gray-700">{customerInfo.email || 'لم يتم إدخال البريد الإلكتروني'}</p>
            {customerInfo.phone && (
              <p className="text-sm text-gray-700">{customerInfo.phone}</p>
            )}
          </div>

          {hasPhysicalProducts ? (
            <div className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center text-gray-900 font-semibold mb-2">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                تفاصيل الشحن
              </div>
              {shippingAddress ? (
                <>
                  <p className="text-sm text-gray-700">
                    {(shippingAddress.firstName || shippingAddress.lastName)
                      ? `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim()
                      : shippingAddress.name || 'عنوان بدون اسم'}
                  </p>
                  <p className="text-sm text-gray-700">{renderAddressLine()}</p>
                  {shippingAddress.phone && (
                    <p className="text-sm text-gray-700">{shippingAddress.phone}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-red-600">لم يتم اختيار عنوان الشحن بعد.</p>
              )}
              {shippingMethod ? (
                <p className="text-sm text-gray-700">
                  طريقة الشحن: {shippingMethod.name}
                  {typeof shippingMethod.cost === 'number' && (
                    <span className="mr-1">- {formatPrice(shippingMethod.cost)}</span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-red-600">لم يتم اختيار طريقة الشحن.</p>
              )}
            </div>
          ) : (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center text-green-800 font-semibold mb-2">
                <Truck className="w-4 h-4 mr-2" />
                المنتجات رقمية
              </div>
              <p className="text-sm text-green-700">
                لا حاجة لعنوان شحن. ستتمكن من الوصول إلى مشترياتك فوراً بعد إتمام الدفع.
              </p>
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center text-gray-900 font-semibold mb-2">
              <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
              طريقة الدفع
            </div>
            {paymentMethod ? (
              <>
                <p className="text-sm text-gray-700">
                  {paymentMethod.name || paymentMethod.type || 'طريقة الدفع المختارة'}
                </p>
                {paymentMethod.description && (
                  <p className="text-xs text-gray-500 mt-1">{paymentMethod.description}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-red-600">لم يتم اختيار طريقة الدفع.</p>
            )}
          </div>

          {orderData.notes && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-gray-900 font-semibold mb-2">ملاحظات الطلب</div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{orderData.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">ملخص التكاليف</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {hasPhysicalProducts && shippingCost > 0 && (
            <div className="flex justify-between">
              <span>تكلفة الشحن</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between">
              <span>الضريبة</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
            <span>الإجمالي</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون ملخص الطلب
const OrderSummary = ({
  cart,
  subtotal,
  shippingCost,
  taxAmount,
  total,
  currency,
  storeSettings,
  onPlaceOrder,
  processing,
  canPlaceOrder,
  formatPrice,
  orderData,
  hasPhysicalProducts
}) => {
  // Validator local to this component using only props
  const getValidationStatusLocal = () => {
    try {
      if (!orderData?.customerInfo?.name || !orderData?.customerInfo?.email) {
        return { ok: false, reason: 'missing_customer' };
      }
      if (hasPhysicalProducts) {
        if (!orderData?.shippingAddress) {
          return { ok: false, reason: 'missing_shipping_address' };
        }
        if (!orderData?.shippingMethod) {
          return { ok: false, reason: 'missing_shipping_method' };
        }
      }
      if (!orderData?.paymentMethod) {
        return { ok: false, reason: 'missing_payment_method' };
      }
      const gatewayKey = orderData?.paymentMethod?.gatewayId || orderData?.paymentMethod?.gateway;
      const gateway = gatewayKey ? storeSettings?.paymentGateways?.[gatewayKey] : null;
      
      // إذا لم تكن البوابة موجودة في storeSettings، تحقق من طرق الدفع المباشرة
      if (!gateway) {
        // للطرق المباشرة، نعتبرها صالحة
        const directPaymentMethods = ['manual', 'cash_on_delivery', 'cashOnDelivery', 'bank_transfer', 'wallet'];
        if (directPaymentMethods.includes(gatewayKey)) {
          return { ok: true };
        }
        return { ok: false, reason: 'gateway_not_found', details: gatewayKey };
      }
      if (!gateway.enabled) {
        return { ok: false, reason: 'gateway_disabled', details: gatewayKey };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: 'unknown' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h3>

      {/* عناصر الطلب */}
      <div className="space-y-3 mb-4">
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
              {item.type !== 'physical' && (
                <span className="inline-block mt-1 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium shadow-sm">
                  {item.type === 'ebook' ? '📖 كتاب إلكتروني' : '🎧 كتاب صوتي'}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between">
            <span>تكلفة الشحن</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
        )}

        {taxAmount > 0 && (
          <div className="flex justify-between">
            <span>الضريبة ({storeSettings?.tax?.rate}%)</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
        )}

        <div className="border-t pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-6 checkout-button"
        size="lg"
        onClick={onPlaceOrder}
        disabled={processing || !canPlaceOrder}
      >
        {processing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            جاري المعالجة...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            تأكيد الطلب
          </div>
        )}
      </Button>

      {/* رسالة توضيحية */}
      {!canPlaceOrder && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          {(() => {
            const status = getValidationStatusLocal();
            const reason = status.reason;
            return (
              <p className="text-sm text-gray-600 text-center">
                {reason === 'missing_customer' && 'يرجى إدخال بيانات العميل'}
                {reason === 'missing_shipping_address' && 'يرجى اختيار عنوان الشحن'}
                {reason === 'missing_shipping_method' && 'يرجى اختيار طريقة الشحن'}
                {reason === 'missing_payment_method' && 'يرجى اختيار طريقة الدفع'}
                {reason === 'gateway_not_found' && `بوابة الدفع غير معرّفة (${status.details || ''})`}
                {reason === 'gateway_disabled' && `بوابة الدفع المختارة غير مفعلة (${status.details || ''})`}
                {!reason && 'يرجى إكمال جميع البيانات المطلوبة'}
                {reason === 'unknown' && 'تعذر التحقق من البيانات، يرجى المحاولة مجدداً'}
              </p>
            );
          })()}
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          <Lock className="w-3 h-3 inline mr-1" />
          معاملتك آمنة ومحمية
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;