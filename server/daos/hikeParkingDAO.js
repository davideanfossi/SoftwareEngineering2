'use strict';

const HikeParking = require("../models/hikeParkingModel");

class HikeParkingDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Hike dao!';
        this.dbManager = dbManager;
    }

    getHikeLinkedParkings = async (hikeId) => {
        try {
            const sql = "SELECT * FROM HikeParking WHERE hikeId = ?";
            const res = await this.dbManager.get(sql, [hikeId], true);
            return res.map(rs=> new HikeParking(rs.hikeId, rs.parkingId, rs.startPoint,rs.endPoint)) ;
        } catch (err) {
            throw err;
        }
    };

    insertHikeParking=async (hikeId,parkingId,startPoint,endPoint) =>{
        try{
            const sql="insert into HikeParking(hikeId,parkingId,startPoint,endPoint) values(?,?,?,?)";
            const res = await this.dbManager.query(sql, [hikeId,parkingId,startPoint,endPoint]);
            return res;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = HikeParkingDAO;