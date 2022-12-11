'use strict';

class HikeHutService {

    constructor(hikeHutDAO) {
        if (!hikeHutDAO)
            throw 'hikeHutDAO must be defined for HikeHutService!';
        this.hikeHutDAO = hikeHutDAO;
    }

    linkHutToHike = async (hikeId,hutId,startPoint,endPoint) => {
        try {
                const res = await this.hikeHutDAO.insertHikeHut(hikeId,hutId,startPoint,endPoint);
                return res;
           
        } catch (err) {
            throw err;
        }
    }

}

module.exports = HikeHutService;