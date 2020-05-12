"use strict";

const { expect } = require("chai"),
  Book = require("../models/bookModel");

module.exports = app => {
  app // 4. show all books
    .route("/api/books")
    .get((_, res) => {
      Book.find(
        {}, // return all books & exclude unnnecessary fields
        { comments: 0, __v: 0, created_on: 0, updated_on: 0 },
        (err, books) => {
          if (err) res.send("No books could be found");
          if (books) res.status(200).json(books);
        }
      );
    })

    // 3. add a new book
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
        .then(response =>
          res.status(200).json({
            title: response.title,
            _id: response._id,
            comments: response.comments
          })
        )
        .catch(() => res.status(200).send("missing inputs"));
    })

    // 9. delete all books
    .delete((_, res) => {
      Book.deleteMany({}, (err, deleted) => {
        if (err) res.send("could not delete all the books");
        if (deleted) res.send("complete delete successful");
      });
    });

  app // 5. get a book by id
    .route("/api/books/:id")
    .get((req, res) => {
      const { id } = req.params;

      Book.findById(id, (err, book) => {
        book
          ? res.status(200).json({
              _id: book._id,
              title: book.title,
              comments: book.comments
            })
          : res.send("no book exists");
      });
    })

    // 6. add book comment
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
          if (err) res.send("cannot add the comment");
          if (book)
            res.status(200).json({
              title: book.title,
              _id: book._id,
              comments: book.comments
            });
        }
      );
    })

    // 7. delete a book
    .delete((req, res) => {
      const { id } = req.params;
      Book.findByIdAndDelete(id, (err, deleted) => {
        if (err) res.send("could not delete the book");
        if (deleted) res.send("delete successful");
      });
    });
};
