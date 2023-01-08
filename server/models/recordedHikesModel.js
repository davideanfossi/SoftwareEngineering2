'use strict';

class RecordedHike {
    constructor(id, userId, startDateTime, endDateTime, hike){
        this.id = id;
        this.userId = userId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.hike = hike;
    }
}

module.exports = RecordedHike;



