'use strict';

const crypto = require('crypto');
const { roles } = require('../models/authModel');
const User = require('../models/userModel');

class AuthService {
    constructor(authDAO) {
        if (!authDAO)
            throw 'authDAO must be defined for auth. service!';
        this.authDAO = authDAO;
    };


    getUser = async (email, ver) => {
        if (ver) {
            const res = await this.authDAO.getVerifiedUserbyEmail(email);
            return res;
        }
        else {
            const res = await this.authDAO.getUnverifiedUserbyEmail(email);
            return res;
        }
    };

    verifyUser = async (email) => {
        const res = await this.authDAO.verifyUser(email);
        return res;
    };

    addUser = async (email, username, role, password, name, surname, phoneNumber) => {
        if (role == "Hiker" && (name || surname || phoneNumber)) {
            throw {
                returncode: 422,
                message: 'validation of request body failed, Hiker should have only username, email and password fields'
            };
        };

        if (role != "Hiker" && (!name || !surname || !phoneNumber)) {
            throw {
                returncode: 422,
                message: 'validation of request body failed, this role should specify also name, surname and phone number'
            };
        };

        let salt = crypto.randomBytes(16).toString('hex');
        let encryptedPass = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        const res = await this.authDAO.insertUser({username, email, role, password: encryptedPass, salt, name, surname, phoneNumber});
        return res;
    };

    getRoles = () => {
        return roles;
    };


}

module.exports = AuthService; 