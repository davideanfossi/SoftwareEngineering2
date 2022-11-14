'use strict';

const difficultyType = {
    "low": "Tourist", 
    "mid": "Hiker", 
    "high": "Professional Hiker"
};

class Hike{

    constructor(id, title, length, expectedTime, ascent, difficulty, startPoint, endPoint, description, referencePoints=[], gpxPath, userId){
        this.id = id;
        this.title = title;
        this.length = length;
        this.expectedTime = expectedTime;
        this.ascent = ascent;
        this.difficulty = difficulty;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.description = description;
        this.referencePoints = referencePoints;
        this.gpxPath = gpxPath;
        this.userId = userId;
    }
}


module.exports = {Hike, difficultyType};