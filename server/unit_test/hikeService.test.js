const DBManager = require('../database/dbManager');
const HikeDAO = require('../daos/hikeDAO');
const PointDAO = require('../daos/pointDAO');
const Point = require('../models/pointModel');
const {Hike, difficultyType} = require('../models/hikeModel');
const HikeService = require("../services/hikeService");
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hikeService = new HikeService(hikeDAO, pointDAO);

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

describe('Hike DAO unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, city, province, address) VALUES (?, ?, ?, ?, ?, ?, ?);";
        let res = await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", "Torino", "Piemonte", null]);
        res = await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "Torino", "Piemonte", "address 2"]);
        res = await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "Cuneo", "Piemonte", "address 3"]);
        res = await dbManager.query(sql, ["47.574405", "8.455193", 300, "point 4", "Milano", "Lombardia", null]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);

        sql = "INSERT INTO Hike(title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description, gpxPath, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, ["title 1", 1000, 120, 300, mid, 1, 2, "description 1", null, 1]);
        res = await dbManager.query(sql, ["title 2", 2000, 180, 500, high, 1, 4, "description 2", null, 1]);
        res = await dbManager.query(sql, ["title 3", 1500, 100, 200, low, 3, 4, "description 3", null, 1]);
        res = await dbManager.query(sql, ["title 4", 1600, 120, 350, mid, 2, 4, "description 4", null, 1]);

        sql = "INSERT INTO ReferencePoints(hikeId, pointId) VALUES (?, ?);";
        res = await dbManager.query(sql, [2, 2]);
        res = await dbManager.query(sql, [2, 3]);
        res = await dbManager.query(sql, [3, 2]);
        res = await dbManager.query(sql, [4, 3]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });
    
    describe('Constructor test', () => {
        expect(() => new HikeService(undefined, pointDAO))
            .toThrow('hikeDAO must be defined for hike service!');
        expect(() => new HikeService(hikeDAO, undefined))
            .toThrow('pointDAO must be defined for hike service!');
    });

    const point1 = new Point(1, 45.0703393, 7.686864, 200, "point 1", "Torino", "Piemonte", null);
    const point2 = new Point(2, 45.070254, 7.702042, 250, "point 2", "Torino", "Piemonte", "address 2");
    const point3 = new Point(3, 45.119817, 7.565056, 250, "point 3", "Cuneo", "Piemonte", "address 3");
    const point4 = new Point(4, 47.574405, 8.455193, 300, "point 4", "Milano", "Lombardia", null);

    const hike1 = new Hike(1, "title 1", 1000, 120, 300, mid, point1, point2, "description 1", [], null, 1);
    const hike2 = new Hike(2, "title 2", 2000, 180, 500, high, point1, point4, "description 2", [point2, point3], null, 1);
    const hike3 = new Hike(3, "title 3", 1500, 100, 200, low, point3, point4, "description 3", [point2], null, 1);
    const hike4 = new Hike(4, "title 4", 1600, 120, 350, mid, point2, point4, "description 4", [point3], null, 1);
   
    testGetHikesLimits( {"maxLength": 2000, "maxExpectedTime": 180, "maxAscent": 500, "difficultyType": [ low, mid, high]});

    let page = 1;
    let pageSize = 2;
    testGetHikes("test get hikes page and pageSize", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 2, "pageNumber": page, "pageSize": pageSize, "pageItems": [hike1, hike2]});
    page = 2;
    testGetHikes("test get hikes page and pageSize", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 2, "pageNumber": page, "pageSize": pageSize, "pageItems": [hike3, hike4]});
    page = undefined;
    pageSize = undefined;
    testGetHikes("test get hikes page and pageSize undefined", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike2, hike3, hike4]});

    testGetHikes("test get hikes minLen", page, pageSize, 1500, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4]});
    testGetHikes("test get hikes maxLen", page, pageSize, undefined, 1500, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3]});
    testGetHikes("test get hikes minTime", page, pageSize, undefined, undefined, 150, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2]});
    testGetHikes("test get hikes maxTime", page, pageSize, undefined, undefined, undefined, 150, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3, hike4]});
    testGetHikes("test get hikes minAscent", page, pageSize, undefined, undefined, undefined, undefined, 500, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2]});
    testGetHikes("test get hikes maxAscent", page, pageSize, undefined, undefined, undefined, undefined, undefined, 300, undefined, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike3]});
    testGetHikes("test get hikes difficulty", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, mid, undefined, undefined, undefined, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike4]});
    testGetHikes("test get hikes radius", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 47.5715101, 8.456101, 10, undefined, undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4]});
    testGetHikes("test get hikes city", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Milano", undefined,
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4]});
    testGetHikes("test get hikes province", page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Lombardia",
        {"totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike2, hike3, hike4]});




function testGetHikes(testMsg, pageNumber, pageSize, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius=0, city, province, expectedObj) {
    test(testMsg, async () => {
        const res = await hikeService.getHikes(pageNumber, pageSize, minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, baseLat, baseLon, radius, city, province);
        expect(res).toEqual(expectedObj);
    });
}

function testGetHikesLimits(expectedObj) {
    test('test get hikes limits', async () => {
        const res = await hikeService.getHikesLimits();
        expect(res).toEqual(expectedObj);
    });
}


