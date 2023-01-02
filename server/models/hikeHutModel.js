'use strict';


class HikeHut{

    constructor(hikeId, hutId, startPoint,endPoint,isLinked){
        this.hikeId = hikeId;
        this.hutId = hutId;
        this.startPoint = startPoint;
        this.endPoint=endPoint;
        this.isLinked=isLinked;
    }
}


module.exports = HikeHut;