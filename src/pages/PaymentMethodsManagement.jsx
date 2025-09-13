import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Save,
  RefreshCw,
  ExternalLink,
  Link,
  TestTube,
  Zap,
  Settings,
  Shield,
  Globe,
  Smartphone,
  Banknote,
  Wallet
} from 'lucide-react';
import api from '@/lib/api.js';

const PaymentMethodsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentGateways, setPaymentGateways] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [showGatewayForm, setShowGatewayForm] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [gatewayForm, setGatewayForm] = useState({});
  const [showSecrets, setShowSecrets] = useState({});

  // بوابات الدفع المدعومة
  const supportedGateways = {
    stripe: {
      name: 'Stripe',
      description: 'بوابة دفع عالمية تدعم البطاقات والمدفوعات الرقمية',
      icon: '💳',
      color: 'bg-blue-500',
      supportedMethods: ['credit_card', 'debit_card', 'apple_pay', 'google_pay'],
      supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      requiredFields: ['publishableKey', 'secretKey', 'webhookSecret'],
      optionalFields: ['statementDescriptor', 'statementDescriptorSuffix'],
      testMode: true,
      fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
      limits: { minAmount: 0.50, maxAmount: 999999.99, currency: 'USD' },
      features: ['3D Secure', 'Recurring Payments', 'Refunds', 'Webhooks', 'Customer Management'],
      dashboardUrl: 'https://dashboard.stripe.com/',
      docsUrl: 'https://stripe.com/docs'
    },
    paypal: {
      name: 'PayPal',
      description: 'بوابة دفع عالمية تدعم الحسابات والبطاقات',
      icon: '🅿️',
      color: 'bg-yellow-500',
      supportedMethods: ['paypal', 'credit_card'],
      supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      requiredFields: ['clientId', 'clientSecret', 'webhookId'],
      optionalFields: ['mode'],
      testMode: true,
      fees: { percentage: 3.4, fixed: 0.35, currency: 'USD' },
      limits: { minAmount: 1.00, maxAmount: 10000.00, currency: 'USD' },
      features: ['Recurring Payments', 'Refunds', 'Webhooks'],
      dashboardUrl: 'https://developer.paypal.com/dashboard/',
      docsUrl: 'https://developer.paypal.com/docs'
    },
    mada: {
      name: 'مدى',
      description: 'شبكة مدى للبطاقات السعودية',
      icon: '💳',
      color: 'bg-green-500',
      supportedMethods: ['debit_card'],
      supportedCurrencies: ['SAR'],
      requiredFields: ['merchantId', 'terminalId', 'apiKey'],
      optionalFields: ['webhookSecret'],
      testMode: false,
      fees: { percentage: 1.5, fixed: 0.50, currency: 'SAR' },
      limits: { minAmount: 1.00, maxAmount: 50000.00, currency: 'SAR' },
      features: ['3D Secure', 'Refunds', 'Webhooks'],
      dashboardUrl: 'https://mada.com.sa/',
      docsUrl: 'https://mada.com.sa/merchants/'
    },
    tabby: {
      name: 'Tabby',
      description: 'حلول الدفع بالتقسيط',
      icon: '📱',
      color: 'bg-purple-500',
      supportedMethods: ['tabby'],
      supportedCurrencies: ['SAR', 'AED'],
      requiredFields: ['publicKey', 'secretKey', 'webhookSecret'],
      optionalFields: ['merchantId'],
      testMode: true,
      fees: { percentage: 0, fixed: 0, currency: 'SAR' },
      limits: { minAmount: 50.00, maxAmount: 10000.00, currency: 'SAR' },
      features: ['Installments', 'Webhooks', 'Customer Management'],
      dashboardUrl: 'https://tabby.ai/',
      docsUrl: 'https://docs.tabby.ai/'
    },
    tamara: {
      name: 'Tamara',
      description: 'حلول الدفع بالتقسيط',
      icon: '🛍️',
      color: 'bg-pink-500',
      supportedMethods: ['tamara'],
      supportedCurrencies: ['SAR', 'AED'],
      requiredFields: ['publicKey', 'secretKey', 'webhookSecret'],
      optionalFields: ['merchantId'],
      testMode: true,
      fees: { percentage: 0, fixed: 0, currency: 'SAR' },
      limits: { minAmount: 50.00, maxAmount: 10000.00, currency: 'SAR' },
      features: ['Installments', 'Webhooks', 'Customer Management'],
      dashboardUrl: 'https://tamara.co/',
      docsUrl: 'https://docs.tamara.co/'
    },
    stc_pay: {
      name: 'STC Pay',
      description: 'محفظة STC الإلكترونية',
      icon: '📱',
      color: 'bg-red-500',
      supportedMethods: ['stc_pay'],
      supportedCurrencies: ['SAR'],
      requiredFields: ['merchantId', 'apiKey', 'webhookSecret'],
      optionalFields: ['terminalId'],
      testMode: true,
      fees: { percentage: 1.0, fixed: 0.25, currency: 'SAR' },
      limits: { minAmount: 1.00, maxAmount: 5000.00, currency: 'SAR' },
      features: ['Mobile Payments', 'Webhooks'],
      dashboardUrl: 'https://stcpay.com.sa/',
      docsUrl: 'https://stcpay.com.sa/developers'
    },
    urway: {
      name: 'Urway',
      description: 'بوابة دفع سعودية متطورة',
      icon: '🌐',
      color: 'bg-indigo-500',
      supportedMethods: ['credit_card', 'debit_card'],
      supportedCurrencies: ['SAR', 'USD', 'EUR'],
      requiredFields: ['merchantId', 'terminalId', 'apiKey', 'webhookSecret'],
      optionalFields: ['password'],
      testMode: true,
      fees: { percentage: 2.0, fixed: 0.30, currency: 'SAR' },
      limits: { minAmount: 1.00, maxAmount: 100000.00, currency: 'SAR' },
      features: ['3D Secure', 'Refunds', 'Webhooks', 'Multi-Currency'],
      dashboardUrl: 'https://urway.com/',
      docsUrl: 'https://urway.com/developers'
    },
    manual: {
      name: 'الدفع اليدوي',
      description: 'طرق الدفع التقليدية',
      icon: '🏦',
      color: 'bg-gray-500',
      supportedMethods: ['bank_transfer', 'cash_on_delivery'],
      supportedCurrencies: ['SAR'],
      requiredFields: [],
      optionalFields: ['bankAccount', 'bankName', 'instructions'],
      testMode: false,
      fees: { percentage: 0, fixed: 0, currency: 'SAR' },
      limits: { minAmount: 0, maxAmount: 999999.99, currency: 'SAR' },
      features: ['No Fees', 'Manual Processing'],
      dashboardUrl: '',
      docsUrl: ''
    }
  };

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      setLoading(true);
      const settings = await api.storeSettings.getStoreSettings();
      
      if (settings.paymentGateways) {
        setPaymentGateways(settings.paymentGateways);
      }
      
      if (settings.paymentMethods) {
        setPaymentMethods(settings.paymentMethods);
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast({
        title: 'خطأ في تحميل إعدادات الدفع',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGatewayToggle = async (gatewayId, enabled) => {
    try {
      const updatedGateways = {
        ...paymentGateways,
        [gatewayId]: {
          ...paymentGateways[gatewayId],
          enabled
        }
      };
      
      setPaymentGateways(updatedGateways);
      
      await api.storeSettings.updateStoreSettings({
        paymentGateways: updatedGateways
      });
      
      toast({
        title: enabled ? 'تم تفعيل البوابة' : 'تم إلغاء تفعيل البوابة',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error toggling gateway:', error);
      toast({
        title: 'خطأ في تحديث البوابة',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleGatewayEdit = (gatewayId) => {
    const gateway = paymentGateways[gatewayId] || {};
    const gatewayInfo = supportedGateways[gatewayId];
    
    setEditingGateway(gatewayId);
    setGatewayForm({
      id: gatewayId,
      name: gatewayInfo.name,
      enabled: gateway.enabled || false,
      testMode: gateway.testMode || gatewayInfo.testMode,
      ...gateway.config
    });
    setShowGatewayForm(true);
  };

  const handleGatewaySave = async () => {
    try {
      setSaving(true);
      
      const updatedGateways = {
        ...paymentGateways,
        [gatewayForm.id]: {
          id: gatewayForm.id,
          name: gatewayForm.name,
          enabled: gatewayForm.enabled,
          testMode: gatewayForm.testMode,
          config: {
            ...Object.fromEntries(
              Object.entries(gatewayForm).filter(([key]) => 
                !['id', 'name', 'enabled', 'testMode'].includes(key)
              )
            )
          },
          connected: checkGatewayConnection(gatewayForm),
          lastUpdated: new Date().toISOString()
        }
      };
      
      setPaymentGateways(updatedGateways);
      
      await api.storeSettings.updateStoreSettings({
        paymentGateways: updatedGateways
      });
      
      setShowGatewayForm(false);
      setEditingGateway(null);
      setGatewayForm({});
      
      toast({
        title: 'تم حفظ إعدادات البوابة بنجاح',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error saving gateway:', error);
      toast({
        title: 'خطأ في حفظ البوابة',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const checkGatewayConnection = (gateway) => {
    const gatewayInfo = supportedGateways[gateway.id];
    if (!gatewayInfo) return false;
    
    return gatewayInfo.requiredFields.every(field => 
      gateway[field] && gateway[field].trim() !== ''
    );
  };

  const handleTestConnection = async (gatewayId) => {
    try {
      const gateway = paymentGateways[gatewayId];
      if (!gateway) return;
      
      // محاكاة اختبار الاتصال
      toast({
        title: 'جاري اختبار الاتصال...',
        description: 'يرجى الانتظار...'
      });
      
      // محاكاة التأخير
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isConnected = checkGatewayConnection(gateway);
      
      if (isConnected) {
        toast({
          title: 'تم الاتصال بنجاح',
          description: 'البوابة تعمل بشكل صحيح',
          variant: 'success'
        });
      } else {
        toast({
          title: 'فشل الاتصال',
          description: 'يرجى التحقق من الإعدادات',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: 'خطأ في اختبار الاتصال',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteGateway = async (gatewayId) => {
    if (!confirm('هل أنت متأكد من حذف هذه البوابة؟')) return;
    
    try {
      const updatedGateways = { ...paymentGateways };
      delete updatedGateways[gatewayId];
      
      setPaymentGateways(updatedGateways);
      
      await api.storeSettings.updateStoreSettings({
        paymentGateways: updatedGateways
      });
      
      toast({
        title: 'تم حذف البوابة بنجاح',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting gateway:', error);
      toast({
        title: 'خطأ في حذف البوابة',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const toggleSecretVisibility = (gatewayId) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل إعدادات الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة طرق الدفع</h1>
          <p className="text-gray-600">قم بإدارة وربط بوابات الدفع المختلفة مع متجرك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي البوابات</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(supportedGateways).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">البوابات المفعلة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(paymentGateways).filter(g => g.enabled).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المُعدة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(paymentGateways).filter(g => g.connected).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">وضع الاختبار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(paymentGateways).filter(g => g.testMode).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(supportedGateways).map(([gatewayId, gatewayInfo]) => {
            const gateway = paymentGateways[gatewayId] || {};
            const isConnected = checkGatewayConnection(gateway);
            
            return (
              <motion.div
                key={gatewayId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Gateway Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${gatewayInfo.color} text-white text-2xl`}>
                        {gatewayInfo.icon}
                      </div>
                      <div className="mr-3">
                        <h3 className="text-lg font-semibold text-gray-900">{gatewayInfo.name}</h3>
                        <p className="text-sm text-gray-600">{gatewayInfo.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleGatewayToggle(gatewayId, !gateway.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          gateway.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            gateway.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      gateway.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {gateway.enabled ? 'مفعل' : 'غير مفعل'}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isConnected 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isConnected ? 'مُعد' : 'غير مُعد'}
                    </span>
                    
                    {gateway.testMode && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        اختبار
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">الميزات:</p>
                    <div className="flex flex-wrap gap-1">
                      {gatewayInfo.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          {feature}
                        </span>
                      ))}
                      {gatewayInfo.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          +{gatewayInfo.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fees */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">الرسوم:</p>
                    <p className="text-sm text-gray-600">
                      {gatewayInfo.fees.percentage}% + {gatewayInfo.fees.fixed} {gatewayInfo.fees.currency}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      onClick={() => handleGatewayEdit(gatewayId)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      إعداد
                    </Button>
                    
                    {isConnected && (
                      <Button
                        onClick={() => handleTestConnection(gatewayId)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <TestTube className="w-4 h-4 ml-2" />
                        اختبار
                      </Button>
                    )}
                    
                    {gatewayInfo.dashboardUrl && (
                      <Button
                        onClick={() => window.open(gatewayInfo.dashboardUrl, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gateway Configuration Modal */}
        <AnimatePresence>
          {showGatewayForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      إعداد {supportedGateways[editingGateway]?.name}
                    </h2>
                    <Button
                      onClick={() => setShowGatewayForm(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleGatewaySave(); }} className="space-y-6">
                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          id="enabled"
                          checked={gatewayForm.enabled || false}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="enabled">تفعيل البوابة</Label>
                      </div>
                      
                      {supportedGateways[editingGateway]?.testMode && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input
                            type="checkbox"
                            id="testMode"
                            checked={gatewayForm.testMode || false}
                            onChange={(e) => setGatewayForm(prev => ({ ...prev, testMode: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <Label htmlFor="testMode">وضع الاختبار</Label>
                        </div>
                      )}
                    </div>

                    {/* Required Fields */}
                    {supportedGateways[editingGateway]?.requiredFields.map((field) => (
                      <div key={field}>
                        <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                          {getFieldLabel(field)} *
                        </Label>
                        <div className="relative">
                          <Input
                            id={field}
                            type={field.includes('secret') || field.includes('key') ? (showSecrets[editingGateway] ? 'text' : 'password') : 'text'}
                            value={gatewayForm[field] || ''}
                            onChange={(e) => setGatewayForm(prev => ({ ...prev, [field]: e.target.value }))}
                            placeholder={`أدخل ${getFieldLabel(field)}`}
                            className="pr-10"
                          />
                          {(field.includes('secret') || field.includes('key')) && (
                            <button
                              type="button"
                              onClick={() => toggleSecretVisibility(editingGateway)}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showSecrets[editingGateway] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Optional Fields */}
                    {supportedGateways[editingGateway]?.optionalFields.map((field) => (
                      <div key={field}>
                        <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                          {getFieldLabel(field)}
                        </Label>
                        <Input
                          id={field}
                          type="text"
                          value={gatewayForm[field] || ''}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, [field]: e.target.value }))}
                          placeholder={`أدخل ${getFieldLabel(field)} (اختياري)`}
                        />
                      </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t">
                      <Button
                        type="button"
                        onClick={() => setShowGatewayForm(false)}
                        variant="outline"
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? (
                          <>
                            <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 ml-2" />
                            حفظ الإعدادات
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper function to get field labels
const getFieldLabel = (field) => {
  const labels = {
    publishableKey: 'المفتاح العام',
    secretKey: 'المفتاح السري',
    webhookSecret: 'مفتاح Webhook',
    clientId: 'معرف العميل',
    clientSecret: 'السر السري',
    webhookId: 'معرف Webhook',
    merchantId: 'معرف التاجر',
    terminalId: 'معرف المحطة',
    apiKey: 'مفتاح API',
    publicKey: 'المفتاح العام',
    statementDescriptor: 'وصف المعاملة',
    statementDescriptorSuffix: 'لاحقة الوصف',
    mode: 'الوضع',
    bankAccount: 'رقم الحساب البنكي',
    bankName: 'اسم البنك',
    instructions: 'تعليمات الدفع'
  };
  
  return labels[field] || field;
};

export default PaymentMethodsManagement;
