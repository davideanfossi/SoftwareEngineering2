const DBManager = require('../database/dbManager');
const HutDAO = require('../daos/hutDAO');
const Hut = require('../models/hutModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hutDAO = new HutDAO(dbManager);

describe('Hut DAO unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);

        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        let res = await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        res = await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        res = await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);

        sql = "INSERT INTO Hut(name, numOfBeds, description, phoneNumber, email, website, pointId, ownerId) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        res = await dbManager.query(sql, ["hut 1", 10, "description 1", "1234567890", "hut1@mail.com", null, 2, 1]);
        res = await dbManager.query(sql, ["hut 2", 50, "description 2", "0987654321", "hut2@mail.com", "www.hut2.com", 3, 1]);
        res = await dbManager.query(sql, ["hut 3", 20, "description 3", "0192837465", "hut3@mail.com", "www.hut3.com", 1, 1]);

        sql = "INSERT INTO hutImages(hutId, imageName) VALUES(?, ?)";
        res = await dbManager.query(sql, [2, "image1.png"]);
        res = await dbManager.query(sql, [2, "image2.png"]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HutDAO())
            .toThrow('DBManager must be defined for hutdao!');
    });

    const hut1 = new Hut(1, "hut 1", 10, "1234567890", "hut1@mail.com", "description 1", "", 2, 1);
    const hut2 = new Hut(2, "hut 2", 50, "0987654321", "hut2@mail.com", "description 2", "www.hut2.com", 3, 1);
    const hut3 = new Hut(3, "hut 3", 20, "0192837465", "hut3@mail.com", "description 3", "www.hut3.com", 1, 1);

    testGetSingleHut('test get single hut', 2, hut2);
    testGetHutImages('test get images of hut', 2, ["image1.png", "image2.png"]);
    testGetAllHut('test get all huts', [hut1, hut2, hut3]);
    testGetHuts('test get huts with filters', 20, 100, [hut2, hut3]);
    testGetHuts('test get huts without filters', undefined, undefined, [hut1, hut2, hut3])
});


function testGetAllHut(testMsg, expectedHuts) {
    test(testMsg, async () => {
        const res = await hutDAO.getAllHuts();
        expect(res).toEqual(expect.arrayContaining(expectedHuts));
    });
}

function testGetHuts(testMsg, minNumOfBeds, maxNumOfBeds, expectedHuts) {
    test(testMsg, async () => {
        const res = await hutDAO.getHuts(minNumOfBeds, maxNumOfBeds);
        expect(res).toEqual(expect.arrayContaining(expectedHuts));
    });
}


function testGetSingleHut(testMsg, hutId, expectedHut) {
    test(testMsg, async () => {
        const res = await hutDAO.getHut(hutId);
        expect(res).toEqual(expectedHut);
    });
}

function testGetHutImages(testMsg, hutId, expectedImageList) {
    test(testMsg, async () => {
        const res = await hutDAO.getHutImages(hutId);
        expect(res).toEqual(expect.arrayContaining(expectedImageList));
    });
}
