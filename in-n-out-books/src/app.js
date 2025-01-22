// Author: Dua Hasan
// Date: 2025-01-21
// File Name: app.js
// Description: Express application setup for "In-N-Out-Books" landing page, including routing and error handling.

// Import the Express module
const express = require('express');
// Initialize the Express app
const app = express();
// Set the port for the server
const PORT = process.env.PORT || 3000;

// Set up a GET route for the root URL
app.get('/', (req, res) => {
  // Serve the landing page HTML
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>In-N-Out-Books</title>
          <link rel="stylesheet" href="styles.css"> <!-- Link to external CSS file -->
      </head>
      <body>
          <header>
              <h1>Welcome to In-N-Out-Books</h1>
          </header>
          <section class="intro">
              <h2>Introduction</h2>
              <p>At In-N-Out-Books, we provide an easy and efficient platform to manage your personal collection of books. Whether you're an avid reader, a book club organizer, or just starting your library, we’ve got you covered!</p>
          </section>
          <section class="top-sellers">
              <h2>Top Selling Books</h2>
              <ul>
                  <li><strong>Book Title 1</strong> by Author Name</li>
                  <li><strong>Book Title 2</strong> by Author Name</li>
                  <li><strong>Book Title 3</strong> by Author Name</li>
              </ul>
          </section>
          <section class="hours">
              <h2>Hours of Operation</h2>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
          </section>
          <section class="contact">
              <h2>Contact Information</h2>
              <p>Email: support@innoutbooks.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Book Lane, Library City, BK 45678</p>
          </section>
          <footer>
              <p>&copy; 2025 In-N-Out-Books. All rights reserved.</p>
          </footer>
      </body>
      </html>
  `);
});

// 404 Error handling middleware (for undefined routes)
app.use((req, res, next) => {
  res.status(404).send("Sorry, we couldn't find that page.");
});

// 500 Error handling middleware (for internal server errors)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console

  // If in development mode, send the error stack
  if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
          message: 'Something went wrong!',
          error: err.stack
      });
  } else {
      res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Export the Express app
module.exports = app;

