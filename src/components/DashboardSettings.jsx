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
  Truck,
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
import paymentApi, { paymentMethodConfigs, paymentUtils } from '@/lib/paymentApi.js';

const SettingsNavigation = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'about', name: 'معلومات عنا', icon: Building },
    { id: 'store', name: 'تفاصيل المتجر', icon: Store },
    { id: 'payments', name: 'المدفوعات', icon: CreditCard },
    { id: 'checkout', name: 'الدفع', icon: ShoppingCart },
    { id: 'shipping', name: 'الشحن والتوصيل', icon: Truck },
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
          {/* General Page Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">إعدادات الصفحة العامة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input
                  id="pageTitle"
                  name="pageTitle"
                  value={formData.pageTitle}
                  onChange={handleChange}
                  placeholder="Default: 'About Us'"
                />
              </div>
              <div>
                <Label htmlFor="urlSlug">URL Slug</Label>
                <Input
                  id="urlSlug"
                  name="urlSlug"
                  value={formData.urlSlug}
                  onChange={handleChange}
                  placeholder="Default: /about-us"
                />
              </div>
              <div>
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Displayed in browser tab and used by search engines."
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Input
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Short summary for search engine snippet (max 160 characters)"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">المحتوى الرئيسي</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="headerTitle">Header Title</Label>
                <Input
                  id="headerTitle"
                  name="headerTitle"
                  value={formData.headerTitle}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="headerSubtitle">Header Subtitle (Optional)</Label>
                <Input
                  id="headerSubtitle"
                  name="headerSubtitle"
                  value={formData.headerSubtitle}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="mainDescription">Main Description / Story</Label>
                <Textarea
                  id="mainDescription"
                  name="mainDescription"
                  value={formData.mainDescription}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">الرسالة والرؤية</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="missionStatement">Mission Statement</Label>
                <Input
                  id="missionStatement"
                  name="missionStatement"
                  value={formData.missionStatement}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="visionStatement">Vision Statement</Label>
                <Input
                  id="visionStatement"
                  name="visionStatement"
                  value={formData.visionStatement}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">القيم الأساسية (اختياري)</h3>
            {formData.coreValues.map((value, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-700">Core Value {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCoreValue(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        Choose File
                      </Button>
                      <Input
                        value={value.icon}
                        onChange={(e) => handleCoreValueChange(index, 'icon', e.target.value)}
                        placeholder="Icon file"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={value.title}
                      onChange={(e) => handleCoreValueChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={value.description}
                      onChange={(e) => handleCoreValueChange(index, 'description', e.target.value)}
                      placeholder="Short 1-2 sentence value explanation"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex space-x-2 rtl:space-x-reverse">
                             <Button type="button" variant="outline" onClick={addCoreValue}>
                 <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                 إضافة قيمة أساسية
               </Button>
                             <Button type="button" variant="outline">
                 تم
               </Button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">صورة صفحة من نحن / البانر الرئيسي</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <Button type="button" variant="outline" className="mb-2">
                Upload Image
              </Button>
              <p className="text-sm text-gray-500">(Recommended size: 1200x600px)</p>
              <p className="text-sm text-gray-500">Displayed at the top of the public About Us page.</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">معلومات الشركة (اختياري)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Input"
                />
              </div>
              <div>
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  placeholder="Input"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Input"
                />
              </div>
              <div>
                <Label htmlFor="whatsappPhone">WhatsApp / Phone (Optional)</Label>
                <Input
                  id="whatsappPhone"
                  name="whatsappPhone"
                  value={formData.whatsappPhone}
                  onChange={handleChange}
                  placeholder="Input"
                />
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={handleChange}
                    className="mr-2 rtl:ml-2 rtl:mr-0"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={handleChange}
                    className="mr-2 rtl:ml-2 rtl:mr-0"
                  />
                  Inactive
                </label>
              </div>
            </div>
            <div className="flex space-x-3 rtl:space-x-reverse">
                               <Button type="button" variant="outline">
                   <Eye className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                   معاينة
                 </Button>
                               <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                   <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                   حفظ الصفحة
                 </Button>
            </div>
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
    fullName: 'last',
    companyName: 'dont',
    addressLine2: 'dont',
    shippingPhone: 'dont',
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
          {/* Customer contact method */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">طريقة التواصل مع العميل</h3>
            <p className="text-sm text-gray-600">اختر طريقة التواصل التي يستخدمها العملاء للدفع.</p>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={formData.contactMethod === 'phone'}
                  onChange={handleChange}
                  className="mr-3 rtl:ml-3 rtl:mr-0"
                />
                                 رقم الهاتف
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={formData.contactMethod === 'email'}
                  onChange={handleChange}
                  className="mr-3 rtl:ml-3 rtl:mr-0"
                />
                                 البريد الإلكتروني
              </label>
            </div>
            
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-start space-x-3 rtl:space-x-reverse">
              <Info className="w-5 h-5 text-gray-600 mt-0.5" />
              <p className="text-sm text-gray-700">To send SMS updates, you need to install an SMS App</p>
            </div>
          </div>

          {/* Customer information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">معلومات العميل</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Full name */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Full name</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fullName"
                      value="last"
                      checked={formData.fullName === 'last'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Only require last name
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fullName"
                      value="both"
                      checked={formData.fullName === 'both'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Require first and last name
                  </label>
                </div>
              </div>

              {/* Company name */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Company name</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="companyName"
                      value="dont"
                      checked={formData.companyName === 'dont'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Don't include name
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="companyName"
                      value="optional"
                      checked={formData.companyName === 'optional'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Optional
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="companyName"
                      value="required"
                      checked={formData.companyName === 'required'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Required
                  </label>
                </div>
              </div>

              {/* Address line 2 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Address line 2 (apartment, unit, etc.)</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressLine2"
                      value="dont"
                      checked={formData.addressLine2 === 'dont'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Don't include name
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressLine2"
                      value="optional"
                      checked={formData.addressLine2 === 'optional'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Optional
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressLine2"
                      value="required"
                      checked={formData.addressLine2 === 'required'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Required
                  </label>
                </div>
              </div>

              {/* Shipping address phone number */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Shipping address phone number</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingPhone"
                      value="dont"
                      checked={formData.shippingPhone === 'dont'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Don't include name
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingPhone"
                      value="optional"
                      checked={formData.shippingPhone === 'optional'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Optional
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingPhone"
                      value="required"
                      checked={formData.shippingPhone === 'required'}
                      onChange={handleChange}
                      className="mr-2 rtl:ml-2 rtl:mr-0"
                    />
                    Required
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              Discard
            </Button>
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
    storeDescription: 'متجر الكتب الرائد في الشرق الأوسط',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    storeWebsite: '',
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
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
          {/* Basic Store Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">المعلومات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName">اسم المتجر</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="اسم المتجر"
                />
              </div>
              <div>
                <Label htmlFor="storeDescription">وصف المتجر</Label>
                <Input
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="وصف مختصر للمتجر"
                />
              </div>
              <div>
                <Label htmlFor="storeAddress">عنوان المتجر</Label>
                <Input
                  id="storeAddress"
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleChange}
                  placeholder="العنوان الكامل"
                />
              </div>
              <div>
                <Label htmlFor="storePhone">رقم الهاتف</Label>
                <Input
                  id="storePhone"
                  name="storePhone"
                  value={formData.storePhone}
                  onChange={handleChange}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">البريد الإلكتروني</Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  value={formData.storeEmail}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div>
                <Label htmlFor="storeWebsite">الموقع الإلكتروني</Label>
                <Input
                  id="storeWebsite"
                  name="storeWebsite"
                  value={formData.storeWebsite}
                  onChange={handleChange}
                  placeholder="الموقع الإلكتروني"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">ساعات العمل</h3>
            <div className="space-y-3">
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 rtl:space-x-reverse p-3 border border-gray-200 rounded-lg">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">
                      {day === 'monday' ? 'الاثنين' :
                       day === 'tuesday' ? 'الثلاثاء' :
                       day === 'wednesday' ? 'الأربعاء' :
                       day === 'thursday' ? 'الخميس' :
                       day === 'friday' ? 'الجمعة' :
                       day === 'saturday' ? 'السبت' :
                       day === 'sunday' ? 'الأحد' : day}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">مفتوح</span>
                  </div>
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        className="w-24"
                      />
                      <span className="text-gray-500">إلى</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        className="w-24"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              إلغاء
            </Button>
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

// Payments Settings
const PaymentsSettings = ({ settings, onSave }) => {
  // Test payment API on component mount
  useEffect(() => {
    const testPaymentAPI = async () => {
      try {
        const result = await paymentApi.testConnection();
        console.log('Payment API Test Result:', result);
      } catch (error) {
        console.error('Payment API Test Error:', error);
      }
    };
    testPaymentAPI();
  }, []);

  const [formData, setFormData] = useState({
    paymentMethods: {
      // Credit/Debit Cards
      visa: { 
        enabled: true, 
        name: 'Visa', 
        apiKey: '', 
        secretKey: '', 
        testMode: true,
        connected: false,
        icon: '💳'
      },
      mastercard: { 
        enabled: true, 
        name: 'Mastercard', 
        apiKey: '', 
        secretKey: '', 
        testMode: true,
        connected: false,
        icon: '💳'
      },
      amex: { 
        enabled: false, 
        name: 'American Express', 
        apiKey: '', 
        secretKey: '', 
        testMode: true,
        connected: false,
        icon: '💳'
      },
      
      // Digital Wallets
      paypal: { 
        enabled: false, 
        name: 'PayPal', 
        clientId: '', 
        secret: '', 
        testMode: true,
        connected: false,
        icon: '🅿️'
      },
      applePay: { 
        enabled: false, 
        name: 'Apple Pay', 
        merchantId: '', 
        certificate: '',
        connected: false,
        icon: '🍎'
      },
      googlePay: { 
        enabled: false, 
        name: 'Google Pay', 
        merchantId: '', 
        apiKey: '',
        connected: false,
        icon: '📱'
      },
      
      // Bank Transfers
      bankTransfer: { 
        enabled: false, 
        name: 'تحويل بنكي', 
        accountNumber: '', 
        bankName: '',
        connected: false,
        icon: '🏦'
      },
      
      // Cash on Delivery
      cashOnDelivery: { 
        enabled: true, 
        name: 'الدفع عند الاستلام', 
        maxAmount: 1000,
        connected: true,
        icon: '💵'
      },
      
      // Cryptocurrency
      bitcoin: { 
        enabled: false, 
        name: 'Bitcoin', 
        walletAddress: '',
        connected: false,
        icon: '₿'
      },
      ethereum: { 
        enabled: false, 
        name: 'Ethereum', 
        walletAddress: '',
        connected: false,
        icon: 'Ξ'
      },
      
      // Local Payment Methods
      mada: { 
        enabled: true, 
        name: 'مدى', 
        merchantId: '', 
        apiKey: '',
        connected: false,
        icon: '💳'
      },
      stcPay: { 
        enabled: false, 
        name: 'STC Pay', 
        merchantId: '', 
        apiKey: '',
        connected: false,
        icon: '📱'
      },
      tabby: { 
        enabled: false, 
        name: 'تابي', 
        apiKey: '', 
        secretKey: '',
        testMode: true,
        connected: false,
        icon: '🛒'
      },
      tamara: { 
        enabled: false, 
        name: 'تمارا', 
        apiKey: '', 
        secretKey: '',
        testMode: true,
        connected: false,
        icon: '💳'
      },
      qitaf: { 
        enabled: false, 
        name: 'قطف', 
        merchantId: '', 
        apiKey: '',
        testMode: true,
        connected: false,
        icon: '💳'
      },
      fawry: { 
        enabled: false, 
        name: 'فوري', 
        merchantCode: '', 
        secureKey: '',
        testMode: true,
        connected: false,
        icon: '🏪'
      },
      payfort: { 
        enabled: false, 
        name: 'PayFort', 
        accessCode: '', 
        merchantIdentifier: '',
        shaRequestPhrase: '',
        shaResponsePhrase: '',
        testMode: true,
        connected: false,
        icon: '💳'
      },
      myfatoorah: { 
        enabled: false, 
        name: 'ماي فاتورة', 
        apiKey: '',
        testMode: true,
        connected: false,
        icon: '📄'
      }
    },
    currency: 'SAR',
    taxRate: 15,
    autoCapture: true,
    refundPolicy: 'full',
    buyerAccounts: {
      enabled: true,
      autoLink: true,
      requireVerification: true
    },
    ...settings?.payments
  });

  const [connectingMethod, setConnectingMethod] = useState(null);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method, field, value) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: {
          ...prev.paymentMethods[method],
          [field]: value
        }
      }
    }));
  };

  const handleBuyerAccountsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      buyerAccounts: {
        ...prev.buyerAccounts,
        [field]: value
      }
    }));
  };

  const connectPaymentMethod = async (method) => {
    setConnectingMethod(method);
    try {
      const methodData = formData.paymentMethods[method];
      const credentials = {};
      
      // Extract credentials based on method type
      if (['visa', 'mastercard', 'amex'].includes(method)) {
        credentials.apiKey = methodData.apiKey;
        credentials.secretKey = methodData.secretKey;
      } else if (method === 'paypal') {
        credentials.clientId = methodData.clientId;
        credentials.secret = methodData.secret;
      } else if (['applePay', 'googlePay', 'mada', 'stcPay'].includes(method)) {
        credentials.merchantId = methodData.merchantId;
        credentials.apiKey = methodData.apiKey;
      } else if (method === 'bankTransfer') {
        credentials.accountNumber = methodData.accountNumber;
        credentials.bankName = methodData.bankName;
      } else if (['bitcoin', 'ethereum'].includes(method)) {
        credentials.walletAddress = methodData.walletAddress;
      }
      
      credentials.testMode = methodData.testMode;
      
      // Validate credentials
      const validation = paymentUtils.validatePaymentMethod(method, credentials);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Connect via API
      await paymentApi.connectPaymentMethod(method, credentials);
      
      // Test the connection
      await paymentApi.testPaymentMethod(method);
      
      setFormData(prev => ({
        ...prev,
        paymentMethods: {
          ...prev.paymentMethods,
          [method]: {
            ...prev.paymentMethods[method],
            connected: true
          }
        }
      }));
      
      toast({ title: `تم ربط ${formData.paymentMethods[method].name} بنجاح!` });
    } catch (error) {
      console.error('Payment connection error:', error);
      toast({ 
        title: 'فشل في ربط طريقة الدفع', 
        description: error.message || 'حدث خطأ أثناء الاتصال',
        variant: 'destructive' 
      });
    } finally {
      setConnectingMethod(null);
    }
  };

  const disconnectPaymentMethod = async (method) => {
    try {
      // Disconnect via API
      await paymentApi.disconnectPaymentMethod(method);
      
      setFormData(prev => ({
        ...prev,
        paymentMethods: {
          ...prev.paymentMethods,
          [method]: {
            ...prev.paymentMethods[method],
            connected: false
          }
        }
      }));
      
      toast({ title: `تم إلغاء ربط ${formData.paymentMethods[method].name}` });
    } catch (error) {
      console.error('Payment disconnection error:', error);
      toast({ 
        title: 'فشل في إلغاء الربط', 
        description: error.message || 'حدث خطأ أثناء إلغاء الربط',
        variant: 'destructive' 
      });
    }
  };

  const openApiDialog = (method) => {
    setSelectedMethod(method);
    setShowApiDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ payments: formData });
      toast({ title: 'تم حفظ إعدادات المدفوعات بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  const getMethodIcon = (icon) => {
    return <span className="text-2xl">{icon}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Payment Methods Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">طرق الدفع</h2>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-500">المتصلة: {Object.values(formData.paymentMethods).filter(m => m.connected).length}</span>
            <span className="text-sm text-gray-500">المفعلة: {Object.values(formData.paymentMethods).filter(m => m.enabled).length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formData.paymentMethods).map(([method, data]) => (
            <div key={method} className={`border rounded-lg p-4 transition-all duration-200 ${
              data.connected ? 'ring-2 ring-green-200' : ''
            } ${data.enabled ? 'border-blue-200' : 'border-gray-200 bg-gray-50'}`}>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {getMethodIcon(data.icon)}
                  <div>
                    <h3 className="font-medium text-gray-900">{data.name}</h3>
                    <p className="text-sm text-gray-500">
                      {data.connected ? 'متصل' : 'غير متصل'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={data.enabled}
                    onChange={(e) => handlePaymentMethodChange(method, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {data.connected ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => disconnectPaymentMethod(method)}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    إلغاء الربط
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => openApiDialog(method)}
                    disabled={connectingMethod === method}
                    className="w-full"
                  >
                    {connectingMethod === method ? 'جاري الربط...' : 'ربط الحساب'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">إعدادات الدفع</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currency">العملة الأساسية</Label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="KWD">دينار كويتي (KWD)</option>
                <option value="QAR">ريال قطري (QAR)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="taxRate">نسبة الضريبة (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                value={formData.taxRate}
                onChange={handleChange}
                placeholder="15"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="autoCapture"
                checked={formData.autoCapture}
                onChange={(e) => handleChange({ target: { name: 'autoCapture', value: e.target.checked } })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="autoCapture">التحصيل التلقائي للمدفوعات</Label>
            </div>
            
            <div>
              <Label htmlFor="refundPolicy">سياسة الاسترداد</Label>
              <select
                id="refundPolicy"
                name="refundPolicy"
                value={formData.refundPolicy}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="full">استرداد كامل</option>
                <option value="partial">استرداد جزئي</option>
                <option value="storeCredit">رصيد في المتجر</option>
                <option value="noRefund">لا يوجد استرداد</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Buyer Accounts Integration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">تكامل حسابات المشترين</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="buyerAccountsEnabled"
              checked={formData.buyerAccounts.enabled}
              onChange={(e) => handleBuyerAccountsChange('enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="buyerAccountsEnabled">تفعيل حسابات المشترين</Label>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="autoLink"
              checked={formData.buyerAccounts.autoLink}
              onChange={(e) => handleBuyerAccountsChange('autoLink', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="autoLink">الربط التلقائي مع طرق الدفع</Label>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="requireVerification"
              checked={formData.buyerAccounts.requireVerification}
              onChange={(e) => handleBuyerAccountsChange('requireVerification', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="requireVerification">تطلب التحقق من الحساب</Label>
          </div>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">إحصائيات المدفوعات</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">إجمالي المدفوعات</p>
                <p className="text-2xl font-bold text-blue-900">45,230 ريال</p>
              </div>
              <div className="text-blue-600">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">المعاملات الناجحة</p>
                <p className="text-2xl font-bold text-green-900">98.5%</p>
              </div>
              <div className="text-green-600">
                <Check className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">طرق الدفع المتصلة</p>
                <p className="text-2xl font-bold text-orange-900">{Object.values(formData.paymentMethods).filter(m => m.connected).length}</p>
              </div>
              <div className="text-orange-600">
                <CreditCard className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">أكثر طرق الدفع استخداماً</span>
            <span className="text-sm font-medium">Visa - 45%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">متوسط قيمة الطلب</span>
            <span className="text-sm font-medium">125 ريال</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">معدل التحويل</span>
            <span className="text-sm font-medium">3.2%</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6">
        <Button type="button" variant="outline">
          إلغاء
        </Button>
        <Button type="submit" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          حفظ التغييرات
        </Button>
      </div>

      {/* API Configuration Dialog */}
      {showApiDialog && selectedMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              إعداد API لـ {formData.paymentMethods[selectedMethod].name}
            </h3>
            
            <div className="space-y-4">
              {/* PayPal Configuration */}
              {selectedMethod === 'paypal' && (
                <>
                  <div>
                    <Label>Client ID</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].clientId}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'clientId', e.target.value)}
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div>
                    <Label>Secret</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].secret}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'secret', e.target.value)}
                      placeholder="PayPal Secret"
                    />
                  </div>
                </>
              )}
              
              {/* Credit Card Configuration */}
              {['visa', 'mastercard', 'amex'].includes(selectedMethod) && (
                <>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].apiKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'apiKey', e.target.value)}
                      placeholder="API Key"
                    />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].secretKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'secretKey', e.target.value)}
                      placeholder="Secret Key"
                    />
                  </div>
                </>
              )}
              
              {/* Digital Wallets Configuration */}
              {['applePay', 'googlePay', 'mada', 'stcPay'].includes(selectedMethod) && (
                <>
                  <div>
                    <Label>Merchant ID</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].merchantId}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'merchantId', e.target.value)}
                      placeholder="Merchant ID"
                    />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].apiKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'apiKey', e.target.value)}
                      placeholder="API Key"
                    />
                  </div>
                  {selectedMethod === 'applePay' && (
                    <div>
                      <Label>Certificate</Label>
                      <Input
                        type="password"
                        value={formData.paymentMethods[selectedMethod].certificate}
                        onChange={(e) => handlePaymentMethodChange(selectedMethod, 'certificate', e.target.value)}
                        placeholder="Apple Pay Certificate"
                      />
                    </div>
                  )}
                </>
              )}
              
              {/* Gulf Payment Methods Configuration */}
              {['tabby', 'tamara'].includes(selectedMethod) && (
                <>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].apiKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'apiKey', e.target.value)}
                      placeholder={`${selectedMethod === 'tabby' ? 'Tabby' : 'Tamara'} API Key`}
                    />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].secretKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'secretKey', e.target.value)}
                      placeholder={`${selectedMethod === 'tabby' ? 'Tabby' : 'Tamara'} Secret Key`}
                    />
                  </div>
                </>
              )}
              
              {/* Additional Gulf Payment Methods Configuration */}
              {selectedMethod === 'qitaf' && (
                <>
                  <div>
                    <Label>Merchant ID</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].merchantId}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'merchantId', e.target.value)}
                      placeholder="Qitaf Merchant ID"
                    />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].apiKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'apiKey', e.target.value)}
                      placeholder="Qitaf API Key"
                    />
                  </div>
                </>
              )}
              
              {selectedMethod === 'fawry' && (
                <>
                  <div>
                    <Label>Merchant Code</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].merchantCode}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'merchantCode', e.target.value)}
                      placeholder="Fawry Merchant Code"
                    />
                  </div>
                  <div>
                    <Label>Secure Key</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].secureKey}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'secureKey', e.target.value)}
                      placeholder="Fawry Secure Key"
                    />
                  </div>
                </>
              )}
              
              {selectedMethod === 'payfort' && (
                <>
                  <div>
                    <Label>Access Code</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].accessCode}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'accessCode', e.target.value)}
                      placeholder="PayFort Access Code"
                    />
                  </div>
                  <div>
                    <Label>Merchant Identifier</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].merchantIdentifier}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'merchantIdentifier', e.target.value)}
                      placeholder="PayFort Merchant Identifier"
                    />
                  </div>
                  <div>
                    <Label>SHA Request Phrase</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].shaRequestPhrase}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'shaRequestPhrase', e.target.value)}
                      placeholder="PayFort SHA Request Phrase"
                    />
                  </div>
                  <div>
                    <Label>SHA Response Phrase</Label>
                    <Input
                      type="password"
                      value={formData.paymentMethods[selectedMethod].shaResponsePhrase}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'shaResponsePhrase', e.target.value)}
                      placeholder="PayFort SHA Response Phrase"
                    />
                  </div>
                </>
              )}
              
              {selectedMethod === 'myfatoorah' && (
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={formData.paymentMethods[selectedMethod].apiKey}
                    onChange={(e) => handlePaymentMethodChange(selectedMethod, 'apiKey', e.target.value)}
                    placeholder="MyFatoorah API Key"
                  />
                </div>
              )}
              
              {/* Bank Transfer Configuration */}
              {selectedMethod === 'bankTransfer' && (
                <>
                  <div>
                    <Label>رقم الحساب</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].accountNumber}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'accountNumber', e.target.value)}
                      placeholder="رقم الحساب البنكي"
                    />
                  </div>
                  <div>
                    <Label>اسم البنك</Label>
                    <Input
                      value={formData.paymentMethods[selectedMethod].bankName}
                      onChange={(e) => handlePaymentMethodChange(selectedMethod, 'bankName', e.target.value)}
                      placeholder="اسم البنك"
                    />
                  </div>
                </>
              )}
              
              {/* Cryptocurrency Configuration */}
              {['bitcoin', 'ethereum'].includes(selectedMethod) && (
                <div>
                  <Label>عنوان المحفظة</Label>
                  <Input
                    value={formData.paymentMethods[selectedMethod].walletAddress}
                    onChange={(e) => handlePaymentMethodChange(selectedMethod, 'walletAddress', e.target.value)}
                    placeholder={`${selectedMethod === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} Wallet Address`}
                  />
                </div>
              )}
              
              {/* Test Mode Toggle */}
              {paymentMethodConfigs[selectedMethod]?.testMode && (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods[selectedMethod].testMode}
                    onChange={(e) => handlePaymentMethodChange(selectedMethod, 'testMode', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label>وضع الاختبار</Label>
                </div>
              )}
              
              {/* Method Information */}
              {paymentMethodConfigs[selectedMethod] && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">معلومات الطريقة:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>العملات المدعومة: {paymentMethodConfigs[selectedMethod].supportedCurrencies.join(', ')}</p>
                    <p>وقت المعالجة: {paymentMethodConfigs[selectedMethod].processingTime}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 rtl:space-x-reverse mt-6">
              <Button
                variant="outline"
                onClick={() => setShowApiDialog(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  connectPaymentMethod(selectedMethod);
                  setShowApiDialog(false);
                }}
              >
                ربط الحساب
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Shipping Settings
const ShippingSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    shippingMethods: {
      standard: { enabled: true, name: 'الشحن العادي', price: 25, days: '3-5 أيام' },
      express: { enabled: true, name: 'الشحن السريع', price: 50, days: '1-2 أيام' },
      pickup: { enabled: true, name: 'استلام من المتجر', price: 0, days: 'فوري' }
    },
    shippingCompanies: [
      {
        id: 1,
        name: 'أرامكس',
        code: 'aramex',
        apiKey: '',
        apiSecret: '',
        enabled: true,
        logo: 'https://via.placeholder.com/80x40/0066CC/ffffff?text=Aramex'
      },
      {
        id: 2,
        name: 'DHL',
        code: 'dhl',
        apiKey: '',
        apiSecret: '',
        enabled: true,
        logo: 'https://via.placeholder.com/80x40/FFCC00/000000?text=DHL'
      },
      {
        id: 3,
        name: 'فيديكس',
        code: 'fedex',
        apiKey: '',
        apiSecret: '',
        enabled: true,
        logo: 'https://via.placeholder.com/80x40/660099/ffffff?text=FedEx'
      }
    ],
    countryShippingRates: [
      {
        country: 'SA',
        countryName: 'المملكة العربية السعودية',
        standard: { price: 15, freeThreshold: 100 },
        express: { price: 30, freeThreshold: 200 },
        pickup: { price: 0, freeThreshold: 0 }
      },
      {
        country: 'AE',
        countryName: 'الإمارات العربية المتحدة',
        standard: { price: 20, freeThreshold: 150 },
        express: { price: 40, freeThreshold: 250 },
        pickup: { price: 0, freeThreshold: 0 }
      },
      {
        country: 'KW',
        countryName: 'الكويت',
        standard: { price: 25, freeThreshold: 200 },
        express: { price: 45, freeThreshold: 300 },
        pickup: { price: 0, freeThreshold: 0 }
      },
      {
        country: 'QA',
        countryName: 'قطر',
        standard: { price: 22, freeThreshold: 180 },
        express: { price: 42, freeThreshold: 280 },
        pickup: { price: 0, freeThreshold: 0 }
      },
      {
        country: 'BH',
        countryName: 'البحرين',
        standard: { price: 18, freeThreshold: 120 },
        express: { price: 35, freeThreshold: 220 },
        pickup: { price: 0, freeThreshold: 0 }
      },
      {
        country: 'OM',
        countryName: 'عمان',
        standard: { price: 28, freeThreshold: 250 },
        express: { price: 50, freeThreshold: 350 },
        pickup: { price: 0, freeThreshold: 0 }
      }
    ],
    freeShippingThreshold: 200,
    autoCalculateShipping: true,
    ...settings?.shipping
  });

  const [activeTab, setActiveTab] = useState('methods');
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingCountry, setEditingCountry] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingMethodChange = (method, field, value) => {
    setFormData(prev => ({
      ...prev,
      shippingMethods: {
        ...prev.shippingMethods,
        [method]: {
          ...prev.shippingMethods[method],
          [field]: value
        }
      }
    }));
  };

  const handleCompanyChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      shippingCompanies: prev.shippingCompanies.map((company, i) => 
        i === index ? { ...company, [field]: value } : company
      )
    }));
  };

  const handleCountryRateChange = (index, method, field, value) => {
    setFormData(prev => ({
      ...prev,
      countryShippingRates: prev.countryShippingRates.map((country, i) => 
        i === index ? {
          ...country,
          [method]: {
            ...country[method],
            [field]: value
          }
        } : country
      )
    }));
  };

  const addShippingCompany = () => {
    const newCompany = {
      id: Date.now(),
      name: '',
      code: '',
      apiKey: '',
      apiSecret: '',
      enabled: false,
      logo: 'https://via.placeholder.com/80x40/6366f1/ffffff?text=New'
    };
    setFormData(prev => ({
      ...prev,
      shippingCompanies: [...prev.shippingCompanies, newCompany]
    }));
  };

  const removeShippingCompany = (index) => {
    setFormData(prev => ({
      ...prev,
      shippingCompanies: prev.shippingCompanies.filter((_, i) => i !== index)
    }));
  };

  const addCountry = () => {
    const newCountry = {
      country: '',
      countryName: '',
      standard: { price: 25, freeThreshold: 200 },
      express: { price: 45, freeThreshold: 300 },
      pickup: { price: 0, freeThreshold: 0 }
    };
    setFormData(prev => ({
      ...prev,
      countryShippingRates: [...prev.countryShippingRates, newCountry]
    }));
  };

  const removeCountry = (index) => {
    setFormData(prev => ({
      ...prev,
      countryShippingRates: prev.countryShippingRates.filter((_, i) => i !== index)
    }));
  };

  const testShippingAPI = async (company) => {
    try {
      // هنا يمكن إضافة اختبار API لشركة الشحن
      toast({ title: `تم اختبار الاتصال مع ${company.name} بنجاح!` });
    } catch (error) {
      toast({ title: `فشل في الاتصال مع ${company.name}`, variant: 'destructive' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ shipping: formData });
      toast({ title: 'تم حفظ إعدادات الشحن بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات الشحن والتوصيل</h2>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            {[
              { id: 'methods', name: 'طرق الشحن' },
              { id: 'companies', name: 'شركات الشحن' },
              { id: 'rates', name: 'أسعار الشحن' },
              { id: 'general', name: 'إعدادات عامة' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Methods Tab */}
          {activeTab === 'methods' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">طرق الشحن</h3>
              <div className="space-y-3">
                {Object.entries(formData.shippingMethods).map(([method, data]) => (
                  <div key={method} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={data.enabled}
                        onChange={(e) => handleShippingMethodChange(method, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">{data.name}</span>
                    </div>
                    {data.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>السعر الأساسي</Label>
                          <Input
                            type="number"
                            value={data.price}
                            onChange={(e) => handleShippingMethodChange(method, 'price', e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>مدة التوصيل</Label>
                          <Input
                            value={data.days}
                            onChange={(e) => handleShippingMethodChange(method, 'days', e.target.value)}
                            placeholder="3-5 أيام"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Companies Tab */}
          {activeTab === 'companies' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">شركات الشحن</h3>
                <Button type="button" variant="outline" onClick={addShippingCompany}>
                  <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  إضافة شركة شحن
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.shippingCompanies.map((company, index) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={company.enabled}
                          onChange={(e) => handleCompanyChange(index, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <img src={company.logo} alt={company.name} className="w-20 h-10 object-contain" />
                        <span className="font-medium text-gray-700">{company.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => testShippingAPI(company)}
                        >
                          اختبار API
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeShippingCompany(index)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                    
                    {company.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>رمز الشركة</Label>
                          <Input
                            value={company.code}
                            onChange={(e) => handleCompanyChange(index, 'code', e.target.value)}
                            placeholder="aramex"
                          />
                        </div>
                        <div>
                          <Label>مفتاح API</Label>
                          <Input
                            type="password"
                            value={company.apiKey}
                            onChange={(e) => handleCompanyChange(index, 'apiKey', e.target.value)}
                            placeholder="أدخل مفتاح API"
                          />
                        </div>
                        <div>
                          <Label>كلمة سر API</Label>
                          <Input
                            type="password"
                            value={company.apiSecret}
                            onChange={(e) => handleCompanyChange(index, 'apiSecret', e.target.value)}
                            placeholder="أدخل كلمة سر API"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Rates Tab */}
          {activeTab === 'rates' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">أسعار الشحن حسب الدولة</h3>
                <Button type="button" variant="outline" onClick={addCountry}>
                  <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  إضافة دولة
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.countryShippingRates.map((country, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="font-medium text-gray-700">{country.countryName}</span>
                        <span className="text-sm text-gray-500">({country.country})</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCountry(index)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        حذف
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(country).filter(([key]) => key !== 'country' && key !== 'countryName').map(([method, data]) => (
                        <div key={method} className="border border-gray-100 rounded-lg p-3">
                          <h4 className="font-medium text-gray-700 mb-2 capitalize">
                            {method === 'standard' ? 'الشحن العادي' : 
                             method === 'express' ? 'الشحن السريع' : 'استلام من المتجر'}
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm">السعر</Label>
                              <Input
                                type="number"
                                value={data.price}
                                onChange={(e) => handleCountryRateChange(index, method, 'price', parseFloat(e.target.value))}
                                placeholder="0"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">حد الشحن المجاني</Label>
                              <Input
                                type="number"
                                value={data.freeThreshold}
                                onChange={(e) => handleCountryRateChange(index, method, 'freeThreshold', parseFloat(e.target.value))}
                                placeholder="0"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">الإعدادات العامة</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">حد الشحن المجاني العام</Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    value={formData.freeShippingThreshold}
                    onChange={handleChange}
                    placeholder="200"
                  />
                  <p className="text-sm text-gray-600 mt-1">الشحن مجاني للطلبات التي تزيد عن هذا المبلغ</p>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="autoCalculateShipping"
                    checked={formData.autoCalculateShipping}
                    onChange={(e) => handleChange({ target: { name: 'autoCalculateShipping', value: e.target.checked } })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="autoCalculateShipping">حساب الشحن تلقائياً حسب الدولة</Label>
                </div>
                
                <p className="text-sm text-gray-600">
                  عند تفعيل هذا الخيار، سيتم حساب رسوم الشحن تلقائياً بناءً على دولة العميل ونوع الشحن المختار
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              إلغاء
            </Button>
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
        address: 'شارع الملك فهد، الرياض',
        phone: '+966501234567',
        email: 'main@darmolhimon.com',
        coordinates: { lat: 24.7136, lng: 46.6753 },
        active: true
      }
    ],
    ...settings?.locations
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (index, field, value) => {
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
        active: true
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
      toast({ title: 'تم حفظ إعدادات المواقع بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات المواقع</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Locations List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">فروع المتجر</h3>
              <Button type="button" variant="outline" onClick={addLocation}>
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                إضافة فرع
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.locations.map((location, index) => (
                <div key={location.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">الفرع {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLocation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>اسم الفرع</Label>
                      <Input
                        value={location.name}
                        onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                        placeholder="اسم الفرع"
                      />
                    </div>
                    <div>
                      <Label>العنوان</Label>
                      <Input
                        value={location.address}
                        onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                        placeholder="العنوان الكامل"
                      />
                    </div>
                    <div>
                      <Label>رقم الهاتف</Label>
                      <Input
                        value={location.phone}
                        onChange={(e) => handleLocationChange(index, 'phone', e.target.value)}
                        placeholder="رقم الهاتف"
                      />
                    </div>
                    <div>
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        value={location.email}
                        onChange={(e) => handleLocationChange(index, 'email', e.target.value)}
                        placeholder="البريد الإلكتروني"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={location.active}
                      onChange={(e) => handleLocationChange(index, 'active', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label>نشط</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              إلغاء
            </Button>
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
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      newProducts: false,
      promotions: false
    },
    smsNotifications: {
      orderConfirmation: false,
      orderShipped: true,
      orderDelivered: true
    },
    pushNotifications: {
      newOrders: true,
      lowStock: true,
      systemUpdates: false
    },
    ...settings?.notifications
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (type, category, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: value
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
          {/* Email Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">إشعارات البريد الإلكتروني</h3>
            <div className="space-y-3">
              {Object.entries(formData.emailNotifications).map(([notification, enabled]) => (
                <div key={notification} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleNotificationChange('emailNotifications', notification, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label>
                    {notification === 'orderConfirmation' ? 'تأكيد الطلب' :
                     notification === 'orderShipped' ? 'شحن الطلب' :
                     notification === 'orderDelivered' ? 'توصيل الطلب' :
                     notification === 'newProducts' ? 'المنتجات الجديدة' :
                     notification === 'promotions' ? 'العروض الترويجية' : notification}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">إشعارات الرسائل النصية</h3>
            <div className="space-y-3">
              {Object.entries(formData.smsNotifications).map(([notification, enabled]) => (
                <div key={notification} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleNotificationChange('smsNotifications', notification, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label>
                    {notification === 'orderConfirmation' ? 'تأكيد الطلب' :
                     notification === 'orderShipped' ? 'شحن الطلب' :
                     notification === 'orderDelivered' ? 'توصيل الطلب' : notification}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">إشعارات التطبيق</h3>
            <div className="space-y-3">
              {Object.entries(formData.pushNotifications).map(([notification, enabled]) => (
                <div key={notification} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleNotificationChange('pushNotifications', notification, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label>
                    {notification === 'newOrders' ? 'الطلبات الجديدة' :
                     notification === 'lowStock' ? 'المخزون المنخفض' :
                     notification === 'systemUpdates' ? 'تحديثات النظام' : notification}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              إلغاء
            </Button>
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
    termsOfService: 'شروط وأحكام استخدام الموقع...',
    privacyPolicy: 'سياسة الخصوصية...',
    returnPolicy: 'سياسة الإرجاع والاستبدال...',
    shippingPolicy: 'سياسة الشحن والتوصيل...',
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
      toast({ title: 'تم حفظ الشروط والأحكام بنجاح!' });
    } catch (error) {
      toast({ title: 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">الشروط والأحكام</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Terms of Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">شروط وأحكام الخدمة</h3>
            <Textarea
              name="termsOfService"
              value={formData.termsOfService}
              onChange={handleChange}
              rows={6}
              placeholder="أدخل شروط وأحكام الخدمة..."
            />
          </div>

          {/* Privacy Policy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">سياسة الخصوصية</h3>
            <Textarea
              name="privacyPolicy"
              value={formData.privacyPolicy}
              onChange={handleChange}
              rows={6}
              placeholder="أدخل سياسة الخصوصية..."
            />
          </div>

          {/* Return Policy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">سياسة الإرجاع والاستبدال</h3>
            <Textarea
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleChange}
              rows={6}
              placeholder="أدخل سياسة الإرجاع والاستبدال..."
            />
          </div>

          {/* Shipping Policy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">سياسة الشحن والتوصيل</h3>
            <Textarea
              name="shippingPolicy"
              value={formData.shippingPolicy}
              onChange={handleChange}
              rows={6}
              placeholder="أدخل سياسة الشحن والتوصيل..."
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              إلغاء
            </Button>
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
      facebook: { url: 'https://facebook.com/darmolhimon', enabled: true },
      instagram: { url: 'https://instagram.com/darmolhimon', enabled: true },
      tiktok: { url: 'https://instagram.com/darmolhimon', enabled: true },
      twitter: { url: 'https://x.com/darmolhimon', enabled: true },
      youtube: { url: 'https://youtube.com/@darmolhimon', enabled: true },
      linkedin: { url: 'https://linkedin.com/company/darmolhimon', enabled: true }
    },
    whatsapp: {
      number: '',
      message: 'Hi Darmolhimon, I\'d like to ask about a book.',
      days: 'Monday - Friday',
      from: '08.00',
      to: '22.00',
      showFloating: true
    },
    ...settings?.connection
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform, field, value) => {
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
          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">روابط وسائل التواصل الاجتماعي</h3>
            
            {Object.entries(formData.socialMedia).map(([platform, data]) => (
              <div key={platform} className="flex items-center space-x-4 rtl:space-x-reverse p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {platform === 'facebook' ? 'f' : 
                     platform === 'instagram' ? '📷' :
                     platform === 'tiktok' ? '🎵' :
                     platform === 'twitter' ? 'X' :
                     platform === 'youtube' ? '▶' :
                     platform === 'linkedin' ? 'in' : platform.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <Input
                    value={data.url}
                    onChange={(e) => handleSocialMediaChange(platform, 'url', e.target.value)}
                    placeholder={`${platform} URL`}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.enabled}
                    onChange={(e) => handleSocialMediaChange(platform, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">إعدادات واتساب</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={formData.whatsapp.number}
                  onChange={(e) => handleWhatsAppChange('number', e.target.value)}
                  placeholder="Example: +6281234567890"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsappMessage">Pre-filled Message</Label>
                <Input
                  id="whatsappMessage"
                  value={formData.whatsapp.message}
                  onChange={(e) => handleWhatsAppChange('message', e.target.value)}
                  placeholder="Example: Hi Darmolhimon, I'd like to ask about a book."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Set Days</Label>
                  <select
                    value={formData.whatsapp.days}
                    onChange={(e) => handleWhatsAppChange('days', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Monday - Friday">Monday - Friday</option>
                    <option value="Monday - Saturday">Monday - Saturday</option>
                    <option value="Every Day">Every Day</option>
                  </select>
                </div>
                <div>
                  <Label>From</Label>
                  <Input
                    value={formData.whatsapp.from}
                    onChange={(e) => handleWhatsAppChange('from', e.target.value)}
                    type="time"
                  />
                </div>
                <div>
                  <Label>To</Label>
                  <Input
                    value={formData.whatsapp.to}
                    onChange={(e) => handleWhatsAppChange('to', e.target.value)}
                    type="time"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button type="button" variant="outline" size="sm">
                  إضافة ساعة
                </Button>
                <Button type="button" variant="outline" size="sm">
                  تم
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  checked={formData.whatsapp.showFloating}
                  onChange={(e) => handleWhatsAppChange('showFloating', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label>إظهار أيقونة واتساب عائمة في الصفحة الرئيسية</Label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <Button type="button" variant="outline">
              عرض الصفحة العامة
            </Button>
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

// Main Settings Component
const DashboardSettings = ({ settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState('about');

  const handleSave = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await api.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'about':
        return <AboutUsSettings settings={settings} onSave={handleSave} />;
      case 'store':
        return <StoreDetailsSettings settings={settings} onSave={handleSave} />;
      case 'payments':
        return <PaymentsSettings settings={settings} onSave={handleSave} />;
      case 'checkout':
        return <CheckoutSettings settings={settings} onSave={handleSave} />;
      case 'shipping':
        return <ShippingSettings settings={settings} onSave={handleSave} />;
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