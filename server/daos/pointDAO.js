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
            return new Point(res.id, res.latitude, res.longitude, res.name, res.address);
        } catch (err) {
            throw err;
        }
    };

    getReferencePointsOfHike = async (hikeId) => {
        try {
            const sql = "SELECT * FROM Points P, ReferencePoints RP WHERE P.id = RP.pointId AND RP.hikeId = ?";
            const res = await this.dbManager.get(sql, [hikeId]);
            return res.map(r => new Point(r.id, r.latitude, r.longitude, r.name, r.address));
        } catch (err) {
            throw err;
        }
    };
    
}

module.exports = PointDAO;