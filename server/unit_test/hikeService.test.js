const DBManager = require('../database/dbManager');
const HikeDAO = require('../daos/hikeDAO');
const PointDAO = require('../daos/pointDAO');
const ParkingDAO = require("../daos/parkingDAO");
const HutDAO = require("../daos/hutDAO");
const Point = require('../models/pointModel');
const { Hike, difficultyType } = require('../models/hikeModel');
const HikeService = require("../services/hikeService");
const { purgeAllTables } = require('./purgeUtils');
const togeojson = require('togeojson');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const path = require('path');
const config = require("../config.json");

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const parkingDAO = new ParkingDAO(dbManager);
const hutDAO = new HutDAO(dbManager);
const hikeService = new HikeService(hikeDAO, pointDAO, hutDAO, parkingDAO);

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

const testFileBasename = "testgpx.gpx";
const testFileName = path.resolve("unit_test/files/", testFileBasename);


describe('Hike DAO unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);
        await dbManager.query(sql, ["47.574405", "8.455193", 300, "point 4", null]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);

        sql = "INSERT INTO Hike(title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description, gpxPath, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["title 1", 1000, 120, 300, mid, 1, 2, "description 1", testFileBasename, 1]);
        await dbManager.query(sql, ["title 2", 2000, 180, 500, high, 1, 4, "description 2", null, 1]);
        await dbManager.query(sql, ["title 3", 1500, 100, 200, low, 3, 4, "description 3", null, 1]);
        await dbManager.query(sql, ["title 4", 1600, 120, 350, mid, 2, 4, "description 4", null, 1]);

        sql = "INSERT INTO ReferencePoints(hikeId, pointId) VALUES (?, ?);";
        await dbManager.query(sql, [2, 2]);
        await dbManager.query(sql, [2, 3]);
        await dbManager.query(sql, [3, 2]);
        await dbManager.query(sql, [4, 3]);

        try {
            fs.copyFile(testFileName, path.resolve(config.gpxPath, testFileBasename), (err) => {
                if (err) throw err;
            });
        } catch (err) {/*foo*/ }
    });

    afterAll(async () => {
        try {
            dbManager.closeConnection();
            fs.unlinkSync(path.resolve(config.gpxPath, testFileBasename)); // remove file
        }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HikeService(undefined, pointDAO))
            .toThrow('hikeDAO must be defined for hike service!');
        expect(() => new HikeService(hikeDAO, undefined))
            .toThrow('pointDAO must be defined for hike service!');
        expect(() => new HikeService(hikeDAO, pointDAO, undefined))
            .toThrow('hutDAO must be defined for hike service!');
        expect(() => new HikeService(hikeDAO, pointDAO, hutDAO))
            .toThrow('parkingDAO must be defined for hike service!');
    });

    const point1 = new Point(1, 45.0703393, 7.686864, 200, "point 1", null);
    const point2 = new Point(2, 45.070254, 7.702042, 250, "point 2", "address 2");
    const point3 = new Point(3, 45.119817, 7.565056, 250, "point 3", "address 3");
    const point4 = new Point(4, 47.574405, 8.455193, 300, "point 4", null);

    const hike1 = new Hike(1, "title 1", 1000, 120, 300, mid, "description 1", 1, testFileBasename, point1, point2, []);
    const hike2 = new Hike(2, "title 2", 2000, 180, 500, high, "description 2", 1, null, point1, point4, [point2, point3]);
    const hike3 = new Hike(3, "title 3", 1500, 100, 200, low, "description 3", 1, null, point3, point4, [point2]);
    const hike4 = new Hike(4, "title 4", 1600, 120, 350, mid, "description 4", 1, null, point2, point4, [point3]);

    testGetHikesLimits({ "maxLength": 2000, "maxExpectedTime": 180, "maxAscent": 500, "difficultyType": [low, mid, high] });

    let page = 1;
    let pageSize = 2;
    testGetHikes("test get hikes page and pageSize", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 2, "pageNumber": page, "pageSize": pageSize, "pageItems": [hike1, hike2] });
    page = 2;
    testGetHikes("test get hikes page and pageSize", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 2, "pageNumber": page, "pageSize": pageSize, "pageItems": [hike3, hike4] });
    page = undefined;
    pageSize = undefined;
    testGetHikes("test get hikes page and pageSize undefined", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike2, hike3, hike4] });

    testGetHikes("test get hikes minLen", page, pageSize, 1500, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4] });
    testGetHikes("test get hikes maxLen", page, pageSize, undefined, 1500, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3] });
    testGetHikes("test get hikes minTime", page, pageSize, undefined, undefined, 150, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2] });
    testGetHikes("test get hikes maxTime", page, pageSize, undefined, undefined, undefined, 150, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3, hike4] });
    testGetHikes("test get hikes minAscent", page, pageSize, undefined, undefined, undefined, undefined, 500, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2] });
    testGetHikes("test get hikes maxAscent", page, pageSize, undefined, undefined, undefined, undefined, undefined, 300, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3] });
    testGetHikes("test get hikes difficulty", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, mid, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike4] });
    testGetHikes("test get hikes radius", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 47.5715101, 8.456101, 10,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4] });


    testAddHike("title 5", 1000, 120, 300, mid, "description 5", undefined, 1, "40.714", "65.714", 1000, "p1", "A1", "48.412", "98.714", 1400, "p2", "A2");
    testAddHike("title 6", 2000, 220, 400, high, undefined, undefined, 1, "30.714", "35.714", 1000, "p1", undefined, "28.412", "55.714", 1400, "p2", "A2");

    const gpx = new DOMParser().parseFromString(fs.readFileSync(testFileName, 'utf8'));
    const expectedTrack = togeojson.gpx(gpx).features[0].geometry.coordinates.map(p => { return { "lat": p[1], "lon": p[0] } });
    testGetHikeGpx(1, { "startPoint": hike1.startPoint, "endPoint": hike1.endPoint, "referencePoints": hike1.referencePoints, "track": expectedTrack });
    testGetHikeGpxError("test get hike gpx error 404", 100, { returnCode: 404, message: "Hike not Found" });
    testGetHikeGpxError("test get hike gpx error no gpx file", 2, { returnCode: 500, message: "Gpx file does not exist" });
});



function testGetHikes(testMsg, pageNumber, pageSize, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius = 0, expectedObj) {
    test(testMsg, async () => {
        const res = await hikeService.getHikes({ minLen, maxLen }, { minTime, maxTime }, { minAscent, maxAscent }, difficulty, { baseLat, baseLon, radius }, { pageNumber, pageSize });
        expect(res).toEqual(expectedObj);
    });
}

function testGetHikesLimits(expectedObj) {
    test('test get hikes limits', async () => {
        const res = await hikeService.getHikesLimits();
        expect(res).toEqual(expectedObj);
    });
}

function testAddHike(title, length, expectedTime, ascent, difficulty, description, gpxPath, userId, startLatitude, startLongitude, startAltitude, startPointLabel, startAddress, endLatitude, endLongitude, endAltitude, endPointLabel, endAddress) {
    test('add new hike', async () => {
        const hike = new Hike(undefined, title, length, expectedTime, ascent, difficulty, description, userId, gpxPath);
        const startPoint = new Point(undefined, startLatitude, startLongitude, startAltitude, startPointLabel, startAddress);
        const endPoint = new Point(undefined, endLatitude, endLongitude, endAltitude, endPointLabel, endAddress);
        let lastID = await hikeService.addHike(hike, startPoint, endPoint);
        expect(lastID).toBeTruthy();

        const res = await hikeService.getHikes({ undefined, undefined }, { undefined, undefined }, { undefined, undefined }, difficulty, { undefined, undefined, undefined }, { undefined, undefined });
        expect(res.pageItems.length).toBeGreaterThan(0);

    })
}

function testGetHikeGpx(hikeId, expectedObj) {
    test('test get hikes gpx', async () => {
        const res = await hikeService.getHikeGpx(hikeId);
        expect(res).toEqual(expectedObj);
    });
}

function testGetHikeGpxError(testMsg, hikeId, expectedError) {
    test(testMsg, async () => {
        async function invalidgetHikeGpx() {
            await hikeService.getHikeGpx(hikeId);
        }
        await expect(invalidgetHikeGpx).rejects.toEqual(expectedError);
    })
}

