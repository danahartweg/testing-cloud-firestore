import * as firebase from '@firebase/testing';

export type Firestore = firebase.firestore.Firestore;
export type DocumentReference = firebase.firestore.DocumentReference;

let testIncrement = 0;
let useRealProjectId = false;
const projectIdBase = `firestore-emulator-${Date.now()}`;

function adjustTestIncrement() {
  testIncrement += 1;
}

function getProjectId() {
  return `${projectIdBase}:${testIncrement}`;
}

function generateProjectId(): string {
  return useRealProjectId ? 'your-project-name' : getProjectId();
}

export function setUseRealProjectId() {
  useRealProjectId = true;
}

export function getAdminApp(): Firestore {
  const adminApp = firebase.initializeAdminApp({
    projectId: generateProjectId(),
  });

  return (adminApp.firestore() as any) as Firestore;
}

export function getAuthedApp(userUid?: string): Firestore {
  const app = firebase.initializeTestApp({
    auth: userUid ? { uid: userUid } : undefined,
    projectId: generateProjectId(),
  });

  return (app.firestore() as any) as Firestore;
}

export async function setup(
  userUid?: string,
  data: any = {}
): Promise<Firestore> {
  adjustTestIncrement();
  const db = getAuthedApp(userUid);

  if (!data || !Object.keys(data).length) {
    return db;
  }

  const adminDb = getAdminApp();
  const batch = adminDb.batch();

  Object.entries(data).forEach(([key, value]) => {
    batch.set(adminDb.doc(key), value as any);
  });

  await batch.commit();
  return db;
}

export async function teardown() {
  useRealProjectId = false;
  return Promise.all(firebase.apps().map(app => app.delete()));
}
