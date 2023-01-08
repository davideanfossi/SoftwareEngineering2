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
const HutDAO = require("../daos/hutDAO");
const ParkingDAO = require("../daos/parkingDAO");
const HikeHutDAO = require("../daos/hikeHutDAO");
const HikeParkingDAO = require("../daos/hikeParkingDAO");

const HikeService = require("../services/hikeService");
const HikeHutService = require("../services/hikeHutService");
const HikeParkingService = require("../services/hikeParkingService");

const { Hike } = require("../models/hikeModel");
const Point = require("../models/pointModel");
const config = require("../config.json");

const dbManager = new DbManager("PROD");
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hutDAO = new HutDAO(dbManager);
const parkingDAO = new ParkingDAO(dbManager);
const hikeHutDAO = new HikeHutDAO(dbManager);
const hikeParkingDAO = new HikeParkingDAO(dbManager);

const hikeService = new HikeService(hikeDAO, pointDAO, hutDAO, parkingDAO);
const hikeHutService = new HikeHutService(hikeHutDAO);
const hikeParkingService = new HikeParkingService(hikeParkingDAO);

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
        { minLen, maxLen },
        { minTime, maxTime },
        { minAscent, maxAscent },
        difficulty,
        { baseLat, baseLon, radius },
        { pageNumber, pageSize },
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
      return res.status(500).send();
    }
  }
);

router.get("/hikes/limits", express.json(), async (req, res) => {
  try {
    const result = await hikeService.getHikesLimits();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get("/hikes/:id/near-start",
  isLoggedIn,
  getPermission(["Local Guide"]),
  [param("id").exists().isInt({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send();
      }
      const hikeId = Number.parseInt(req.params.id);
      const result = await hikeService.getNearStart(hikeId);
      let hutLinked = await hikeHutService.getHutLinkedToHike(hikeId);
      hutLinked = hutLinked.filter(hikeHut => hikeHut.startPoint).map(h => {return {id: h.hutId, type: "hut"}});
      let parkingLinked = await hikeParkingService.getParkingLinkedToHike(hikeId);
      parkingLinked = parkingLinked.filter(parkingHut => parkingHut.startPoint).map(p => {return {id: p.parkingId, type: "parking"}});

      result.selected = [...hutLinked, ...parkingLinked];

      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.msg);
        default:
          return res.status(500).send();
      }
    }
  });


router.get("/hikes/:id/near-end",
  // isLoggedIn,
  // getPermission(["Local Guide"]),
  [param("id").exists().isInt({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send();
      }
      const hikeId = Number.parseInt(req.params.id);
      const result = await hikeService.getNearEnd(hikeId);
      let hutLinked = await hikeHutService.getHutLinkedToHike(hikeId);
      hutLinked = hutLinked.filter(hikeHut => hikeHut.endPoint).map(h => {return {id: h.hutId, type: "hut"}});
      let parkingLinked = await hikeParkingService.getParkingLinkedToHike(hikeId);
      parkingLinked = parkingLinked.filter(parkingHut => parkingHut.endPoint).map(p => {return {id: p.parkingId, type: "parking"}});

      result.selected = [...hutLinked, ...parkingLinked];
      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.msg);
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
    body('image').optional(),

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
        return res.status(400).send();
      }

      /// save tracking file
      const rootPath = config.gpxPath;
      if (!rootPath) {
        return res.status(500).send("error in reading gpxPath from config");
      }
      const trackingfile = req.files ? req.files.trackingfile : null;
      const gpxFileName = trackingfile
        ? uuidv4() + "-" + trackingfile.name
        : null;
      const gpxPath = trackingfile ? rootPath + gpxFileName : null;

      if (path.extname(trackingfile.name) != ".gpx")
        return res.status(400).send("wrong file type");

      if (trackingfile) {
        //  mv() method places the file inside public directory
        trackingfile.mv(gpxPath, function (err) {
          if (err) {
            return res.status(500).send();
          }
        });
      }
    /// end save tracking file


    ///save image

    const rootHikePath=config.hikeImagesPath;
            if (!rootHikePath) {
                return res.status(500).json("error in reading hikeImagesPath from config");
            }
            const image =req.files ? req.files.image : null;
            const imageName=image ?  uuidv4()+'-'+image.name  : null;
            const imagePath=image ? rootHikePath + imageName : null;
            
            if(image)
            {
                //  mv() method places the file inside public directory
                image.mv(imagePath, function (err) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                });
            }   
            
    /// end save image

    const userId=req.user?req.user.Id:1;
      // define hike
      const hike = new Hike(undefined, req.body.title, Number.parseInt(req.body.length), Number.parseInt(req.body.expectedTime),
        Number.parseInt(req.body.ascent), req.body.difficulty, req.body.description, userId, gpxFileName,undefined,undefined,imageName);

      // define startPoint
      const startPoint = new Point(undefined, req.body.startLatitude, req.body.startLongitude, req.body.startAltitude,
        req.body.startPointLabel, req.body.startAddress);

      // define endPoint
      const endPoint = new Point(undefined, req.body.endLatitude, req.body.endLongitude, req.body.endAltitude,
        req.body.endPointLabel, req.body.endAddress);

      const result = await hikeService.addHike(hike, startPoint, endPoint);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send();
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
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.message);
        default:
          return res.status(500).send();
      }
    }
  }
);

router.get(
  "/hikes/completed",
  isLoggedIn,
  getPermission(["Hiker"]),
  express.json(),
  [
    query("pageNumber").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end();
      }
      const pageNumber = req.query.pageNumber
        ? Number.parseInt(req.query.pageNumber)
        : undefined;
      const pageSize = req.query.pageSize
        ? Number.parseInt(req.query.pageSize)
        : undefined;
      const result = await hikeService.getCompleted(req.user.id, { pageNumber, pageSize });
      //remove additional data
      result.pageItems.map((recordedHike) => {
        delete recordedHike.hike.startPoint;
        delete recordedHike.hike.endPoint;
        delete recordedHike.hike.referencePoints;
        delete recordedHike.hike.gpxPath;
        delete recordedHike.hike.userId;
      });
      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.message);
        default:
          return res.status(500).send();
      }
    }
  }
);

router.post(
  "/hikes/:id/startArrival",
  isLoggedIn,
  getPermission(["Local Guide"]),
  [param("id").exists().isInt({ min: 1 }),
  body("startType").optional().isString().trim(),
  body("startId").optional().isInt({ min: 0 }),
  body("endType").optional().isString().trim(),
  body("endId").optional().isInt({ min: 0 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end();
      }

      const hikeId = Number.parseInt(req.params.id);
      const startType = req.body.startType ? req.body.startType : undefined;
      const endType = req.body.endType ? req.body.endType : undefined;
      const startId = req.body.startId ? Number.parseInt(req.body.startId) : undefined;
      const endId = req.body.endId ? Number.parseInt(req.body.endId) : undefined;

      let result;
      if (startType == "hut")
        result = await hikeHutService.linkHutToHike(hikeId, startId, true, undefined);
      if (endType == "hut")
        result = await hikeHutService.linkHutToHike(hikeId, endId, undefined, true);
      if (startType == "parking")
        result = await hikeParkingService.linkParkingToHike(hikeId, startId, true, undefined);
      if (endType == "parking")
        result = await hikeParkingService.linkParkingToHike(hikeId, endId, undefined, true);

      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.message);
        default:
          return res.status(500).end();
      }
    }
  }
);


router.post(
  "/hikes/referencePoints",
  isLoggedIn,
  getPermission(["Local Guide"]),
  
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end();
      }
      const hikeId = Number.parseInt(req.params.id);
      let refPointList = JSON.parse(req.body.pointList);
      const result = await hikeService.addReference(hikeId, refPointList);

      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.message);
        default:
          return res.status(500).end();
      }
    }
  }
);


router.get("/hikes/limits", async (req, res) => {
  try {
    const result = await hikeService.getHikesLimits();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get(
  "/hikes/:id",
  [param("id").exists().isInt({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end();
      }
      const result = await hikeService.getHike(req.params.id);
      return res.status(200).json(result);
    } catch (err) {
      switch (err.returnCode) {
        case 404:
          return res.status(404).send(err.message);
        default:
          return res.status(500).send();
      }
    }
  }
);

module.exports = router;
