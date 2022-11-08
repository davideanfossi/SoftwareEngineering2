# List of API

## INDEX
- [GET hikes](#get-hikes)
- [GET hikes limits](#get-hikes-limits)

--------------------------------------------------------------
## GET hikes

**`GET: /api/hikes`**
- get hikes information with filters
- Request body: _None_
- Request query: 
    - `minLen`: minimum length of the hike expressed in `meters`
    - `maxLen`: maximum length of the hike expressed in `meters`
    - `minTime`: minimum expectedTime of the hike expressed in `minutes`
    - `maxTime`: maximum expectedTime of the hike expressed in `minutes`
    - `minAscent`: minimum ascent of the hike expressed in `meters`
    - `maxAscent`: maximum length of the hike expressed in `meters`
    - `difficulty`: string that represent the difficulty of the hike. One of [`Tourist`, `Hiker`, `Professional Hiker`]
    - `baseLat`: latitude of the center of the searched area (decimal number)
    - `baseLon`: longitude of the center of the searched area (decimal number)
    - `radius`: radius of the searched area expressed in `kilometers`
- Example: `/api/hikes?minLen=500&maxLen=1500&difficulty=Hiker`
- Response: `200 OK` (success), `500 Internal Server Error` (generic error).
- Response body: 
    ```
    [
        {
            "id": 1,
            "title": "title of the hike",
            "length": 2000,
            "expectedTime": 120,
            "ascent": 300,
            "difficulty": "Professional Hiker",
            "startPoint": {
                "id": 1,
                "latitude": 48.856614,
                "longitude": 2.3522219,
                "name": "Torino",
                "address": "address 1"
            },
            "endPoint": {
                "id": 4,
                "latitude": 45.574405,
                "longitude": 7.455193,
                "name": "point 4",
                "address": null
            },
            "description": "description of the hike",
            "referencePoints": [
                {
                    "id": 2,
                    "latitude": "45.0702544637",
                    "longitude": "7.7020424021",
                    "name": "point 2",
                    "address": "address 2"
                },
                {
                    "id": 3,
                    "latitude": "45.1198176598",
                    "longitude": "7.5650566232",
                    "name": "point 3",
                    "address": "address 3"
                }
            ]
        }
    ]
    ```


## GET hikes limits

**`GET: /api/hikes/limits`**
- get max length, max expected time, max ascent, and difficulty types of the hikes
- Request body: _None_
- Response: `200 OK` (success), `500 Internal Server Error` (generic error).
- Response body: 
    ```
    {
        "maxLength": 2000,
        "maxExpectedTime": 180,
        "maxAscent": 300,
        "difficultyType": [
            "Tourist",
            "Hiker",
            "Professional Hiker"
        ]
    }
    ```

