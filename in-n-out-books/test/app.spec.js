const request = require('supertest');
const app = require('./app'); // Import the app

describe('Chapter 1: API Tests', () => {

  // Test for GET /api/books (should return all books)
  it('should return an array of books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0); // Ensure there is at least one book
  });

  // Test for GET /api/books/:id (should return a single book)
  it('should return a single book', async () => {
    const response = await request(app).get('/api/books/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1); // Check if the returned book has id 1
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('author');
  });

  // Test for GET /api/books/:id (should return 400 error if id is not a number)
  it('should return 400 error if id is not a number', async () => {
    const response = await request(app).get('/api/books/invalidId');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'ID must be a number');
  });

  // Test for GET /api/books/:id (should return 404 if book is not found)
  it('should return 404 error if the book is not found', async () => {
    const response = await request(app).get('/api/books/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });
});
