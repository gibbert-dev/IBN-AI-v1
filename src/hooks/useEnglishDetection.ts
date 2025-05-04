
import { useState } from "react";
import { detectRepeatedWords } from "@/utils/textValidation";

// Characters commonly found in English but not in Ibọnọ language
const ENGLISH_INDICATORS = ['w', 'c', 'q', 'x', 'z', 'j', 'v'];

// Common typos in English
const COMMON_ENGLISH_TYPOS = {
  'teh': 'the',
  'adn': 'and',
  'taht': 'that',
  'becuase': 'because',
  'recieve': 'receive',
  'seperate': 'separate',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'occured': 'occurred',
  'thier': 'their',
  'alot': 'a lot'
};

export const useEnglishDetection = () => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{ text: string, replacements: string[] } | null>(null);
  const [hasExtraSpaces, setHasExtraSpaces] = useState<boolean>(false);

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

  const detectExtraSpaces = (text: string): boolean => {
    // Check for multiple consecutive spaces
    return /\s{2,}/.test(text);
  };

  const detectTypos = (text: string, isIbono: boolean): { hasTypo: boolean, typo: string | null, suggestions: string[] } => {
    if (!text.trim()) return { hasTypo: false, typo: null, suggestions: [] };
    
    const words = text.toLowerCase().split(/\s+/);
    
    // Only check for typos in English text
    if (!isIbono) {
      for (const word of words) {
        const cleanWord = word.replace(/[,.!?;:"()[\]{}]/g, '').toLowerCase();
        if (COMMON_ENGLISH_TYPOS[cleanWord as keyof typeof COMMON_ENGLISH_TYPOS]) {
          return { 
            hasTypo: true, 
            typo: cleanWord, 
            suggestions: [COMMON_ENGLISH_TYPOS[cleanWord as keyof typeof COMMON_ENGLISH_TYPOS]] 
          };
        }
      }
    }
    
    return { hasTypo: false, typo: null, suggestions: [] };
  };

  const validateIbonoInput = (text: string): string | null => {
    setHasExtraSpaces(false);
    setSuggestions(null);

    // First check for English text
    if (detectEnglishInIbono(text)) {
      return "This appears to be English text. Please enter Ibọnọ language text.";
    }

    // Then check for repeated words
    const { hasRepeatedWords, repeatedWord } = detectRepeatedWords(text);
    if (hasRepeatedWords) {
      return `Repeated word detected: "${repeatedWord}". Please check your translation.`;
    }

    // Check for extra spaces
    if (detectExtraSpaces(text)) {
      setHasExtraSpaces(true);
      return "Extra spaces detected. Consider removing them for better formatting.";
    }

    return null;
  };

  const validateEnglishInput = (text: string): string | null => {
    setHasExtraSpaces(false);
    setSuggestions(null);
    
    // Check for repeated words
    const { hasRepeatedWords, repeatedWord } = detectRepeatedWords(text);
    if (hasRepeatedWords) {
      return `Repeated word detected: "${repeatedWord}". Please check your text.`;
    }
    
    // Check for extra spaces
    if (detectExtraSpaces(text)) {
      setHasExtraSpaces(true);
      return "Extra spaces detected. Consider removing them for better formatting.";
    }
    
    // Check for typos
    const { hasTypo, typo, suggestions } = detectTypos(text, false);
    if (hasTypo && typo) {
      setSuggestions({ text: typo, replacements: suggestions });
      return `Possible typo detected: "${typo}". Did you mean "${suggestions[0]}"?`;
    }

    return null;
  };

  return { 
    validateIbonoInput, 
    validateEnglishInput, 
    setValidationError,
    validationError,
    suggestions,
    hasExtraSpaces
  };
};

export default useEnglishDetection;
