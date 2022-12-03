'use strict';

const { rejects } = require('assert');
const crypto = require('crypto');
const { roles } = require('../models/authModel');


class authService {
    constructor(authDAO) {
        if (!authDAO)
            throw 'authDAO must be defined for auth. service!';
        this.authDAO = authDAO;
    };


    getUser = async (email, ver) => {
        try {
            if (ver) {
                const res = await this.authDAO.getVerifiedUserbyEmail(email);
                return res;
            }
            else {
                const res = await this.authDAO.getUnverifiedUserbyEmail(email);
                return res;
            }
        } catch (err) {
            throw err;
        }
    };

    verifyUser = async (email) => {
        try {
            const res = await this.authDAO.verifyUser(email);
            return res;
        } catch (err) {
            throw err;
        }
    };

    addUser = async (email, username, role, password, name, surname, phoneNumber) => {
        try {
            
            if (role == "Hiker" && (name || surname || phoneNumber)) {
                throw {
                    returncode: 422, 
                    message: 'validation of request body failed, Hiker should have only username, email and password fields'
            };};

            if (role != "Hiker" && (!name || !surname || !phoneNumber)) {
                throw {
                    returncode: 422, 
                    message: 'validation of request body failed, this role should specify also name, surname and phone number'
            };};

            let salt = crypto.randomBytes(16).toString('hex');
            let encryptedPass = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
            const res = await this.authDAO.insertUser(email, username, role, encryptedPass, salt, name, surname, phoneNumber);
            return res;
        } catch (err) {
            throw err;
        }
    };

    getRoles = () => {
        return roles;
    };


}

module.exports = authService; 