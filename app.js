const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const nocache = require("nocache");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000
require('./googleAuth')
const passport = require('passport');

//importing routes
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const { Passport } = require("passport");

app.use(nocache());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port,()=>{
  console.log("server connected to port 3000");
})

module.exports = app;
