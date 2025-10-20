const express = require('express');
const cors = require('cors');
const stringRoutes = require('./routes/stringRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Special route handling for natural language filtering
// This needs to come before the general strings routes
app.get('/strings/filter-by-natural-language', (req, res, next) => {
  const controller = require('./controllers/stringController');
  return controller.filterByNaturalLanguage(req, res, next);
});

// Routes
app.use('/strings', stringRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'String Analyzer API',
    endpoints: {
      create: 'POST /strings',
      getOne: 'GET /strings/{string_value}',
      getAll: 'GET /strings',
      filter: 'GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a',
      naturalLanguage: 'GET /strings/filter-by-natural-language?query=all%20palindromic%20strings',
      delete: 'DELETE /strings/{string_value}'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;