import React, { useState } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const formVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

const AuthPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'يمكنك تسجيل الدخول الآن'
      });
      setIsSignUp(false);
      setFullName('');
      setEmail('');
      setPassword('');
      return;
    }
    if (email === 'customer' && password === '123456') {
      localStorage.setItem('customerLoggedIn', 'true');
      onLogin();
      navigate('/profile');
    } else {
      toast({
        title: 'بيانات غير صحيحة',
        variant: 'destructive'
      });
    }
  };

  const handleSocialClick = () => {
    toast({ title: 'هذه الميزة غير مطبقة بعد' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl flex flex-col lg:flex-row overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 order-2 lg:order-1 p-6 sm:p-10 flex flex-col justify-center"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h1>
          <p className="mb-6 text-center text-sm">
            {isSignUp ? (
              <>
                هل لديك حساب بالفعل؟{' '}
                <button className="text-blue-600" onClick={() => setIsSignUp(false)}>
                  تسجيل الدخول
                </button>
              </>
            ) : (
              <>
                ليس لديك حساب؟{' '}
                <button className="text-blue-600" onClick={() => setIsSignUp(true)}>
                  إنشاء حساب
                </button>
              </>
            )}
          </p>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="الاسم الكامل"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? 'تسجيل جديد' : 'تسجيل الدخول'}
            </Button>
          </form>
          <div className="my-6 text-center text-sm">أو التسجيل بواسطة</div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="icon" onClick={handleSocialClick}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSocialClick}>
              <img src="https://www.svgrepo.com/show/448213/apple.svg" alt="Apple" className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSocialClick}>
              <img src="https://www.svgrepo.com/show/452196/facebook.svg" alt="Facebook" className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 order-1 lg:order-2 min-h-[250px] relative"
          style={{ backgroundImage: 'url(https://i.ibb.co/8LrHvv4P/upscalemedia-transformed-3-1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-l lg:from-black/60 lg:to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
