"use strict";

const express = require("express");
const {
  expressValidator,
  check,
  query,
  body,
  param,
  validationResult,
} = require("express-validator");
const router = express.Router();
const fileUpload = require("express-fileupload");

const { v4: uuidv4 } = require("uuid");
const path = require("path");

const DbManager = require("../database/dbManager");
const PointDAO = require("../daos/pointDAO");
const config = require("../config.json");

const dbManager = new DbManager("PROD");
const pointDAO = new PointDAO(dbManager);
const { isLoggedIn, getPermission } = require("./loginController");


router.post(
    "/hike",
    isLoggedIn,
    getPermission(["Local Guide"]),
    fileUpload({ createParentPath: true }),
  
    [
      body("title").notEmpty().isString().trim(),
      body("length").notEmpty().isInt({ min: 0 }),
      body("expectedTime").notEmpty().isInt({ min: 0 }),
      body("ascent").notEmpty().isInt({ min: 0 }),
      body("difficulty").notEmpty().isString().trim(),
      body("description").optional().isString().trim(),
      check("trackingfile").optional(),
  
      body("startLongitude").notEmpty().isString().trim(),
      body("startLatitude").notEmpty().isString().trim(),
      body("endLongitude").notEmpty().isString().trim(),
      body("endLatitude").notEmpty().isString().trim(),
      body("startAltitude").notEmpty().isString().trim(),
      body("endAltitude").notEmpty().isString().trim(),
      body("startPointLabel").notEmpty().isString().trim(),
      body("endPointLabel").notEmpty().isString().trim(),
      body("startAddress").optional().isString().trim(),
      body("endAddress").optional().isString().trim(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).end();
        }
        



module.exports = router;        