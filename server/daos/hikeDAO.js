'use strict';

const {Hike} = require("../models/hikeModel");

class HikeDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Hike dao!';
        this.dbManager = dbManager;
    }

    getAllHikes = async (offset, limit) => {
        try {
            const pagination = offset !== undefined && limit !== undefined;
            const sql = pagination ? "SELECT * FROM Hike ORDER BY id LIMIT ? OFFSET ?;" : "SELECT * FROM Hike;";
            const res = pagination ?  await this.dbManager.get(sql, [limit, offset]) : await this.dbManager.get(sql, []);
            return res.map(r => new Hike(r.id, r.title, r.length, r.expectedTime, r.ascent, r.difficulty, r.startPointId, r. endPointId, r.description));
        } catch (err) {
            throw err;
        }
    };

    getHikes = async (minLen=0, maxLen=100000, minTime=0, maxTime=100000, minAscent=0, maxAscent=100000, difficulty, offset, limit) => {
        try {
            const sql = difficulty ? 
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) AND difficulty = ? ORDER BY id LIMIT ? OFFSET ?;" :
                "SELECT * FROM Hike WHERE (length >= ? AND length <= ?) AND (expectedTime >= ? AND expectedTime <= ?) AND (ascent >= ? AND ascent <= ?) ORDER BY id LIMIT ? OFFSET ?;";
            const res = difficulty ? 
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, limit, offset]) :
                await this.dbManager.get(sql, [minLen, maxLen, minTime, maxTime, minAscent, maxAscent, limit, offset]);
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
    }

    countHikes = async () => {
        try {
            const sql = "SELECT count(id) AS n FROM Hike";
            const res = await this.dbManager.get(sql, [], true);
            return res.n;
        } catch (err) {
            throw err;
        }
    }

    
}

module.exports = HikeDAO;