'use strict';

const togeojson = require('togeojson');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const path = require('path');
const { isWithinCircle } = require("../utils/positionUtils");

const config = require("../config.json");

class HikeHutService {

    constructor(hikeHutDAO,hikeDAO,hutDAO,pointDAO) {
        if (!hikeHutDAO)
            throw new Error('hikeHutDAO must be defined for HikeHutService!');
        if (!hikeDAO)
            throw new Error('hikeDAO must be defined for HikeHutService!');
        if (!hutDAO)
            throw new Error('hutDAO must be defined for HikeHutService!');
        if (!pointDAO)
            throw new Error('pointDAO must be defined for HikeHutService!');
        this.hikeHutDAO = hikeHutDAO;
        this.hikeDAO=hikeDAO;
        this.hutDAO=hutDAO;
        this.pointDAO=pointDAO;
    }

    getHutLinkedToHike = async (hikeId) => {
        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
        throw {
            returnCode: 404, msg: "hike not found"
        }

        const res = await this.hikeHutDAO.getHikeLinkedHutsAsStartEnd(hikeId);
        return res;
    };

    linkHutAsStartEndToHike = async (hikeId,hutId,startPoint,endPoint) => {

        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
            throw {
                returnCode: 404, msg: "hike not found"
            }

        const hut = await this.hutDAO.getHut(hutId);
        if (!hut)
            throw {
                    returnCode: 404, msg: "hut not found"
            }

        const hikeHut= await this.hikeHutDAO.getHikeHut(hikeId,hutId);
        let res;
        if(!hikeHut)
        {
            res = await this.hikeHutDAO.insertHikeHut(hikeId,hutId,startPoint,endPoint,undefined);
            return res;
        }
        else
        {
            res = await this.hikeHutDAO.updateHikeHutStartEnd(hikeId,hutId,startPoint,endPoint);
            return res;
        }
                
        
           
    }

    linkHutToHike=async(hikeId,hutId)=>{

        //check if hike exists
        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
            throw {
                returnCode: 404, msg: "hike not found"
            }
        
        //check if hut exists
        const hut = await this.hutDAO.getHut(hutId);
        if (!hut)
            throw {
                    returnCode: 404, msg: "hut not found"
            }

        //check if hut is already linked to the hike
        const hikeHut= await this.hikeHutDAO.getHikeHut(hikeId,hutId);
        if(hikeHut && hikeHut.isLinked)
            throw  "hut is already linked to the hike" ;
        else  // link hut to the hike
        {
            const radius = 5;

            hut.point = await this.pointDAO.getPoint(hut.point);

            
            if (hike.gpxPath === null)
                throw { returnCode: 500, message: "Gpx file does not exist" };
            const hikeGpxFile = path.resolve(config.gpxPath, hike.gpxPath);
            if (!fs.existsSync(hikeGpxFile))
                throw { returnCode: 500, message: "Gpx file does not exist" };

            const gpx = new DOMParser().parseFromString(fs.readFileSync(hikeGpxFile, 'utf8'));
            const geoJson = togeojson.gpx(gpx);

            // compare distance of hut point with all points of the hike
            geoJson.features[0].geometry.coordinates.forEach(element => {
                console.log(element[1], element[2])
                if (!isWithinCircle(element[1], element[2], hut.point.latitude, hut.point.longitude, radius))
                {
                    throw { returnCode:422 , message : "hut is not located near the hike" } ;
                }
                    
            });

            let res;
            //if there is not any record for this hike and hut in the table insert new record
            if(!hikeHut)
            {
                res = await this.hikeHutDAO.insertHikeHut(hikeId,hutId,undefined,undefined,true);
                return res;
            }
            //otherwise update existing record
            else
            {
                res = await this.hikeHutDAO.updateHikeHutIsLinked(hikeId,hutId,true);
                return res;
            }

        }
            

    }


}

module.exports = HikeHutService;