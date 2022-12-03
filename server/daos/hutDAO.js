'use strict';

const Hut = require("../models/hutModel");

class HutDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for hutdao!';
        this.dbManager = dbManager;
    }

    getAllHuts = async () =>{
        try{
            const sql="SELECT * FROM Hut";
            const res = await this.dbManager.query(sql, []);
            return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId));
        }
        catch(err){
            throw err;
        }
    }

    getHuts = async (minNumOfBeds=0, maxNumOfBeds=10000) =>{
        try{
            const sql="SELECT * FROM Hut WHERE (numOfBeds >= ? AND numOfBeds <= ?)";
            const res = await this.dbManager.query(sql, [minNumOfBeds, maxNumOfBeds]);
            return res.map(r => new Hut(r.id, r.name, r.numOfBeds, r.phoneNumber, r.email, r.description, r.website, r.pointId, r.ownerId));
        }
        catch(err){
            throw err;
        }
    }

    getHut = async (hutId) => {
        try{
            let sql="SELECT * FROM hut WHERE id = ?";
            const res = await this.dbManager.query(sql, [hutId], true);
            return new Hut(res.id, res.name, res.numOfBeds, res.phoneNumber, res.email, res.description, res.website, res.pointId, res.ownerId);
        }
        catch(err){
            throw err;
        }
    }

    getHutImages = async (hutId) => {
        try{
            let sql="SELECT imageName FROM HutImages WHERE hutId = ?";
            const res = await this.dbManager.query(sql, [hutId]);
            return res;
        }
        catch(err){
            throw err;
        }
    }

}

module.exports = HutDAO;