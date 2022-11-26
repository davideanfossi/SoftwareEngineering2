'use strict';
require('dotenv').config();
const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const DbManager = require("./database/dbManager");
const hikeController = require('./controllers/hikeController');
const {login, getPermission} = require('./controllers/loginController');
const authRoutes = require('./controllers/authController');
const UserDAO = require("./daos/userDAO");
// init express
const app = express();
const port = 3001;

// Only parse query parameters into strings, not objects
app.set('query parser', 'simple');
app.use(morgan('dev'));
// set up the middlewares
app.use(express.json());

app.use(
    session({
      secret: "with great powers comes great responsabilities",
      resave: false,
      saveUninitialized: false,
    })
);
  
// set up and enable cors
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));
  
passport.use(
    new LocalStrategy(async function verify(email, password, callback) {
        const user = await login(email, password);
        if (!user)
            return callback(null, false, {
                message: "Incorrect username and/or password.",
            });
        return callback(null, user.body);
    })
);

passport.serializeUser((user, cb) => {
  cb(null, {
    id: user.id,
    user: user.username,
    role: user.role,
  });
});

passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

app.use(passport.authenticate("session"));

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user.user, id: req.user.id });
});

app.post("/api/logout", (req, res) => {
  if (req.isAuthenticated())
    req.logout(() => {
      res.end();
    });
  else res.end();
});


// connection DB
const dbManager = new DbManager("PROD");
dbManager.openConnection()

/********* APIs *********/
app.use("/api", hikeController);
app.use("/api", authRoutes);


// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));
