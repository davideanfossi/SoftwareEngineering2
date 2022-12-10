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

    addParking = async (parking) => {
            parking.point.id = await this.pointDAO.insertPoint(parking.point);
            
            if (parking.point.id > 0)
            {
                const res = await this.parkingDAO.insertParking(parking);
                return res;
            }
            else
                return false;

    }

}

module.exports = ParkingService;