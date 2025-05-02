import { db, Translation } from "../db/translationsDB";
import { supabase } from "../utils/supabaseClient";

async function syncWithServer(translation: Translation) {
    try {
        const { data, error } = await supabase
            .from('translations')
            .upsert({
                english: translation.text,
                ibono: translation.translation,
                created_at: new Date(translation.createdAt).toISOString(),
                updated_at: new Date(translation.updatedAt).toISOString()
            });

        if (error) {
            console.error("Supabase error details:", {
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            throw error;
        }

        // Mark as synced in local DB
        await db.translations.where('id').equals(translation.id!).modify({ synced: 1 });
        return data;
    } catch (err) {
        console.error("Error syncing translation:", {
            error: err,
            translation: {
                id: translation.id,
                text: translation.text,
                translation: translation.translation
            }
        });
        throw err;
    }
}

export function setupSyncService() {
    // Initial sync on load if online
    if (navigator.onLine) {
        syncPendingTranslations();
    }

    // Listen to online event
    window.addEventListener("online", async () => {
        console.log("Back online. Starting sync...");
        await syncPendingTranslations();
    });

    // Listen to offline event
    window.addEventListener("offline", () => {
        console.log("You are offline. Changes will sync when online.");
    });
}

async function syncPendingTranslations() {
    try {
        // Get all unsynced translations
        const pendingTranslations = await db.translations
            .where('synced')
            .equals(0)
            .toArray();

        console.log(`Found ${pendingTranslations.length} translations to sync`);

        for (const translation of pendingTranslations) {
            try {
                await syncWithServer(translation);
                console.log(`Successfully synced translation ID: ${translation.id}`);
            } catch (err) {
                console.error("Error syncing translation:", {
                    translationId: translation.id,
                    error: err
                });
            }
        }
    } catch (err) {
        console.error("Error in sync process:", err);
    }
}