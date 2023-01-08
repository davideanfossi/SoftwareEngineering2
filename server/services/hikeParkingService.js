'use strict';

class HikeParkingService {

    constructor(hikeParkingDAO,hikeDAO,parkingDAO) {
        if (!hikeParkingDAO)
            throw 'hikeParkingDAO must be defined for HikeParkingService!';
        if (!hikeDAO)
            throw new Error('hikeDAO must be defined for HikeParkingService!');
        if (!parkingDAO)
            throw 'parkingDAO must be defined for HikeParkingService!';

        this.hikeParkingDAO = hikeParkingDAO;
        this.hikeDAO=hikeDAO;
        this.parkingDAO=parkingDAO;
    }

    getParkingLinkedToHike = async (hikeId) => {

        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
        throw {
            returnCode: 404, message: "hike not found"
        }

        const res = await this.hikeParkingDAO.getHikeLinkedParkings(hikeId);
        return res;
    };

    linkParkingToHike = async (hikeId,parkingId,startPoint,endPoint,userId) => {

        const hike = await this.hikeDAO.getHike(hikeId);
        if (!hike)
        throw {
            returnCode: 404, message: "hike not found"
        }
    
        if(hike.userId!=userId)
        throw {
        returnCode: 401, message: "unauthorized"
        }

        const parking = await this.parkingDAO.getParking(parkingId);
        if (!parking)
        throw {
            returnCode: 404, message: "parking not found"
        }
                
        const res = await this.hikeParkingDAO.insertHikeParking(hikeId,parkingId,startPoint,endPoint);
        return res;
    }

}

module.exports = HikeParkingService;