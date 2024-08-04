const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(201).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user." });
});

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: '1h' });
        req.session.authorization = { accessToken: token };
        return res.status(200).json({ message: "Logged in successfully" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  if (filtered_book) {
    let review = req.query.review;
    let reviewer = req.session.authorization["username"];
    if (review) {
      filtered_book["reviews"][reviewer] = review;
      books[isbn] = filtered_book;
    }
    res.send(
      `The review for the book with ISBN  ${isbn} has been added/updated.`
    );
  } else {
    res.send("Unable to find this ISBN!");
  }
});

//delete book review

regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = await books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;