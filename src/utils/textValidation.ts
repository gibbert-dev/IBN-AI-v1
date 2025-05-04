
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
    if (words[i] === words[i + 1] && words[i].length > 1) { // Added length check to avoid flagging single characters
      return { 
        hasRepeatedWords: true, 
        repeatedWord: words[i] 
      };
    }
  }

  return { hasRepeatedWords: false, repeatedWord: null };
};

/**
 * Detects if the text contains exactly repeated words, even if they're not adjacent
 * @param text The text to analyze
 * @returns Object with result and duplicated words found
 */
export const detectExactDuplicateWords = (text: string): {
  hasDuplicates: boolean,
  duplicatedWords: string[]
} => {
  if (!text || text.trim() === '') {
    return { hasDuplicates: false, duplicatedWords: [] };
  }
  
  const words = text.trim()
    .split(/\s+/)
    .map(word => word.toLowerCase().replace(/[,.!?;:"()[\]{}]/g, ''))
    .filter(word => word.length > 2); // Ignore very short words
  
  const wordCounts = new Map<string, number>();
  const duplicatedWords: string[] = [];
  
  for (const word of words) {
    const count = wordCounts.get(word) || 0;
    wordCounts.set(word, count + 1);
    
    if (count === 1) { // If we've seen this word exactly once before
      duplicatedWords.push(word);
    }
  }
  
  return {
    hasDuplicates: duplicatedWords.length > 0,
    duplicatedWords
  };
};

