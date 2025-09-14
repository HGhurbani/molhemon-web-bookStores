import baseApi from './baseApi.js';

export const getSliders = () => baseApi.getCollection('sliders');
export const addSlider = (data) => baseApi.addToCollection('sliders', data);
export const updateSlider = (id, data) => baseApi.updateCollection('sliders', id, data);
export const deleteSlider = (id) => baseApi.deleteFromCollection('sliders', id);

export const getBanners = () => baseApi.getCollection('banners');
export const addBanner = (data) => baseApi.addToCollection('banners', data);
export const updateBanner = (id, data) => baseApi.updateCollection('banners', id, data);
export const deleteBanner = (id) => baseApi.deleteFromCollection('banners', id);

export const getFeatures = () => baseApi.getCollection('features');
export const addFeature = (data) => baseApi.addToCollection('features', data);
export const updateFeature = (id, data) => baseApi.updateCollection('features', id, data);
export const deleteFeature = (id) => baseApi.deleteFromCollection('features', id);

export default {
  getSliders,
  addSlider,
  updateSlider,
  deleteSlider,
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature
};
