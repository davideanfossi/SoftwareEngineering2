'use strict'

const { difficultyType } = require("../models/hikeModel");
const { checkHikeIsWithinCircle } = require("../utils/positionUtils");
import { getPermission, isLoggedIn } from "../controllers/loginController";

class UserHikeService {
    constructor(hikeDAO, pointDAO, userDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for hike service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for hike service!';
        if(!userDAO) 
            throw 'userDAO must be define for user hike service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
        this.userDAO = userDAO;
    }

    getUserHikes = async (pageNumber=1, pageSize=10, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius=0, city, province, email, username, id, role) => {
        try {
            let hikes;
            let returnedHikes;
            let user;
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

            //get user
            if(!id) 
                user = await this.userDAO.getUSerByCredentials(username, email, role);
            else
                user = await this.userDAO.getUserById(id);

            if(id !== undefined || username !== undefined && email !== undefined && role !== undefined) {
                hikes = hikes.filter(hike => {
                    if(isLoggedIn && getPermission(["Local Guide"]))
                        return hike.userId === user.id;
                    else 
                        return null;
                })
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
                    if (checkHikeIsWithinCircle(baseLat, baseLon, radius, hike))
                        return true;
                    else
                        return false;
                });
            } 
            // take only page requested
            returnedHikes = hikes.slice(offset, offset + pageSize);

            const totalPages = Math.ceil(hikes.length / pageSize);

            return { "totalPages": totalPages, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": returnedHikes };
        } catch (err) {
            throw err;
        };
    }
    
    getUserHikesLimits = async (email, username, id, role) => {
        try {
            let user;
            if(!id) 
                user = await this.userDAO.getUSerByCredentials(username, email, role);
            else
                user = await this.userDAO.getUserById(id);
            const res = await this.hikeDAO.getUserMaxData(user.id);
            res.difficultyType = [difficultyType.low, difficultyType.mid, difficultyType.high];
            return res;
        } catch (err) {
            throw err;
        }
    }
} 

module.exports = HikeService;