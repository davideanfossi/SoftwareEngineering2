"use strict";

const express = require("express");
const {expressValidator, check, query, body, param, validationResult} = require("express-validator");
const router = express.Router();

const DbManager = require("../database/dbManager");
const PointDAO = require("../daos/pointDAO");
const ParkingDAO = require("../daos/parkingDAO");
const ParkingService = require("../services/parkingService");
const config = require("../config.json");

const dbManager = new DbManager("PROD");
const pointDAO = new PointDAO(dbManager);
const parkingDAO = new ParkingDAO(dbManager);
const parkingService = new ParkingService(parkingDAO, pointDAO);
const { isLoggedIn, getPermission } = require("./loginController");


router.post(
    "/parking",
    isLoggedIn,
    getPermission(["Local Guide"]),
  
    [
      body("name").notEmpty().isString().trim(),
      body("numSpots").notEmpty().isInt({ min: 0}),
      body("hasFreeSpots").notEmpty().isInt({ min: 0}),
      body("pointId").notEmpty().isInt({ min: 0}),
      body("ownerId").notEmpty().isInt({ min: 0}),
  
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).end();
        }

      //parking
      const name = req.body.name;
      const numSpots = Number.parseInt(req.body.numSpots);
      const hasFreeSpots = Number.parseInt(req.body.hasFreeSpots);
      const pointId = Number.parseInt(req.body.pointId);
      const ownerId = Number.parseInt(req.body.ownerId);

      const result = await parkingService.addParking(
        name,
        numSpots,
        hasFreeSpots,
        pointId,
        ownerId,
      );
      if (!result) return res.status(500).end();
      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        default:
          return res.status(500).json(err.message);
      }
    }
  }
);


module.exports = router;        