'use strict';

const {difficultyType} = require("../models/hikeModel");

class HikeService {
    constructor(hikeDAO, pointDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for hike service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for hike service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
    }

    getHikes = async (minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, centerPointLat, centerPointLon, radius) => {
        try {
            // console.log(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, centerPointLat, centerPointLon, radius);
            let hikes;
            if (minLen === undefined && maxLen === undefined && minTime === undefined && maxTime === undefined 
                && minAscent === undefined && maxAscent === undefined && difficulty === undefined)
                hikes = await this.hikeDAO.getAllHikes();
            else
                hikes = await this.hikeDAO.getHikes(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty);
            
            for (const hike of hikes) {
                hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
                hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
                // hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(hike.id);
            }
            
            if(centerPointLat !== undefined && centerPointLon !== undefined && radius !== undefined){
                hikes = hikes.filter(hike => {
                    console.log(calculateDistanceBetweenTwoLatLongsInKm(hike.startPoint.latitude, hike.startPoint.longitude, centerPointLat, centerPointLon));
                    return calculateDistanceBetweenTwoLatLongsInKm(hike.startPoint.latitude, hike.startPoint.longitude, centerPointLat, centerPointLon) <= radius;
                });
            }

            
            return hikes;
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


}


function calculateDistanceBetweenTwoLatLongsInKm(lat1, lon1, lat2, lon2) {
  const a = 0.5 - Math.cos((lat2 - lat1) * Math.PI) / 2 +
    Math.cos(lat1 * Math.PI) * Math.cos(lat2 * Math.PI) * (1 - Math.cos((lon2 - lon1) * Math.PI)) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
}


module.exports = HikeService;