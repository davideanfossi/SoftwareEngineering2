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
            const result = await this.dbManager.get(query, [email], true);
            return new User(result.id, result.username);
    }

    async getUserById(userId) {
        const query = "SELECT * FROM User WHERE id = ?";
            const result = await this.dbManager.get(query, [userId], true);
            return new User(result.id, result.username, result.email, result.role);
    }

    async getUserByCredentials(username, email, role) {
        const query = "SELECT * FROM User WHERE email = ? AND username = ? AND role = ?";
            const result = await this.dbManager.get(query, [email, username, role]);
            return new User(result.id, result.username, result.email, result.role);
    }

    async loginUser(email, password) {
        const sql = "SELECT * FROM User WHERE email = ? ";
        const user = await this.dbManager.get(sql, [email], true);
        if (user === undefined) {
            // user does not exist
            throw {msg:"Incorrect username and/or password. Error code: ",err: 401};
        }
        if(user.isVerified === 0)
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
        return {"id": user.id, "username": user.username, "email": user.email, "role": user.role};
    }

}

async function verifyPassword(passwordStored, saltStored, password) {
    let encryptedPass = crypto.pbkdf2Sync(password, saltStored, 1000, 64, `sha512`).toString(`hex`);
    return encryptedPass === passwordStored;
}

module.exports = UserDAO;