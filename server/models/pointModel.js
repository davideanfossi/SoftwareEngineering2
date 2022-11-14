'use strict';

class Point{

    constructor(id, latitude, longitude, altitude, name, address){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.name = name;
        this.address = address;
    }
}

module.exports = Point;