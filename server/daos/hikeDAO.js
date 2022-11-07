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
            const sql = "SELECT * FROM Hike";
            const res = await this.dbManager.get(sql, []);
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

    
}

module.exports = HikeDAO;