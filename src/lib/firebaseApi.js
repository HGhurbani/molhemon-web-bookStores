import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
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
};

export default firebaseApi;
