'use strict';

const Parking = require("../models/parkingModel");

class ParkingDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Parking dao!';
        this.dbManager = dbManager;
    }

    insertParking = async (latitude,longitude,altitude,name,address) => {
        try{
            const sql= "insert into Parkings (latitude, longitude, altitude, name, address) values(?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [latitude,longitude,altitude,name,address]);
            return res;
        }
        catch(err){
            throw err;
        }
    }
    
}

module.exports = ParkingDAO;