const request = require('supertest');
const app = require('../src/app');

describe('String Analyzer API', () => {
  describe('POST /strings', () => {
    it('should create a new string analysis', async () => {
      const response = await request(app)
        .post('/strings')
        .send({ value: 'hello' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.value).toBe('hello');
      expect(response.body.properties).toHaveProperty('length', 5);
      expect(response.body.properties).toHaveProperty('is_palindrome', false);
      expect(response.body.properties).toHaveProperty('unique_characters', 4);
      expect(response.body.properties).toHaveProperty('word_count', 1);
    });
    
    it('should return 400 if value is missing', async () => {
      const response = await request(app)
        .post('/strings')
        .send({});
      
      expect(response.status).toBe(400);
    });
    
    it('should return 422 if value is not a string', async () => {
      const response = await request(app)
        .post('/strings')
        .send({ value: 123 });
      
      expect(response.status).toBe(422);
    });
  });
  
  describe('GET /strings/{string_value}', () => {
    it('should retrieve a previously created string', async () => {
      // First create the string
      await request(app)
        .post('/strings')
        .send({ value: 'test' });
      
      // Then retrieve it
      const response = await request(app).get('/strings/test');
      
      expect(response.status).toBe(200);
      expect(response.body.value).toBe('test');
    });
    
    it('should return 404 for a non-existent string', async () => {
      const response = await request(app).get('/strings/nonexistent');
      
      expect(response.status).toBe(404);
    });
  });
});