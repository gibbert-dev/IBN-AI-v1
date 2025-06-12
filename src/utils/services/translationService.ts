
import { 
  addLocalTranslation, 
  addToSyncQueue,
  getLocalTranslations
} from "../indexedDbService";
import { 
  saveTranslation as saveToSupabase,
  getTranslations as getSupabaseTranslations
} from "../databaseUtils";
import { LocalTranslation } from "../indexedDbService";
import { Translation } from "../databaseUtils";
import { checkOnlineStatus } from "./networkService";
import { syncLocalWithRemote } from "./syncQueueService";
import { supabase } from '@/integrations/supabase/client';

// Find duplicate translations locally
export const findLocalDuplicate = async (english: string, ibono: string): Promise<LocalTranslation | null> => {
  try {
    const localTranslations = await getLocalTranslations();
    
    // Check for exact match (both English and Ibọnọ)
    const exactMatch = localTranslations.find(t => 
      t.english.trim().toLowerCase() === english.trim().toLowerCase() && 
      t.ibono.trim().toLowerCase() === ibono.trim().toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // If no exact match, check for matching English text only
    const englishMatch = localTranslations.find(t => 
      t.english.trim().toLowerCase() === english.trim().toLowerCase()
    );
    
    return englishMatch || null;
  } catch (error) {
    console.error('Error checking for local duplicates:', error);
    return null;
  }
};

// Save a translation (to Supabase if online, or locally if offline)
export const saveTranslation = async (english: string, ibono: string, context?: string): Promise<{
  data: Translation | LocalTranslation | null; 
  isDuplicate: boolean; 
  existingTranslation: Translation | LocalTranslation | null;
}> => {
  const trimmedEnglish = english.trim();
  const trimmedIbono = ibono.trim();
  const trimmedContext = context?.trim() || undefined;

  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to save translations");
    }

    if (checkOnlineStatus()) {
      // Try saving to Supabase
      console.log('Saving to Supabase');
      const result = await saveToSupabase(trimmedEnglish, trimmedIbono, trimmedContext);
      
      if (!result.isDuplicate && result.data) {
        // Also save to local database for offline access
        await addLocalTranslation({
          id: result.data.id,
          english: trimmedEnglish,
          ibono: trimmedIbono,
          context: trimmedContext,
          created_at: result.data.created_at,
          user_id: result.data.user_id,
          is_synced: true,
          sync_status: 'synced'
        });
      }
      
      return result;
    } else {
      // Offline mode - save locally
      console.log('Saving locally (offline mode)');
      
      // Check for duplicates in local database
      const existingLocal = await findLocalDuplicate(trimmedEnglish, trimmedIbono);
      
      if (existingLocal) {
        console.log('Found local duplicate:', existingLocal);
        return { 
          data: null, 
          isDuplicate: true, 
          existingTranslation: existingLocal
        };
      }
      
      // Save to local database
      const newLocal: LocalTranslation = {
        english: trimmedEnglish,
        ibono: trimmedIbono,
        context: trimmedContext,
        created_at: new Date().toISOString(),
        user_id: user.id,
        is_synced: false,
        sync_status: 'pending'
      };
      
      const savedLocal = await addLocalTranslation(newLocal);
      
      // Add to sync queue for later syncing
      await addToSyncQueue({
        operation: 'create',
        data: savedLocal
      });
      
      return { 
        data: savedLocal, 
        isDuplicate: false, 
        existingTranslation: null 
      };
    }
  } catch (error) {
    console.error('Error saving translation:', error);
    throw error;
  }
};

// Get all translations (from Supabase if online, or locally if offline)
export const getTranslations = async (): Promise<(Translation | LocalTranslation)[]> => {
  try {
    if (checkOnlineStatus()) {
      // Try getting from Supabase
      console.log('Fetching translations from Supabase');
      const remoteTranslations = await getSupabaseTranslations();
      
      // Update local database with remote translations
      await syncLocalWithRemote(remoteTranslations);
      
      return remoteTranslations;
    } else {
      // Offline mode - get from local database
      console.log('Fetching translations locally (offline mode)');
      const localTranslations = await getLocalTranslations();
      return localTranslations;
    }
  } catch (error) {
    console.error('Error getting translations:', error);
    
    // If there's an error with Supabase, fall back to local data
    console.log('Falling back to local translations');
    const localTranslations = await getLocalTranslations();
    return localTranslations;
  }
};
