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
        return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId, r.imageName));
    }

    getHuts = async (name = "", minNumOfBeds = 0, maxNumOfBeds = 10000) => {
        const sql = "SELECT * FROM Hut WHERE (numOfBeds >= ? AND numOfBeds <= ?) AND name LIKE '%' || ? || '%'";
        const res = await this.dbManager.get(sql, [minNumOfBeds, maxNumOfBeds, name]);
        return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId, r.imageName));
    }

    getHut = async (hutId) => {
        let sql = "SELECT * FROM hut WHERE id = ?";
        const res = await this.dbManager.get(sql, [hutId], true);
        return new Hut(res.id, res.name, res.numOfBeds, res.phoneNumber, res.email, res.description, res.website, res.pointId, res.ownerId, res.imageName);
    }

    getMaxData = async () => {
        const sql = "SELECT max(numOfBeds) AS maxNumOfBeds, max(altitude) AS maxAltitude FROM Hut H, Points P WHERE H.pointId = P.id";
        const res = await this.dbManager.get(sql, [], true);
        res.maxNumOfBeds = Math.ceil(res.maxNumOfBeds);  // to avoid null when no hut
        res.maxAltitude = Math.ceil(res.maxAltitude);
        return res;
    }

    insertHut = async (name, numOfBeds, pointId, description, phoneNumber, email, website, userId, image) => {
        const sql = "insert into hut(name,numOfBeds,pointId,description,phoneNumber,email,website,ownerId,imageName) values(?,?,?,?,?,?,?,?,?)";
        const res = await this.dbManager.query(sql, [name, numOfBeds, pointId, description, phoneNumber, email, website, userId, image]);
        return res;

    }

    getHutsbyUserId = async (userId) => {
        const sql = "SELECT * FROM Hut WHERE ownerId = ? ORDER BY id";
        const res = await this.dbManager.get(sql, [userId]);
        let huts = res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId, r.imageName));
        return huts;
    }

    getUserHuts = async (userId, name = "", minNumOfBeds = 0, maxNumOfBeds = 10000) => {
        const sql = "SELECT * FROM Hut WHERE ownerId = ? AND (numOfBeds >= ? AND numOfBeds <= ?) AND name LIKE '%' || ? || '%' ORDER BY id";
        const res = await this.dbManager.get(sql, [userId, minNumOfBeds, maxNumOfBeds, name]);
        return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId, r.imageName));
    }

}

module.exports = HutDAO;