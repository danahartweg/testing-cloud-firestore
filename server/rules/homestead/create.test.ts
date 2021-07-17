import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { Firestore } from '@test-helpers/types';

import {
  COLLECTIONS,
  documentPath,
  generateMockDocument,
  generateMockUpdateDocument,
  generateId,
  generateUserId,
} from '../../test-helpers/constants';
import {
  getAdminApp,
  setup,
  teardown,
} from '../../test-helpers/firestore-helpers';

const COLLECTION = COLLECTIONS.HOMESTEADS;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/homesteads/create', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID, {
        [documentPath(COLLECTIONS.USERS, USER_ID)]: generateMockDocument(),
      });
    });

    afterAll(teardown);

    test('disallow if a homestead has already been created', async () => {
      const adminDb = getAdminApp().firestore();
      await adminDb
        .collection(COLLECTIONS.USERS)
        .doc(USER_ID)
        .update({ ownedHomestead: generateId() });

      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.set(generateMockUpdateDocument()));
    });

    test('allow if a homestead has not already been created', async () => {
      const adminDb = getAdminApp().firestore();
      await adminDb
        .collection(COLLECTIONS.USERS)
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
