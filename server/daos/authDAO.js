class AuthDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for auth. dao!';
        this.dbManager = dbManager;
    }

    getVerifiedUserbyEmail = async (email) => {
        const sql = "SELECT * FROM User WHERE email = ? and isVerified='1';";
        const res = await this.dbManager.get(sql, [email], true);
        return res ? res.id : null;
    };

    getUnverifiedUserbyEmail = async (email) => {
        const sql = "SELECT * FROM User WHERE email = ? ;";
        const res = await this.dbManager.get(sql, [email], true);
        return res ? res.id : null;
    };

    verifyUser = async (email) => {
        const sql = "UPDATE User set isVerified = '1'  WHERE email = ? and isVerified='0';";
        const res = await this.dbManager.get(sql, [email], true);
        return res ? res.id : null;
    };

    async insertUser(user) {
        const query = 'INSERT INTO User (email, username,  role, password, salt, name, surname, phoneNumber, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await this.dbManager.query(query, [user.email, user.username, user.role, user.password, user.salt, user.name, user.surname, user.phoneNumber, '0']);
        return result;
    }

}

module.exports = AuthDAO;