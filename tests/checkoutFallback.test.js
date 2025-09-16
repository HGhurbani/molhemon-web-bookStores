import { jest } from '@jest/globals';
import { resolveCheckoutFallbackId } from '../src/lib/checkoutFallback.js';

describe('resolveCheckoutFallbackId', () => {
  test('returns provided order id when available', () => {
    const { fallbackId, isTempId } = resolveCheckoutFallbackId({
      id: 'order-123',
      order: { id: 'order-456' }
    });

    expect(fallbackId).toBe('order-456');
    expect(isTempId).toBe(false);
  });

  test('identifies temporary fallback ids and triggers checkout error path', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000);

    const { fallbackId, isTempId } = resolveCheckoutFallbackId({});

    expect(fallbackId).toBe('temp_1700000000000');
    expect(isTempId).toBe(true);

    expect(() => {
      if (fallbackId && !isTempId) {
        return fallbackId;
      }
      throw new Error('فشل في الحصول على معرف الطلب بعد إتمام الشراء');
    }).toThrow('فشل في الحصول على معرف الطلب بعد إتمام الشراء');

    nowSpy.mockRestore();
  });

  test('uses order number fallback when available', () => {
    const { fallbackId, isTempId } = resolveCheckoutFallbackId({ orderNumber: 'ORD-789' });

    expect(fallbackId).toBe('ORD-789');
    expect(isTempId).toBe(false);
  });
});
