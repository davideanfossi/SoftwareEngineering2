'use strict'

class ParkingService {
    constructor(parkingDAO, pointDAO) {
        if (!parkingDAO)
            throw 'parkingDAO must be defined for parking service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for parking service!';
        this.parkingDAO = hikeDAO;
        this.pointDAO = pointDAO;
    }

    addParking = async (title, description, gpxPath, userId, latitude, longitude, altitude, pointLabel, address) => {
        try {
            //first insert startPoint and endPoint
            const startPointId=await this.pointDAO.insertPoint(startLatitude,startLongitude,startAltitude,startPointLabel,startAddress)
            const endPointId=await this.pointDAO.insertPoint(endLatitude,endLongitude,endAltitude,endPointLabel,endAddress)
            if(startPointId>0 & endPointId>0)
            {
                const res = await this.hikeDAO.insertHike(title, length, expectedTime,ascent, difficulty ,startPointId ,endPointId, description, gpxPath, userId);
                return res;
            }
            else
                return false;
           
        } catch (err) {
            throw err;
        }
    }



}