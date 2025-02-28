const request = require('supertest');
const app = require('./app'); // Import the app

describe('Chapter 4: API Tests', () => {

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
    expect(response.body).toHaveProperty('message', 'Input must be a number');
  });

  // Test for GET /api/books/:id (should return 404 if book is not found)
  it('should return 404 error if the book is not found', async () => {
    const response = await request(app).get('/api/books/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });

  // Test for POST /api/books (should return a 201 status code when adding a new book)
  it('should return 201 status code when adding a new book', async () => {
    const newBook = { title: 'New Book', author: 'John Doe' };

    const response = await request(app)
      .post('/api/books')
      .send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newBook.title);
    expect(response.body.author).toBe(newBook.author);
  });

  // Test for POST /api/books (should return 400 status code when title is missing)
  it('should return 400 status code when adding a new book with missing title', async () => {
    const newBook = { author: 'John Doe' };

    const response = await request(app)
      .post('/api/books')
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Book title is required');
  });

  // Test for POST /api/books (should return 400 status code for invalid book data)
  it('should return 400 status code when adding a new book with invalid data', async () => {
    const newBook = {}; // Empty body

    const response = await request(app)
      .post('/api/books')
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Book title is required');
  });

  // Test for DELETE /api/books/:id (should return 204 status code when deleting a book)
  it('should return 204 status code when deleting a book', async () => {
    // First, add a new book to the mock database
    const newBook = { title: 'Book to Delete', author: 'John Doe' };
    const createdResponse = await request(app)
      .post('/api/books')
      .send(newBook);

    const bookId = createdResponse.body.id;

    // Now, delete the book
    const deleteResponse = await request(app).delete(`/api/books/${bookId}`);
    expect(deleteResponse.status).toBe(204);

    // Verify that the book is actually deleted (attempt to fetch it again)
    const getResponse = await request(app).get(`/api/books/${bookId}`);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toHaveProperty('message', 'Book not found');
  });

  // Test for DELETE /api/books/:id (should return 404 error if book is not found)
  it('should return 404 status code when trying to delete a non-existing book', async () => {
    const response = await request(app).delete('/api/books/9999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });

  // ** New Test Cases for PUT /api/books/:id (update book)**

  // Test for PUT /api/books/:id (should return 204 status code when updating a book)
  it('should return 204 status code when updating a book', async () => {
    // First, add a new book to the mock database
    const newBook = { title: 'Book to Update', author: 'Jane Doe' };
    const createdResponse = await request(app)
      .post('/api/books')
      .send(newBook);

    const bookId = createdResponse.body.id;

    // Now, update the book
    const updatedBook = { title: 'Updated Book', author: 'Jane Doe' };
    const updateResponse = await request(app)
      .put(`/api/books/${bookId}`)
      .send(updatedBook);

    expect(updateResponse.status).toBe(204);

    // Verify that the book was updated (attempt to fetch it again)
    const getResponse = await request(app).get(`/api/books/${bookId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe(updatedBook.title);
  });

  // Test for PUT /api/books/:id (should return 400 error if id is not a number)
  it('should return 400 error if id is not a number when updating a book', async () => {
    const updatedBook = { title: 'Updated Book', author: 'Jane Doe' };
    const response = await request(app)
      .put('/api/books/invalidId')
      .send(updatedBook);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Input must be a number');
  });

  // Test for PUT /api/books/:id (should return 400 error when title is missing)
  it('should return 400 error when updating a book with missing title', async () => {
    const newBook = { title: 'Book to Update', author: 'Jane Doe' };
    const createdResponse = await request(app)
      .post('/api/books')
      .send(newBook);

    const bookId = createdResponse.body.id;

    const updatedBook = { author: 'Jane Doe' }; // Missing title

    const response = await request(app)
      .put(`/api/books/${bookId}`)
      .send(updatedBook);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Bad Request');
  });

  // Test for PUT /api/books/:id (should return 404 error if book is not found)
  it('should return 404 error when updating a non-existing book', async () => {
    const updatedBook = { title: 'Updated Book', author: 'Jane Doe' };
    const response = await request(app)
      .put('/api/books/9999')
      .send(updatedBook);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });

  // ** New Test Cases for /api/users/:email/verify-security-question**

  // Test for POST /api/users/:email/verify-security-question (should return 200 when security answers are correct)
  it('should return 200 status code when security questions are answered correctly', async () => {
    const email = 'harry@hogwarts.edu';
    const body = [
      { answer: 'Hedwig' },
      { answer: 'Quidditch Through the Ages' },
      { answer: 'Evans' },
    ];

    const response = await request(app)
      .post(`/api/users/${email}/verify-security-question`)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Security questions successfully answered');
  });

  // Test for POST /api/users/:email/verify-security-question (should return 400 when request body fails AJV validation)
  it('should return 400 status code when the request body fails ajv validation', async () => {
    const email = 'harry@hogwarts.edu';
    const body = [
      { answer: 'Hedwig' },
      { incorrectField: 'invalid' }, // Invalid field
    ];

    const response = await request(app)
      .post(`/api/users/${email}/verify-security-question`)
      .send(body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad Request');
  });

  // Test for POST /api/users/:email/verify-security-question (should return 401 if answers are incorrect)
  it('should return 401 status code when answers are incorrect', async () => {
    const email = 'harry@hogwarts.edu';
    const body = [
      { answer: 'IncorrectAnswer' }, // Incorrect answer
      { answer: 'Quidditch Through the Ages' },
      { answer: 'Evans' },
    ];

    const response = await request(app)
      .post(`/api/users/${email}/verify-security-question`)
      .send(body);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  // Test for POST /api/users/:email/verify-security-question (should return 404 if user not found)
  it('should return 404 status code when user is not found', async () => {
    const email = 'nonexistent@hogwarts.edu';
    const body = [
      { answer: 'SomeAnswer' },
      { answer: 'SomeOtherAnswer' },
      { answer: 'YetAnotherAnswer' },
    ];

    const response = await request(app)
      .post(`/api/users/${email}/verify-security-question`)
      .send(body);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
