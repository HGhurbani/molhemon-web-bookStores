import { jest } from '@jest/globals';

// Mock Firebase core module to avoid requiring environment configuration
jest.mock('../src/lib/firebase.js', () => ({
  __esModule: true,
  db: {},
  auth: {},
  storage: {},
  default: {}
}));

const importCatalogMock = jest.fn();

const mockFirebaseFunctionsApi = {
  payments: {
    createStripeIntent: jest.fn(),
    createPayPalOrder: jest.fn()
  },
  orders: {
    process: jest.fn()
  },
  shipping: {
    calculate: jest.fn()
  },
  inventory: {
    updateStock: jest.fn()
  },
  analytics: {
    getDashboardStats: jest.fn()
  },
  security: {
    validateAccess: jest.fn()
  },
  googleMerchant: {
    importCatalog: importCatalogMock
  }
};

jest.mock('../src/lib/firebaseFunctions.js', () => ({
  __esModule: true,
  default: mockFirebaseFunctionsApi,
  firebaseFunctionsApi: mockFirebaseFunctionsApi,
  importGoogleMerchantCatalog: importCatalogMock
}));

import api from '../src/lib/api.js';

describe('api.importGoogleMerchant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    importCatalogMock.mockReset();
  });

  test('returns the result when the Cloud Function succeeds', async () => {
    const payload = { success: true, importedCount: 3, preview: [] };
    importCatalogMock.mockResolvedValue(payload);

    const config = { googleMerchantId: '123', googleApiKey: 'secret' };
    const result = await api.importGoogleMerchant(config);

    expect(importCatalogMock).toHaveBeenCalledWith(config);
    expect(result).toEqual(payload);
  });

  test('throws a handled error when the Cloud Function reports failure', async () => {
    importCatalogMock.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
      errorCode: 'google-merchant/invalid-credentials'
    });

    await expect(
      api.importGoogleMerchant({ googleMerchantId: '123', googleApiKey: 'bad' })
    ).rejects.toEqual(expect.objectContaining({
      code: 'google-merchant/invalid-credentials',
      context: 'google-merchant:import',
      message: 'Invalid credentials'
    }));
  });

  test('wraps thrown errors from the Cloud Function', async () => {
    importCatalogMock.mockRejectedValue(new Error('network failed'));

    await expect(
      api.importGoogleMerchant({ googleMerchantId: '123', googleApiKey: 'secret' })
    ).rejects.toEqual(expect.objectContaining({
      context: 'google-merchant:import',
      message: 'network failed'
    }));
  });
});
