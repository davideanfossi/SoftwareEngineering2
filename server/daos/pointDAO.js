'use strict';

const Point = require("../models/pointModel");

class PointDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Point dao!';
        this.dbManager = dbManager;
    }

    getPoint = async (id) => {
            const sql = "SELECT * FROM Points WHERE id = ?";
            const res = await this.dbManager.get(sql, [id], true);
            return new Point(res.id, Number.parseFloat(res.latitude), Number.parseFloat(res.longitude), res.altitude, res.name, res.address);
    };

    getReferencePointsOfHike = async (hikeId) => {
            const sql = "SELECT * FROM Points P, ReferencePoints RP WHERE P.id = RP.pointId AND RP.hikeId = ?";
            const res = await this.dbManager.get(sql, [hikeId]);
            return res.map(r => { return {"id": r.id, "latitude": Number.parseFloat(r.latitude), "longitude":  Number.parseFloat(r.longitude), "altitude": r.altitude, "name": r.name , "address": r.address, "description": r.description} })
            //return res.map(r => new Point(r.id, Number.parseFloat(r.latitude), Number.parseFloat(r.longitude), r.altitude, r.name, r.address));
    };

    insertPoint = async (point) => {
            const sql = "insert into Points(latitude,longitude,altitude,name,address) values(?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [point.latitude, point.longitude, point.altitude, point.name, point.address]);
            return res;
    }

    insertReference = async (hikeId, pointId, description) => {
        const sql = "insert into ReferencePoints(hikeId, pointId, description) values(?,?,?)";
        const res = await this.dbManager.query(sql, [hikeId, pointId, description]);
        return res;
    }

}

module.exports = PointDAO;