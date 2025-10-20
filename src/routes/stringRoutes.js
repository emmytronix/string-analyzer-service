const express = require('express');
const stringController = require('../controllers/stringController');

const router = express.Router();

// Create a new string
router.post('/', stringController.createString.bind(stringController));

// Get a specific string
router.get('/:string_value', stringController.getString.bind(stringController));

// Get all strings with filtering
router.get('/', stringController.getAllStrings.bind(stringController));

// Natural language filtering
router.get('/filter-by-natural-language', stringController.filterByNaturalLanguage.bind(stringController));

// Delete string
router.delete('/:string_value', stringController.deleteString.bind(stringController));

module.exports = router;