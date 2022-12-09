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
const HikeDAO = require("../daos/hikeDAO");
const PointDAO = require("../daos/pointDAO");
const HikeService = require("../services/hikeService");
const config = require("../config.json");

const dbManager = new DbManager("PROD");
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hikeService = new HikeService(hikeDAO, pointDAO);
const { isLoggedIn, getPermission } = require("./loginController");

router.get(
  "/hikes",
  express.json(),
  [
    query("minLen").optional().isInt({ min: 0 }),
    query("maxLen").optional().isInt({ min: 0 }),
    query("minTime").optional().isInt({ min: 0 }),
    query("maxTime").optional().isInt({ min: 0 }),
    query("minAscent").optional().isInt({ min: 0 }),
    query("maxAscent").optional().isInt({ min: 0 }),
    query("difficulty").optional().isString().trim(),
    query("baseLat").optional().isNumeric(),
    query("baseLon").optional().isNumeric(),
    query("radius").optional().isInt({ min: 0 }),
    query("pageNumber").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send();
      }
      const minLen = req.query.minLen
        ? Number.parseInt(req.query.minLen)
        : undefined;
      const maxLen = req.query.maxLen
        ? Number.parseInt(req.query.maxLen)
        : undefined;
      const minTime = req.query.minTime
        ? Number.parseInt(req.query.minTime)
        : undefined;
      const maxTime = req.query.maxTime
        ? Number.parseInt(req.query.maxTime)
        : undefined;
      const minAscent = req.query.minAscent
        ? Number.parseInt(req.query.minAscent)
        : undefined;
      const maxAscent = req.query.maxAscent
        ? Number.parseInt(req.query.maxAscent)
        : undefined;
      const difficulty = req.query.difficulty
        ? req.query.difficulty
        : undefined;
      const baseLat = req.query.baseLat
        ? Number.parseFloat(req.query.baseLat)
        : undefined;
      const baseLon = req.query.baseLon
        ? Number.parseFloat(req.query.baseLon)
        : undefined;
      const radius = req.query.radius
        ? Number.parseInt(req.query.radius)
        : undefined;
      const pageNumber = req.query.pageNumber
        ? Number.parseInt(req.query.pageNumber)
        : undefined;
      const pageSize = req.query.pageSize
        ? Number.parseInt(req.query.pageSize)
        : undefined;
      const result = await hikeService.getHikes(
        pageNumber,
        pageSize,
        minLen,
        maxLen,
        minTime,
        maxTime,
        minAscent,
        maxAscent,
        difficulty,
        baseLat,
        baseLon,
        radius
      );
      // remove additional data
      result.pageItems.map((hike) => {
        delete hike.startPoint;
        delete hike.endPoint;
        delete hike.referencePoints;
        delete hike.gpxPath;
        delete hike.userId;
      });
      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        default:
          return res.status(500).send();
      }
    }
  }
);

router.get("/hikes/limits", express.json(), async (req, res) => {
  try {
    const result = await hikeService.getHikesLimits();
    return res.status(200).json(result);
  } catch (err) {
    switch (err.returnCode) {
      default:
        return res.status(500).send();
    }
  }
});

router.get("/hikes", express.json(), async (req, res) => {
  try {
    const result = await hikeService.getParkingsStart(hike);
    return res.status(200).json(result);
  } catch (err) {
    switch (err.returnCode) {
      default:
        return res.status(500).send();
    }
  }
});

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

      //hike
      const title = req.body.title;
      const length = Number.parseInt(req.body.length);
      const expectedTime = Number.parseInt(req.body.expectedTime);
      const ascent = Number.parseInt(req.body.ascent);
      const difficulty = req.body.difficulty;
      const description = req.body.description;

      const rootPath = config.gpxPath;
      if (!rootPath) {
        return res.status(500).json("error in reading gpxPath from config");
      }
      const trackingfile = req.files ? req.files.trackingfile : null;
      const gpxFileName = trackingfile
        ? uuidv4() + "-" + trackingfile.name
        : null;
      const gpxPath = trackingfile ? rootPath + gpxFileName : null;

      if (path.extname(trackingfile.name) != ".gpx")
        return res.status(400).json("wrong file type");

      if (trackingfile) {
        //  mv() method places the file inside public directory
        trackingfile.mv(gpxPath, function (err) {
          if (err) {
            return res.status(500).json(err.message);
          }
        });
      }
      const userId = req.user ? req.user.id : 1;

      //startPoint
      const startLatitude = req.body.startLatitude;
      const startLongitude = req.body.startLongitude;
      const startAltitude = req.body.startAltitude;
      const startPointLabel = req.body.startPointLabel;
      const startAddress = req.body.startAddress;

      //endPoint
      const endLatitude = req.body.endLatitude;
      const endLongitude = req.body.endLongitude;
      const endAltitude = req.body.endAltitude;
      const endPointLabel = req.body.endPointLabel;
      const endAddress = req.body.endAddress;

      const result = await hikeService.addHike(
        title,
        length,
        expectedTime,
        ascent,
        difficulty,
        description,
        gpxFileName,
        userId,
        startLatitude,
        startLongitude,
        startAltitude,
        startPointLabel,
        startAddress,
        endLatitude,
        endLongitude,
        endAltitude,
        endPointLabel,
        endAddress
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

router.get(
  "/hikes/:id/track",
  isLoggedIn,
  getPermission(["Hiker", "Local Guide"]),
  [param("id").exists().isInt({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end();
      }
      const result = await hikeService.getHikeGpx(req.params.id);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.message);
        default:
          return res.status(500).end();
      }
    }
  }
);

module.exports = router;
