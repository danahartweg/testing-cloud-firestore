import {
  apps,
  initializeAdminApp,
  initializeTestApp,
} from '@firebase/rules-unit-testing';
import { apps as adminApps } from 'firebase-admin';

import { Firestore } from './types';

function getProjectId(): string {
  return <string>process.env.FIREBASE_PROJECT_ID ?? '';
}

export function getAdminApp(): ReturnType<typeof initializeAdminApp> {
  const adminApp = initializeAdminApp({
    projectId: getProjectId(),
  });

  return adminApp;
}

export function getAuthedApp(userUid?: string): Firestore {
  const app = initializeTestApp({
    auth: userUid ? { uid: userUid } : undefined,
    projectId: getProjectId(),
  });

  return app.firestore();
}

export async function setup(
  userUid?: string,
  data: Record<string, unknown> = {}
): Promise<Firestore> {
  const db = getAuthedApp(userUid);

  if (!data || !Object.keys(data).length) {
    return db;
  }

  const adminDb = getAdminApp().firestore();
  const batch = adminDb.batch();

  Object.entries(data).forEach(([key, value]) => {
    batch.set(adminDb.doc(key), value as unknown);
  });

  await batch.commit();
  return db;
}

export async function teardown(): Promise<unknown> {
  const appsToClean = [...apps(), ...adminApps];
  return Promise.all(appsToClean.map((app) => app?.delete()));
}
