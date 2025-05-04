
import { useState } from "react";
import { detectRepeatedWords, detectExactDuplicateWords } from "@/utils/textValidation";

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
  const [potentialEnglishDetected, setPotentialEnglishDetected] = useState<boolean>(false);
  const [acceptedEnglishWords, setAcceptedEnglishWords] = useState<string[]>([]);
  const [detectedRepeatedWords, setDetectedRepeatedWords] = useState<string[]>([]);

  const detectEnglishInIbono = (text: string): { isEnglish: boolean, englishSegment: string | null } => {
    if (!text.trim()) return { isEnglish: false, englishSegment: null };
    
    // Check for common English words
    const commonEnglishWords = ['the', 'and', 'this', 'that', 'with', 'for', 'from', 'have', 'who'];
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for English-specific characters
    const englishCharsFound = words.filter(word => {
      return ENGLISH_INDICATORS.some(char => word.includes(char));
    });
    
    // Check for common English words
    const englishWordsFound = words.filter(word => {
      const cleanWord = word.replace(/[,.!?;:"()[\]{}]/g, '');
      return commonEnglishWords.includes(cleanWord) || 
             commonEnglishWords.some(commonWord => cleanWord === commonWord+'.' || cleanWord === commonWord+',' || cleanWord === commonWord+'!');
    });
    
    // If we found English words or characters, check if they're already accepted
    const allFoundEnglish = [...new Set([...englishCharsFound, ...englishWordsFound])];
    
    if (allFoundEnglish.length > 0) {
      // Check if we've already accepted these words
      const notAcceptedWords = allFoundEnglish.filter(
        word => !acceptedEnglishWords.includes(word)
      );
      
      if (notAcceptedWords.length > 0) {
        return { 
          isEnglish: true, 
          englishSegment: notAcceptedWords.join(', ')
        };
      }
    }
    
    return { isEnglish: false, englishSegment: null };
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
    setPotentialEnglishDetected(false);
    setDetectedRepeatedWords([]);

    // First check for English text
    const { isEnglish, englishSegment } = detectEnglishInIbono(text);
    if (isEnglish && englishSegment) {
      setPotentialEnglishDetected(true);
      return `This appears to contain English text: "${englishSegment}". Please enter Ibọnọ language text or click "Accept as Valid" to continue.`;
    }

    // Then check for repeated words
    const { hasRepeatedWords, repeatedWord } = detectRepeatedWords(text);
    
    // Also check for non-adjacent duplicate words
    const { hasDuplicates, duplicatedWords } = detectExactDuplicateWords(text);
    
    if (hasRepeatedWords && repeatedWord) {
      setDetectedRepeatedWords(repeatedWord ? [repeatedWord] : []);
      return `Repeated word detected: "${repeatedWord}". Please check your translation.`;
    }
    
    if (hasDuplicates && duplicatedWords.length > 0) {
      setDetectedRepeatedWords(duplicatedWords);
      if (duplicatedWords.length === 1) {
        return `Word "${duplicatedWords[0]}" appears multiple times. This might be intentional, but please check your translation.`;
      } else {
        return `Several words appear multiple times: "${duplicatedWords.slice(0, 3).join('", "')}${duplicatedWords.length > 3 ? '...' : ''}". Please review your translation.`;
      }
    }

    // Check for extra spaces
    if (detectExtraSpaces(text)) {
      setHasExtraSpaces(true);
      return null; // Not a critical error, just a warning
    }

    return null;
  };

  const acceptEnglishWords = (text: string) => {
    const words = text.toLowerCase().split(/\s+/).map(word => word.replace(/[,.!?;:"()[\]{}]/g, ''));
    setAcceptedEnglishWords(prev => [...new Set([...prev, ...words])]);
    setValidationError(null);
    setPotentialEnglishDetected(false);
  };

  // Rest of the hook remains the same
  const validateEnglishInput = (text: string): string | null => {
    setHasExtraSpaces(false);
    setSuggestions(null);
    setDetectedRepeatedWords([]);
    
    // Check for repeated words
    const { hasRepeatedWords, repeatedWord } = detectRepeatedWords(text);
    
    // Also check for non-adjacent duplicate words
    const { hasDuplicates, duplicatedWords } = detectExactDuplicateWords(text);
    
    if (hasRepeatedWords && repeatedWord) {
      setDetectedRepeatedWords(repeatedWord ? [repeatedWord] : []);
      return `Repeated word detected: "${repeatedWord}". Please check your text.`;
    }
    
    if (hasDuplicates && duplicatedWords.length > 0) {
      setDetectedRepeatedWords(duplicatedWords);
      if (duplicatedWords.length === 1) {
        return `Word "${duplicatedWords[0]}" appears multiple times. This might be intentional, but please check your text.`;
      } else {
        return `Several words appear multiple times: "${duplicatedWords.slice(0, 3).join('", "')}${duplicatedWords.length > 3 ? '...' : ''}". Please review your text.`;
      }
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
    hasExtraSpaces,
    potentialEnglishDetected,
    acceptEnglishWords,
    detectedRepeatedWords
  };
};

export default useEnglishDetection;
