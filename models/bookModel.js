"use strict";

// set user schema & model
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
  commentcount: { type: Number, default: 0 },
  created_on: Date,
  updated_on: Date
});
const Book = mongoose.model("Book", BookSchema);

// export it so we can access it from other places
module.exports = mongoose.model("Book", BookSchema);
