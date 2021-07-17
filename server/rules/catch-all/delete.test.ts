import { assertFails } from '@firebase/rules-unit-testing';
import { Collections } from '@test-helpers/constants';
import { generateId, generateUserId } from '@test-helpers/documents';
import { setup, teardown } from '@test-helpers/firestore';
import { Firestore } from '@test-helpers/types';

const COLLECTION = Collections.CatchAll;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/catchAlls/delete', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID);
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
