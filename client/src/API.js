import track from "./track_points.json";
const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api/`;

const getHikesLimits = async () => {
  try {
    const response = await fetch(new URL("hikes/limits", SERVER_BASE), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw response.json();
    }
  } catch (e) {
    throw e;
  }
};
const getAllHikes = async () => {
  try {
    const response = await fetch(new URL("hikes", SERVER_BASE), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw response.json();
    }
  } catch (e) {
    throw e;
  }
};

const getFilteredHikes = async (
  minLen,
  maxLen,
  minTime,
  maxTime,
  minAscent,
  maxAscent,
  difficulty,
  radius,
  baseLat,
  baseLon,
  pageSize,
  pageNumber
) => {
  try {
    const response = await fetch(
      new URL(
        "hikes?" +
          new URLSearchParams({
            minLen,
            maxLen,
            minTime,
            maxTime,
            minAscent,
            maxAscent,
            difficulty,
            radius: radius / 1000,
            baseLat,
            baseLon,
            pageSize,
            pageNumber,
          }),
        SERVER_BASE
      ),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      throw response.json();
    }
  } catch (e) {
    throw e;
  }
};

const getHikeDetails = async (hike) => {
  try {
    const response = await fetch(
      new URL("hikes/" + hike.id+"/track", SERVER_BASE),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      //throw response.json();
      const coordinates = track.map((elem) => [
        elem.geometry.coordinates[1],
        elem.geometry.coordinates[0],
      ]);
      return {
        startPoint: {
          type: undefined,
          coordinates: coordinates[0],
          name: "Torino",
          address: "address 1",
        },
        endPoint: {
          type: undefined,
          coordinates: coordinates[coordinates.length - 1],
          name: "Torino",
          address: "address 1",
        },
        referencePoints: [
          {
            type: undefined,
            coordinates: coordinates[200],
            name: "Torino",
            address: "address 1",
          },
          {
            type: undefined,
            coordinates: coordinates[400],
            name: "Torino",
            address: "address 1",
          },
          {
            type: undefined,
            coordinates: coordinates[600],
            name: "Torino",
            address: "address 1",
          },
          {
            type: undefined,
            coordinates: coordinates[800],
            name: "Torino",
            address: "address 1",
          },
          {
            type: undefined,
            coordinates: coordinates[1000],
            name: "Torino",
            address: "address 1",
          },
          {
            type: undefined,
            coordinates: coordinates[1200],
            name: "Torino",
            address: "address 1",
          },
        ],
        track: coordinates,
      };
    }
  } catch (e) {
    throw e;
  }
};
const API = {
  getHikesLimits,
  getAllHikes,
  getFilteredHikes,
  getHikeDetails,
};

export default API;
