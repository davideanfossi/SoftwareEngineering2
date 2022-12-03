const userSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "title": "User Schema",
    "user": {
        "$id": "#definitions/user",
        "type": "object",
        "properties": {
            "email": {
                "description": "email of the user, unique in DB",
                "type": "string",
                "format": "email"
            },
            "username": {
                "description": "username of the user",
                "type": "string",
            },
            "role": {
                "description": "role of the user, can be Hiker, Local Guide, Platform Manager, Hut Worker, Emergency Operator",
                "type": "string",
                "enum": ["Hiker", "Local Guide", "Platform Manager", "Hut Worker", "Emergency Operator"]
            },

            "isVerified": {
                "description": "value that represent the verification process of the user, can be true or false",
                "type": "string",
                "enum": ["true", "false"]
            },
            "password": {
                "type": "string",
                "maxLength": 15,
                "minLength": 6,
            },

        },
        "required": ["email", "role", "password", "username"],
        "allOf": [
            {
                "if": {
                    "properties": {
                        "role": {
                            "const": "Local Guide"
                        }
                    }
                },
                "then": {
                    "properties": {
                        "name": {
                            "description": "name of the user",
                            "type": "string",
                        },
                        "surname": {
                            "description": "surname of the user",
                            "type": "string",
                        },
                        "phoneNumber": {
                            "description": "phone number of the user ",
                            "type": "string",
                            "pattern": "^[0-9]{10}$"
                        }
                    },
                    "required": ["name", "surname", "phoneNumber"]
                }
            }, {
                "if": {
                    "properties": {
                        "role": {
                            "const": "Hut Worker"
                        }
                    }
                },
                "then": {
                    "properties": {
                        "name": {
                            "description": "name of the user",
                            "type": "string",
                        },
                        "surname": {
                            "description": "surname of the user",
                            "type": "string",
                        },
                        "phoneNumber": {
                            "description": "phone number of the user ",
                            "type": "string",
                            "pattern": "^[0-9]{10}$"
                        }
                    },
                    "required": ["name", "surname", "phoneNumber"]
                }
            }

        ],
        "unevaluatedProperties": false,
    }
};

module.exports = userSchema;