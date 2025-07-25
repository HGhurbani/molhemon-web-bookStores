import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import api from '@/lib/api.js';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await api.getOrder(orderId.trim());
      if (!data) {
        setError('لم يتم العثور على الطلب');
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث عن الطلب');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['قيد المعالجة', 'قيد الشحن', 'تم التوصيل'];
  const current = order ? steps.indexOf(order.status) : -1;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        تتبع الطلب
      </motion.h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <Input
          placeholder="أدخل رقم الطلب"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? 'جاري البحث...' : 'بحث'}
        </Button>
      </form>
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      {order && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow max-w-md mx-auto space-y-4">
          <p className="text-sm text-gray-600">رقم الطلب: <span className="font-semibold">{order.id}</span></p>
          <div className="flex justify-between items-center">
            {steps.map((s, idx) => (
              <div key={s} className="flex-1 text-center">
                <div className={`w-6 h-6 mx-auto rounded-full text-xs flex items-center justify-center ${idx <= current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{idx + 1}</div>
                <p className="mt-1 text-xs">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
