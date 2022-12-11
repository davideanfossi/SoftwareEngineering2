const DBManager = require('../database/dbManager');
const HutDAO = require('../daos/hutDAO');
const Hut = require('../models/hutModel');
const Point = require('../models/pointModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hutDAO = new HutDAO(dbManager);

describe('Hut DAO unit test',() => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);
        await dbManager.query(sql, ["45.574405", "7.455193", 300, "point 4", null]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);
        await dbManager.query(sql, ["user2@test.it", "user 2", "local guide", "password", "salt", null, null, null, 1, null, null]);
        
        
        sql = "INSERT INTO Hut(name, numOfBeds, description, phoneNumber, email, website, pointId, ownerId, imageName) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await dbManager.query(sql, ["hut 1", 10, "description 1", "1234567890", "hut1@mail.com", null, 2, 1, ""]);
        await dbManager.query(sql, ["hut 2", 50, "description 2", "0987654321", "hut2@mail.com", "www.hut2.com", 3, 1, "image1.png"]);
        await dbManager.query(sql, ["hut 3", 20, "description 3", "0192837465", "hut3@mail.com", "www.hut3.com", 1, 2, ""]);

    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });
    

    describe('Constructor test', () => {
        expect(() => new HutDAO())
            .toThrow('DBManager must be defined for hutdao!');
    });

    const hut1 = new Hut(1, "hut 1", 10, "1234567890", "hut1@mail.com", "description 1", "", 2, 1,"");
    const hut2 = new Hut(2, "hut 2", 50, "0987654321", "hut2@mail.com", "description 2", "www.hut2.com", 3, 1,"image1.png");
    const hut3 = new Hut(3, "hut 3", 20, "0192837465", "hut3@mail.com", "description 3", "www.hut3.com", 1, 2,"");

    testGetSingleHut('test get single hut', 2, hut2);
    testGetAllHut('test get all huts', [hut1, hut2, hut3]);
    testGetHuts('test get huts with filters', 20, 100, [hut2, hut3]);
    testGetHuts('test get huts without filters', undefined, undefined, [hut1, hut2, hut3]);
    testGetMaxData({"maxNumOfBeds": 50});

    const point4 = new Point(4, "45.574405", "7.455193", 300, "point 4", "");
    testInsertHut("hut 4",9,point4.id,"hut desc4",'123456','test@test.com','www.test.com',2)
   // testInsertHut("hut 2",20,3,"hut desc2",'32146582','test2@test.com','www.test2.com',1)

    testGetHutsbyUserId(1,[hut1, hut2]);

});

function testInsertHut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId){
    test('add new hut', async() => {

        let lastID = await hutDAO.insertHut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId,"");
        expect(lastID).toBeTruthy();

        const res = await hutDAO.getHut(lastID);
        expect(res.id).toEqual(lastID);
        expect(res.name).toEqual(name);
        expect(res.numOfBeds).toEqual(numOfBeds);
        expect(res.point).toEqual(pointId);
        expect(res.description).toEqual(description);
        expect(res.phoneNumber).toEqual(phoneNumber);
        expect(res.email).toEqual(email);
        expect(res.website).toEqual(website);
        expect(res.userId).toEqual(userId);

    })
}

function testGetHutsbyUserId(userId, expectedHuts) {
    test('test get user huts', async () => {
        const res = await hutDAO.getHutsbyUserId(userId);
        expect(res).toEqual(expectedHuts);
    });
}


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
        console.log(res);
        expect(res).toEqual(expectedHut);
    });
}

function testGetMaxData(expectedObj) {
    test('test get max data', async () => {
        const res = await hutDAO.getMaxData();
        expect(res).toEqual(expectedObj);
    });
}
