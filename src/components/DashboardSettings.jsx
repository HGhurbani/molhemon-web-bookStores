import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  Building,
  CreditCard,
  ShoppingCart,
  MapPin,
  Bell,
  FileText,
  Link,
  Home,
  Store,
  Save,
  Eye,
  Upload,
  Plus,
  Edit,
  Trash2,
  Info,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
import api from '@/lib/api.js';

const SettingsNavigation = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'about', name: 'معلومات عنا', icon: Building },
    { id: 'store', name: 'تفاصيل المتجر', icon: Store },
    { id: 'checkout', name: 'الدفع', icon: ShoppingCart },
    { id: 'locations', name: 'المواقع', icon: MapPin },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'terms', name: 'الشروط والأحكام', icon: FileText },
    { id: 'connection', name: 'الاتصال', icon: Link }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
      {navItems.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === id 
              ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
};

// About Us Settings
const AboutUsSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    pageTitle: 'About Us',
    urlSlug: '/about-us',
    metaTitle: '',
    metaDescription: '',
    headerTitle: 'Get to Know Darmolhimon',
    headerSubtitle: 'Your trusted platform for books, eBooks, and audiobooks',
    mainDescription: 'how Darmolhimon started, what you believe in, and how you help readers today.',
    missionStatement: 'To make literature and knowledge accessible in every format for everyone, everywhere.',
    visionStatement: 'To be the leading digital and physical bookstore platform in Southeast Asia.',
    coreValues: [
      { icon: 'Accessibility icon.JPG', title: 'Accessibility', description: 'Short 1-2 sentence value explanation' }
    ],
    heroImage: '',
    companyName: '',
    establishedYear: '',
    contactEmail: '',
    whatsappPhone: '',
    status: 'active',
    ...settings?.about
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoreValueChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      coreValues: prev.coreValues.map((cv, i) => 
        i === index ? { ...cv, [field]: value } : cv
      )
    }));
  };

  const addCoreValue = () => {
    setFormData(prev => ({
      ...prev,
      coreValues: [...prev.coreValues, { icon: '', title: '', description: '' }]
    }));
  };

  const removeCoreValue = (index) => {
    setFormData(prev => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ about: formData });
      toast({ title: 'تم حفظ الإعدادات بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات معلومات عنا</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pageTitle">عنوان الصفحة</Label>
              <Input
                id="pageTitle"
                name="pageTitle"
                value={formData.pageTitle}
                onChange={handleChange}
                placeholder="About Us"
              />
            </div>
            
            <div>
              <Label htmlFor="urlSlug">رابط الصفحة</Label>
              <Input
                id="urlSlug"
                name="urlSlug"
                value={formData.urlSlug}
                onChange={handleChange}
                placeholder="/about-us"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="metaTitle">عنوان SEO</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Meta title for SEO"
              />
            </div>
            
            <div>
              <Label htmlFor="metaDescription">وصف SEO</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Meta description for SEO"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headerTitle">عنوان الرأس</Label>
            <Input
              id="headerTitle"
              name="headerTitle"
              value={formData.headerTitle}
              onChange={handleChange}
              placeholder="Get to Know Darmolhimon"
            />
          </div>

          <div>
            <Label htmlFor="headerSubtitle">العنوان الفرعي</Label>
            <Input
              id="headerSubtitle"
              name="headerSubtitle"
              value={formData.headerSubtitle}
              onChange={handleChange}
              placeholder="Your trusted platform for books, eBooks, and audiobooks"
            />
          </div>

          <div>
            <Label htmlFor="mainDescription">الوصف الرئيسي</Label>
            <Textarea
              id="mainDescription"
              name="mainDescription"
              value={formData.mainDescription}
              onChange={handleChange}
              placeholder="Main description about the company"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="missionStatement">الرسالة</Label>
            <Textarea
              id="missionStatement"
              name="missionStatement"
              value={formData.missionStatement}
              onChange={handleChange}
              placeholder="Company mission statement"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="visionStatement">الرؤية</Label>
            <Textarea
              id="visionStatement"
              name="visionStatement"
              value={formData.visionStatement}
              onChange={handleChange}
              placeholder="Company vision statement"
              rows={3}
            />
          </div>

          <div>
            <Label>القيم الأساسية</Label>
            <div className="space-y-4">
              {formData.coreValues.map((value, index) => (
                <div key={index} className="flex space-x-4 rtl:space-x-reverse">
                  <Input
                    placeholder="Icon filename"
                    value={value.icon}
                    onChange={(e) => handleCoreValueChange(index, 'icon', e.target.value)}
                    className="w-1/4"
                  />
                  <Input
                    placeholder="Title"
                    value={value.title}
                    onChange={(e) => handleCoreValueChange(index, 'title', e.target.value)}
                    className="w-1/4"
                  />
                  <Input
                    placeholder="Description"
                    value={value.description}
                    onChange={(e) => handleCoreValueChange(index, 'description', e.target.value)}
                    className="w-1/2"
                  />
                  <Button
                    type="button"
                    onClick={() => removeCoreValue(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addCoreValue}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة قيمة
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              حفظ الصفحة
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Checkout Settings
const CheckoutSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    contactMethod: 'phone',
    requirePhone: true,
    requireAddress: true,
    allowGuestCheckout: true,
    ...settings?.checkout
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ checkout: formData });
      toast({ title: 'تم حفظ إعدادات الدفع بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات الدفع</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="contactMethod">طريقة التواصل المفضلة</Label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="phone">الهاتف</option>
              <option value="email">البريد الإلكتروني</option>
              <option value="both">كلاهما</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requirePhone"
                name="requirePhone"
                checked={formData.requirePhone}
                onChange={(e) => setFormData(prev => ({ ...prev, requirePhone: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="requirePhone" className="mr-2">طلب رقم الهاتف</Label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireAddress"
                name="requireAddress"
                checked={formData.requireAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, requireAddress: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="requireAddress" className="mr-2">طلب العنوان</Label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowGuestCheckout"
                name="allowGuestCheckout"
                checked={formData.allowGuestCheckout}
                onChange={(e) => setFormData(prev => ({ ...prev, allowGuestCheckout: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="allowGuestCheckout" className="mr-2">السماح بالدفع كضيف</Label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Store Details Settings
const StoreDetailsSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    storeName: 'Darmolhimon',
    storeDescription: 'Your trusted platform for books, eBooks, and audiobooks',
    storeEmail: 'info@darmolhimon.com',
    storePhone: '+966 50 123 4567',
    storeAddress: 'Riyadh, Saudi Arabia',
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '14:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false }
    },
    ...settings?.store
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ store: formData });
      toast({ title: 'تم حفظ إعدادات المتجر بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">تفاصيل المتجر</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="storeName">اسم المتجر</Label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Darmolhimon"
              />
            </div>
            
            <div>
              <Label htmlFor="storeEmail">البريد الإلكتروني</Label>
              <Input
                id="storeEmail"
                name="storeEmail"
                type="email"
                value={formData.storeEmail}
                onChange={handleChange}
                placeholder="info@darmolhimon.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="storeDescription">وصف المتجر</Label>
            <Textarea
              id="storeDescription"
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              placeholder="Store description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="storePhone">رقم الهاتف</Label>
              <Input
                id="storePhone"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                placeholder="+966 50 123 4567"
              />
            </div>
            
            <div>
              <Label htmlFor="storeAddress">العنوان</Label>
              <Input
                id="storeAddress"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                placeholder="Riyadh, Saudi Arabia"
              />
            </div>
          </div>

          <div>
            <Label>ساعات العمل</Label>
            <div className="space-y-3 mt-2">
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-20 text-sm font-medium capitalize">{day}</div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">مفتوح</span>
                  </div>
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span>إلى</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};


// Locations Settings
const LocationsSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    locations: [
      {
        id: 1,
        name: 'الفرع الرئيسي',
        address: 'الرياض، المملكة العربية السعودية',
        phone: '+966 50 123 4567',
        email: 'main@darmolhimon.com',
        coordinates: { lat: 24.7136, lng: 46.6753 },
        isActive: true
      }
    ],
    ...settings?.locations
  });

  const handleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => 
        i === index ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, {
        id: Date.now(),
        name: '',
        address: '',
        phone: '',
        email: '',
        coordinates: { lat: 0, lng: 0 },
        isActive: true
      }]
    }));
  };

  const removeLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ locations: formData });
      toast({ title: 'تم حفظ المواقع بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إدارة المواقع</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.locations.map((location, index) => (
            <div key={location.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">الموقع {index + 1}</h3>
                <Button
                  type="button"
                  onClick={() => removeLocation(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم الموقع</Label>
                  <Input
                    value={location.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="الفرع الرئيسي"
                  />
                </div>
                
                <div>
                  <Label>العنوان</Label>
                  <Input
                    value={location.address}
                    onChange={(e) => handleChange(index, 'address', e.target.value)}
                    placeholder="الرياض، المملكة العربية السعودية"
                  />
                </div>
                
                <div>
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={location.phone}
                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                    placeholder="+966 50 123 4567"
                  />
                </div>
                
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={location.email}
                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                    placeholder="main@darmolhimon.com"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={location.isActive}
                    onChange={(e) => handleChange(index, 'isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label className="mr-2">نشط</Label>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            onClick={addLocation}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة موقع جديد
          </Button>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Notifications Settings
const NotificationsSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    emailNotifications: {
      newOrder: true,
      orderUpdate: true,
      paymentReceived: true,
      lowStock: true,
      newCustomer: false
    },
    smsNotifications: {
      newOrder: false,
      orderUpdate: false,
      paymentReceived: false
    },
    pushNotifications: {
      newOrder: true,
      orderUpdate: true,
      paymentReceived: true
    },
    ...settings?.notifications
  });

  const handleNotificationChange = (type, key, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ notifications: formData });
      toast({ title: 'تم حفظ إعدادات الإشعارات بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات الإشعارات</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">الإشعارات الإلكترونية</h3>
            <div className="space-y-3">
              {Object.entries(formData.emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    {key === 'newOrder' && 'طلب جديد'}
                    {key === 'orderUpdate' && 'تحديث الطلب'}
                    {key === 'paymentReceived' && 'استلام الدفع'}
                    {key === 'lowStock' && 'مخزون منخفض'}
                    {key === 'newCustomer' && 'عميل جديد'}
                  </Label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange('emailNotifications', key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">إشعارات SMS</h3>
            <div className="space-y-3">
              {Object.entries(formData.smsNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    {key === 'newOrder' && 'طلب جديد'}
                    {key === 'orderUpdate' && 'تحديث الطلب'}
                    {key === 'paymentReceived' && 'استلام الدفع'}
                  </Label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange('smsNotifications', key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">الإشعارات الفورية</h3>
            <div className="space-y-3">
              {Object.entries(formData.pushNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    {key === 'newOrder' && 'طلب جديد'}
                    {key === 'orderUpdate' && 'تحديث الطلب'}
                    {key === 'paymentReceived' && 'استلام الدفع'}
                  </Label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange('pushNotifications', key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Terms Settings
const TermsSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    termsOfService: '',
    privacyPolicy: '',
    returnPolicy: '',
    shippingPolicy: '',
    ...settings?.terms
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ terms: formData });
      toast({ title: 'تم حفظ السياسات بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">الشروط والسياسات</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="termsOfService">شروط الخدمة</Label>
            <Textarea
              id="termsOfService"
              name="termsOfService"
              value={formData.termsOfService}
              onChange={handleChange}
              placeholder="Terms of service content"
              rows={8}
            />
          </div>

          <div>
            <Label htmlFor="privacyPolicy">سياسة الخصوصية</Label>
            <Textarea
              id="privacyPolicy"
              name="privacyPolicy"
              value={formData.privacyPolicy}
              onChange={handleChange}
              placeholder="Privacy policy content"
              rows={8}
            />
          </div>

          <div>
            <Label htmlFor="returnPolicy">سياسة الإرجاع</Label>
            <Textarea
              id="returnPolicy"
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleChange}
              placeholder="Return policy content"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="shippingPolicy">سياسة الشحن</Label>
            <Textarea
              id="shippingPolicy"
              name="shippingPolicy"
              value={formData.shippingPolicy}
              onChange={handleChange}
              placeholder="Shipping policy content"
              rows={6}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Connection Settings
const ConnectionSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    socialMedia: {
      facebook: { url: '', enabled: false },
      instagram: { url: '', enabled: false },
      twitter: { url: '', enabled: false },
      youtube: { url: '', enabled: false },
      linkedin: { url: '', enabled: false }
    },
    whatsapp: {
      number: '',
      message: 'Hi, I\'d like to ask about a product.',
      enabled: false
    },
    ...settings?.connection
  });

  const handleSocialChange = (platform, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: {
          ...prev.socialMedia[platform],
          [field]: value
        }
      }
    }));
  };

  const handleWhatsAppChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ connection: formData });
      toast({ title: 'تم حفظ إعدادات الاتصال بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات الاتصال</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">وسائل التواصل الاجتماعي</h3>
            <div className="space-y-4">
              {Object.entries(formData.socialMedia).map(([platform, data]) => (
                <div key={platform} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-24 text-sm font-medium capitalize">{platform}</div>
                  <Input
                    value={data.url}
                    onChange={(e) => handleSocialChange(platform, 'url', e.target.value)}
                    placeholder={`https://${platform}.com/yourpage`}
                    className="flex-1"
                  />
                  <input
                    type="checkbox"
                    checked={data.enabled}
                    onChange={(e) => handleSocialChange(platform, 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">واتساب</h3>
            <div className="space-y-4">
              <div>
                <Label>رقم الواتساب</Label>
                <Input
                  value={formData.whatsapp.number}
                  onChange={(e) => handleWhatsAppChange('number', e.target.value)}
                  placeholder="+966 50 123 4567"
                />
              </div>
              <div>
                <Label>الرسالة الافتراضية</Label>
                <Textarea
                  value={formData.whatsapp.message}
                  onChange={(e) => handleWhatsAppChange('message', e.target.value)}
                  placeholder="Hi, I'd like to ask about a product."
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.whatsapp.enabled}
                  onChange={(e) => handleWhatsAppChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label className="mr-2">تفعيل الواتساب</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Main DashboardSettings Component
const DashboardSettings = ({ settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [saving, setSaving] = useState(false);

  const handleSave = async (data) => {
    try {
      setSaving(true);
      const updatedSettings = { ...settings, ...data };
      setSettings(updatedSettings);
      
      // Save to API
      await api.storeSettings.updateStoreSettings(updatedSettings);
      
      toast({ title: 'تم حفظ الإعدادات بنجاح!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ 
        title: 'خطأ في حفظ الإعدادات', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'about':
        return <AboutUsSettings settings={settings} onSave={handleSave} />;
      case 'store':
        return <StoreDetailsSettings settings={settings} onSave={handleSave} />;
      case 'checkout':
        return <CheckoutSettings settings={settings} onSave={handleSave} />;
      case 'locations':
        return <LocationsSettings settings={settings} onSave={handleSave} />;
      case 'notifications':
        return <NotificationsSettings settings={settings} onSave={handleSave} />;
      case 'terms':
        return <TermsSettings settings={settings} onSave={handleSave} />;
      case 'connection':
        return <ConnectionSettings settings={settings} onSave={handleSave} />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الإعدادات</h2>
            <p className="text-gray-600">هذا القسم قيد التطوير.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">الإعدادات</h1>
        <SettingsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {renderActiveTab()}
    </div>
  );
};

export default DashboardSettings;
