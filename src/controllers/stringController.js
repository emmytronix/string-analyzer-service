const stringModel = require('../models/stringModel');
const stringAnalyzerService = require('../services/stringAnalyzerService');
const naturalLanguageParser = require('../utils/naturalLanguageParser');

class StringController {
  async createString(req, res, next) {
    try {
      const { value } = req.body;
      
      if (value === undefined) {
        return res.status(400).json({ error: 'Missing "value" field' });
      }
      
      if (typeof value !== 'string') {
        return res.status(422).json({ error: 'Value must be a string' });
      }
      
      // Check if string exists before analyzing it
      const existingString = stringModel.findByValue(value);
      if (existingString.success) {
        return res.status(409).json({ error: 'String already exists' });
      }
      
      // Analyze and create the string
      const analyzedString = stringAnalyzerService.analyzeString(value);
      stringModel.create(analyzedString); // We already verified it doesn't exist
      
      return res.status(201).json(analyzedString);
    } catch (error) {
      next(error);
    }
  }
  
  async getString(req, res, next) {
    try {
      const { string_value } = req.params;
      const result = stringModel.findByValue(string_value);
      
      if (!result.success) {
        return res.status(404).json({ error: 'String not found' });
      }
      
      return res.status(200).json(result.data);
    } catch (error) {
      next(error);
    }
  }
  
  async getAllStrings(req, res, next) {
    try {
      const filters = {};
      
      // Process query parameters
      if (req.query.is_palindrome !== undefined) {
        filters.is_palindrome = req.query.is_palindrome === 'true';
      }
      
      if (req.query.min_length !== undefined) {
        const minLength = parseInt(req.query.min_length);
        if (isNaN(minLength)) {
          return res.status(400).json({ error: 'min_length must be a number' });
        }
        filters.min_length = minLength;
      }
      
      if (req.query.max_length !== undefined) {
        const maxLength = parseInt(req.query.max_length);
        if (isNaN(maxLength)) {
          return res.status(400).json({ error: 'max_length must be a number' });
        }
        filters.max_length = maxLength;
      }
      
      if (req.query.word_count !== undefined) {
        const wordCount = parseInt(req.query.word_count);
        if (isNaN(wordCount)) {
          return res.status(400).json({ error: 'word_count must be a number' });
        }
        filters.word_count = wordCount;
      }
      
      if (req.query.contains_character !== undefined) {
        if (req.query.contains_character.length !== 1) {
          return res.status(400).json({ error: 'contains_character must be a single character' });
        }
        filters.contains_character = req.query.contains_character;
      }
      
      const result = stringModel.findAll(filters);
      return res.status(200).json({
        data: result.data,
        count: result.count,
        filters_applied: filters
      });
    } catch (error) {
      next(error);
    }
  }
  
  async filterByNaturalLanguage(req, res, next) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
      }
      
      const parsedQuery = naturalLanguageParser.parseQuery(query);
      
      if (!parsedQuery.success) {
        return res.status(422).json({ 
          error: 'Unable to parse natural language query', 
          details: parsedQuery.error 
        });
      }
      
      const result = stringModel.findAll(parsedQuery.filters);
      
      return res.status(200).json({
        data: result.data,
        count: result.count,
        interpreted_query: {
          original: query,
          parsed_filters: parsedQuery.filters
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteString(req, res, next) {
    try {
      const { string_value } = req.params;
      const result = stringModel.delete(string_value);
      
      if (!result.success) {
        return res.status(404).json({ error: 'String not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StringController();