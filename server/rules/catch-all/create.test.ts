import { assertFails } from '@firebase/rules-unit-testing';
import { Firestore } from '@test-helpers/types';

import {
  COLLECTIONS,
  generateMockDocument,
  generateId,
  generateUserId,
} from '../../test-helpers/constants';
import { setup, teardown } from '../../test-helpers/firestore-helpers';

const COLLECTION = COLLECTIONS.CATCH_ALL;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/catchAlls/create', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID);
    });

    afterAll(() => teardown());

    test('disallow', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      await assertFails(document.set(generateMockDocument()));
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(() => teardown());

    test('disallow', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      await assertFails(document.set(generateMockDocument()));
    });
  });
});
