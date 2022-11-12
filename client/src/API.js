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

const newHike = async hike => {
  try {
    const response = await fetch(
      new URL("hike", SERVER_BASE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:  JSON.stringify(hike),
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

const API = {
  getHikesLimits,
  newHike
};

export default API;