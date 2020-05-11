const chai = require("chai"),
  chaiHttp = require("chai-http"),
  server = require("../server"),
  assert = chai.assert;

chai.use(chaiHttp);

let bookID;

suite("Functional Tests", () => {
  // Each test should completely test the response of
  // the API end-point including response status code!
  // -----[Keep the tests in the same order!]-----
  suite("Routing tests", () => {
    suite(
      // Functional test 1 (POST /api/books with title)
      "POST /api/books with title => create book object/expect book object",
      () => {
        test("Test POST /api/books with title", done => {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "dumitruc" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                "comments",
                "Books should contain comments"
              );

              assert.property(
                res.body,
                "commentcount",
                "Books should contain commentcount"
              );
              assert.property(res.body, "_id", "Books should contain _id");
              assert.property(res.body, "title", "Books should contain title");
              assert.isArray(res.body.comments, "comments should be an array");
              assert.equal(res.body.title, "dumitruc");
              bookID = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", done => {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no title");
              done();
            });
        });
      }
    );

    // Functional test 4 (GET /api/books/[id] with unknown id)
    suite("GET /api/books => array of books", () => {
      test("Test GET /api/books", done => {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books should contain commentcount"
            );
            assert.property(res.body[0], "_id", "Books should contain _id");
            assert.property(res.body[0], "title", "Books should contain title");
            done();
          });
      });
    });

    // Functional test 5 (GET /api/books/[id] with valid/known id)
    suite("GET /api/books/[id] => book object with [id]", () => {
      test("Test GET /api/books/[id] with id not in db", done => {
        chai
          .request(server)
          .get("/api/books/IDoNotExist")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", done => {
        chai
          .request(server)
          .get(`/api/books/${bookID}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(
              res.body,
              "comments",
              "Books should contain comments"
            );

            assert.property(
              res.body,
              "commentcount",
              "Books should contain commentcount"
            );
            assert.property(res.body, "_id", "Books should contain _id");
            assert.property(res.body, "title", "Books should contain title");
            assert.isArray(res.body.comments, "comments should be an array");
            assert.equal(res.body._id, bookID, "Book ID should match given id");
            assert.equal(res.body.title, "dumitruc");
            done();
          });
      });
    });

    suite(
      // Functional test 6 (POST /api/books/[id] with comment)
      "POST /api/books/[id] => add comment/expect book object with id",
      () => {
        test("Test POST /api/books/[id] with comment", done => {
          chai
            .request(server)
            .post(`/api/books/${bookID}`)
            .send({ comment: "dumitruc" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                "comments",
                "Books should contain comments"
              );

              assert.property(
                res.body,
                "commentcount",
                "Books should contain commentcount"
              );
              assert.property(res.body, "_id", "Books should contain _id");
              assert.property(res.body, "title", "Books should contain title");
              assert.isArray(res.body.comments, "comments should be an array");
              assert.equal(
                res.body.commentcount,
                1,
                "commentcount should be 1"
              );
              assert.equal(
                res.body._id,
                bookID,
                "Book ID should match given id"
              );
              assert.equal(
                res.body.title,
                "dumitruc",
                "book title should match"
              );
              assert.equal(
                res.body.comments[0],
                "dumitruc",
                "book comment should match"
              );
              done();
            });
        });
      }
    );

    // Functional test 7 (delete mockup data added by the previous tests)
    suite("DELETE /api/books/[id] => delete a book with a given id", () => {
      test("Test DELETE /api/books/[id]", done => {
        chai
          .request(server)
          .delete(`/api/books/${bookID}`)
          .end((err, res) => {
            assert.equal(res.status, 200);

            assert.equal(
              res.text,
              "delete successful",
              "book should be successfully deleted"
            );

            done();
          });
      });
    });
  });
});
