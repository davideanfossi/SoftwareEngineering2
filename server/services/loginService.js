'use strict'

class LoginService {
    constructor(userDAO) {
        if (!userDAO)
            throw 'userDAO must be defined for service!';

        this.userDAO = userDAO;
    }

    async login(email, password) {
        try {
            // get user
            const user = await this.userDAO.loginUser(email, password);
            return user;
        } catch (err) {
            throw err;
         }
    }

}

module.exports = LoginService;