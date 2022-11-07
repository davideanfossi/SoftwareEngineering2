'use strict';

const crypto = require('crypto');


class authService {
    constructor(authDAO) {
        if (!authDAO)
            throw 'authDAO must be defined for auth. service!';
        this.authDAO = authDAO;
    }

    getUser = async (email) => {
        try {
            const res = await this.authDAO.getUserbyEmail(email);
            return res;
        } catch (err) {
            throw err;
        }
    };

    addUser = async (name, email, password) => {
        try {
            const res = await this.authDAO.insertUser(name, email, password);
            return res;
        } catch (err) {
            throw err;
        }
    };


}

module.exports = authService; 