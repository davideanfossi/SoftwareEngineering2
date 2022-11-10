'use strict'
const { use } = require("passport");

 

class User{
    
    constructor(id, email, username, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires){
        this.id = id;
        this.email = email;
        this.username = username;
        this.role = role;
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.isVerified = isVerified;
    }

}

module.exports = {User};