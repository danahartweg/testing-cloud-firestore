import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { Collections } from '@test-helpers/constants';
import {
  generateId,
  generateSecurityRecordAny,
  generateUserId,
  membershipPath,
} from '@test-helpers/documents';
import { setup, teardown } from '@test-helpers/firestore';
import { Firestore } from '@test-helpers/types';

const COLLECTION = Collections.Homesteads;
const DOC_ID_1 = generateId();
const DOC_ID_2 = generateId();
const USER_ID = generateUserId();

describe('/homesteads/read', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID, {
        [membershipPath(COLLECTION, DOC_ID_1, USER_ID)]:
          generateSecurityRecordAny(),
        [membershipPath(COLLECTION, DOC_ID_2, generateUserId())]:
          generateSecurityRecordAny(),
      });
    });

    afterAll(teardown);

    test('disallow without a membership record', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID_2);

      await assertFails(collection.get());
      return assertFails(document.get());
    });

    test(`disallow on records that don't exist`, async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(generateId());

      await assertFails(collection.get());
      return assertFails(document.get());
    });

    test('allow with a membership record', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID_1);

      await assertFails(collection.get());
      return assertSucceeds(document.get());
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(teardown);

    test('disallow', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID_1);

      await assertFails(collection.get());
      return assertFails(document.get());
    });
  });
});
