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
        let sql = "INSERT INTO Points(id, latitude, longitude, name, address) VALUES (?, ?, ?, ?, ?);";
        let res = await dbManager.query(sql, [1, "45.0703393", "7.686864", "Turin", null]);
        res = await dbManager.query(sql, [2, "45.070254", "7.702042", "point 2", "address 2"]);
        res = await dbManager.query(sql, [3, "45.119817", "7.565056", "point 3", "address 3"]);
        res = await dbManager.query(sql, [4, "45.574405", "7.455193", "point 4", null]);
        sql = "INSERT INTO Hike(id, title, length, expectedTime, ascent, difficulty, startPointId, endPointId, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, [1, "title 1", 1000, 120, 300, "Hiker", 1, 4, "description 1"]);
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

    const expectedPoint = new Point(1, 45.0703393, 7.686864, "Turin", null);
    const point2 = new Point(2, "45.070254", "7.702042", "point 2", "address 2");
    const point3 = new Point(3, "45.119817", "7.565056", "point 3", "address 3");
    const expectedPoints = [point2, point3];
    testGetPoint(1, expectedPoint);
    testgetReferencePointsOfHike(1, expectedPoints);
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
