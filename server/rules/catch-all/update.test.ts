import { assertFails } from '@firebase/rules-unit-testing';
import { Collections } from '@test-helpers/constants';
import {
  generateId,
  generateMockUpdateDocument,
  generateUserId,
} from '@test-helpers/documents';
import { Firestore } from '@test-helpers/types';

import { setup, teardown } from '../../test-helpers/firestore-helpers';

const COLLECTION = Collections.CatchAll;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/catchAlls/update', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID);
    });

    afterAll(teardown);

    test('disallow', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.update(generateMockUpdateDocument()));
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(teardown);

    test('disallow', () => {
      const document = db.collection(COLLECTION).doc(DOC_ID);
      return assertFails(document.update(generateMockUpdateDocument()));
    });
  });
});
