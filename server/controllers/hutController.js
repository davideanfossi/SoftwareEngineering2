'use strict';

const express = require('express');
const {expressValidator, check, param,query,body, validationResult} = require('express-validator');
const router = express.Router();
const fileUpload=require('express-fileupload');

const { v4: uuidv4 } = require('uuid');
const path = require('path');

const DbManager = require("../database/dbManager");
const HutDAO = require('../daos/hutDAO');
const PointDAO = require("../daos/pointDAO");
const HutService = require("../services/hutService");
const config = require("../config.json");
const { isLoggedIn, getPermission } = require("./loginController");

const dbManager = new DbManager("PROD");
const hutDAO = new HutDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hutService = new HutService(hutDAO, pointDAO);


router.post('/hut',
isLoggedIn,
getPermission(["Local Guide"]),
fileUpload({createParentPath: true}),
[
    body('name').notEmpty().isString().trim(), 
    body('numOfBeds').notEmpty().isInt({ min: 0}), 
    body('description').optional().isString().trim(),
    check('phoneNumber').notEmpty().isString().trim(), 
    check('email').notEmpty().isString().trim(),
    check('website').optional().isString().trim(), 

    body('longitude').optional().isString().trim(), 
    body('latitude').optional().isString().trim(),  
    body('altitude').optional().isString().trim(), 
    body('address').optional().isString().trim(),

    body('image').optional()
],  
    async(req,res) => {
        try {
              const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).end();
            }  

            //hike 
            const name=req.body.name;
            const bedCounts =  Number.parseInt(req.body.numOfBeds);
            const description=req.body.description;
            const phoneNumber=req.body.phoneNumber;
            const email=req.body.email;
            const website=req.body.website;
            
            const rootPath=config.hutImagesPath;
            if (!rootPath) {
                return res.status(500).json("error in reading hutImagesPath from config");
            }
            const image =req.files ? req.files.image : null;
            const imageName=image ?  uuidv4()+'-'+image.name  : null;
            const imagePath=image ? rootPath + imageName : null;
            
            if(image)
            {
                //  mv() method places the file inside public directory
                image.mv(imagePath, function (err) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                });
            }   
            const userId=req.user? req.user.id : 1;

            //Point
            const latitude=req.body.latitude;
            const longitude=req.body.longitude;
            const altitude=req.body.altitude;
            const pointLabel=req.body.name;
            const address=req.body.address;
            
            
            const result = await hutService.addHut(name,bedCounts,description,phoneNumber,email,website,userId,latitude,longitude,altitude,pointLabel,address,imageName);
            if(!result)
                return res.status(500).end();
            return res.status(201).json(result);
        } catch (err) {
            switch(err.returnCode){
                default:
                    return res.status(500).json(err.message);
            }
        }
    });

    router.get("/userhuts",
    isLoggedIn,
    getPermission(["Local Guide"]),
    express.json(), 
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

                const userId=req.user.id;
                const result = await hutService.getHutbyUserId({userId},{ minNumOfBeds, maxNumOfBeds }, { minAltitude, maxAltitude }, { baseLat, baseLon, radius }, { pageNumber, pageSize });
                // remove additional data
                result.pageItems.map((hut) => {
                    delete hut.userId;
                });
                return res.status(200).json(result);
          
        } catch (err) {
            switch (err.returnCode) {
                case 401:
                  return res.status(401).send(err.message);
                default:
                  return res.status(500).end();
        }
    }
      });

    router.get(
        "/hut/:id",
        isLoggedIn,
        getPermission(["Local Guide"]),
        [param("id").exists().isInt({ min: 1 })],
        async (req, res) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).end();
            }
            const result = await hutService.getHut(req.params.id);
            return res.status(200).json(result);
          } catch (err) {
                return res.status(500).end();
          }
        }
      );


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
        return res.status(500).send();
    }
});


module.exports = router;
