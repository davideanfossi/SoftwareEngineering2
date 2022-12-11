'use strict';

const HikeParking = require("../models/hikeParkingModel");

class HikeParkingDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for HikeParking dao!';
        this.dbManager = dbManager;
    }

    getHikeLinkedParkings = async (hikeId) => {
            const sql = "SELECT * FROM HikeParking WHERE hikeId = ?";
            const res = await this.dbManager.get(sql, [hikeId]);
            return res.map(rs=> new HikeParking(rs.hikeId, rs.parkingId, !!rs.startPoint,!!rs.endPoint)) ;
    };

    insertHikeParking=async (hikeId,parkingId,startPoint,endPoint) =>{
            const sql="insert into HikeParking(hikeId,parkingId,startPoint,endPoint) values(?,?,?,?)";
            const res = await this.dbManager.query(sql, [hikeId,parkingId,startPoint,endPoint]);
            return res;
        }
}

module.exports = HikeParkingDAO;