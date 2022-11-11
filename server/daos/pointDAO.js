'use strict';

const Point = require("../models/pointModel");

class PointDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Point dao!';
        this.dbManager = dbManager;
    }

    getPoint = async (id) => {
        try {
            const sql = "SELECT * FROM Points WHERE id = ?";
            const res = await this.dbManager.get(sql, [id], true);
            return new Point(res.id, Number.parseFloat(res.latitude), Number.parseFloat(res.longitude), Number.parseFloat(res.altitude), res.name, res.city, res.province, res.address);
        } catch (err) {
            throw err;
        }
    };

    getReferencePointsOfHike = async (hikeId) => {
        try {
            const sql = "SELECT * FROM Points P, ReferencePoints RP WHERE P.id = RP.pointId AND RP.hikeId = ?";
            const res = await this.dbManager.get(sql, [hikeId]);
            return res.map(r => new Point(r.id, Number.parseFloat(r.latitude), Number.parseFloat(r.longitude), Number.parseFloat(r.altitude), r.name, r.city, r.province, r.address));
        } catch (err) {
            throw err;
        }
    };
    
}

module.exports = PointDAO;