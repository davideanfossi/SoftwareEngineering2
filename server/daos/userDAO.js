'use strict';

const User = require('../models/userModel');
const RecordedHike = require("../models/recordedHike");
const crypto = require("crypto");

class UserDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for User dao!';
        this.dbManager = dbManager;
    }

    async getUserByEmail(email) {
        const query = "SELECT * FROM User WHERE email = ?";
        const res = await this.dbManager.get(query, [email], true);
        return res ? new User(res.id, res.username, res.email, res.role, res.name, res.surname, res.phoneNumber) : undefined;
    }

    async getUserById(userId) {
        const query = "SELECT * FROM User WHERE id = ?";
        const res = await this.dbManager.get(query, [userId], true);
        return res ? new User(res.id, res.username, res.email, res.role, res.name, res.surname, res.phoneNumber) : undefined;
    }

    async getUserByCredentials(username, email, role) {
        const query = "SELECT * FROM User WHERE email = ? AND username = ? AND role = ?";
        const res = await this.dbManager.get(query, [email, username, role], true);
        return res ? new User(res.id, res.username, res.email, res.role, res.name, res.surname, res.phoneNumber) : undefined;
    }

    async loginUser(email, password) {
        const sql = "SELECT * FROM User WHERE email = ? ";
        const user = await this.dbManager.get(sql, [email], true);
        if (user === undefined) {
            // user does not exist
            throw { msg: "Incorrect username and/or password. Error code: ", err: 401 };
        }
        if (user.isVerified === 0)
            throw { msg: "Account must be verified. Error code: ", err: 401 };
        const login = await verifyPassword(
            user.password,
            user.salt,
            password
        );
        if (!login)
            throw {
                msg: "Incorrect username and/or password. Error code: ",
                err: 401,
            };
        return { "id": user.id, "username": user.username, "email": user.email, "role": user.role };
    }

    async insertRecordedHike(recordedHike) {
        const sql = "INSERT INTO RecordedHike(hikeId, userId, startDateTime, endDateTime) VALUES(?, ?, ?, ?)";
        const res = await this.dbManager.query(sql, [recordedHike.hikeId, recordedHike.userId, recordedHike.startDateTime, recordedHike.endDateTime ? recordedHike.endDateTime : null]);
        return res;
    }

    async updateRecordedHike(recordedHike) {
        const sql = "UPDATE RecordedHike SET startDateTime = ?, endDateTime = ? WHERE hikeId = ? AND userId = ?";
        const res = await this.dbManager.query(sql, [recordedHike.startDateTime, recordedHike.endDateTime, recordedHike.hikeId, recordedHike.userId]);
        return res;
    }

    async getRecordedHike(hikeId, userId) {
        const sql = "SELECT * FROM RecordedHike WHERE hikeId = ? AND userId = ?";
        const res = await this.dbManager.get(sql, [hikeId, userId], true);
        return res ? new RecordedHike(res.id, res.hikeId, res.userId, res.startDateTime, res.endDateTime) : undefined;
    }

    async getRecordedHikeById(recordedHikeId) {
        const sql = "SELECT * FROM RecordedHike WHERE id = ?";
        const res = await this.dbManager.get(sql, [recordedHikeId], true);
        return res ? new RecordedHike(res.id, res.hikeId, res.userId, res.startDateTime, res.endDateTime) : undefined;
    }


}

async function verifyPassword(passwordStored, saltStored, password) {
    let encryptedPass = crypto.pbkdf2Sync(password, saltStored, 1000, 64, `sha512`).toString(`hex`);
    return encryptedPass === passwordStored;
}

module.exports = UserDAO;