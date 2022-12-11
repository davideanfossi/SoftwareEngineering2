'use strict';

const Parking = require("../models/parkingModel");

class ParkingDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Parking dao!';
        this.dbManager = dbManager;
    }

    insertParking = async (parking) => {
            const sql= "insert into Parking (name, ownerId, pointId, numSpots, hasFreeSpots, imageName) values(?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [parking.name, parking.ownerId, parking.point.id, parking.numSpots, parking.hasFreeSpots, parking.imageName]);
            return res;
       }    
}

module.exports = ParkingDAO;