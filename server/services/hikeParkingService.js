'use strict';

class HikeParkingService {

    constructor(hikeParkingDAO) {
        if (!hikeParkingDAO)
            throw 'hikeParkingDAO must be defined for HikeParkingService!';
        this.hikeParkingDAO = hikeParkingDAO;
    }

    linkParkingToHike = async (hikeId,parkingId,startPoint,endPoint) => {
                const res = await this.hikeParkingDAO.insertHikeParking(hikeId,parkingId,startPoint,endPoint);
                return res;
    }

}

module.exports = HikeParkingService;