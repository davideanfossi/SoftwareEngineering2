class authDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for auth. dao!';
        this.dbManager = dbManager;
    }

    getUserbyEmail = async (email) => {
        try {
            const sql = "SELECT * FROM User WHERE email = ?";
            const res = await this.dbManager.get(sql, [email], true);
            return res ? res.id : null;
        } catch (err) {
            throw err;
        }
    };

    async insertUser(name, email, password) {
        const query = 'INSERT INTO User (email, name, password, username, role, salt, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)';

        try {
            const result = await this.dbManager.query(query, [email, name, password, name, "Hiker", "q12123", "false"]);
            console.log(name, email, password, result);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

}

module.exports = authDAO;