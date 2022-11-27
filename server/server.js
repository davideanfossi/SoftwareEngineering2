'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const DbManager = require("./database/dbManager");
const hikeController = require('./controllers/hikeController');
const { login, getPermission } = require('./controllers/loginController');
const authRoutes = require('./controllers/authController');

// init express
const app = express();
const port = 3001;

// Only parse query parameters into strings, not objects
app.set('query parser', 'simple');
app.use(morgan('dev'));
// set up the middlewares
app.use(express.json());

// set up and enable cors
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(email, password, callback) {
    const user = await login(email, password);
    if (!user || user.err === 401)
        return callback(null, false, {
            message: "Incorrect username and/or password.",
        });
    return callback(null, user);
  })
);

passport.serializeUser((user, cb) => {
    cb(null, {id: user.id, email: user.email, username: user.username, role: user.role});
});

passport.deserializeUser((user, cb) => {
    return cb(null, user);
});


app.use(session({
      secret: "with great powers comes great responsabilities",
      resave: false,
      saveUninitialized: false,
  })
);
app.use(passport.authenticate('session'));

// Login
app.post("/api/sessions", passport.authenticate('local'), (req, res) => {
    res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
    console.log("User: " + req.user);
    if (req.isAuthenticated())
      return res.status(200).json(req.user);
    else
      return res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  try {
    if (req.isAuthenticated())
      req.logout(() => {
        res.status(200).end();
      });
    else
      return res.end();
  } catch (err) {
    return res.status(503).end();
  }
});


// connection DB
const dbManager = new DbManager("PROD");
dbManager.openConnection()

/********* APIs *********/
app.use("/api", hikeController);
app.use("/api", authRoutes);


// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));
