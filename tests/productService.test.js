import { ProductService } from '../src/lib/services/ProductService.js';

describe('ProductService', () => {
  test('validateProduct returns errors for missing fields', () => {
    const service = new ProductService();
    const errors = service.validateProduct({});
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validateProduct passes for valid product', () => {
    const service = new ProductService();
    const product = {
      title: 'Test Book',
      authorId: 'a1',
      category: 'fiction',
      price: 10,
      type: 'physical',
      stock: 5
    };
    const errors = service.validateProduct(product);
    expect(errors).toHaveLength(0);
  });
});
