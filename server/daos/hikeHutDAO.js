'use strict';

const HikeHut = require("../models/hikeHutModel");

class HikeHutDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for HikeHut dao!';
        this.dbManager = dbManager;
    }

    getHikeLinkedHutsAsStartEnd = async (hikeId) => {
            const sql = "SELECT * FROM HikeHut WHERE hikeId = ? and (startPoint =1 or endPoint=1)";
            const res = await this.dbManager.get(sql, [hikeId]);
            return res.map(rs=> new HikeHut(rs.hikeId, rs.hutId, !!rs.startPoint,!!rs.endPoint,!!rs.isLinked)) ;
    };

    getHikeLinkedHuts = async (hikeId) => {
        const sql = "SELECT * FROM HikeHut WHERE isLinked=true and hikeId = ? ";
        const res = await this.dbManager.get(sql, [hikeId]);
        return res.map(rs=> new HikeHut(rs.hikeId, rs.hutId, !!rs.startPoint,!!rs.endPoint,!!rs.isLinked)) ;
    };

    getHikeHut = async (hikeId,hutId) => {
        const sql = "SELECT * FROM HikeHut WHERE hikeId = ? and hutId=? ";
        const res = await this.dbManager.get(sql, [hikeId,hutId],true);
        return res ?  new HikeHut(res.hikeId, res.hutId, !!res.startPoint,!!res.endPoint,!!res.isLinked) : undefined ;
    };

    getHikeHutAsLinked = async (hikeId,hutId) => {
        const sql = "SELECT * FROM HikeHut WHERE hikeId = ? and hutId=? and isLinked=1";
        const res = await this.dbManager.get(sql, [hikeId,hutId],true);
        return res?  new HikeHut(res.hikeId, res.hutId, !!res.startPoint,!!res.endPoint,!!res.isLinked) : undefined ;
    };

    insertHikeHut=async (hikeId,hutId,startPoint,endPoint,isLinked) =>{
            const sql="insert into HikeHut(hikeId,hutId,startPoint,endPoint,isLinked) values(?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [hikeId,hutId,startPoint,endPoint,isLinked]);
            return res;
    }

    updateHikeHutStartEnd=async (hikeId,hutId,startPoint,endPoint) =>{
        const sql="update HikeHut set startPoint=? , endPoint=? where hikeId=? and hutId=?";
        const res = await this.dbManager.query(sql, [startPoint,endPoint,hikeId,hutId]);
        return res;
    }

    updateHikeHutIsLinked=async (hikeId,hutId,isLinked) =>{
        const sql="update HikeHut set isLinked=? where hikeId=? and hutId=?";
        const res = await this.dbManager.query(sql, [isLinked,hikeId,hutId]);
        return res;
    }

}

module.exports = HikeHutDAO;