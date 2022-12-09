"use strict"

const express = require("express");
const router = express.Router();
const path = require("path");

const DbManager = require("../database/dbManager");
const HikeDAO = require("../daos/hikeDAO");
const PointDAO = require("../daos/pointDAO");
const UserDAO = require("../daos/userDAO");
const UserHikeService = require("../services/userHikeService");
const config = require("../config.json");
const { isLoggedIn } = require("./loginController");

const dbManager = new DbManager("PROD");
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const userDAO = new UserDAO(dbManager);
const userHikeService = new UserHikeService(hikeDAO, pointDAO, userDAO);

router.get(
    "/user-hikes",
    isLoggedIn,
    getPermission(["Local Guide"]),
    [param("id").exists().isInt({ min: 1 })],
    express.json(), async (req, res) => {
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
            const result = await userHikeService.getUserHikes(
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
            });
            return res.status(200).json(result);
            } catch (err) {
                console.log(err);
                return res.status(500).send();
            }
    }
);

router.get("/user-hikes/limits", express.json(), async (req, res) => {
    try {
      const result = await userHikeService.getUserHikesLimits();
      return res.status(200).json(result);
    } catch (err) {
          return res.status(500).send();
    }
  });