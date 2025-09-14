const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Status synchronization
const statusSync = require('./statusSync');
exports.syncPaymentStatus = statusSync.syncPaymentStatus;
exports.syncShippingStatus = statusSync.syncShippingStatus;

// ===== PAYMENT FUNCTIONS =====

// Stripe Payment Intent
exports.createStripePaymentIntent = functions.https.onCall(async (data, context) => {
  try {
    const stripe = require('stripe')(functions.config().stripe.secret_key);
    
    const { amount, currency = 'SAR', metadata = {} } = data;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        userId: context.auth?.uid || 'anonymous'
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// PayPal Order Creation
exports.createPayPalOrder = functions.https.onCall(async (data, context) => {
  try {
    const paypal = require('@paypal/checkout-server-sdk');
    
    const { amount, currency = 'SAR' } = data;
    
    const environment = new paypal.core.SandboxEnvironment(
      functions.config().paypal.client_id,
      functions.config().paypal.client_secret
    );
    
    const client = new paypal.core.PayPalHttpClient(environment);
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        }
      }]
    });

    const response = await client.execute(request);
    
    return {
      success: true,
      orderId: response.result.id,
      orderData: response.result
    };
  } catch (error) {
    console.error('PayPal Order Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ORDER PROCESSING =====

// Process Order
exports.processOrder = functions.https.onCall(async (data, context) => {
  try {
    const { orderData, paymentData } = data;
    
    // Create order document
    const orderRef = await db.collection('orders').add({
      ...orderData,
      userId: context.auth?.uid || null,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Process payment
    if (paymentData) {
      await db.collection('payments').add({
        orderId: orderRef.id,
        ...paymentData,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Update inventory
    if (orderData.items) {
      for (const item of orderData.items) {
        if (item.type === 'physical') {
          await db.collection('books').doc(item.id).update({
            stock: admin.firestore.FieldValue.increment(-item.quantity)
          });
        }
      }
    }

    return {
      success: true,
      orderId: orderRef.id
    };
  } catch (error) {
    console.error('Order Processing Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== SHIPPING CALCULATION =====

// Calculate Shipping Cost
exports.calculateShipping = functions.https.onCall(async (data, context) => {
  try {
    const { items, shippingAddress, shippingMethod } = data;
    
    // Calculate total weight for physical books
    let totalWeight = 0;
    for (const item of items) {
      if (item.type === 'physical') {
        totalWeight += (item.weight || 0.5) * item.quantity;
      }
    }

    // Get shipping rates from settings
    const settingsDoc = await db.collection('settings').doc('main').get();
    const settings = settingsDoc.data() || {};
    const shippingRates = settings.shippingRates || {};

    // Calculate cost based on method
    let shippingCost = 0;
    if (shippingMethod === 'standard') {
      shippingCost = shippingRates.standard?.baseCost || 15;
      shippingCost += (totalWeight * (shippingRates.standard?.costPerKg || 5));
    } else if (shippingMethod === 'express') {
      shippingCost = shippingRates.express?.baseCost || 30;
      shippingCost += (totalWeight * (shippingRates.express?.costPerKg || 10));
    }

    return {
      success: true,
      shippingCost: Math.round(shippingCost * 100) / 100,
      totalWeight,
      estimatedDays: shippingMethod === 'express' ? 1 : 3
    };
  } catch (error) {
    console.error('Shipping Calculation Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== INVENTORY MANAGEMENT =====

// Update Stock
exports.updateStock = functions.https.onCall(async (data, context) => {
  try {
    const { productId, quantity, operation = 'decrease' } = data;
    
    const productRef = db.collection('books').doc(productId);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Product not found');
    }

    const currentStock = productDoc.data().stock || 0;
    const newStock = operation === 'decrease' 
      ? Math.max(0, currentStock - quantity)
      : currentStock + quantity;

    await productRef.update({
      stock: newStock,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      newStock,
      previousStock: currentStock
    };
  } catch (error) {
    console.error('Stock Update Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== ANALYTICS =====

// Get Dashboard Stats
exports.getDashboardStats = functions.https.onCall(async (data, context) => {
  try {
    const [booksSnap, ordersSnap, usersSnap, paymentsSnap] = await Promise.all([
      db.collection('books').get(),
      db.collection('orders').get(),
      db.collection('users').get(),
      db.collection('payments').get()
    ]);

    let totalRevenue = 0;
    paymentsSnap.forEach(doc => {
      const payment = doc.data();
      if (payment.status === 'completed' && payment.amount) {
        totalRevenue += payment.amount;
      }
    });

    return {
      success: true,
      stats: {
        totalBooks: booksSnap.size,
        totalOrders: ordersSnap.size,
        totalUsers: usersSnap.size,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      }
    };
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== EMAIL NOTIFICATIONS =====

// Send Order Confirmation
exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    try {
      const order = snap.data();
      
      // Send email notification
      // This would integrate with your email service (SendGrid, etc.)
      console.log('Order created:', context.params.orderId, order);
      
      return null;
    } catch (error) {
      console.error('Order Confirmation Error:', error);
      return null;
    }
  });

// ===== BACKUP AND MAINTENANCE =====

// Daily Backup
exports.dailyBackup = functions.pubsub
  .schedule('0 2 * * *') // Run at 2 AM daily
  .timeZone('Asia/Riyadh')
  .onRun(async (context) => {
    try {
      // Create backup of important collections
      const collections = ['books', 'orders', 'users', 'settings'];
      
      for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName).get();
        const backupData = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
        
        // Store backup in a separate collection
        await db.collection('backups').doc(`${collectionName}_${Date.now()}`).set({
          collection: collectionName,
          data: backupData,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      console.log('Daily backup completed');
      return null;
    } catch (error) {
      console.error('Backup Error:', error);
      return null;
    }
  });

// ===== SECURITY RULES HELPERS =====

// Validate User Access
exports.validateUserAccess = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { resource, action } = data;
    const userId = context.auth.uid;
    
    // Check user role and permissions
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    // Implement your permission logic here
    const hasAccess = userData.role === 'admin' || userData.role === 'manager';
    
    return {
      success: true,
      hasAccess,
      userRole: userData.role
    };
  } catch (error) {
    console.error('Access Validation Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
