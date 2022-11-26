'use strict';

const User = require('../controllers/schemas/userSchema');
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
    let query = "INSERT INTO User (email, hash, salt) VALUES (?, ?, ?)";
    try {
      const output = await generateSecurePassword(password);
      const userId = await this.dbManager.query(query, [
        email,
        output[0],
        output[1]
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
        user[0].hash,
        user[0].salt,
        password
      );
      if (!login) throw { err: 401, msg: "Invalid password" };
      return new User(user[0].id, user[0].user);
    } catch (err) {
      throw err;
    }
  }
}

//let encryptedPass = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

async function generateSecurePassword(password) {
  const buf = crypto.randomBytes(128); // generate random bytes
  const salt = buf.toString("hex"); // convert bytes to hex string (to store in the DB)
  const hash = crypto.createHash("sha256");
  hash.update(password); // generate digest as SHA-256(password | salt)
  hash.update(buf);
  const pwd = hash.digest("hex");
  return [pwd, salt];
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