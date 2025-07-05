import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbW7bX1m10rPyLtqxdec6f8I7u09-Dcq0",
  authDomain: "molhem-book-store.firebaseapp.com",
  projectId: "molhem-book-store",
  storageBucket: "molhem-book-store.appspot.com",
  messagingSenderId: "405854542171",
  appId: "1:405854542171:web:f5ec90eca02e261da8a27e",
  measurementId: "G-J7N2QML49Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
