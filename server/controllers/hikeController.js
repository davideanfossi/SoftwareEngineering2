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
    [query('minLen').isInt({ min: 0}), query('maxLen').isInt({ min: 0}),
    query('minTime').isInt({ min: 0}), query('maxTime').isInt({ min: 0}),
    query('minAscent').isInt({ min: 0}), query('maxAscent').isInt({ min: 0}),
    query('difficulty').isString().trim().notEmpty(),
    query('baseLat').isNumeric(), query('baseLon').isNumeric(), query('radius').isInt({ min: 0})],
    async (req, res) => {
        try {
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
            const result = await hikeService.getHikes(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius);
            return res.status(200).json(result);
        } catch (err) {
            switch(err.returnCode){
                case 422:
                    return res.status(422).send(err.message);
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
                return res.status(500).se
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