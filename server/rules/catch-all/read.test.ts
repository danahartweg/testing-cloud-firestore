import { assertFails } from '@firebase/rules-unit-testing';
import { Firestore } from '@test-helpers/types';

import {
  COLLECTIONS,
  generateId,
  generateUserId,
} from '../../test-helpers/constants';
import { setup, teardown } from '../../test-helpers/firestore-helpers';

const COLLECTION = COLLECTIONS.CATCH_ALL;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/catchAlls/read', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID);
    });

    afterAll(teardown);

    test('disallow', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID);

      await assertFails(collection.get());
      return assertFails(document.get());
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(teardown);

    test('disallow', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID);

      await assertFails(collection.get());
      return assertFails(document.get());
    });
  });
});
