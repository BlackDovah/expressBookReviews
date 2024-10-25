const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    };
  };
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  //Write your code here
  res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json({ message: `Book with isbn number ${isbn}`, book });
  } else { return res.status(404).json({ message: `Book with isbn number ${isbn} was not found` }) };
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  //Write your code here
  const author = req.params.author;
  let book = [];
  for (let i in books) {
    if (books[i].author === author) {
      book.push(books[i]);
    }
  };
  if (book.length > 0) {
    return res.status(200).json({ message: book });
  } else { return res.status(404).json({ message: `No books found for ${author}` }) };
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  //Write your code here
  const title = req.params.title;
  let book = [];
  for (let i in books) {
    if (books[i].title === title) {
      book.push(books[i])
    };
  };
  if (book.length > 0) {
    return res.status(200).json({ message: book });
  } else { return res.status(404).json({ message: `The book ${title} was not found` }) };
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json({ message: book.reviews });
  } else { return res.status(404).json({ message: `Book with isbn number ${isbn} was not found` }) };
});

// Get the book list available in the shop
public_users.get('/books', (req, res) => {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books
    .then((data) => {
      res.send(JSON.stringify({ data }, null, 4));
      console.log("Promise for Task 10 resolved");
    });
});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn', (req, res) => {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      resolve({ message: `Book with isbn number ${isbn}`, book });

    } else { reject(new Error(`Book with isbn number ${isbn} was not found`)) };

  });
  get_books
    .then((data) => {
      res.status(200).json(data);
      console.log("Promise for Task 11 resolved");
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
      console.error("Error", error.message);
    });
});

// Get book details based on author
public_users.get('/books/author/:author', (req, res) => {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    const author = req.params.author
    let book = []
    for (let i in books) {
      if (books[i].author === author) {
        book.push(books[i])
      }
    };
    if (book.length > 0) {
      resolve({ message: book });
    } else { reject(new Error(`No books found for ${author}`)) };
  });
  get_books
    .then((data) => {
      res.status(200).json(data);
      console.log("Promise for Task 12 resolved");
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
      console.error("Error", error.message);
    });
});

// Get all books based on title
public_users.get('/books/title/:title', (req, res) => {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    const title = req.params.title
    let book = []
    for (let i in books) {
      if (books[i].title === title) {
        book.push(books[i])
      }
    };
    if (book.length > 0) {
      resolve(book);
    } else { reject(new Error(`The book ${title} was not found`)) }
  });
  get_books
    .then((data) => {
      res.status(200).json(data);
      console.log("Promise for Task 13 resolved");
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
      console.error("Error", error.message);
    });
});

module.exports.general = public_users;
``