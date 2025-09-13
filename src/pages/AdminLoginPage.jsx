import React, { useState } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from '@/lib/jwtAuth.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';

const AdminLoginPage = ({ onLogin, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isCreating) {
        // إنشاء حساب مشرف جديد
        if (!fullName || !email || !password) {
          throw new Error('يرجى إدخال الاسم والبريد وكلمة المرور');
        }
        if (password !== confirmPassword) {
          throw new Error('كلمتا المرور غير متطابقتين');
        }

        const result = await firebaseAuth.createAccount(email, password, fullName);

        // إنشاء سجل المستخدم بدور مشرف
        await setDoc(doc(db, 'users', result.user.uid), {
          name: fullName,
          email,
          role: 'admin',
          createdAt: new Date()
        }, { merge: true });

        toast({
          title: 'تم إنشاء حساب المشرف',
          description: 'تم تحويلك للوحة التحكم'
        });

        // تحديث حالة المشرف والدخول مباشرة
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentUserId', result.user.uid);
        localStorage.setItem('userRole', 'admin');
        
        // تحديث حالة المستخدم الحالي
        setCurrentUser({
          ...result.user,
          role: 'admin',
          isAdmin: true
        });
        
        onLogin();
        navigate('/admin');
        return;
      }

      // تسجيل الدخول باستخدام Firebase Auth
      const result = await firebaseAuth.signInWithEmail(email, password);
      
      // التحقق من دور المستخدم
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const userData = userDoc.data();
      
      if (!userData || (userData.role !== 'admin' && userData.role !== 'manager')) {
        throw new Error('ليس لديك صلاحية للوصول إلى لوحة التحكم');
      }
      
      // تحديث localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('currentUserId', result.user.uid);
      localStorage.setItem('userRole', userData.role);
      
      // تحديث حالة المستخدم الحالي
      setCurrentUser({
        ...result.user,
        role: userData.role,
        isAdmin: userData.role === 'admin' || userData.role === 'manager'
      });
      
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `مرحباً ${userData.name || userData.email}`
      });
      
      onLogin();
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'بيانات غير صحيحة',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-96 space-y-4">
        <h1 className="text-xl font-semibold text-center">
          {isCreating ? 'إنشاء حساب مشرف' : 'تسجيل دخول المشرف'}
        </h1>
        
        {isCreating && (
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input 
              id="fullName"
              type="text" 
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input 
            id="email"
            type="email" 
            placeholder="admin@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input 
            id="password"
            type="password" 
            placeholder="كلمة المرور" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isCreating && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input 
              id="confirmPassword"
              type="password" 
              placeholder="تأكيد كلمة المرور" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? (isCreating ? 'جاري إنشاء الحساب...' : 'جاري تسجيل الدخول...') : (isCreating ? 'إنشاء حساب مشرف' : 'دخول')}
        </Button>
        
        <div className="text-center text-sm text-gray-600">
          {!isCreating ? (
            <>
              <p>يجب أن يكون لديك صلاحية مدير للوصول</p>
              <button
                type="button"
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => setIsCreating(true)}
              >
                إنشاء حساب مشرف جديد
              </button>
            </>
          ) : (
            <button
              type="button"
              className="mt-2 text-gray-600 hover:underline"
              onClick={() => setIsCreating(false)}
            >
              لدي حساب بالفعل؟ تسجيل الدخول
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;
