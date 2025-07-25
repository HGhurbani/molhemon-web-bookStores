import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import api from '@/lib/api.js';

const DashboardOrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const statuses = ['قيد المعالجة', 'قيد الشحن', 'تم التوصيل', 'ملغي'];

  useEffect(() => {
    api.getOrder(id).then(setOrder).catch(() => {});
  }, [id]);

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    try {
      const updated = await api.updateOrder(id, { status });
      setOrder(updated);
    } catch (_) {}
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  const steps = ['قيد المعالجة', 'قيد الشحن', 'تم التوصيل'];
  const current = steps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-6 print:p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
      >
        تفاصيل الطلب {order.id}
      </motion.h1>
      <div className="bg-white p-6 rounded-lg shadow space-y-6 print:shadow-none">
        <div className="flex justify-between text-sm text-gray-600">
          <span>التاريخ: {order.date}</span>
          <span className="font-semibold">{order.status}</span>
        </div>
        <div className="flex justify-between items-center">
          {steps.map((s, idx) => (
            <div key={s} className="flex-1 text-center">
              <div
                className={`w-6 h-6 mx-auto rounded-full text-xs flex items-center justify-center ${
                  idx <= current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </div>
              <p className="mt-1 text-xs">{s}</p>
            </div>
          ))}
        </div>
        <div className="text-sm space-y-1">
          <h2 className="font-semibold mb-2">بيانات المشتري</h2>
          <p>{order.shipping?.name}</p>
          <p>{order.shipping?.email}</p>
          <p>{order.shipping?.phone}</p>
          <p>
            {order.shipping?.street}, {order.shipping?.city}, {order.shipping?.country}
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">المنتجات</h2>
          <ul className="space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>
                  <FormattedPrice value={item.price * item.quantity} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-right font-medium">
          الإجمالي: <FormattedPrice value={order.total} />
        </p>
        <div className="flex items-center justify-between print:hidden">
          <select
            value={order.status}
            onChange={handleStatusChange}
            className="p-2 border border-gray-300 rounded-md text-sm"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
            طباعة PDF
          </Button>
        </div>
        <Button asChild variant="outline" className="mt-4 print:hidden">
          <Link to="/admin">العودة للطلبات</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardOrderDetailsPage;
