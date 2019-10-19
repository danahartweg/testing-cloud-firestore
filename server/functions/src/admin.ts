import * as admin from 'firebase-admin';

let cachedAdmin: admin.app.App;

export function init(overrideApp?: admin.app.App) {
  if (cachedAdmin) {
    return;
  }

  cachedAdmin = overrideApp || admin.initializeApp();
}

export function getAdmin() {
  return cachedAdmin;
}

export function getFirestore() {
  return cachedAdmin.firestore();
}

export const FieldValue = admin.firestore.FieldValue;
