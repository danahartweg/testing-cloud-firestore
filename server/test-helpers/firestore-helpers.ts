import {
  apps,
  initializeAdminApp,
  initializeTestApp,
} from '@firebase/rules-unit-testing';

import type { Firestore } from './types';

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
  const adminApp = initializeAdminApp({
    projectId: generateProjectId(),
  });

  return adminApp.firestore();
}

export function getAuthedApp(userUid?: string): Firestore {
  const app = initializeTestApp({
    auth: userUid ? { uid: userUid } : undefined,
    projectId: generateProjectId(),
  });

  return app.firestore();
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
  return Promise.all(apps().map((app) => app.delete()));
}
