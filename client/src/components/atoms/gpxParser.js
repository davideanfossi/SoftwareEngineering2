const togeojson = require('togeojson');
const DOMParser = require('xmldom').DOMParser;

const parseGpx = (file) => {
    try {
        //const filepath = path.resolve(gpxdir, filename)
        const gpx = new DOMParser().parseFromString(file);
        const geoJson = togeojson.gpx(gpx);
        const coordinates = geoJson.features[0].geometry.coordinates;
        const start = coordinates[0];
        const end = coordinates[coordinates.length-1];
        return [start, end];
    } catch(err) {
        console.log(err);
    }
;}

module.exports = parseGpx;