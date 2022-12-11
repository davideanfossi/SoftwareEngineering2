'use strict';

const difficultyType = {
    "low": "Tourist", 
    "mid": "Hiker", 
    "high": "Professional Hiker"
};

class Hike{

    constructor(id, title, length, expectedTime, ascent, difficulty, description, userId, gpxPath, startPoint, endPoint, referencePoints=[]){
        this.id = id;
        this.title = title;
        this.length = length;
        this.expectedTime = expectedTime;
        this.ascent = ascent;
        this.difficulty = difficulty;
        this.description = description;
        this.userId = userId;
        this.gpxPath = gpxPath;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.referencePoints = referencePoints;
    }
}


module.exports = {Hike, difficultyType};