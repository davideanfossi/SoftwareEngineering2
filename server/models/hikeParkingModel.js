'use strict';

class HikeParking{

    constructor(hikeId, parkingId, startPoint,endPoint){
        this.hikeId = hikeId;
        this.parkingId = parkingId;
        this.startPoint = startPoint;
        this.endPoint=endPoint;
    }
}


module.exports = {HikeParking};