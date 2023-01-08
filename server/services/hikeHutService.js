"use strict";

const togeojson = require("togeojson");
const path = require("path");

const config = require("../config.json");

class HikeHutService {
  constructor(hikeHutDAO, hikeDAO, hutDAO, pointDAO) {
    if (!hikeHutDAO)
      throw new Error("hikeHutDAO must be defined for HikeHutService!");
    if (!hikeDAO)
      throw new Error("hikeDAO must be defined for HikeHutService!");
    if (!hutDAO) 
      throw new Error("hutDAO must be defined for HikeHutService!");
    if (!pointDAO)
      throw new Error("pointDAO must be defined for HikeHutService!");

    this.hikeHutDAO = hikeHutDAO;
    this.hikeDAO = hikeDAO;
    this.hutDAO = hutDAO;
    this.pointDAO = pointDAO;
  }

  getHutLinkedToHikeAsStartEnd = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (!hike)
      throw {
        returnCode: 404,
        message: "hike not found",
      };

    const res = await this.hikeHutDAO.getHikeLinkedHutsAsStartEnd(hikeId);
    return res;
  };

  getHutLinkedToHike = async (hikeId) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (!hike)
      throw {
        returnCode: 404,
        message: "hike not found",
      };
    const res = await this.hikeHutDAO.getHikeLinkedHuts(hikeId);
    return res;
  };

  linkHutAsStartEndToHike = async (
    hikeId,
    hutId,
    startPoint,
    endPoint,
    userId
  ) => {
    const hike = await this.hikeDAO.getHike(hikeId);
    if (!hike)
      throw {
        returnCode: 404,
        message: "hike not found",
      };

    if (hike.userId != userId)
      throw {
        returnCode: 401,
        message: "unauthorized",
      };

    const hut = await this.hutDAO.getHut(hutId);
    if (!hut)
      throw {
        returnCode: 404,
        message: "hut not found",
      };

    const hikeHut = await this.hikeHutDAO.getHikeHut(hikeId, hutId);
    let res;
    if (!hikeHut) {
      res = await this.hikeHutDAO.insertHikeHut(
        hikeId,
        hutId,
        startPoint,
        endPoint,
        undefined
      );
      return res;
    } else {
      res = await this.hikeHutDAO.updateHikeHutStartEnd(
        hikeId,
        hutId,
        startPoint,
        endPoint
      );
      return res;
    }
  };

  

  linkHutToHike = async (hikeId, hutId, userId) => {
    //check if hike exists
    const hike = await this.hikeDAO.getHike(hikeId);
    if (!hike)
      throw {
        returnCode: 404,
        message: "hike not found",
      };

    if (hike.userId != userId)
      throw {
        returnCode: 401,
        message: "unauthorized",
      };

    //check if hut exists
    const hut = await this.hutDAO.getHut(hutId);
    if (!hut)
      throw {
        returnCode: 404,
        message: "hut not found",
      };

    //check if hut is already linked to the hike
    const hikeHut = await this.hikeHutDAO.getHikeHut(hikeId, hutId);
    if (hikeHut && hikeHut.isLinked) 
        throw { 
            returnCode: 409, 
            message:"hut is already linked to the hike"
        };

    let res;
    //if there is not any record for this hike and hut in the table insert new record
    if (!hikeHut) {
      res = await this.hikeHutDAO.insertHikeHut(
        hikeId,
        hutId,
        undefined,
        undefined,
        true
      );
      return res;
    }
    //otherwise update existing record
    else {
      res = await this.hikeHutDAO.updateHikeHutIsLinked(hikeId, hutId, true);
      return res;
    }
  };


}



module.exports = HikeHutService;
