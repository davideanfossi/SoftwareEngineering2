'use strict';

class HikeHutService {

    constructor(hikeHutDAO) {
        if (!hikeHutDAO)
            throw 'hikeHutDAO must be defined for HikeHutService!';
        this.hikeHutDAO = hikeHutDAO;
    }

    linkHutToHike = async (hikeId,hutId,startPoint,endPoint) => {
                const res = await this.hikeHutDAO.insertHikeHut(hikeId,hutId,startPoint,endPoint);
                return res;
           
    }

}

module.exports = HikeHutService;