
class Hut {

    constructor(id, name, numOfBeds, phoneNumber, email, description, website, point, userId) {
        this.id = id;
        this.name = name;
        this.numOfBeds = numOfBeds;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.description = description;
        this.website = website ? website : "";
        this.point = point;
        this.userId = userId;
    }
}

module.exports = Hut;