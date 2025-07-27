
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog.jsx';
import { User, ShoppingBag, Heart, Settings, LogOut, Edit2, MapPin, CreditCard as CreditCardIcon, Bell, Gift, Shield } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import { toast } from '@/components/ui/use-toast.js';
import api from '@/lib/api.js';
import FormattedPrice from '@/components/FormattedPrice.jsx';

const UserProfilePage = ({ handleFeatureClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', profilePicture: '' });
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', country: '' });
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: '', last4: '', expiry: '' });


  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'profile');
  }, [searchParams]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);
    (async () => {
      try {
        const uid = localStorage.getItem('currentUserId');
        if (!uid) return;
        const [user, addr, pay, ordersData] = await Promise.all([
          api.getUser(uid),
          api.getUserAddresses(uid),
          api.getUserPaymentMethods(uid),
          api.getOrders(),
        ]);
        if (user) setUserData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          profilePicture: user.profilePicture || '',
        });
        setAddresses(addr || []);
        setPaymentMethods(pay || []);
        const filteredOrders = (ordersData || []).filter(o => o.customer_id === uid);
        setOrders(filteredOrders);
      } catch (e) {
        console.error('Failed to fetch profile data', e);
      }
    })();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const uid = localStorage.getItem('currentUserId');
    if (!uid) return;
    try {
      await api.updateUser(uid, userData);
      toast({ title: "تم تحديث الملف الشخصي بنجاح!" });
    } catch {
      toast({ title: "تعذر تحديث الملف الشخصي", variant: "destructive" });
    }
  };

  const handleToggleWishlist = (book) => {
    const updatedWishlist = wishlist.filter(item => item.id !== book.id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast({ title: "تم الحذف من المفضلة", description: `تم حذف "${book.title}" من قائمة الرغبات.`, variant: "destructive" });
  };

  const handleSaveAddress = async () => {
    const uid = localStorage.getItem('currentUserId');
    if (!uid) return;
    let updated;
    try {
      if (newAddress.id) {
        await api.updateUserAddress(uid, newAddress.id, newAddress);
        updated = addresses.map(a => (a.id === newAddress.id ? newAddress : a));
      } else {
        const added = await api.addUserAddress(uid, newAddress);
        updated = [...addresses, added];
      }
      setAddresses(updated);
      setNewAddress({ name: '', street: '', city: '', country: '' });
      setAddressDialogOpen(false);
    } catch {
      toast({ title: 'تعذر حفظ العنوان', variant: 'destructive' });
    }
  };

  const handleSavePayment = async () => {
    const uid = localStorage.getItem('currentUserId');
    if (!uid) return;
    try {
      const added = await api.addUserPaymentMethod(uid, newPayment);
      setPaymentMethods([...paymentMethods, added]);
      setNewPayment({ type: '', last4: '', expiry: '' });
      setPaymentDialogOpen(false);
    } catch {
      toast({ title: 'تعذر حفظ طريقة الدفع', variant: 'destructive' });
    }
  };
  
  const handleAddAddress = () => setAddressDialogOpen(true);
  const handleEditAddress = (id) => {
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setNewAddress(addr);
      setAddressDialogOpen(true);
    }
  };
  const handleDeleteAddress = async (id) => {
    const uid = localStorage.getItem('currentUserId');
    if (!uid) return;
    try {
      await api.deleteUserAddress(uid, id);
      const updated = addresses.filter(a => a.id !== id);
      setAddresses(updated);
    } catch {
      toast({ title: 'تعذر حذف العنوان', variant: 'destructive' });
    }
  };
  const handleAddPaymentMethod = () => setPaymentDialogOpen(true);


  const navSections = [
    {
      label: 'حسابي',
      items: [
        { id: 'profile', label: 'الملف الشخصي', icon: User },
        { id: 'payment', label: 'البنوك والبطاقات', icon: CreditCardIcon },
        { id: 'addresses', label: 'العناوين', icon: MapPin },
        { id: 'notification-settings', label: 'إعدادات الاشعارات', icon: Bell },
        { id: 'privacy-settings', label: 'إعدادات الخصوصية', icon: Shield },
      ],
    },
    {
      label: 'مشترياتي',
      items: [
        { id: 'orders', label: 'مشترياتي', icon: ShoppingBag },
        { id: 'wishlist', label: 'قائمة الرغبات', icon: Heart },
      ],
    },
    {
      label: 'الاشعارات',
      items: [
        { id: 'notifications', label: 'الإشعارات', icon: Bell },
      ],
    },
    {
      label: 'قسائمي',
      items: [
        { id: 'coupons', label: 'قسائمي', icon: Gift },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">تعديل الملف الشخصي</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                  <img-replace src={userData.profilePicture} alt="صورة الملف الشخصي" className="w-full h-full object-cover" />
                  صورة بروس وين الشخصية
                </div>
                <Button variant="link" size="sm" onClick={() => handleFeatureClick('change-profile-picture')}>تغيير الصورة</Button>
              </div>
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" type="tel" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">حفظ التغييرات</Button>
            </form>
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">طلباتي</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border p-4 rounded-md hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-600">طلب رقم: {order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'تم التوصيل' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">التاريخ: {order.date}</p>
                    <p className="text-sm text-gray-500">الإجمالي: <FormattedPrice value={order.total} /></p>
                    <p className="text-sm text-gray-500">المنتجات: {order.items.map(i => i.title).join(', ')}</p>
                    <Button asChild variant="link" size="sm" className="px-0 mt-1">
                      <Link to={`/orders/${order.id}`}>عرض التفاصيل</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : <p>لا توجد طلبات حتى الآن.</p>}
          </motion.div>
        );
      case 'wishlist':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">قائمة الرغبات ({wishlist.length})</h2>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((book, index) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    handleAddToCart={(selectedBook) => {
                      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                      const existingBook = cart.find(item => item.id === selectedBook.id);
                      let newCart;
                      if (existingBook) {
                        newCart = cart.map(item => item.id === selectedBook.id ? { ...item, quantity: item.quantity + 1 } : item);
                      } else {
                        newCart = [...cart, { ...selectedBook, quantity: 1 }];
                      }
                      localStorage.setItem('cart', JSON.stringify(newCart));
                      toast({ title: "تمت الإضافة للسلة", description: `تم إضافة "${selectedBook.title}" إلى سلة التسوق.` });
                    }}
                    handleToggleWishlist={handleToggleWishlist} 
                    index={index}
                    isInWishlist={true}
                  />
                ))}
              </div>
            ) : <p>قائمة الرغبات فارغة.</p>}
          </motion.div>
        );
      case 'addresses':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">العناوين المحفوظة</h2>
              <Button onClick={handleAddAddress} size="sm" className="bg-blue-600 hover:bg-blue-700">إضافة عنوان جديد</Button>
            </div>
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className="border p-3 rounded-md flex justify-between items-start">
                  <div>
                    <p className="font-medium">{addr.name} {addr.default && <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full ml-2 rtl:mr-2 rtl:ml-0">افتراضي</span>}</p>
                    <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.country}</p>
                  </div>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-500 hover:text-blue-600" onClick={() => handleEditAddress(addr.id)}><Edit2 className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-gray-500 hover:text-red-600" onClick={() => handleDeleteAddress(addr.id)}><User className="w-4 h-4"/></Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'payment':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">البنوك والبطاقات</h2>
                <Button onClick={handleAddPaymentMethod} size="sm" className="bg-blue-600 hover:bg-blue-700">إضافة طريقة دفع</Button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map(pm => (
                <div key={pm.id} className="border p-3 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCardIcon className="w-6 h-6 text-blue-500 mr-3 rtl:ml-3 rtl:mr-0"/>
                    <div>
                      <p className="font-medium">{pm.type} تنتهي بـ {pm.last4} {pm.default && <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full ml-2 rtl:mr-2 rtl:ml-0">افتراضي</span>}</p>
                      <p className="text-sm text-gray-500">تنتهي في: {pm.expiry}</p>
                    </div>
                  </div>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="text-red-600 hover:text-red-700"
                     onClick={async () => {
                       const uid = localStorage.getItem('currentUserId');
                       if (!uid) return;
                       try {
                         await api.deleteUserPaymentMethod(uid, pm.id);
                         const updated = paymentMethods.filter(p => p.id !== pm.id);
                         setPaymentMethods(updated);
                       } catch {
                         toast({ title: 'تعذر حذف طريقة الدفع', variant: 'destructive' });
                       }
                     }}
                   >
                     حذف
                   </Button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'notification-settings':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">إعدادات الإشعارات</h2>
            <p>يمكنك التحكم في نوع الإشعارات التي ترغب باستلامها.</p>
          </motion.div>
        );
      case 'privacy-settings':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">إعدادات الخصوصية</h2>
            <p>قم بضبط الخيارات المتعلقة بخصوصية حسابك.</p>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">الإشعارات</h2>
            <p>لا توجد إشعارات حالياً.</p>
          </motion.div>
        );
      case 'coupons':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">قسائمي</h2>
            <p>لا توجد قسائم متاحة.</p>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">إعدادات الحساب</h2>
            <p>هنا يمكنك تغيير كلمة المرور، إعدادات الإشعارات، إلخ.</p>
            <Button className="mt-4" onClick={() => handleFeatureClick('change-password')}>تغيير كلمة المرور</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8"
      >
        حسابي
      </motion.h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow sticky top-24">
            <div className="flex items-center mb-4 pb-4 border-b">
              <img-replace src={userData.profilePicture} alt="صورة الملف الشخصي المصغرة" className="w-12 h-12 rounded-full object-cover mr-3 rtl:ml-3 rtl:mr-0" />
              صورة بروس وين الشخصية المصغرة
              <div>
                <h3 className="font-semibold">{userData.name}</h3>
                <p className="text-xs text-gray-500">{userData.email}</p>
              </div>
            </div>
            <nav className="space-y-4">
              {navSections.map(section => (
                <div key={section.label} className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{section.label}</p>
                  {section.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? 'default' : 'ghost'}
                        className={`w-full justify-start text-sm ${activeTab === item.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleFeatureClick('logout')}>
                <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تسجيل الخروج
              </Button>
            </nav>
          </div>
        </aside>
        <main className="lg:w-3/4">
          {renderContent()}
        </main>
      </div>

      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عنوان</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="اسم العنوان" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
            <Input placeholder="الشارع" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
            <Input placeholder="المدينة" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
            <Input placeholder="الدولة" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSaveAddress}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طريقة دفع</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="نوع البطاقة" value={newPayment.type} onChange={e => setNewPayment({ ...newPayment, type: e.target.value })} />
            <Input placeholder="آخر أربعة أرقام" value={newPayment.last4} onChange={e => setNewPayment({ ...newPayment, last4: e.target.value })} />
            <Input placeholder="تاريخ الانتهاء" value={newPayment.expiry} onChange={e => setNewPayment({ ...newPayment, expiry: e.target.value })} />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSavePayment}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePage;
