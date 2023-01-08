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

const undefinedPage = {pageNumber: undefined, pageSize: undefined};
const undefinedLen = { minLen: undefined, maxLen: undefined };
const undefinedTime = { minTime: undefined, maxTime: undefined };
const undefinedAscent = { minAscent: undefined, maxAscent: undefined };
const undefinedRad = { baseLat: undefined, baseLon: undefined, radius: undefined };


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

        sql = "INSERT INTO Hike(title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description, gpxPath, userId,imageName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?);";
        await dbManager.query(sql, ["title 1", 1000, 120, 300, mid, 1, 2, "description 1", testFileBasename, 1,"hike1 image"]);
        await dbManager.query(sql, ["title 2", 2000, 180, 500, high, 1, 4, "description 2", null, 1,null]);
        await dbManager.query(sql, ["title 3", 1500, 100, 200, low, 3, 4, "description 3", null, 1,"hike3 image"]);
        await dbManager.query(sql, ["title 4", 1600, 120, 350, mid, 2, 4, "description 4", null, 1,null]);

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

    const hike1 = new Hike(1, "title 1", 1000, 120, 300, mid, "description 1", 1, testFileBasename, point1, point2,"hike1 image", []);
    const hike2 = new Hike(2, "title 2", 2000, 180, 500, high, "description 2", 1, null, point1, point4,null, [point2, point3]);
    const hike3 = new Hike(3, "title 3", 1500, 100, 200, low, "description 3", 1, null, point3, point4,"hike3 image", [point2]);
    const hike4 = new Hike(4, "title 4", 1600, 120, 350, mid, "description 4", 1, null, point2, point4,null, [point3]);

    testGetHikesLimits({ "maxLength": 2000, "maxExpectedTime": 180, "maxAscent": 500, "difficultyType": [low, mid, high] });

    let pageNumber = 1;
    let pageSize = 2;
    testGetHikes("test get hikes page and pageSize", { pageNumber, pageSize }, undefinedLen, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 2, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": [hike1, hike2] });
    pageNumber = 2;
    testGetHikes("test get hikes page and pageSize", { pageNumber, pageSize }, undefinedLen, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 2, "pageNumber": pageNumber, "pageSize": pageSize, "pageItems": [hike3, hike4] });
    pageNumber = undefined;
    pageSize = undefined;
    testGetHikes("test get hikes page and pageSize undefined", { pageNumber, pageSize }, undefinedLen, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike2, hike3, hike4] });

    testGetHikes("test get hikes minLen", { pageNumber, pageSize }, { minLen: 1500, maxLen: undefined }, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4] });
    testGetHikes("test get hikes maxLen", { pageNumber, pageSize }, { minLen: undefined, maxLen: 1500 }, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3] });
    testGetHikes("test get hikes minTime", { pageNumber, pageSize }, undefinedLen, { minTime: 150, maxTime: undefined }, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2] });
    testGetHikes("test get hikes maxTime", { pageNumber, pageSize }, undefinedLen, { minTime: undefined, maxTime: 150 }, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3, hike4] });
    testGetHikes("test get hikes minAscent", { pageNumber, pageSize }, undefinedLen, undefinedTime, { minAscent: 500, maxAscent: undefined }, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2] });
    testGetHikes("test get hikes maxAscent", { pageNumber, pageSize }, undefinedLen, undefinedTime, { minAscent: undefined, maxAscent: 300 }, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3] });
    testGetHikes("test get hikes difficulty", { pageNumber, pageSize }, undefinedLen, undefinedTime, undefinedAscent, mid, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike4] });
    testGetHikes("test get hikes radius", { pageNumber, pageSize }, undefinedLen, undefinedTime, undefinedAscent, undefined, { baseLat: 47.5715101, baseLon: 8.456101, radius: 10 },
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4] });


    testAddHike(new Hike(undefined, "title 5", 1000, 120, 300, mid, "description 5", 1, undefined), new Point(undefined, "40.714", "65.714", 1000, "p1", "A1"), new Point(undefined, "48.412", "98.714", 1400, "p2", "A2"));
    testAddHike(new Hike(undefined, "title 6", 2000, 220, 400, high, undefined, 1, undefined), new Point(undefined, "30.714", "35.714", 1000, "p1", undefined), new Point(undefined, "28.412", "55.714", 1400, "p2", "A2"));

    const gpx = new DOMParser().parseFromString(fs.readFileSync(testFileName, 'utf8'));
    const expectedTrack = togeojson.gpx(gpx).features[0].geometry.coordinates.map(p => { return { "lat": p[1], "lon": p[0] } });
    testGetHikeGpx(1, { "startPoint": hike1.startPoint, "endPoint": hike1.endPoint, "referencePoints": hike1.referencePoints, "track": expectedTrack });
    testGetHikeGpxError("test get hike gpx error 404", 100, { returnCode: 404, message: "Hike not Found" });
    testGetHikeGpxError("test get hike gpx error no gpx file", 2, { returnCode: 500, message: "Gpx file does not exist" });
});


function testGetHikes(testMsg, { pageNumber, pageSize }, { minLen, maxLen }, { minTime, maxTime }, { minAscent, maxAscent }, difficulty, { baseLat, baseLon, radius }, expectedObj) {
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

function testAddHike(hike, startPoint, endPoint) {
    test('add new hike', async () => {
        let lastID = await hikeService.addHike(hike, startPoint, endPoint);
        expect(lastID).toBeTruthy();

        const res = await hikeService.getHikes(undefinedLen, undefinedTime, undefinedAscent, hike.difficulty, undefinedRad, undefinedPage);
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


