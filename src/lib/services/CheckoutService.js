/**
 * خدمة إدارة عملية الشراء والدفع
 */

import { Order } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';
import { Payment } from '../models/Payment.js';
import { Shipping } from '../models/Shipping.js';
import { errorHandler } from '../errorHandler.js';
import OrderService from './OrderService.js';
import PaymentService from './PaymentService.js';
import ShippingService from './ShippingService.js';
import ProductService from './ProductService.js';

export class CheckoutService {
  constructor() {
    this.orderService = OrderService;
    this.paymentService = PaymentService;
    this.shippingService = ShippingService;
    this.productService = ProductService;
  }

  /**
   * إنشاء طلب جديد مع الدفع والشحن
   */
  async createOrderWithCheckout(checkoutData) {
    try {
      const {
        customerId,
        customerInfo,
        items,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        paymentDetails,
        notes
      } = checkoutData;

      // التحقق من صحة البيانات
      console.log('CheckoutService - Validating checkout data:', {
        customerId: checkoutData.customerId,
        hasCustomerInfo: !!checkoutData.customerInfo,
        customerName: checkoutData.customerInfo?.name,
        customerEmail: checkoutData.customerInfo?.email,
        itemsCount: checkoutData.items?.length || 0
      });
      
      const validationErrors = this.validateCheckoutData(checkoutData);
      if (validationErrors.length > 0) {
        console.error('CheckoutService - Validation errors:', validationErrors);
        throw errorHandler.createError(
          'VALIDATION',
          'validation/checkout-invalid',
          `خطأ في بيانات الشراء: ${validationErrors.join(', ')}`,
          'checkout-creation'
        );
      }

      // التحقق من توفر المخزون للمنتجات المادية
      const stockCheck = await this.checkStockAvailability(items);
      if (!stockCheck.available) {
        throw errorHandler.createError(
          'VALIDATION',
          'validation/stock-unavailable',
          stockCheck.message,
          'checkout-stock-check'
        );
      }

      // استخدام التكاليف المحسوبة مسبقاً أو حسابها
      let costCalculation;
      console.log('CheckoutService - Received checkoutData:', {
        subtotal: checkoutData.subtotal,
        shippingCost: checkoutData.shippingCost,
        taxAmount: checkoutData.taxAmount,
        total: checkoutData.total
      });
      
      if (checkoutData.subtotal !== undefined && checkoutData.shippingCost !== undefined && 
          checkoutData.taxAmount !== undefined && checkoutData.total !== undefined) {
        // استخدام التكاليف المحسوبة مسبقاً
        costCalculation = {
          subtotal: checkoutData.subtotal,
          shippingCost: checkoutData.shippingCost,
          taxAmount: checkoutData.taxAmount,
          total: checkoutData.total,
          totalWeight: 0,
          packageDimensions: { length: 0, width: 0, height: 0 }
        };
        console.log('CheckoutService - Using pre-calculated costs:', costCalculation);
      } else {
        // حساب التكاليف
        costCalculation = await this.calculateOrderCosts(items, shippingAddress, shippingMethod);
        console.log('CheckoutService - Calculated costs:', costCalculation);
      }
      
      // إنشاء عناصر الطلب
      const orderItems = items.map(itemData => {
        const orderItem = new OrderItem({
          ...itemData,
          unitPrice: itemData.price,
          totalPrice: itemData.price * itemData.quantity
        });
        orderItem.calculateTotalPrice();
        return orderItem;
      });

      // التحقق من طريقة الشحن - إذا كان استلام من المتجر، فالشحن = 0
      const isPickup = shippingMethod === 'pickup' || 
                      shippingMethod?.name === 'استلام من المتجر' ||
                      shippingMethod?.id === 'pickup' ||
                      shippingMethod?.type === 'pickup';
      
      const finalShippingCost = isPickup ? 0 : costCalculation.shippingCost;
      const finalTotal = costCalculation.subtotal - (checkoutData.discountAmount || 0) + finalShippingCost + costCalculation.taxAmount;

      console.log('CheckoutService - Shipping calculation:', {
        isPickup,
        originalShippingCost: costCalculation.shippingCost,
        finalShippingCost,
        originalTotal: costCalculation.total,
        finalTotal
      });

      // إنشاء الطلب
      const orderData = {
        customerId,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        items: orderItems.map(item => item.toObject()),
        subtotal: costCalculation.subtotal,
        shippingCost: finalShippingCost, // استخدام التكلفة الصحيحة
        taxAmount: costCalculation.taxAmount,
        total: finalTotal, // استخدام الإجمالي الصحيح
        totalAmount: finalTotal, // إضافة totalAmount للتوافق
        currency: 'SAR',
        status: 'pending',
        paymentStatus: 'pending',
        shippingMethod,
        shippingAddress,
        notes
      };

      console.log('CheckoutService - Creating order with data:', orderData);

      const order = await this.orderService.createOrder(orderData);
      
      // تسجيل مفصل لبيانات الطلب المُنشأ
      console.log('CheckoutService - Order created:', order);
      console.log('CheckoutService - Order keys:', Object.keys(order));
      console.log('CheckoutService - order.order:', order.order);
      console.log('CheckoutService - order.order.id:', order.order?.id);
      
      // التحقق من وجود معرف الطلب
      if (!order.order || !order.order.id) {
        console.error('CheckoutService - Order ID is missing after creation:', {
          hasOrder: !!order.order,
          orderId: order.order?.id,
          orderKeys: order.order ? Object.keys(order.order) : 'N/A'
        });
        throw errorHandler.createError(
          'VALIDATION',
          'validation/order-id-missing',
          'فشل في الحصول على معرف الطلب بعد الإنشاء',
          'checkout-order-creation'
        );
      }

      // إنشاء معلومات الشحن (إذا كان هناك منتجات مادية)
      let shipping = null;
      if (this.hasPhysicalItems(items)) {
        shipping = await this.shippingService.createShipping({
          orderId: order.order.id,
          customerId,
          shippingMethod,
          shippingAddress,
          packageWeight: costCalculation.totalWeight,
          packageDimensions: costCalculation.packageDimensions,
          packageCount: items.length
        });
      }

      // إنشاء عملية الدفع
      const payment = await this.paymentService.createPayment({
        orderId: order.order.id,
        customerId,
        amount: order.order.total,
        currency: 'SAR',
        paymentMethod,
        paymentDetails,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        billingAddress: shippingAddress
      });

      // معالجة الدفع
      let paymentResult;
      const paymentMethodId = typeof paymentMethod === 'string' ? paymentMethod : paymentMethod.id;
      const paymentMethodGateway = typeof paymentMethod === 'object' ? paymentMethod.gateway : paymentMethod;
      const isTestMode = typeof paymentMethod === 'object' ? paymentMethod.testMode : false;
      
      if (paymentMethodId !== 'cash_on_delivery') {
        // استخدام gateway للدفع الفعلي
        if (isTestMode) {
          // وضع الاختبار - محاكاة الدفع
          paymentResult = {
            success: true,
            transactionId: `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: {
              status: 'success',
              message: 'تم الدفع بنجاح (وضع الاختبار)',
              testMode: true
            }
          };
        } else {
          // الدفع الفعلي
          paymentResult = await this.paymentService.processPayment(payment.id, paymentMethodGateway, paymentDetails);
        }
      } else {
        // الدفع عند الاستلام
        paymentResult = await this.paymentService.processCashOnDeliveryPayment(payment, {});
      }

      // تحديث حالة الطلب حسب نتيجة الدفع
      if (paymentResult.success) {
        await this.orderService.updateOrderStatus(order.order.id, 'confirmed');
        
        // تحديث المخزون للمنتجات المادية
        if (this.hasPhysicalItems(items)) {
          await this.updateStockForOrder(items);
        }
      } else {
        await this.orderService.updateOrderStatus(order.order.id, 'payment_failed');
      }

      // التحقق من وجود الطلب في النتيجة
      if (!order || !order.order) {
        console.error('CheckoutService - Order is missing in result:', order);
        throw errorHandler.createError(
          'VALIDATION',
          'validation/order-missing',
          'فشل في إنشاء الطلب - لم يتم إرجاع بيانات الطلب',
          'checkout-order-creation'
        );
      }

      // التحقق من وجود معرف الطلب
      if (!order.order.id) {
        console.error('CheckoutService - Order ID is missing:', order.order);
        throw errorHandler.createError(
          'VALIDATION',
          'validation/order-id-missing',
          'فشل في الحصول على معرف الطلب بعد الإنشاء',
          'checkout-order-creation'
        );
      }

      console.log('CheckoutService - Final order result:', {
        hasOrder: !!order.order,
        orderId: order.order.id,
        orderNumber: order.order.orderNumber
      });

      return {
        order: order.order,
        items: order.items,
        shipping,
        payment,
        paymentResult,
        costCalculation
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'checkout-creation');
    }
  }

  /**
   * حساب تكاليف الطلب
   */
  async calculateOrderCosts(items, shippingAddress, shippingMethod) {
    try {
      // حساب المجموع الفرعي
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // حساب تكلفة الشحن
      let shippingCost = 0;
      if (this.hasPhysicalItems(items)) {
        const shippingCalculation = await this.shippingService.calculateShippingCost(
          items,
          shippingAddress,
          shippingMethod
        );
        shippingCost = shippingCalculation.cost;
      }

      // حساب الضريبة
      const taxAmount = (subtotal + shippingCost) * 0.15; // 15% ضريبة

      // حساب الإجمالي
      const total = subtotal + shippingCost + taxAmount;

      // حساب الوزن والأبعاد
      const totalWeight = this.calculateTotalWeight(items);
      const packageDimensions = this.calculatePackageDimensions(items);

      return {
        subtotal,
        shippingCost,
        taxAmount,
        total,
        totalWeight,
        packageDimensions
      };

    } catch (error) {
      throw errorHandler.handleError(error, 'cost-calculation');
    }
  }

  /**
   * التحقق من توفر المخزون
   */
  async checkStockAvailability(items) {
    try {
      for (const item of items) {
        if (item.type === 'physical') {
          const stockCheck = await this.productService.checkStockAvailability(item.id, item.quantity);
          if (!stockCheck.available) {
            return {
              available: false,
              message: `المنتج ${item.title} غير متوفر في المخزون. المتوفر: ${stockCheck.availableStock}`
            };
          }
        }
      }

      return { available: true, message: 'جميع المنتجات متوفرة في المخزون' };

    } catch (error) {
      throw errorHandler.handleError(error, 'stock-availability-check');
    }
  }

  /**
   * تحديث المخزون بعد الطلب
   */
  async updateStockForOrder(items) {
    try {
      for (const item of items) {
        if (item.type === 'physical') {
          await this.productService.updateStock(item.id, item.quantity, 'decrease');
        }
      }
    } catch (error) {
      console.error('Error updating stock for order:', error);
    }
  }

  /**
   * التحقق من وجود منتجات مادية
   */
  hasPhysicalItems(items) {
    return items.some(item => item.type === 'physical');
  }

  /**
   * حساب الوزن الإجمالي
   */
  calculateTotalWeight(items) {
    return items.reduce((total, item) => {
      if (item.type === 'physical' && item.weight) {
        return total + (item.weight * item.quantity);
      }
      return total;
    }, 0);
  }

  /**
   * حساب أبعاد الطرد
   */
  calculatePackageDimensions(items) {
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    items.forEach(item => {
      if (item.dimensions) {
        maxLength = Math.max(maxLength, item.dimensions.length);
        maxWidth = Math.max(maxWidth, item.dimensions.width);
        totalHeight += item.dimensions.height;
      }
    });

    return {
      length: maxLength,
      width: maxWidth,
      height: totalHeight
    };
  }

  /**
   * التحقق من صحة بيانات الشراء
   */
  validateCheckoutData(checkoutData) {
    const errors = [];
    
    // customerId is optional for guest checkout, but if provided it should be valid
    if (checkoutData.customerId && typeof checkoutData.customerId !== 'string') {
      errors.push('معرف العميل غير صحيح');
    }
    
    if (!checkoutData.customerInfo) {
      errors.push('معلومات العميل مطلوبة');
    } else {
      if (!checkoutData.customerInfo.name) {
        errors.push('اسم العميل مطلوب');
      }
      if (!checkoutData.customerInfo.email) {
        errors.push('البريد الإلكتروني مطلوب');
      }
      if (!checkoutData.customerInfo.phone) {
        errors.push('رقم الهاتف مطلوب');
      }
    }
    
    if (!checkoutData.items || checkoutData.items.length === 0) {
      errors.push('يجب أن يحتوي الطلب على منتج واحد على الأقل');
    }
    
    if (this.hasPhysicalItems(checkoutData.items)) {
      if (!checkoutData.shippingAddress) {
        errors.push('عنوان الشحن مطلوب للمنتجات المادية');
      } else {
        if (!checkoutData.shippingAddress.street) {
          errors.push('عنوان الشارع مطلوب');
        }
        if (!checkoutData.shippingAddress.city) {
          errors.push('المدينة مطلوبة');
        }
        if (!checkoutData.shippingAddress.country) {
          errors.push('الدولة مطلوبة');
        }
      }
      
      if (!checkoutData.shippingMethod) {
        errors.push('طريقة الشحن مطلوبة للمنتجات المادية');
      }
    }
    
    if (!checkoutData.paymentMethod) {
      errors.push('طريقة الدفع مطلوبة');
    }
    
    return errors;
  }

  /**
   * الحصول على طرق الدفع المتاحة
   */
  getAvailablePaymentMethods() {
    return this.paymentService.getAvailablePaymentMethods();
  }

  /**
   * الحصول على طرق الشحن المتاحة
   */
  getAvailableShippingMethods(country, orderTotal) {
    return this.shippingService.getAvailableShippingMethods(country, orderTotal);
  }

  /**
   * إلغاء الطلب
   */
  async cancelOrder(orderId, reason = '') {
    try {
      const result = await this.orderService.cancelOrder(orderId, reason);
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, `order-cancellation:${orderId}`);
    }
  }

  /**
   * تحديث حالة الطلب
   */
  async updateOrderStatus(orderId, newStatus, notes = '') {
    try {
      const result = await this.orderService.updateOrderStatus(orderId, newStatus, notes);
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, `order-status-update:${orderId}`);
    }
  }

  /**
   * الحصول على تفاصيل الطلب
   */
  async getOrderDetails(orderId) {
    try {
      const order = await this.orderService.getOrderById(orderId);
      return order;
    } catch (error) {
      throw errorHandler.handleError(error, `order-details:${orderId}`);
    }
  }

  /**
   * الحصول على طلبات العميل
   */
  async getCustomerOrders(customerId, status = null) {
    try {
      const orders = await this.orderService.getCustomerOrders(customerId, status);
      return orders;
    } catch (error) {
      throw errorHandler.handleError(error, `customer-orders:${customerId}`);
    }
  }

  /**
   * إضافة منتج إلى الطلب
   */
  async addItemToOrder(orderId, itemData) {
    try {
      const result = await this.orderService.addItemToOrder(orderId, itemData);
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, `add-item-to-order:${orderId}`);
    }
  }

  /**
   * إزالة منتج من الطلب
   */
  async removeItemFromOrder(orderId, itemId) {
    try {
      const result = await this.orderService.removeItemFromOrder(orderId, itemId);
      return result;
    } catch (error) {
      throw errorHandler.handleError(error, `remove-item-from-order:${orderId}`);
    }
  }

  /**
   * إعادة حساب إجمالي الطلب
   */
  async recalculateOrderTotal(orderId) {
    try {
      const total = await this.orderService.recalculateOrderTotal(orderId);
      return total;
    } catch (error) {
      throw errorHandler.handleError(error, `recalculate-order-total:${orderId}`);
    }
  }

  /**
   * الحصول على إحصائيات الطلبات
   */
  async getOrderStats(customerId = null) {
    try {
      const stats = await this.orderService.getOrderStats(customerId);
      return stats;
    } catch (error) {
      throw errorHandler.handleError(error, 'order-stats');
    }
  }

  /**
   * الحصول على إحصائيات المدفوعات
   */
  async getPaymentStats(customerId = null) {
    try {
      const stats = await this.paymentService.getPaymentStats(customerId);
      return stats;
    } catch (error) {
      throw errorHandler.handleError(error, 'payment-stats');
    }
  }

  /**
   * الحصول على إحصائيات الشحن
   */
  async getShippingStats() {
    try {
      const stats = await this.shippingService.getShippingStats();
      return stats;
    } catch (error) {
      throw errorHandler.handleError(error, 'shipping-stats');
    }
  }

  /**
   * معالجة الدفع عبر طرق الدفع المتقدمة
   */
  async processAdvancedPayment(orderId, paymentMethod, paymentDetails) {
    try {
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `advanced-payment:${orderId}`
        );
      }

      let paymentResult;

      // معالجة الدفع حسب الطريقة
      switch (paymentMethod) {
        case 'tabby':
          paymentResult = await this.paymentService.processTabbyPayment(order, paymentDetails);
          break;
        case 'tamara':
          paymentResult = await this.paymentService.processTamaraPayment(order, paymentDetails);
          break;
        case 'stc_pay':
          paymentResult = await this.paymentService.processSTCPayPayment(order, paymentDetails);
          break;
        case 'urway':
          paymentResult = await this.paymentService.processUrwayPayment(order, paymentDetails);
          break;
        default:
          throw errorHandler.createError(
            'VALIDATION',
            'payment/unsupported-method',
            'طريقة الدفع غير مدعومة',
            `advanced-payment:${orderId}`
          );
      }

      if (paymentResult.success) {
        // تحديث حالة الطلب
        await this.orderService.updateOrderStatus(orderId, 'confirmed');
        await this.orderService.updatePaymentStatus(orderId, 'completed');

        // إنشاء سجل الدفع
        const payment = await this.paymentService.createPayment({
          orderId,
          amount: order.total,
          method: paymentMethod,
          status: 'completed',
          transactionId: paymentResult.transactionId,
          gateway: paymentMethod,
          details: paymentDetails,
          metadata: paymentResult
        });

        return {
          success: true,
          payment,
          order,
          message: paymentResult.message
        };
      }

      return paymentResult;
    } catch (error) {
      throw errorHandler.handleError(error, `advanced-payment:${orderId}`);
    }
  }

  /**
   * حساب رسوم الدفع الإضافية
   */
  calculatePaymentFees(orderTotal, paymentMethod) {
    try {
      const fees = this.paymentService.calculatePaymentFees(orderTotal, paymentMethod);
      return fees;
    } catch (error) {
      console.error('Error calculating payment fees:', error);
      return 0;
    }
  }

  /**
   * التحقق من توفر طريقة الدفع
   */
  async isPaymentMethodAvailable(paymentMethodId) {
    try {
      return await this.paymentService.isPaymentMethodAvailable(paymentMethodId);
    } catch (error) {
      console.error('Error checking payment method availability:', error);
      return false;
    }
  }

  /**
   * الحصول على طرق الدفع المتاحة مع الرسوم
   */
  async getAvailablePaymentMethodsWithFees(orderTotal) {
    try {
      const methods = await this.paymentService.getAvailablePaymentMethods();
      
      return methods.map(method => ({
        ...method,
        fees: this.paymentService.calculatePaymentFees(orderTotal, method.id),
        totalWithFees: orderTotal + this.paymentService.calculatePaymentFees(orderTotal, method.id)
      }));
    } catch (error) {
      throw errorHandler.handleError(error, 'payment-methods-with-fees');
    }
  }

  /**
   * إنشاء رابط دفع للطرق التي تتطلب ذلك
   */
  async createPaymentLink(orderId, paymentMethod, paymentDetails) {
    try {
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        throw errorHandler.createError(
          'NOT_FOUND',
          'order/not-found',
          'الطلب غير موجود',
          `payment-link:${orderId}`
        );
      }

      // إنشاء رابط دفع حسب الطريقة
      switch (paymentMethod) {
        case 'tabby':
          return await this.createTabbyPaymentLink(order, paymentDetails);
        case 'tamara':
          return await this.createTamaraPaymentLink(order, paymentDetails);
        case 'stc_pay':
          return await this.createSTCPayPaymentLink(order, paymentDetails);
        case 'urway':
          return await this.createUrwayPaymentLink(order, paymentDetails);
        default:
          throw errorHandler.createError(
            'VALIDATION',
            'payment/unsupported-method',
            'طريقة الدفع غير مدعومة',
            `payment-link:${orderId}`
          );
      }
    } catch (error) {
      throw errorHandler.handleError(error, `payment-link:${orderId}`);
    }
  }

  /**
   * إنشاء رابط دفع Tabby
   */
  async createTabbyPaymentLink(order, paymentDetails) {
    try {
      // محاكاة إنشاء رابط دفع Tabby
      const paymentLink = {
        url: `https://tabby.ai/pay/${order.id}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // ينتهي بعد 24 ساعة
        installmentPlan: paymentDetails.installmentPlan || 4,
        monthlyPayment: order.total / (paymentDetails.installmentPlan || 4)
      };

      return paymentLink;
    } catch (error) {
      throw errorHandler.handleError(error, 'tabby-payment-link');
    }
  }

  /**
   * إنشاء رابط دفع Tamara
   */
  async createTamaraPaymentLink(order, paymentDetails) {
    try {
      // محاكاة إنشاء رابط دفع Tamara
      const paymentLink = {
        url: `https://tamara.co/pay/${order.id}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // ينتهي بعد 24 ساعة
        installmentPlan: paymentDetails.installmentPlan || 3,
        monthlyPayment: order.total / (paymentDetails.installmentPlan || 3)
      };

      return paymentLink;
    } catch (error) {
      throw errorHandler.handleError(error, 'tamara-payment-link');
    }
  }

  /**
   * إنشاء رابط دفع STC Pay
   */
  async createSTCPayPaymentLink(order, paymentDetails) {
    try {
      // محاكاة إنشاء رابط دفع STC Pay
      const paymentLink = {
        url: `https://stcpay.com.sa/pay/${order.id}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // ينتهي بعد 24 ساعة
        qrCode: `data:image/png;base64,${btoa(`STC_PAY_${order.id}`)}`
      };

      return paymentLink;
    } catch (error) {
      throw errorHandler.handleError(error, 'stc-pay-payment-link');
    }
  }

  /**
   * إنشاء رابط دفع Urway
   */
  async createUrwayPaymentLink(order, paymentDetails) {
    try {
      // محاكاة إنشاء رابط دفع Urway
      const paymentLink = {
        url: `https://urway.com/pay/${order.id}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // ينتهي بعد 24 ساعة
        sessionId: `urway_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      return paymentLink;
    } catch (error) {
      throw errorHandler.handleError(error, 'urway-payment-link');
    }
  }
}

export default new CheckoutService();

