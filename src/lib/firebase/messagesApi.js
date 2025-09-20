import { collection, query, where, getDocs } from 'firebase/firestore';
import baseApi from './baseApi.js';
import { db } from '../firebase.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';
import logger from '../logger.js';

const handleFirebaseErrorWithLanguage = (error, context) =>
  errorHandler.handleFirebaseError(error, context, getActiveLanguage());

export async function fetchAllMessages() {
  try {
    const messages = await baseApi.getCollection('messages');
    return messages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
  } catch (error) {
    logger.info('Failed to fetch all messages, using fallback:', error);
    try {
      const messages = await baseApi.getCollection('messages');
      return messages.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
    } catch (fallbackError) {
      throw handleFirebaseErrorWithLanguage(fallbackError, 'messages:fetch-all-fallback');
    }
  }
}

export async function fetchUserMessages({ userId, email }) {
  try {
    const q = query(
      collection(db, 'messages'),
      where(userId ? 'userId' : 'email', '==', userId || email)
    );
    const snap = await getDocs(q);
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return messages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateA - dateB;
    });
  } catch (error) {
    logger.info('Failed to fetch user messages with index, falling back to simple query:', error);
    try {
      const allMessages = await baseApi.getCollection('messages');
      return allMessages
        .filter(msg => (userId && msg.userId === userId) || (email && msg.email === email))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateA - dateB;
        });
    } catch (fallbackError) {
      throw handleFirebaseErrorWithLanguage(fallbackError, 'messages:fetch-user-fallback');
    }
  }
}

export const createMessage = (data) =>
  baseApi.addToCollection('messages', {
    ...data,
    createdAt: baseApi.serverTimestamp(),
    updatedAt: baseApi.serverTimestamp()
  });

export const modifyMessage = (id, data) =>
  baseApi.updateCollection('messages', id, data);

export default {
  fetchAllMessages,
  fetchUserMessages,
  createMessage,
  modifyMessage
};
