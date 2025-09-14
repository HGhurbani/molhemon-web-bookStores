import { doc, getDoc } from 'firebase/firestore';
import baseApi from './baseApi.js';
import { db } from '../firebase.js';
import { errorHandler } from '../errorHandler.js';

export async function getSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'main'));
    return snap.exists() ? { id: snap.id, ...snap.data() } : {};
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, 'settings:get');
  }
}

export const updateSettings = (data) => baseApi.setSingletonDoc('settings', data);

export default { getSettings, updateSettings };
