import { assertFails } from '@firebase/rules-unit-testing';

import {
  COLLECTIONS,
  generateId,
  generateUserId,
  generateMockUpdateDocument,
} from '../../test-helpers/constants';
import { setup, teardown } from '../../test-helpers/firestore-helpers';
import type { Firestore } from '../../test-helpers/types';

const COLLECTION = COLLECTIONS.CATCH_ALL;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/catchAlls/update', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID);
    });

    afterAll(() => teardown());

    test('disallow', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      await assertFails(document.update(generateMockUpdateDocument()));
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(() => teardown());

    test('disallow', async () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      await assertFails(document.update(generateMockUpdateDocument()));
    });
  });
});
