import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { Plus, Save, Trash2, Settings, Globe, Scale, Truck, CheckCircle2, AlertTriangle, Download, Upload } from 'lucide-react';
import api from '@/lib/api.js';

const defaultNewMethod = {
  id: '',
  name: '',
  description: '',
  cost: 0,
  estimatedDays: '',
  enabled: true,
  conditions: {
    minOrderAmount: 0,
    maxWeight: 0,
    countries: ['SA']
  }
};

const ShippingMethodsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [methods, setMethods] = useState({});
  const [zones, setZones] = useState({});
  const [newMethod, setNewMethod] = useState(defaultNewMethod);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const storeSettings = await api.storeSettings.getStoreSettings();
      setSettings(storeSettings);
      setMethods({ ...(storeSettings.shippingMethods || {}) });
      setZones({ ...(storeSettings.shippingZones || {}) });
    } catch (error) {
      toast({ title: 'فشل تحميل إعدادات الشحن', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMethod = (methodId, enabled) => {
    setMethods(prev => ({
      ...prev,
      [methodId]: { ...prev[methodId], enabled }
    }));
  };

  const handleMethodChange = (methodId, field, value) => {
    setMethods(prev => ({
      ...prev,
      [methodId]: { ...prev[methodId], [field]: value }
    }));
  };

  const handleMethodConditionChange = (methodId, field, value) => {
    setMethods(prev => ({
      ...prev,
      [methodId]: { ...prev[methodId], conditions: { ...prev[methodId].conditions, [field]: value } }
    }));
  };

  const handleAddMethod = () => {
    if (!newMethod.id || !/^[a-z0-9_\-]+$/i.test(newMethod.id)) {
      toast({ title: 'معرف غير صالح', description: 'استخدم أحرفاً إنجليزية وأرقاماً وشرطة وشرطة سفلية فقط', variant: 'destructive' });
      return;
    }
    if (methods[newMethod.id]) {
      toast({ title: 'موجود مسبقاً', description: 'يوجد طريقة شحن بنفس المعرف', variant: 'destructive' });
      return;
    }
    const toInsert = { ...newMethod };
    setMethods(prev => ({ ...prev, [toInsert.id]: toInsert }));
    setNewMethod(defaultNewMethod);
    toast({ title: 'تمت إضافة طريقة الشحن' });
  };

  const handleDeleteMethod = (methodId) => {
    const { [methodId]: _omit, ...rest } = methods;
    setMethods(rest);
  };

  const saveAll = async () => {
    try {
      setSaving(true);
      const payload = { methods, zones };
      await api.storeSettings.saveShippingMethods(payload);
      toast({ title: 'تم حفظ إعدادات الشحن بنجاح' });
      await loadSettings();
    } catch (error) {
      toast({ title: 'خطأ في حفظ الإعدادات', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      await api.storeSettings.saveShippingMethods({ methods, zones });
      toast({ title: 'تم إنشاء نسخة احتياطية', variant: 'success' });
    } catch (error) {
      toast({ title: 'خطأ في النسخ الاحتياطي', description: error.message, variant: 'destructive' });
    }
  };

  const handleRestore = async () => {
    try {
      const version = prompt('أدخل رقم النسخة المراد استعادتها:');
      if (!version) return;
      const data = await api.storeSettings.restoreShippingMethods(Number(version));
      if (data) {
        setMethods({ ...(data.methods || {}) });
        setZones({ ...(data.zones || {}) });
        toast({ title: 'تمت الاستعادة بنجاح', variant: 'success' });
      } else {
        toast({ title: 'لم يتم العثور على النسخة', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'خطأ في الاستعادة', description: error.message, variant: 'destructive' });
    }
  };

  const countryStringFor = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
  const parseCountries = (str) => str.split(',').map(c => c.trim()).filter(Boolean);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Truck className="w-5 h-5"/> إدارة طرق الشحن</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBackup} disabled={saving}><Download className="w-4 h-4 ml-2"/>نسخ احتياطي</Button>
            <Button variant="outline" onClick={handleRestore} disabled={saving}><Upload className="w-4 h-4 ml-2"/>استعادة</Button>
            <Button onClick={saveAll} disabled={saving}><Save className="w-4 h-4 ml-2"/>حفظ</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(methods).map(([id, method]) => (
            <div key={id} className={`border rounded-lg p-4 ${method.enabled ? 'border-blue-200 bg-white' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={!!method.enabled} onChange={(e) => handleToggleMethod(id, e.target.checked)} />
                    <span className="text-base font-medium">{method.name || id}</span>
                    {method.enabled ? <CheckCircle2 className="w-4 h-4 text-green-600"/> : <AlertTriangle className="w-4 h-4 text-gray-400"/>}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <button className="text-red-600 hover:text-red-700" onClick={() => handleDeleteMethod(id)}><Trash2 className="w-5 h-5"/></button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <Label>التكلفة (ر.س)</Label>
                  <Input type="number" value={method.cost} onChange={(e) => handleMethodChange(id, 'cost', Number(e.target.value))} />
                </div>
                <div>
                  <Label>المدة التقديرية</Label>
                  <Input value={method.estimatedDays} onChange={(e) => handleMethodChange(id, 'estimatedDays', e.target.value)} placeholder="3-5 أيام" />
                </div>
                <div className="col-span-2">
                  <Label>الوصف</Label>
                  <Input value={method.description} onChange={(e) => handleMethodChange(id, 'description', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div>
                  <Label>حد أدنى للطلب</Label>
                  <Input type="number" value={method.conditions?.minOrderAmount || 0} onChange={(e) => handleMethodConditionChange(id, 'minOrderAmount', Number(e.target.value))} />
                </div>
                <div>
                  <Label>أقصى وزن (كجم)</Label>
                  <Input type="number" value={method.conditions?.maxWeight || 0} onChange={(e) => handleMethodConditionChange(id, 'maxWeight', Number(e.target.value))} />
                </div>
                <div className="col-span-1">
                  <Label>الدول</Label>
                  <Input value={countryStringFor(method.conditions?.countries || [])} onChange={(e) => handleMethodConditionChange(id, 'countries', parseCountries(e.target.value))} placeholder="SA, AE, KW" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Plus className="w-4 h-4"/> إضافة طريقة شحن</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>المعرف</Label>
              <Input value={newMethod.id} onChange={(e) => setNewMethod(prev => ({ ...prev, id: e.target.value }))} placeholder="مثال: aramex" />
            </div>
            <div>
              <Label>الاسم</Label>
              <Input value={newMethod.name} onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))} placeholder="أرامكس" />
            </div>
            <div>
              <Label>التكلفة (ر.س)</Label>
              <Input type="number" value={newMethod.cost} onChange={(e) => setNewMethod(prev => ({ ...prev, cost: Number(e.target.value) }))} />
            </div>
            <div>
              <Label>المدة التقديرية</Label>
              <Input value={newMethod.estimatedDays} onChange={(e) => setNewMethod(prev => ({ ...prev, estimatedDays: e.target.value }))} placeholder="1-3 أيام" />
            </div>
            <div className="md:col-span-2">
              <Label>الوصف</Label>
              <Input value={newMethod.description} onChange={(e) => setNewMethod(prev => ({ ...prev, description: e.target.value }))} placeholder="وصف مختصر" />
            </div>
            <div className="md:col-span-3">
              <Button variant="outline" onClick={handleAddMethod}><Plus className="w-4 h-4 ml-2"/>إضافة</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5"/> مناطق الشحن</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(zones).map(([id, zone]) => (
            <div key={id} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>المعرف</Label>
                  <Input value={id} disabled />
                </div>
                <div>
                  <Label>الاسم</Label>
                  <Input value={zone.name} onChange={(e) => setZones(prev => ({ ...prev, [id]: { ...prev[id], name: e.target.value } }))} />
                </div>
                <div>
                  <Label>الدول</Label>
                  <Input value={countryStringFor(zone.countries)} onChange={(e) => setZones(prev => ({ ...prev, [id]: { ...prev[id], countries: parseCountries(e.target.value) } }))} />
                </div>
                <div>
                  <Label>تكلفة أساسية</Label>
                  <Input type="number" value={zone.baseCost} onChange={(e) => setZones(prev => ({ ...prev, [id]: { ...prev[id], baseCost: Number(e.target.value) } }))} />
                </div>
                <div className="col-span-2">
                  <Label>طرق الشحن المفعلة</Label>
                  <Input value={(zone.shippingMethods || []).join(', ')} onChange={(e) => setZones(prev => ({ ...prev, [id]: { ...prev[id], shippingMethods: parseCountries(e.target.value) } }))} placeholder="standard, express" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={saveAll} disabled={saving}><Save className="w-4 h-4 ml-2"/>حفظ</Button>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethodsManagement;


