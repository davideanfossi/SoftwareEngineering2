const DBManager = require('../database/dbManager');
const HikeDAO = require('../daos/hikeDAO');
const {Hike, difficultyType} = require('../models/hikeModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeDAO = new HikeDAO(dbManager);

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

describe('Hike DAO unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        let res = await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        res = await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        res = await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);
        res = await dbManager.query(sql, ["45.574405", "7.455193", 300, "point 4", null]);

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
        expect(() => new HikeDAO())
            .toThrow('DBManager must be defined for Hike dao!');
    });

    const hike1 = new Hike(1, "title 1", 1000, 120, 300, mid, 1, 2, "description 1", [], null, 1);
    const hike2 = new Hike(2, "title 2", 2000, 180, 500, high, 1, 4, "description 2", [], null, 1);
    const hike3 = new Hike(3, "title 3", 1500, 100, 200, low, 3, 4, "description 3", [], null, 1);
    const hike4 = new Hike(4, "title 4", 1600, 120, 350, mid, 2, 4, "description 4", [], null, 1);
    testGetAllHikes([hike1, hike2, hike3, hike4]);
    
    testGetHikes(1600, undefined, undefined, undefined, undefined, undefined, undefined, [hike2, hike4]);
    testGetHikes(undefined, 1600, undefined, undefined, undefined, undefined, undefined, [hike1, hike3, hike4]);
    testGetHikes(undefined, undefined, 150, undefined, undefined, undefined, undefined, [hike2]);
    testGetHikes(undefined, undefined, undefined, 150, undefined, undefined, undefined, [hike1, hike3, hike4]);
    testGetHikes(undefined, undefined, undefined, undefined, 350, undefined, undefined, [hike2, hike4]);
    testGetHikes(undefined, undefined, undefined, undefined, undefined, 300, undefined, [hike1, hike3]);
    testGetHikes(undefined, undefined, undefined, undefined, undefined, undefined, low, [hike3]);
    testGetHikes(undefined, undefined, undefined, undefined, undefined, undefined, mid, [hike1, hike4]);
    testGetHikes(undefined, undefined, undefined, undefined, undefined, undefined, high, [hike2]);

    const expectedMaxData = {"maxLength": 2000, "maxExpectedTime": 180, "maxAscent": 500};
    testGetMaxData(expectedMaxData);
});


function testGetAllHikes(expectedHikes) {
    test('test get all hikes', async () => {
        const res = await hikeDAO.getAllHikes();
        expect(res).toEqual(expect.arrayContaining(expectedHikes));
    });
}

function testGetHikes(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty, expectedHikes) {
    test('test get filtered hikes', async () => {
        const res = await hikeDAO.getHikes(minLen, maxLen, minTime, maxTime, minAscent, maxAscent, difficulty);
        expect(res).toEqual(expect.arrayContaining(expectedHikes));
    });
}

function testGetMaxData(expectedObj) {
    test('test get max data', async () => {
        const res = await hikeDAO.getMaxData();
        expect(res).toEqual(expectedObj);
    });
}


