// اختبار إصلاح مشكلة الطلب
console.log('بدء اختبار إصلاح مشكلة الطلب...');

// محاكاة بيانات الطلب
const orderData = {
  customerId: "test-customer-123",
  customerEmail: "test@example.com",
  customerPhone: "1234567890",
  customerName: "يحيى محمد",
  items: [
    {
      productId: "book-1",
      productName: "كتاب تجريبي",
      productType: "physical",
      unitPrice: 50,
      quantity: 1,
      weight: 0.5
    }
  ],
  shippingAddress: {
    firstName: "يحيى",
    lastName: "محمد",
    phone: "122569874",
    street: "شارع الملك فهد",
    city: "الرياض",
    state: "الرياض",
    country: "SA",
    postalCode: "12345"
  },
  shippingMethod: "standard",
  subtotal: 50,
  shippingCost: 10,
  totalAmount: 60
};

console.log('بيانات الطلب:', orderData);

// محاكاة إنشاء الطلب
console.log('1. إنشاء نموذج الطلب...');
const order = {
  id: null,
  customerId: orderData.customerId,
  shippingAddress: orderData.shippingAddress,
  shippingMethod: orderData.shippingMethod,
  items: orderData.items
};

console.log('2. محاكاة حفظ الطلب في Firebase...');
// محاكاة إرجاع معرف من Firebase
const mockOrderDoc = {
  id: "mock-order-id-123",
  ...orderData
};

console.log('3. تعيين معرف الطلب...');
order.id = mockOrderDoc.id;
console.log('معرف الطلب بعد التعيين:', order.id);

console.log('4. التحقق من وجود معرف الطلب...');
if (!order.id) {
  console.log('❌ خطأ: معرف الطلب مفقود');
} else {
  console.log('✅ معرف الطلب موجود:', order.id);
}

console.log('5. إنشاء معلومات الشحن...');
const shippingData = {
  orderId: order.id,
  customerId: order.customerId,
  shippingMethod: order.shippingMethod,
  shippingAddress: {
    ...order.shippingAddress,
    name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
  },
  packageWeight: 0.5,
  packageDimensions: { length: 20, width: 15, height: 2 },
  packageCount: 1
};

console.log('بيانات الشحن:', shippingData);

console.log('6. التحقق من صحة بيانات الشحن...');
const shippingValidationErrors = [];

if (!shippingData.orderId) {
  shippingValidationErrors.push('معرف الطلب مطلوب');
}

if (!shippingData.customerId) {
  shippingValidationErrors.push('معرف العميل مطلوب');
}

if (!shippingData.shippingAddress.name) {
  shippingValidationErrors.push('اسم المستلم مطلوب');
}

if (!shippingData.shippingAddress.phone) {
  shippingValidationErrors.push('رقم الهاتف مطلوب');
}

console.log('أخطاء التحقق من الشحن:', shippingValidationErrors);

if (shippingValidationErrors.length > 0) {
  console.log('❌ فشل التحقق من الشحن:', shippingValidationErrors.join(', '));
} else {
  console.log('✅ نجح التحقق من الشحن');
}

console.log('انتهى اختبار إصلاح مشكلة الطلب');







