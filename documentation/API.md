# List of API

## INDEX
- [GET hikes](#get-hikes)
- [GET hikes limits](#get-hikes-limits)
- [ADD new hike](#add-new-hike)
- [GET hike track](#get-hike-track)

--------------------------------------------------------------
## GET hikes

**`GET: /api/hikes`**
- get hikes information with filters and paging
- Authorization: _None_
- Request body: _None_
- Request query:
    - `totalPages`: total number of pages with the given pageSize
    - `pageNumber`: number of the page requested
    - `pageSize`: maximum number of elements returned
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
    - `city`: string of the city
    - `province`: string of the province
- Example: `/api/hikes?page=1&pageSize=5&minLen=500&maxLen=1500&difficulty=Hiker`
- Response: `200 OK` (success), `400 Bad Request` (query params not correct) or `500 Internal Server Error` (generic error).
- Response body: 
    ```
    {
        "totalPages": 3,
        "pageNumber": 1,
        "pageSize": 5,
        "pageItems": [
            {
                "id": 1,
                "title": "title of the hike",
                "length": 2000,
                "expectedTime": 120,
                "ascent": 300,
                "difficulty": "Professional Hiker",
                "description": "description of the hike"
            },
            ...
        ]
    }

    ```


## GET hikes limits

**`GET: /api/hikes/limits`**
- get max length, max expected time, max ascent, and difficulty types of the hikes
- Authorization: _None_
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

## ADD new hike
**`POST: /api/hike`**
- add new hike
- Request body: form-data format (title,length,expectedTime,ascent,difficulty,startPointId,endPointId,description,trackingfile)
- Response: `200 OK` (success), `500 Internal Server Error` (generic error).


## GET hike track

**`GET: /api/hikes/{id}/track`**
- get track taken from the gpx file of the specific hike specified by the id
- Authorization:  _hiker_
- Request params:
    -  _id_: integer identifier of the hike
- Request body: _None_
- Response: `200 OK` (success), `400 Bad Request` (id param not correct), `404 Not Found` (no hike related to the id),
`401 Unauthorized` (user not authenticated), `403 Forbidden` (user logged in but not authorized) and `500 Internal Server Error` (generic error).
- Response body: 
    ```
    {
        "startpoint": {
            "id": 4,
            "latitude": 45.737089,
            "longitude": 7.319665,
            "altitude": 645,
            "name": "Aosta",
            "address": "Aosta, Valle d'Aosta"
        },
        "endPoint": {
            "id": 1,
            "latitude": 45.580187,
            "longitude": 7.217462,
            "altitude": 2361,
            "name": "Parco Nazionale del Gran Paradiso",
            "address": null
        },
        "referencePoints": [
            {
                "id": 2,
                "latitude": 45.622523,
                "longitude": 7.200738,
                "altitude": 2284,
                "name": "Strada regionale della Valsavarenche",
                "address": "11010 Valsavarenche"
            },
            ...
        ],
        "track": [
            {
                "lat": 45.177786,
                "lon": 7.083372
            },
            {
                "lat": 45.177913,
                "lon": 7.083268
            },
            ...
        ]
    }
    ```

