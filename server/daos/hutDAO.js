'use strict';

const hut=require(".../models/hutModel");

class HutDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Point dao!';
        this.dbManager = dbManager;
    }



    insertHut=async (name,numOfBeds,pointId,description,image,userId) =>{
        try{
            const sql="insert into hut(name,numOfBeds,pointId,description,image,userId) values(?,?,?,?,?,?)";
            const res = await this.dbManager.query(sql, [name,numOfBeds,pointId,description,image,userId]);
            return res;
        }
        catch(err){
            throw err;
        }
    }
    
}

module.exports = HutDAO;