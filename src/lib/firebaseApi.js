import baseApi from './firebase/baseApi.js';
import booksApi from './firebase/booksApi.js';
import blogApi from './firebase/blogApi.js';
import faqApi from './firebase/faqApi.js';
import messagesApi from './firebase/messagesApi.js';
import settingsApi from './firebase/settingsApi.js';
import ratingsApi from './firebase/ratingsApi.js';
import homeApi from './firebase/homeApi.js';

// Aggregate all domain APIs into a single object for backwards compatibility
export default {
  ...baseApi,
  ...booksApi,
  ...blogApi,
  ...faqApi,
  ...messagesApi,
  ...settingsApi,
  ...ratingsApi,
  ...homeApi
};
