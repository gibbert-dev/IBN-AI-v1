
import { useState } from "react";

// Characters commonly found in English but not in Ibọnọ language
const ENGLISH_INDICATORS = ['w', 'c', 'q', 'x', 'z', 'j', 'v'];

export const useEnglishDetection = () => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const detectEnglishInIbono = (text: string): boolean => {
    if (!text.trim()) return false;
    
    // Check for common English words
    const commonEnglishWords = ['the', 'and', 'this', 'that', 'with', 'for', 'from', 'have', 'who'];
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for English-specific characters
    const hasEnglishChars = ENGLISH_INDICATORS.some(char => text.toLowerCase().includes(char));
    
    // Check for common English words
    const hasEnglishWords = commonEnglishWords.some(word => 
      words.includes(word) || words.some(w => w === word+'.' || w === word+',' || w === word+'!')
    );
    
    // If the text has multiple indicators of being English, flag it
    return (hasEnglishChars && text.length > 5) || hasEnglishWords;
  };

  const validateIbonoInput = (text: string): string | null => {
    if (detectEnglishInIbono(text)) {
      return "This appears to be English text. Please enter Ibọnọ language text.";
    }
    return null;
  };

  return { validateIbonoInput, setValidationError, validationError };
};

export default useEnglishDetection;
