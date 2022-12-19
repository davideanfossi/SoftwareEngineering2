'use strict';

class RecordedHike{

    constructor(id, hikeId, userId, startDateTime, endDateTime){
        this.id = id;
        this.hikeId = hikeId;
        this.userId = userId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime ? endDateTime : "";
    }
}

module.exports = RecordedHike;