import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import logger from './logger.js';

// دعم بيئات Node التي لا توفر import.meta.env
const env = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env
  : process.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// التحقق من صحة الإعدادات
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase configuration is missing. Please check your environment variables.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// إعداد Firebase Storage مع إعدادات CORS محسنة
export const storage = getStorage(app, firebaseConfig.storageBucket);

// إعدادات إضافية للتطوير (اختياري)
if (env.VITE_APP_ENV === 'development') {
  logger.info('Firebase initialized in development mode');
  // يمكن إضافة إعدادات التطوير هنا
}

export default app;
