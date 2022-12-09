'use strict';

const express = require('express');
const {expressValidator, check, param,body, validationResult} = require('express-validator');
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
//isLoggedIn,
//getPermission(["Local Guide"]),
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
    body('pointLabel').optional().isString().trim(), 
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
            const pointLabel=req.body.pointLabel;
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
    express.json(), async (req, res) => {
        try {
            if(req.user)
            {
                const result = await hutService.getHutbyUserId(req.user.id);
                return res.status(200).json(result);
            }
            else
                return res.status(401).send();
          
        } catch (err) {
          switch (err.returnCode) {
            default:
              return res.status(500).send();
          }
        }
      });

    router.get(
        "/huts/:id",
       // isLoggedIn,
       // getPermission(["Hiker", "Local Guide"]),
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
            console.log(err);
            switch (err.returnCode) {
              default:
                return res.status(500).end();
            }
          }
        }
      );

    module.exports = router;