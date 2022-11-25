'use strict';

const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const DBManager = require("./database/dbManager");
const LoginController = require("./controllers/loginController");


// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(express.json());


// set up and enable cors
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));


app.use(
    session({
      secret: "with great powers comes great responsabilities",
      resave: false,
      saveUninitialized: false,
    })
  );
  
// DB
const dbManager = new DBManager();
dbManager.openConnection();


//Controllers
const loginController = new LoginController(dbManager);

passport.use(
  new LocalStrategy(async function verify(email, password, callback) {
    const user = await loginController.login(email, password); 
    if (!user)
      return callback(null, false, {
        message: "Incorrect username and/or password.",
      });
    return callback(null, user.body);
  })
);

passport.serializeUser((user, cb) => {
  //here we can decide which attribute serialize
  cb(null, {
    id: user.id,
    user: user.username,
  });
});
passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

app.use(passport.authenticate("session"));

const auth = new Auth(dbManager);

//Middleware to check if a user is logged
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) 
    return next();
  return res.status(401).send("Not authenticated");
};


app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user.user,id: req.user.id, });
});

app.post("/logout", (req, res) => {
  if (req.isAuthenticated())
    req.logout(() => {
      res.end();
    });
  else res.end();
});

/********* APIs *********/

app.use("/api", hikeController);




// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));
