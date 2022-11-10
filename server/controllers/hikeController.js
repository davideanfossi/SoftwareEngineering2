'use strict';

const express = require('express');
const {expressValidator, check, query, validationResult} = require('express-validator');
const router = express.Router();

const jsonValidator = require('jsonschema').Validator;

const DbManager = require("../database/dbManager");
const HikeDAO = require('../daos/hikeDAO');
const PointDAO = require("../daos/pointDAO");
const HikeService = require("../services/hikeService");
const hikeSchema = require("./schemas/hikeSchema"); // hike JSON schema
const hikeListSchema = require("./schemas/hikeListSchema"); // hike list JSON schema

const dbManager = new DbManager("PROD");
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hikeService = new HikeService(hikeDAO, pointDAO);


// middleware hike validator
const hikeValidator = (req, res, next) => {
    const validator = new jsonValidator();
    try {    
        validator.validate(req.body, hikeSchema, { throwError: true }); 
    } 
    catch (error) {   
        return res.status(401).send('Invalid body format: ' + error.message); ;  
    }  
    next();
}

router.get('/hikes', 
    [query('minLen').optional().isInt({ min: 0}), query('maxLen').optional().isInt({ min: 0}),
    query('minTime').optional().isInt({ min: 0}), query('maxTime').optional().isInt({ min: 0}),
    query('minAscent').optional().isInt({ min: 0}), query('maxAscent').optional().isInt({ min: 0}),
    query('difficulty').optional().isString().trim(),
    query('baseLat').optional().isNumeric(), query('baseLon').optional().isNumeric(), query('radius').optional().isInt({ min: 0}),
    query('pageNumber').optional().isInt({min: 1}), query('pageSize').optional().isInt({min: 1})],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(400).end();
            }
            const minLen = req.query.minLen ? Number.parseInt(req.query.minLen) : undefined;
            const maxLen = req.query.maxLen ? Number.parseInt(req.query.maxLen) : undefined;
            const minTime = req.query.minTime ?  Number.parseInt(req.query.minTime) : undefined;
            const maxTime = req.query.maxTime ? Number.parseInt(req.query.maxTime) : undefined;
            const minAscent = req.query.minAscent ? Number.parseInt(req.query.minAscent) : undefined;
            const maxAscent = req.query.maxAscent ? Number.parseInt(req.query.maxAscent) : undefined;
            const difficulty = req.query.difficulty ? req.query.difficulty : undefined;
            const baseLat = req.query.baseLat ? Number.parseFloat(req.query.baseLat) : undefined;
            const baseLon = req.query.baseLon ? Number.parseFloat(req.query.baseLon) : undefined;
            const radius = req.query.radius ? Number.parseInt(req.query.radius) : undefined;
            const pageNumber = req.query.pageNumber ? Number.parseInt(req.query.pageNumber) : undefined;
            const pageSize = req.query.pageSize ? Number.parseInt(req.query.pageSize) : undefined;
            const result = await hikeService.getHikes(pageNumber, pageSize, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius);
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch(err.returnCode){
                default:
                    return res.status(500).end();
            }
        }
});

router.get('/hikes/limits', 
    async (req, res) => {
        try {
            const result = await hikeService.getHikesLimits();
            return res.status(200).json(result);
        } catch (err) {
            switch(err.returnCode){
                default: 
                    return res.status(500).end();
            }
        }
});


// test json validator
router.post('/validator', hikeValidator,
    async (req, res) => {
        try {
            return res.status(200).send("good!");
        } catch (err) {
            switch(err.returnCode){
                default:
                    return res.status(500).end();
            }
        }
});



module.exports = router;