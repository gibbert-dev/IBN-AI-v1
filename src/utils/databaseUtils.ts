import { supabase } from './supabaseClient';

export interface Translation {
  id: number;
  english: string;
  ibono: string;
  created_at?: string; // Using created_at instead of timestamp as it's likely Supabase's default
}

// Table name in Supabase
const TABLE_NAME = "translations";

export const saveTranslation = async (english: string, ibono: string): Promise<Translation> => {
  const newTranslation = {
    english,
    ibono,
    // Supabase will handle the created_at timestamp automatically
  };
  
  try {
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
      throw error;
    }
    
    return data as Translation;
  } catch (e) {
    console.error("Unexpected error during save:", e);
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

export const deleteTranslation = async (id: number): Promise<void> => {
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
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .neq('id', 0); // Deletes all records
    
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
  
  const headers = "id,english,ibono,created_at\n";
  const rows = translations.map(t => 
    `${t.id},"${t.english.replace(/"/g, '""')}","${t.ibono.replace(/"/g, '""')}",${t.created_at || ''}`
  ).join("\n");
  
  return headers + rows;
};
