import baseApi from './baseApi.js';

export const getFaqs = () => baseApi.getCollection('faqs');
export const getFaq = (id) => baseApi.getDocById('faqs', id);
export const addFaq = (data) =>
  baseApi.addToCollection('faqs', {
    ...data,
    createdAt: baseApi.serverTimestamp(),
    updatedAt: baseApi.serverTimestamp()
  });
export const updateFaq = (id, data) =>
  baseApi.updateCollection('faqs', id, {
    ...data,
    updatedAt: baseApi.serverTimestamp()
  });
export const deleteFaq = (id) => baseApi.deleteFromCollection('faqs', id);

export default {
  getFaqs,
  getFaq,
  addFaq,
  updateFaq,
  deleteFaq
};
