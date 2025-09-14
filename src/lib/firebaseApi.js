import {
  collection,
  collectionGroup,
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
import { processImageForStorage, isImageSizeValid } from './imageUtils';
import { errorHandler } from './errorHandler';
import logger from './logger.js';

// معالجة البيانات قبل الحفظ في Firebase
async function processDataForStorage(data) {
  try {
    const processedData = { ...data };
    
    // معالجة الصور
    const imageFields = ['coverImage', 'image', 'imgPlaceholder', 'sampleAudio'];
    
    for (const field of imageFields) {
      if (processedData[field] && typeof processedData[field] === 'string') {
        // التحقق من أن الصورة Base64
        if (processedData[field].startsWith('data:image') || processedData[field].startsWith('data:audio')) {
          // التحقق من حجم الصورة
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
    
    // إضافة timestamp فقط إذا لم يكن موجوداً
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
    
    // التحقق من اتصال Firebase
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
    const result = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    logger.debug(`Collection ${name} result:`, result);
    
    return result;
    
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `collection:${name}`);
  }
}

async function addToCollection(name, data) {
  try {
    logger.debug(`addToCollection: Starting to add document to collection: ${name}`);
    logger.debug(`addToCollection: Data to be added:`, data);
    
    // التحقق من صحة البيانات
    if (!data || typeof data !== 'object') {
      const error = errorHandler.createError(
        'VALIDATION',
        'validation/invalid-data',
        'البيانات غير صالحة',
        `add:${name}`
      );
      throw error;
    }
    
    // التحقق من اتصال Firebase
    if (!db) {
      logger.error('Firebase db is not available');
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `add:${name}`
      );
      throw error;
    }
    
    logger.debug(`addToCollection: Firebase db is available:`, !!db);
    
    // معالجة الصور قبل الحفظ
    const processedData = await processDataForStorage(data);
    logger.debug(`addToCollection: Processed data:`, processedData);
    
    logger.debug(`addToCollection: About to call addDoc with collection: ${name}`);
    const ref = await addDoc(collection(db, name), processedData);
    logger.debug(`addToCollection: Document added with ref:`, ref);
    logger.debug(`addToCollection: ref.id:`, ref.id);
    logger.debug(`addToCollection: ref.id type:`, typeof ref.id);
    
    // التحقق من وجود ref.id
    if (!ref.id) {
      logger.error('ref.id is null or undefined');
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/invalid-reference',
        'فشل في الحصول على معرف المستند من Firebase',
        `add:${name}`
      );
      throw error;
    }
    
    // إرجاع البيانات مباشرة مع معرف المستند
    const result = { ...processedData, id: ref.id };
    logger.debug(`addToCollection: Returning result with id: ${result.id}`);
    logger.debug(`addToCollection: result object:`, result);
    return result;
    
  } catch (error) {
    logger.error(`addToCollection error for collection ${name}:`, error);
    throw errorHandler.handleFirebaseError(error, `add:${name}`);
  }
}

async function updateCollection(name, id, data) {
  try {
    // التحقق من صحة البيانات
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
    
    // التحقق من اتصال Firebase
    if (!db) {
      const error = errorHandler.createError(
        'FIREBASE',
        'firebase/connection-failed',
        'Firebase غير متصل',
        `update:${name}:${id}`
      );
      throw error;
    }
    
    // معالجة الصور قبل الحفظ
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
    
    const result = { id: snap.id, ...snap.data() };
    return result;
    
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
    
    // التحقق من اتصال Firebase
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
    
    // التحقق من اتصال Firebase
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
      const result = { id: snap.id, ...snap.data() };
      return result;
    } else {
      return null;
    }
    
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

async function fetchAllMessages() {
  try {
    // استخدام استعلام بسيط لتجنب مشكلة الفهارس
    const messages = await getCollection('messages');
    
    // ترتيب محلي
    return messages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA; // ترتيب تنازلي
    });
  } catch (error) {
    console.warn('Failed to fetch all messages, using fallback:', error);
    // في حالة فشل الاستعلام، استخدم استعلام بسيط
    try {
      const messages = await getCollection('messages');
      return messages.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
    } catch (fallbackError) {
      throw errorHandler.handleFirebaseError(fallbackError, 'messages:fetch-all-fallback');
    }
  }
}

async function fetchUserMessages({ userId, email }) {
  try {
    // استخدام فهرس بسيط لتجنب مشكلة الفهارس المعقدة
    const q = query(
      collection(db, 'messages'),
      where(userId ? 'userId' : 'email', '==', userId || email)
    );
    const snap = await getDocs(q);
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // ترتيب محلي لتجنب مشكلة الفهارس
    return messages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateA - dateB;
    });
  } catch (error) {
    console.warn('Failed to fetch user messages with index, falling back to simple query:', error);
    // في حالة فشل الاستعلام المعقد، استخدم استعلام بسيط
    try {
      const allMessages = await getCollection('messages');
      return allMessages
        .filter(msg => (userId && msg.userId === userId) || (email && msg.email === email))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateA - dateB;
        });
    } catch (fallbackError) {
      throw errorHandler.handleFirebaseError(fallbackError, 'messages:fetch-user-fallback');
    }
  }
}

async function createMessage(data) {
  try {
    const messageData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return addToCollection('messages', messageData);
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, 'messages:create');
  }
}

async function modifyMessage(id, data) {
  try {
    return updateCollection('messages', id, data);
  } catch (error) {
    throw errorHandler.handleFirebaseError(error, `messages:modify:${id}`);
  }
}

const firebaseApi = {
  // تصدير serverTimestamp للاستخدام في الخدمات
  serverTimestamp: () => serverTimestamp(),
  
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

  getCurrencies: () => getCollection('currencies'),
  addCurrency: (data) => addToCollection('currencies', data),
  updateCurrency: (id, data) => updateCollection('currencies', id, data),
  deleteCurrency: (id) => deleteFromCollection('currencies', id),

  getLanguages: () => getCollection('languages'),
  addLanguage: (data) => addToCollection('languages', data),
  updateLanguage: (id, data) => updateCollection('languages', id, data),
  deleteLanguage: (id) => deleteFromCollection('languages', id),

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

  getPayments: () => getCollection('payments'),
  addPayment: (data) => addToCollection('payments', data),
  updatePayment: (id, data) => updateCollection('payments', id, data),
  deletePayment: (id) => deleteFromCollection('payments', id),

  getPaymentMethods: () => getCollection('payment_methods'),
  addPaymentMethod: (data) => addToCollection('payment_methods', data),
  updatePaymentMethod: (id, data) => updateCollection('payment_methods', id, data),
  deletePaymentMethod: (id) => deleteFromCollection('payment_methods', id),

  getShippingMethods: () => getCollection('shipping_methods'),
  addShippingMethod: (data) => addToCollection('shipping_methods', data),
  updateShippingMethod: (id, data) => updateCollection('shipping_methods', id, data),
  deleteShippingMethod: (id) => deleteFromCollection('shipping_methods', id),

  getCoupons: () => getCollection('coupons'),
  addCoupon: (data) => addToCollection('coupons', data),
  updateCoupon: (id, data) => updateCollection('coupons', id, data),
  deleteCoupon: (id) => deleteFromCollection('coupons', id),

  getPlans: (params) => getCollection('plans'),
  getPlan: (id) => getDocById('plans', id),
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
    try {
      const snap = await getDoc(doc(db, 'settings', 'main'));
      return snap.exists() ? { id: snap.id, ...snap.data() } : {};
    } catch (error) {
      throw errorHandler.handleFirebaseError(error, 'settings:get');
    }
  },
  updateSettings: (data) => setSingletonDoc('settings', data),

  getOrder: (id) => getDocById('orders', id),

  getBookRatings: (bookId) => getCollection(`books/${bookId}/ratings`),
  addBookRating: (bookId, data) => addToCollection(`books/${bookId}/ratings`, data),
  async getAllRatings() {
    try {
      const snap = await getDocs(collectionGroup(db, 'ratings'));
      return snap.docs.map(d => ({ id: d.id, bookId: d.ref.parent.parent.id, ...d.data() }));
    } catch (error) {
      throw errorHandler.handleFirebaseError(error, 'ratings:get-all');
    }
  },
  async deleteRating(bookId, ratingId) {
    try {
      await deleteDoc(doc(db, `books/${bookId}/ratings/${ratingId}`));
    } catch (error) {
      throw errorHandler.handleFirebaseError(error, `ratings:delete:${bookId}:${ratingId}`);
    }
  },

  // دوال الصفحات الجديدة

  // دوال المدونة
  getBlogPosts: () => getCollection('blog_posts'),
  getBlogPost: (id) => getDocById('blog_posts', id),
  addBlogPost: (data) => addToCollection('blog_posts', { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updateBlogPost: (id, data) => updateCollection('blog_posts', id, { ...data, updatedAt: serverTimestamp() }),
  deleteBlogPost: (id) => deleteFromCollection('blog_posts', id),
  
  // دوال رفع الصور للمدونة
  async addBlogPostWithImage(data, imageFile) {
    try {
      // إنشاء مقال أولاً للحصول على ID
      const blogData = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      const blogRef = await addDoc(collection(db, 'blog_posts'), blogData);
      
      // إذا كان هناك صورة، قم برفعها
      if (imageFile) {
        const { uploadBlogImage } = await import('./imageUpload.js');
        const imageResult = await uploadBlogImage(imageFile, blogRef.id);
        
        // تحديث المقال برابط الصورة
        await updateDoc(blogRef, {
          featured_image: imageResult.url,
          image_path: imageResult.path
        });
      }
      
      return { id: blogRef.id, ...blogData };
    } catch (error) {
      throw errorHandler.handleFirebaseError(error, 'blog:add-with-image');
    }
  },
  
  async updateBlogPostWithImage(id, data, imageFile) {
    try {
      // إذا كان هناك صورة جديدة، قم برفعها
      if (imageFile) {
        const { uploadBlogImage } = await import('./imageUpload.js');
        const imageResult = await uploadBlogImage(imageFile, id);
        
        // تحديث البيانات برابط الصورة الجديد
        data.featured_image = imageResult.url;
        data.image_path = imageResult.path;
      }
      
      // تحديث المقال
      return await updateCollection('blog_posts', id, { ...data, updatedAt: serverTimestamp() });
    } catch (error) {
      throw errorHandler.handleFirebaseError(error, 'blog:update-with-image');
    }
  },

  // دوال الأسئلة الشائعة
  getFaqs: () => getCollection('faqs'),
  getFaq: (id) => getDocById('faqs', id),
  addFaq: (data) => addToCollection('faqs', { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updateFaq: (id, data) => updateCollection('faqs', id, { ...data, updatedAt: serverTimestamp() }),
  deleteFaq: (id) => deleteFromCollection('faqs', id),

  // دوال الموزعين
  getDistributors: () => getCollection('distributors'),
  getDistributor: (id) => getDocById('distributors', id),
  addDistributor: (data) => addToCollection('distributors', { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updateDistributor: (id, data) => updateCollection('distributors', id, { ...data, updatedAt: serverTimestamp() }),
  deleteDistributor: (id) => deleteFromCollection('distributors', id),

  // دوال أعضاء الفريق
  getTeamMembers: () => getCollection('team_members'),
  getTeamMember: (id) => getDocById('team_members', id),
  addTeamMember: (data) => addToCollection('team_members', { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updateTeamMember: (id, data) => updateCollection('team_members', id, { ...data, updatedAt: serverTimestamp() }),
  deleteTeamMember: (id) => deleteFromCollection('team_members', id),

  // دوال طلبات التصميم
  getDesignRequests: () => getCollection('design_requests'),
  getDesignRequest: (id) => getDocById('design_requests', id),
  addDesignRequest: (data) => addToCollection('design_requests', { ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updateDesignRequest: (id, data) => updateCollection('design_requests', id, { ...data, updatedAt: serverTimestamp() }),
  deleteDesignRequest: (id) => deleteFromCollection('design_requests', id),

  // دوال طلبات النشر
  getPublishingRequests: () => getCollection('publishing_requests'),
  getPublishingRequest: (id) => getDocById('publishing_requests', id),
  addPublishingRequest: (data) => addToCollection('publishing_requests', { ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updatePublishingRequest: (id, data) => updateCollection('publishing_requests', id, { ...data, updatedAt: serverTimestamp() }),
  deletePublishingRequest: (id) => deleteFromCollection('publishing_requests', id),

  // دوال طلبات النشر معنا
  getPublishWithUsRequests: () => getCollection('publish_with_us_requests'),
  getPublishWithUsRequest: (id) => getDocById('publish_with_us_requests', id),
  addPublishWithUsRequest: (data) => addToCollection('publish_with_us_requests', { ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
  updatePublishWithUsRequest: (id, data) => updateCollection('publish_with_us_requests', id, { ...data, updatedAt: serverTimestamp() }),
  deletePublishWithUsRequest: (id) => deleteFromCollection('publish_with_us_requests', id),

  // دوال عامة
  getDocById: (name, id) => getDocById(name, id),
  setDoc: (name, id, data) => setDocument(name, id, data),

  async getDashboardStats() {
    try {
      const [bookSnap, authorSnap, paymentSnap, userSnap, blogSnap, faqSnap, distributorSnap, teamSnap, designSnap, publishingSnap, publishWithUsSnap] = await Promise.all([
        getDocs(collection(db, 'books')),
        getDocs(collection(db, 'authors')),
        getDocs(collection(db, 'payments')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'blog_posts')),
        getDocs(collection(db, 'faqs')),
        getDocs(collection(db, 'distributors')),
        getDocs(collection(db, 'team_members')),
        getDocs(collection(db, 'design_requests')),
        getDocs(collection(db, 'publishing_requests')),
        getDocs(collection(db, 'publish_with_us_requests')),
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
        users: userSnap.size,
        blogPosts: blogSnap.size,
        faqs: faqSnap.size,
        distributors: distributorSnap.size,
        teamMembers: teamSnap.size,
        designRequests: designSnap.size,
        publishingRequests: publishingSnap.size,
        publishWithUsRequests: publishWithUsSnap.size,
      };
    } catch (error) {
      throw errorHandler.handleFirebaseError(error, 'dashboard:stats');
    }
  },

  // دوال عامة للاستخدام في الخدمات
  updateCollection: updateCollection,
  addToCollection: addToCollection,
  getCollection: getCollection,
  getDocById: getDocById,
  deleteFromCollection: deleteFromCollection,
  setDocument: setDocument,
};

export default firebaseApi;
