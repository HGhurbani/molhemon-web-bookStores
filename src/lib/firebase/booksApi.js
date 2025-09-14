import baseApi from './baseApi.js';

export const getBooks = () => baseApi.getCollection('books');
export const addBook = (data) => baseApi.addToCollection('books', data);
export const updateBook = (id, data) => baseApi.updateCollection('books', id, data);
export const deleteBook = (id) => baseApi.deleteFromCollection('books', id);

export const getAuthors = () => baseApi.getCollection('authors');
export const addAuthor = (data) => baseApi.addToCollection('authors', data);
export const updateAuthor = (id, data) => baseApi.updateCollection('authors', id, data);
export const deleteAuthor = (id) => baseApi.deleteFromCollection('authors', id);

export const getCategories = () => baseApi.getCollection('categories');
export const addCategory = (data) => baseApi.addToCollection('categories', data);
export const updateCategory = (id, data) => baseApi.updateCollection('categories', id, data);
export const deleteCategory = (id) => baseApi.deleteFromCollection('categories', id);

export const getCurrencies = () => baseApi.getCollection('currencies');
export const addCurrency = (data) => baseApi.addToCollection('currencies', data);
export const updateCurrency = (id, data) => baseApi.updateCollection('currencies', id, data);
export const deleteCurrency = (id) => baseApi.deleteFromCollection('currencies', id);

export const getLanguages = () => baseApi.getCollection('languages');
export const addLanguage = (data) => baseApi.addToCollection('languages', data);
export const updateLanguage = (id, data) => baseApi.updateCollection('languages', id, data);
export const deleteLanguage = (id) => baseApi.deleteFromCollection('languages', id);

export default {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCurrencies,
  addCurrency,
  updateCurrency,
  deleteCurrency,
  getLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage
};
