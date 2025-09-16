import { jest } from '@jest/globals';
import { waitFor } from '@testing-library/react';

const mockFirestore = {
  books: new Map(),
  orders: new Map(),
  payments: new Map(),
  order_items: new Map(),
  order_notes: new Map(),
  shipping: new Map()
};

const stubDocument = {
  nodeType: 9,
  defaultView: null,
  querySelector: () => null,
  querySelectorAll: () => []
};
const stubBody = {
  nodeType: 1,
  ownerDocument: stubDocument,
  querySelector: () => null,
  querySelectorAll: () => []
};
stubDocument.body = stubBody;
globalThis.document = stubDocument;
globalThis.window = { document: stubDocument };
stubDocument.defaultView = globalThis.window;
globalThis.MutationObserver = class {
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
};
globalThis.window.MutationObserver = globalThis.MutationObserver;

const waitForContainer = stubBody;

let idCounter = 0;
const generateId = (prefix) => `${prefix}_${(++idCounter).toString(36)}`;
const clone = (value) => JSON.parse(JSON.stringify(value));
const resetMockFirestore = () => {
  Object.values(mockFirestore).forEach((collection) => collection.clear());
  idCounter = 0;
};

jest.unstable_mockModule('../src/lib/logger.js', () => ({
  default: {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

jest.unstable_mockModule('../src/lib/services/ProductService.js', () => {
  class MockProductService {
    constructor() {
      this.collectionName = 'books';
    }

    async createProduct(productData) {
      const id = productData.id || generateId('product');
      const product = {
        ...productData,
        id,
        type: productData.type || 'ebook',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFirestore.books.set(id, product);
      return clone(product);
    }

    async getProductById(productId) {
      const product = mockFirestore.books.get(productId);
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }
      return clone(product);
    }

    async checkStockAvailability(productId, quantity) {
      const product = mockFirestore.books.get(productId);
      const availableStock = product?.stock ?? 0;
      return { available: availableStock >= quantity, availableStock };
    }

    async updateStock(productId, quantity, operation = 'decrease') {
      const product = mockFirestore.books.get(productId);
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }
      const delta = operation === 'increase' ? quantity : -quantity;
      const updated = {
        ...product,
        stock: (product.stock ?? 0) + delta,
        updatedAt: new Date().toISOString()
      };
      mockFirestore.books.set(productId, updated);
      return { success: true, stock: updated.stock };
    }
  }

  return {
    ProductService: MockProductService,
    default: new MockProductService()
  };
});

jest.unstable_mockModule('../src/lib/services/OrderService.js', () => {
  class MockOrderService {
    constructor() {
      this.collectionName = 'orders';
    }

    async createOrder(orderData) {
      const id = generateId('order');
      const order = {
        ...orderData,
        id,
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        total: orderData.total ?? orderData.totalAmount ?? 0,
        totalAmount: orderData.totalAmount ?? orderData.total ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFirestore.orders.set(id, order);

      const orderItems = (orderData.items || []).map((item) => {
        const itemId = generateId('order_item');
        const normalizedItem = {
          ...item,
          id: itemId,
          orderId: id,
          productId: item.productId || item.id,
          title: item.title || item.name,
          unitPrice: item.unitPrice ?? item.price ?? 0,
          quantity: item.quantity ?? 1
        };
        const totalPrice = normalizedItem.unitPrice * normalizedItem.quantity;
        const itemDoc = {
          ...normalizedItem,
          totalPrice,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockFirestore.order_items.set(itemId, itemDoc);
        return clone(itemDoc);
      });

      return {
        order: clone(order),
        items: orderItems,
        shipping: null
      };
    }

    async getOrderById(orderId) {
      const order = mockFirestore.orders.get(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      const items = Array.from(mockFirestore.order_items.values())
        .filter((item) => item.orderId === orderId)
        .map(clone);

      return {
        order: clone(order),
        items,
        shipping: null,
        payment: null
      };
    }

    async updateOrderStatus(orderId, newStatus) {
      const order = mockFirestore.orders.get(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      const updated = {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      mockFirestore.orders.set(orderId, updated);
      return clone(updated);
    }
  }

  return {
    OrderService: MockOrderService,
    default: new MockOrderService()
  };
});

jest.unstable_mockModule('../src/lib/services/PaymentService.js', () => {
  class MockPaymentService {
    constructor() {
      this.collectionName = 'payments';
    }

    async createPayment(paymentData) {
      const id = generateId('payment');
      const payment = {
        ...paymentData,
        id,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFirestore.payments.set(id, payment);
      return clone(payment);
    }

    async processPayment(paymentId, paymentMethod, paymentDetails) {
      const payment = mockFirestore.payments.get(paymentId);
      if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
      }
      const transactionId = `txn_${paymentId}`;
      const updated = {
        ...payment,
        paymentStatus: 'completed',
        transactionId,
        gatewayResponse: {
          status: 'succeeded',
          provider: paymentMethod,
          details: paymentDetails
        },
        updatedAt: new Date().toISOString()
      };
      mockFirestore.payments.set(paymentId, updated);
      return {
        success: true,
        status: 'succeeded',
        id: transactionId,
        gatewayResponse: clone(updated.gatewayResponse)
      };
    }

    async updatePaymentStatus(paymentId, newStatus, additionalData = {}) {
      const payment = mockFirestore.payments.get(paymentId);
      if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
      }
      const updated = {
        ...payment,
        paymentStatus: newStatus,
        ...additionalData,
        updatedAt: new Date().toISOString()
      };
      mockFirestore.payments.set(paymentId, updated);
      return clone(updated);
    }

    async getPaymentById(paymentId) {
      const payment = mockFirestore.payments.get(paymentId);
      if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
      }
      return clone(payment);
    }

    async processCashOnDeliveryPayment(paymentData) {
      const id = paymentData.id || generateId('payment');
      const payment = {
        ...paymentData,
        id,
        paymentStatus: 'pending'
      };
      mockFirestore.payments.set(id, payment);
      return {
        success: true,
        status: 'pending',
        id
      };
    }
  }

  return {
    PaymentService: MockPaymentService,
    default: new MockPaymentService()
  };
});

jest.unstable_mockModule('../src/lib/services/ShippingService.js', () => {
  class MockShippingService {
    async createShipping(shippingData) {
      const id = generateId('shipping');
      const shipping = {
        ...shippingData,
        id,
        shippingCost: 0,
        createdAt: new Date().toISOString()
      };
      mockFirestore.shipping.set(id, shipping);
      return clone(shipping);
    }

    async calculateShippingCost() {
      return { cost: 0, currency: 'SAR', details: { mode: 'digital' } };
    }

    async getAvailableShippingMethods() {
      return [];
    }
  }

  return {
    ShippingService: MockShippingService,
    default: new MockShippingService()
  };
});

const checkoutModule = await import('../src/lib/services/CheckoutService.js');
const productModule = await import('../src/lib/services/ProductService.js');
const orderModule = await import('../src/lib/services/OrderService.js');
const paymentModule = await import('../src/lib/services/PaymentService.js');

const checkoutService = checkoutModule.default;
const productService = productModule.default;
const orderService = orderModule.default;
const paymentService = paymentModule.default;

describe('checkout flow e2e', () => {
  beforeEach(() => {
    resetMockFirestore();
  });

  test('creates an order and completes payment updating firestore state', async () => {
    const product = await productService.createProduct({
      title: 'E2E Testing Book',
      author: 'QA Engineer',
      price: 75,
      stock: 10,
      type: 'ebook'
    });

    const checkoutData = {
      customerId: 'customer_1',
      customerInfo: {
        name: 'Layla Tester',
        email: 'layla@example.com',
        phone: '+966500000000'
      },
      items: [
        {
          id: product.id,
          productId: product.id,
          productType: 'ebook',
          title: product.title,
          price: product.price,
          unitPrice: product.price,
          quantity: 1,
          type: 'digital'
        }
      ],
      shippingAddress: {
        street: 'Digital Way 1',
        city: 'Riyadh',
        country: 'SA'
      },
      shippingMethod: 'digital',
      paymentMethod: 'credit_card',
      paymentDetails: {
        cardNumber: '4242424242424242'
      },
      notes: 'E2E checkout flow test'
    };

    const result = await checkoutService.createOrderWithCheckout(checkoutData);

    expect(result.order).toBeDefined();
    expect(result.payment).toBeDefined();
    expect(result.items).toHaveLength(1);
    expect(result.paymentResult).toEqual(expect.objectContaining({ success: true }));

    const orderId = result.order.id;
    const paymentId = result.payment.id;

    await waitFor(() => {
      const storedOrder = mockFirestore.orders.get(orderId);
      const storedPayment = mockFirestore.payments.get(paymentId);

      expect(storedOrder).toBeDefined();
      expect(storedPayment).toBeDefined();
      expect(storedOrder.status).toBe('confirmed');
      expect(storedPayment.paymentStatus).toBe('completed');
    }, { container: waitForContainer });

    const orderSnapshot = await orderService.getOrderById(orderId);
    expect(orderSnapshot.order.customerName).toBe(checkoutData.customerInfo.name);
    expect(orderSnapshot.items[0].productId).toBe(product.id);

    const paymentSnapshot = await paymentService.getPaymentById(paymentId);
    expect(paymentSnapshot.amount).toBeGreaterThan(0);
    expect(paymentSnapshot.transactionId).toBeDefined();
  });
});
