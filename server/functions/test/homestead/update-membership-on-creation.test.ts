import { waitForCloudFunctionExecution } from '../../helpers/wait';
import {
  COLLECTIONS,
  documentPath,
  generateUserId,
} from '../../../test-helpers/constants';
import {
  getAdminApp,
  setup,
  setUseRealProjectId,
  teardown,
} from '../../../test-helpers/firestore-helpers';
import type { DocumentReference, Firestore } from '../../../test-helpers/types';

const USER_ID = generateUserId();

describe('updateMembershipOnHomesteadCreation', () => {
  const homesteadName = 'Test Homestead';
  const userName = 'Test User';

  let db: Firestore;
  let homesteadRef: DocumentReference;

  beforeAll(async () => {
    setUseRealProjectId();

    await setup(USER_ID, {
      [documentPath(COLLECTIONS.USERS, USER_ID)]: {
        displayName: userName,
      },
    });

    db = getAdminApp();

    homesteadRef = await db
      .collection(COLLECTIONS.HOMESTEADS)
      .add({ name: homesteadName, owner: USER_ID });

    return waitForCloudFunctionExecution();
  });

  afterAll(() => teardown());

  test('updates the user with the homestead name', async () => {
    const userDocument = await db
      .collection(COLLECTIONS.USERS)
      .doc(USER_ID)
      .get();

    const homesteads = userDocument.get('homesteads');
    expect(homesteads[homesteadRef.id]).toEqual(homesteadName);
  });

  test('sets the current user as the homestead owner', async () => {
    const membershipRecord = await db
      .collection(COLLECTIONS.HOMESTEADS)
      .doc(homesteadRef.id)
      .collection('members')
      .doc(USER_ID)
      .get();

    expect(membershipRecord.data()).toEqual({
      displayName: userName,
      role: 'owner',
    });
  });

  test('removes the temporary owner field', async () => {
    const homesteadDoc = await homesteadRef.get();
    expect(homesteadDoc.get('owner')).toBeUndefined();
  });
});
