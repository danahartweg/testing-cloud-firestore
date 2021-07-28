import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { Collections } from '@test-helpers/constants';
import {
  documentPath,
  generateId,
  generateMockDocument,
  generateMockUpdateDocument,
  generateUserId,
} from '@test-helpers/documents';
import { getAdminApp, setup, teardown } from '@test-helpers/firestore';
import { Firestore } from '@test-helpers/types';

const COLLECTION = Collections.Homesteads;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/homesteads/create', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID, {
        [documentPath(Collections.Users, USER_ID)]: generateMockDocument(),
      });
    });

    afterAll(teardown);

    test('disallow if a homestead has already been created', async () => {
      const adminDb = getAdminApp().firestore();
      await adminDb
        .collection(Collections.Users)
        .doc(USER_ID)
        .update({ ownedHomestead: generateId() });

      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.set(generateMockUpdateDocument()));
    });

    test('allow if a homestead has not already been created', async () => {
      const adminDb = getAdminApp().firestore();
      await adminDb
        .collection(Collections.Users)
        .doc(USER_ID)
        .update({ ownedHomestead: '' });

      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertSucceeds(document.set(generateMockUpdateDocument()));
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(teardown);

    test('disallow', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.set(generateMockUpdateDocument()));
    });
  });
});
