'use strict';

const User = require('../models/userModel');
const crypto = require("crypto");

class UserDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for User dao!';
        this.dbManager = dbManager;
    }

    async getUserByEmail(email) {
        const query = "SELECT * FROM User WHERE email = ?";
        try {
            const result = await this.dbManager.get(query, [email], true);
            return new User(result.id, result.username);
        } catch (err) {
            throw err;
        }
    }

    async getUserById(userId) {
        const query = "SELECT * FROM User WHERE id = ?";
        try {
            const result = await this.dbManager.get(query, [userId], true);
            return new User(result.id, result.username, result.email, result.role);
        } catch (err) {
            throw err;
        }
    }

    async getUserByCredentials(username, email, role) {
        const query = "SELECT * FROM User WHERE email = ? AND username = ? AND role = ?";
        try {
            const result = await this.dbManager.get(query, [email, username, role]);
            return new User(result.id, result.username, result.email, result.role);
        } catch (err) {
            throw err;
        }
    }

    async loginUser(email, password) {
        try {
            const sql = "SELECT * FROM User WHERE email = ? ";
            const user = await this.dbManager.get(sql, [email], true);
            if (user === undefined) {
                // user does not exist
                throw { err: 401, msg: "Incorrect username and/or password." };
            }
            if(user.isVerified === 0)
                throw { err: 401, msg: "Account must be verified" };
            const login = await verifyPassword(
                user.password,
                user.salt,
                password
            );
            if (!login)
                throw { err: 401, msg: "Incorrect username and/or password." };
            return {"id": user.id, "username": user.username, "email": user.email, "role": user.role};
        } catch (err) {
            throw err;
        }
    }

}

async function verifyPassword(passwordStored, saltStored, password) {
    let encryptedPass = crypto.pbkdf2Sync(password, saltStored, 1000, 64, `sha512`).toString(`hex`);
    if (encryptedPass === passwordStored)
        // check if digest stored in the DB is equal to digest computed above
        return true;
    return false;
}

module.exports = UserDAO;