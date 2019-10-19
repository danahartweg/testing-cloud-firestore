import * as uuid from 'uuid/v4';

type Collections =
  | 'catchAlls'
  | 'homesteads'
  | 'users';

export enum COLLECTIONS {
  CATCH_ALL = 'catchAlls',
  HOMESTEADS = 'homesteads',
  USERS = 'users',
}

export function generateMockDocument(data: Object = {}): Object {
  return { name: 'document name', ...data };
}

export function generateMockUpdateDocument(data: Object = {}): Object {
  return { name: 'updated document name', ...data };
}

export function generateMockDocumentWithHomesteadId(homesteadId: string) {
  return generateMockDocument({ homesteadId });
}

export function generateMockUpdateDocumentWithHomesteadId(homesteadId: string) {
  return generateMockUpdateDocument({ homesteadId });
}

export function generateSecurityRecordAny(): Object {
  return { role: 'any' };
}

export function generateSecurityRecordOwner(): Object {
  return { role: 'owner' };
}

export function documentPath(...parts: string[]): string {
  return parts.join('/');
}

export function membershipPath(
  collection: Collections,
  recordId: string,
  userId: string
): string {
  return documentPath(collection, recordId, 'members', userId);
}

export function generateId({
  append = '',
  prepend = '',
}: {
  append?: string;
  prepend?: string;
} = {}): string {
  let id = uuid();

  if (prepend) {
    id = `${prepend}-${id}`;
  }

  if (append) {
    id += `-${append}`;
  }

  return id;
}

export function generateUserId(): string {
  return generateId({ prepend: 'USER' });
}
