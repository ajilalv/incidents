const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const passport = require("./routes/passport.js");

//Routes
var indexRouter = require("./routes/index.js");
var incidentsRouter = require("./routes/incidents.js");
var userRouter = require("./routes/user.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

app.use(
  require("express-session")({
    secret: "hello",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

//route mapping
app.use("/", indexRouter);
app.use("/incidents", incidentsRouter);
app.use("/user", userRouter);

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
  console.log('TENT IS: ',process.env.TENANT_NAME)
});
