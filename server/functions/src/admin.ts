import { app, firestore, initializeApp } from 'firebase-admin';

type AdminApp = app.App;
type Firestore = firestore.Firestore;

let cachedAdmin: AdminApp;
export const FieldValue = firestore.FieldValue;

export function init(overrideApp?: AdminApp): void {
  if (cachedAdmin) {
    return;
  }

  cachedAdmin = overrideApp ?? initializeApp();
}

export function getAdmin(): AdminApp {
  return cachedAdmin;
}

export function getFirestore(): Firestore {
  return cachedAdmin.firestore();
}
