import Dexie, { Table } from "dexie";

export interface Translation {
    id?: number;
    text: string;
    translation: string;
    createdAt: number;
    updatedAt: number;
    synced: number; // 0 = not synced, 1 = synced
}

export class TranslationsDB extends Dexie {
    translations!: Table<Translation, number>;

    constructor() {
        super("TranslationsDB");
        this.version(2).stores({
            translations: "++id, text, updatedAt, synced"
        });
    }
}

export const db = new TranslationsDB();