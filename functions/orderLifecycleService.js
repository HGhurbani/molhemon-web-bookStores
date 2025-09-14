const functions = require('firebase-functions');
const admin = require('firebase-admin');

// reuse initialized admin app from index.js or initialize if not already
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

const db = admin.firestore();

// Handle payment provider webhooks
const handlePaymentWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      res.status(400).send('Missing orderId or status');
      return;
    }

    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.update({
      status,
      stageHistory: admin.firestore.FieldValue.arrayUnion({
        stage: `payment_${status}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send('ok');
  } catch (error) {
    console.error('Payment webhook error', error);
    await db.collection('notifications').add({
      type: 'payment',
      message: error.message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(500).send('error');
  }
});

// Handle shipping provider webhooks
const handleShipmentWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      res.status(400).send('Missing orderId or status');
      return;
    }

    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.update({
      shippingStatus: status,
      stageHistory: admin.firestore.FieldValue.arrayUnion({
        stage: `shipping_${status}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (status === 'delivered') {
      await orderRef.update({
        status: 'completed',
        stageHistory: admin.firestore.FieldValue.arrayUnion({
          stage: 'completed',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).send('ok');
  } catch (error) {
    console.error('Shipment webhook error', error);
    await db.collection('notifications').add({
      type: 'shipment',
      message: error.message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(500).send('error');
  }
});

// Scheduled function to clean up pending orders
const checkPendingOrders = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Asia/Riyadh')
  .onRun(async () => {
    const expirationTime = Date.now() - 1000 * 60 * 60 * 24; // 24 hours
    const snapshot = await db
      .collection('orders')
      .where('status', '==', 'pending')
      .get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const updatedAt = data.updatedAt ? data.updatedAt.toDate().getTime() : 0;
      if (data.paymentStatus === 'succeeded' && data.shippingStatus === 'delivered') {
        batch.update(doc.ref, {
          status: 'completed',
          stageHistory: admin.firestore.FieldValue.arrayUnion({
            stage: 'completed',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          }),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (updatedAt < expirationTime) {
        batch.update(doc.ref, {
          status: 'expired',
          stageHistory: admin.firestore.FieldValue.arrayUnion({
            stage: 'expired',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          }),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    await batch.commit();
    return null;
  });

module.exports = {
  handlePaymentWebhook,
  handleShipmentWebhook,
  checkPendingOrders,
};
