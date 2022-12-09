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
            return res.map(r => new Parking(r.id, r.name, r.numSpots, r.hasFreeSpots, r.pointId, r.ownerId));
        } catch (err) {
            throw err;
        }
    };

    insertParking = async (name, ownerId, pointId, numSpots, hasFreeSpots, imageName) => {
        try{
            const sql= "insert into Parking (name, ownerId, pointId, numSpots, hasFreeSpots, imageName) values(?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [name, ownerId, pointId, numSpots, hasFreeSpots, imageName]);
            return res;
        }
        catch(err){
            throw err;
        }
       }    
}

module.exports = ParkingDAO;