'use strict';

class HikeParkingService {

    constructor(hikeParkingDAO) {
        if (!hikeParkingDAO)
            throw 'hikeParkingDAO must be defined for HikeParkingService!';
        this.hikeParkingDAO = hikeParkingDAO;
    }

    linkParkingToHike = async (hikeId,parkingId,startPoint,endPoint) => {
        try {
                const res = await this.hikeParkingDAO.insertHikeParking(hikeId,parkingId,startPoint,endPoint);
                return res;
           
        } catch (err) {
            throw err;
        }
    }

}

module.exports = HikeParkingService;