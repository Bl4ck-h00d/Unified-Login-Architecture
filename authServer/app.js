const express = require("express");
const morgan = require("morgan");
const engine = require("ejs-mate");
const session = require("express-session");
const routes = require("./routes/router");

const app = express();

app.use(
  session({
    secret: "giortiorj",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use("/auth", routes);

//Home page
app.get("/", (req, res, next) => {
  const user = req.session.user || "unlogged";
  res.render("index", {
    what: `Auth-Server ${user}`,
    title: "Auth-Server | Home",
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
  
  
  const PORT = 3010;
  
  app.listen(PORT, () => {
    console.info(`Auth Server listening on port ${PORT}`);
  });