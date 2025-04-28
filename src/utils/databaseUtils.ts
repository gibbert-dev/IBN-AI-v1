
export interface Translation {
  id: number;
  english: string;
  ibono: string;
  timestamp: string;
}

const DB_KEY = "ibonai-translations";

export const saveTranslation = (english: string, ibono: string): Translation => {
  const translations = getTranslations();
  
  const newTranslation: Translation = {
    id: Date.now(),
    english,
    ibono,
    timestamp: new Date().toISOString()
  };
  
  const updatedTranslations = [...translations, newTranslation];
  localStorage.setItem(DB_KEY, JSON.stringify(updatedTranslations));
  
  return newTranslation;
};

export const getTranslations = (): Translation[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteTranslation = (id: number): void => {
  const translations = getTranslations();
  const filtered = translations.filter(item => item.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(filtered));
};

export const clearAllTranslations = (): void => {
  localStorage.removeItem(DB_KEY);
};

export const exportTranslationsAsJSON = (): string => {
  const translations = getTranslations();
  return JSON.stringify(translations, null, 2);
};

export const exportTranslationsAsCSV = (): string => {
  const translations = getTranslations();
  if (translations.length === 0) return "";
  
  const headers = "id,english,ibono,timestamp\n";
  const rows = translations.map(t => 
    `${t.id},"${t.english.replace(/"/g, '""')}","${t.ibono.replace(/"/g, '""')}",${t.timestamp}`
  ).join("\n");
  
  return headers + rows;
};
