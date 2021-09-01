const express = require("express");
const morgan = require("morgan");
const engine = require("ejs-mate");
const session = require("express-session");

const app = express();

const isAuthenticated = require("./isAuthenticated");
const checkToken = require("./checkToken");

//local session
app.use(
  session({
    secret: "udfhjenfu",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(checkToken());

app.get("/", isAuthenticated, (req, res, next) => {
  res.render("index", {
    user: `Consumer 1 ${JSON.stringify(req.session.user)}`,
    title: "Home",
  });
});

//404 error
app.use((req, res, next) => {
  const err = new Error("Resource Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error({
    message: err.message,
    error: err,
  });
  const statusCode = err.status || 500;
  let message = err.message;

  if (statusCode === 500) {
    message = "Server Error";
  }
  res.status(statusCode).json({ message });
});


const PORT = 3020;

app.listen(PORT, () => {
  console.info(`consumer1 listening on port ${PORT}`);
});