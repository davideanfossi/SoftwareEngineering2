const DBManager = require('../database/dbManager');
const PointDAO = require('../daos/pointDAO');
const Point = require('../models/pointModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const pointDAO = new PointDAO(dbManager);


describe('Point DAO unit test',() => {
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
        res = await dbManager.query(sql, ["title 1", 1000, 120, 300, "Hiker", 1, 4, "description 1", null, 1]);
        
        sql = "INSERT INTO ReferencePoints(hikeId, pointId) VALUES (?, ?);";
        res = await dbManager.query(sql, [1, 2]);
        res = await dbManager.query(sql, [1, 3]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });
    
    describe('Constructor test', () => {
        expect(() => new PointDAO())
            .toThrow('DBManager must be defined for Point dao!');
    });

    const point1 = new Point(1, 45.0703393, 7.686864, 200, "point 1", null);
    const point2 = new Point(2, 45.070254, 7.702042, 250, "point 2", "address 2");
    const point3 = new Point(3, 45.119817, 7.565056, 250, "point 3", "address 3");
    testGetPoint(1, point1);
    testgetReferencePointsOfHike(1, [point2, point3]);

    testInsertPoint(44.0703393, 71.686864, 2000, "point A","address A")
    testInsertPoint(54.0703393, 44.686864, 200, "point B",null)

});


function testGetPoint(pointId, expectedPoint) {
    test('test get point', async () => {
        const res = await pointDAO.getPoint(pointId);
        expect(res).toEqual(expectedPoint);
    });
}

function testgetReferencePointsOfHike(hikeId, expectedPoints) {
    test('test get reference points of hike', async () => {
        const res = await pointDAO.getReferencePointsOfHike(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedPoints));
    });
}

function testInsertPoint(latitude,longitude,altitude,name,address){
    test('add new point', async() => {

        let lastID = await pointDAO.insertPoint(latitude,longitude,altitude,name,address);
        expect(lastID).toBeTruthy();

        var res = await pointDAO.getPoint(lastID);
        expect(res.id).toEqual(lastID);
        expect(res.latitude).toEqual(latitude);
        expect(res.longitude).toEqual(longitude);
        expect(res.altitude).toEqual(altitude);
        expect(res.name).toEqual(name);
        expect(res.address).toEqual(address);

    })
}
