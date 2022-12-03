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
        const name = geoJson.features[0].properties.name;
        const desc = geoJson.features[0].properties.desc;
        return {start, end, name, desc};
    } catch(err) {
        console.log(err);
    }
}

module.exports = parseGpx;