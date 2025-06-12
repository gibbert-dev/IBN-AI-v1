import { supabase } from '@/integrations/supabase/client';
import { LocalTranslation } from './indexedDbService';

export interface Translation {
  id: string; // Changed from number to string to match UUID
  english: string;
  ibono: string;
  context?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Table name in Supabase
const TABLE_NAME = "translations";

export const findExistingTranslation = async (english: string, ibono: string): Promise<Translation | null> => {
  try {
    // Check for exact match (both English and Ibọnọ)
    const { data: exactMatch, error: exactError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .ilike('english', english.trim())
      .ilike('ibono', ibono.trim())
      .maybeSingle();
      
    if (exactError && exactError.code !== 'PGRST116') {
      console.error("Error checking for existing translation:", exactError);
      throw exactError;
    }
    
    if (exactMatch) return exactMatch as Translation;

    // If no exact match, check for matching English text only
    const { data: englishMatch, error: englishError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .ilike('english', english.trim())
      .maybeSingle();
      
    if (englishError && englishError.code !== 'PGRST116') {
      console.error("Error checking for existing English translation:", englishError);
      throw englishError;
    }
    
    if (englishMatch) return englishMatch as Translation;
    
    return null;
  } catch (e) {
    console.error("Unexpected error during duplicate check:", e);
    throw e;
  }
};

export const saveTranslation = async (english: string, ibono: string, context?: string): Promise<{ 
  data: Translation | null; 
  isDuplicate: boolean; 
  existingTranslation: Translation | null 
}> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to save translations");
    }

    // Trim inputs to avoid whitespace-only differences
    const trimmedEnglish = english.trim();
    const trimmedIbono = ibono.trim();
    const trimmedContext = context?.trim() || undefined;
    
    // First check if this translation already exists
    const existingTranslation = await findExistingTranslation(trimmedEnglish, trimmedIbono);
    
    if (existingTranslation) {
      console.log("Found duplicate:", existingTranslation);
      return { 
        data: null, 
        isDuplicate: true, 
        existingTranslation 
      };
    }
    
    const newTranslation = {
      english: trimmedEnglish,
      ibono: trimmedIbono,
      context: trimmedContext,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newTranslation])
      .select()
      .single();
      
    if (error) {
      console.error("Error saving translation:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Special handling for unique constraint violation
      if (error.code === '23505') {
        // This is a duplicate that our previous check missed
        const existing = await findExistingTranslation(trimmedEnglish, trimmedIbono);
        return {
          data: null,
          isDuplicate: true,
          existingTranslation: existing
        };
      }
      
      throw error;
    }
    
    return { 
      data: data as Translation, 
      isDuplicate: false, 
      existingTranslation: null 
    };
  } catch (e) {
    console.error("Unexpected error during save:", e);
    throw e;
  }
};

export const updateTranslation = async (id: string, updates: Partial<Pick<Translation, 'context'>>): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id);
      
    if (error) {
      console.error("Error updating translation:", error);
      throw error;
    }
  } catch (e) {
    console.error("Unexpected error during update:", e);
    throw e;
  }
};

export const getTranslations = async (): Promise<Translation[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching translations:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    return data as Translation[];
  } catch (e) {
    console.error("Unexpected error during fetch:", e);
    throw e;
  }
};

export const deleteTranslation = async (id: string): Promise<void> => { // Changed parameter type from number to string
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting translation:", error);
    throw error;
  }
};

export const clearAllTranslations = async (): Promise<void> => {
  // Only allow clearing user's own translations
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to clear translations");
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('user_id', user.id);
    
  if (error) {
    console.error("Error clearing translations:", error);
    throw error;
  }
};

export const exportTranslationsAsJSON = async (): Promise<string> => {
  try {
    const translations = await getTranslations();
    // Ensure the data is serializable
    const cleanData = translations.map(t => ({
      id: t.id,
      english: t.english,
      ibono: t.ibono,
      context: t.context || null,
      created_at: t.created_at || null
    }));
    return JSON.stringify(cleanData, null, 2);
  } catch (error) {
    console.error("Error exporting JSON:", error);
    throw new Error("Failed to export translations as JSON");
  }
};

export const exportTranslationsAsCSV = async (): Promise<string> => {
  const translations = await getTranslations();
  if (translations.length === 0) return "";
  
  const headers = "id,english,ibono,context,created_at\n";
  const rows = translations.map(t => 
    `${t.id},"${t.english.replace(/"/g, '""')}","${t.ibono.replace(/"/g, '""')}","${(t.context || '').replace(/"/g, '""')}",${t.created_at || ''}`
  ).join("\n");
  
  return headers + rows;
};

// Helper function to convert LocalTranslation to Translation
export const localToRemote = (local: LocalTranslation): Translation => {
  return {
    id: local.id || crypto.randomUUID(), // Generate UUID for new entries
    english: local.english,
    ibono: local.ibono,
    context: local.context,
    created_at: local.created_at
  };
};

// Helper function to convert Translation to LocalTranslation
export const remoteToLocal = (remote: Translation): LocalTranslation => {
  return {
    id: remote.id,
    english: remote.english,
    ibono: remote.ibono,
    context: remote.context,
    created_at: remote.created_at,
    is_synced: true,
    sync_status: 'synced'
  };
};
