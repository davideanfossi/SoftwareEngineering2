'use strict';

const HikeHut = require("../models/hikeHutModel");

class HikeHutDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Hike dao!';
        this.dbManager = dbManager;
    }

    getHikeLinkedHut = async (hikeId) => {
        try {
            const sql = "SELECT * FROM HikeHut WHERE hikeId = ?";
            const res = await this.dbManager.get(sql, [hikeId], true);
            return res.map(rs=> new HikeHut(rs.hikeId, rs.hutId, rs.startPoint,rs.endPoint)) ;
        } catch (err) {
            throw err;
        }
    };

    insertHikeHut=async (hikeId,hutId,startPoint,endPoint) =>{
        try{
            const sql="insert into HikeHut(hikeId,hutId,startPoint,endPoint) values(?,?,?,?)";
            const res = await this.dbManager.query(sql, [hikeId,hutId,startPoint,endPoint]);
            return res;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = HikeHutDAO;