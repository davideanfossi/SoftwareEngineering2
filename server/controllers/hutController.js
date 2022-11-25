'use strict';

const express = require('express');
const {expressValidator, check, query,body, validationResult} = require('express-validator');
const router = express.Router();
const fileUpload=require('express-fileupload');

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

router.post('/hut',fileUpload({createParentPath: true}),

 [
    body('name').notEmpty().isString().trim(), 
    body('numOfBeds').notEmpty().isInt({ min: 0}), 
    body('description').optional().isString().trim(),
    check('image').optional(),

    body('longitude').optional().isString().trim(), 
    body('latitude').optional().isString().trim(),  
    body('altitude').optional().isString().trim(), 
    body('pointLabel').optional().isString().trim(), 
    body('address').optional().isString().trim()
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
            const pointLabel=req.body.pointLabel;
            const address=req.body.address;
            
            
            const result = await hutService.addHut(name,bedCounts,description,imageName,userId,latitude,longitude,altitude,pointLabel,address);
            if(!result)
                return res.status(500).end();
            return res.status(200).json(result);
        } catch (err) {
            switch(err.returnCode){
                default:
                    return res.status(500).json(err.message);
            }
        }
    });

    module.exports = router;