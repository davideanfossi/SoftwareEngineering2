'use strict'

const { difficultyType } = require("../models/hikeModel");
const { checkHikeIsWithinCircle } = require("../utils/positionUtils");
const RecordedHike = require("../models/recordedHike");

const utc = require('dayjs/plugin/utc');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const dayjs = require("dayjs");
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

class ProfileService {
    constructor(hikeDAO, pointDAO, userDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for profile service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for profile service!';
        if (!userDAO)
            throw 'userDAO must be define for profile service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
        this.userDAO = userDAO;
    }

    getUserHikes = async ({ minLen, maxLen }, { minTime, maxTime }, { minAscent, maxAscent }, difficulty, userId, { baseLat, baseLon, radius = 0 }, { pageNumber = 1, pageSize = 10 }) => {
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
        await this.#checkInvalidDateRecodedHike(userId, dateTime);
        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
            throw { returnCode: 404, message: "Hike not found" };

        const ongoingHike = await this.userDAO.getOngoingRecordedHike(userId);

        if (recordType === "start") {
            if (ongoingHike !== undefined)
                throw { returnCode: 409, message: "Only one Hike can be started at the same time" };

            result = await this.userDAO.insertRecordedHike(new RecordedHike(undefined, hikeId, userId, dateTime, null));
        }
        else if (recordType === "end") {
            if (ongoingHike === undefined)
                throw { returnCode: 409, message: "Hike not started yet" };
            if (ongoingHike.hikeId === hikeId) {
                const startDateTime = dayjs(ongoingHike.startDateTime).utc();
                const endDateTime = dayjs(dateTime).utc();
                if (startDateTime.isSameOrAfter(endDateTime))
                    throw { returnCode: 409, message: "End dateTime must be after starting dateTime" };
                ongoingHike.endDateTime = dateTime;
                result = await this.userDAO.updateRecordedHike(ongoingHike);
            }
        }

        return result;
    };

    getRecordedHikes = async (hikeId, userId) => {
        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
            throw { returnCode: 422, message: "Hike not found" };
        const recordedHikes = await this.userDAO.getRecordedHikes(hikeId, userId);
        return recordedHikes;
    };

    getLastRecordedHike = async (hikeId, userId) => {
        const recordedHike = await this.userDAO.getOngoingRecordedHike(userId);
        if (recordedHike === undefined || recordedHike.hikeId !== hikeId)
            throw { returnCode: 404, message: "Recoded Hike not found" };
        return recordedHike;
    }

    #checkInvalidDateRecodedHike = async (userId, dateTime) => {
        const dateToValidate = dayjs(dateTime);
        if (dateToValidate.isAfter(dayjs()))
            throw { returnCode: 409, message: "DateTime cannot be a future date" };

        const completedHikes = await this.hikeDAO.getCompletedHikes(userId);
        for (const ch of completedHikes) {
            if (dateToValidate.isAfter(dayjs(ch.startDateTime)) && dateToValidate.isBefore(dayjs(ch.endDateTime)))
                throw { returnCode: 409, message: "DateTime overlaps with another completed hike" };
        }
    }

}


module.exports = ProfileService; 