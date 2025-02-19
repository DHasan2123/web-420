// Author: Dua Hasan
// Date: 02/15/2025
// File Name: app.js
// Description:  This file defines an Express-based server for the "In-N-Out-Books" API application.
// It includes routes for managing books and user authentication, as well as error handling.
// app.js
const express = require('express');
const bodyParser = require('body-parser');
const books = require('./books');
const users = require('./users');
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// API Routes for Books
app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks); // Return all books
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  // Validate ID is a number
  if (isNaN(bookId)) {
    return res.status(400).json({ message: 'Input must be a number' });
  }

  try {
    const book = await books.findOne({ id: bookId });
    res.status(200).json(book); // Return the book if found
  } catch (error) {
    res.status(404).json({ message: 'Book not found' }); // Book not found error
  }
});

app.post('/api/books', async (req, res) => {
  const { title, author } = req.body;

  // Validate required fields
  if (!title || !author) {
    return res.status(400).json({ message: 'Book title and author are required' });
  }

  const newBook = {
    id: books.data.length + 1, // Generate a new ID (in a real app, use auto-increment or UUID)
    title,
    author,
  };

  try {
    const response = await books.insertOne(newBook);
    res.status(201).json(response.ops[0]); // Return the newly created book
  } catch (error) {
    res.status(500).json({ message: 'Error adding new book' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  // Validate ID is a number
  if (isNaN(bookId)) {
    return res.status(400).json({ message: 'Input must be a number' });
  }

  try {
    const response = await books.deleteOne({ id: bookId });
    res.status(204).json({ message: 'Book deleted' }); // Return a 204 status code for successful deletion
  } catch (error) {
    res.status(404).json({ message: 'Book not found' }); // Book not found error
  }
});

app.put('/api/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const { title, author } = req.body;

  // Validate ID is a number
  if (isNaN(bookId)) {
    return res.status(400).json({ message: 'Input must be a number' });
  }

  // Validate required fields
  if (!title || !author) {
    return res.status(400).json({ message: 'Book title and author are required' });
  }

  try {
    const updateData = { title, author };
    const response = await books.updateOne({ id: bookId }, updateData);
    res.status(204).json({ message: 'Book updated successfully' });
  } catch (error) {
    res.status(404).json({ message: 'Book not found' }); // Book not found error
  }
});

// API Routes for Users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await users.find();
    res.status(200).json(allUsers); // Return all users
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving users' });
  }
});

app.post('/api/users', async (req, res) => {
  const { email, password, securityQuestions } = req.body;

  // Validate required fields
  if (!email || !password || !securityQuestions || !Array.isArray(securityQuestions)) {
    return res.status(400).json({ message: 'Email, password, and security questions are required' });
  }

  const newUser = {
    id: users.data.length + 1, // Generate a new ID (in a real app, use auto-increment or UUID)
    email,
    password,
    securityQuestions,
  };

  try {
    const response = await users.insertOne(newUser);
    res.status(201).json(response.ops[0]); // Return the newly created user
  } catch (error) {
    res.status(500).json({ message: 'Error adding new user' });
  }
});

// Catch-all route for handling invalid paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong, please try again later' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes

