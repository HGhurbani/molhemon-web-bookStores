import { jest } from '@jest/globals';
import { ShippingService } from '../src/lib/services/ShippingService.js';
import firebaseApi from '../src/lib/firebase/baseApi.js';

jest.mock('../src/lib/firebase/baseApi.js', () => ({
  addToCollection: jest.fn(),
}));

describe('ShippingService createShipping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully creates shipping with valid data', async () => {
    firebaseApi.addToCollection.mockResolvedValue({ id: 'ship_1' });
    const service = new ShippingService();
    const shippingData = {
      orderId: 'o1',
      customerId: 'c1',
      shippingMethod: 'standard',
      shippingAddress: {
        name: 'John',
        phone: '1234567890',
        street: 'Main',
        city: 'Riyadh',
        country: 'SA'
      },
      packageWeight: 2
    };
    const result = await service.createShipping(shippingData);
    expect(firebaseApi.addToCollection).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'ship_1');
    expect(result.shippingCost).toBeGreaterThan(0);
  });

  test('fails validation when required fields are missing', async () => {
    const service = new ShippingService();
    await expect(
      service.createShipping({ orderId: 'o2', shippingAddress: {} })
    ).rejects.toEqual(expect.objectContaining({ code: 'validation/shipping-invalid' }));
    expect(firebaseApi.addToCollection).not.toHaveBeenCalled();
  });
});
