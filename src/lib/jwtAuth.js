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
import logger from './logger.js';

class JWTAuthManager {
  async getIdToken(forceRefresh = false) {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(forceRefresh);
    }
    return null;
  }

  getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerId: user.providerId,
      phoneNumber: user.phoneNumber
    };
  }

  async updateUserData(updatedUserData) {
    if (!auth.currentUser) return null;
    try {
      await updateProfile(auth.currentUser, updatedUserData);
      await auth.currentUser.reload();
      return this.getIdToken(true);
    } catch (error) {
      logger.error('Error updating user data:', error);
      throw new Error('فشل في تحديث بيانات المستخدم');
    }
  }

  clearTokens() {
    // No local tokens to clear when using Firebase auth
  }

  isAuthenticated() {
    return !!auth.currentUser;
  }
}

export const jwtAuthManager = new JWTAuthManager();

export const firebaseAuth = {
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      logger.info('User signed in:', user);
      const idToken = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      return {
        user: userData,
        token: idToken,
        success: true
      };
    } catch (error) {
      logger.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  async createAccount(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      logger.info('User created:', user);
      if (displayName) {
        try {
          await updateProfile(user, { displayName });
          logger.info('Profile updated successfully with displayName:', displayName);
          await new Promise(resolve => setTimeout(resolve, 500));
          await user.reload();
          logger.debug('User profile after reload:', user);
        } catch (profileError) {
          logger.error('Failed to update profile, but continuing:', profileError);
        }
      }
      const idToken = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      return {
        user: userData,
        token: idToken,
        success: true
      };
    } catch (error) {
      logger.error('Create account error:', error);
      throw this.handleAuthError(error);
    }
  },

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      return {
        user: userData,
        token: idToken,
        success: true
      };
    } catch (error) {
      logger.error('Google sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        providerId: user.providerId
      };
      return {
        user: userData,
        token: idToken,
        success: true
      };
    } catch (error) {
      logger.error('Facebook sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      jwtAuthManager.clearTokens();
      return { success: true };
    } catch (error) {
      logger.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور' };
    } catch (error) {
      logger.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  },

  async confirmPasswordReset(code, newPassword) {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (error) {
      logger.error('Confirm password reset error:', error);
      throw this.handleAuthError(error);
    }
  },

  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        logger.debug('Auth state changed - user:', user);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerId: user.providerId
        };
        callback({ user: userData, isAuthenticated: true });
      } else {
        logger.debug('Auth state changed - no user');
        callback({ user: null, isAuthenticated: false });
      }
    });
  },

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

export default jwtAuthManager;

