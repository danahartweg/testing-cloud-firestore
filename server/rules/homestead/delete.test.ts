import { assertFails } from '@firebase/rules-unit-testing';
import { Firestore } from '@test-helpers/types';

import {
  COLLECTIONS,
  generateId,
  generateSecurityRecordOwner,
  generateUserId,
  membershipPath,
} from '../../test-helpers/constants';
import { setup, teardown } from '../../test-helpers/firestore-helpers';

const COLLECTION = COLLECTIONS.HOMESTEADS;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/homesteads/delete', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID, {
        [membershipPath(COLLECTION, DOC_ID, USER_ID)]:
          generateSecurityRecordOwner(),
      });
    });

    afterAll(teardown);

    test('disallow', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.delete());
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(teardown);

    test('disallow', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.delete());
    });
  });
});
