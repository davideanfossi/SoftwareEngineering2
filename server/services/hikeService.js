'use strict';

const {difficultyType} = require("../models/hikeModel");

class HikeService {
    constructor(hikeDAO, pointDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for hike service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for hike service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
    }

    getAllHikes = async () => {
        try {
            const hikes = await this.hikeDAO.getAllHikes();
            // for (const hike of hikes) {
            //     hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(hike.id);
            // }
            return hikes;
        } catch (err) {
            throw err;
        }
    };

    getHikesLimits = async () => {
        try {
            const res = await this.hikeDAO.getMaxData();
            res.difficultyType = [difficultyType.low, difficultyType.mid, difficultyType.high];
            return res;
        } catch (err) {
            throw err;
        }
    }


}

module.exports = HikeService;