/**
 * خدمة إدارة إعدادات المتجر
 */

import StoreSettings from '../models/StoreSettings.js';
import { errorHandler } from '../errorHandler.js';
import { getActiveLanguage } from '../languageUtils.js';
import firebaseApi from '../firebase/baseApi.js';
import logger from '../logger.js';

const handleErrorWithLanguage = (error, context) =>
  errorHandler.handleError(error, context, getActiveLanguage());

export class StoreSettingsService {
  constructor() {
    this.collectionName = 'store_settings';
    this.paymentCollection = 'payment_gateways';
    this.shippingCollection = 'shipping_methods';
    this.settings = null;
  }

  /**
   * الحصول على إعدادات المتجر
   */
  async getStoreSettings() {
    try {
      if (this.settings) {
        return this.settings;
      }

      // محاولة الحصول من Firebase
      const settingsDoc = await firebaseApi.getDocById(this.collectionName, 'main');
      
      if (settingsDoc) {
        this.settings = new StoreSettings(settingsDoc);
      } else {
        // إنشاء إعدادات افتراضية إذا لم تكن موجودة
        this.settings = new StoreSettings();
        await this.saveStoreSettings();
      }

      return this.settings;

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:get');
    }
  }

  /**
   * حفظ إعدادات المتجر
   */
  async saveStoreSettings() {
    try {
      if (!this.settings) {
        throw errorHandler.createError(
          'VALIDATION',
          'settings/not-initialized',
          'الإعدادات غير مهيأة',
          'store-settings:save'
        );
      }

      // التحقق من صحة البيانات
      const validationErrors = this.settings.validate();
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'settings/validation-failed',
          `أخطاء في الإعدادات: ${validationErrors.join(', ')}`,
          'store-settings:save'
        );
      }

      // حفظ في Firebase
      await firebaseApi.setDoc(this.collectionName, 'main', this.settings.toObject());

      return { success: true, message: 'تم حفظ الإعدادات بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:save');
    }
  }

  /**
   * تحديث إعدادات المتجر
   */
  async updateStoreSettings(updateData) {
    try {
      // الحصول على الإعدادات الحالية
      await this.getStoreSettings();

      // تحديث الإعدادات
      this.settings.updateSettings(updateData);

      // حفظ التحديثات
      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث الإعدادات بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:update');
    }
  }

  /**
   * إعادة تعيين الإعدادات إلى القيم الافتراضية
   */
  async resetStoreSettings() {
    try {
      this.settings = new StoreSettings();
      await this.saveStoreSettings();

      return { success: true, message: 'تم إعادة تعيين الإعدادات بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:reset');
    }
  }

  /**
   * تحديث إعدادات الشحن
   */
  async updateShippingSettings(shippingData) {
    try {
      await this.getStoreSettings();

      // تحديث إعدادات الشحن
      if (shippingData.enabled !== undefined) {
        this.settings.shippingEnabled = shippingData.enabled;
      }
      if (shippingData.freeShippingThreshold !== undefined) {
        this.settings.freeShippingThreshold = shippingData.freeShippingThreshold;
      }
      if (shippingData.methods) {
        this.settings.shippingMethods = { ...this.settings.shippingMethods, ...shippingData.methods };
      }
      if (shippingData.zones) {
        this.settings.shippingZones = { ...this.settings.shippingZones, ...shippingData.zones };
      }

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث إعدادات الشحن بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:shipping-update');
    }
  }

  /**
   * تحديث إعدادات الدفع
   */
  async updatePaymentSettings(paymentData) {
    try {
      await this.getStoreSettings();

      // تحديث إعدادات الدفع
      if (paymentData.enabled !== undefined) {
        this.settings.paymentEnabled = paymentData.enabled;
      }
      if (paymentData.methods) {
        this.settings.paymentMethods = { ...this.settings.paymentMethods, ...paymentData.methods };
      }
      if (paymentData.gateways) {
        this.settings.paymentGateways = { ...this.settings.paymentGateways, ...paymentData.gateways };
      }

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث إعدادات الدفع بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:payment-update');
    }
  }

  /**
   * تحديث إعدادات الضرائب
   */
  async updateTaxSettings(taxData) {
    try {
      await this.getStoreSettings();

      // تحديث إعدادات الضرائب
      if (taxData.enabled !== undefined) {
        this.settings.taxEnabled = taxData.enabled;
      }
      if (taxData.rate !== undefined) {
        this.settings.taxRate = taxData.rate;
      }
      if (taxData.included !== undefined) {
        this.settings.taxIncluded = taxData.included;
      }

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث إعدادات الضرائب بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:tax-update');
    }
  }

  /**
   * تحديث إعدادات الطلبات
   */
  async updateOrderSettings(orderData) {
    try {
      await this.getStoreSettings();

      // تحديث إعدادات الطلبات
      if (orderData.autoConfirmation !== undefined) {
        this.settings.orderAutoConfirmation = orderData.autoConfirmation;
      }
      if (orderData.cancellationWindow !== undefined) {
        this.settings.orderCancellationWindow = orderData.cancellationWindow;
      }
      if (orderData.minAmount !== undefined) {
        this.settings.minOrderAmount = orderData.minAmount;
      }
      if (orderData.maxAmount !== undefined) {
        this.settings.maxOrderAmount = orderData.maxAmount;
      }

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث إعدادات الطلبات بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:order-update');
    }
  }

  /**
   * تحديث إعدادات العملاء
   */
  async updateCustomerSettings(customerData) {
    try {
      await this.getStoreSettings();

      // تحديث إعدادات العملاء
      if (customerData.guestCheckout !== undefined) {
        this.settings.guestCheckout = customerData.guestCheckout;
      }
      if (customerData.registration !== undefined) {
        this.settings.customerRegistration = customerData.registration;
      }
      if (customerData.verification !== undefined) {
        this.settings.customerVerification = customerData.verification;
      }

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث إعدادات العملاء بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:customer-update');
    }
  }

  /**
   * تحديث إعدادات الإشعارات
   */
  async updateNotificationSettings(notificationData) {
    try {
      await this.getStoreSettings();

      // تحديث إعدادات الإشعارات
      if (notificationData.email !== undefined) {
        this.settings.emailNotifications = notificationData.email;
      }
      if (notificationData.sms !== undefined) {
        this.settings.smsNotifications = notificationData.sms;
      }
      if (notificationData.push !== undefined) {
        this.settings.pushNotifications = notificationData.push;
      }

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث إعدادات الإشعارات بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:notification-update');
    }
  }

  /**
   * الحصول على طرق الشحن المتاحة
   */
  async getAvailableShippingMethods(country, orderAmount = 0, productWeight = 0) {
    try {
      const settings = await this.getStoreSettings();
      
      // التأكد من وجود طرق الشحن الافتراضية إذا لم تكن موجودة
      if (!settings.shippingMethods || Object.keys(settings.shippingMethods).length === 0) {
        logger.info('No shipping methods found, adding default methods');
        settings.shippingMethods = settings.getDefaultShippingMethods();
        await this.saveStoreSettings();
      }
      
      return settings.getAvailableShippingMethods(country, orderAmount, productWeight);

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:shipping-methods');
    }
  }

  /**
   * الحصول على طرق الدفع المتاحة
   */
  async getAvailablePaymentMethods() {
    try {
      const settings = await this.getStoreSettings();
      return settings.getAvailablePaymentMethods();

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:payment-methods');
    }
  }

  /**
   * الحصول على بوابات الدفع المتاحة
   */
  async getAvailablePaymentGateways() {
    try {
      const settings = await this.getStoreSettings();
      return settings.getAvailablePaymentGateways();

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:payment-gateways');
    }
  }

  /**
   * حساب تكلفة الشحن
   */
  async calculateShippingCost(country, orderAmount, productWeight, shippingMethodId) {
    try {
      const settings = await this.getStoreSettings();
      return settings.calculateShippingCost(country, orderAmount, productWeight, shippingMethodId);

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:shipping-cost');
    }
  }

  /**
   * الحصول على منطقة الشحن
   */
  async getShippingZone(country) {
    try {
      const settings = await this.getStoreSettings();
      return settings.getShippingZoneByCountry(country);

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:shipping-zone');
    }
  }

  /**
   * التحقق من صحة الإعدادات
   */
  async validateSettings() {
    try {
      const settings = await this.getStoreSettings();
      const errors = settings.validate();

      return {
        isValid: errors.length === 0,
        errors: errors
      };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:validate');
    }
  }

  /**
   * تصدير الإعدادات
   */
  async exportSettings() {
    try {
      const settings = await this.getStoreSettings();
      return settings.toObject();

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:export');
    }
  }

  /**
   * استيراد الإعدادات
   */
  async importSettings(settingsData) {
    try {
      // التحقق من صحة البيانات المستوردة
      const tempSettings = new StoreSettings(settingsData);
      const validationErrors = tempSettings.validate();
      
      if (validationErrors.length > 0) {
        throw errorHandler.createError(
          'VALIDATION',
          'settings/import-validation-failed',
          `أخطاء في البيانات المستوردة: ${validationErrors.join(', ')}`,
          'store-settings:import'
        );
      }

      // تحديث الإعدادات
      this.settings = tempSettings;
      await this.saveStoreSettings();

      return { success: true, message: 'تم استيراد الإعدادات بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:import');
    }
  }

  /**
   * الحصول على إحصائيات الإعدادات
   */
  async getSettingsStats() {
    try {
      const settings = await this.getStoreSettings();
      
      const stats = {
        shippingMethods: Object.keys(settings.shippingMethods).length,
        enabledShippingMethods: Object.values(settings.shippingMethods).filter(m => m.enabled).length,
        paymentMethods: Object.keys(settings.paymentMethods).length,
        enabledPaymentMethods: Object.values(settings.paymentMethods).filter(m => m.enabled).length,
        paymentGateways: Object.keys(settings.paymentGateways).length,
        enabledPaymentGateways: Object.values(settings.paymentGateways).filter(g => g.enabled).length,
        shippingZones: Object.keys(settings.shippingZones).length,
        lastUpdated: settings.updatedAt,
        updatedBy: settings.updatedBy
      };

      return stats;

    } catch (error) {
      throw handleErrorWithLanguage(error, 'store-settings:stats');
    }
  }

  /**
   * تحديث إعدادات بوابة دفع معينة
   */
  async updatePaymentGateway(gatewayId, gatewayConfig) {
    try {
      await this.getStoreSettings();

      if (!this.settings.paymentGateways[gatewayId]) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'gateway/not-found',
          'بوابة الدفع غير موجودة',
          `store-settings:gateway-update:${gatewayId}`
        );
      }

      // تحديث إعدادات البوابة
      this.settings.paymentGateways[gatewayId] = {
        ...this.settings.paymentGateways[gatewayId],
        ...gatewayConfig,
        updatedAt: new Date()
      };

      await this.saveStoreSettings();

      return { success: true, message: 'تم تحديث بوابة الدفع بنجاح' };

    } catch (error) {
      throw handleErrorWithLanguage(error, `store-settings:gateway-update:${gatewayId}`);
    }
  }

  /**
   * تفعيل/إلغاء تفعيل بوابة دفع
   */
  async togglePaymentGateway(gatewayId, enabled) {
    try {
      await this.getStoreSettings();

      if (!this.settings.paymentGateways[gatewayId]) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'gateway/not-found',
          'بوابة الدفع غير موجودة',
          `store-settings:gateway-toggle:${gatewayId}`
        );
      }

      this.settings.paymentGateways[gatewayId].enabled = enabled;
      await this.saveStoreSettings();

      const status = enabled ? 'مفعلة' : 'ملغية';
      return { success: true, message: `تم ${status} بوابة الدفع بنجاح` };

    } catch (error) {
      throw handleErrorWithLanguage(error, `store-settings:gateway-toggle:${gatewayId}`);
    }
  }

  // === Versioned storage helpers ===
  async _getLatestVersion(collection) {
    const docs = await firebaseApi.getCollection(collection);
    return docs.reduce((max, doc) => Math.max(max, doc.version || 0), 0);
  }

  async _saveVersioned(collection, data) {
    const version = (await this._getLatestVersion(collection)) + 1;
    await firebaseApi.setDoc(collection, version.toString(), {
      version,
      data,
      createdAt: new Date().toISOString()
    });
    return version;
  }

  async _getVersioned(collection, version) {
    if (version) {
      return await firebaseApi.getDocById(collection, version.toString());
    }
    const latest = await this._getLatestVersion(collection);
    if (!latest) return null;
    return await firebaseApi.getDocById(collection, latest.toString());
  }

  /**
   * حفظ بوابات الدفع مع إنشاء نسخة بإصدار
   */
  async savePaymentGateways(gateways) {
    await this.updateStoreSettings({ paymentGateways: gateways });
    return await this._saveVersioned(this.paymentCollection, gateways);
  }

  /**
   * استعادة بوابات الدفع من نسخة محددة
   */
  async restorePaymentGateways(version) {
    const doc = await this._getVersioned(this.paymentCollection, version);
    if (doc && doc.data) {
      await this.updateStoreSettings({ paymentGateways: doc.data });
      return doc.data;
    }
    return null;
  }

  /**
   * حفظ طرق الشحن مع إنشاء نسخة بإصدار
   */
  async saveShippingMethods(data) {
    await this.updateStoreSettings({
      shippingMethods: data.methods,
      shippingZones: data.zones
    });
    return await this._saveVersioned(this.shippingCollection, data);
  }

  /**
   * استعادة طرق الشحن من نسخة محددة
   */
  async restoreShippingMethods(version) {
    const doc = await this._getVersioned(this.shippingCollection, version);
    if (doc && doc.data) {
      await this.updateStoreSettings({
        shippingMethods: doc.data.methods || {},
        shippingZones: doc.data.zones || {}
      });
      return doc.data;
    }
    return null;
  }
}

export default new StoreSettingsService();

