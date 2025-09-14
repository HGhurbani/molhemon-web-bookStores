import functions from 'firebase-functions';
import admin from 'firebase-admin';

try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

const db = admin.firestore();

export const syncPaymentStatus = functions.firestore.document('payments/{paymentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status !== after.status && after.orderId) {
      try {
        await db.collection('orders').doc(after.orderId).update({
          paymentStatus: after.status,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.error('syncPaymentStatus error:', err);
      }
    }
    return null;
  });

export const syncShippingStatus = functions.firestore.document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.shippingStatus !== after.shippingStatus) {
      try {
        await db.collection('shipping').doc(context.params.orderId).set(
          {
            status: after.shippingStatus,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      } catch (err) {
        console.error('syncShippingStatus error:', err);
      }
    }
    return null;
  });
