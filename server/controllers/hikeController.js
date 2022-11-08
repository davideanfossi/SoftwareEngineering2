'use strict';

const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();

const DbManager = require("../database/dbManager");
const HikeDAO = require('../daos/hikeDAO');
const HikeService = require("../services/hikeService");

const dbManager = new DbManager("PROD");
const hikeDAO = new HikeDAO(dbManager);
const hikeService = new HikeService(hikeDAO);

router.get('/hikes', [],
    async (req, res) => {
        try {
            // call hikeService
        } catch (err) {
            switch(err.returnCode){
                case 422:
                    return res.status(422).text(err.message);
                default:
                    return res.status(500).end();
            }
        }
    }
);





module.exports = router;