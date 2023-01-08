const DBManager = require('../database/dbManager');
const HikeDAO = require('../daos/hikeDAO');
const PointDAO = require('../daos/pointDAO');
const UserDAO = require("../daos/userDAO");
const Point = require('../models/pointModel');
const User = require('../models/userModel');
const RecordedHike = require("../models/recordedHike");
const ProfileService = require('../services/profileService');

const { Hike, difficultyType } = require('../models/hikeModel');
const { purgeAllTables } = require('./purgeUtils');
const dayjs = require('dayjs');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const userDAO = new UserDAO(dbManager);
const profileService = new ProfileService(hikeDAO, pointDAO, userDAO);

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

const undefinedPage = { pageNumber: undefined, pageSize: undefined };
const undefinedLen = { minLen: undefined, maxLen: undefined };
const undefinedTime = { minTime: undefined, maxTime: undefined };
const undefinedAscent = { minAscent: undefined, maxAscent: undefined };
const undefinedRad = { baseLat: undefined, baseLon: undefined, radius: undefined };


describe('Profile Service unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["user1@test.it", "user 1", "Hiker", "password", "salt", null, null, null, 1, null, null]);
        await dbManager.query(sql, ["user2@test.it", "user 2", "Local Guide", "password", "salt", "frank", "white", "123456789", 1, null, null]);

        sql = "INSERT INTO Hike(title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description, gpxPath, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["title 1", 1000, 120, 300, mid, 1, 2, "description 1", null, 2]);
        await dbManager.query(sql, ["title 2", 2000, 180, 500, high, 1, 3, "description 2", null, 2]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new ProfileService(undefined, pointDAO, userDAO))
            .toThrow('hikeDAO must be defined for profile service!');
        expect(() => new ProfileService(hikeDAO, undefined, userDAO))
            .toThrow('pointDAO must be defined for profile service!');
        expect(() => new ProfileService(hikeDAO, pointDAO, undefined))
            .toThrow('userDAO must be define for profile service!');
    });

    const point1 = new Point(1, 45.0703393, 7.686864, 200, "point 1", null);
    const point2 = new Point(2, 45.070254, 7.702042, 250, "point 2", "address 2");
    const point3 = new Point(3, 45.119817, 7.565056, 250, "point 3", "address 3");

    const hike1 = new Hike(1, "title 1", 1000, 120, 300, mid, "description 1", 2, null, point1, point2, undefined, []);
    const hike2 = new Hike(2, "title 2", 2000, 180, 500, high, "description 2", 2, null, point1, point3, undefined, []);

    const user1 = new User(1, "user 1", "user1@test.it", "Hiker", "", "", "");
    const user2 = new User(2, "user 2", "user2@test.it", "Local Guide", "frank", "white", "123456789");

    const recordedHike1 = new RecordedHike(1, hike1.id, user1.id, "2022-12-18T16:09:12Z", "");

    testGetUserHikes("test get user hikes", user2.id, undefinedPage, undefinedLen, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hike1, hike2] });
    testGetUserHikes("test get user hikes user without hikes", user1.id, undefinedPage, undefinedLen, undefinedTime, undefinedAscent, undefined, undefinedRad,
        { "totalPages": 0, "pageNumber": 1, "pageSize": 10, "pageItems": [] });
    testGetUserHikesLimits(user2.id, { "maxLength": 2000, "maxExpectedTime": 180, "maxAscent": 500, "difficultyType": [low, mid, high] });

    testRecordHike('test record hike start', hike1.id, user1.id, "start", "2022-12-18T16:09:12Z", 1);
    testGetLastRecordedHike('test get last recorded hike', hike1.id, user1.id, recordedHike1);
    testErrorRecordHike('test record hike error nonexistent hike', 10, user1.id, "start", "2022-12-18T16:09:12Z",
        { returnCode: 404, message: "Hike not found" });
    testErrorRecordHike('test record hike error ongoing hike', hike2.id, user1.id, "start", "2022-12-20T16:09:12Z",
        { returnCode: 409, message: "Only one Hike can be started at the same time" });

    testErrorRecordHike('test record hike error end before start', hike1.id, user1.id, "end", "2022-12-18T16:08:12Z",
        { returnCode: 409, message: "End dateTime must be after starting dateTime" });

    testRecordHike('test record hike end', hike1.id, user1.id, "end", "2022-12-18T17:09:12Z", 1);
    testErrorRecordHike('test record hike error hike already terminated', hike1.id, user1.id, "end", "2022-12-18T17:09:12Z",
        { returnCode: 409, message: "Hike not started yet" });
    testErrorRecordHike('test record hike error date overlapping with other recorded hike', hike1.id, user1.id, "start", "2022-12-18T16:30:00Z",
        { returnCode: 409, message: "DateTime overlaps with another completed hike" });
    testErrorRecordHike('test record hike error future date', hike1.id, user1.id, "start", dayjs().add(1, 'day').utc().format(),
        { returnCode: 409, message: "DateTime cannot be a future date" });
});


function testGetUserHikes(testMsg, userId, { pageNumber, pageSize }, { minLen, maxLen }, { minTime, maxTime }, { minAscent, maxAscent }, difficulty, { baseLat, baseLon, radius }, expectedObj) {
    test(testMsg, async () => {
        const res = await profileService.getUserHikes({ minLen, maxLen }, { minTime, maxTime }, { minAscent, maxAscent }, difficulty, userId, { baseLat, baseLon, radius }, { pageNumber, pageSize });
        expect(res).toEqual(expectedObj);
    });
}

function testGetUserHikesLimits(userId, expectedObj) {
    test('test get hikes limits', async () => {
        const res = await profileService.getUserHikesLimits(userId);
        expect(res).toEqual(expectedObj);
    });
}

function testRecordHike(testMsg, hikeId, userId, recordType, dateTime, expectedResult) {
    test(testMsg, async () => {
        const res = await profileService.recordHike(hikeId, userId, recordType, dateTime);
        expect(res).toEqual(expectedResult);
    });
}

function testGetLastRecordedHike(testMsg, hikeId, userId, expectedRecordedHike) {
    test(testMsg, async () => {
        const res = await profileService.getLastRecordedHike(hikeId, userId);
        expect(res).toEqual(expectedRecordedHike);
    });
}

function testErrorRecordHike(testMsg, hikeId, userId, recordType, dateTime, expectedError) {
    test(testMsg, async () => {
        async function invalidRecordHike() {
            await profileService.recordHike(hikeId, userId, recordType, dateTime);
        }
        await expect(invalidRecordHike).rejects.toEqual(expectedError);
    })
}