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

const dbManager = new DbManager("PROD");
const authDAO = new AuthDAO(dbManager);
const authService = new AuthService(authDAO);


var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const sender = {
    email: 's295555@studenti.polto.it',
    name: 'HikeTrack',
}


router.post('/signup',
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

            // let testAccount = await nodemailer.createTestAccount();
            // let transporter = nodemailer.createTransport({
            //     host: "smtp.ethereal.email",
            //     port: 587,
            //     secure: false, // true for 465, false for other ports
            //     auth: {
            //         user: testAccount.user, // generated ethereal user
            //         pass: testAccount.pass, // generated ethereal password
            //     },
            // });

            // //if user is not found in DB send email
            // let info = await transporter.sendMail({
            //     from: 'noreply@hello.com', // sender address
            //     to: 'zanfardinodiego@gmail.com', // list of receivers
            //     subject: "Account Activation Link ✔", // Subject line
            //     html: `
            //     <h2>Please click on followng button to activate your account!</h2>
            //     <button onclick="${process.env.CLIENT_URL}/authentication/activate/${token}" type="button">
            //         Click Here</button>
            //     ` // html body
            // });



            // console.log("Message sent: %s", info.messageId);
            // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


            // const receivers = [
            //     email: email
            // ];

            tranEmailApi.sendTransacEmail({
                sender: sender,
                to: [{ "email": email }],
                subject: "HikeTrack Account - Email verification",
                htmlContent: `
                <form action="${process.env.CLIENT_URL}/authentication/activate/${token}">
                    <button class="btn btn-danger btn-lg">Click here!</button>
                </form>
                
                <h2>Please click on followng link in the next 20 minutes to activate your account!</h2>
                <a href="${process.env.CLIENT_URL}/authentication/activate/${token}">Click here!</a>
                `
            }).then(console.log(`${process.env.CLIENT_URL}/authentication/activate/${token}`)).catch((err) => { res.status(422).text(err.message) });


            await authService.addUser(email, username, role, password, name, surname, phoneNumber);

            return res.status(201).json({ "msg": "Registration request successful, to complete registration confirm email" }).end();

        } catch (err) {
            console.log(err);
            switch (err.returnCode) {
                case 422:
                    return res.status(422).text(err.message);
                default:
                    return res.status(500).end();
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
                    return res.status(201).json(new User(user, email, username, role, name, surname, phoneNumber, 'true')).end();
                })
            } else {
                return res.json({ error: "Something went wrong during verification process!" });
            }
        }
        catch (err) {
            return res.status(500).end();
        }
    }
);

module.exports = router;