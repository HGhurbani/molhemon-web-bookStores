/**
 * اختبار نظام المدفوعات الموحد
 * Unified Payment System Test
 */

import unifiedPaymentApi from '../../api/unifiedPaymentApi.js';
import { paymentManager } from '../PaymentManager.js';
import PAYMENT_CONFIG from '../config/paymentConfig.js';
import logger from '../../logger.js';

class UnifiedPaymentTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  /**
   * تشغيل جميع الاختبارات
   */
  async runAllTests() {
    logger.debug('🚀 بدء اختبار نظام المدفوعات الموحد...');
    
    try {
      // اختبار التهيئة
      await this.testInitialization();
      
      // اختبار مزودي الدفع
      await this.testProviders();
      
      // اختبار إنشاء الدفع
      await this.testPaymentCreation();
      
      // اختبار طرق الدفع المتاحة
      await this.testAvailableMethods();
      
      // اختبار الإعدادات
      await this.testSettings();
      
      // عرض النتائج
      this.displayResults();
      
    } catch (error) {
      logger.error('❌ فشل في تشغيل الاختبارات:', error);
      this.errors.push(error);
    }
  }

  /**
   * اختبار التهيئة
   */
  async testInitialization() {
    logger.debug('📋 اختبار التهيئة...');
    
    try {
      const result = await unifiedPaymentApi.initialize();
      
      if (result.success) {
        this.testResults.push({
          test: 'Initialization',
          status: 'PASS',
          message: 'تم تهيئة النظام بنجاح'
        });
        logger.debug('✅ تم تهيئة النظام بنجاح');
      } else {
        throw new Error('فشل في تهيئة النظام');
      }
    } catch (error) {
      this.testResults.push({
        test: 'Initialization',
        status: 'FAIL',
        message: error.message
      });
      this.errors.push(error);
      logger.error('❌ فشل في تهيئة النظام:', error.message);
    }
  }

  /**
   * اختبار مزودي الدفع
   */
  async testProviders() {
    logger.debug('🏦 اختبار مزودي الدفع...');
    
    try {
      const result = await unifiedPaymentApi.getPaymentProviders();
      
      if (result.success && result.providers) {
        const providers = result.providers;
        
        // التحقق من وجود مزودين أساسيين
        const expectedProviders = ['stripe', 'paypal', 'tabby', 'cashOnDelivery'];
        const foundProviders = providers.map(p => p.name);
        
        for (const expected of expectedProviders) {
          if (foundProviders.includes(expected)) {
            this.testResults.push({
              test: `Provider: ${expected}`,
              status: 'PASS',
              message: `مزود ${expected} متاح`
            });
            logger.debug(`✅ مزود ${expected} متاح`);
          } else {
            this.testResults.push({
              test: `Provider: ${expected}`,
              status: 'FAIL',
              message: `مزود ${expected} غير متاح`
            });
            logger.error(`❌ مزود ${expected} غير متاح`);
          }
        }
        
        // اختبار اتصال Stripe
        await this.testProviderConnection('stripe');
        
      } else {
        throw new Error('فشل في الحصول على مزودي الدفع');
      }
    } catch (error) {
      this.testResults.push({
        test: 'Providers',
        status: 'FAIL',
        message: error.message
      });
      this.errors.push(error);
      logger.error('❌ فشل في اختبار مزودي الدفع:', error.message);
    }
  }

  /**
   * اختبار اتصال مزود محدد
   */
  async testProviderConnection(providerName) {
    logger.debug(`🔗 اختبار اتصال ${providerName}...`);
    
    try {
      const result = await unifiedPaymentApi.testProviderConnection(providerName);
      
      if (result.success) {
        this.testResults.push({
          test: `Connection: ${providerName}`,
          status: 'PASS',
          message: `اتصال ${providerName} ناجح`
        });
        logger.debug(`✅ اتصال ${providerName} ناجح`);
      } else {
        this.testResults.push({
          test: `Connection: ${providerName}`,
          status: 'FAIL',
          message: `فشل في الاتصال بـ ${providerName}`
        });
        logger.error(`❌ فشل في الاتصال بـ ${providerName}`);
      }
    } catch (error) {
      this.testResults.push({
        test: `Connection: ${providerName}`,
        status: 'FAIL',
        message: error.message
      });
      logger.error(`❌ خطأ في اختبار اتصال ${providerName}:`, error.message);
    }
  }

  /**
   * اختبار إنشاء الدفع
   */
  async testPaymentCreation() {
    logger.debug('💳 اختبار إنشاء الدفع...');
    
    try {
      const paymentData = {
        amount: 100.00,
        currency: 'SAR',
        orderId: 'test_order_123',
        customerId: 'test_customer_456',
        metadata: {
          description: 'اختبار الدفع',
          customerEmail: 'test@example.com'
        }
      };

      const result = await unifiedPaymentApi.createPaymentIntent(paymentData);
      
      if (result.success && result.paymentIntent) {
        this.testResults.push({
          test: 'Payment Creation',
          status: 'PASS',
          message: 'تم إنشاء عملية الدفع بنجاح'
        });
        logger.debug('✅ تم إنشاء عملية الدفع بنجاح');
        
        // اختبار الحصول على الدفع
        await this.testGetPayment(result.payment.id);
        
      } else {
        throw new Error('فشل في إنشاء عملية الدفع');
      }
    } catch (error) {
      this.testResults.push({
        test: 'Payment Creation',
        status: 'FAIL',
        message: error.message
      });
      this.errors.push(error);
      logger.error('❌ فشل في إنشاء عملية الدفع:', error.message);
    }
  }

  /**
   * اختبار الحصول على دفع
   */
  async testGetPayment(paymentId) {
    logger.debug(`🔍 اختبار الحصول على الدفع ${paymentId}...`);
    
    try {
      const result = await unifiedPaymentApi.getPaymentById(paymentId);
      
      if (result.success && result.payment) {
        this.testResults.push({
          test: 'Get Payment',
          status: 'PASS',
          message: 'تم الحصول على الدفع بنجاح'
        });
        logger.debug('✅ تم الحصول على الدفع بنجاح');
      } else {
        throw new Error('فشل في الحصول على الدفع');
      }
    } catch (error) {
      this.testResults.push({
        test: 'Get Payment',
        status: 'FAIL',
        message: error.message
      });
      logger.error('❌ فشل في الحصول على الدفع:', error.message);
    }
  }

  /**
   * اختبار طرق الدفع المتاحة
   */
  async testAvailableMethods() {
    logger.debug('📋 اختبار طرق الدفع المتاحة...');
    
    try {
      const orderData = {
        amount: 100.00,
        currency: 'SAR',
        country: 'SA'
      };

      const result = await unifiedPaymentApi.getAvailablePaymentMethods(orderData);
      
      if (result.success && result.methods && result.methods.length > 0) {
        this.testResults.push({
          test: 'Available Methods',
          status: 'PASS',
          message: `تم العثور على ${result.methods.length} طريقة دفع متاحة`
        });
        logger.debug(`✅ تم العثور على ${result.methods.length} طريقة دفع متاحة`);
        
        // عرض طرق الدفع المتاحة
        result.methods.forEach(method => {
          logger.debug(`  - ${method.displayName} (${method.provider})`);
        });
        
      } else {
        throw new Error('لم يتم العثور على طرق دفع متاحة');
      }
    } catch (error) {
      this.testResults.push({
        test: 'Available Methods',
        status: 'FAIL',
        message: error.message
      });
      this.errors.push(error);
      logger.error('❌ فشل في اختبار طرق الدفع المتاحة:', error.message);
    }
  }

  /**
   * اختبار الإعدادات
   */
  async testSettings() {
    logger.debug('⚙️ اختبار الإعدادات...');
    
    try {
      // اختبار الحصول على إحصائيات
      const statsResult = await unifiedPaymentApi.getPaymentStats();
      
      if (statsResult.success && statsResult.stats) {
        this.testResults.push({
          test: 'Payment Stats',
          status: 'PASS',
          message: 'تم الحصول على إحصائيات المدفوعات'
        });
        logger.debug('✅ تم الحصول على إحصائيات المدفوعات');
        logger.debug(`  - إجمالي المدفوعات: ${statsResult.stats.total}`);
        logger.debug(`  - المدفوعات المكتملة: ${statsResult.stats.completed}`);
        logger.debug(`  - معدل النجاح: ${statsResult.stats.successRate}%`);
      } else {
        throw new Error('فشل في الحصول على إحصائيات المدفوعات');
      }
      
      // اختبار الحصول على معلومات مزود محدد
      const providerResult = await unifiedPaymentApi.getProviderInfo('stripe');
      
      if (providerResult.success && providerResult.provider) {
        this.testResults.push({
          test: 'Provider Info',
          status: 'PASS',
          message: 'تم الحصول على معلومات المزود'
        });
        logger.debug('✅ تم الحصول على معلومات المزود');
        logger.debug(`  - الاسم: ${providerResult.provider.displayName}`);
        logger.debug(`  - الوصف: ${providerResult.provider.description}`);
        logger.debug(`  - مفعل: ${providerResult.provider.enabled ? 'نعم' : 'لا'}`);
      } else {
        throw new Error('فشل في الحصول على معلومات المزود');
      }
      
    } catch (error) {
      this.testResults.push({
        test: 'Settings',
        status: 'FAIL',
        message: error.message
      });
      this.errors.push(error);
      logger.error('❌ فشل في اختبار الإعدادات:', error.message);
    }
  }

  /**
   * عرض نتائج الاختبار
   */
  displayResults() {
    logger.debug('\n📊 نتائج الاختبار:');
    logger.debug('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;
    
    logger.debug(`✅ نجح: ${passed}`);
    logger.debug(`❌ فشل: ${failed}`);
    logger.debug(`📋 إجمالي: ${total}`);
    logger.debug(`📈 نسبة النجاح: ${((passed / total) * 100).toFixed(1)}%`);
    
    logger.debug('\n📋 تفاصيل النتائج:');
    logger.debug('-'.repeat(50));
    
    this.testResults.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      logger.debug(`${icon} ${result.test}: ${result.message}`);
    });
    
    if (this.errors.length > 0) {
      logger.debug('\n🚨 الأخطاء:');
      logger.debug('-'.repeat(50));
      this.errors.forEach((error, index) => {
        logger.debug(`${index + 1}. ${error.message}`);
      });
    }
    
    logger.debug('\n🎉 انتهى اختبار نظام المدفوعات الموحد!');
  }

  /**
   * اختبار سريع
   */
  async quickTest() {
    logger.debug('⚡ اختبار سريع للنظام...');
    
    try {
      // تهيئة سريعة
      await unifiedPaymentApi.initialize();
      
      // اختبار مزودي الدفع
      const providers = await unifiedPaymentApi.getPaymentProviders();
      
      // اختبار إنشاء دفع بسيط
      const paymentData = {
        amount: 50.00,
        currency: 'SAR',
        orderId: 'quick_test_123',
        customerId: 'quick_test_456'
      };
      
      const payment = await unifiedPaymentApi.createPaymentIntent(paymentData);
      
      logger.debug('✅ الاختبار السريع نجح!');
      logger.debug(`📊 مزودي الدفع المتاحين: ${providers.providers.length}`);
      logger.debug(`💳 تم إنشاء عملية الدفع: ${payment.paymentIntent.id}`);
      
      return true;
      
    } catch (error) {
      logger.error('❌ الاختبار السريع فشل:', error.message);
      return false;
    }
  }
}

// تصدير فئة الاختبار
export default UnifiedPaymentTest;

// دالة مساعدة لتشغيل الاختبار
export const runPaymentTest = async () => {
  const tester = new UnifiedPaymentTest();
  await tester.runAllTests();
  return tester;
};

// دالة مساعدة للاختبار السريع
export const runQuickTest = async () => {
  const tester = new UnifiedPaymentTest();
  return await tester.quickTest();
};










