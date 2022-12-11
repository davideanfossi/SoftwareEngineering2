
class Hut {

    constructor(id, name, numOfBeds, phoneNumber, email, description, website, point, userId, imageName) {
        this.id = id;
        this.name = name;
        this.numOfBeds = numOfBeds;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.description = description;
        this.website = website ? website : "";
        this.point = point;
        this.userId = userId;
        this.imageName = imageName;
    }
}

module.exports = Hut;
