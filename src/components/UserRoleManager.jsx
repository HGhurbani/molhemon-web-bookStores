import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from '@/components/ui/use-toast.js';
import { 
  User, 
  Shield, 
  Crown, 
  Users, 
  Search,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import authManager from '@/lib/authManager.js';
import { db } from '@/lib/firebase.js';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const UserRoleManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    displayName: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // انتظار تهيئة نظام المصادقة
      await authManager.waitForInitialization();
      
      // التحقق من الأذونات
      if (!authManager.isAdmin()) {
        authManager.showPermissionError('إدارة المستخدمين');
        setLoading(false);
        return;
      }

      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'خطأ في تحميل المستخدمين',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'تم تحديث الدور',
        description: `تم تغيير دور المستخدم إلى ${getRoleName(newRole)}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'خطأ في تحديث الدور',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: 'تم حذف المستخدم',
        description: 'تم حذف المستخدم بنجاح',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'خطأ في حذف المستخدم',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.displayName) {
        toast({
          title: 'بيانات ناقصة',
          description: 'يرجى ملء جميع الحقول المطلوبة',
          variant: 'destructive'
        });
        return;
      }

      const userData = {
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'users'), userData);
      
      setUsers([...users, { id: docRef.id, ...userData }]);
      setNewUser({ email: '', displayName: '', role: 'user' });
      setShowAddUser(false);
      
      toast({
        title: 'تم إضافة المستخدم',
        description: 'تم إضافة المستخدم بنجاح',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'خطأ في إضافة المستخدم',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getRoleName = (role) => {
    const roleNames = {
      'user': 'مستخدم',
      'manager': 'مدير',
      'admin': 'مشرف'
    };
    return roleNames[role] || role;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h2>
            <p className="text-gray-600">إدارة أدوار المستخدمين وصلاحياتهم</p>
          </div>
          <Button 
            onClick={() => setShowAddUser(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            إضافة مستخدم
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="البحث في المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pr-10 rtl:pl-3"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  المستخدم
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  الدور
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="mr-4 rtl:ml-4 rtl:mr-0">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || 'بدون اسم'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getRoleIcon(user.role)}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="user">مستخدم</option>
                        <option value="manager">مدير</option>
                        <option value="admin">مشرف</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.id !== 'default-admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">إضافة مستخدم جديد</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="displayName">اسم المستخدم</Label>
                <Input
                  id="displayName"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div>
                <Label htmlFor="role">الدور</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="user">مستخدم</option>
                  <option value="manager">مدير</option>
                  <option value="admin">مشرف</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 rtl:space-x-reverse mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddUser(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                إضافة
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserRoleManager;
