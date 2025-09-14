import React, { useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ChevronLeft, X } from 'lucide-react';
import FormattedPrice from './FormattedPrice.jsx';
import api from '@/lib/api.js';
import { toast } from '@/components/ui/use-toast.js';
import { useNavigate } from 'react-router-dom';
import logger from '@/lib/logger.js';

const SubscriptionDialog = ({ open, onOpenChange, book, onAddToCart }) => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setPlans(await api.getPlans({ type: 'membership' }));
      } catch (e) {
        logger.error(e);
      }
    })();
  }, []);

  const handleSubscribe = () => {
    if (!plans.length) return;
    navigate(`/subscribe/${plans[0].id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl space-y-6">
        <DialogPrimitive.Close className="absolute top-3 left-3 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </DialogPrimitive.Close>
        <div className="flex items-center text-blue-600 mb-4 cursor-pointer" onClick={() => onOpenChange(false)}>
          <ChevronLeft className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
          <span className="text-sm font-medium">العودة إلى المتجر</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-sm rtl:text-right">
            <h3 className="text-lg font-semibold mb-3">الفصل الأول</h3>
            <p>{book?.description}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <div className="flex justify-between items-end text-sm">
                <div>
                  {book?.originalPrice && (
                    <span className="line-through text-red-500 ml-2"><FormattedPrice value={book.originalPrice} /></span>
                  )}
                  <div className="text-2xl font-bold text-blue-600"><FormattedPrice book={book} /></div>
                </div>
              </div>
              <Button onClick={onAddToCart} className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-white">
                أضف إلى السلة
              </Button>
            </div>
            <hr />
            <div className="space-y-2 text-center">
              <DialogTitle className="text-lg font-bold">استمتع بقراءة واستماع بلا حدود</DialogTitle>
              <DialogDescription>لمواصلة القراءة والاستماع – تحتاج إلى باقة اشتراكك.</DialogDescription>
              {plans.length > 0 && (
                <div className="text-sm">
                  <p>{plans[0].name} - <FormattedPrice value={plans[0].price} /> / {plans[0].duration} يوم</p>
                </div>
              )}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubscribe}>
                اشترك الآن
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
