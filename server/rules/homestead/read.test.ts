import * as firebase from '@firebase/testing';

import {
  COLLECTIONS,
  generateId,
  generateSecurityRecordAny,
  generateUserId,
  membershipPath,
} from '../../test-helpers/contants';
import {
  Firestore,
  setup,
  teardown,
} from '../../test-helpers/firestore-helpers';

const COLLECTION = COLLECTIONS.HOMESTEADS;
const DOC_ID = generateId();
const USER_ID = generateUserId();

describe('/homesteads/read', () => {
  let db: Firestore;

  describe('authenticated', () => {
    beforeAll(async () => {
      db = await setup(USER_ID, {
        [membershipPath(
          COLLECTION,
          DOC_ID,
          USER_ID
        )]: generateSecurityRecordAny(),
      });
    });

    afterAll(() => teardown());

    test('disallow without a membership record', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(generateId());

      await firebase.assertFails(collection.get());
      await firebase.assertFails(document.get());
    });

    test('allow with a membership record', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID);

      await firebase.assertFails(collection.get());
      await firebase.assertSucceeds(document.get());
    });
  });

  describe('unauthenticated', () => {
    beforeAll(async () => {
      db = await setup();
    });

    afterAll(() => teardown());

    test('disallow', async () => {
      const collection = db.collection(COLLECTION);
      const document = collection.doc(DOC_ID);

      await firebase.assertFails(collection.get());
      await firebase.assertFails(document.get());
    });
  });
});
