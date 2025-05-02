import Dexie, { Table } from 'dexie';

export interface Translation {
    id?: number;
    text: string;          // maps to english in Supabase
    translation: string;   // maps to ibono in Supabase
    createdAt: number;     // stored as timestamp locally
    updatedAt: number;     // stored as timestamp locally
    synced: number;        // 0 = not synced, 1 = synced
}

export class TranslationsDatabase extends Dexie {
    translations!: Table<Translation>;

    constructor() {
        super('TranslationsDB');
        this.version(1).stores({
            translations: '++id, text, translation, createdAt, updatedAt, synced'
        });
    }
}

export const db = new TranslationsDatabase();