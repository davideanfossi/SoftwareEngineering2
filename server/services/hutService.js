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

    addHut = async (name,numOfBeds,description,image, userId,latitude,longitude,altitude,pointLabel,address) => {
        try {
            //TODO :  add transaction or delete points in catch when insertHike returns err
            //first insert Point 
            const pointId=await this.pointDAO.insertPoint(latitude,longitude,altitude,pointLabel,address)
          
            if(pointId>0)
            {
                const res = await this.hutDAO.insertHut(name,numOfBeds,pointId,description,image,userId);
                return res;
            }
            else
                return false;
           
        } catch (err) {
            throw err;
        }
    }
}

module.exports=HutService;