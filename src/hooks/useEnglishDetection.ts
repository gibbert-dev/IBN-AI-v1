
import { useState } from "react";
import { detectRepeatedWords } from "@/utils/textValidation";

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
    // First check for English text
    if (detectEnglishInIbono(text)) {
      return "This appears to be English text. Please enter Ibọnọ language text.";
    }

    // Then check for repeated words
    const { hasRepeatedWords, repeatedWord } = detectRepeatedWords(text);
    if (hasRepeatedWords) {
      return `Repeated word detected: "${repeatedWord}". Please check your translation.`;
    }

    return null;
  };

  const validateEnglishInput = (text: string): string | null => {
    // Check for repeated words
    const { hasRepeatedWords, repeatedWord } = detectRepeatedWords(text);
    if (hasRepeatedWords) {
      return `Repeated word detected: "${repeatedWord}". Please check your text.`;
    }

    return null;
  };

  return { 
    validateIbonoInput, 
    validateEnglishInput, 
    setValidationError, 
    validationError 
  };
};

export default useEnglishDetection;
