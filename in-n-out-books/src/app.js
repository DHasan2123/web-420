/**
 * Author: Dua Hasan
 * Date: 03/06/2025
 * File Name: app.js
 * Description: This file defines an Express-based server for the "In-N-Out-Books" API application.
 *              It includes routes for managing books and user authentication, as well as error handling.
 *              The file adds a POST route to verify security question answers for a given user by email.
 *              The route uses AJV validation for request body schema and compares the answers with the user's stored answers.
 */

const express = require('express');
const bodyParser = require('body-parser');
const ajv = require('ajv');
const bcrypt = require('bcryptjs');
const books = require('./books');
const users = require('./users');
const app = express();

// Use environment variable for port, or fallback to 3000
const port = process.env.PORT || 3000; // Use PORT from environment, fallback to 3000 if not available

// Middleware to parse JSON data
app.use(bodyParser.json());

// AJV validation schema for security question answers
const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      answer: { type: 'string' }
    },
    required: ['answer'],
    additionalProperties: false
  }
};
const validate = new ajv().compile(schema);

// API Routes for Books
app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks); // Return all books
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving books' });
  }
});

// Other book routes remain unchanged...

// API Routes for Users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await users.find();
    res.status(200).json(allUsers); // Return all users
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving users' });
  }
});

// New Route to verify security questions
app.post('/api/users/:email/verify-security-question', async (req, res) => {
  try {
    // Validate request body with AJV
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    // Find the user by email
    const { email } = req.params;
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { securityQuestions } = user;

    // Compare the answers to the security questions
    for (let i = 0; i < securityQuestions.length; i++) {
      if (securityQuestions[i].answer !== req.body[i]?.answer) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    // If all answers match
    return res.status(200).json({ message: 'Security questions successfully answered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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

// Start the server, using environment variable for port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes
