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

describe('Hut Service unit test',() => {
    beforeAll(async () => {
        await purgeAllTables(dbManager);

        sql = "INSERT INTO user(email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        res = await dbManager.query(sql, ["user1@test.it", "user 1", "local guide", "password", "salt", null, null, null, 1, null, null]);

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

    testAddHut("hut 1",9,"hut desc1",'258963',"a@a.com","www.aaa.com",1,"40.714","65.714",1000,"p1","A1")
    testAddHut("hut 2",20,"hut desc2","987541","b@b.com",undefined,1,"47.714","45.714",2000,"p2","A2")

});

function testAddHut(name,numOfBeds,description,phoneNumber,email,website,userId,latitude,longitude,altitude,pointLabel,address){
    test('add new hut', async() => {

        let lastID = await hutService.addHut(name,numOfBeds,description,phoneNumber,email,website, userId,latitude,longitude,altitude,pointLabel,address);
        expect(lastID).toBeTruthy();
    })
}