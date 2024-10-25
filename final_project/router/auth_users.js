const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let session_name = req.session.authorization["username"];
  let review = req.query.review;

  if (book) {
    // Check if the user has already submitted a review
    if (book.reviews[session_name]) {
      // Update existing review
      book.reviews[session_name] = review;
      book[isbn] = book;
      return res.status(200).json({ message: "Your review has been updated successfully!" });
    } else {
      // Add new review
      book.reviews[session_name] = review;
      book[isbn] = book;
      return res.status(200).json({ message: "Your review has been added successfully!" });
    }
  } else {
    return res.status(404).json({ message: `Book with ISBN number ${isbn} was not found.` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  let session_name = req.session.authorization["username"];

  if (book) {
    // Check if the user has already submitted a review
    if (book.reviews[session_name]) {
      delete book.reviews[session_name]
      return res.status(200).json({ message: "Your review has been removed" });
    } else {
      return res.status(200).json({ message: "No reviews exist for this user" });
    };
  };
  return res.status(300).json({ message: `Book with ISBN number ${isbn} was not found.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
