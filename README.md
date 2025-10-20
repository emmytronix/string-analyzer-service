# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties.

## Features

- Analyze strings to compute various properties
- Store analyzed strings
- Retrieve stored strings
- Filter strings based on various criteria
- Natural language filtering
- Delete strings

## API Endpoints

### 1. Create/Analyze String
```
POST /strings
Content-Type: application/json

Request Body:
{
  "value": "string to analyze"
}

Response (201 Created):
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2,
      // ... etc
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

### 2. Get Specific String
```
GET /strings/{string_value}

Response (200 OK):
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": { /* same as above */ },
  "created_at": "2025-08-27T10:00:00Z"
}
```

### 3. Get All Strings with Filtering
```
GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a

Response (200 OK):
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { /* ... */ },
      "created_at": "2025-08-27T10:00:00Z"
    },
    // ... more strings
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

### 4. Natural Language Filtering
```
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings

Response (200 OK):
{
  "data": [ /* array of matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

### 5. Delete String
```
DELETE /strings/{string_value}

Response (204 No Content): 
(Empty response body)
```

## Getting Started

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/string-analyzer-service.git
cd string-analyzer-service
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the PORT environment variable.

### Environment Variables

Create a `.env` file in the root directory and add the following variables if needed:
```
PORT=3000
NODE_ENV=development
```

## Deployment

### Deployment on Railway

1. Create an account on [Railway](https://railway.app/)
2. Create a new project
3. Link your GitHub repository
4. Configure environment variables if needed
5. Deploy your application

## Testing

```bash
npm test
```

This will run the Jest test suite for the API endpoints.