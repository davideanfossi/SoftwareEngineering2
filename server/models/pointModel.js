'use strict';

class Point{

    constructor(id, latitude, longitude, altitude, name, city, province, address){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.name = name;
        this.city = city;
        this.province = province;
        this.address = address;
    }
}

module.exports = Point;