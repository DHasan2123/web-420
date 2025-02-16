// Author: Dua Hasan
// Date: 02/08/2025
// File Name: app.js
// Description: Express application setup for "In-N-Out-Books" API routes and error handling

// Import the Express module
const express = require('express');
// Import the books mock database functions
const books = require('./database/books'); // Import books data from mock database
// Initialize the Express app
const app = express();
// Set the port for the server
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests (for future expansions)
app.use(express.json());

// Route 1: GET /api/books - Returns an array of books
app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await books.find();  // Retrieve all books
    res.json(allBooks); // Send the list of books as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve books.', error: err.message });
  }
});

// Route 2: GET /api/books/:id - Returns a single book based on the id
app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid number
  if (isNaN(id)) {
    const err = new Error('Input must be a number');
    err.status = 400;
    return next(err); // Pass the error to the error handler
  }

  try {
    const book = await books.findOne({ id: Number(id) }); // Retrieve the book with matching id
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book); // Send the book as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve book.', error: err.message });
  }
});

// Route 3: POST /api/books - Adds a new book to the database
app.post('/api/books', async (req, res) => {
  try {
    const { title, author } = req.body;

    // Check if the book title is provided
    if (!title) {
      return res.status(400).json({ message: 'Book title is required' });
    }

    // Create the new book object (with a mock id)
    const newBook = { id: Date.now(), title, author };

    // Add the new book to the mock database
    await books.addBook(newBook);

    // Return the new book object with a 201 status code
    return res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while adding the book.', error: err.message });
  }
});

// Route 4: DELETE /api/books/:id - Deletes a book by its id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Try to delete the book from the mock database
    const result = await books.deleteBook(id);

    // If no book was found and deleted, return 404
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // If the book was deleted successfully, return 204
    return res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the book.', error: err.message });
  }
});

// ** New PUT Route (to update a book) **

// Route 5: PUT /api/books/:id - Updates an existing book by its id
app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Input must be a number' });
  }

  const { title, author } = req.body;

  // Check if the book title is provided
  if (!title) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    // Simulate updating the book in the mock database
    const updatedBook = { id: Number(id), title, author };
    const result = await books.updateBook(updatedBook); // Assuming updateBook is a function in the database mock

    // If no book was found and updated, return 404
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return 204 status code for successful update (no content to return)
    return res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the book.', error: err.message });
  }
});

// 404 Error handling middleware (for undefined routes)
app.use((req, res, next) => {
  res.status(404).send("Sorry, we couldn't find that page.");
});

// 500 Error handling middleware (for internal server errors)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the Express app
