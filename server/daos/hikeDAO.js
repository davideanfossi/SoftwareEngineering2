'use strict';

const { Hike } = require("../models/hikeModel");
const { RecordedHike } = require("../models/recordedHikesModel"); 

class HikeDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Hike dao!';
        this.dbManager = dbManager;
    }

    getAllHikes = async () => {
            const sql = "SELECT * FROM Hike ORDER BY id;";
            const res = await this.dbManager.get(sql, []);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.description, r.userId, r.gpxPath, r.startPointId, r.endPointId, []));
    };

    getHikes = async (minLen = 0, maxLen = 100000, minTime = 0, maxTime = 100000, minAscent = 0, maxAscent = 100000, difficulty=undefined) => {
            const sql = difficulty ?
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) AND difficulty = ? ORDER BY id;" :
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) ORDER BY id;";
            const res = difficulty ?
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty]) :
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent]);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.description, r.userId, r.gpxPath, r.startPointId, r.endPointId, []));
    };

    getHike = async (id) => {
            const sql = "SELECT * FROM Hike WHERE id = ?";
            const res = await this.dbManager.get(sql, [id], true);
            return res ? new Hike(res.id, res.title, res.length, res.expectedTime, res.ascent, res.difficulty, res.description, res.userId, res.gpxPath, res.startPointId, res.endPointId, [])
                : undefined;
    };

    getMaxData = async () => {
            const sql = "SELECT max(length) AS maxLength, max(expectedTime) as maxExpectedTime, max(ascent) AS maxAscent FROM Hike";
            const res = await this.dbManager.get(sql, [], true);
            return res;
    }

    getUserMaxData = async (userId) => {
            const sql = "SELECT max(length) AS maxLength, max(expectedTime) as maxExpectedTime, max(ascent) AS maxAscent FROM Hike WHERE userId = ?";
            const res = await this.dbManager.get(sql, [userId], true);
            return res;
    }

    insertHike = async (hike) => {
            const sql = "insert into Hike(title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description, gpxPath, userId) values(?,?,?,?,?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [hike.title, hike.length, hike.expectedTime, hike.ascent, hike.difficulty, hike.startPoint, hike.endPoint, hike.description, hike.gpxPath, hike.userId]);
            return res;
    };

    getCompletedHikes = async (userId) => {
        const sql = "SELECT RecordedHike.id AS recordedHikeId, RecordedHike.startDateTime, RecordedHike.endDateTime, Hike.id, Hike.title, Hike.lenght, Hike.difficulty, Hike.ascent, Hike.expectedTime, Hike.startPoint, Hike.endPoint, Hike.gpxPath, Hike.description FROM RecordedHike JOIN Hike ON RecordedHike.hikeId = Hike.id WHERE userId = ? AND endDateTime IS NOT NULL";
        const res = await this.dbManager.get(sql, [userId], true);
        return res.map(r => new RecordedHike(r.recordedHikeId, r.userId, r.startDateTime, r.endDateTime, new Hike(r.title, r.lenght, r.expectedTime, r.ascent, r.difficulty, r.description, r.userId, r.startPoint, r.endPoint, r.gpxPath, []))); 
    }

}

module.exports = HikeDAO;