import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';

describe('Firebase emulator integration', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({ projectId: 'demo-test' });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  test('writes and reads from firestore emulator', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const ref = db.collection('integration').doc('test');
    await assertSucceeds(ref.set({ foo: 'bar' }));
    const snap = await ref.get();
    expect(snap.data()).toEqual({ foo: 'bar' });
  });
});
