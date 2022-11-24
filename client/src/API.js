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

const registerUser = async (formData) => {
  try {
    const response = await fetch(new URL("signup", SERVER_BASE), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
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

const API = {
  getHikesLimits,
  getAllHikes,
  getFilteredHikes,
  registerUser
};

export default API;
