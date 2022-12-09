'use strict';

const Parking = require("../models/parkingModel");

class ParkingDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Parking dao!';
        this.dbManager = dbManager;
    }

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