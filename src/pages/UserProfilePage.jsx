
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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
import { jwtAuthManager } from '@/lib/jwtAuth.js';
import { auth } from '@/lib/firebase.js';
import { updateProfile } from 'firebase/auth';
import logger from '@/lib/logger.js';

const UserProfilePage = ({ handleFeatureClick }) => {
  const navigate = useNavigate();
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
  
  // حالة المستخدم والمصادقة
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'profile');
  }, [searchParams]);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        
        // التحقق من حالة المصادقة
        const user = jwtAuthManager.getCurrentUser();
        if (!user) {
          // المستخدم غير مسجل دخول، الانتقال لصفحة تسجيل الدخول
          navigate('/login');
          return;
        }
        
        setCurrentUser(user);
        setIsLoggedIn(true);
        
        // تعبئة البيانات الأساسية من المستخدم
        logger.debug('User data from JWT:', user);
        
        // محاولة جلب البيانات من Firebase مباشرة إذا كانت البيانات المحفوظة فارغة
        let displayName = user.displayName;
        let phoneNumber = user.phoneNumber;
        
        if (!displayName && auth.currentUser) {
          displayName = auth.currentUser.displayName || '';
          logger.debug('Got displayName from Firebase auth:', displayName);
        }
        if (!phoneNumber && auth.currentUser) {
          phoneNumber = auth.currentUser.phoneNumber || '';
          logger.debug('Got phoneNumber from Firebase auth:', phoneNumber);
        }
        
        setUserData({
          name: displayName || '',
          email: user.email || '',
          phone: phoneNumber || '',
          profilePicture: user.photoURL || ''
        });
        
        // تحميل قائمة الرغبات
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(storedWishlist);
        
        // محاولة جلب بيانات العميل من قاعدة البيانات
        try {
          const userData = {
            email: user.email,
            displayName: user.displayName,
            phone: user.phoneNumber
          };
          
          const [customer, addr, pay, ordersData] = await Promise.all([
            api.getCustomerData(user.uid, userData),
            api.getCustomerAddresses(user.uid),
            api.getCustomerPaymentMethods(user.uid),
            api.orders.getOrders(user.uid)
          ]);
          
          // تحديث البيانات من ملف العميل إذا كان متوفراً
          if (customer) {
            setUserData(prev => ({
              ...prev,
              name: customer.displayName || (customer.firstName + ' ' + customer.lastName).trim() || prev.name,
              email: customer.email || prev.email,
              phone: customer.phone || prev.phone,
              profilePicture: customer.profilePicture || prev.profilePicture
            }));
          }
          
        setAddresses(addr || []);
        setPaymentMethods(pay || []);
          
          // تعيين الطلبات (تم تصفيتها بالفعل من API)
          setOrders(ordersData || []);
          
        } catch (error) {
          logger.info('Customer profile not found, using basic user data');
          // إذا لم يتم العثور على ملف العميل، نستخدم البيانات الأساسية
        }
        
      } catch (error) {
        logger.error('Failed to fetch profile data:', error);
        toast({
          title: 'خطأ في تحميل البيانات',
          description: 'تعذر تحميل بيانات الملف الشخصي',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeProfile();
  }, [navigate]);

  // مراقبة حالة المصادقة وتحديث البيانات من Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && isLoggedIn) {
        logger.debug('Firebase auth state changed:', firebaseUser);
        
        // تحديث البيانات من Firebase إذا كانت متوفرة
        const updatedUserData = {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          profilePicture: firebaseUser.photoURL || ''
        };
        
        logger.debug('Updating user data from Firebase:', updatedUserData);
        setUserData(prev => ({
          ...prev,
          ...updatedUserData
        }));
        
        // تحديث البيانات في JWT أيضاً
        if (currentUser) {
          const updatedJWTData = {
            ...currentUser,
            displayName: firebaseUser.displayName || currentUser.displayName,
            email: firebaseUser.email || currentUser.email,
            phoneNumber: firebaseUser.phoneNumber || currentUser.phoneNumber,
            photoURL: firebaseUser.photoURL || currentUser.photoURL
          };
          
          try {
            jwtAuthManager.updateUserData(updatedJWTData);
            logger.debug('JWT data updated successfully');
          } catch (error) {
            logger.error('Failed to update JWT data:', error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn, currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      // تحديث البيانات في ملف العميل
      if (userData.name) {
        const [firstName, ...lastNameParts] = userData.name.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        
        await api.customers.updateCustomer(currentUser.uid, {
          firstName: firstName || '',
          lastName: lastName,
          email: userData.email,
          phone: userData.phone
        });
      }
      
      // محاولة تحديث البيانات في Firebase أيضاً
      if (auth.currentUser && userData.name) {
        try {
          await updateProfile(auth.currentUser, { 
            displayName: userData.name 
          });
          logger.info('Firebase profile updated successfully');
          
          // تحديث البيانات في JWT أيضاً
          const updatedUserData = {
            ...currentUser,
            displayName: userData.name
          };
          jwtAuthManager.updateUserData(updatedUserData);
          
        } catch (firebaseError) {
          logger.error('Failed to update Firebase profile:', firebaseError);
        }
      }
      
      toast({ title: "تم تحديث الملف الشخصي بنجاح!" });
    } catch (error) {
      logger.error('Error updating profile:', error);
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
    if (!currentUser) return;
    let updated;
    try {
      if (newAddress.id) {
        await api.customers.updateCustomerAddress(currentUser.uid, newAddress.id, newAddress);
        updated = addresses.map(a => (a.id === newAddress.id ? newAddress : a));
      } else {
        const added = await api.customers.addCustomerAddress(currentUser.uid, newAddress);
        updated = [...addresses, added];
      }
      setAddresses(updated);
      setNewAddress({ name: '', street: '', city: '', country: '' });
      setAddressDialogOpen(false);
      toast({ title: 'تم حفظ العنوان بنجاح!' });
    } catch (error) {
      logger.error('Error saving address:', error);
      toast({ title: 'تعذر حفظ العنوان', variant: 'destructive' });
    }
  };

  const handleSavePayment = async () => {
    if (!currentUser) return;
    try {
      const added = await api.customers.addCustomerPaymentMethod(currentUser.uid, newPayment);
      setPaymentMethods([...paymentMethods, added]);
      setNewPayment({ type: '', last4: '', expiry: '' });
      setPaymentDialogOpen(false);
      toast({ title: 'تم حفظ طريقة الدفع بنجاح!' });
    } catch (error) {
      logger.error('Error saving payment method:', error);
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
    if (!currentUser) return;
    try {
      await api.customers.deleteCustomerAddress(currentUser.uid, id);
      const updated = addresses.filter(a => a.id !== id);
      setAddresses(updated);
      toast({ title: 'تم حذف العنوان بنجاح!' });
    } catch (error) {
      logger.error('Error deleting address:', error);
      toast({ title: 'تعذر حذف العنوان', variant: 'destructive' });
    }
  };
  const handleAddPaymentMethod = () => setPaymentDialogOpen(true);

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await jwtAuthManager.clearTokens();
      setCurrentUser(null);
      setIsLoggedIn(false);
      navigate('/');
      toast({ title: 'تم تسجيل الخروج بنجاح' });
    } catch (error) {
      logger.error('Error logging out:', error);
      toast({ title: 'خطأ في تسجيل الخروج', variant: 'destructive' });
    }
  };


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
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 bg-blue-100 flex items-center justify-center">
                  {userData.profilePicture ? (
                    <img src={userData.profilePicture} alt="صورة الملف الشخصي" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <Button variant="link" size="sm" onClick={() => handleFeatureClick('change-profile-picture')}>تغيير الصورة</Button>
              </div>
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input 
                  id="name" 
                  value={userData.name} 
                  onChange={(e) => setUserData({...userData, name: e.target.value})} 
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userData.email} 
                  onChange={(e) => setUserData({...userData, email: e.target.value})} 
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={userData.phone} 
                  onChange={(e) => setUserData({...userData, phone: e.target.value})} 
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                حفظ التغييرات
              </Button>
              
              {/* رسالة توضيحية */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-white">
                  <strong>ملاحظة:</strong> سيتم حفظ البيانات في ملفك الشخصي ويمكنك استخدامها في الطلبات المستقبلية.
                </p>
              </div>
            </form>
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              طلباتي
            </h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-semibold text-blue-600">طلب رقم: {order.orderNumber || order.id}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          التاريخ: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        order.status === 'delivered' || order.status === 'تم التوصيل' 
                          ? 'bg-green-100 text-green-700' 
                          : order.status === 'cancelled' || order.status === 'ملغي'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'pending' ? 'قيد المراجعة' : 
                         order.status === 'confirmed' ? 'مؤكد' :
                         order.status === 'shipped' ? 'تم الشحن' :
                         order.status === 'delivered' ? 'تم التوصيل' :
                         order.status === 'cancelled' ? 'ملغي' : order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">الإجمالي:</p>
                        <p className="font-medium text-lg">
                          <FormattedPrice value={(() => {
                            // حساب المبلغ الإجمالي بشكل صحيح مع التحقق من طريقة الشحن
                            const subtotal = order.subtotal || 0;
                            const taxAmount = order.taxAmount || 0;
                            const discountAmount = order.discountAmount || 0;
                            
                            // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
                            const shippingMethod = order.shippingMethod;
                            const isPickup = shippingMethod === 'pickup' || 
                                            shippingMethod?.name === 'استلام من المتجر' ||
                                            shippingMethod?.id === 'pickup' ||
                                            shippingMethod?.type === 'pickup';
                            
                            const shippingCost = isPickup ? 0 : (order.shippingCost || 0);
                            
                            // حساب الإجمالي: المجموع الفرعي - الخصم + الشحن + الضريبة
                            const calculatedTotal = subtotal - discountAmount + shippingCost + taxAmount;
                            
                            // استخدام الحساب الصحيح بدلاً من القيم المحفوظة
                            return calculatedTotal;
                          })()} />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">عدد المنتجات:</p>
                        <p className="font-medium">{order.itemCount || (order.items?.length || 0)} منتج</p>
                      </div>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">المنتجات:</p>
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-sm text-gray-700">
                              • {item.title || item.name || item.productName} × {item.quantity}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-sm text-gray-500">
                              + {order.items.length - 3} منتج آخر
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/orders/${order.id}`}>
                          عرض التفاصيل
                        </Link>
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                          تقييم الطلب
                        </Button>
                      )}
                    </div>
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
                       const uid = currentUser?.uid;
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

  // عرض مؤشر التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  // التحقق من تسجيل الدخول
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لعرض ملفك الشخصي</p>
          <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

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
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                {userData.profilePicture ? (
                  <img src={userData.profilePicture} alt="صورة الملف الشخصي" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{userData.name || 'المستخدم'}</h3>
                <p className="text-xs text-gray-500">{userData.email || 'لا يوجد بريد إلكتروني'}</p>
                {userData.phone && (
                  <p className="text-xs text-gray-500">{userData.phone}</p>
                )}
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
              <Button variant="ghost" className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
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
