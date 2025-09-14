// إعداد متغيرات البيئة لـ Firebase
process.env.VITE_FIREBASE_API_KEY = 'fake';
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'localhost';
process.env.VITE_FIREBASE_PROJECT_ID = 'demo-test';
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'demo-test.appspot.com';
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = '1234567890';
process.env.VITE_FIREBASE_APP_ID = '1:1234567890:web:test';
process.env.VITE_FIREBASE_MEASUREMENT_ID = 'G-TEST';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

const { default: OrderService } = await import('./src/lib/services/OrderService.js');
const { default: firebaseApi } = await import('./src/lib/firebaseApi.js');

(async () => {
  try {
    // إنشاء منتج بكمية محدودة
    const product = await firebaseApi.addToCollection('books', {
      title: 'Test Book',
      price: 10,
      stock: 1,
      type: 'physical'
    });

    const baseOrder = {
      customerId: 'cust1',
      customerEmail: 'test@example.com',
      customerPhone: '0000000000',
      customerName: 'Test User',
      items: [{
        id: product.id,
        productId: product.id,
        title: 'Test Book',
        quantity: 1,
        unitPrice: 10,
        price: 10,
        productType: 'physical'
      }],
      shippingAddress: { street: '123 St' },
      shippingMethod: 'pickup',
      subtotal: 10,
      shippingCost: 0,
      taxAmount: 0,
      total: 10,
      totalAmount: 10,
      currency: 'SAR',
      status: 'pending',
      paymentStatus: 'pending'
    };

    // محاولتان متزامنتان لشراء نفس المنتج
    const [first, second] = await Promise.allSettled([
      OrderService.createOrder(baseOrder),
      OrderService.createOrder(baseOrder)
    ]);

    const finalProduct = await firebaseApi.getDocById('books', product.id);
    const orders = await firebaseApi.getCollection('orders');

    console.log('First order status:', first.status);
    console.log('Second order status:', second.status);
    console.log('Remaining stock:', finalProduct.stock);
    console.log('Orders count:', orders.length);

    if (finalProduct.stock === 0 && orders.length === 1 && first.status === 'fulfilled' && second.status === 'rejected') {
      console.log('✅ Overselling prevented');
    } else {
      console.error('❌ Overselling not prevented');
      process.exit(1);
    }
  } catch (err) {
    console.error('Test failed with error', err);
    process.exit(1);
  }
})();
