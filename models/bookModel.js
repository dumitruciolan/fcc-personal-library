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

// connect to the database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// export model so we can access it from api.js
module.exports = mongoose.model("Book", BookSchema);
