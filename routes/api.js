"use strict";

const { expect } = require("chai"),
  mongoose = require("mongoose"),
  Book = require("../models/bookModel");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

module.exports = app => {
  app // show the books
    .route("/api/books")
    .get((req, res) => {
      // return all books without the comments and __v
      Book.find({}, { comments: 0, __v: 0 }, (err, books) => {
        if (err) return res.send("No books could be found");
        if (books) return res.status(200).json(books);
      });
    })

    // add a book
    .post((req, res) => {
      const { title } = req.body,
        book = new Book({
          title,
          created_on: Date.now(),
          updated_on: Date.now()
        });

      if (!title) return res.send("no title");

      book
        .save()
        .then(response => res.status(200).json(response))
        .catch(() => res.status(200).send("missing inputs"));
    })

    // delete all books
    .delete((req, res) => {
      Book.deleteMany({}, (err, deleted) => {
        if (err) return res.send("could not delete all the books");
        if (deleted) return res.send("complete delete successful");
      });
    });

  app // retrieve a book
    .route("/api/books/:id")
    .get((req, res, next) => {
      const { id } = req.params;

      // find by id and remove from view the  __v
      Book.findById(id, { __v: 0 }, (err, book) => {
        book ? res.status(200).json(book) : res.send("no book exists");
      });
    })

    // adding comments
    .post((req, res) => {
      const { id } = req.params,
        { comment } = req.body;

      Book.findByIdAndUpdate(
        id, // atomic operations
        {
          $push: { comments: comment },
          $inc: { commentcount: 1 },
          $set: { updated_on: Date.now() }
        },
        { new: true }, // returns a new value
        (err, book) => {
          if (err) return res.send("cannot add the comment");
          if (book) return res.status(200).json(book);
        }
      );
    })

    // delete a book
    .delete((req, res) => {
      const { id } = req.params;
      Book.findByIdAndDelete(id, (err, deleted) => {
        if (err) return res.send("could not delete the book");
        if (deleted) return res.send("delete successful");
      });
    });
};
