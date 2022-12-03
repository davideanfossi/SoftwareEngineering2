'use strict';

const Hut=require("../models/hutModel");

class HutDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for hutdao!';
        this.dbManager = dbManager;
    }



    insertHut=async (name,numOfBeds,pointId,description,phoneNumber,email,website,userId) =>{
        try{
            const sql="insert into hut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId) values(?,?,?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [name,numOfBeds,pointId,description,phoneNumber,email,website,userId]);
            return res;
        }
        catch(err){
            throw err;
        }
    }

    getHut=async(id)=>{
        try {
            const sql = "SELECT * FROM Hut WHERE id = ?";
            const res = await this.dbManager.get(sql, [id], true);
            return res ? new Hut(res.id, res.name, res.numOfBeds, res.pointId, res.description, res.phoneNumber, res.email, res.website, res.userId) : undefined;
        } catch (err) {
            throw err;
        }
    }

    getHutsbyUserId=async(id)=>{
        try {
            const sql = "SELECT * FROM Hut WHERE userId = ? ORDER BY id";
            const res = await this.dbManager.get(sql, [id], true);
            return res.map(r => new Hut(res.id, res.name, res.numOfBeds, res.pointId, res.description, res.phoneNumber, res.email, res.website, res.userId));
        } catch (err) {
            throw err;
        }
    }
    
}

module.exports = HutDAO;