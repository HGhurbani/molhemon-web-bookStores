import firebaseApi from './firebaseApi';

// Old REST based API is kept for reference but Firebase is now the default
const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}

// Export Firebase API by default and keep Google Merchant import via legacy backend
export const api = {
  ...firebaseApi,
  importGoogleMerchant: (cfg = {}) =>
    request('/api/google-merchant/import', {
      method: 'POST',
      body: JSON.stringify(cfg),
    }),
  createStripePaymentIntent: (data) =>
    request('/api/payment/stripe', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createPayPalOrder: (data) =>
    request('/api/payment/paypal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSettings: async (settings) => {
    // Simulate API call for now - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Settings updated:', settings);
        resolve(settings);
      }, 500);
    });
  },
};

export default api;
