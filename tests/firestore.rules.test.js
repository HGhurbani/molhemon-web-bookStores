import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import fs from 'fs';

const projectId = 'demo-test-project';
const rules = fs.readFileSync('firestore.rules', 'utf8');

const testEnv = await initializeTestEnvironment({
  projectId,
  firestore: { rules }
});

// Seed users with roles
await testEnv.withSecurityRulesDisabled(async (context) => {
  const db = context.firestore();
  await db.collection('users').doc('user1').set({ role: 'user' });
  await db.collection('users').doc('user2').set({ role: 'user' });
  await db.collection('users').doc('manager').set({ role: 'manager' });
});

const user1 = testEnv.authenticatedContext('user1');
const user2 = testEnv.authenticatedContext('user2');
const manager = testEnv.authenticatedContext('manager');

// Orders tests
const orderRef = user1.firestore().collection('orders').doc('order1');
await assertSucceeds(orderRef.set({ userId: 'user1' }));
await assertFails(user2.firestore().collection('orders').doc('order1').get());

// Payments tests
const paymentRef = user1.firestore().collection('payments').doc('pay1');
await assertSucceeds(paymentRef.set({ userId: 'user1', amount: 20 }));
await assertFails(user2.firestore().collection('payments').doc('pay1').get());
await assertSucceeds(manager.firestore().collection('payments').doc('pay1').get());
await assertSucceeds(manager.firestore().collection('payments').doc('pay1').delete());

// Users tests
await assertSucceeds(user1.firestore().collection('users').doc('user1').get());
await assertFails(user2.firestore().collection('users').doc('user1').get());
await assertSucceeds(manager.firestore().collection('users').doc('user1').delete());

console.log('Firestore security rules tests passed');
await testEnv.cleanup();
