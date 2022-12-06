'use strict'

class ParkingService {
    constructor(parkingDAO, pointDAO) {
        if (!parkingDAO)
            throw 'parkingDAO must be defined for parking service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for parking service!';
        this.parkingDAO = parkingDAO;
        this.pointDAO = pointDAO;
    }

    addParking = async (name, ownerId, pointId, numSpots, hasFreeSpots, latitude,longitude,altitude,pointLabel,address) => {
        try {
            const pointId = await this.pointDAO.insertPoint(latitude,longitude,altitude,pointLabel,address)
            
            if (PointId > 0)
            {
                const res = await this.parkingDAO.insertParking(name, ownerId, pointId, numSpots, hasFreeSpots);
                return res;
            }
            else
                return false;
           
        } catch (err) {
            throw err;
        }
    }

}

module.exports = ParkingService;