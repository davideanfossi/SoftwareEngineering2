'use strict'

class User {
    constructor(id, username, email, role, name, surname, phoneNumber) {
       this.id = id;
       this.username = username;
       this.email = email;
       this.role = role;
       this.name = name ? name : "";
       this.surname = surname ? surname : "";
       this.phoneNumber = phoneNumber ? phoneNumber : "";
    }
}

module.exports = User;