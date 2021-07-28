import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
  initializeTestApp,
  withFunctionTriggersDisabled,
} from '@firebase/rules-unit-testing';
import { apps as adminApps } from 'firebase-admin';

import { Firestore } from './types';

function getProjectId(): string {
  return <string>process.env.FIREBASE_PROJECT_ID ?? '';
}

async function potentiallyWrapOperation(
  operation: () => Promise<unknown>
): Promise<unknown> {
  if (getProjectId() === 'demo-test-rules') return operation();
  return withFunctionTriggersDisabled(() => operation());
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

  await potentiallyWrapOperation(() => batch.commit());
  return db;
}

export async function teardown(): Promise<unknown> {
  await potentiallyWrapOperation(() =>
    clearFirestoreData({ projectId: getProjectId() })
  );

  const appsToClean = [...apps(), ...adminApps];
  return Promise.all(appsToClean.map((app) => app?.delete()));
}
