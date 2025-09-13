import { auth, db } from './firebase.js';
import { toast } from '@/components/ui/use-toast.js';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, limit, getDocs } from 'firebase/firestore';

// التحقق من صحة استيراد db
console.log('DB imported:', db);
console.log('DB type:', typeof db);

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.userRole = null;
    this.isInitialized = false;
  }

  // تهيئة نظام المصادقة
  async initialize() {
    try {
      // مراقبة تغييرات حالة المصادقة
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.currentUser = user;
          await this.loadUserRole(user.uid);
        } else {
          this.currentUser = null;
          this.userRole = null;
        }
        this.isInitialized = true;
      });

      // إذا كان المستخدم مسجل دخول بالفعل
      if (auth.currentUser) {
        this.currentUser = auth.currentUser;
        await this.loadUserRole(auth.currentUser.uid);
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing auth manager:', error);
    }
  }

  // تحميل دور المستخدم
  async loadUserRole(uid) {
    try {
      console.log('loadUserRole called with uid:', uid);
      console.log('db object:', db);
      console.log('db type:', typeof db);
      
      if (!db) {
        console.error('Firebase db is not available');
        this.userRole = 'user';
        return;
      }
      
      console.log('Attempting to access users collection using v9 API...');
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      console.log('User document retrieved:', userDoc.exists());
      
      if (userDoc.exists()) {
        this.userRole = userDoc.data().role || 'user';
        console.log('User role set to:', this.userRole);
      } else {
        // إنشاء مستخدم جديد بدور user
        console.log('User document does not exist, creating new user...');
        await this.createUserDocument(uid);
        this.userRole = 'user';
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      this.userRole = 'user';
    }
  }

  // إنشاء مستند المستخدم
  async createUserDocument(uid) {
    try {
      if (!db) {
        console.error('Firebase db is not available for creating user document');
        return;
      }
      
      const userData = {
        uid: uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, userData);
      console.log('User document created successfully');
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }

  // التحقق من الأذونات
  hasPermission(requiredRole) {
    if (!this.isInitialized || !this.currentUser) {
      return false;
    }

    const roleHierarchy = {
      'user': 1,
      'manager': 2,
      'admin': 3
    };

    const userLevel = roleHierarchy[this.userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  // التحقق من كون المستخدم مدير
  isManager() {
    return this.hasPermission('manager');
  }

  // التحقق من كون المستخدم مشرف
  isAdmin() {
    return this.hasPermission('admin');
  }

  // الحصول على معلومات المستخدم
  getUserInfo() {
    return {
      user: this.currentUser,
      role: this.userRole,
      isManager: this.isManager(),
      isAdmin: this.isAdmin()
    };
  }

  // إنشاء مستخدم مدير افتراضي
  async createDefaultAdmin() {
    try {
      if (!db) {
        console.error('Firebase db is not available for creating default admin');
        return;
      }
      
      // التحقق من وجود مدير بالفعل
      const usersRef = collection(db, 'users');
      const adminQuery = query(usersRef, where('role', '==', 'admin'), limit(1));
      const adminQuerySnapshot = await getDocs(adminQuery);

      if (!adminQuerySnapshot.empty) {
        console.log('Admin user already exists');
        return;
      }

      // إنشاء مستخدم مدير افتراضي
      const adminData = {
        uid: 'default-admin',
        email: 'admin@molhem.com',
        displayName: 'مدير النظام',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true
      };

      const adminDocRef = doc(db, 'users', 'default-admin');
      await setDoc(adminDocRef, adminData);
      console.log('Default admin user created');
      
      toast({
        title: 'تم إنشاء مدير افتراضي',
        description: 'تم إنشاء مستخدم مدير افتراضي: admin@molhem.com',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  // تسجيل دخول تلقائي للمدير الافتراضي
  async autoLoginAsAdmin() {
    try {
      if (!db) {
        console.error('Firebase db is not available for auto login as admin');
        return;
      }
      
      // التحقق من وجود مدير في قاعدة البيانات
      const usersRef = collection(db, 'users');
      const adminQuery = query(usersRef, where('role', '==', 'admin'), limit(1));
      const adminQuerySnapshot = await getDocs(adminQuery);

      if (adminQuerySnapshot.empty) {
        console.log('No admin user found, creating default admin');
        await this.createDefaultAdmin();
        return;
      }

      const adminDoc = adminQuerySnapshot.docs[0];
      const adminData = adminDoc.data();
      
      // إذا كان المستخدم الحالي ليس مديراً، قم بتسجيل دخول كمدير
      if (!this.isManager()) {
        console.log('Current user is not admin, switching to admin mode');
        
        // إنشاء مستخدم وهمي للمدير
        const mockUser = {
          uid: adminData.uid,
          email: adminData.email,
          displayName: adminData.displayName
        };
        
        // تحديث حالة المصادقة
        this.currentUser = mockUser;
        this.userRole = 'admin';
        
        toast({
          title: 'تم تسجيل الدخول كمدير',
          description: `مرحباً ${adminData.displayName}`,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error in auto login as admin:', error);
    }
  }

  // ترقية مستخدم إلى مدير
  async promoteToAdmin(userId) {
    try {
      if (!this.isAdmin()) {
        throw new Error('Only admins can promote users');
      }

      if (!db) {
        console.error('Firebase db is not available for promoting user');
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        role: 'admin',
        updatedAt: new Date().toISOString()
      });

      toast({
        title: 'تم ترقية المستخدم',
        description: 'تم ترقية المستخدم إلى مدير بنجاح',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: 'خطأ في ترقية المستخدم',
        description: error.message,
        variant: 'destructive'
      });
    }
  }

  // عرض رسالة خطأ الأذونات
  showPermissionError(context = '') {
    const message = context ? 
      `لا تملك صلاحية الوصول لـ ${context}. يرجى تسجيل الدخول كمدير.` :
      'لا تملك صلاحية الوصول. يرجى تسجيل الدخول كمدير.';

    toast({
      title: 'خطأ في الأذونات',
      description: message,
      variant: 'destructive'
    });
  }

  // انتظار تهيئة النظام
  async waitForInitialization() {
    while (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// إنشاء instance واحد
const authManager = new AuthManager();

export default authManager;
