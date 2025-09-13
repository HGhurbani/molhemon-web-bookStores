import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api.js';
import { errorHandler } from '../lib/errorHandler.js';

const StoreSettingsPage = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const storeSettings = await api.storeSettings.getStoreSettings();
      setSettings(storeSettings);
    } catch (error) {
      showMessage('error', errorHandler.getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (section, data) => {
    try {
      setSaving(true);
      await api.storeSettings.updateStoreSettings(data);
      showMessage('success', 'تم حفظ الإعدادات بنجاح');
      await loadSettings(); // إعادة تحميل الإعدادات
    } catch (error) {
      showMessage('error', errorHandler.getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingMethodToggle = (methodId, enabled) => {
    setSettings(prev => ({
      ...prev,
      shippingMethods: {
        ...prev.shippingMethods,
        [methodId]: {
          ...prev.shippingMethods[methodId],
          enabled
        }
      }
    }));
  };

  const handlePaymentMethodToggle = (methodId, enabled) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [methodId]: {
          ...prev.paymentMethods[methodId],
          enabled
        }
      }
    }));
  };

  const handleGatewayToggle = (gatewayId, enabled) => {
    setSettings(prev => ({
      ...prev,
      paymentGateways: {
        ...prev.paymentGateways,
        [gatewayId]: {
          ...prev.paymentGateways[gatewayId],
          enabled
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">فشل في تحميل الإعدادات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إعدادات المتجر</h1>
          <p className="mt-2 text-gray-600">إدارة جميع إعدادات المتجر والدفع والشحن</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'general', name: 'عام', icon: '⚙️' },
                { id: 'shipping', name: 'الشحن', icon: '🚚' },
                { id: 'payment', name: 'الدفع', icon: '💳' },
                { id: 'taxes', name: 'الضرائب', icon: '📊' },
                { id: 'orders', name: 'الطلبات', icon: '📦' },
                { id: 'customers', name: 'العملاء', icon: '👥' },
                { id: 'notifications', name: 'الإشعارات', icon: '🔔' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'general' && (
              <GeneralSettings 
                settings={settings} 
                onSave={handleSave}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}

            {activeTab === 'shipping' && (
              <ShippingSettings 
                settings={settings} 
                onSave={handleSave}
                onMethodToggle={handleShippingMethodToggle}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}

            {activeTab === 'payment' && (
              <PaymentSettings 
                settings={settings} 
                onSave={handleSave}
                onMethodToggle={handlePaymentMethodToggle}
                onGatewayToggle={handleGatewayToggle}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}

            {activeTab === 'taxes' && (
              <TaxSettings 
                settings={settings} 
                onSave={handleSave}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}

            {activeTab === 'orders' && (
              <OrderSettings 
                settings={settings} 
                onSave={handleSave}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerSettings 
                settings={settings} 
                onSave={handleSave}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings 
                settings={settings} 
                onSave={handleSave}
                onInputChange={handleInputChange}
                saving={saving}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings = ({ settings, onSave, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      storeName: settings.storeName,
      storeDescription: settings.storeDescription,
      storeEmail: settings.storeEmail,
      storePhone: settings.storePhone,
      defaultCurrency: settings.defaultCurrency,
      currencySymbol: settings.currencySymbol
    };
    onSave('general', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">الإعدادات العامة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المتجر
          </label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) => onInputChange('storeName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف المتجر
          </label>
          <textarea
            value={settings.storeDescription}
            onChange={(e) => onInputChange('storeDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={settings.storeEmail}
            onChange={(e) => onInputChange('storeEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={settings.storePhone}
            onChange={(e) => onInputChange('storePhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العملة الافتراضية
          </label>
          <select
            value={settings.defaultCurrency}
            onChange={(e) => onInputChange('defaultCurrency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="USD">دولار أمريكي (USD)</option>
            <option value="EUR">يورو (EUR)</option>
            <option value="GBP">جنيه إسترليني (GBP)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رمز العملة
          </label>
          <input
            type="text"
            value={settings.currencySymbol}
            onChange={(e) => onInputChange('currencySymbol', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات العامة'}
        </button>
      </div>
    </div>
  );
};

// Shipping Settings Component
const ShippingSettings = ({ settings, onSave, onMethodToggle, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      shippingEnabled: settings.shippingEnabled,
      freeShippingThreshold: settings.freeShippingThreshold,
      shippingMethods: settings.shippingMethods
    };
    onSave('shipping', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">إعدادات الشحن</h3>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.shippingEnabled}
            onChange={(e) => onInputChange('shippingEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل الشحن
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حد الشحن المجاني (ريال)
          </label>
          <input
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) => onInputChange('freeShippingThreshold', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">طرق الشحن</h4>
          <div className="space-y-4">
            {Object.entries(settings.shippingMethods).map(([methodId, method]) => (
              <div key={methodId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{method.name}</h5>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  <p className="text-sm text-gray-500">التكلفة: {method.cost} ريال</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={(e) => onMethodToggle(methodId, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الشحن'}
        </button>
      </div>
    </div>
  );
};

// Payment Settings Component
const PaymentSettings = ({ settings, onSave, onMethodToggle, onGatewayToggle, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      paymentEnabled: settings.paymentEnabled,
      paymentMethods: settings.paymentMethods,
      paymentGateways: settings.paymentGateways
    };
    onSave('payment', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">إعدادات الدفع</h3>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.paymentEnabled}
            onChange={(e) => onInputChange('paymentEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل الدفع
          </label>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">طرق الدفع</h4>
          <div className="space-y-4">
            {Object.entries(settings.paymentMethods).map(([methodId, method]) => {
              // البحث عن بوابة الدفع المرتبطة
              const gateway = settings.paymentGateways[method.gateway];
              const isGatewayEnabled = gateway?.enabled;
              
              return (
                <div key={methodId} className={`p-4 border rounded-lg ${
                  isGatewayEnabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <h5 className="font-medium text-gray-900">{method.name}</h5>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={method.enabled && isGatewayEnabled}
                        onChange={(e) => onMethodToggle(methodId, e.target.checked)}
                        disabled={!isGatewayEnabled}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="mr-2 text-sm text-gray-600">
                        {method.enabled && isGatewayEnabled ? 'مفعل' : 'غير مفعل'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">الرسوم:</p>
                      <p className="text-sm text-gray-600">
                        {method.fees.percentage}% + {method.fees.fixed} ريال
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">بوابة الدفع:</p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isGatewayEnabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {gateway?.name || 'غير محدد'}
                          {!isGatewayEnabled && ' (غير مفعل)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* حالة الطريقة */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        الحالة: 
                        <span className={`mr-1 font-medium ${
                          method.enabled && isGatewayEnabled ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {method.enabled && isGatewayEnabled ? 'متاحة للعملاء' : 'غير متاحة'}
                        </span>
                      </span>
                      {method.enabled && isGatewayEnabled ? (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          ✓ متاحة
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          {!isGatewayEnabled ? 'بوابة الدفع غير مفعلة' : 'غير مفعلة'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">بوابات الدفع</h4>
          <div className="space-y-4">
            {Object.entries(settings.paymentGateways).map(([gatewayId, gateway]) => (
              <div key={gatewayId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{gateway.name}</h5>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={gateway.enabled}
                      onChange={(e) => onGatewayToggle(gatewayId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="mr-2 text-sm text-gray-600">
                      {gateway.enabled ? 'مفعل' : 'غير مفعل'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">الطرق المدعومة:</p>
                    <div className="flex flex-wrap gap-1">
                      {gateway.supportedMethods.map((methodId) => {
                        const method = settings.paymentMethods[methodId];
                        return (
                          <span
                            key={methodId}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              method?.enabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {method?.icon || '💳'} {method?.name || methodId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">العملات المدعومة:</p>
                    <div className="flex flex-wrap gap-1">
                      {gateway.supportedCurrencies.map((currency) => (
                        <span
                          key={currency}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {currency}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* إعدادات بوابة الدفع */}
                {gateway.enabled && gateway.config && Object.keys(gateway.config).length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">إعدادات {gateway.name}:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(gateway.config).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {key === 'publishableKey' ? 'مفتاح النشر' :
                             key === 'secretKey' ? 'المفتاح السري' :
                             key === 'clientId' ? 'معرف العميل' :
                             key === 'clientSecret' ? 'السر' :
                             key === 'merchantId' ? 'معرف التاجر' :
                             key === 'terminalId' ? 'معرف المحطة' :
                             key === 'apiKey' ? 'مفتاح API' :
                             key === 'mode' ? 'الوضع' : key}
                          </label>
                          <input
                            type={key.includes('Key') || key.includes('Secret') || key.includes('Id') ? 'password' : 'text'}
                            value={value || ''}
                            onChange={(e) => onInputChange(`paymentGateways.${gatewayId}.config.${key}`, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={`أدخل ${key === 'publishableKey' ? 'مفتاح النشر' :
                                         key === 'secretKey' ? 'المفتاح السري' :
                                         key === 'clientId' ? 'معرف العميل' :
                                         key === 'clientSecret' ? 'السر' :
                                         key === 'merchantId' ? 'معرف التاجر' :
                                         key === 'terminalId' ? 'معرف المحطة' :
                                         key === 'apiKey' ? 'مفتاح API' :
                                         key === 'mode' ? 'الوضع' : key}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* حالة الربط */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      الحالة: 
                      <span className={`mr-1 font-medium ${
                        gateway.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {gateway.enabled ? 'مفعل ومتصل' : 'غير مفعل'}
                      </span>
                    </span>
                    {gateway.enabled && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✓ متاح للعملاء
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الدفع'}
        </button>
      </div>
    </div>
  );
};

// Tax Settings Component
const TaxSettings = ({ settings, onSave, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      taxEnabled: settings.taxEnabled,
      taxRate: settings.taxRate,
      taxIncluded: settings.taxIncluded
    };
    onSave('taxes', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">إعدادات الضرائب</h3>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.taxEnabled}
            onChange={(e) => onInputChange('taxEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل الضرائب
          </label>
        </div>

        {settings.taxEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة الضريبة (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.taxRate * 100}
                onChange={(e) => onInputChange('taxRate', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.taxIncluded}
                onChange={(e) => onInputChange('taxIncluded', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="mr-2 text-sm font-medium text-gray-700">
                الضريبة مشمولة في السعر
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الضرائب'}
        </button>
      </div>
    </div>
  );
};

// Order Settings Component
const OrderSettings = ({ settings, onSave, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      orderAutoConfirmation: settings.orderAutoConfirmation,
      orderCancellationWindow: settings.orderCancellationWindow,
      minOrderAmount: settings.minOrderAmount,
      maxOrderAmount: settings.maxOrderAmount
    };
    onSave('orders', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">إعدادات الطلبات</h3>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.orderAutoConfirmation}
            onChange={(e) => onInputChange('orderAutoConfirmation', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تأكيد الطلبات تلقائياً
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نافذة إلغاء الطلب (ساعات)
          </label>
          <input
            type="number"
            value={settings.orderCancellationWindow}
            onChange={(e) => onInputChange('orderCancellationWindow', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأدنى للطلب (ريال)
          </label>
          <input
            type="number"
            value={settings.minOrderAmount}
            onChange={(e) => onInputChange('minOrderAmount', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأقصى للطلب (ريال)
          </label>
          <input
            type="number"
            value={settings.maxOrderAmount}
            onChange={(e) => onInputChange('maxOrderAmount', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الطلبات'}
        </button>
      </div>
    </div>
  );
};

// Customer Settings Component
const CustomerSettings = ({ settings, onSave, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      guestCheckout: settings.guestCheckout,
      customerRegistration: settings.customerRegistration,
      customerVerification: settings.customerVerification
    };
    onSave('customers', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">إعدادات العملاء</h3>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.guestCheckout}
            onChange={(e) => onInputChange('guestCheckout', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            السماح بالشراء كزائر
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.customerRegistration}
            onChange={(e) => onInputChange('customerRegistration', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل تسجيل العملاء
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.customerVerification}
            onChange={(e) => onInputChange('customerVerification', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل التحقق من العملاء
          </label>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات العملاء'}
        </button>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ settings, onSave, onInputChange, saving }) => {
  const handleSave = () => {
    const data = {
      emailNotifications: settings.emailNotifications,
      smsNotifications: settings.smsNotifications,
      pushNotifications: settings.pushNotifications
    };
    onSave('notifications', data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">إعدادات الإشعارات</h3>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => onInputChange('emailNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل إشعارات البريد الإلكتروني
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => onInputChange('smsNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل إشعارات الرسائل النصية
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) => onInputChange('pushNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-2 text-sm font-medium text-gray-700">
            تفعيل الإشعارات الفورية
          </label>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الإشعارات'}
        </button>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
