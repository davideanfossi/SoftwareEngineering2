const DBManager = require('../database/dbManager');
const HutDAO = require('../daos/hutDAO');
const Hut = require('../models/hutModel');
const { purgeAllTables } = require('./purgeUtils');
const hut = require('../models/hutModel');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hutDAO = new HutDAO(dbManager);

describe('Hut DAO unit test',() => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);
        
        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        let res = await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        res = await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        res = await dbManager.query(sql, ["45.119817", "7.565056", 250, "point 3", "address 3"]);
        res = await dbManager.query(sql, ["45.574405", "7.455193", 300, "point 4", null]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);
        res = await dbManager.query(sql, ["user2@test.it", "user 2", "local guide", "password", "salt", null, null, null, 1, null, null]);
        
        sql = "INSERT INTO Hut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, ["hut 1", 10, 1, "hut 1", '123468', "hut1@test.com", "www.hut1.com", 1]);
        res = await dbManager.query(sql, ["hut 2", 20, 2, "hut 2", '9876541', "hut2@test.com", "www.hut2.com", 1]);
        res = await dbManager.query(sql, ["hut 3", 30, 3, "hut 3", '235698', "hut3@test.com",  "www.hut3.com", 2]);
  
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });
    
    describe('Constructor test', () => {
        expect(() => new HutDAO())
            .toThrow('DBManager must be defined for hutdao!');
    });

    testInsertHut("hut 1",9,4,"hut desc1",'123456','test@test.com','www.test.com',2)
   // testInsertHut("hut 2",20,3,"hut desc2",'32146582','test2@test.com','www.test2.com',1)

    const hut1 = new hut(1, "hut 1", 10, 1, "hut 1", '123468', "hut1@test.com", "www.hut1.com", 1);
    const hut2 = new hut(2,"hut 2", 20, 2, "hut 2", '9876541', "hut2@test.com", "www.hut2.com", 1);
    testGetHutsbyUserId(1,[hut1, hut2]);

});

function testInsertHut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId){
    test('add new hut', async() => {

        let lastID = await hutDAO.insertHut(name,numOfBeds,pointId,description,phoneNumber,email,website,userId);
        expect(lastID).toBeTruthy();

        var res = await hutDAO.getHut(lastID);
        expect(res.id).toEqual(lastID);
        expect(res.name).toEqual(name);
        expect(res.numOfBeds).toEqual(numOfBeds);
        expect(res.pointId).toEqual(pointId);
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

