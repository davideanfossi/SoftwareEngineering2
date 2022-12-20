function Hut(
    id,
    name,
    description,
    numberOfBeds,
    phone,
    email,
    optionalWebsite,
    image,
    point
) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.numberOfBeds = numberOfBeds;
    this.phone = phone;
    this.email = email;
    this.optionalWebsite = optionalWebsite;
    this.image = image;
    this.point = point; 
}

function Point(id, latitude, longitude, altitude, name, address){
    this.id = id;
    this.latitude = latitude; 
    this.longitude = longitude; 
    this.altitude = altitude; 
    this.name = name;
    this.address = address;
}

export {Hut, Point};
