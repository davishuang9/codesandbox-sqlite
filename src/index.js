// init project
var express = require("express");
var Sequelize = require("sequelize");
var app = express();
var bodyParser = require("body-parser");

var ReactDom = require("react-dom");
var React = require("react");
// import ReactDOM from "react-dom";
// import React from "react";

import App from "./App";

var rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// Using `public` for static files: http://expressjs.com/en/starter/static-files.html
// app.use(express.static("public"));

// Initial set of users to populate the database with
var defaultUsers = ["default"];
var users = defaultUsers.slice();

// Use bodyParser to parse application/x-www-form-urlencoded form data
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// setup a new database
// using database credentials set in .env
var sequelize = new Sequelize(
  "database",
  process.env.USER,
  process.env.PASSWORD,
  {
    host: "0.0.0.0",
    dialect: "sqlite",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // Data is stored in the file `database.sqlite` in the folder `db`.
    // To prevent the database being copied on fork the db folder has been added to a .gitignore file
    storage: "/sandbox/src/db/database.sqlite"
  }
);

// authenticate with the database
sequelize
  .authenticate()
  .then(function (err) {
    console.log("Connection established.");
    // define new table: 'users'
    User = sequelize.define("users", {
      name: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      }
    });
    setup();
  })
  .catch(function (err) {
    console.log("Unable to connect to database: ", err);
  });

// populate database with default users
function setup() {
  User.sync({ force: true }) // Using 'force: true' for demo purposes. It drops the table users if it already exists and then creates a new one.
    .then(function () {
      // Add default users to the database
      for (var i = 0; i < users.length; i++) {
        // loop through all users
        User.create({ name: users[i], age: 0 }); // create a new entry in the users table
      }
    });
}

// Send user data - used by client.js
app.get("/users", function (request, response) {
  User.findAll().then(function (users) {
    // finds all entries in the users table
    response.send(users); // sends users back to the page
  });
});

// create a new entry in the users table
app.post("/new", urlencodedParser, function (request, response) {
  User.create({ name: request.body.user, age: request.body.age });
  response.redirect("/");
});

// drops the table users if it already exists and creates a new table with just the default users
app.get("/reset", function (request, response) {
  users = defaultUsers.slice();
  setup();
  response.redirect("/");
});

// Serve the root url: http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile("/sandbox/views/index.html");
});

// Listen on port 8080
var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
