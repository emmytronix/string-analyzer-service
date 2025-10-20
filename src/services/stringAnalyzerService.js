const crypto = require('crypto');

class StringAnalyzerService {
  analyzeString(str) {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }

    // Calculate SHA-256 hash
    const sha256Hash = crypto.createHash('sha256').update(str).digest('hex');
    
    // Calculate character frequency map
    const charFreqMap = {};
    for (let char of str) {
      charFreqMap[char] = (charFreqMap[char] || 0) + 1;
    }
    
    // Calculate unique characters count
    const uniqueCharacters = new Set(str).size;
    
    // Check if it's a palindrome (case insensitive)
    const normalized = str.toLowerCase().replace(/\s/g, '');
    const reversed = normalized.split('').reverse().join('');
    const isPalindrome = normalized === reversed;
    
    // Calculate word count
    const wordCount = str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
    
    return {
      id: sha256Hash,
      value: str,
      properties: {
        length: str.length,
        is_palindrome: isPalindrome,
        unique_characters: uniqueCharacters,
        word_count: wordCount,
        sha256_hash: sha256Hash,
        character_frequency_map: charFreqMap
      },
      created_at: new Date().toISOString()
    };
  }
}

module.exports = new StringAnalyzerService();