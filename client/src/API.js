const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api/`;

const getHikesLimits = async () => {
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
};

const getAllHikes = async () => {
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
};

const registerUser = async (formData) => {
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
};

const activateEmail = async (formData) => {
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
};
const getHikeDetails = async (hike) => {
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
};

const newHike = async (formData) => {
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
};

const login = async (credentials) => {
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


const newParking = async (formData) => {
    const response = await fetch(new URL("parking", SERVER_BASE), {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.ok) {
      return response.json();
    } else {
      throw response.text();
    }
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
    const response = await fetch(
      new URL(
        "huts?" +
        new URLSearchParams({
          minNumOfBeds,
          maxNumOfBeds,
          baseLat,
          baseLon,
          radius: radius / 1000,
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
};

const getHutsLimits = async () => {
    const response = await fetch(new URL("huts/limits", SERVER_BASE), {
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
};

const getAltitudeFromCoordinates = async (lat, lon) => {
  const response = await fetch(new URL("altitude?" + 
  new URLSearchParams({lat, lon}), SERVER_BASE), {
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

}

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
  getFilteredHut,
  getHutsLimits,
  newParking,
  getAltitudeFromCoordinates
};

export default API;
