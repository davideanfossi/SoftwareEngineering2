const togeojson = require('togeojson');
const DOMParser = require('xmldom').DOMParser;
const gpxParser = require('gpxparser');

const parseGpx = (file) => {
    try {
        const gpxFile = new DOMParser().parseFromString(file);
        const geoJson = togeojson.gpx(gpxFile);
        const desc = geoJson.features[0].properties.desc ? geoJson.features[0].properties.desc : "";
        const name = geoJson.features[0].properties.name ? geoJson.features[0].properties.name : "";

        const gpx = new gpxParser();
        gpx.parse(file);
        const start = {"lat": gpx.tracks[0].points[0].lat, "lon": gpx.tracks[0].points[0].lon, "ele": gpx.tracks[0].points[0].ele};
        const end = {"lat": gpx.tracks[0].points[gpx.tracks[0].points.length - 1].lat, "lon": gpx.tracks[0].points[gpx.tracks[0].points.length - 1].lon, "ele": gpx.tracks[0].points[gpx.tracks[0].points.length - 1].ele};
		const length = Math.round((parseFloat(gpx.tracks[0].distance.total)) * 1e2) / 1e2;
		const ascent = Math.round((parseFloat(gpx.tracks[0].elevation.pos)) * 1e2) / 1e2;
        return {start, end, name, desc, length, ascent};
    } catch(err) {
        console.log(err);
    }
}


module.exports = parseGpx;