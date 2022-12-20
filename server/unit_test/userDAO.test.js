const DBManager = require('../database/dbManager');
const UserDAO = require('../daos/userDAO');
const User = require('../models/userModel');
const RecordedHike = require("../models/recordedHike");
const { Hike, difficultyType } = require('../models/hikeModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const userDAO = new UserDAO(dbManager);

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

const userPwd = "password";
const pwd = "1a4f1f2bd4e9a19020e46841be0b83f7c5c35dd1b0274889a17dd626c32e464f85d10ba0542dfc57d367fb7e152473c950bb5a73fd460c04b47d335216a55c34";
const salt = "573baba3c05d9b2bedb03ba950561e20";

describe('User DAO unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["user1@test.it", "user 1", "Hiker", pwd, salt, null, null, null, 1, null, null]);

        sql = "INSERT INTO Hike(title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description, gpxPath, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["title 1", 1000, 120, 300, mid, 1, 2, "description 1", null, 1]);
        await dbManager.query(sql, ["title 2", 2000, 180, 500, high, 1, 3, "description 2", null, 1]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new UserDAO())
            .toThrow('DBManager must be defined for User dao!');
    });

    const hike1 = new Hike(1, "title 1", 1000, 120, 300, mid, "description 1", 1, null, 1, 2, []);
    const hike2 = new Hike(2, "title 2", 2000, 180, 500, high, "description 2", 1, null, 1, 3, []);
    const user = new User(1, "user 1", "user1@test.it", "Hiker", "", "", "");
    const recordedHike = new RecordedHike(1, hike1.id, user.id, "2022-12-18T16:09:12Z", null);

    testGetUserById('test get user by id', user.id, user);
    testGetUserById('test get user by wrong id', 10, undefined);
    testGetUserByEmail('test get user by email', user.email, user);
    testGetUserByEmail('test get user by wrong email', "wrong@test.it", undefined);
    testGetUserByCredentials('test get user by credentials', user.username, user.email, user.role, user);
    testGetUserByCredentials('test get user by wrong credentials', "wrong user", "user1@test.it", "Hiker", undefined);
    testLoginUser('test login user', "user1@test.it", userPwd,
        { "id": user.id, "username": user.username, "email": user.email, "role": user.role });

    testInsertRecordedHike('test insert recorded hike', recordedHike, 1);
    testGetRecordedHike('test get recorded hike', hike1.id, user.id, recordedHike);
    testGetRecordedHike('test get wrong recorded hike', 10, user.id, undefined);
    testGetRecordedHikeById('test get recorded hike by id', recordedHike.id, recordedHike);
    testGetRecordedHikeById('test get recorded hike by wrong id', 10, undefined);
    const newRecordeHike = new RecordedHike(1, hike1.id, user.id, "2022-12-18T16:09:12Z", "2022-12-18T16:09:12Z");
    testUpdateRecordedHike('test update recorded hike', newRecordeHike, 1);
    testGetRecordedHike('test get recorded hike after update', hike1.id, user.id, newRecordeHike);
});

function testGetUserByEmail(testMsg, email, expectedUser) {
    test(testMsg, async () => {
        const res = await userDAO.getUserByEmail(email);
        expect(res).toEqual(expectedUser);
    });
}

function testGetUserById(testMsg, userId, expectedUser) {
    test(testMsg, async () => {
        const res = await userDAO.getUserById(userId);
        expect(res).toEqual(expectedUser);
    });
}


function testGetUserByCredentials(testMsg, username, email, role, expectedUser) {
    test(testMsg, async () => {
        const res = await userDAO.getUserByCredentials(username, email, role);
        expect(res).toEqual(expectedUser);
    });
}

function testLoginUser(testMsg, email, password, expectedObj) {
    test(testMsg, async () => {
        const res = await userDAO.loginUser(email, password);
        expect(res).toEqual(expectedObj);
    });
}

function testInsertRecordedHike(testMsg, recordedHike, expectedResult) {
    test(testMsg, async () => {
        const res = await userDAO.insertRecordedHike(recordedHike);
        expect(res).toEqual(expectedResult);
    });
}

function testGetRecordedHike(testMsg, hikeId, userId, expectedRecordedHike) {
    test(testMsg, async () => {
        const res = await userDAO.getRecordedHike(hikeId, userId);
        expect(res).toEqual(expectedRecordedHike);
    });
}

function testGetRecordedHikeById(testMsg, recordedHikeId, expectedRecordedHike) {
    test(testMsg, async () => {
        const res = await userDAO.getRecordedHikeById(recordedHikeId);
        expect(res).toEqual(expectedRecordedHike);
    });
}

function testUpdateRecordedHike(testMsg, recordedHike, expectedResult) {
    test(testMsg, async () => {
        const res = await userDAO.updateRecordedHike(recordedHike);
        expect(res).toEqual(expectedResult);
    });
}