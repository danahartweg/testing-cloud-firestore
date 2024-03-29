import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { Collections } from '@test-helpers/constants';
import {
  documentPath,
  generateId,
  generateMockDocument,
  generateMockUpdateDocument,
  generateSecurityRecordAny,
  generateSecurityRecordOwner,
  generateUserId,
  membershipPath,
} from '@test-helpers/documents';
import { setup, teardown } from '@test-helpers/firestore';
import { Firestore } from '@test-helpers/types';

const COLLECTION = Collections.Homesteads;
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

    afterAll(teardown);

    test('disallow without an owner membership role', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID_2);
      return assertFails(document.update(generateMockUpdateDocument()));
    });

    test('disallow without an existing record', () => {
      const document = db.collection(COLLECTION).doc(generateId());
      return assertFails(document.update(generateMockUpdateDocument()));
    });

    test('disallow without a membership record', () => {
      const document = db.collection(COLLECTION).doc(generateId());
      return assertFails(document.update(generateMockUpdateDocument()));
    });

    test('allow with an owner membership role', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID_1);
      return assertSucceeds(document.update(generateMockUpdateDocument()));
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(teardown);

    test('disallow', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID_1);
      return assertFails(document.update(generateMockUpdateDocument()));
    });
  });
});
