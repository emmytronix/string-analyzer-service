// Using an in-memory store for simplicity
// In a production environment, you'd use a database
const crypto = require('crypto');

class StringModel {
  constructor() {
    this.strings = new Map();
  }
  
  create(stringData) {
    const { id } = stringData;
    
    if (this.strings.has(id)) {
      return { success: false, error: 'String already exists' };
    }
    
    this.strings.set(id, stringData);
    return { success: true, data: stringData };
  }
  
  findByValue(value) {
    // Create a hash to search by value
    const hash = crypto.createHash('sha256').update(value).digest('hex');
    
    if (this.strings.has(hash)) {
      return { success: true, data: this.strings.get(hash) };
    }
    
    return { success: false, error: 'String not found' };
  }
  
  findById(id) {
    if (this.strings.has(id)) {
      return { success: true, data: this.strings.get(id) };
    }
    
    return { success: false, error: 'String not found' };
  }
  
  delete(value) {
    const hash = crypto.createHash('sha256').update(value).digest('hex');
    
    if (this.strings.has(hash)) {
      this.strings.delete(hash);
      return { success: true };
    }
    
    return { success: false, error: 'String not found' };
  }
  
  findAll(filters = {}) {
    const result = Array.from(this.strings.values()).filter(item => {
      // Apply filters
      if (filters.is_palindrome !== undefined && 
          item.properties.is_palindrome !== filters.is_palindrome) {
        return false;
      }
      
      if (filters.min_length !== undefined && 
          item.properties.length < filters.min_length) {
        return false;
      }
      
      if (filters.max_length !== undefined && 
          item.properties.length > filters.max_length) {
        return false;
      }
      
      if (filters.word_count !== undefined && 
          item.properties.word_count !== filters.word_count) {
        return false;
      }
      
      if (filters.contains_character !== undefined && 
          !item.value.includes(filters.contains_character)) {
        return false;
      }
      
      return true;
    });
    
    return { 
      success: true, 
      data: result,
      count: result.length,
      filters_applied: filters
    };
  }
}

module.exports = new StringModel();