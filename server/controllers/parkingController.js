"use strict";

const express = require("express");
const {expressValidator, check, query, body, param, validationResult} = require("express-validator");
const router = express.Router();

const DbManager = require("../database/dbManager");
const PointDAO = require("../daos/pointDAO");
const ParkingDAO = require("../daos/parkingDAO");
const ParkingService = require("../services/parkingService");
const config = require("../config.json");
const fileUpload=require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const dbManager = new DbManager("PROD");
const pointDAO = new PointDAO(dbManager);
const parkingDAO = new ParkingDAO(dbManager);
const parkingService = new ParkingService(parkingDAO, pointDAO);
const { isLoggedIn, getPermission } = require("./loginController");
const { isWithinCircle, checkHikeIsWithinCircle, checkParkingIsWithinCircle5 } = require("../utils/positionUtils");


router.post(
    "/parking",
    isLoggedIn,
    getPermission(["Local Guide"]),
    fileUpload({ createParentPath: true }),
  
    [
      body("name").notEmpty().isString().trim(),
      body("numSpots").notEmpty().isInt({ min: 0}),
      body("hasFreeSpots").notEmpty().isInt({ min: 0}),
      body("ownerId").notEmpty().isInt({ min: 0}),

      body("longitude").notEmpty().isString().trim(),
      body("latitude").notEmpty().isString().trim(),
      body("altitude").notEmpty().isString().trim(),
      body("pointLabel").notEmpty().isString().trim(),
      body("address").optional().isString().trim(),

      body('image').optional(),
  
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

      const rootPath = config.parkingImagesPath;
        if (!rootPath) {
          return res.status(500).json("error in reading parkingImagesPath from config");
        }
        const image = req.files ? req.files.image : null;
        const imageName = image ? uuidv4() + '-' + image.name : null;
        const imagePath = image ? rootPath + imageName : null;

        if (image) {
          //  mv() method places the file inside public directory
          image.mv(imagePath, function (err) {
            if (err) {
              return res.status(500).json(err.message);
            }
          });
        }  
      
      const ownerId = req.user.id; 

      //parkingPoint
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      const altitude = req.body.altitude;
      const pointLabel = req.body.pointLabel;
      const address = req.body.address;

      const result = await parkingService.addParking(
        name,
        ownerId,       
        numSpots,
        hasFreeSpots,
        latitude,
        longitude,
        altitude,
        pointLabel,
        address,
        imageName       
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