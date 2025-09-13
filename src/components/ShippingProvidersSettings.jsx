import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  Truck,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  Package,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';

const ShippingProvidersSettings = () => {
  const { t } = useTranslation();
  
  // حالة البيانات
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // حالة النماذج
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  
  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: '🚚',
    enabled: false,
    testMode: false,
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    webhookSecret: '',
    supportedCountries: ['SA'],
    supportedRegions: [],
    weightUnit: 'kg',
    currency: 'SAR',
    baseRate: 0,
    perKgRate: 0,
    maxWeight: 50,
    minWeight: 0.1,
    deliveryTime: {
      min: 1,
      max: 7
    },
    features: {
      tracking: false,
      insurance: false,
      express: false,
      pickup: false
    }
  });

  // مزودي الشحن المحليين
  const localShippingProviders = [
    {
      name: 'saudiPost',
      displayName: 'البريد السعودي',
      description: 'خدمة الشحن الرسمية للمملكة العربية السعودية',
      icon: '📮',
      supportedCountries: ['SA'],
      features: {
        tracking: true,
        insurance: true,
        express: true,
        pickup: true
      }
    },
    {
      name: 'aramex',
      displayName: 'أرامكس',
      description: 'خدمة الشحن السريع العالمية',
      icon: '🚛',
      supportedCountries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA'],
      features: {
        tracking: true,
        insurance: true,
        express: true,
        pickup: true
      }
    },
    {
      name: 'dhl',
      displayName: 'DHL',
      description: 'خدمة الشحن العالمية السريعة',
      icon: '📦',
      supportedCountries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'EG', 'JO', 'LB'],
      features: {
        tracking: true,
        insurance: true,
        express: true,
        pickup: true
      }
    },
    {
      name: 'fedex',
      displayName: 'FedEx',
      description: 'خدمة الشحن العالمية الموثوقة',
      icon: '✈️',
      supportedCountries: ['SA', 'AE', 'KW', 'BH', 'OM', 'QA', 'EG', 'JO', 'LB'],
      features: {
        tracking: true,
        insurance: true,
        express: true,
        pickup: true
      }
    },
    {
      name: 'naqel',
      displayName: 'ناقل',
      description: 'خدمة الشحن المحلية السريعة',
      icon: '🚚',
      supportedCountries: ['SA'],
      features: {
        tracking: true,
        insurance: false,
        express: true,
        pickup: true
      }
    }
  ];

  useEffect(() => {
    loadShippingProviders();
  }, []);

  // جلب مزودي الشحن
  const loadShippingProviders = async () => {
    try {
      setLoading(true);
      // محاكاة جلب البيانات من API
      const mockProviders = localShippingProviders.map(provider => ({
        ...provider,
        enabled: false,
        testMode: false,
        apiKey: '',
        secretKey: '',
        webhookUrl: '',
        webhookSecret: '',
        baseRate: 15,
        perKgRate: 2,
        maxWeight: 50,
        minWeight: 0.1,
        deliveryTime: { min: 1, max: 7 },
        connected: false
      }));
      
      setProviders(mockProviders);
    } catch (error) {
      console.error('Failed to load shipping providers:', error);
      toast({
        title: 'فشل في تحميل مزودي الشحن',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // حفظ إعدادات المزود
  const saveProviderSettings = async (providerName, settings) => {
    try {
      setSaving(true);
      
      // محاكاة حفظ البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProviders(prev => prev.map(provider => 
        provider.name === providerName 
          ? { ...provider, ...settings, connected: true }
          : provider
      ));
      
      toast({
        title: 'تم حفظ الإعدادات بنجاح',
        variant: 'success'
      });
      
      setShowAddForm(false);
      setEditingProvider(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save provider settings:', error);
      toast({
        title: 'فشل في حفظ الإعدادات',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // اختبار الاتصال
  const testConnection = async (providerName) => {
    try {
      const provider = providers.find(p => p.name === providerName);
      if (!provider) return;
      
      // محاكاة اختبار الاتصال
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'تم اختبار الاتصال بنجاح',
        description: 'الاتصال بمزود الشحن يعمل بشكل صحيح',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'فشل في اختبار الاتصال',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // إلغاء ربط المزود
  const disconnectProvider = async (providerName) => {
    try {
      setProviders(prev => prev.map(provider => 
        provider.name === providerName 
          ? { ...provider, enabled: false, connected: false }
          : provider
      ));
      
      toast({
        title: 'تم إلغاء الربط بنجاح',
        variant: 'success'
      });
    } catch (error) {
      console.error('Failed to disconnect provider:', error);
      toast({
        title: 'فشل في إلغاء الربط',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      icon: '🚚',
      enabled: false,
      testMode: false,
      apiKey: '',
      secretKey: '',
      webhookUrl: '',
      webhookSecret: '',
      supportedCountries: ['SA'],
      supportedRegions: [],
      weightUnit: 'kg',
      currency: 'SAR',
      baseRate: 0,
      perKgRate: 0,
      maxWeight: 50,
      minWeight: 0.1,
      deliveryTime: {
        min: 1,
        max: 7
      },
      features: {
        tracking: false,
        insurance: false,
        express: false,
        pickup: false
      }
    });
  };

  // فتح نموذج التعديل
  const openEditForm = (provider) => {
    setEditingProvider(provider);
    setFormData({
      ...provider,
      supportedCountries: provider.supportedCountries || ['SA'],
      supportedRegions: provider.supportedRegions || [],
      deliveryTime: provider.deliveryTime || { min: 1, max: 7 },
      features: provider.features || {
        tracking: false,
        insurance: false,
        express: false,
        pickup: false
      }
    });
    setShowAddForm(true);
  };

  // معالجة تقديم النموذج
  const handleSubmit = (e) => {
    e.preventDefault();
    const providerName = editingProvider ? editingProvider.name : formData.name;
    saveProviderSettings(providerName, formData);
  };

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            مزودي الشحن
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            إدارة مزودي الشحن وطرق التوصيل المتاحة
          </p>
        </div>
        
        <Button
          onClick={() => {
            setEditingProvider(null);
            resetForm();
            setShowAddForm(true);
          }}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة مزود جديد
        </Button>
      </div>

      {/* قائمة مزودي الشحن */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">جاري التحميل...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div key={provider.name} className={`border rounded-lg p-4 transition-all duration-200 ${
              provider.connected ? 'ring-2 ring-green-200' : ''
            } ${provider.enabled ? 'border-blue-200' : 'border-gray-200 bg-gray-50'}`}>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{provider.displayName}</h3>
                    <p className="text-sm text-gray-500">
                      {provider.connected ? 'متصل' : 'غير متصل'}
                    </p>
                    <p className="text-xs text-gray-400">{provider.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={provider.enabled}
                    onChange={(e) => {
                      setProviders(prev => prev.map(p => 
                        p.name === provider.name 
                          ? { ...p, enabled: e.target.checked }
                          : p
                      ));
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {provider.connected ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection(provider.name)}
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      اختبار الاتصال
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditForm(provider)}
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      تعديل الإعدادات
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => disconnectProvider(provider.name)}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      إلغاء الربط
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => openEditForm(provider)}
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    إعداد المزود
                  </Button>
                )}
              </div>

              {/* ميزات المزود */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {provider.features?.tracking && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white">
                      <Package className="w-3 h-3 mr-1" />
                      تتبع
                    </span>
                  )}
                  {provider.features?.insurance && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <DollarSign className="w-3 h-3 mr-1" />
                      تأمين
                    </span>
                  )}
                  {provider.features?.express && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      سريع
                    </span>
                  )}
                  {provider.features?.pickup && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      استلام
                    </span>
                  )}
                </div>
              </div>

              {/* معلومات الشحن */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>السعر الأساسي: {provider.baseRate} {provider.currency}</p>
                  <p>سعر الكيلو: {provider.perKgRate} {provider.currency}</p>
                  <p>الوزن الأقصى: {provider.maxWeight} {provider.weightUnit}</p>
                  <p>مدة التوصيل: {provider.deliveryTime?.min}-{provider.deliveryTime?.max} أيام</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نموذج إضافة/تعديل مزود */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingProvider ? 'تعديل مزود الشحن' : 'إضافة مزود شحن جديد'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProvider(null);
                  resetForm();
                }}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم المزود</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="اسم المزود"
                    disabled={!!editingProvider}
                  />
                </div>
                <div>
                  <Label>الاسم المعروض</Label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="الاسم المعروض للعملاء"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>الوصف</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف المزود"
                  />
                </div>
              </div>

              {/* إعدادات API */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="مفتاح API"
                  />
                </div>
                <div>
                  <Label>Secret Key</Label>
                  <Input
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
                    placeholder="المفتاح السري"
                  />
                </div>
                <div>
                  <Label>Webhook URL</Label>
                  <Input
                    value={formData.webhookUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="رابط Webhook"
                  />
                </div>
                <div>
                  <Label>Webhook Secret</Label>
                  <Input
                    type="password"
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhookSecret: e.target.value }))}
                    placeholder="سر Webhook"
                  />
                </div>
              </div>

              {/* إعدادات الأسعار */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>السعر الأساسي</Label>
                  <Input
                    type="number"
                    value={formData.baseRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseRate: parseFloat(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>سعر الكيلو</Label>
                  <Input
                    type="number"
                    value={formData.perKgRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, perKgRate: parseFloat(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>الوزن الأقصى (كجم)</Label>
                  <Input
                    type="number"
                    value={formData.maxWeight}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxWeight: parseFloat(e.target.value) }))}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label>الوزن الأدنى (كجم)</Label>
                  <Input
                    type="number"
                    value={formData.minWeight}
                    onChange={(e) => setFormData(prev => ({ ...prev, minWeight: parseFloat(e.target.value) }))}
                    placeholder="0.1"
                  />
                </div>
              </div>

              {/* مدة التوصيل */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>أقل مدة توصيل (أيام)</Label>
                  <Input
                    type="number"
                    value={formData.deliveryTime.min}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      deliveryTime: { ...prev.deliveryTime, min: parseInt(e.target.value) }
                    }))}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>أقصى مدة توصيل (أيام)</Label>
                  <Input
                    type="number"
                    value={formData.deliveryTime.max}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      deliveryTime: { ...prev.deliveryTime, max: parseInt(e.target.value) }
                    }))}
                    placeholder="7"
                  />
                </div>
              </div>

              {/* الميزات */}
              <div>
                <Label>الميزات المتاحة</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.features.tracking}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, tracking: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-white">تتبع الشحن</span>
                  </label>
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.features.insurance}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, insurance: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">تأمين الشحن</span>
                  </label>
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.features.express}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, express: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">شحن سريع</span>
                  </label>
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.features.pickup}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        features: { ...prev.features, pickup: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">استلام من الموقع</span>
                  </label>
                </div>
              </div>

              {/* خيارات إضافية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">تفعيل المزود</span>
                </label>
                <label className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.testMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, testMode: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">وضع الاختبار</span>
                </label>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProvider(null);
                    resetForm();
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'جاري الحفظ...' : (editingProvider ? 'تحديث' : 'إضافة')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingProvidersSettings;
