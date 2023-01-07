const DBManager = require('../database/dbManager');
const HikeDAO = require('../daos/hikeDAO');
const PointDAO = require('../daos/pointDAO');
const HutDAO = require("../daos/hutDAO");
const HikeHutDAO = require("../daos/hikeHutDAO");
const HikeHut = require('../models/hikeHutModel');
const {difficultyType } = require('../models/hikeModel');

const HikeHutService = require("../services/hikeHutService");
const { purgeAllTables } = require('./purgeUtils');

const togeojson = require("togeojson");
const path = require("path");

const config = require("../config.json");

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hutDAO = new HutDAO(dbManager);
const hikeHutDAO = new HikeHutDAO(dbManager);
const hikeHutService = new HikeHutService(hikeHutDAO,hikeDAO, hutDAO,pointDAO);

describe('HikeHutService unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);

        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);
        await dbManager.query(sql, ["45.574405", "7.455193", 300, "point 4", null]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);

        sql = "INSERT INTO Hike(title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description, gpxPath, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["title 1", 1000, 120, 300, mid, 1, 2, "description 1", null, 1]);
        await dbManager.query(sql, ["title 2", 2000, 180, 500, high, 1, 4, "description 2", null, 1]);
        await dbManager.query(sql, ["title 3", 1500, 100, 200, low, 3, 4, "description 3", null, 1]);
        await dbManager.query(sql, ["title 4", 1600, 120, 350, mid, 2, 4, "description 4", null, 1]);

        sql = "INSERT INTO Hut(name, numOfBeds, description, phoneNumber, email, website, pointId, ownerId, imageName) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await dbManager.query(sql, ["hut 1", 10, "description 1", "1234567890", "hut1@mail.com", null, 2, 1, ""]);
        await dbManager.query(sql, ["hut 2", 50, "description 2", "0987654321", "hut2@mail.com", "www.hut2.com", 3, 1, "image1.png"]);
        await dbManager.query(sql, ["hut 3", 20, "description 3", "0192837465", "hut3@mail.com", "www.hut3.com", 1, 2, ""]);


        sql = "insert into HikeHut(hikeId,hutId,startPoint,endPoint,isLinked) values(?,?,?,?,?)";
        await dbManager.query(sql, [1, 1, true, null, null]);
        await dbManager.query(sql, [2, 2, null, true, null]);
        await dbManager.query(sql, [3, 2, null, null, true]);
        await dbManager.query(sql, [3, 3, null, null, true]);
        await dbManager.query(sql, [4, 3, null, null, true]);

    });

    afterAll(async () => {
        try {
            dbManager.closeConnection();
        }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HikeHutService(undefined, hikeDAO))
            .toThrow('hikeHutDAO must be defined for HikeHutService!');
        expect(() => new HikeHutService(hikeHutDAO, undefined))
            .toThrow("hikeDAO must be defined for HikeHutService!");
        expect(() => new HikeHutService(hikeHutDAO, hikeDAO, undefined))
            .toThrow('hutDAO must be defined for HikeHutService!');
            expect(() => new HikeHutService(hikeHutDAO, hikeDAO, hutDAO))
            .toThrow('pointDAO must be defined for HikeHutService!');
    });

    const hikeHut1 = new HikeHut(1, 1, true, false, false);
    const hikeHut2 = new HikeHut(2, 2, false, true, false);
    const hikeHut4 = new HikeHut(3, 2, false, false, true);
    const hikeHut5 = new HikeHut(3, 3, false, false, true);
    const hikeHut6 = new HikeHut(4, 3, false, false, true);

    testGetHutLinkedToHikeAsStartEnd(1,[hikeHut1])
    testGetHutLinkedToHike(3,[hikeHut4,hikeHut5])

    testLinkHutAsStartEndToHike(3,1,true,null,1)
    testLinkHutAsStartEndToHike(4,3,null,true,1)

    testLinkHutToHike(2,1,1)
    testLinkHutToHike(1,1,1)

    testLinkHutToHikeWithError(20,2,1, {  returnCode: 404,
        message: "hike not found", });

    testLinkHutToHikeWithHutError(2,20,1, {  returnCode: 404,
        message: "hut not found", });

    testLinkHutAsStartEndToHikeWithHikeError(20,2,true,null,1, {  returnCode: 404,
        message: "hike not found", });
    
    testLinkHutAsStartEndToHikeWithHutError(2,20,true,null,1, {  returnCode: 404,
        message: "hut not found", });
})




function testGetHutLinkedToHikeAsStartEnd(hikeId,expectedHuts){
    test('testGetHutLinkedToHikeAsStartEnd', async () => {

        const res = await hikeHutService.getHutLinkedToHikeAsStartEnd(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedHuts));
    })
}

function testGetHutLinkedToHike(hikeId,expectedHuts){
    test('testGetHutLinkedToHike', async () => {

        const res = await hikeHutService.getHutLinkedToHike(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedHuts));
    })
}

function testLinkHutAsStartEndToHike(hikeId, hutId, startPoint,endPoint,userId) {
    test('link hut to hike as Start/End', async () => {

        await hikeHutService.linkHutAsStartEndToHike(hikeId, hutId, startPoint,endPoint,userId);

        const res = await hikeHutService.getHutLinkedToHikeAsStartEnd(hikeId);
        expect(res.length).toBeGreaterThan(0);


    })
}

function testLinkHutToHike(hikeId, hutId,userId) {
    test('link hut to hike', async () => {

        await hikeHutService.linkHutToHike(hikeId, hutId,userId);
        
        const res = await hikeHutService.getHutLinkedToHike(hikeId);
        expect(res.length).toBeGreaterThan(0);


    })
}

function testLinkHutToHikeWithError(hikeId, hutId,userId,expectedError) {
    test('link hut to hike with Error', async () => {

        async function invalidLinkHutToHike() {
            await hikeHutService.linkHutToHike(hikeId, hutId,userId);
        }
        await expect(invalidLinkHutToHike).rejects.toEqual(expectedError);


    })
}

function testLinkHutToHikeWithHutError(hikeId, hutId,userId,expectedError) {
    test('link hut to hike with Hut Error', async () => {

        async function invalidLinkHutToHike() {
            await hikeHutService.linkHutToHike(hikeId, hutId,userId);
        }
        await expect(invalidLinkHutToHike).rejects.toEqual(expectedError);


    })
}

function testLinkHutAsStartEndToHikeWithHikeError(hikeId, hutId, startPoint,endPoint,userId,expectedError) {
    test('link hut to hike as Start/End with hike error', async () => {

        async function invalidLinkHutToHike() {
            await hikeHutService.linkHutAsStartEndToHike(hikeId, hutId, startPoint,endPoint,userId);
        }
        await expect(invalidLinkHutToHike).rejects.toEqual(expectedError);

    })
}

function testLinkHutAsStartEndToHikeWithHutError(hikeId, hutId, startPoint,endPoint,userId,expectedError) {
    test('link hut to hike as Start/End with hut error', async () => {

        async function invalidLinkHutToHike() {
            await hikeHutService.linkHutAsStartEndToHike(hikeId, hutId, startPoint,endPoint,userId);
        }
        await expect(invalidLinkHutToHike).rejects.toEqual(expectedError);

    })
}