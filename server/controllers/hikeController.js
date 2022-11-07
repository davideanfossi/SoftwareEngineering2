'use strict';

const express = require('express');
const {expressValidator, checkSchema , validationResult} = require('express-validator');
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
    async (req, res) => {
        try {
            const result = await hikeService.getAllHikes();
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