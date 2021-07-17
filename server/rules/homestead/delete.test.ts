import { assertFails } from '@firebase/rules-unit-testing';
import { Collections } from '@test-helpers/constants';
import {
  generateId,
  generateUserId,
  generateSecurityRecordOwner,
  membershipPath,
} from '@test-helpers/documents';
import { Firestore } from '@test-helpers/types';

import { setup, teardown } from '../../test-helpers/firestore-helpers';

const COLLECTION = Collections.Homesteads;
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
