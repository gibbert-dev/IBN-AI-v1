
/**
 * Utility functions for text validation
 */

/**
 * Detects repeated adjacent words in a text string
 * @param text The text to analyze
 * @returns Object with validation result and the first repeated word found (if any)
 */
export const detectRepeatedWords = (text: string): { 
  hasRepeatedWords: boolean, 
  repeatedWord: string | null 
} => {
  if (!text || text.trim() === '') {
    return { hasRepeatedWords: false, repeatedWord: null };
  }

  // Split by spaces and clean up each word (remove punctuation)
  const words = text.trim()
    .split(/\s+/)
    .map(word => word.toLowerCase().replace(/[,.!?;:"()[\]{}]/g, ''))
    .filter(word => word.length > 0);

  // Check for adjacent repeated words
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] === words[i + 1]) {
      return { 
        hasRepeatedWords: true, 
        repeatedWord: words[i] 
      };
    }
  }

  return { hasRepeatedWords: false, repeatedWord: null };
};
