class authDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for auth. dao!';
        this.dbManager = dbManager;
    }

    getVerifiedUserbyEmail = async (email) => {
        try {
            const sql = "SELECT * FROM User WHERE email = ? and isVerified='true';";
            const res = await this.dbManager.get(sql, [email], true);
            return res ? res.id : null;
        } catch (err) {
            throw err;
        }
    };

    getUnverifiedUserbyEmail = async (email) => {
        try {
            const sql = "SELECT * FROM User WHERE email = ? ;";
            const res = await this.dbManager.get(sql, [email], true);
            return res ? res.id : null;
        } catch (err) {
            throw err;
        }
    };

    verifyUser = async (email) => {
        try {
            const sql = "UPDATE User set isVerified = 'true'  WHERE email = ? and isVerified='false';";
            const res = await this.dbManager.get(sql, [email], true);
            return res ? res.id : null;
        } catch (err) {
            throw err;
        }
    };

    async insertUser(email, username,  role, password, salt, name, surname, phoneNumber) {
        const query = 'INSERT INTO User (email, username,  role, password, salt, name, surname, phoneNumber, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        try {
            const result = await this.dbManager.query(query, [email, username,  role, password, salt, name, surname, phoneNumber, 'false']);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

}

module.exports = authDAO;