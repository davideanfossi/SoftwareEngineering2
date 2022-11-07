'use strict';

class Point{

    constructor(id, latitude, longitude, name, address){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.address = address;
    }
}

module.exports = Point;