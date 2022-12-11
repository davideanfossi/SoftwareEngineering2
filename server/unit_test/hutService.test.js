const DBManager = require('../database/dbManager');
const HutDAO = require('../daos/hutDAO');
const PointDAO = require('../daos/pointDAO');
const Point = require('../models/pointModel');
const Hut = require('../models/hutModel');
const HutService = require("../services/hutService");
const { purgeAllTables } = require('./purgeUtils');

const dbManager = new DBManager("TEST");
dbManager.openConnection();
const hutDAO = new HutDAO(dbManager);
const pointDAO = new PointDAO(dbManager);
const hutService = new HutService(hutDAO, pointDAO);

describe('Hut Service unit test', () => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);

        let sql = "INSERT INTO Points(latitude, longitude, altitude, name, address) VALUES (?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["45.0703393", "7.686864", 200, "point 1", null]);
        await dbManager.query(sql, ["45.070254", "7.702042", 250, "point 2", "address 2"]);
        await dbManager.query(sql, ["47.574405", "8.455193", 300, "point 3", "address 3"]);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);

        sql = "INSERT INTO Hut(name, numOfBeds, description, phoneNumber, email, website, pointId, ownerId, imageName) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await dbManager.query(sql, ["hut 1", 10, "description 1", "1234567890", "hut1@mail.com", null, 2, 1, null]);
        await dbManager.query(sql, ["hut 2", 50, "description 2", "0987654321", "hut2@mail.com", "www.hut2.com", 3, 1, "image1.png"]);
        await dbManager.query(sql, ["hut 3", 20, "description 3", "0192837465", "hut3@mail.com", "www.hut3.com", 1, 1, null]);
    });

    afterAll(async () => {
        try { dbManager.closeConnection(); }
        catch (err) {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new HutService(undefined, pointDAO))
            .toThrow('hutDAO must be defined for HutService!');
        expect(() => new HutService(hutDAO, undefined))
            .toThrow('pointDAO must be defined for HutService!');
    });

    const point1 = new Point(1, 45.0703393, 7.686864, 200, "point 1", null);
    const point2 = new Point(2, 45.070254, 7.702042, 250, "point 2", "address 2");
    const point3 = new Point(3, 47.574405, 8.455193, 300, "point 3", "address 3");

    const hut1 = new Hut(1, "hut 1", 10, "1234567890", "hut1@mail.com", "description 1", "", point2, 1, null);
    const hut2 = new Hut(2, "hut 2", 50, "0987654321", "hut2@mail.com", "description 2", "www.hut2.com", point3, 1, "image1.png");
    const hut3 = new Hut(3, "hut 3", 20, "0192837465", "hut3@mail.com", "description 3", "www.hut3.com", point1, 1, null);

    let page = 1;
    let pageSize = 2;
    testGetHuts('test get huts page and pageSize', page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 2, "pageNumber": page, "pageSize": pageSize, "pageItems": [hut1, hut2] });
    page = 2;
    testGetHuts('test get huts page and pageSize', page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 2, "pageNumber": page, "pageSize": pageSize, "pageItems": [hut3] });
    page = undefined;
    pageSize = undefined;
    testGetHuts('test get huts page and pageSize undefined', page, pageSize, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hut1, hut2, hut3] });

    testGetHuts('test get huts min number of beds', page, pageSize, 20, undefined, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hut2, hut3] });
    testGetHuts('test get huts max number of beds', page, pageSize, undefined, 20, undefined, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hut1, hut3] });
    testGetHuts('test get huts min altitude', page, pageSize, undefined, undefined, 270, undefined, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hut2] });
    testGetHuts('test get huts max altitude', page, pageSize, undefined, undefined, undefined, 220, undefined, undefined, undefined,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hut3] });
    testGetHuts('test get huts radius', page, pageSize, undefined, undefined, undefined, undefined, 47.5715101, 8.456101, 10,
        { "totalPages": 1, "pageNumber": 1, "pageSize": 10, "pageItems": [hut2] });

    testGetHutsLimits({ "maxAltitude": 300, "maxNumOfBeds": 50 });



    testAddHut("hut 1",9,"hut desc1",'258963',"a@a.com","www.aaa.com",1,"40.714","65.714",1000,"p1","A1")
    testAddHut("hut 2",20,"hut desc2","987541","b@b.com",undefined,1,"47.714","45.714",2000,"p2","A2")

});

function testAddHut(name,numOfBeds,description,phoneNumber,email,website,userId,latitude,longitude,altitude,pointLabel,address){
    test('add new hut', async() => {

        let lastID = await hutService.addHut(name,numOfBeds,description,phoneNumber,email,website, userId,latitude,longitude,altitude,pointLabel,address);
        expect(lastID).toBeTruthy();
    })
}   


function testGetHuts(testMsg, pageNumber, pageSize, minNumOfBeds, maxNumOfBeds, minAltitude, maxAltitude, baseLat, baseLon, radius, expectedObj) {
    test(testMsg, async () => {
        const res = await hutService.getHuts({ minNumOfBeds, maxNumOfBeds }, { minAltitude, maxAltitude }, { baseLat, baseLon, radius }, { pageNumber, pageSize });
        expect(res).toEqual(expectedObj);
    })
}

function testGetHutsLimits(expectedObj) {
    test('test get hikes limits', async () => {
        const res = await hutService.getHutsLimits();
        expect(res).toEqual(expectedObj);
    });
}