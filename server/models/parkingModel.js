'use strict';

class Parking{

    constructor(id, name, numSpots, hasFreeSpots, point, ownerId, imageName){
        this.id = id;
        this.name = name;
        this.numSpots = numSpots;
        this.hasFreeSpots = hasFreeSpots;
        this.point = point;
        this.ownerId = ownerId;
        this.imageName = imageName;
    }
}


module.exports = Parking;