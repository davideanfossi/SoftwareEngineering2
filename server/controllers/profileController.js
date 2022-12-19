"use strict"

const express = require("express");
const router = express.Router();
const { param, body, validationResult} = require("express-validator");

const utc = require('dayjs/plugin/utc');
const dayjs = require("dayjs");
dayjs.extend(utc);

const DbManager = require("../database/dbManager");
const HikeDAO = require("../daos/hikeDAO");
const PointDAO = require("../daos/pointDAO");
const UserDAO = require("../daos/userDAO");
const ProfileService = require("../services/profileService");
const config = require("../config.json");
const { isLoggedIn, getPermission } = require("./loginController");

const dbManager = new DbManager("PROD");
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const userDAO = new UserDAO(dbManager);
const profileService = new ProfileService(hikeDAO, pointDAO, userDAO);

router.get(
    "/user-hikes",
    isLoggedIn,
    getPermission(["Local Guide"]),
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
            const result = await profileService.getUserHikes({minLen, maxLen}, {minTime, maxTime}, {minAscent, maxAscent}, difficulty, req.user.id, {baseLat, baseLon, radius}, {pageNumber,pageSize});
            // remove additional data
            result.pageItems.map((hike) => {
                delete hike.startPoint;
                delete hike.endPoint;
                delete hike.referencePoints;
                delete hike.gpxPath;
            });
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).send();
        }
    }
);

router.get("/user-hikes/limits",
    isLoggedIn, getPermission(["Local Guide"]),
    async (req, res) => {
        try {
            const result = await profileService.getUserHikesLimits(req.user.id);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).send();
        }
    });

router.post("/user/record/hikes/:id",
    // isLoggedIn, getPermission(["Hiker"]),
    [param("id").exists().isInt({ min: 1 }),
    body("type").exists().isString().isIn(["start", "end"]),
    body("dateTime").exists().isISO8601()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send();
            }

            const type = req.body.type;
            const dateTime = dayjs(req.body.dateTime).utc().format();
            await profileService.recordHike(Number.parseInt(req.params.id), req.user ? req.user.id : 3, type, dateTime);
            // handle utc -> const local = dayjs(date);
            // const utc = dayjs(date).utc().format();
            return res.status(201).json();
        } catch (err) {
            console.log(err);
            switch (err.returnCode) {
                case 404:
                    return res.status(404).send(err.message);
                case 409:
                    return res.status(409).send(err.message);
                default:
                    return res.status(500).send();
            }
        }
    });

    router.get("/user/record/hikes/:id",
    // isLoggedIn, getPermission(["Hiker"]),
    [param("id").exists().isInt({ min: 1 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send();
            }
            const result = await profileService.getRecordedHike(Number.parseInt(req.params.id), req.user ? req.user.id : 3);
            delete result.userId;
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch (err.returnCode) {
                case 404:
                    return res.status(404).send(err.message);
                case 422:
                    return res.status(422).send(err.message);
                default:
                    return res.status(500).send();
            }
        }
    });
    

module.exports = router;