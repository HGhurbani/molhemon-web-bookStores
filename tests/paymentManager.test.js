import { jest } from '@jest/globals';

const createProviderMock = (name) => {
  const initialize = jest.fn().mockResolvedValue({});
  const getProviderInfo = jest.fn().mockReturnValue({
    supportedCurrencies: ['SAR'],
    supportedCountries: ['SA'],
    supportedPaymentMethods: [],
  });
  const Provider = jest.fn().mockImplementation(() => ({
    providerName: name,
    initialize,
    getProviderInfo,
  }));
  return { Provider, initialize };
};

const mockStripe = createProviderMock('stripe');
const mockPaypal = createProviderMock('paypal');
const mockTabby = createProviderMock('tabby');
const mockCod = createProviderMock('cash_on_delivery');

jest.unstable_mockModule('../src/lib/payment/providers/StripeProvider.js', () => ({
  StripeProvider: mockStripe.Provider,
}));
jest.unstable_mockModule('../src/lib/payment/providers/PayPalProvider.js', () => ({
  PayPalProvider: mockPaypal.Provider,
}));
jest.unstable_mockModule('../src/lib/payment/providers/TabbyProvider.js', () => ({
  TabbyProvider: mockTabby.Provider,
}));
jest.unstable_mockModule('../src/lib/payment/providers/CashOnDeliveryProvider.js', () => ({
  CashOnDeliveryProvider: mockCod.Provider,
}));

jest.unstable_mockModule('../src/lib/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn()
  }
}));

let PaymentManager;

beforeAll(async () => {
  ({ PaymentManager } = await import('../src/lib/payment/PaymentManager.js'));
});

describe('PaymentManager provider initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes providers and selects stripe as active provider', async () => {
    const manager = new PaymentManager();
    const settings = {
      stripe: { publishableKey: 'pk', secretKey: 'sk' },
      paypal: { clientId: 'id', clientSecret: 'secret' },
      tabby: { apiKey: 'ak', secretKey: 'sk' },
      cashOnDelivery: { maxAmount: 1000, codFee: 15 },
    };

    await manager.initialize(settings);

    expect(mockStripe.Provider).toHaveBeenCalled();
    expect(mockPaypal.Provider).toHaveBeenCalled();
    expect(mockTabby.Provider).toHaveBeenCalled();
    expect(mockCod.Provider).toHaveBeenCalled();

    expect(mockStripe.initialize).toHaveBeenCalled();
    expect(mockPaypal.initialize).toHaveBeenCalled();
    expect(mockTabby.initialize).toHaveBeenCalled();
    expect(mockCod.initialize).toHaveBeenCalled();

    expect(manager.activeProvider.providerName).toBe('stripe');
  });

  test('selects paypal as active provider when stripe is unavailable', async () => {
    const manager = new PaymentManager();
    const settings = {
      paypal: { clientId: 'id', clientSecret: 'secret' },
      cashOnDelivery: {},
    };

    await manager.initialize(settings);

    expect(mockStripe.Provider).not.toHaveBeenCalled();
    expect(manager.activeProvider.providerName).toBe('paypal');
  });
});

describe('PaymentManager provider resolution by payment intent', () => {
  test('falls back to provider that resolves payment status for unknown id', async () => {
    const manager = new PaymentManager();
    const failingProvider = {
      getPaymentStatus: jest.fn().mockRejectedValue(new Error('not found'))
    };
    const nullProvider = {
      getPaymentStatus: jest.fn().mockResolvedValue(null)
    };
    const successProvider = {
      getPaymentStatus: jest.fn().mockResolvedValue({ id: 'resolved', status: 'succeeded' })
    };

    manager.providers = new Map([
      ['stripe', failingProvider],
      ['paypal', nullProvider],
      ['tabby', successProvider]
    ]);

    const provider = await manager.getProviderFromPaymentIntent('unknown_123');

    expect(failingProvider.getPaymentStatus).toHaveBeenCalledWith('unknown_123');
    expect(nullProvider.getPaymentStatus).toHaveBeenCalledWith('unknown_123');
    expect(successProvider.getPaymentStatus).toHaveBeenCalledWith('unknown_123');

    expect(
      failingProvider.getPaymentStatus.mock.invocationCallOrder[0]
    ).toBeLessThan(nullProvider.getPaymentStatus.mock.invocationCallOrder[0]);
    expect(
      nullProvider.getPaymentStatus.mock.invocationCallOrder[0]
    ).toBeLessThan(successProvider.getPaymentStatus.mock.invocationCallOrder[0]);

    expect(provider).toBe(successProvider);
  });

  test('returns null when providers cannot resolve unknown intent', async () => {
    const manager = new PaymentManager();
    const firstProvider = {
      getPaymentStatus: jest.fn().mockRejectedValue(new Error('not for us'))
    };
    const secondProvider = {
      getPaymentStatus: jest.fn().mockRejectedValue(new Error('still not found'))
    };

    manager.providers = new Map([
      ['stripe', firstProvider],
      ['paypal', secondProvider]
    ]);

    await expect(manager.getProviderFromPaymentIntent('mystery_456')).resolves.toBeNull();

    expect(firstProvider.getPaymentStatus).toHaveBeenCalledWith('mystery_456');
    expect(secondProvider.getPaymentStatus).toHaveBeenCalledWith('mystery_456');
  });
});
