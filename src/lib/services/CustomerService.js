/**
 * خدمة إدارة العملاء
 */

import Customer from '../models/Customer.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';
import firebaseApi from '../firebase/baseApi.js';

const handleErrorWithLanguage = (error, context) =>
  errorHandler.handleError(error, context, getActiveLanguage());

export class CustomerService {
  constructor() {
    this.collectionName = 'customers';
  }

  /**
   * إنشاء عميل جديد
   */
  async createCustomer(customerData) {
    try {
      // إنشاء نموذج العميل
      const customer = new Customer(customerData);
      
      // التحقق من صحة البيانات
      const validationErrors = customer.validate();
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/customer-invalid',
          `خطأ في بيانات العميل: ${validationErrors.join(', ')}`,
          'customer-creation'
        );
      }

      // التحقق من عدم وجود عميل بنفس البريد الإلكتروني
      const existingCustomer = await this.getCustomerByEmail(customer.email);
      if (existingCustomer) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/email-exists',
          'البريد الإلكتروني مستخدم بالفعل',
          'customer-creation'
        );
      }

      // حفظ العميل في Firebase
      const customerDoc = await firebaseApi.addToCollection(this.collectionName, customer.toObject());
      customer.id = customerDoc.id;

      return customer.toObject();

    } catch (error) {
      throw handleErrorWithLanguage(error, 'customer-creation');
    }
  }

  /**
   * الحصول على عميل بواسطة المعرف
   */
  async getCustomerById(customerId) {
    try {
      const customerDoc = await firebaseApi.getDocById(this.collectionName, customerId);
      
      if (!customerDoc) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'customer/not-found',
          'العميل غير موجود',
          `customer:${customerId}`
        );
      }

      const customer = new Customer(customerDoc).toObject();
      return customer;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer:${customerId}`);
    }
  }

  /**
   * الحصول على عميل بواسطة المعرف أو إنشاؤه إذا لم يكن موجوداً
   */
  async getOrCreateCustomer(customerId, userData = {}) {
    try {
      const customerDoc = await firebaseApi.getDocById(this.collectionName, customerId);
      if (customerDoc) {
        return new Customer(customerDoc).toObject();
      }

      // إنشاء عميل جديد إذا لم يكن موجوداً
      const newCustomerData = {
        id: customerId,
        email: userData.email || 'temp@example.com', // قيمة افتراضية مؤقتة
        displayName: userData.displayName || userData.name || 'عميل جديد', // قيمة افتراضية
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      const customer = new Customer(newCustomerData);
      
      // تخطي التحقق من صحة البيانات إذا كانت البيانات افتراضية
      if (!userData.email || !userData.displayName) {
        // تخطي التحقق للبيانات الافتراضية
      } else {
        const validationErrors = customer.validate();
        if (validationErrors.length > 0) {
          throw errorHandler.createError(
            'VALIDATION',
            'validation/customer-creation-invalid',
            `خطأ في بيانات العميل: ${validationErrors.join(', ')}`,
            `customer-creation:${customerId}`
          );
        }
      }

      await firebaseApi.setDoc(this.collectionName, customerId, customer.toObject());
      return customer.toObject();

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-get-or-create:${customerId}`);
    }
  }

  /**
   * الحصول على عميل بواسطة البريد الإلكتروني
   */
  async getCustomerByEmail(email) {
    try {
      const customers = await firebaseApi.getCollection(this.collectionName);
      const customer = customers.find(c => c.email === email);
      
      return customer ? new Customer(customer).toObject() : null;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer:email:${email}`);
    }
  }

  /**
   * تحديث بيانات العميل
   */
  async updateCustomer(customerId, updateData) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل مع البيانات المحدثة
      const updatedCustomer = new Customer({ ...customer, ...updateData });
      
      // التحقق من صحة البيانات المحدثة
      const validationErrors = updatedCustomer.validate();
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/customer-update-invalid',
          `خطأ في بيانات التحديث: ${validationErrors.join(', ')}`,
          `customer-update:${customerId}`
        );
      }

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, updateData);

      return updatedCustomer.toObject();

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-update:${customerId}`);
    }
  }

  /**
   * حذف عميل
   */
  async deleteCustomer(customerId) {
    try {
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'customer/not-found',
          'العميل غير موجود',
          `customer-delete:${customerId}`
        );
      }

      // حذف العميل
      await firebaseApi.deleteFromCollection(this.collectionName, customerId);

      return { success: true, message: 'تم حذف العميل بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-delete:${customerId}`);
    }
  }

  /**
   * إضافة عنوان للعميل
   */
  async addCustomerAddress(customerId, addressData, userData = {}) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId, userData);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // إضافة العنوان
      const newAddress = customerModel.addAddress(addressData);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        addresses: customerModel.addresses,
        defaultShippingAddress: customerModel.defaultShippingAddress,
        defaultBillingAddress: customerModel.defaultBillingAddress,
        updatedAt: new Date()
      });

      return newAddress;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-address-add:${customerId}`);
    }
  }

  /**
   * تحديث عنوان العميل
   */
  async updateCustomerAddress(customerId, addressId, updateData) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // تحديث العنوان
      const updatedAddress = customerModel.updateAddress(addressId, updateData);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        addresses: customerModel.addresses,
        defaultShippingAddress: customerModel.defaultShippingAddress,
        defaultBillingAddress: customerModel.defaultBillingAddress,
        updatedAt: new Date()
      });

      return updatedAddress;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-address-update:${customerId}`);
    }
  }

  /**
   * حذف عنوان العميل
   */
  async removeCustomerAddress(customerId, addressId) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // حذف العنوان
      const result = customerModel.removeAddress(addressId);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        addresses: customerModel.addresses,
        defaultShippingAddress: customerModel.defaultShippingAddress,
        defaultBillingAddress: customerModel.defaultBillingAddress,
        updatedAt: new Date()
      });

      return result;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-address-remove:${customerId}`);
    }
  }

  /**
   * إضافة طريقة دفع للعميل
   */
  async addCustomerPaymentMethod(customerId, paymentData) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // إضافة طريقة الدفع
      const newPaymentMethod = customerModel.addPaymentMethod(paymentData);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        paymentMethods: customerModel.paymentMethods,
        defaultPaymentMethod: customerModel.defaultPaymentMethod,
        updatedAt: new Date()
      });

      return newPaymentMethod;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-payment-add:${customerId}`);
    }
  }

  /**
   * تحديث طريقة دفع العميل
   */
  async updateCustomerPaymentMethod(customerId, paymentMethodId, updateData) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // تحديث طريقة الدفع
      const updatedPaymentMethod = customerModel.updatePaymentMethod(paymentMethodId, updateData);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        paymentMethods: customerModel.paymentMethods,
        defaultPaymentMethod: customerModel.defaultPaymentMethod,
        updatedAt: new Date()
      });

      return updatedPaymentMethod;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-payment-update:${customerId}`);
    }
  }

  /**
   * حذف طريقة دفع العميل
   */
  async removeCustomerPaymentMethod(customerId, paymentMethodId) {
    try {
      // محاولة الحصول على العميل أو إنشاؤه إذا لم يكن موجوداً
      let customer;
      try {
        customer = await this.getCustomerById(customerId);
      } catch (error) {
        if (error.code === 'customer/not-found') {
          // إنشاء العميل إذا لم يكن موجوداً
          customer = await this.getOrCreateCustomer(customerId);
        } else {
          throw error;
        }
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // حذف طريقة الدفع
      const result = customerModel.removePaymentMethod(paymentMethodId);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        paymentMethods: customerModel.paymentMethods,
        defaultPaymentMethod: customerModel.defaultPaymentMethod,
        updatedAt: new Date()
      });

      return result;

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-payment-remove:${customerId}`);
    }
  }

  /**
   * تحديث معلومات طلب العميل
   */
  async updateCustomerOrderInfo(customerId, orderAmount) {
    try {
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'customer/not-found',
          'العميل غير موجود',
          `customer-order-update:${customerId}`
        );
      }

      // إنشاء نموذج العميل
      const customerModel = new Customer(customer);
      
      // تحديث معلومات الطلب
      customerModel.updateOrderInfo(orderAmount);

      // حساب نقاط الولاء
      const loyaltyPoints = customerModel.calculateLoyaltyPoints(orderAmount);

      // حفظ التحديث
      await firebaseApi.updateCollection(this.collectionName, customerId, {
        totalOrders: customerModel.totalOrders,
        totalSpent: customerModel.totalSpent,
        firstOrderDate: customerModel.firstOrderDate,
        lastOrderDate: customerModel.lastOrderDate,
        loyaltyPoints: customerModel.loyaltyPoints,
        loyaltyTier: customerModel.loyaltyTier,
        updatedAt: new Date()
      });

      return {
        success: true,
        loyaltyPoints,
        newTier: customerModel.loyaltyTier,
        message: 'تم تحديث معلومات الطلب بنجاح'
      };

    } catch (error) {
      throw handleErrorWithLanguage(error, `customer-order-update:${customerId}`);
    }
  }

  /**
   * البحث في العملاء
   */
  async searchCustomers(query, filters = {}) {
    try {
      let customers = await firebaseApi.getCollection(this.collectionName);
      
      // البحث في النص
      if (query) {
        const searchQuery = query.toLowerCase();
        customers = customers.filter(customer => 
          customer.displayName?.toLowerCase().includes(searchQuery) ||
          customer.email?.toLowerCase().includes(searchQuery) ||
          customer.phone?.includes(searchQuery)
        );
      }

      // تطبيق الفلاتر
      if (filters.isActive !== undefined) {
        customers = customers.filter(customer => customer.isActive === filters.isActive);
      }
      
      if (filters.isVerified !== undefined) {
        customers = customers.filter(customer => customer.isVerified === filters.isVerified);
      }
      
      if (filters.loyaltyTier) {
        customers = customers.filter(customer => customer.loyaltyTier === filters.loyaltyTier);
      }
      
      if (filters.minOrders !== undefined) {
        customers = customers.filter(customer => (customer.totalOrders || 0) >= filters.minOrders);
      }
      
      if (filters.maxOrders !== undefined) {
        customers = customers.filter(customer => (customer.totalOrders || 0) <= filters.maxOrders);
      }

      // ترتيب النتائج
      customers = this.sortCustomers(customers, filters.sortBy || 'name', filters.sortOrder || 'asc');

      return customers.map(customer => new Customer(customer).toObject());

    } catch (error) {
      throw handleErrorWithLanguage(error, 'customer-search');
    }
  }

  /**
   * ترتيب العملاء
   */
  sortCustomers(customers, sortBy, sortOrder = 'asc') {
    const sortedCustomers = [...customers];
    
    switch (sortBy) {
      case 'name':
        sortedCustomers.sort((a, b) => {
          const nameA = a.displayName || '';
          const nameB = b.displayName || '';
          return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        break;
      
      case 'email':
        sortedCustomers.sort((a, b) => {
          const emailA = a.email || '';
          const emailB = b.email || '';
          return sortOrder === 'asc' ? emailA.localeCompare(emailB) : emailB.localeCompare(emailA);
        });
        break;
      
      case 'orders':
        sortedCustomers.sort((a, b) => {
          const ordersA = a.totalOrders || 0;
          const ordersB = b.totalOrders || 0;
          return sortOrder === 'asc' ? ordersA - ordersB : ordersB - ordersA;
        });
        break;
      
      case 'spent':
        sortedCustomers.sort((a, b) => {
          const spentA = a.totalSpent || 0;
          const spentB = b.totalSpent || 0;
          return sortOrder === 'asc' ? spentA - spentB : spentB - spentA;
        });
        break;
      
      case 'loyalty':
        sortedCustomers.sort((a, b) => {
          const loyaltyA = a.loyaltyPoints || 0;
          const loyaltyB = b.loyaltyPoints || 0;
          return sortOrder === 'asc' ? loyaltyA - loyaltyB : loyaltyB - loyaltyA;
        });
        break;
      
      case 'date':
        sortedCustomers.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      
      default:
        // الترتيب الافتراضي حسب الاسم
        sortedCustomers.sort((a, b) => {
          const nameA = a.displayName || '';
          const nameB = b.displayName || '';
          return nameA.localeCompare(nameB);
        });
    }
    
    return sortedCustomers;
  }

  /**
   * الحصول على إحصائيات العملاء
   */
  async getCustomerStats() {
    try {
      const customers = await firebaseApi.getCollection(this.collectionName);
      
      const stats = {
        total: customers.length,
        active: customers.filter(c => c.isActive).length,
        inactive: customers.filter(c => !c.isActive).length,
        verified: customers.filter(c => c.isVerified).length,
        unverified: customers.filter(c => !c.isVerified).length,
        loyaltyTiers: {
          bronze: customers.filter(c => c.loyaltyTier === 'bronze').length,
          silver: customers.filter(c => c.loyaltyTier === 'silver').length,
          gold: customers.filter(c => c.loyaltyTier === 'gold').length,
          platinum: customers.filter(c => c.loyaltyTier === 'platinum').length
        },
        totalOrders: customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0),
        totalSpent: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
        averageOrders: customers.length > 0 ? 
          (customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0) / customers.length).toFixed(2) : 0,
        averageSpent: customers.length > 0 ? 
          (customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length).toFixed(2) : 0
      };

      return stats;

    } catch (error) {
      throw handleErrorWithLanguage(error, 'customer-stats');
    }
  }

  /**
   * الحصول على العملاء الأكثر نشاطاً
   */
  async getTopCustomers(limit = 10, criteria = 'spent') {
    try {
      const customers = await firebaseApi.getCollection(this.collectionName);
      
      let sortedCustomers;
      
      switch (criteria) {
        case 'orders':
          sortedCustomers = customers.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
          break;
        case 'loyalty':
          sortedCustomers = customers.sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0));
          break;
        case 'spent':
        default:
          sortedCustomers = customers.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
      }
      
      return sortedCustomers.slice(0, limit).map(customer => new Customer(customer).toObject());

    } catch (error) {
      throw handleErrorWithLanguage(error, 'customer-top');
    }
  }
}

export default new CustomerService();

