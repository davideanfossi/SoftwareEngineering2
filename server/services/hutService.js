'use strict';

const { isWithinCircle } = require("../utils/positionUtils");

class HutService {

    constructor(hutDAO, pointDAO) {
        if (!hutDAO)
            throw 'hutDAO must be defined for HutService!';
        if (!pointDAO)
            throw 'pointDAO must be defined for HutService!';
        this.hutDAO = hutDAO;
        this.pointDAO=pointDAO;
    }

    addHut = async (name,numOfBeds,description,phoneNumber,email,website, userId,latitude,longitude,altitude,pointLabel,address,imageName) => {
            //TODO :  add transaction or delete points in catch when insertHike returns err
            //first insert Point 
            const pointId=await this.pointDAO.insertPoint({latitude,longitude,altitude,name:pointLabel,address})
          
            if(pointId>0)
            {
                const res = await this.hutDAO.insertHut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId,imageName);
                return res;
            }
            else
                return false;
           
    }

    getHut=async (id)=>{
            const res = await this.hutDAO.getHut(id);
            return res;

    }

    getHutbyUserId=async({userId},{ minNumOfBeds, maxNumOfBeds }, { minAltitude, maxAltitude }, { baseLat, baseLon, radius = 0 }, { pageNumber = 1, pageSize = 10 })=>{
            let huts;
            let returnedHuts;
            const offset = (pageNumber - 1) * pageSize; // offset of the page
            if (!minNumOfBeds && !maxNumOfBeds)
                huts = await this.hutDAO.getHutsbyUserId(userId);
            else
                huts = await this.hutDAO.getUserHuts(userId,minNumOfBeds, maxNumOfBeds);

                // get points
            for (const hut of huts) {
                hut.point = await this.pointDAO.getPoint(hut.point);
            }

            // if radius = 0 or not present then the filter is not executed
            if ((radius !== 0 && radius !== undefined) && baseLat !== undefined && baseLon !== undefined) {
                // filter all huts with position inside the radius
                huts = huts.filter(hut => isWithinCircle(baseLat, baseLon, hut.point.latitude, hut.point.longitude, radius));
            }

            if (minAltitude !== undefined || maxAltitude !== undefined) {
                huts = huts.filter(hut => (minAltitude === undefined || hut.point.altitude >= minAltitude) &&
                    (maxAltitude === undefined || hut.point.altitude <= maxAltitude));
            }

            returnedHuts = huts.slice(offset, offset + pageSize);
            const totalPages = Math.ceil(huts.length / pageSize);

            return { "totalPages": totalPages, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": returnedHuts };
    }

    getHuts = async ({ minNumOfBeds, maxNumOfBeds }, { minAltitude, maxAltitude }, { baseLat, baseLon, radius = 0 }, { pageNumber = 1, pageSize = 10 }) => {
        let huts;
        let returnedHuts;
        const offset = (pageNumber - 1) * pageSize; // offset of the page
        if (!minNumOfBeds && !maxNumOfBeds)
            huts = await this.hutDAO.getAllHuts();
        else
            huts = await this.hutDAO.getHuts(minNumOfBeds, maxNumOfBeds);

        // get points
        for (const hut of huts) {
            hut.point = await this.pointDAO.getPoint(hut.point);
        }

        // if radius = 0 or not present then the filter is not executed
        if ((radius !== 0 && radius !== undefined) && baseLat !== undefined && baseLon !== undefined) {
            // filter all huts with position inside the radius
            huts = huts.filter(hut => isWithinCircle(baseLat, baseLon, hut.point.latitude, hut.point.longitude, radius));
        }

        if (minAltitude !== undefined || maxAltitude !== undefined) {
            huts = huts.filter(hut => (minAltitude === undefined || hut.point.altitude >= minAltitude) &&
                (maxAltitude === undefined || hut.point.altitude <= maxAltitude));
        }

        returnedHuts = huts.slice(offset, offset + pageSize);
        const totalPages = Math.ceil(huts.length / pageSize);

        return { "totalPages": totalPages, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": returnedHuts };
    }


    getHutsLimits = async () => {
        const res = await this.hutDAO.getMaxData();
        return res;
    }


}

module.exports = HutService;
