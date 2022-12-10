'use strict';

const { Hike } = require("../models/hikeModel");

class HikeDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw new Error('DBManager must be defined for Hike dao!');
        this.dbManager = dbManager;
    }

    getAllHikes = async () => {
        try {
            const sql = "SELECT * FROM Hike ORDER BY id;";
            const res = await this.dbManager.get(sql, []);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.description, r.userId, r.gpxPath, r.startPointId, r.endPointId, []));
        } catch (err) {
            throw err;
        }
    };

    getHikes = async (minLen = 0, maxLen = 100000, minTime = 0, maxTime = 100000, minAscent = 0, maxAscent = 100000, difficulty=undefined) => {
        try {
            const sql = difficulty ?
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) AND difficulty = ? ORDER BY id;" :
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) ORDER BY id;";
            const res = difficulty ?
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty]) :
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent]);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.description, r.userId, r.gpxPath, r.startPointId, r.endPointId, []));
        } catch (err) {
            throw err;
        }
    };

    getHike = async (id) => {
        try {
            const sql = "SELECT * FROM Hike WHERE id = ?";
            const res = await this.dbManager.get(sql, [id], true);
            return res ? new Hike(res.id, res.title, res.length, res.expectedTime, res.ascent, res.difficulty, res.description, res.userId, res.gpxPath, res.startPointId, res.endPointId, [])
                : undefined;
        } catch (err) {
            throw err;
        }
    };

    getMaxData = async () => {
        try {
            const sql = "SELECT max(length) AS maxLength, max(expectedTime) as maxExpectedTime, max(ascent) AS maxAscent FROM Hike";
            const res = await this.dbManager.get(sql, [], true);
            return res;
        } catch (err) {

        }
    }

    insertHike = async (hike) => {
        try {
            const sql = "insert into Hike(title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description, gpxPath, userId) values(?,?,?,?,?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [hike.title, hike.length, hike.expectedTime, hike.ascent, hike.difficulty, hike.startPoint, hike.endPoint, hike.description, hike.gpxPath, hike.userId]);
            return res;
        } catch (err) {
            throw err;
        }
    };

}

module.exports = HikeDAO;