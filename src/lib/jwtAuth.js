import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';

// JWT Token Management
class JWTAuthManager {
  constructor() {
    this.tokenKey = 'molhemon_jwt_token';
    this.refreshTokenKey = 'molhemon_refresh_token';
    this.userKey = 'molhemon_user_data';
  }

  // إنشاء JWT token
  createToken(userData) {
    try {
      const token = {
        user: userData,
        iat: Date.now(),
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        type: 'access'
      };
      
      const refreshToken = {
        user: { uid: userData.uid },
        iat: Date.now(),
        exp: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        type: 'refresh'
      };

      localStorage.setItem(this.tokenKey, JSON.stringify(token));
      localStorage.setItem(this.refreshTokenKey, JSON.stringify(refreshToken));
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      
      return { token, refreshToken };
    } catch (error) {
      console.error('Error creating JWT token:', error);
      throw new Error('فشل في إنشاء رمز المصادقة');
    }
  }

  // التحقق من صحة JWT token
  verifyToken() {
    try {
      const tokenStr = localStorage.getItem(this.tokenKey);
      if (!tokenStr) return null;

      const token = JSON.parse(tokenStr);
      
      // التحقق من انتهاء الصلاحية
      if (Date.now() > token.exp) {
        this.clearTokens();
        return null;
      }

      return token.user;
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      this.clearTokens();
      return null;
    }
  }

  // تحديث JWT token
  refreshToken() {
    try {
      const refreshTokenStr = localStorage.getItem(this.refreshTokenKey);
      if (!refreshTokenStr) return null;

      const refreshToken = JSON.parse(refreshTokenStr);
      
      // التحقق من انتهاء صلاحية refresh token
      if (Date.now() > refreshToken.exp) {
        this.clearTokens();
        return null;
      }

      // إعادة إنشاء access token
      const userData = JSON.parse(localStorage.getItem(this.userKey));
      if (userData) {
        return this.createToken(userData);
      }

      return null;
    } catch (error) {
      console.error('Error refreshing JWT token:', error);
      this.clearTokens();
      return null;
    }
  }

  // مسح جميع tokens
  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  // تحديث بيانات المستخدم
  updateUserData(updatedUserData) {
    try {
      // تحديث البيانات في localStorage
      localStorage.setItem(this.userKey, JSON.stringify(updatedUserData));
      
      // إعادة إنشاء token مع البيانات المحدثة
      return this.createToken(updatedUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('فشل في تحديث بيانات المستخدم');
    }
  }

  // الحصول على user الحالي
  getCurrentUser() {
    return this.verifyToken();
  }

  // التحقق من تسجيل الدخول
  isAuthenticated() {
    return !!this.verifyToken();
  }
}

// إنشاء instance من JWT Manager
export const jwtAuthManager = new JWTAuthManager();

// Firebase Authentication Functions
export const firebaseAuth = {
  // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User signed in:', user);
      
      // إنشاء JWT token
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      
      console.log('Creating JWT token for sign in:', userData);
      const tokens = jwtAuthManager.createToken(userData);
      
      return {
        user: userData,
        tokens,
        success: true
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // إنشاء حساب جديد
  async createAccount(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User created:', user);
      
      // تحديث اسم المستخدم
      if (displayName) {
        try {
          await updateProfile(user, { displayName });
          console.log('Profile updated successfully with displayName:', displayName);
          
          // انتظار قليلاً لضمان تحديث البيانات
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // التحقق من أن البيانات تم تحديثها
          await user.reload();
          console.log('User profile after reload:', user);
          
        } catch (profileError) {
          console.warn('Failed to update profile, but continuing:', profileError);
        }
      }
      
      // إنشاء JWT token مع البيانات المحدثة
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      
      console.log('Creating JWT token with user data:', userData);
      const tokens = jwtAuthManager.createToken(userData);
      
      return {
        user: userData,
        tokens,
        success: true
      };
    } catch (error) {
      console.error('Create account error:', error);
      throw this.handleAuthError(error);
    }
  },

  // تسجيل الدخول بـ Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // إنشاء JWT token
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      
      const tokens = jwtAuthManager.createToken(userData);
      
      return {
        user: userData,
        tokens,
        success: true
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // تسجيل الدخول بـ Facebook
  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // إنشاء JWT token
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      
      const tokens = jwtAuthManager.createToken(userData);
      
      return {
        user: userData,
        tokens,
        success: true
      };
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // تسجيل الخروج
  async signOut() {
    try {
      await signOut(auth);
      jwtAuthManager.clearTokens();
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور' };
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  },

  // تأكيد إعادة تعيين كلمة المرور
  async confirmPasswordReset(code, newPassword) {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw this.handleAuthError(error);
    }
  },

  // مراقبة حالة المصادقة
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Auth state changed - user:', user);
        // تحديث JWT token عند تغيير حالة المستخدم
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerId: user.providerId
        };
        
        console.log('Updating JWT token with user data:', userData);
        jwtAuthManager.createToken(userData);
        callback({ user: userData, isAuthenticated: true });
      } else {
        console.log('Auth state changed - no user');
        jwtAuthManager.clearTokens();
        callback({ user: null, isAuthenticated: false });
      }
    });
  },

  // معالجة أخطاء المصادقة
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('البريد الإلكتروني غير مسجل');
      case 'auth/wrong-password':
        return new Error('كلمة المرور غير صحيحة');
      case 'auth/email-already-in-use':
        return new Error('البريد الإلكتروني مستخدم بالفعل');
      case 'auth/weak-password':
        return new Error('كلمة المرور ضعيفة جداً');
      case 'auth/invalid-email':
        return new Error('البريد الإلكتروني غير صحيح');
      case 'auth/too-many-requests':
        return new Error('تم تجاوز عدد المحاولات المسموح، حاول لاحقاً');
      case 'auth/network-request-failed':
        return new Error('فشل في الاتصال بالشبكة');
      case 'auth/popup-closed-by-user':
        return new Error('تم إغلاق نافذة تسجيل الدخول');
      case 'auth/popup-blocked':
        return new Error('تم حظر النافذة المنبثقة، اسمح بها في إعدادات المتصفح');
      default:
        return new Error(`خطأ في المصادقة: ${error.message}`);
    }
  }
};

// Export JWT Manager for direct access
export default jwtAuthManager;

