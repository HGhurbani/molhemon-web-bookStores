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

export const api = {
  getBooks: () => request('/api/books'),
  addBook: (data) => request('/api/books', { method: 'POST', body: JSON.stringify(data) }),
  updateBook: (id, data) => request(`/api/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBook: (id) => request(`/api/books/${id}`, { method: 'DELETE' }),

  getAuthors: () => request('/api/authors'),
  addAuthor: (data) => request('/api/authors', { method: 'POST', body: JSON.stringify(data) }),
  updateAuthor: (id, data) => request(`/api/authors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAuthor: (id) => request(`/api/authors/${id}`, { method: 'DELETE' }),

  getCategories: () => request('/api/categories'),
  addCategory: (data) => request('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  addSeller: (data) => request('/api/sellers', { method: 'POST', body: JSON.stringify(data) }),
  updateSeller: (id, data) => request(`/api/sellers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSeller: (id) => request(`/api/sellers/${id}`, { method: 'DELETE' }),

  addCustomer: (data) => request('/api/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/api/customers/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/api/users'),
  addUser: (data) => request('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE' }),

  getOrders: () => request('/api/orders'),
  addOrder: (data) => request('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id, data) => request(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrder: (id) => request(`/api/orders/${id}`, { method: 'DELETE' }),

  getPaymentMethods: () => request('/api/payment-methods'),
  addPaymentMethod: (data) => request('/api/payment-methods', { method: 'POST', body: JSON.stringify(data) }),
  updatePaymentMethod: (id, data) => request(`/api/payment-methods/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePaymentMethod: (id) => request(`/api/payment-methods/${id}`, { method: 'DELETE' }),

  getCoupons: () => request('/api/coupons'),
  addCoupon: (data) => request('/api/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id, data) => request(`/api/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id) => request(`/api/coupons/${id}`, { method: 'DELETE' }),

  getPayments: () => request('/api/payments'),
  addPayment: (data) => request('/api/payments', { method: 'POST', body: JSON.stringify(data) }),
  updatePayment: (id, data) => request(`/api/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePayment: (id) => request(`/api/payments/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/api/settings'),
  updateSettings: (data) => request('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
  importGoogleMerchant: () => request('/api/google-merchant/import', { method: 'POST' }),
  getPlans: () => request('/api/plans'),
  addPlan: (data) => request('/api/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => request(`/api/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id) => request(`/api/plans/${id}`, { method: 'DELETE' }),

  getSubscriptions: () => request('/api/subscriptions'),
  addSubscription: (data) => request('/api/subscriptions', { method: 'POST', body: JSON.stringify(data) }),

  getSliders: () => request('/api/sliders'),
  addSlider: (data) => request('/api/sliders', { method: 'POST', body: JSON.stringify(data) }),
  updateSlider: (id, data) => request(`/api/sliders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSlider: (id) => request(`/api/sliders/${id}`, { method: 'DELETE' }),

  getBanners: () => request('/api/banners'),
  addBanner: (data) => request('/api/banners', { method: 'POST', body: JSON.stringify(data) }),
  updateBanner: (id, data) => request(`/api/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBanner: (id) => request(`/api/banners/${id}`, { method: 'DELETE' }),

  getFeatures: () => request('/api/features'),
  addFeature: (data) => request('/api/features', { method: 'POST', body: JSON.stringify(data) }),
  updateFeature: (id, data) => request(`/api/features/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFeature: (id) => request(`/api/features/${id}`, { method: 'DELETE' }),
};

export default api;
