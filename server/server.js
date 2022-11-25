'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const DbManager = require("./database/dbManager");
const hikeController = require('./controllers/hikeController');
const authRoutes = require('./controllers/authController');
// init express
const app = express();
const port = 3001;

// Only parse query parameters into strings, not objects
app.set('query parser', 'simple');

// set up the middlewares
app.use(express.json());


// set up and enable cors
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

// connection DB
const dbManager = new DbManager("PROD");
dbManager.openConnection()


/********* APIs *********/
app.use("/api", hikeController);
app.use("/api", authRoutes);


// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));


