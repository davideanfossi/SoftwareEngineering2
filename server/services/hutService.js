'use strict';

class HutService{

    constructor(hutDAO,pointDAO) {
        if (!hutDAO)
            throw 'hutDAO must be defined for HutService!';
        if (!pointDAO)
            throw 'pointDAO must be defined for HutService!';
        this.hutDAO = hutDAO;
        this.pointDAO=pointDAO;
    }

    addHut = async (name,numOfBeds,description,phoneNumber,email,website, userId,latitude,longitude,altitude,pointLabel,address) => {
        try {
            //TODO :  add transaction or delete points in catch when insertHike returns err
            //first insert Point 
            const pointId=await this.pointDAO.insertPoint(latitude,longitude,altitude,pointLabel,address)
          
            if(pointId>0)
            {
                const res = await this.hutDAO.insertHut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId);
                return res;
            }
            else
                return false;
           
        } catch (err) {
            throw err;
        }
    }

    getHut=async (id)=>{
        try{
            const res = await this.hutDAO.getHut(id);
            return res;
        } catch(err){
            throw err;
        }
    }

    getHutbyUserId=async(userId)=>{
        try{
            const huts = await this.hutDAO.getHutbyUserId(userId);
            return huts;
        } catch(err){
            throw err;
        }
    }
}

module.exports=HutService;