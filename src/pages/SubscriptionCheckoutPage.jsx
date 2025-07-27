import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import api from '@/lib/api.js';
import { purchasePlan } from '@/lib/subscriptionUtils.js';

const SubscriptionCheckoutPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    api.getPaymentMethods().then(m => {
      setPaymentMethods(m);
      if (m[0]) setSelectedPaymentMethod(m[0].id);
    }).catch(() => {});
    api.getPlans().then(plans => {
      const p = plans.find(pl => String(pl.id) === planId);
      if (p) setPlan(p);
    }).catch(() => {});
  }, [planId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!plan) return;
    if (!localStorage.getItem('customerLoggedIn')) {
      toast({ title: 'يجب تسجيل الدخول للاشتراك', variant: 'destructive' });
      navigate('/login');
      return;
    }
    try {
      await purchasePlan(api, plan, selectedPaymentMethod);
      toast({ title: `تم الاشتراك في ${plan.name}` });
      navigate('/profile');
    } catch {
      toast({ title: 'تعذر إتمام الاشتراك. حاول مجدداً.', variant: 'destructive' });
    }
  };

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">جاري التحميل...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2 rtl:space-x-reverse">
          <li><Link to="/" className="hover:text-blue-600">الرئيسية</Link></li>
          <li><span>/</span></li>
          <li className="text-gray-700" aria-current="page">الدفع</li>
        </ol>
      </nav>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-right"
      >
        الدفع للاشتراك
      </motion.h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6 max-w-md mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold">{plan.name}</h2>
          <p className="text-gray-500 text-sm">{plan.duration} يوم</p>
          <div className="text-2xl font-bold text-blue-600">
            <FormattedPrice value={plan.price} />
          </div>
        </div>
        <div>
          <Label htmlFor="payment">طريقة الدفع</Label>
          <select
            id="payment"
            className="mt-1 w-full border rounded-md p-2"
            value={selectedPaymentMethod || ''}
            onChange={e => setSelectedPaymentMethod(Number(e.target.value))}
          >
            {paymentMethods.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          إتمام الدفع
        </Button>
      </form>
    </div>
  );
};

export default SubscriptionCheckoutPage;
