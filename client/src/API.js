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
      return await response.json();
    } else {
      throw await response.text();
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
      return await response.json();
    } else {
      throw await response.text();
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
      return await response.json();
    } else {
      throw await response.text();
    }
  } catch (e) {
    throw e;
  }
};

const registerUser = async (formData) => {
  try {
    const response = await fetch(new URL("signup", SERVER_BASE), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw await response.text();
    }
  } catch (e) {
    throw e;
  }
};

const activateEmail = async (formData) => {
  try {
    const response = await fetch(new URL("email-activate", SERVER_BASE), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw await response.text();
    }
  } catch (e) {
    throw e;
  }
};
const getHikeDetails = async (hike) => {
  try {
    const response = await fetch(
      new URL("hikes/" + hike.id + "/track", SERVER_BASE),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw await response.text();
    }
  } catch (e) {
    throw e;
  }
};

const newHike = async (formData) => {
  try {
    const response = await fetch(new URL("hike", SERVER_BASE), {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw await response.text();
    }
  } catch (e) {
    throw e;
  }
};

const login = async (credentials) => {
  try {
    const response = await fetch(new URL("sessions", SERVER_BASE), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw await response.text();
    }
  } catch (e) {
    throw e;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_BASE + "sessions/current", {
    credentials: "include",
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw await response.text();
  }
};

const logout = async () => {
  const response = await fetch(SERVER_BASE + "sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const getFilteredHut = async (
  minNumOfBeds,
  maxNumOfBeds,
  baseLat,
  baseLon,
  radius,
  pageNumber,
  pageSize,
  minAltitude,
  maxAltitude
) => {
  try {
    const response = await fetch(
      new URL(
        "huts?" +
          new URLSearchParams({
            minNumOfBeds,
            maxNumOfBeds,
            baseLat,
            baseLon,
            radius : radius/1000,
            pageNumber,
            pageSize,
            minAltitude,
            maxAltitude
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
      throw response.text();
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
  newHike,
  registerUser,
  activateEmail,
  login,
  logout,
  getUserInfo,
  getFilteredHut
};

export default API;
