// Payment API Integration
// This file handles all payment method connections and processing

class PaymentAPI {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.molhemoon.com';
    this.apiKey = import.meta.env.VITE_PAYMENT_API_KEY;
  }

  // Test method to verify API is working
  async testConnection() {
    try {
      console.log('Payment API initialized successfully');
      console.log('Base URL:', this.baseUrl);
      return { success: true, message: 'Payment API is ready' };
    } catch (error) {
      console.error('Payment API test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment API Error:', error);
      throw error;
    }
  }

  // Connect payment method to merchant account
  async connectPaymentMethod(method, credentials) {
    const endpoints = {
      visa: '/payments/connect/visa',
      mastercard: '/payments/connect/mastercard',
      amex: '/payments/connect/amex',
      paypal: '/payments/connect/paypal',
      applePay: '/payments/connect/apple-pay',
      googlePay: '/payments/connect/google-pay',
      mada: '/payments/connect/mada',
      stcPay: '/payments/connect/stc-pay',
      bankTransfer: '/payments/connect/bank-transfer',
      bitcoin: '/payments/connect/bitcoin',
      ethereum: '/payments/connect/ethereum'
    };

    const endpoint = endpoints[method];
    if (!endpoint) {
      throw new Error(`Unsupported payment method: ${method}`);
    }

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        credentials,
        testMode: credentials.testMode || false
      })
    });
  }

  // Disconnect payment method
  async disconnectPaymentMethod(method) {
    return this.makeRequest(`/payments/disconnect/${method}`, {
      method: 'DELETE'
    });
  }

  // Test payment method connection
  async testPaymentMethod(method) {
    return this.makeRequest(`/payments/test/${method}`, {
      method: 'POST'
    });
  }

  // Process payment
  async processPayment(paymentData) {
    return this.makeRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // Get payment status
  async getPaymentStatus(paymentId) {
    return this.makeRequest(`/payments/status/${paymentId}`);
  }

  // Refund payment
  async refundPayment(paymentId, amount, reason) {
    return this.makeRequest(`/payments/refund/${paymentId}`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason })
    });
  }

  // Link buyer account to payment methods
  async linkBuyerAccount(buyerId, paymentMethods) {
    return this.makeRequest('/buyers/link-payment-methods', {
      method: 'POST',
      body: JSON.stringify({
        buyerId,
        paymentMethods
      })
    });
  }

  // Get buyer's saved payment methods
  async getBuyerPaymentMethods(buyerId) {
    return this.makeRequest(`/buyers/${buyerId}/payment-methods`);
  }

  // Save buyer's payment method
  async saveBuyerPaymentMethod(buyerId, paymentMethod) {
    return this.makeRequest(`/buyers/${buyerId}/payment-methods`, {
      method: 'POST',
      body: JSON.stringify(paymentMethod)
    });
  }

  // Remove buyer's payment method
  async removeBuyerPaymentMethod(buyerId, paymentMethodId) {
    return this.makeRequest(`/buyers/${buyerId}/payment-methods/${paymentMethodId}`, {
      method: 'DELETE'
    });
  }

  // Get payment analytics
  async getPaymentAnalytics(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.makeRequest(`/payments/analytics?${queryParams}`);
  }

  // Get supported currencies
  async getSupportedCurrencies() {
    return this.makeRequest('/payments/currencies');
  }

  // Get exchange rates
  async getExchangeRates(baseCurrency = 'SAR') {
    return this.makeRequest(`/payments/exchange-rates?base=${baseCurrency}`);
  }

  // Validate payment credentials
  async validateCredentials(method, credentials) {
    return this.makeRequest(`/payments/validate/${method}`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // Get payment method requirements
  async getPaymentMethodRequirements(method) {
    return this.makeRequest(`/payments/requirements/${method}`);
  }

  // Update payment settings
  async updatePaymentSettings(settings) {
    return this.makeRequest('/payments/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Get payment settings
  async getPaymentSettings() {
    return this.makeRequest('/payments/settings');
  }

  // Webhook handlers for payment notifications
  async handlePaymentWebhook(webhookData) {
    return this.makeRequest('/payments/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhookData)
    });
  }

  // Create payment intent
  async createPaymentIntent(orderData) {
    return this.makeRequest('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Confirm payment
  async confirmPayment(paymentIntentId, paymentMethodId) {
    return this.makeRequest(`/payments/confirm/${paymentIntentId}`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId })
    });
  }

  // Cancel payment
  async cancelPayment(paymentIntentId) {
    return this.makeRequest(`/payments/cancel/${paymentIntentId}`, {
      method: 'POST'
    });
  }

  // Get payment history
  async getPaymentHistory(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.makeRequest(`/payments/history?${queryParams}`);
  }

  // Export payment data
  async exportPaymentData(format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams({ format, ...filters });
    return this.makeRequest(`/payments/export?${queryParams}`);
  }
}

// Payment method specific configurations
export const paymentMethodConfigs = {
  visa: {
    name: 'Visa',
    icon: '💳',
    requires: ['apiKey', 'secretKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '2-3 business days'
  },
  mastercard: {
    name: 'Mastercard',
    icon: '💳',
    requires: ['apiKey', 'secretKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '2-3 business days'
  },
  amex: {
    name: 'American Express',
    icon: '💳',
    requires: ['apiKey', 'secretKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '3-5 business days'
  },
  paypal: {
    name: 'PayPal',
    icon: '🅿️',
    requires: ['clientId', 'secret'],
    testMode: true,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '1-2 business days'
  },
  applePay: {
    name: 'Apple Pay',
    icon: '🍎',
    requires: ['merchantId', 'certificate'],
    testMode: true,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '1-2 business days'
  },
  googlePay: {
    name: 'Google Pay',
    icon: '📱',
    requires: ['merchantId', 'apiKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '1-2 business days'
  },
  mada: {
    name: 'مدى',
    icon: '💳',
    requires: ['merchantId', 'apiKey'],
    testMode: true,
    supportedCurrencies: ['SAR'],
    processingTime: '1-2 business days'
  },
  stcPay: {
    name: 'STC Pay',
    icon: '📱',
    requires: ['merchantId', 'apiKey'],
    testMode: true,
    supportedCurrencies: ['SAR'],
    processingTime: '1-2 business days'
  },
  bankTransfer: {
    name: 'تحويل بنكي',
    icon: '🏦',
    requires: ['accountNumber', 'bankName'],
    testMode: false,
    supportedCurrencies: ['SAR', 'USD', 'EUR', 'AED'],
    processingTime: '3-5 business days'
  },
  cashOnDelivery: {
    name: 'الدفع عند الاستلام',
    icon: '💵',
    requires: [],
    testMode: false,
    supportedCurrencies: ['SAR', 'AED'],
    processingTime: 'Upon delivery'
  },
  bitcoin: {
    name: 'Bitcoin',
    icon: '₿',
    requires: ['walletAddress'],
    testMode: true,
    supportedCurrencies: ['BTC'],
    processingTime: '10-30 minutes'
  },
  ethereum: {
    name: 'Ethereum',
    icon: 'Ξ',
    requires: ['walletAddress'],
    testMode: true,
    supportedCurrencies: ['ETH'],
    processingTime: '2-5 minutes'
  },
  tabby: {
    name: 'تابي',
    icon: '🛒',
    requires: ['apiKey', 'secretKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    processingTime: 'Installment payments (3-12 months)'
  },
  tamara: {
    name: 'تمارا',
    icon: '💳',
    requires: ['apiKey', 'secretKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    processingTime: 'Installment payments (3-12 months)'
  },
  qitaf: {
    name: 'قطف',
    icon: '💳',
    requires: ['merchantId', 'apiKey'],
    testMode: true,
    supportedCurrencies: ['SAR', 'KWD'],
    processingTime: '1-2 business days'
  },
  fawry: {
    name: 'فوري',
    icon: '🏪',
    requires: ['merchantCode', 'secureKey'],
    testMode: true,
    supportedCurrencies: ['EGP', 'SAR', 'AED'],
    processingTime: '1-2 business days'
  },
  payfort: {
    name: 'PayFort',
    icon: '💳',
    requires: ['accessCode', 'merchantIdentifier', 'shaRequestPhrase', 'shaResponsePhrase'],
    testMode: true,
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    processingTime: '1-2 business days'
  },
  myfatoorah: {
    name: 'ماي فاتورة',
    icon: '📄',
    requires: ['apiKey'],
    testMode: true,
    supportedCurrencies: ['IQD', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    processingTime: '1-2 business days'
  }
};

// Payment processing utilities
export const paymentUtils = {
  // Format amount for display
  formatAmount(amount, currency = 'SAR') {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Calculate tax
  calculateTax(amount, taxRate) {
    return (amount * taxRate) / 100;
  },

  // Calculate total with tax
  calculateTotal(amount, taxRate) {
    const tax = this.calculateTax(amount, taxRate);
    return amount + tax;
  },

  // Validate payment method
  validatePaymentMethod(method, credentials) {
    const config = paymentMethodConfigs[method];
    if (!config) {
      return { valid: false, error: 'Unsupported payment method' };
    }

    for (const required of config.requires) {
      if (!credentials[required]) {
        return { valid: false, error: `Missing required field: ${required}` };
      }
    }

    return { valid: true };
  },

  // Generate payment reference
  generatePaymentReference() {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Mask sensitive data
  maskSensitiveData(data, fields = ['apiKey', 'secretKey', 'secret', 'password']) {
    const masked = { ...data };
    fields.forEach(field => {
      if (masked[field]) {
        masked[field] = '*'.repeat(masked[field].length);
      }
    });
    return masked;
  }
};

// Export the main API class
export default new PaymentAPI(); 