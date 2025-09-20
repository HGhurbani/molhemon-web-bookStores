import { doc, getDoc } from 'firebase/firestore';
import baseApi from './baseApi.js';
import { db } from '../firebase.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';

const handleFirebaseErrorWithLanguage = (error, context) =>
  errorHandler.handleFirebaseError(error, context, getActiveLanguage());

export async function getSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'main'));

    if (!snap.exists()) {
      return {};
    }

    const data = { id: snap.id, ...snap.data() };

    if (!data.adminDefaultLanguage) {
      data.adminDefaultLanguage = 'en';
    }

    return data;
  } catch (error) {
    throw handleFirebaseErrorWithLanguage(error, 'settings:get');
  }
}

export async function updateSettings(data = {}) {
  try {
    const payload = {
      ...data,
      adminDefaultLanguage: data?.adminDefaultLanguage ?? 'en'
    };

    const updated = await baseApi.setSingletonDoc('settings', payload);

    if (!updated.adminDefaultLanguage) {
      updated.adminDefaultLanguage = payload.adminDefaultLanguage;
    }

    return updated;
  } catch (error) {
    throw handleFirebaseErrorWithLanguage(error, 'settings:update');
  }
}

export default { getSettings, updateSettings };
