import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import baseApi from './baseApi.js';
import { db } from '../firebase.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';

const handleFirebaseErrorWithLanguage = (error, context) =>
  errorHandler.handleFirebaseError(error, context, getActiveLanguage());

export const getBlogPosts = () => baseApi.getCollection('blog_posts');
export const getBlogPost = (id) => baseApi.getDocById('blog_posts', id);
export const addBlogPost = (data) =>
  baseApi.addToCollection('blog_posts', {
    ...data,
    createdAt: baseApi.serverTimestamp(),
    updatedAt: baseApi.serverTimestamp()
  });
export const updateBlogPost = (id, data) =>
  baseApi.updateCollection('blog_posts', id, {
    ...data,
    updatedAt: baseApi.serverTimestamp()
  });
export const deleteBlogPost = (id) => baseApi.deleteFromCollection('blog_posts', id);

export async function addBlogPostWithImage(data, imageFile) {
  try {
    const blogData = { ...data, createdAt: baseApi.serverTimestamp(), updatedAt: baseApi.serverTimestamp() };
    const blogRef = await addDoc(collection(db, 'blog_posts'), blogData);
    if (imageFile) {
      const { uploadBlogImage } = await import('../imageUpload.js');
      const imageResult = await uploadBlogImage(imageFile, blogRef.id);
      await updateDoc(blogRef, {
        featured_image: imageResult.url,
        image_path: imageResult.path
      });
    }
    return { id: blogRef.id, ...blogData };
  } catch (error) {
    throw handleFirebaseErrorWithLanguage(error, 'blog:add-with-image');
  }
}

export async function updateBlogPostWithImage(id, data, imageFile) {
  try {
    if (imageFile) {
      const { uploadBlogImage } = await import('../imageUpload.js');
      const imageResult = await uploadBlogImage(imageFile, id);
      data.featured_image = imageResult.url;
      data.image_path = imageResult.path;
    }
    return await updateBlogPost(id, data);
  } catch (error) {
    throw handleFirebaseErrorWithLanguage(error, 'blog:update-with-image');
  }
}

export default {
  getBlogPosts,
  getBlogPost,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addBlogPostWithImage,
  updateBlogPostWithImage
};
