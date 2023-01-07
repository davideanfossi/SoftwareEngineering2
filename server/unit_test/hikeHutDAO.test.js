const DBManager = require('../database/dbManager');
const HikeHutDAO = require('../daos/hikeHutDAO');
const HikeHut = require('../models/hikeHutModel');
const {difficultyType } = require('../models/hikeModel');
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hikeHutDAO = new HikeHutDAO(dbManager);

const low = difficultyType.low;
const mid = difficultyType.mid;
const high = difficultyType.high;

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
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HikeHutDAO())
            .toThrow('DBManager must be defined for HikeHut dao!');
    });

    const hikeHut1 = new HikeHut(1, 1, true, false, false);
    const hikeHut2 = new HikeHut(2, 2, false, true, false);
    const hikeHut4 = new HikeHut(3, 2, false, false, true);
    const hikeHut5 = new HikeHut(3, 3, false, false, true);
    const hikeHut6 = new HikeHut(4, 3, false, false, true);

    testGetHikeLinkedHutsAsStartEnd(1,[hikeHut1])
    testGetHikeLinkedHuts(3,[hikeHut4,hikeHut5])
    testGetHikeHut(2,2,hikeHut2)
    testGetHikeHutAsLinked(4,3,hikeHut6)
    testGetHikeHutAsLinked(2,2,undefined)

     //set hut as start point
     testInsertHikeHutAsStartEnd(3,1,true,null)
    //set hut as end point
    testInsertHikeHutAsStartEnd(1,2,null,true)
    //link hut to hike
    testInsertHikeHutAsLinkedHut(4,2,true)

    testUpdateHikeHutAsStartEnd(3,2,true,null)

    testUpdateHikeHutIsLinked(2,2,true)
 
});


function testInsertHikeHutAsStartEnd(hikeId, hutId, startPoint,endPoint) {
    test('add hut to hike', async () => {

        await hikeHutDAO.insertHikeHut(hikeId, hutId, startPoint,endPoint,null);
//      
        const linkedhut = new HikeHut(hikeId, hutId, !!startPoint,!!endPoint,false);

        const res = await hikeHutDAO.getHikeLinkedHutsAsStartEnd(hikeId);
        expect(res.length).toBeGreaterThan(0);
        expect(res).toEqual(expect.arrayContaining([linkedhut]));


    })
}

function testInsertHikeHutAsLinkedHut(hikeId, hutId, isLinked) {
    test('add hut to hike', async () => {

        await hikeHutDAO.insertHikeHut(hikeId, hutId, null,null,isLinked);
//      
        const linkedhut = new HikeHut(hikeId, hutId, false,false,!!isLinked);

        const res = await hikeHutDAO.getHikeLinkedHuts(hikeId);
        expect(res.length).toBeGreaterThan(0);
        expect(res).toEqual(expect.arrayContaining([linkedhut]));


    })
}

function testGetHikeLinkedHutsAsStartEnd(hikeId,expectedHuts){
    test('Get HikeLinkedHutsAsStartEnd', async () => {

        const res = await hikeHutDAO.getHikeLinkedHutsAsStartEnd(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedHuts));
    })
}

function testGetHikeLinkedHuts(hikeId,expectedHuts){
    test('testGetHikeLinkedHuts', async () => {

        const res = await hikeHutDAO.getHikeLinkedHuts(hikeId);
        expect(res).toEqual(expect.arrayContaining(expectedHuts));
    })
}

function testGetHikeHut(hikeId,hutId,expectedHut){
    test('testGetHikeHut', async () => {

        const res = await hikeHutDAO.getHikeHut(hikeId,hutId);
        expect(res).toEqual(expectedHut);
    })
}

function testGetHikeHutAsLinked(hikeId,hutId,expectedHut){
    test('testGetHikeHutAsLinked', async () => {

        const res = await hikeHutDAO.getHikeHutAsLinked(hikeId,hutId);
        expect(res).toEqual(expectedHut);
    })
}

function testUpdateHikeHutAsStartEnd(hikeId, hutId, startPoint,endPoint) {
    test('testUpdateHikeHutAsStartEnd', async () => {

        const hikeHut = await hikeHutDAO.getHikeHut(hikeId,hutId);

        await hikeHutDAO.updateHikeHutStartEnd(hikeId, hutId, startPoint,endPoint);
        const linkedhut = new HikeHut(hikeId, hutId, !!startPoint,!!endPoint,!! hikeHut.isLinked);
        const res = await hikeHutDAO.getHikeHut(hikeId,hutId);
        expect(res).toEqual(linkedhut);


    })
}

function testUpdateHikeHutIsLinked(hikeId, hutId, isLinked) {
    test('testUpdateHikeHutIsLinked', async () => {

        const hikeHut = await hikeHutDAO.getHikeHut(hikeId,hutId);

        await hikeHutDAO.updateHikeHutIsLinked(hikeId, hutId, isLinked);
        const linkedhut = new HikeHut(hikeId, hutId, hikeHut.startPoint,hikeHut.endPoint,!! isLinked);
        const res = await hikeHutDAO.getHikeHut(hikeId,hutId);
        expect(res).toEqual(linkedhut);


    })
}
