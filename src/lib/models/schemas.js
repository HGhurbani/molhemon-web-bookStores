export const OrderItemSchema = {
  type: 'object',
  required: ['productId', 'quantity', 'unitPrice'],
  properties: {
    productId: { type: 'string' },
    productType: { type: 'string' },
    title: { type: 'string' },
    quantity: { type: 'number' },
    unitPrice: { type: 'number' },
    weight: { type: 'number' }
  }
};

export const ShippingSchema = {
  type: 'object',
  required: ['orderId', 'shippingAddress'],
  properties: {
    orderId: { type: 'string' },
    shippingAddress: { type: 'object' },
    shippingMethod: { type: 'string' },
    shippingCost: { type: 'number' },
    currency: { type: 'string' }
  }
};

export const PaymentSchema = {
  type: 'object',
  required: ['orderId', 'amount', 'paymentMethod'],
  properties: {
    orderId: { type: 'string' },
    customerId: { type: 'string' },
    amount: { type: 'number' },
    currency: { type: 'string' },
    paymentMethod: { type: 'string' }
  }
};

export const OrderSchema = {
  type: 'object',
  required: ['customerId', 'items', 'totalAmount', 'currency'],
  properties: {
    customerId: { type: 'string' },
    customerEmail: { type: 'string' },
    customerName: { type: 'string' },
    items: { type: 'array', items: OrderItemSchema },
    subtotal: { type: 'number' },
    shippingCost: { type: 'number' },
    taxAmount: { type: 'number' },
    totalAmount: { type: 'number' },
    currency: { type: 'string' },
    shippingAddress: { type: 'object' },
    shippingMethod: { type: 'string' }
  }
};

export function validateData(data, schema, path = '') {
  const errors = [];
  if (schema.type === 'object') {
    const obj = data || {};
    const required = schema.required || [];
    for (const field of required) {
      if (obj[field] === undefined || obj[field] === null) {
        errors.push(`${path}${field} is required`);
      }
    }
    for (const [key, propSchema] of Object.entries(schema.properties || {})) {
      if (obj[key] !== undefined && obj[key] !== null) {
        errors.push(...validateData(obj[key], propSchema, `${path}${key}.`));
      }
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push(`${path.replace(/\.$/, '')} must be an array`);
    } else {
      data.forEach((item, index) => {
        errors.push(...validateData(item, schema.items, `${path}${index}.`));
      });
    }
  } else {
    if (schema.type && typeof data !== schema.type) {
      errors.push(`${path.replace(/\.$/, '')} must be of type ${schema.type}`);
    }
  }
  return errors;
}

export const Schemas = {
  Order: OrderSchema,
  OrderItem: OrderItemSchema,
  Payment: PaymentSchema,
  Shipping: ShippingSchema
};

if (typeof module !== 'undefined') {
  module.exports = { Schemas, validateData };
}
