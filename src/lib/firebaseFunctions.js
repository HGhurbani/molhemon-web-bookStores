import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from './firebase';
import logger from './logger.js';

const functions = getFunctions();

// Payment Functions
export const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');
export const createPayPalOrder = httpsCallable(functions, 'createPayPalOrder');

// Google Merchant Functions
export const importGoogleMerchantCatalog = httpsCallable(functions, 'importGoogleMerchantCatalog');

// Order Functions
export const processOrder = httpsCallable(functions, 'processOrder');

// Shipping Functions
export const calculateShipping = httpsCallable(functions, 'calculateShipping');

// Inventory Functions
export const updateStock = httpsCallable(functions, 'updateStock');

// Analytics Functions
export const getDashboardStats = httpsCallable(functions, 'getDashboardStats');

// Security Functions
export const validateUserAccess = httpsCallable(functions, 'validateUserAccess');

// Enhanced Firebase API with Functions
export const firebaseFunctionsApi = {
  // Payment operations
  payments: {
    createStripeIntent: async (data) => {
      try {
        const result = await createStripePaymentIntent(data);
        return result.data;
      } catch (error) {
        logger.error('Stripe Payment Intent Error:', error);
        throw error;
      }
    },

    createPayPalOrder: async (data) => {
      try {
        const result = await createPayPalOrder(data);
        return result.data;
      } catch (error) {
        logger.error('PayPal Order Error:', error);
        throw error;
      }
    }
  },

  // Order operations
  orders: {
    process: async (orderData, paymentData) => {
      try {
        const result = await processOrder({ orderData, paymentData });
        return result.data;
      } catch (error) {
        logger.error('Order Processing Error:', error);
        throw error;
      }
    }
  },

  // Shipping operations
  shipping: {
    calculate: async (items, shippingAddress, shippingMethod) => {
      try {
        const result = await calculateShipping({ items, shippingAddress, shippingMethod });
        return result.data;
      } catch (error) {
        logger.error('Shipping Calculation Error:', error);
        throw error;
      }
    }
  },

  // Inventory operations
  inventory: {
    updateStock: async (productId, quantity, operation = 'decrease') => {
      try {
        const result = await updateStock({ productId, quantity, operation });
        return result.data;
      } catch (error) {
        logger.error('Stock Update Error:', error);
        throw error;
      }
    }
  },

  // Analytics operations
  analytics: {
    getDashboardStats: async () => {
      try {
        const result = await getDashboardStats();
        return result.data;
      } catch (error) {
        logger.error('Dashboard Stats Error:', error);
        throw error;
      }
    }
  },

  // Security operations
  security: {
    validateAccess: async (resource, action) => {
      try {
        const result = await validateUserAccess({ resource, action });
        return result.data;
      } catch (error) {
        logger.error('Access Validation Error:', error);
        throw error;
      }
    }
  },

  // Google Merchant operations
  googleMerchant: {
    importCatalog: async (config) => {
      try {
        const result = await importGoogleMerchantCatalog(config);
        return result.data;
      } catch (error) {
        logger.error('Google Merchant import error:', error);
        throw error;
      }
    }
  }
};

export default firebaseFunctionsApi;
