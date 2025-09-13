import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  CreditCard,
  Settings,
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
  Zap
} from 'lucide-react';
import api from '@/lib/api.js';

const DashboardPaymentMethods = () => {
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingGateway, setEditingGateway] = useState(null);
  const [showGatewayForm, setShowGatewayForm] = useState(false);
  const [gatewayForm, setGatewayForm] = useState({});

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      setLoading(true);
      const settings = await api.storeSettings.getStoreSettings();
      setStoreSettings(settings);
    } catch (error) {
      console.error('Error loading store settings:', error);
      toast({
        title: 'خطأ في تحميل الإعدادات',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // روابط الربط التلقائي لبوابات الدفع
  const getGatewayLinks = (gatewayId) => {
    const links = {
      stripe: {
        name: 'Stripe',
        dashboard: 'https://dashboard.stripe.com/',
        signup: 'https://dashboard.stripe.com/register',
        docs: 'https://stripe.com/docs',
        testMode: true
      },
      paypal: {
        name: 'PayPal',
        dashboard: 'https://developer.paypal.com/dashboard/',
        signup: 'https://www.paypal.com/business/signup',
        docs: 'https://developer.paypal.com/docs',
        testMode: true
      },
      mada: {
        name: 'مدى',
        dashboard: 'https://mada.com.sa/',
        signup: 'https://mada.com.sa/merchants/',
        docs: 'https://mada.com.sa/merchants/',
        testMode: false
      },
      tabby: {
        name: 'Tabby',
        dashboard: 'https://tabby.ai/',
        signup: 'https://tabby.ai/merchants',
        docs: 'https://docs.tabby.ai/',
        testMode: true
      },
      tamara: {
        name: 'Tamara',
        dashboard: 'https://tamara.co/',
        signup: 'https://tamara.co/merchants',
        docs: 'https://docs.tamara.co/',
        testMode: true
      },
      stc_pay: {
        name: 'STC Pay',
        dashboard: 'https://stcpay.com.sa/',
        signup: 'https://stcpay.com.sa/merchants',
        docs: 'https://stcpay.com.sa/developers',
        testMode: true
      },
      urway: {
        name: 'Urway',
        dashboard: 'https://urway.com/',
        signup: 'https://urway.com/merchants',
        docs: 'https://urway.com/developers',
        testMode: true
      }
    };
    
    return links[gatewayId] || null;
  };

  const handleGatewayEdit = (gatewayId) => {
    const gateway = storeSettings.paymentGateways[gatewayId];
    setEditingGateway(gatewayId);
    setGatewayForm({
      id: gatewayId,
      name: gateway.name,
      enabled: gateway.enabled,
      sandboxMode: gateway.sandboxMode || false,
      ...gateway.config
    });
    setShowGatewayForm(true);
  };

  const handleGatewaySave = async () => {
    try {
      const updatedSettings = { ...storeSettings };
      const gateway = updatedSettings.paymentGateways[gatewayForm.id];
      
      // تحديث إعدادات البوابة
      gateway.enabled = gatewayForm.enabled;
      gateway.sandboxMode = gatewayForm.sandboxMode;
      gateway.config = {
        ...gateway.config,
        ...Object.fromEntries(
          Object.entries(gatewayForm).filter(([key]) => 
            !['id', 'name', 'enabled', 'sandboxMode'].includes(key)
          )
        )
      };

      await api.storeSettings.updateStoreSettings(updatedSettings);
      setStoreSettings(updatedSettings);
      setShowGatewayForm(false);
      setEditingGateway(null);
      setGatewayForm({});

      toast({
        title: 'تم حفظ الإعدادات بنجاح',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error saving gateway settings:', error);
      toast({
        title: 'خطأ في حفظ الإعدادات',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const toggleGateway = async (gatewayId) => {
    try {
      const updatedSettings = { ...storeSettings };
      updatedSettings.paymentGateways[gatewayId].enabled = 
        !updatedSettings.paymentGateways[gatewayId].enabled;

      await api.storeSettings.updateStoreSettings(updatedSettings);
      setStoreSettings(updatedSettings);

      toast({
        title: 'تم تحديث حالة البوابة بنجاح',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error toggling gateway:', error);
      toast({
        title: 'خطأ في تحديث حالة البوابة',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const togglePaymentMethod = async (methodId) => {
    try {
      const updatedSettings = { ...storeSettings };
      updatedSettings.paymentMethods[methodId].enabled = 
        !updatedSettings.paymentMethods[methodId].enabled;

      await api.storeSettings.updateStoreSettings(updatedSettings);
      setStoreSettings(updatedSettings);

      toast({
        title: 'تم تحديث حالة طريقة الدفع بنجاح',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error toggling payment method:', error);
      toast({
        title: 'خطأ في تحديث حالة طريقة الدفع',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة طرق الدفع</h1>
          <p className="mt-2 text-gray-600">إدارة بوابات الدفع وطرق الدفع المتاحة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* بوابات الدفع */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                بوابات الدفع
              </h2>
              <Button
                onClick={() => setShowGatewayForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة بوابة
              </Button>
            </div>

            <div className="space-y-4">
              {Object.entries(storeSettings.paymentGateways).map(([gatewayId, gateway]) => (
                <div
                  key={gatewayId}
                  className={`p-4 border rounded-lg ${
                    gateway.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900">{gateway.name}</h3>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            gateway.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {gateway.enabled ? 'مفعلة' : 'ملغية'}
                        </span>
                        {gateway.sandboxMode && (
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            تجريبي
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        طرق مدعومة: {gateway.supportedMethods.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        عملات مدعومة: {gateway.supportedCurrencies.join(', ')}
                      </p>
                      {getGatewayLinks(gatewayId) && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800 mb-1">
                            <strong>💡 نصائح للربط:</strong>
                          </p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• استخدم "تسجيل" لإنشاء حساب جديد</li>
                            <li>• استخدم "لوحة التحكم" لإدارة الإعدادات</li>
                            <li>• استخدم "الدليل" لمعرفة كيفية الربط</li>
                            {getGatewayLinks(gatewayId).testMode && (
                              <li>• <TestTube className="w-3 h-3 inline mr-1" /> يدعم وضع الاختبار</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* روابط الربط التلقائي */}
                      {getGatewayLinks(gatewayId) && (
                        <div className="flex items-center gap-1 mr-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getGatewayLinks(gatewayId).signup, '_blank')}
                            className="text-xs px-2 py-1"
                          >
                            <Link className="w-3 h-3 mr-1" />
                            تسجيل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getGatewayLinks(gatewayId).dashboard, '_blank')}
                            className="text-xs px-2 py-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            لوحة التحكم
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getGatewayLinks(gatewayId).docs, '_blank')}
                            className="text-xs px-2 py-1"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            الدليل
                          </Button>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGatewayEdit(gatewayId)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        تعديل
                      </Button>
                      <Button
                        variant={gateway.enabled ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => toggleGateway(gatewayId)}
                        className={
                          gateway.enabled
                            ? 'border-red-300 text-red-700 hover:bg-red-50'
                            : 'bg-green-600 hover:bg-green-700'
                        }
                      >
                        {gateway.enabled ? 'إلغاء التفعيل' : 'تفعيل'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* طرق الدفع */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
              <CreditCard className="w-5 h-5 mr-2" />
              طرق الدفع
            </h2>

            <div className="space-y-4">
              {Object.entries(storeSettings.paymentMethods).map(([methodId, method]) => {
                const gateway = storeSettings.paymentGateways[method.gateway];
                const isGatewayEnabled = gateway && gateway.enabled;
                
                return (
                  <div
                    key={methodId}
                    className={`p-4 border rounded-lg ${
                      method.enabled && isGatewayEnabled
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {method.logo ? (
                            <img 
                              src={method.logo} 
                              alt={method.name}
                              className="h-8 w-auto object-contain max-w-20 mr-2"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : (
                            <span className="text-2xl mr-2">{method.icon}</span>
                          )}
                          <h3 className="font-medium text-gray-900">{method.name}</h3>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              method.enabled && isGatewayEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {method.enabled && isGatewayEnabled ? 'متاحة' : 'غير متاحة'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        {method.fees && (
                          <p className="text-sm text-gray-600">
                            رسوم: {method.fees.percentage}% + {method.fees.fixed} ريال
                          </p>
                        )}
                        {method.installmentOptions && (
                          <p className="text-sm text-blue-600">
                            أقساط: {method.installmentOptions.join(', ')} بدون فوائد
                          </p>
                        )}
                        {gateway && (
                          <p className="text-xs text-gray-500">
                            عبر {gateway.name}
                            {!isGatewayEnabled && ' (بوابة غير مفعلة)'}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePaymentMethod(methodId)}
                          disabled={!isGatewayEnabled}
                          className={
                            !isGatewayEnabled
                              ? 'opacity-50 cursor-not-allowed'
                              : method.enabled
                              ? 'border-red-300 text-red-700 hover:bg-red-50'
                              : 'bg-green-600 hover:bg-green-700'
                          }
                        >
                          {method.enabled ? 'إلغاء التفعيل' : 'تفعيل'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* نموذج تعديل بوابة الدفع */}
        {showGatewayForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingGateway ? 'تعديل بوابة الدفع' : 'إضافة بوابة دفع جديدة'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gatewayName">اسم البوابة</Label>
                  <Input
                    id="gatewayName"
                    value={gatewayForm.name || ''}
                    onChange={(e) => setGatewayForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم البوابة"
                  />
                </div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="gatewayEnabled"
                      checked={gatewayForm.enabled || false}
                      onChange={(e) => setGatewayForm(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="gatewayEnabled" className="mr-2">مفعلة</Label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sandboxMode"
                      checked={gatewayForm.sandboxMode || false}
                      onChange={(e) => setGatewayForm(prev => ({ ...prev, sandboxMode: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="sandboxMode" className="mr-2">وضع تجريبي</Label>
                  </div>
                </div>
                
                {/* حقول إضافية حسب نوع البوابة */}
                {gatewayForm.id === 'stripe' && (
                  <>
                    <div>
                      <Label htmlFor="publishableKey">Publishable Key</Label>
                      <Input
                        id="publishableKey"
                        value={gatewayForm.publishableKey || ''}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, publishableKey: e.target.value }))}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="secretKey">Secret Key</Label>
                      <Input
                        id="secretKey"
                        type="password"
                        value={gatewayForm.secretKey || ''}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, secretKey: e.target.value }))}
                        placeholder="sk_test_..."
                      />
                    </div>
                  </>
                )}
                
                {gatewayForm.id === 'paypal' && (
                  <>
                    <div>
                      <Label htmlFor="clientId">Client ID</Label>
                      <Input
                        id="clientId"
                        value={gatewayForm.clientId || ''}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, clientId: e.target.value }))}
                        placeholder="أدخل Client ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <Input
                        id="clientSecret"
                        type="password"
                        value={gatewayForm.clientId || ''}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, clientSecret: e.target.value }))}
                        placeholder="أدخل Client Secret"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGatewayForm(false);
                    setEditingGateway(null);
                    setGatewayForm({});
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleGatewaySave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  حفظ
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPaymentMethods;
