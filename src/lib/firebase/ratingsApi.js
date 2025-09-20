import { collection, collectionGroup, getDocs, deleteDoc, doc } from 'firebase/firestore';
import baseApi from './baseApi.js';
import { db } from '../firebase.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';

const handleFirebaseErrorWithLanguage = (error, context) =>
  errorHandler.handleFirebaseError(error, context, getActiveLanguage());

export const getBookRatings = (bookId) => baseApi.getCollection(`books/${bookId}/ratings`);
export const addBookRating = (bookId, data) => baseApi.addToCollection(`books/${bookId}/ratings`, data);

export async function getAllRatings() {
  try {
    const snap = await getDocs(collectionGroup(db, 'ratings'));
    return snap.docs.map(d => ({ id: d.id, bookId: d.ref.parent.parent.id, ...d.data() }));
  } catch (error) {
    throw handleFirebaseErrorWithLanguage(error, 'ratings:get-all');
  }
}

export async function deleteRating(bookId, ratingId) {
  try {
    await deleteDoc(doc(db, `books/${bookId}/ratings/${ratingId}`));
  } catch (error) {
    throw handleFirebaseErrorWithLanguage(error, `ratings:delete:${bookId}:${ratingId}`);
  }
}

export default {
  getBookRatings,
  addBookRating,
  getAllRatings,
  deleteRating
};
