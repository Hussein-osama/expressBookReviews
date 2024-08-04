const express = require("express");
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Get books using callback
public_users.get('/books', (req, res) => {
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const filteredBooks = {};
  for (let key in books) {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  }
  return res.status(200).json({ BookByAuthor: filteredBooks });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const filteredBooks = {};
  for (let key in books) {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  }
  return res.status(200).json({ BookByTitle: filteredBooks });
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json({ bookReview: book.reviews });
  }
  return res.status(404).json({ message: "Reviews not found" });
});

module.exports.general = public_users;
