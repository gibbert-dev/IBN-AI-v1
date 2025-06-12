
import Dexie, { Table } from 'dexie';

export interface LocalTranslation {
  id?: string; // Changed from number to string to match UUID
  english: string;
  ibono: string;
  context?: string;
  created_at?: string;
  user_id?: string;
  is_synced?: boolean;
  sync_status?: 'pending' | 'syncing' | 'synced' | 'error';
}

export interface SyncQueueItem {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  data: LocalTranslation;
  timestamp: number; // Changed from createdAt to timestamp
}

class IbonoDatabase extends Dexie {
  translations!: Table<LocalTranslation, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('IbonoDatabase');
    this.version(3).stores({
      translations: '++id, english, ibono, is_synced, sync_status',
      syncQueue: '++id, operation, timestamp'
    });
  }
}

const db = new IbonoDatabase();

// Translations Table Operations
export const addLocalTranslation = async (translation: LocalTranslation): Promise<LocalTranslation> => {
  const id = await db.translations.add(translation);
  return { ...translation, id: id.toString() };
};

export const updateLocalTranslation = async (id: string, updates: Partial<LocalTranslation>): Promise<void> => {
  await db.translations.update(id, updates);
};

export const deleteLocalTranslation = async (id: string): Promise<void> => {
  await db.translations.delete(id);
};

export const getLocalTranslationById = async (id: string): Promise<LocalTranslation | undefined> => {
  return await db.translations.get(id);
};

export const getLocalTranslations = async (): Promise<LocalTranslation[]> => {
  return await db.translations.toArray();
};

export const clearLocalTranslations = async (): Promise<void> => {
  await db.translations.clear();
};

// Sync Queue Operations - Fixed function names to match imports
export const addToSyncQueue = async (item: Omit<SyncQueueItem, 'id' | 'timestamp'>): Promise<SyncQueueItem> => {
  const newItem = { ...item, timestamp: Date.now() };
  const id = await db.syncQueue.add(newItem);
  return { ...newItem, id };
};

export const getSyncQueue = async (): Promise<SyncQueueItem[]> => {
  return await db.syncQueue.toArray();
};

export const removeFromSyncQueue = async (id: number): Promise<void> => {
  await db.syncQueue.delete(id);
};

export const getSyncQueueItems = async (): Promise<SyncQueueItem[]> => {
  return await db.syncQueue.toArray();
};

export const deleteSyncQueueItem = async (id: number): Promise<void> => {
  await db.syncQueue.delete(id);
};

export const clearSyncQueue = async (): Promise<void> => {
  await db.syncQueue.clear();
};
