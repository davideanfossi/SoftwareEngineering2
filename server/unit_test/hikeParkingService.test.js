const DBManager = require('../database/dbManager');
const HikeDAO = require('../daos/hikeDAO');
const ParkingDAO = require('../daos/parkingDAO');
const PointDAO = require("../daos/pointDAO");
const HikeParkingDAO = require("../daos/hikeParkingDAO");
const HikeParking = require('../models/hikeParkingModel');
const {difficultyType } = require('../models/hikeModel');

const HikeParkingService = require("../services/hikeParkingService");
const { purgeAllTables } = require('./purgeUtils');


const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeDAO = new HikeDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const parkingDAO = new ParkingDAO(dbManager);
const hikeParkingDAO = new HikeParkingDAO(dbManager);
const hikeParkingService = new HikeParkingService(hikeParkingDAO,hikeDAO,parkingDAO);

describe('HikeParkingService unit test', () => {
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

        sql = "insert into Parking (name, ownerId, pointId, numSpots, hasFreeSpots, imageName) values(?,?,?,?,?,?)";
        await dbManager.query(sql, ["parking 1", 1, 1, 11, 5,null]);
        await dbManager.query(sql, ["parking 2", 1, 2, 20, 15,null]);
        await dbManager.query(sql, ["parking 3", 1, 3, 20, 15,null]);


        sql = "insert into HikeParking(hikeId,parkingId,startPoint,endPoint) values(?,?,?,?)";
        await dbManager.query(sql, [1, 1, true, null]);
        await dbManager.query(sql, [2, 2, null, true]);
       
    });

    afterAll(async () => {
        try {
            dbManager.closeConnection();
        }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HikeParkingService(undefined, hikeDAO))
            .toThrow('hikeParkingDAO must be defined for HikeParkingService!');
        expect(() => new HikeParkingService(hikeParkingDAO, undefined))
            .toThrow('hikeDAO must be defined for HikeParkingService!');
        expect(() => new HikeParkingService(hikeParkingDAO, hikeDAO, undefined))
            .toThrow('parkingDAO must be defined for HikeParkingService!');
    });

    const hikeParking1 = new HikeParking(1, 1, true, false);
    const hikeParking2 = new HikeParking(2, 2, false, true);

    testGetParkingLinkedToHike(1,[hikeParking1]);
    testGetParkingLinkedToHike(2,[hikeParking2]);

    testLinkParkingToHike(1,3,null,true,1);
    testLinkParkingToHikeWithError(20,2,true,null,1, {  returnCode: 404,
        message: "hike not found", });

})

function testGetParkingLinkedToHike(hikeId,expectedParkings){
    test('testGetParkingLinkedToHike', async () => {

        const res = await hikeParkingService.getParkingLinkedToHike(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedParkings));
    })
}

function testLinkParkingToHike(hikeId, parkingId, startPoint,endPoint,userId) {
    test('link parking to hike as Start/End', async () => {

        await hikeParkingService.linkParkingToHike(hikeId, parkingId, startPoint,endPoint,userId);

        const res = await hikeParkingService.getParkingLinkedToHike(hikeId);
        expect(res.length).toBeGreaterThan(0);


    })
}

function testLinkParkingToHikeWithError(hikeId, parkingId, startPoint,endPoint,userId,expectedError) {
    test('link parking to hike with Error', async () => {

        async function invalidLinkParkingToHike() {
            await hikeParkingService.linkParkingToHike(hikeId, parkingId, startPoint,endPoint,userId);
        }
        await expect(invalidLinkParkingToHike).rejects.toEqual(expectedError);


    })
}