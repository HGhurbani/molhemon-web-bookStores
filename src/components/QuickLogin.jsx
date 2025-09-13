import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { 
  User, 
  Shield, 
  Crown, 
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';
import authManager from '@/lib/authManager.js';
import { db } from '@/lib/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

const QuickLogin = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: 'admin@molhem.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async () => {
    try {
      setLoading(true);
      
      // إنشاء مستخدم مدير في قاعدة البيانات
      const adminData = {
        uid: 'quick-admin',
        email: loginData.email,
        displayName: 'مدير سريع',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isQuickAdmin: true
      };

      // حفظ المستخدم في قاعدة البيانات
      await setDoc(doc(db, 'users', 'quick-admin'), adminData);
      
      // تحديث حالة المصادقة
      authManager.currentUser = {
        uid: 'quick-admin',
        email: loginData.email,
        displayName: 'مدير سريع'
      };
      authManager.userRole = 'admin';
      
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `مرحباً ${adminData.displayName}`,
        variant: 'default'
      });
      
      setShowLogin(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Error in quick login:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  if (!showLogin) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowLogin(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <LogIn className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          تسجيل دخول سريع
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">تسجيل دخول سريع</h2>
          <p className="text-gray-600 mt-2">للوصول إلى لوحة التحكم</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleInputChange}
              placeholder="admin@molhem.com"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="كلمة المرور"
                className="pr-10 rtl:pl-10 rtl:pr-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 rtl:space-x-reverse mt-6">
          <Button
            variant="outline"
            onClick={() => setShowLogin(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleQuickLogin}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 rtl:ml-2 rtl:mr-0"></div>
                جاري تسجيل الدخول...
              </div>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تسجيل الدخول
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-white text-sm">
            <Shield className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>سيتم إنشاء مستخدم مدير مؤقت للوصول إلى لوحة التحكم</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickLogin;
