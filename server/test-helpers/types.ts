import { firestore } from '@firebase/rules-unit-testing';

export type AdminFirestore = FirebaseFirestore.Firestore;
export type DocumentReference = FirebaseFirestore.DocumentReference;
export type Firestore = typeof firestore.Firestore.prototype;
