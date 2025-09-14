import { initializeTestApp, assertSucceeds } from 'firebase-testing';

describe('Firebase emulator integration', () => {
  test('writes and reads from firestore emulator', async () => {
    const app = initializeTestApp({ projectId: 'demo-test' });
    const db = app.firestore();
    const ref = db.collection('integration').doc('test');
    await assertSucceeds(ref.set({ foo: 'bar' }));
    const snap = await ref.get();
    expect(snap.data()).toEqual({ foo: 'bar' });
  });
});
