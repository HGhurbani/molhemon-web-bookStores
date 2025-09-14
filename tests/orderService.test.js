import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/lib/firebaseApi.js', () => ({
  default: {
    addToCollection: jest.fn(() => Promise.resolve({ id: '1' })),
    serverTimestamp: jest.fn(() => new Date())
  }
}));

const { OrderService } = await import('../src/lib/services/OrderService.js');
const firebaseApi = (await import('../src/lib/firebaseApi.js')).default;

describe('OrderService', () => {
  test('sets shipping cost to 0 for pickup orders', async () => {
    const service = new OrderService();
    const orderData = {
      customerId: 'c1',
      customerEmail: 'test@example.com',
      customerName: 'Test Customer',
      items: [
        { id: 'p1', productId: 'p1', name: 'Book', price: 100, quantity: 1, type: 'physical' }
      ],
      shippingAddress: { street: 'abc' },
      shippingMethod: 'pickup'
    };
    await service.createOrder(orderData);
    expect(firebaseApi.addToCollection).toHaveBeenCalledWith(
      'orders',
      expect.objectContaining({ shippingCost: 0 })
    );
  });
});
