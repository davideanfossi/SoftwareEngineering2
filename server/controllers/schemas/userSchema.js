'use strict'

class userDTO {
    constructor(id, username, email, role, password, salt, name, surname, phoneNumber, isVerified, token, tokenExpires) {
       this.id = id;
       this.username = username;
       this.email = email;
       this.role = role;
       this.password = password;
       this.salt = salt;
       this.name = name;
       this.surname = surname;
       this.phoneNumber = phoneNumber;
       this.isVerified = isVerified;
       this.token = token;
       this.tokenExpires = tokenExpires;
    }
}