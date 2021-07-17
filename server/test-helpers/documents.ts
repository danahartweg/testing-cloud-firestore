import { v4 as uuid } from 'uuid';

import { Collections } from './constants';

type Data = Record<string, unknown>;

export function generateMockDocument(data: Data = {}): Data {
  return { name: 'document name', ...data };
}

export function generateMockUpdateDocument(data: Data = {}): Data {
  return { name: 'updated document name', ...data };
}

export function generateMockDocumentWithHomesteadId(homesteadId: string): Data {
  return generateMockDocument({ homesteadId });
}

export function generateMockUpdateDocumentWithHomesteadId(
  homesteadId: string
): Data {
  return generateMockUpdateDocument({ homesteadId });
}

export function generateSecurityRecordAny(): Data {
  return { role: 'any' };
}

export function generateSecurityRecordOwner(): Data {
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
