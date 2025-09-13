import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from './firebase';

const functions = getFunctions();

// Payment Functions
export const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');
export const createPayPalOrder = httpsCallable(functions, 'createPayPalOrder');

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
        console.error('Stripe Payment Intent Error:', error);
        throw error;
      }
    },

    createPayPalOrder: async (data) => {
      try {
        const result = await createPayPalOrder(data);
        return result.data;
      } catch (error) {
        console.error('PayPal Order Error:', error);
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
        console.error('Order Processing Error:', error);
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
        console.error('Shipping Calculation Error:', error);
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
        console.error('Stock Update Error:', error);
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
        console.error('Dashboard Stats Error:', error);
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
        console.error('Access Validation Error:', error);
        throw error;
      }
    }
  }
};

export default firebaseFunctionsApi;
