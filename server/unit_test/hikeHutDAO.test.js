const DBManager = require('../database/dbManager');
const HikeHutDAO = require('../daos/hikeHutDAO');
const HikeHut = require('../models/hikeHutModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeHutDAO = new HikeHutDAO(dbManager);


describe('HikeHut DAO unit test', () => {
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

        sql = "INSERT INTO Hut(name, numOfBeds, description, phoneNumber, email, website, pointId, ownerId, imageName) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await dbManager.query(sql, ["hut 1", 10, "description 1", "1234567890", "hut1@mail.com", null, 2, 1, ""]);
        await dbManager.query(sql, ["hut 2", 50, "description 2", "0987654321", "hut2@mail.com", "www.hut2.com", 3, 1, "image1.png"]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HikeHutDAO())
            .toThrow('DBManager must be defined for HikeHut dao!');
    });



    testInsertHikeHut(1,1,true,null)
    testInsertHikeHut(1,2,null,true)

});


function testInsertHikeHut(hikeId, hutId, startPoint,endPoint) {
    test('add hut to hike', async () => {

        await hikeHutDAO.insertHikeHut(hikeId, hutId, startPoint,endPoint);
//      
        const linkedhut = new HikeHut(hikeId, hutId, !!startPoint,!!endPoint);

        const res = await hikeHutDAO.getHikeLinkedHut(hikeId);
        expect(res.length).toBeGreaterThan(0);
        expect(res).toEqual(expect.arrayContaining([linkedhut]));


    })
}
