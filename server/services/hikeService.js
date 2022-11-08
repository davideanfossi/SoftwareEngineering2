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

    getHikes = async (minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius) => {
        try {
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
            
            if(baseLat !== undefined && baseLon !== undefined && radius !== undefined){
                hikes = hikes.filter(hike => 
                    isWithinCircle(baseLat, baseLon, hike.startPoint.latitude, hike.startPoint.longitude, radius)
                );
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

// compute the distance in kilometers between two points
function computeDistance(lat1, lon1, lat2, lon2) {
    const deg2rad = (deg) => deg * (Math.PI/180);
    const rad2deg = (rad) => rad * (180.0 / Math.PI);
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        const theta = lon1 - lon2;
        let dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
        dist = rad2deg(Math.acos(dist));
        let km = dist * 60 * 1.1515 * 1.609344;
        return km;
    }
}

/**
 * @param {*} baseLat latitude of the center of the circle
 * @param {*} baseLng longitude of the center of the circle
 * @param {*} lat latitude of the point to check
 * @param {*} lng longitude of the point to check
 * @param {*} radius radius in km
 * @returns true if the point is inside the radius, otherwise false
 */
function isWithinCircle(baseLat, baseLng, lat, lng, radius){
    // console.log(computeDistance(baseLat, baseLng, lat, lng));
    return computeDistance(baseLat, baseLng, lat, lng) <= radius;
}

module.exports = HikeService;