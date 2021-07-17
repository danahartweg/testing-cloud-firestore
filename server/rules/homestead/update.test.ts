import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { Firestore } from '@test-helpers/types';

import {
  COLLECTIONS,
  documentPath,
  generateMockDocument,
  generateMockUpdateDocument,
  generateId,
  generateSecurityRecordAny,
  generateSecurityRecordOwner,
  generateUserId,
  membershipPath,
} from '../../test-helpers/constants';
import { setup, teardown } from '../../test-helpers/firestore-helpers';

const COLLECTION = COLLECTIONS.HOMESTEADS;
const DOC_ID_1 = generateId();
const DOC_ID_2 = generateId();
const USER_ID = generateUserId();

describe('/homesteads/update', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID, {
        [documentPath(COLLECTION, DOC_ID_1)]: generateMockDocument(),
        [documentPath(COLLECTION, DOC_ID_2)]: generateMockDocument(),
        [membershipPath(COLLECTION, DOC_ID_1, USER_ID)]:
          generateSecurityRecordOwner(),
        [membershipPath(COLLECTION, DOC_ID_2, USER_ID)]:
          generateSecurityRecordAny(),
      });
    });

    afterAll(() => teardown());

    test('disallow without an owner membership role', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID_2);
      await assertFails(document.update(generateMockUpdateDocument()));
    });

    test('disallow without an existing record', async () => {
      const document = db.collection(COLLECTION).doc(generateId());
      await assertFails(document.update(generateMockUpdateDocument()));
    });

    test('disallow without a membership record', async () => {
      const document = db.collection(COLLECTION).doc(generateId());
      await assertFails(document.update(generateMockUpdateDocument()));
    });

    test('allow with an owner membership role', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID_1);
      await assertSucceeds(document.update(generateMockUpdateDocument()));
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(() => teardown());

    test('disallow', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID_1);
      await assertFails(document.update(generateMockUpdateDocument()));
    });
  });
});
