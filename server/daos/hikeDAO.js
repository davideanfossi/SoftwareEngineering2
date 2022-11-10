'use strict';

const {Hike} = require("../models/hikeModel");

class HikeDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Hike dao!';
        this.dbManager = dbManager;
    }

    getAllHikes = async () => {
        try {
            const sql = "SELECT * FROM Hike ORDER BY id;";
            const res = await this.dbManager.get(sql, []);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.startPointId, r. endPointId, r.description));
        } catch (err) {
            throw err;
        }
    };

    getHikes = async (minLen=0, maxLen=100000, minTime=0, maxTime=100000, minAscent=0, maxAscent=100000, difficulty) => {
        try {
            const sql = difficulty ? 
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) AND difficulty = ? ORDER BY id;" :
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) ORDER BY id;";
            const res = difficulty ? 
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty]) :
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent]);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.startPointId, r. endPointId, r.description));
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
    };

    insertHike = async (title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description ) => {
        try {
            const sql="insert into Hike(title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description) values(?,?,?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description], true);
            return res;
        } catch (err) {
            throw err;
        }
    };
    
}

module.exports = HikeDAO;