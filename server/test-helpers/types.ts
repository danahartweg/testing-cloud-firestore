import { firestore } from '@firebase/rules-unit-testing';

export type DocumentReference = typeof firestore.DocumentReference.prototype;
export type Firestore = typeof firestore.Firestore.prototype;
