"use strict";

const Hike = require("../models/hikeModel");
const togeojson = require("togeojson");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;
const path = require("path");
const { difficultyType } = require("../models/hikeModel");
const {
  isWithinCircle,
  checkHikeIsWithinCircle,
} = require("../utils/positionUtils");

const config = require("../config.json");

class HikeService {
  constructor(hikeDAO, pointDAO, hutDAO, parkingDAO) {
    if (!hikeDAO) throw "hikeDAO must be defined for hike service!";
    if (!pointDAO) throw "pointDAO must be defined for hike service!";
    if (!hutDAO) throw "hutDAO must be defined for hike service!";
    if (!parkingDAO) throw "parkingDAO must be defined for hike service!";
    this.hikeDAO = hikeDAO;
    this.pointDAO = pointDAO;
    this.hutDAO = hutDAO;
    this.parkingDAO = parkingDAO;
  }

  getHikes = async (
    { minLen, maxLen },
    { minTime, maxTime },
    { minAscent, maxAscent },
    difficulty,
    { baseLat, baseLon, radius = 0 },
    { pageNumber = 1, pageSize = 10 }
  ) => {
    let hikes;
    let returnedHikes;
    const offset = (pageNumber - 1) * pageSize; // offset of the page

    if (
      !minLen &&
      !maxLen &&
      !minTime &&
      !maxTime &&
      !minAscent &&
      !maxAscent &&
      !difficulty
    )
      hikes = await this.hikeDAO.getAllHikes();
    else
      hikes = await this.hikeDAO.getHikes(
        minLen,
        maxLen,
        minTime,
        maxTime,
        minAscent,
        maxAscent,
        difficulty
      );

    // get points
    for (const hike of hikes) {
      hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
      hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
      hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(
        hike.id
      );
    }

    // if radius = 0 or not present then the filter is not executed
    if (
      radius !== 0 &&
      radius !== undefined &&
      baseLat !== undefined &&
      baseLon !== undefined
    ) {
      // filer all hikes with start point, end point or reference points inside the radius
      hikes = hikes.filter((hike) =>
        checkHikeIsWithinCircle(baseLat, baseLon, radius, hike)
      );
    }

    // take only page requested
    returnedHikes = hikes.slice(offset, offset + pageSize);

    const totalPages = Math.ceil(hikes.length / pageSize);

    return {
      totalPages: totalPages,
      pageNumber: pageNumber,
      pageSize: pageSize,
      pageItems: returnedHikes,
    };
  };

  getNearStart = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    const radius = 1;
    if (!hike)
      throw {
        returnCode: 404,
        msg: "hike not found",
      };
    hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
    let parkings = await this.getParkingNearPoint(hike.startPoint, radius);
    let huts = await this.getHutNearPoint(hike.startPoint, radius);

    return { parkings: parkings, huts: huts };
  };

  getNearEnd = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    const radius = 1;
    if (!hike)
      throw {
        returnCode: 404,
        msg: "hike not found",
      };
    hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
    let parkings = await this.getParkingNearPoint(hike.endPoint, radius);
    let huts = await this.getHutNearPoint(hike.endPoint, radius);

    return { parkings: parkings, huts: huts };
  };

  getHutNearPoint = async (point, radius) => {
    let huts = await this.hutDAO.getAllHuts();
    let returnedHuts = [];

    for (const hut of huts) {
      hut.point = await this.pointDAO.getPoint(hut.point);
      if (
        isWithinCircle(
          point.latitude,
          point.longitude,
          hut.point.latitude,
          hut.point.longitude,
          radius
        )
      )
        returnedHuts.push(hut);
    }

    return returnedHuts;
  };

  getParkingNearPoint = async (point, radius) => {
    let parkings = await this.parkingDAO.getAllParkings();
    let returnedParkings = [];

    for (const parking of parkings) {
      parking.point = await this.pointDAO.getPoint(parking.point);
      if (
        isWithinCircle(
          point.latitude,
          point.longitude,
          parking.point.latitude,
          parking.point.longitude,
          radius
        )
      )
        returnedParkings.push(parking);
    }
    return returnedParkings;
  };

  getHikesLimits = async () => {
    const res = await this.hikeDAO.getMaxData();
    res.difficultyType = [
      difficultyType.low,
      difficultyType.mid,
      difficultyType.high,
    ];
    return res;
  };

  getCompleted = async (userId, { pageNumber = 1, pageSize = 10 }) => {
    const offset = (pageNumber - 1) * pageSize; // offset of the page
    let completedHikes = await this.hikeDAO.getCompletedHikes(userId); // take only page requested
    completedHikes = completedHikes.slice(offset, offset + pageSize);

    const totalPages = Math.ceil(completedHikes.length / pageSize);

    return {
      totalPages: totalPages,
      pageNumber: pageNumber,
      pageSize: pageSize,
      pageItems: completedHikes,
    };
  };
  getHike = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (hike === undefined)
      return { returnCode: 404, message: "Hike not Found" };

    hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
    hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
    hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(
      hike.id
    );

    let track = "";
    if (hike.gpxPath != null) {
      const hikeGpxFile = path.resolve(config.gpxPath, hike.gpxPath);
      if (fs.existsSync(hikeGpxFile)) {
        const gpx = new DOMParser().parseFromString(
          fs.readFileSync(hikeGpxFile, "utf8")
        );
        const geoJson = togeojson.gpx(gpx);
        track = geoJson.features[0].geometry.coordinates.map((p) => {
          return { lat: p[1], lon: p[0] };
        });
      }
    }

    return {
      hike: hike,
      track: track,
    };
  };

  addReference = async (hikeId, refPointList) => {
    for (const refPoint of refPointList) {
      const refPointId = await this.pointDAO.insertPoint(refPoint);
      if (refPointId > 0)
        await this.pointDAO.insertReference(
          hikeId,
          refPointId,
          refPoint.description,
          refPoint.name
        );
    }
  };
  addHike = async (hike, startPoint, endPoint) => {
    const startPointId = await this.pointDAO.insertPoint(startPoint);
    const endPointId = await this.pointDAO.insertPoint(endPoint);
    if (startPointId > 0 && endPointId > 0) {
      hike.startPoint = startPointId;
      hike.endPoint = endPointId;
      const res = await this.hikeDAO.insertHike(hike);
      return res;
    } else throw "generic error";
  };

  getHikeGpx = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (hike === undefined)
      throw { returnCode: 404, message: "Hike not Found" };

    hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
    hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
    hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(
      hike.id
    );
    if (hike.gpxPath === null)
      throw { returnCode: 500, message: "Gpx file does not exist" };
    const hikeGpxFile = path.resolve(config.gpxPath, hike.gpxPath);
    if (!fs.existsSync(hikeGpxFile))
      throw { returnCode: 500, message: "Gpx file does not exist" };

    const gpx = new DOMParser().parseFromString(
      fs.readFileSync(hikeGpxFile, "utf8")
    );
    const geoJson = togeojson.gpx(gpx);
    return {
      startPoint: hike.startPoint,
      endPoint: hike.endPoint,
      referencePoints: hike.referencePoints,
      track: geoJson.features[0].geometry.coordinates.map((p) => {
        return { lat: p[1], lon: p[0] };
      }),
    };
  };

  getHutsNearHike = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (!hike)
      throw {
        returnCode: 404,
        msg: "hike not found",
      };

    let huts = await this.hutDAO.getAllHuts();
    let returnedHuts = [];

    for (const hut of huts) {
      hut.point = await this.pointDAO.getPoint(hut.point);
      if (validateHutPoint(hut.point, hike.gpxPath)) returnedHuts.push(hut);
    }

    return { huts: returnedHuts };
  };

  getHikeGpx = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (hike === undefined)
      throw { returnCode: 404, message: "Hike not Found" };

    hike.startPoint = await this.pointDAO.getPoint(hike.startPoint);
    hike.endPoint = await this.pointDAO.getPoint(hike.endPoint);
    hike.referencePoints = await this.pointDAO.getReferencePointsOfHike(
      hike.id
    );
    if (hike.gpxPath === null)
      throw { returnCode: 500, message: "Gpx file does not exist" };
    const hikeGpxFile = path.resolve(config.gpxPath, hike.gpxPath);
    if (!fs.existsSync(hikeGpxFile))
      throw { returnCode: 500, message: "Gpx file does not exist" };

    const gpx = new DOMParser().parseFromString(
      fs.readFileSync(hikeGpxFile, "utf8")
    );
    const geoJson = togeojson.gpx(gpx);
    return {
      startPoint: hike.startPoint,
      endPoint: hike.endPoint,
      referencePoints: hike.referencePoints,
      track: geoJson.features[0].geometry.coordinates.map((p) => {
        return { lat: p[1], lon: p[0] };
      }),
    };
  };
}

function validateHutPoint (hutPoint, hikeGpxPath)
   {
    const radius = 5;

    if (hikeGpxPath === null)
      throw { returnCode: 500, message: "Gpx file does not exist" };
    const hikeGpxFile = path.resolve(config.gpxPath, hikeGpxPath);
    if (!fs.existsSync(hikeGpxFile))
      throw { returnCode: 500, message: "Gpx file does not exist" };

    const gpx = new DOMParser().parseFromString(
      fs.readFileSync(hikeGpxFile, "utf8")
    );
    const geoJson = togeojson.gpx(gpx);
    let result=false;
    // compare distance of hut point with all points of the hike
    geoJson.features[0].geometry.coordinates.some((element) => {
      if (isWithinCircle(element[1],element[0],hutPoint.latitude,hutPoint.longitude,radius)) 
      {
        result=true;
        return result ;
      }
    });
    return result;
  };



module.exports = HikeService;
