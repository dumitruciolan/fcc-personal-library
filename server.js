"use strict";

const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  app = express();

// importing the necessary files
const apiRoutes = require("./routes/api.js"),
  fccTestingRoutes = require("./routes/fcctesting.js"),
  runner = require("./test-runner");

app.use("/public", express.static(process.cwd() + "/public"));

app.use(bodyParser.json());
app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(bodyParser.urlencoded({ extended: true }));

// user stories 1 and 2
const helmet = require("helmet"),
  noCache = require("nocache");
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
app.use(noCache());

app // Index page (static HTML)
  .route("/")
  .get((req, res) => res.sendFile(process.cwd() + "/views/index.html"));

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API
apiRoutes(app);

// 404 Not Found Middleware
app.use((_, res) => {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

// Start our server and tests!
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(() => {
      try {
        runner.run();
      } catch (e) {
        console.log("Tests are not valid: ", e);
      }
    }, 1500);
  }
});

module.exports = app; // for unit/functional testing
