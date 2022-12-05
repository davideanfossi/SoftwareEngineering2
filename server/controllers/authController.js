'use strict'

const express = require('express');
const router = express.Router();
const DbManager = require("../database/dbManager");
const AuthService = require('./../services/authService');
const AuthDAO = require('./../daos/authDAO');
const { User } = require('../models/authModel');
const { json } = require('express');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const userSchema = require('./../models/userSchema');
const jsonValidator = require('jsonschema').Validator;

const dbManager = new DbManager("PROD");
const authDAO = new AuthDAO(dbManager);
const authService = new AuthService(authDAO);


const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const sender = {
    email: 's295555@studenti.polto.it',
    name: 'HikeTrack',
}


const userValidator = (req, res, next) => {
    const validator = new jsonValidator();
    try {    
        validator.validate(req.body, userSchema.user, { throwError: true }); 
    } 
    catch (error) {   
        return res.status(401).json({error: 'Invalid user format: ' + error.property + ' ' + error.message}); 
    }  
    next();
}

router.post('/signup', userValidator, 
    async (req, res) => {
        let response = {};
        try {
            const { email, username, role, password, name, surname, phoneNumber } = req.body;

            let user = await authService.getUser(email);
            if (user) {
                return res.status(400).json({ error: "User with this email already exists." });
            }

            const token = jwt.sign(
                { email, username, role, name, surname, phoneNumber },
                process.env.JWT_ACC_ACTIVATE,
                { expiresIn: '20m' });

            await tranEmailApi.sendTransacEmail({
                sender: sender,
                to: [{ "email": email }],
                subject: "HikeTrack Account - Email verification",
                htmlContent: `
                <h2>Please click on followng button in the next 20 minutes to activate your account!</h2>
                <form action="${process.env.CLIENT_URL}/authentication/activate/${token}">
                    <button class="btn btn-danger btn-lg">Click here!</button>
                </form>
                `
            }).then(console.log(`${process.env.CLIENT_URL}/authentication/activate/${token}`)).catch((err) => { res.status(422).json(err.message) });


            await authService.addUser(email, username, role, password, name, surname, phoneNumber);

            return res.status(201).json({ "msg": "Registration request successful, to complete registration confirm email" });

        } catch (err) {
            switch (err.returncode) {
                case 422:
                    return res.status(422).json(err.message);
                default:
                    return res.status(500).send();
            }
        }
    }
);

router.post('/email-activate',
    async (req, res) => {
        try {
            let { token } = req.body;
            if (token) {
                jwt.verify(token, process.env.JWT_ACC_ACTIVATE, async function (err, decodedToken) {
                    if (err) {
                        return res.status(400).json({ error: "incorrect or expired link." });
                    }
                    const { email, username, role, name, surname, phoneNumber } = decodedToken;

                    let user = await authService.getUser(email, true);
                    if (user) {
                        return res.status(400).json({ error: "User with this email already exists." });
                    }
                    user = await authService.getUser(email);
                    await authService.verifyUser(email);
                    return res.status(201).json(new User(user, email, username, role, name, surname, phoneNumber, 'true'));
                })
            } else {
                return res.json({ error: "Something went wrong during verification process!" });
            }
        }
        catch (err) {
            return res.status(500).send();
        }
    }
);

router.get('/roles', 
        (req, res) => {
            let response = authService.getRoles();
            res.status(200).json(response);
        }
    )

module.exports = router;