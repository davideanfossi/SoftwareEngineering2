'use strict';

const Hut = require("../models/hutModel");

class HutDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for hutdao!';
        this.dbManager = dbManager;
    }

    getAllHuts = async () => {
        const sql = "SELECT * FROM Hut";
        const res = await this.dbManager.get(sql, []);
        return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId));
    }

    getHuts = async (minNumOfBeds = 0, maxNumOfBeds = 10000) => {
        const sql = "SELECT * FROM Hut WHERE (numOfBeds >= ? AND numOfBeds <= ?)";
        const res = await this.dbManager.get(sql, [minNumOfBeds, maxNumOfBeds]);
        return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId));
    }

    getHut = async (hutId) => {
        let sql = "SELECT * FROM hut WHERE id = ?";
        const res = await this.dbManager.get(sql, [hutId], true);
        return new Hut(res.id, res.name, res.numOfBeds, res.phoneNumber, res.email, res.description, res.website, res.pointId, res.ownerId);
    }

    getHutImages = async (hutId) => {
        let sql = "SELECT imageName FROM HutImages WHERE hutId = ?";
        const res = await this.dbManager.get(sql, [hutId]);
        return res.map(r => r.imageName);
    }

    getMaxData = async () => {
        const sql = "SELECT max(numOfBeds) AS maxNumOfBeds, max(altitude) AS maxAltitude FROM Hut H, Points P WHERE H.pointId = P.id";
        const res = await this.dbManager.get(sql, [], true);
        res.maxAltitude = Math.round(res.maxAltitude);
        return res;
    }

}

module.exports = HutDAO;