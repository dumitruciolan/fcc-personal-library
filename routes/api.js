/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const shortid = require("shortid");
// var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectId;
// const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

//array approach
let books = [];

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
          
      return res.json(
        books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }))
      );
    })

    .post(function(req, res) {
      const { title } = req.body;
      //response will contain new book object including atleast _id and title

      if(!title) return res.send('no title')
    
      const newBook = {
        _id: shortid.generate(),
        title,
        comments: []
      };

      books.push(newBook);

      return res.json(newBook);
    })

    .delete(function(req, res) {
      // empty out the array
      books = [];

      return res.json({
        success: "complete delete successful"
      });
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var { id } = req.params;

      const book = books.find(book => book._id == id);
      !book ? res.send("no book exists") : res.json(book);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      var { id } = req.params;
      var { comment } = req.body;

      // updates the books array
      books = books.map(book => {
        if (book._id == id) book.comments.push(comment);

        return book;
      });

      //json res format same as .get
      return res.json(books.find(book => book._id == id));
    })

    .delete(function(req, res) {
      var { id } = req.params;

      // filter out the book with _id === id
      books = books.filter(book => book._id != id);

      //if successful response will be 'delete successful'
      return res.send({ success: "delete successful" });
    });
};

// remove shortid after connecting to the db
