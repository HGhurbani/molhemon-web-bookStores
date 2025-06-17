import React, { useState } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';

const CustomerLoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'customer' && password === '123456') {
      localStorage.setItem('customerLoggedIn', 'true');
      onLogin();
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-80 space-y-4">
        <h1 className="text-xl font-semibold text-center">تسجيل دخول العميل</h1>
        <Input placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">دخول</Button>
      </form>
    </div>
  );
};

export default CustomerLoginPage;
