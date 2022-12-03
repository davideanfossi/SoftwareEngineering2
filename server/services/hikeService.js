'use strict';

const togeojson = require ('togeojson');
const fs = require ('fs');
const DOMParser = require('xmldom').DOMParser;
const path = require('path');
const {difficultyType} = require("../models/hikeModel");
const {isWithinCircle} = require("../utils/positionUtils");


const config = require("../config.json");

class HikeService {
    constructor(hikeDAO, pointDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for hike service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for hike service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
    }

    getHikes = async (pageNumber=1, pageSize=10, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius=0, city, province) => {
        try {
            let hikes;
            let returnedHikes;
            const offset = (pageNumber - 1) * pageSize; // offset of the page

            if (!minLen && !maxLen && !minTime && !maxTime && !minAscent && !maxAscent && !difficulty)
                    hikes = await this.hikeDAO.getAllHikes();
            else
                hikes = await this.hikeDAO.getHikes(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty);
            
            // get points
            for (const hike of hikes) {
                hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
                hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
                hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(hike.id);
            }

            if(city){
                hikes = hikes.filter(hike => {
                   return hike.startPoint.city === city || hike.endPoint.city === city || hike.referencePoints.some(p => p.city === city);
                });
            }

            if(province){
                hikes = hikes.filter(hike => {
                   return hike.startPoint.province === province || hike.endPoint.province === province || hike.referencePoints.some(p => p.province === province);
                });
            }
            
            // if radius = 0 or not present then the filter is not executed
            if((radius !== 0 && radius !== undefined) && baseLat !== undefined && baseLon !== undefined){
                // filer all hikes with start point, end point or reference points inside the radius
                hikes = hikes.filter(hike => {
                    if (isWithinCircle(baseLat, baseLon, hike.startPoint.latitude, hike.startPoint.longitude, radius) 
                        || isWithinCircle(baseLat, baseLon, hike.endPoint.latitude, hike.endPoint.longitude, radius)
                        || hike.referencePoints.some(rp => isWithinCircle(baseLat, baseLon, rp.latitude, rp.longitude, radius)))
                        return true;
                    else
                        return false;
                });
            }

            // take only page requested
            returnedHikes = hikes.slice(offset, offset + pageSize);

            const totalPages = Math.ceil(hikes.length / pageSize);

            return {"totalPages": totalPages, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": returnedHikes};
        } catch (err) {
            throw err;
        }
    };

    getHikesLimits = async () => {
        try {
            const res = await this.hikeDAO.getMaxData();
            res.difficultyType = [difficultyType.low, difficultyType.mid, difficultyType.high];
            return res;
        } catch (err) {
            throw err;
        }
    }

    addHike = async (title, length, expectedTime,ascent, difficulty , description, gpxPath, userId,startLatitude,startLongitude,startAltitude,startPointLabel,startAddress,endLatitude,endLongitude,endAltitude,endPointLabel,endAddress) => {
        try {
            //TODO :  add transaction or delete points in catch when insertHike returns err
            //first insert startPoint and endPoint
            const startPointId=await this.pointDAO.insertPoint(startLatitude,startLongitude,startAltitude,startPointLabel,startAddress)
            const endPointId=await this.pointDAO.insertPoint(endLatitude,endLongitude,endAltitude,endPointLabel,endAddress)
            if(startPointId>0 & endPointId>0)
            {
                const res = await this.hikeDAO.insertHike(title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description, gpxPath, userId);
                return res;
            }
            else
                return false;
           
        } catch (err) {
            throw err;
        }
    }

    getHikeGpx = async (hikeId) => {
        try {
            const hike = await this.hikeDAO.getHike(hikeId);
            if(hike === undefined)
                throw {returnCode: 404, message: "Hike not Found"};
            
            hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
            hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
            hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(hike.id);
            if(hike.gpxPath === null)
                throw {returnCode: 500, message: "Gpx file does not exist"};
            const hikeGpxFile = path.resolve(config.gpxPath, hike.gpxPath);
            if(!fs.existsSync(hikeGpxFile))
                throw {returnCode: 500, message: "Gpx file does not exist"};

            const gpx = new DOMParser().parseFromString(fs.readFileSync(hikeGpxFile, 'utf8'));
            const geoJson = togeojson.gpx(gpx);
            return {"startPoint": hike.startPoint, "endPoint": hike.endPoint,
                "referencePoints": hike.referencePoints,
                "track": geoJson.features[0].geometry.coordinates.map(p => {return {"lat": p[1], "lon": p[0]}})};
        } catch (err) {
            throw err;
        }
    };

}


module.exports = HikeService;