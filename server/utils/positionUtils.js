"use strict";

/**
 * @param {*} baseLat latitude of the center of the circle
 * @param {*} baseLng longitude of the center of the circle
 * @param {*} lat latitude of the point to check
 * @param {*} lng longitude of the point to check
 * @param {*} radius radius in km
 * @returns true if the point is inside the radius, otherwise false
 */
function isWithinCircle(baseLat, baseLng, lat, lng, radius) {
    return computeDistance(baseLat, baseLng, lat, lng) <= radius;
}


// compute the distance in kilometers between two points
function computeDistance(lat1, lon1, lat2, lon2) {
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const rad2deg = (rad) => rad * (180.0 / Math.PI);
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        const theta = lon1 - lon2;
        let dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
        dist = rad2deg(Math.acos(dist));
        let km = dist * 60 * 1.1515 * 1.609344;
        return km;
    }
}

/**
 * 
 * @param {*} baseLat latitude of the center of the circle
 * @param {*} baseLon longitude of the center of the circle
 * @param {*} radius radius in km
 * @param {*} hike the object hike
 * @returns true if the hike has start point, end point or a reference point inside the radius, otherwise false
 */
function checkHikeIsWithinCircle(baseLat, baseLon, radius, hike) {
    return isWithinCircle(baseLat, baseLon, hike.startPoint.latitude, hike.startPoint.longitude, radius)
        || isWithinCircle(baseLat, baseLon, hike.endPoint.latitude, hike.endPoint.longitude, radius)
        || hike.referencePoints.some(rp => isWithinCircle(baseLat, baseLon, rp.latitude, rp.longitude, radius))
}


function checkParkingIsWithinCircle5(hike, parking){
    return isWithinCircle(hike.startPoint.latitude, hike.startPoint.longitude, parking.latitude, parking.longitude, 5)
}

function checkHutIsWithinCircle5(hike, hut){
    return isWithinCircle(hike.startPoint.latitude, hike.startPoint.longitude, hut.latitude, hut.longitude, 5)
}


module.exports = { isWithinCircle, checkHikeIsWithinCircle, checkParkingIsWithinCircle5, checkHutIsWithinCircle5 };
