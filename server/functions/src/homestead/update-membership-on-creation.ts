import { firestore } from 'firebase-functions';

import { FieldValue, getFirestore } from '../admin';

/**
 * When a new homestead is created we want to automatically set the owner access document for that homestead.
 * Additionally, we want to set the reverse relationship on the user document.
 */
export const updateMembershipOnHomesteadCreation = firestore
  .document('homesteads/{homesteadId}')
  .onCreate(async (homesteadSnapshot, context) => {
    const db = getFirestore();

    let ownerId: string;
    const homesteadId = context.params.homesteadId;

    if (context.auth && context.auth.uid) {
      ownerId = context.auth.uid;
      console.log('Auth information now present in context.');
    } else {
      ownerId = homesteadSnapshot.get('owner');
    }

    const userRef = db.doc(`users/${ownerId}`);
    const homesteadMembershipBatch = db.batch();

    homesteadMembershipBatch.update(userRef, {
      [`homesteads.${homesteadId}`]: homesteadSnapshot.get('name'),
      ownedHomestead: homesteadId,
    });

    const userDocument = await userRef.get();
    const memberRef = db
      .collection('homesteads')
      .doc(homesteadId)
      .collection('members')
      .doc(ownerId);

    homesteadMembershipBatch.set(memberRef, {
      displayName: userDocument.get('displayName'),
      role: 'owner',
    });

    // @TODO this can be removed when the auth context starts to be passed
    homesteadMembershipBatch.update(homesteadSnapshot.ref, {
      owner: FieldValue.delete(),
    });

    return homesteadMembershipBatch.commit();
  });
