import { waitForCloudFunctionExecution } from '@helpers/wait';
import { AdminFirestore, DocumentReference } from '@test-helpers/types';
import { Collections } from '@test-helpers/constants';
import { documentPath, generateUserId } from '@test-helpers/documents';
import {
  getAdminApp,
  setup,
  setUseRealProjectId,
  teardown,
} from '@test-helpers/firestore';

const USER_ID = generateUserId();

describe('updateMembershipOnHomesteadCreation', () => {
  const homesteadName = 'Test Homestead';
  const userName = 'Test User';

  let db: AdminFirestore;
  let homesteadRef: DocumentReference;

  beforeAll(async () => {
    setUseRealProjectId();

    await setup(USER_ID, {
      [documentPath(Collections.Users, USER_ID)]: {
        displayName: userName,
      },
    });

    db = getAdminApp().firestore();

    homesteadRef = await db
      .collection(Collections.Homesteads)
      .add({ name: homesteadName, owner: USER_ID });

    return waitForCloudFunctionExecution();
  });

  afterAll(teardown);

  test('updates the user with the homestead name', async () => {
    const userDocument = await db
      .collection(Collections.Users)
      .doc(USER_ID)
      .get();

    const homesteads = userDocument.get('homesteads');
    expect(homesteads[homesteadRef.id]).toEqual(homesteadName);
  });

  test('sets the current user as the homestead owner', async () => {
    const membershipRecord = await db
      .collection(Collections.Homesteads)
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
