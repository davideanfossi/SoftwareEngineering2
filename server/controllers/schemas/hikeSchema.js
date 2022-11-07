const hikeSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "title": "Hike Schema",
    "definitions": {
        "point": {
            "$id": "#definitions/point",
            "type": "object",
            "properties": {
                "id": {"type": "integer", "minimum": 1},
                "latitude": {"type": "number"},
                "longitude": {"type": "number"},
                "name": {"type": "string"},
                "address": {"type": "string"}
            },
            "required": ["id", "latitude", "longitude"]
        },
        "points": {
            "$id": "#definitions/points",
            "type": "array",
            "items": {"$ref": "#definitions/point"}
        }
    },
    "type": "object",
    "properties": {
        "id": {"type":"integer", "minimum": 1},
        "title": { "type": "string", "minLength": 1 },
        "length": { "type": "integer", "minimum": 0 },
        "expectedTime": {"type": "integer", "minimum": 0},
        "ascent": {"type": "integer", "minimum": 0},
        "difficulty": {"type": "string", "enum": ["Tourist","Hiker","Professional Hiker"]},
        "startPoint": {"$ref": "#definitions/point"},
        "endPoint": {"$ref": "#definitions/point"},
        "referencePoints": {"$ref": "#definitions/points"},
        "description": {"type": "string"}
    },
    "required": ["id", "title", "length", "expectedTime", "ascent", "difficulty", "startPoint", "endPoint"],
    "additionalProperties": false
};

module.exports = hikeSchema;