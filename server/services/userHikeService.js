'use strict'

class UserHikeService {
    constructor(hikeDAO, pointDAO, userDAO) {
        if (!hikeDAO)
            throw 'hikeDAO must be defined for hike service!';
        if (!pointDAO)
            throw 'pointDAO must be defined for hike service!';
        if(!userDAO) 
            throw 'userDAO must be define for user hike service!';
        this.hikeDAO = hikeDAO;
        this.pointDAO = pointDAO;
        this.userDAO = userDAO;
    }

    getUserHikes = async (pageNumber=1, pageSize=10, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius=0, city, province, email, username, id, role) => {
        try {
            let hikes;
            let returnedHikes;
            let user;
            const offset = (pageNumber - 1) * pageSize; // offset of the page

            if (!minLen && !maxLen && !minTime && !maxTime && !minAscent && !maxAscent && !difficulty)
                hikes = await this.hikeDAO.getAllHikes();
            else
                hikes = await this.hikeDAO.getHikes(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty);
        
            // get points
            for (const hike of hikes) {
                hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
                hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
                hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(hike.id);
            }

            //get user
            if(!id) 
                user = await this.userDAO.getUSerByCredentials(username, email, role);
            else
                user = await this.userDAO.getUserByEmail(id);

            if(city){
                hikes = hikes.filter(hike => {
                    return hike.startPoint.city === city || hike.endPoint.city === city || hike.referencePoints.some(p => p.city === city);
                });
            }

            if(province){
                hikes = hikes.filter(hike => {
                    return hike.startPoint.province === province || hike.endPoint.province === province || hike.referencePoints.some(p => p.province === province);
                });
            }
        
            // if radius = 0 or not present then the filter is not executed
            if((radius !== 0 && radius !== undefined) && baseLat !== undefined && baseLon !== undefined){
                // filer all hikes with start point, end point or reference points inside the radius
                hikes = hikes.filter(hike => {
                    if (isWithinCircle(baseLat, baseLon, hike.startPoint.latitude, hike.startPoint.longitude, radius) 
                        || isWithinCircle(baseLat, baseLon, hike.endPoint.latitude, hike.endPoint.longitude, radius)
                        || hike.referencePoints.some(rp => isWithinCircle(baseLat, baseLon, rp.latitude, rp.longitude, radius)))
                        return true;
                    else
                        return false;
                });
            }

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
}