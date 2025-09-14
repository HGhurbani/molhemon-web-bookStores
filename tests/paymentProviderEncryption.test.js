import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/lib/logger.js', () => ({
  default: { debug: jest.fn(), info: jest.fn(), error: jest.fn() }
}));

const { PaymentProvider } = await import('../src/lib/payment/providers/PaymentProvider.js');

describe('PaymentProvider encryption', () => {
  const encryptionKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  test('encrypts and decrypts data correctly', () => {
    const provider = new PaymentProvider({ encryptionKey });
    const data = { secret: 'value', number: 123 };
    const encrypted = provider.encryptSensitiveData(data);
    expect(encrypted).not.toEqual(JSON.stringify(data));
    const decrypted = provider.decryptSensitiveData(encrypted);
    expect(decrypted).toEqual(data);
  });
});
