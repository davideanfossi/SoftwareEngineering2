'use strict';

const User = require('../dtos/userDTO');
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
          return new User(result.id, result.username, result.role);    
      } catch (err) {
          throw err;
      }
  }

  async insertUser(email, password) {    
    let query = "INSERT INTO User (email, password) VALUES (?, ?)";
    try {
      const encryptedPass = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
      const userId = await this.dbManager.query(query, [
        email,
        encryptedPass
      ]);

      return userId;
    } catch (err) {
      throw err;
    }
  }

  async loginUser(email, password) {
    try {
      const sql = "SELECT * FROM User WHERE email = ? ";
      const user = await this.dbManager.get(sql, [email]);
      if (user === undefined || user[0] === undefined) {
        // user does not exist
        throw { err: 401, msg: "User not found" };
      }
      const login = await verifyPassword(
        user[0].password,
        user[0].salt,
        password
      );
      if (!login) throw { err: 401, msg: "Invalid password" };
      return new User(user[0].id, user[0].username);
    } catch (err) {
      throw err;
    }
  }
}


async function verifyPassword(passwordStored, saltStored, password) {
  const salt = Buffer.from(saltStored, "hex"); // convert saltStored (hex string) to bytes
  const hash = crypto.createHash("sha256");
  hash.update(password); // generate digest as SHA-256(password | salt)
  hash.update(salt);
  const pwd = hash.digest("hex");
  if (pwd === passwordStored)
    // check if digest stored in the DB is equal to digest computed above
    return true;
  return false;
}


module.exports = UserDAO;
