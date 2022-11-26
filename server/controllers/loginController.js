'use strict'

const DbManager = require("../database/dbManager");
const UserDAO = require('../daos/userDAO');
const LoginService = require("../services/loginService");

const dbManager = new DbManager("PROD");
const userDAO = new UserDAO(dbManager);
const loginService = new LoginService(userDAO);


const login = async (email, password) => {
    try {
        const user = await loginService.login(email, password);
        return user;
    }
    catch (err) {
        return err;
    }
};  

const getPermission = (authorizedRoles) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const user = await userDAO.getUserById(userId);
        authorizedRoles.include(user.role)
            ? next()
            : res.status(401).send("unauthorized");
    }
};

module.exports = {getPermission, login};