import { jest } from '@jest/globals';
import { PaymentService } from '../src/lib/services/PaymentService.js';
import { PAYMENT_METHODS } from '../src/lib/models/Payment.js';
import { paymentManager } from '../src/lib/payment/PaymentManager.js';
import firebaseApi from '../src/lib/firebase/baseApi.js';

jest.mock('../src/lib/payment/PaymentManager.js', () => ({
  paymentManager: {
    createPaymentIntent: jest.fn(),
    confirmPayment: jest.fn()
  }
}));

jest.mock('../src/lib/firebase/baseApi.js', () => ({
  addToCollection: jest.fn(),
  getDocById: jest.fn(),
  updateCollection: jest.fn()
}));

describe('PaymentService real payment flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processPayment succeeds and updates status with gateway result', async () => {
    const service = new PaymentService();
    paymentManager.createPaymentIntent.mockResolvedValue({
      id: 'pi_1',
      status: 'requires_confirmation',
      provider: 'stripe',
      providerInfo: {}
    });
    firebaseApi.addToCollection.mockResolvedValue({ id: 'pay_1' });

    const created = await service.createPayment({
      orderId: 'o1',
      customerId: 'c1',
      amount: 100,
      currency: 'SAR',
      paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
      metadata: { note: 'test' }
    });

    firebaseApi.getDocById.mockResolvedValue(created);
    paymentManager.confirmPayment.mockResolvedValue({ id: 'pi_1', status: 'succeeded' });

    const updateSpy = jest
      .spyOn(service, 'updatePaymentStatus')
      .mockResolvedValue(null);

    await service.processPayment('pay_1', PAYMENT_METHODS.CREDIT_CARD, {});

    expect(paymentManager.confirmPayment).toHaveBeenCalledWith('pi_1', {});
    expect(updateSpy).toHaveBeenCalledWith(
      'pay_1',
      'completed',
      expect.objectContaining({
        transactionId: 'pi_1',
        gatewayResponse: expect.objectContaining({ status: 'succeeded' })
      })
    );
  });

  test('processPayment fails and passes error to updatePaymentStatus', async () => {
    const service = new PaymentService();
    paymentManager.createPaymentIntent.mockResolvedValue({
      id: 'pi_2',
      status: 'requires_confirmation',
      provider: 'stripe',
      providerInfo: {}
    });
    firebaseApi.addToCollection.mockResolvedValue({ id: 'pay_2' });

    const created = await service.createPayment({
      orderId: 'o2',
      customerId: 'c2',
      amount: 50,
      currency: 'SAR',
      paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
      metadata: {}
    });

    firebaseApi.getDocById.mockResolvedValue(created);
    paymentManager.confirmPayment.mockRejectedValue(new Error('declined'));

    const updateSpy = jest
      .spyOn(service, 'updatePaymentStatus')
      .mockResolvedValue(null);

    await expect(
      service.processPayment('pay_2', PAYMENT_METHODS.CREDIT_CARD, {})
    ).rejects.toThrow('declined');

    expect(updateSpy).toHaveBeenCalledWith(
      'pay_2',
      'failed',
      expect.objectContaining({ error: 'declined' })
    );
  });
});
