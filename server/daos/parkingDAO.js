'use strict';

const Parking = require("../models/parkingModel");

class ParkingDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Parking dao!';
        this.dbManager = dbManager;
    }

    getAllParkings = async () => {
        try {
            const sql = "SELECT * FROM Parking ORDER BY id;";
            const res = await this.dbManager.get(sql, []);
            return res.map(r => new Parking(r.id, r.name, r.numSpots, r.hasFreeSpots, r.pointId, r.ownerId, r.imageName));
        } catch (err) {
            throw err;
        }
    };

    insertParking = async (parking) => {
            const sql= "insert into Parking (name, ownerId, pointId, numSpots, hasFreeSpots, imageName) values(?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [parking.name, parking.ownerId, parking.point.id, parking.numSpots, parking.hasFreeSpots, parking.imageName]);
            return res;
       } 
       
    getParking = async (id) => {
        let sql = "SELECT * FROM Parking WHERE id = ?";
        const r = await this.dbManager.get(sql, [id], true);
        return r ? new Parking(r.id, r.name, r.numSpots, r.hasFreeSpots, r.pointId, r.ownerId, r.imageName) 
               : undefined;
    }
}

module.exports = ParkingDAO;