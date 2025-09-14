import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  collectionGroup,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { isImageSizeValid } from '../imageUtils.js';
import { errorHandler } from '../errorHandler.js';
import logger from '../logger.js';

// Process data before storing in Firestore
async function processDataForStorage(data) {
  try {
    const processedData = { ...data };
    const imageFields = ['coverImage', 'image', 'imgPlaceholder', 'sampleAudio'];
    for (const field of imageFields) {
      if (processedData[field] && typeof processedData[field] === 'string') {
        if (processedData[field].startsWith('data:image') || processedData[field].startsWith('data:audio')) {
          if (!isImageSizeValid(processedData[field])) {
            const error = errorHandler.createError(
              'VALIDATION',
              'validation/file-size',
              `الصورة في الحقل ${field} كبيرة جداً، الحد الأقصى 5MB`,
              `image-processing:${field}`
            );
            throw error;
          }
        }
      }
    }

    if (!processedData.createdAt) {
      processedData.createdAt = serverTimestamp();
    }
    if (!processedData.updatedAt) {
      processedData.updatedAt = serverTimestamp();
    }

    return processedData;
  } catch (error) {
    throw errorHandler.handleError(error, 'data-processing');
  }
}

async function getCollection(name) {
  try {
    logger.debug(`Getting collection: ${name}`);
    if (!db) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `collection:${name}`
      );
      throw error;
    }
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `collection:${name}`);
  }
}

async function addToCollection(name, data) {
  try {
    if (!data || typeof data !== 'object') {
      const error = errorHandler.createError(
        'VALIDATION',
        'validation/invalid-data',
        'البيانات غير صالحة',
        `add:${name}`
      );
      throw error;
    }
    if (!db) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `add:${name}`
      );
      throw error;
    }
    const processedData = await processDataForStorage(data);
    const ref = await addDoc(collection(db, name), processedData);
    return { ...processedData, id: ref.id };
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `add:${name}`);
  }
}

async function updateCollection(name, id, data) {
  try {
    if (!data || typeof data !== 'object') {
      const error = errorHandler.createError(
        'VALIDATION',
        'validation/invalid-data',
        'البيانات غير صالحة',
        `update:${name}:${id}`
      );
      throw error;
    }
    if (!id) {
      const error = errorHandler.createError(
        'VALIDATION',
        'validation/missing-id',
        'معرف العنصر مطلوب',
        `update:${name}`
      );
      throw error;
    }
    if (!db) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `update:${name}:${id}`
      );
      throw error;
    }
    const processedData = await processDataForStorage(data);
    const ref = doc(db, name, id.toString());
    await updateDoc(ref, processedData);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/document-not-found',
        'فشل في استرجاع المستند المحدث',
        `update:${name}:${id}`
      );
      throw error;
    }
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `update:${name}:${id}`);
  }
}

async function deleteFromCollection(name, id) {
  try {
    if (!id) {
      const error = errorHandler.createError(
        'VALIDATION',
        'validation/missing-id',
        'معرف العنصر مطلوب',
        `delete:${name}`
      );
      throw error;
    }
    if (!db) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `delete:${name}:${id}`
      );
      throw error;
    }
    await deleteDoc(doc(db, name, id.toString()));
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `delete:${name}:${id}`);
  }
}

async function getDocById(name, id) {
  try {
    if (!id) {
      const error = errorHandler.createError(
        'VALIDATION',
        'validation/missing-id',
        'معرف العنصر مطلوب',
        `get:${name}`
      );
      throw error;
    }
    if (!db) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `get:${name}:${id}`
      );
      throw error;
    }
    const snap = await getDoc(doc(db, name, id.toString()));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `get:${name}:${id}`);
  }
}

async function setSingletonDoc(name, data) {
  try {
    const ref = doc(db, name, 'main');
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `set:${name}`);
  }
}

async function setDocument(name, id, data) {
  try {
    const ref = doc(db, name, id);
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `set:${name}:${id}`);
  }
}

const firebaseBase = {
  serverTimestamp: () => serverTimestamp(),
  getCollection,
  addToCollection,
  updateCollection,
  deleteFromCollection,
  deleteDoc: (name, id) => deleteFromCollection(name, id),
  getDocById,
  setSingletonDoc,
  setDocument,
  setDoc: (name, id, data) => setDocument(name, id, data)
};

export default firebaseBase;
