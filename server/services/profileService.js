'use strict'

const { difficultyType } = require("../models/hikeModel");
const { checkHikeIsWithinCircle } = require("../utils/positionUtils");
const RecordedHike = require("../models/recordedHike");

class ProfileService {
    constructor(hikeDAO, pointDAO, userDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for hike service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for hike service!';
        if (!userDAO)
            throw 'userDAO must be define for user hike service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
        this.userDAO = userDAO;
    }

    getUserHikes = async ({minLen, maxLen}, {minTime, maxTime}, {minAscent, maxAscent}, difficulty, userId, {baseLat, baseLon, radius = 0}, {pageNumber = 1, pageSize = 10}) => {
        let hikes;
        let returnedHikes;
        //let user;
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

        hikes = hikes.filter(hike => {
            return hike.userId === userId;
        })

        // if radius = 0 or not present then the filter is not executed
        if ((radius !== 0 && radius !== undefined) && baseLat !== undefined && baseLon !== undefined) {
            // filer all hikes with start point, end point or reference points inside the radius
            hikes = hikes.filter(hike => checkHikeIsWithinCircle(baseLat, baseLon, radius, hike));
        }
        // take only page requested
        returnedHikes = hikes.slice(offset, offset + pageSize);

        const totalPages = Math.ceil(hikes.length / pageSize);

        return { "totalPages": totalPages, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": returnedHikes };
    }

    getUserHikesLimits = async (userId) => {
        const res = await this.hikeDAO.getUserMaxData(userId);
        res.difficultyType = [difficultyType.low, difficultyType.mid, difficultyType.high];
        return res;
    }


    recordHike = async (hikeId, userId, recordType, dateTime) => {
        let result;
        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
            throw { returnCode: 404, message: "Hike not found" };
        //TODO: check date format stored in the DB
        if (recordType === "start") {
            result = await this.userDAO.insertRecordedHike(new RecordedHike(undefined, hikeId, userId, dateTime, null));
        }
        else if (recordType === "end") {
            const recordedHike = await this.userDAO.getRecordedHike(hikeId, userId);
            recordedHike.endDateTime = dateTime;
            result = await this.userDAO.updateRecordedHike(recordedHike);
        }

        return result;
    };

}


module.exports = ProfileService; 