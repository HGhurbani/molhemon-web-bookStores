import React, { useState } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.js';

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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: fullName,
          email,
          role: 'customer',
        });
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

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('customerLoggedIn', 'true');
      localStorage.setItem('currentUserId', user.uid);
      onLogin();
      navigate('/profile');
    } catch (err) {
      toast({
        title: 'بيانات غير صحيحة',
        variant: 'destructive'
      });
    }
  };

  const handleSocialClick = async (providerId) => {
    try {
      let provider;
      if (providerId === 'google') provider = new GoogleAuthProvider();
      else if (providerId === 'facebook') provider = new FacebookAuthProvider();
      else if (providerId === 'apple') provider = new OAuthProvider('apple.com');
      const { user } = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, 'users', user.uid),
        { name: user.displayName, email: user.email, role: 'customer' },
        { merge: true }
      );
      localStorage.setItem('customerLoggedIn', 'true');
      localStorage.setItem('currentUserId', user.uid);
      onLogin();
      navigate('/profile');
    } catch (err) {
      toast({ title: 'تعذر تسجيل الدخول بالحساب', variant: 'destructive' });
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-start rtl:justify-end relative bg-cover bg-center mb-32"

      style={{ backgroundImage: 'url(https://i.ibb.co/8LrHvv4P/upscalemedia-transformed-3-1.png)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-6 sm:p-10 ml-4 my-4 md:ml-24 bg-white rounded-lg shadow-xl"
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
            <Button variant="outline" size="icon" onClick={() => handleSocialClick('google')}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleSocialClick('apple')}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleSocialClick('facebook')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg" alt="Facebook" className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
    </div>
  );
};

export default AuthPage;
