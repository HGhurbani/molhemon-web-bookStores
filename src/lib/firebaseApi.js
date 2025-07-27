import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

async function getCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function addToCollection(name, data) {
  const ref = await addDoc(collection(db, name), data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function updateCollection(name, id, data) {
  const ref = doc(db, name, id.toString());
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function deleteFromCollection(name, id) {
  await deleteDoc(doc(db, name, id.toString()));
}

async function getDocById(name, id) {
  const snap = await getDoc(doc(db, name, id.toString()));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function setSingletonDoc(name, data) {
  const ref = doc(db, name, 'main');
  await setDoc(ref, data, { merge: true });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function fetchAllMessages() {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function fetchUserMessages({ userId, email }) {
  const q = query(
    collection(db, 'messages'),
    where(userId ? 'userId' : 'email', '==', userId || email),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createMessage(data) {
  return addToCollection('messages', { ...data, createdAt: serverTimestamp() });
}

async function modifyMessage(id, data) {
  return updateCollection('messages', id, data);
}

const firebaseApi = {
  getBooks: () => getCollection('books'),
  addBook: (data) => addToCollection('books', data),
  updateBook: (id, data) => updateCollection('books', id, data),
  deleteBook: (id) => deleteFromCollection('books', id),

  getAuthors: () => getCollection('authors'),
  addAuthor: (data) => addToCollection('authors', data),
  updateAuthor: (id, data) => updateCollection('authors', id, data),
  deleteAuthor: (id) => deleteFromCollection('authors', id),

  getCategories: () => getCollection('categories'),
  addCategory: (data) => addToCollection('categories', data),
  updateCategory: (id, data) => updateCollection('categories', id, data),
  deleteCategory: (id) => deleteFromCollection('categories', id),

  getOrders: () => getCollection('orders'),
  addOrder: (data) => addToCollection('orders', data),
  updateOrder: (id, data) => updateCollection('orders', id, data),
  deleteOrder: (id) => deleteFromCollection('orders', id),

  getUsers: () => getCollection('users'),
  addUser: (data) => addToCollection('users', data),
  updateUser: (id, data) => updateCollection('users', id, data),
  deleteUser: (id) => deleteFromCollection('users', id),
  getUser: (id) => getDocById('users', id),

  // User specific subcollections
  getUserAddresses: (userId) => getCollection(`users/${userId}/addresses`),
  addUserAddress: (userId, data) => addToCollection(`users/${userId}/addresses`, data),
  updateUserAddress: (userId, id, data) => updateCollection(`users/${userId}/addresses`, id, data),
  deleteUserAddress: (userId, id) => deleteFromCollection(`users/${userId}/addresses`, id),

  getUserPaymentMethods: (userId) => getCollection(`users/${userId}/payment_methods`),
  addUserPaymentMethod: (userId, data) => addToCollection(`users/${userId}/payment_methods`, data),
  updateUserPaymentMethod: (userId, id, data) => updateCollection(`users/${userId}/payment_methods`, id, data),
  deleteUserPaymentMethod: (userId, id) => deleteFromCollection(`users/${userId}/payment_methods`, id),

  getSliders: () => getCollection('sliders'),
  addSlider: (data) => addToCollection('sliders', data),
  updateSlider: (id, data) => updateCollection('sliders', id, data),
  deleteSlider: (id) => deleteFromCollection('sliders', id),

  getBanners: () => getCollection('banners'),
  addBanner: (data) => addToCollection('banners', data),
  updateBanner: (id, data) => updateCollection('banners', id, data),
  deleteBanner: (id) => deleteFromCollection('banners', id),

  getFeatures: () => getCollection('features'),
  addFeature: (data) => addToCollection('features', data),
  updateFeature: (id, data) => updateCollection('features', id, data),
  deleteFeature: (id) => deleteFromCollection('features', id),

  getSellers: () => getCollection('sellers'),
  addSeller: (data) => addToCollection('sellers', data),
  updateSeller: (id, data) => updateCollection('sellers', id, data),
  deleteSeller: (id) => deleteFromCollection('sellers', id),

  getBranches: () => getCollection('branches'),
  addBranch: (data) => addToCollection('branches', data),
  updateBranch: (id, data) => updateCollection('branches', id, data),
  deleteBranch: (id) => deleteFromCollection('branches', id),

  getCustomers: () => getCollection('customers'),
  addCustomer: (data) => addToCollection('customers', data),
  updateCustomer: (id, data) => updateCollection('customers', id, data),
  deleteCustomer: (id) => deleteFromCollection('customers', id),

  getPayments: () => getCollection('payments'),
  addPayment: (data) => addToCollection('payments', data),
  updatePayment: (id, data) => updateCollection('payments', id, data),
  deletePayment: (id) => deleteFromCollection('payments', id),

  getPaymentMethods: () => getCollection('payment_methods'),
  addPaymentMethod: (data) => addToCollection('payment_methods', data),
  updatePaymentMethod: (id, data) => updateCollection('payment_methods', id, data),
  deletePaymentMethod: (id) => deleteFromCollection('payment_methods', id),

  getCoupons: () => getCollection('coupons'),
  addCoupon: (data) => addToCollection('coupons', data),
  updateCoupon: (id, data) => updateCollection('coupons', id, data),
  deleteCoupon: (id) => deleteFromCollection('coupons', id),

  getPlans: (params) => getCollection('plans'),
  addPlan: (data) => addToCollection('plans', data),
  updatePlan: (id, data) => updateCollection('plans', id, data),
  deletePlan: (id) => deleteFromCollection('plans', id),

  getSubscriptions: () => getCollection('subscriptions'),
  addSubscription: (data) => addToCollection('subscriptions', data),
  updateSubscription: (id, data) => updateCollection('subscriptions', id, data),
  deleteSubscription: (id) => deleteFromCollection('subscriptions', id),

  getMessages: () => fetchAllMessages(),
  getUserMessages: (params) => fetchUserMessages(params),
  addMessage: (data) => createMessage(data),
  updateMessage: (id, data) => modifyMessage(id, data),

  getSettings: async () => {
    const snap = await getDoc(doc(db, 'settings', 'main'));
    return snap.exists() ? { id: snap.id, ...snap.data() } : {};
  },
  updateSettings: (data) => setSingletonDoc('settings', data),

  getOrder: (id) => getDocById('orders', id),

  getBookRatings: (bookId) => getCollection(`books/${bookId}/ratings`),
  addBookRating: (bookId, data) => addToCollection(`books/${bookId}/ratings`, data),
  async getDashboardStats() {
    const [bookSnap, authorSnap, paymentSnap, customerSnap] = await Promise.all([
      getDocs(collection(db, 'books')),
      getDocs(collection(db, 'authors')),
      getDocs(collection(db, 'payments')),
      getDocs(collection(db, 'customers')),
    ]);
    let sales = 0;
    paymentSnap.forEach(d => {
      const amt = d.data().amount;
      if (amt) sales += Number(amt);
    });
    return {
      books: bookSnap.size,
      authors: authorSnap.size,
      sales,
      customers: customerSnap.size,
    };
  },
};

export default firebaseApi;
