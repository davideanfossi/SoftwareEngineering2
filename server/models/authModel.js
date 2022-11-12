'use strict'

const roles = [
   "Hiker",
   "Local Guide", 
   //PlatformManager: "platformManager",
   "Hut Worker",
   //EmergencyOperator:"emergencyOperator" 
]

class User{
    
    constructor(id, email, username, role, name, surname, phoneNumber, isVerified){
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

module.exports = {User, roles};