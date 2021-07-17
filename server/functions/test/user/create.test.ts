import { auth, initializeApp } from 'firebase-admin';

import { waitForCloudFunctionExecution } from '@helpers/wait';
import { AdminFirestore } from '@test-helpers/types';
import { Collections } from '@test-helpers/constants';
import { getAdminApp, setup, teardown } from '@test-helpers/firestore';

describe('create', () => {
  const email = 'test@email.com';
  const displayName = 'Test User';

  let db: AdminFirestore;

  beforeAll(async () => {
    await setup();

    initializeApp();
    await auth().createUser({ displayName, email });
    await auth().createUser({});

    db = getAdminApp().firestore();

    return waitForCloudFunctionExecution();
  });

  afterAll(teardown);

  test('creates a user record with supplied data', async () => {
    const userDocuments = await db
      .collection(Collections.Users)
      .where('displayName', '==', displayName)
      .get();
    const [newUserDocument] = userDocuments.docs;

    expect(newUserDocument.data()).toEqual({
      displayName,
      email,
      homesteads: {},
    });
  });

  test('creates a user record with fallback data', async () => {
    const userDocuments = await db
      .collection(Collections.Users)
      .where('displayName', '==', '')
      .get();
    const [newUserDocument] = userDocuments.docs;

    expect(newUserDocument.data()).toEqual({
      displayName: '',
      email: '',
      homesteads: {},
    });
  });
});
