"use strict";

const express = require("express");
const { expressValidator, check, query, body, param, validationResult } = require("express-validator");
const { route } = require("./hikeController");
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { isLoggedIn, getPermission } = require("./loginController");

const OPEN_TOPO_DATA = "https://api.opentopodata.org/v1/eudem25m?";

router.get("/altitude",
    [query("lat").isNumeric(), query("lon").isNumeric()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send();
            }
            const queryString = `locations=${req.query.lat},${req.query.lon}`;
            const response = await fetch(`${OPEN_TOPO_DATA}${queryString}`,
                {
                    method: "GET"
                });      
            if (response.ok) {
                const result = await response.json();
                return res.status(200).json({elevation: Math.round(result.results[0].elevation)});
            } else {
                return res.status(500).send();
            }
        } catch (err) {
            return res.status(500).send();
        }
    });

module.exports = router;