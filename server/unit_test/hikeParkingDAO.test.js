const DBManager = require('../database/dbManager');
const HikeParkingDAO = require('../daos/hikeParkingDAO');
const HikeParking = require('../models/hikeParkingModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeParkingDAO = new HikeParkingDAO(dbManager);


describe('HikeParking DAO unit test', () => {
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
        await dbManager.query(sql, ["title 1", 1000, 120, 300, "Hiker", 1, 4, "description 1", null, 1]);

        sql = "insert into Parking (name, ownerId, pointId, numSpots, hasFreeSpots, imageName) values(?,?,?,?,?,?)";
        await dbManager.query(sql, ["parking 1", 1, 1,20, 1, ""]);
        await dbManager.query(sql, ["parking 2", 1, 10,40, 1, ""]);

        sql = "insert into HikeParking(hikeId,parkingId,startPoint,endPoint) values(?,?,?,?)";
        await dbManager.query(sql, [2, 1, true, null]);
        await dbManager.query(sql, [2, 2, null, true]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HikeParkingDAO())
            .toThrow('DBManager must be defined for HikeParking dao!');
    });

    const hikeParking1 = new HikeParking(2, 1, true, false);
    const hikeParking2 = new HikeParking(2, 2, false, true);

    testGetParkingLinkedToHike(2,[hikeParking1,hikeParking2]);

    testInsertHikeParking(1,1,true,null)
    testInsertHikeParking(1,2,null,true)

});

function testGetParkingLinkedToHike(hikeId,expectedParkings){
    test('testGetParkingLinkedToHike', async () => {

        const res = await hikeParkingDAO.getHikeLinkedParkings(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedParkings));
    })
}

function testInsertHikeParking(hikeId, parkingId, startPoint,endPoint) {
    test('add parking to hike', async () => {

        await hikeParkingDAO.insertHikeParking(hikeId, parkingId, startPoint,endPoint);
//      
        const linkedParking = new HikeParking(hikeId, parkingId, !!startPoint,!!endPoint);

        const res = await hikeParkingDAO.getHikeLinkedParkings(hikeId);
        expect(res.length).toBeGreaterThan(0);
        expect(res).toEqual(expect.arrayContaining([linkedParking]));


    })
}
