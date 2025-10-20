class NaturalLanguageParser {
  parseQuery(query) {
    try {
      const filters = {};
      const lowerCaseQuery = query.toLowerCase();
      
      // Parse for palindrome
      if (lowerCaseQuery.includes('palindrom')) {
        filters.is_palindrome = !lowerCaseQuery.includes('not palindrom');
      }
      
      // Parse for word count
      if (lowerCaseQuery.includes('single word') || lowerCaseQuery.includes('one word')) {
        filters.word_count = 1;
      } else if (lowerCaseQuery.includes('two words') || lowerCaseQuery.includes('2 words')) {
        filters.word_count = 2;
      } else {
        // Try to extract word count with regex
        const wordCountMatch = lowerCaseQuery.match(/(\d+)\s+word/);
        if (wordCountMatch) {
          filters.word_count = parseInt(wordCountMatch[1]);
        }
      }
      
      // Parse for string length
      const longerThanMatch = lowerCaseQuery.match(/longer than (\d+)/);
      if (longerThanMatch) {
        filters.min_length = parseInt(longerThanMatch[1]) + 1;
      }
      
      const shorterThanMatch = lowerCaseQuery.match(/shorter than (\d+)/);
      if (shorterThanMatch) {
        filters.max_length = parseInt(shorterThanMatch[1]) - 1;
      }
      
      // Parse for character contains
      if (lowerCaseQuery.includes('contain')) {
        // Check for common patterns
        if (lowerCaseQuery.includes('letter a')) {
          filters.contains_character = 'a';
        } else if (lowerCaseQuery.includes('letter z')) {
          filters.contains_character = 'z';
        } else if (lowerCaseQuery.includes('first vowel')) {
          filters.contains_character = 'a'; // Assuming 'a' is the first vowel
        } else {
          // Try to extract character with regex
          const charMatch = lowerCaseQuery.match(/contains? (?:the )?(?:letter |character )?"?([a-z])"?/);
          if (charMatch) {
            filters.contains_character = charMatch[1];
          }
        }
      }
      
      // Check for conflicting filters
      if (filters.min_length !== undefined && 
          filters.max_length !== undefined && 
          filters.min_length > filters.max_length) {
        return { 
          success: false, 
          error: 'Conflicting filters: min_length > max_length' 
        };
      }
      
      return { success: true, filters };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NaturalLanguageParser();