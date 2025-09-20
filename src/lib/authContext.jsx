import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { jwtAuthManager, firebaseAuth } from '@/lib/jwtAuth.js';
import { errorHandler } from '@/lib/errorHandler.js';
import logger from '@/lib/logger.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const { i18n } = useTranslation();
  const activeLanguage = i18n.language || i18n.resolvedLanguage || 'ar';

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const user = jwtAuthManager.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsCustomer(true);
          if (user.isAdmin || user.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        const errorObject = errorHandler.handleError(error, 'auth:status-check', activeLanguage);
        logger.error('Auth status check failed:', errorObject);
        jwtAuthManager.clearTokens();
        setIsCustomer(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    };
    checkAuthStatus();
  }, [activeLanguage]);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChange(async ({ user, isAuthenticated }) => {
      if (isAuthenticated && user) {
        setCurrentUser(user);
        setIsCustomer(true);
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase.js');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          if (userData && (userData.role === 'admin' || userData.role === 'manager')) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          logger.error('Error checking user role:', err);
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsCustomer(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = (user, options = { isAdmin: false }) => {
    setCurrentUser(user);
    setIsCustomer(true);
    setIsAdmin(!!options.isAdmin);
  };

  const logout = () => {
    jwtAuthManager.clearTokens();
    setCurrentUser(null);
    setIsAdmin(false);
    setIsCustomer(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, isCustomer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
