'use strict';

const express = require('express');
const { expressValidator, check, query, body, validationResult } = require('express-validator');
const router = express.Router();
const fileUpload = require('express-fileupload');

const { v4: uuidv4 } = require('uuid');
const path = require('path');

const DbManager = require("../database/dbManager");
const HutDAO = require('../daos/hutDAO');
const PointDAO = require("../daos/pointDAO");
const HutService = require("../services/hutService");
const config = require("../config.json");

const dbManager = new DbManager("PROD");
const hutDAO = new HutDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hutService = new HutService(hutDAO, pointDAO);


router.get("/huts",
    [query("minNumOfBeds").optional().isInt({ min: 0 }),
    query("maxNumOfBeds").optional().isInt({ min: 0 }),
    query("minAltitude").optional().isInt({ min: 0 }),
    query("maxAltitude").optional().isInt({ min: 0 }),
    query("baseLat").optional().isNumeric(),
    query("baseLon").optional().isNumeric(),
    query("radius").optional().isInt({ min: 0 }),
    query("pageNumber").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send("Bad request");
            }
            const minNumOfBeds = req.query.minNumOfBeds ? Number.parseInt(req.query.minNumOfBeds) : undefined;
            const maxNumOfBeds = req.query.maxNumOfBeds ? Number.parseInt(req.query.maxNumOfBeds) : undefined;
            const minAltitude = req.query.minAltitude ? Number.parseInt(req.query.minAltitude) : undefined;
            const maxAltitude = req.query.maxAltitude ? Number.parseInt(req.query.maxAltitude) : undefined;
            const baseLat = req.query.baseLat ? Number.parseFloat(req.query.baseLat) : undefined;
            const baseLon = req.query.baseLon ? Number.parseFloat(req.query.baseLon) : undefined;
            const radius = req.query.radius ? Number.parseInt(req.query.radius) : undefined;
            const pageNumber = req.query.pageNumber ? Number.parseInt(req.query.pageNumber) : undefined;
            const pageSize = req.query.pageSize ? Number.parseInt(req.query.pageSize) : undefined;
            const result = await hutService.getHuts({ minNumOfBeds, maxNumOfBeds }, { minAltitude, maxAltitude }, { baseLat, baseLon, radius }, { pageNumber, pageSize });
            // remove additional data
            result.pageItems.map((hut) => {
                delete hut.userId;
            });
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch (err.returnCode) {
                default:
                    return res.status(500).send();
            }
        }
    }
);


router.get("/huts/limits", async (req, res) => {
    try {
        const result = await hutService.getHutsLimits();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


module.exports = router;