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

const stripe = createProviderMock('stripe');
const paypal = createProviderMock('paypal');
const tabby = createProviderMock('tabby');
const cod = createProviderMock('cash_on_delivery');

jest.mock('../src/lib/payment/providers/StripeProvider.js', () => ({
  StripeProvider: stripe.Provider,
}));
jest.mock('../src/lib/payment/providers/PayPalProvider.js', () => ({
  PayPalProvider: paypal.Provider,
}));
jest.mock('../src/lib/payment/providers/TabbyProvider.js', () => ({
  TabbyProvider: tabby.Provider,
}));
jest.mock('../src/lib/payment/providers/CashOnDeliveryProvider.js', () => ({
  CashOnDeliveryProvider: cod.Provider,
}));

import { PaymentManager } from '../src/lib/payment/PaymentManager.js';

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

    expect(stripe.Provider).toHaveBeenCalled();
    expect(paypal.Provider).toHaveBeenCalled();
    expect(tabby.Provider).toHaveBeenCalled();
    expect(cod.Provider).toHaveBeenCalled();

    expect(stripe.initialize).toHaveBeenCalled();
    expect(paypal.initialize).toHaveBeenCalled();
    expect(tabby.initialize).toHaveBeenCalled();
    expect(cod.initialize).toHaveBeenCalled();

    expect(manager.activeProvider.providerName).toBe('stripe');
  });

  test('selects paypal as active provider when stripe is unavailable', async () => {
    const manager = new PaymentManager();
    const settings = {
      paypal: { clientId: 'id', clientSecret: 'secret' },
      cashOnDelivery: {},
    };

    await manager.initialize(settings);

    expect(stripe.Provider).not.toHaveBeenCalled();
    expect(manager.activeProvider.providerName).toBe('paypal');
  });
});
