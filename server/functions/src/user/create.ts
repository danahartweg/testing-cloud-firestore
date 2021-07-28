import { auth } from 'firebase-functions';

import { getFirestore } from '../admin';

export const create = auth.user().onCreate(async (userRecord) => {
  const db = getFirestore();

  return db
    .collection('users')
    .doc(userRecord.uid)
    .set({
      displayName: userRecord.displayName ?? '',
      email: userRecord.email ?? '',
      homesteads: {},
    });
});
