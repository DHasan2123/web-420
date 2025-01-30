// Author: Dua Hasan
// Date: 2025-01-28
// File Name: app.js
// Description: Express application setup for "In-N-Out-Books" API routes and error handling

// Import the Express module and the books collection
const express = require('express');
const books = require('./database/books'); // Import books data from mock database
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests (if needed for future expansions)
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
