/**
 * خدمة إدارة المنتجات
 */

import { errorHandler } from '../errorHandler.js';
import firebaseApi from '../firebase/baseApi.js';

export class ProductService {
  constructor() {
    this.collectionName = 'books';
  }

  /**
   * إنشاء منتج جديد
   */
  async createProduct(productData) {
    try {
      // التحقق من صحة البيانات
      const validationErrors = this.validateProduct(productData);
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/product-invalid',
          `خطأ في بيانات المنتج: ${validationErrors.join(', ')}`,
          'product-creation'
        );
      }

      // إضافة تواريخ الإنشاء والتحديث
      const product = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // حفظ المنتج في Firebase
      const productDoc = await firebaseApi.addToCollection(this.collectionName, product);
      product.id = productDoc.id;

      return product;

    } catch (error) {
      throw errorHandler.handleError(error, 'product-creation');
    }
  }

  /**
   * الحصول على منتج بواسطة المعرف
   */
  async getProductById(productId) {
    try {
      const product = await firebaseApi.getDocById(this.collectionName, productId);
      if (!product) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'product/not-found',
          'المنتج غير موجود',
          `product:${productId}`
        );
      }

      return product;

    } catch (error) {
      throw errorHandler.handleError(error, `product:${productId}`);
    }
  }

  /**
   * الحصول على جميع المنتجات
   */
  async getAllProducts(filters = {}) {
    try {
      let products = await firebaseApi.getCollection(this.collectionName);
      
      // فلترة حسب النوع
      if (filters.type) {
        products = products.filter(product => product.type === filters.type);
      }

      // فلترة حسب الفئة
      if (filters.category) {
        products = products.filter(product => product.category === filters.category);
      }

      // فلترة حسب المؤلف
      if (filters.author) {
        products = products.filter(product => product.authorId === filters.author);
      }

      // فلترة حسب السعر
      if (filters.minPrice !== undefined) {
        products = products.filter(product => product.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(product => product.price <= filters.maxPrice);
      }

      // فلترة حسب التقييم
      if (filters.minRating !== undefined) {
        products = products.filter(product => product.rating >= filters.minRating);
      }

      // فلترة حسب المخزون
      if (filters.inStock !== undefined) {
        if (filters.inStock) {
          products = products.filter(product => (product.stock || 0) > 0);
        } else {
          products = products.filter(product => (product.stock || 0) <= 0);
        }
      }

      // ترتيب المنتجات
      if (filters.sortBy) {
        products = this.sortProducts(products, filters.sortBy, filters.sortOrder || 'desc');
      }

      return products;

    } catch (error) {
      throw errorHandler.handleError(error, 'products-get-all');
    }
  }

  /**
   * تحديث منتج
   */
  async updateProduct(productId, updateData) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'product/not-found',
          'المنتج غير موجود',
          `product-update:${productId}`
        );
      }

      // التحقق من صحة البيانات المحدثة
      const validationErrors = this.validateProduct({ ...product, ...updateData });
      if (validationErrors.length > 0) {
        throw errorHandler.handleError(
          'VALIDATION',
          'validation/product-update-invalid',
          `خطأ في بيانات التحديث: ${validationErrors.join(', ')}`,
          `product-update:${productId}`
        );
      }

      // إضافة تاريخ التحديث
      const updatedProduct = {
        ...updateData,
        updatedAt: new Date()
      };

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, productId, updatedProduct);

      return { success: true, message: 'تم تحديث المنتج بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `product-update:${productId}`);
    }
  }

  /**
   * حذف منتج
   */
  async deleteProduct(productId) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'product/not-found',
          'المنتج غير موجود',
          `product-delete:${productId}`
        );
      }

      // حذف المنتج
      await firebaseApi.deleteFromCollection(this.collectionName, productId);

      return { success: true, message: 'تم حذف المنتج بنجاح' };

    } catch (error) {
      throw errorHandler.handleError(error, `product-delete:${productId}`);
    }
  }

  /**
   * البحث في المنتجات
   */
  async searchProducts(query, filters = {}) {
    try {
      let products = await firebaseApi.getCollection(this.collectionName);
      
      // البحث في النص
      if (query) {
        const searchQuery = query.toLowerCase();
        products = products.filter(product => 
          product.title?.toLowerCase().includes(searchQuery) ||
          product.author?.toLowerCase().includes(searchQuery) ||
          product.description?.toLowerCase().includes(searchQuery) ||
          product.isbn?.includes(searchQuery)
        );
      }

      // تطبيق الفلاتر
      if (filters.type) {
        products = products.filter(product => product.type === filters.type);
      }
      if (filters.category) {
        products = products.filter(product => product.category === filters.category);
      }
      if (filters.minPrice !== undefined) {
        products = products.filter(product => product.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(product => product.price <= filters.maxPrice);
      }

      // ترتيب النتائج
      products = this.sortProducts(products, filters.sortBy || 'relevance', filters.sortOrder || 'desc');

      return products;

    } catch (error) {
      throw errorHandler.handleError(error, 'product-search');
    }
  }

  /**
   * الحصول على المنتجات حسب النوع
   */
  async getProductsByType(type) {
    try {
      const products = await this.getAllProducts({ type });
      return products;

    } catch (error) {
      throw errorHandler.handleError(error, `products-by-type:${type}`);
    }
  }

  /**
   * الحصول على المنتجات المادية
   */
  async getPhysicalProducts() {
    return this.getProductsByType('physical');
  }

  /**
   * الحصول على الكتب الإلكترونية
   */
  async getEbooks() {
    return this.getProductsByType('ebook');
  }

  /**
   * الحصول على الكتب الصوتية
   */
  async getAudiobooks() {
    return this.getProductsByType('audio');
  }

  /**
   * تحديث المخزون
   */
  async updateStock(productId, quantity, operation = 'decrease') {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'product/not-found',
          'المنتج غير موجود',
          `stock-update:${productId}`
        );
      }

      let newStock = product.stock || 0;
      
      if (operation === 'decrease') {
        newStock = Math.max(0, newStock - quantity);
      } else if (operation === 'increase') {
        newStock = newStock + quantity;
      } else if (operation === 'set') {
        newStock = quantity;
      }

      // تحديث المخزون
      await firebaseApi.updateCollection(this.collectionName, productId, {
        stock: newStock,
        updatedAt: new Date()
      });

      return { success: true, newStock };

    } catch (error) {
      throw errorHandler.handleError(error, `stock-update:${productId}`);
    }
  }

  /**
   * التحقق من توفر المخزون
   */
  async checkStockAvailability(productId, requestedQuantity) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        return { available: false, message: 'المنتج غير موجود' };
      }

      const availableStock = product.stock || 0;
      const isAvailable = availableStock >= requestedQuantity;

      return {
        available: isAvailable,
        availableStock,
        requestedQuantity,
        message: isAvailable ? 'المخزون متوفر' : 'المخزون غير كافي'
      };

    } catch (error) {
      throw errorHandler.handleError(error, `stock-check:${productId}`);
    }
  }

  /**
   * الحصول على المنتجات الأكثر مبيعاً
   */
  async getBestSellers(limit = 10) {
    try {
      const products = await this.getAllProducts();
      
      // ترتيب حسب المبيعات (افتراضياً حسب التقييم)
      const bestSellers = products
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

      return bestSellers;

    } catch (error) {
      throw errorHandler.handleError(error, 'best-sellers');
    }
  }

  /**
   * الحصول على المنتجات الجديدة
   */
  async getNewProducts(limit = 10) {
    try {
      const products = await this.getAllProducts();
      
      // ترتيب حسب تاريخ الإنشاء
      const newProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);

      return newProducts;

    } catch (error) {
      throw errorHandler.handleError(error, 'new-products');
    }
  }

  /**
   * الحصول على المنتجات المخفضة
   */
  async getDiscountedProducts(limit = 10) {
    try {
      const products = await this.getAllProducts();
      
      // فلترة المنتجات المخفضة
      const discountedProducts = products
        .filter(product => product.originalPrice && product.price < product.originalPrice)
        .sort((a, b) => {
          const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
          const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
          return discountB - discountA;
        })
        .slice(0, limit);

      return discountedProducts;

    } catch (error) {
      throw errorHandler.handleError(error, 'discounted-products');
    }
  }

  /**
   * ترتيب المنتجات
   */
  sortProducts(products, sortBy, sortOrder = 'desc') {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price':
        sortedProducts.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
        break;
      
      case 'rating':
        sortedProducts.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
        });
        break;
      
      case 'reviews':
        sortedProducts.sort((a, b) => {
          const reviewsA = a.reviews || 0;
          const reviewsB = b.reviews || 0;
          return sortOrder === 'asc' ? reviewsA - reviewsB : reviewsB - reviewsA;
        });
        break;
      
      case 'date':
        sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      
      case 'name':
        sortedProducts.sort((a, b) => {
          const nameA = a.title || '';
          const nameB = b.title || '';
          return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        break;
      
      default:
        // الترتيب الافتراضي حسب التقييم
        sortedProducts.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
    }
    
    return sortedProducts;
  }

  /**
   * التحقق من صحة بيانات المنتج
   */
  validateProduct(productData) {
    const errors = [];
    
    if (!productData.title || productData.title.trim().length === 0) {
      errors.push('عنوان المنتج مطلوب');
    }
    
    if (!productData.authorId) {
      errors.push('معرف المؤلف مطلوب');
    }
    
    if (!productData.category) {
      errors.push('فئة المنتج مطلوبة');
    }
    
    if (productData.price === undefined || productData.price < 0) {
      errors.push('سعر المنتج يجب أن يكون أكبر من أو يساوي صفر');
    }
    
    if (!productData.type || !['physical', 'ebook', 'audio'].includes(productData.type)) {
      errors.push('نوع المنتج يجب أن يكون physical أو ebook أو audio');
    }
    
    // التحقق من البيانات حسب النوع
    if (productData.type === 'physical') {
      if (productData.stock === undefined || productData.stock < 0) {
        errors.push('مخزون المنتج المادي يجب أن يكون أكبر من أو يساوي صفر');
      }
    }
    
    if (productData.type === 'ebook') {
      if (!productData.ebookFile) {
        errors.push('ملف الكتاب الإلكتروني مطلوب');
      }
    }
    
    if (productData.type === 'audio') {
      if (!productData.audioFile) {
        errors.push('ملف الكتاب الصوتي مطلوب');
      }
      if (!productData.narrator) {
        errors.push('اسم القارئ مطلوب للكتاب الصوتي');
      }
    }
    
    return errors;
  }

  /**
   * الحصول على إحصائيات المنتجات
   */
  async getProductStats() {
    try {
      const products = await this.getAllProducts();
      
      const stats = {
        total: products.length,
        physical: products.filter(p => p.type === 'physical').length,
        ebooks: products.filter(p => p.type === 'ebook').length,
        audio: products.filter(p => p.type === 'audio').length,
        inStock: products.filter(p => (p.stock || 0) > 0).length,
        outOfStock: products.filter(p => (p.stock || 0) <= 0).length,
        averagePrice: products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length,
        averageRating: products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length
      };

      return stats;

    } catch (error) {
      throw errorHandler.handleError(error, 'product-stats');
    }
  }

  /**
   * إنشاء رابط تحميل للمنتج الرقمي
   */
  async generateDownloadUrl(productId, orderId) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'product/not-found',
          'المنتج غير موجود',
          `download-url:${productId}`
        );
      }

      // التحقق من أن المنتج رقمي
      if (!['ebook', 'audio'].includes(product.type)) {
        throw errorHandler.createError(
          'VALIDATION',
          'product/not-digital',
          'هذا المنتج ليس رقمياً',
          `download-url:${productId}`
        );
      }

      // إنشاء رابط تحميل آمن ومؤقت
      const timestamp = Date.now();
      const expiryTime = timestamp + (24 * 60 * 60 * 1000); // 24 ساعة
      const token = btoa(`${productId}-${orderId}-${timestamp}-${expiryTime}`);
      
      const downloadUrl = `/api/download/${productId}?token=${token}&order=${orderId}`;

      // حفظ رابط التحميل في قاعدة البيانات
      await firebaseApi.addToCollection('download_tokens', {
        productId,
        orderId,
        token,
        downloadUrl,
        expiresAt: new Date(expiryTime),
        createdAt: new Date(),
        used: false
      });

      return {
        success: true,
        downloadUrl,
        expiresAt: new Date(expiryTime),
        message: 'تم إنشاء رابط التحميل بنجاح'
      };

    } catch (error) {
      throw errorHandler.handleError(error, `download-url:${productId}`);
    }
  }
}

export default new ProductService();
