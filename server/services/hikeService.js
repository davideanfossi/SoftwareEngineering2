'use strict';


class HikeService {
    constructor(hikeDAO) {
        if (!hikeDAO)
            throw 'counterDAO must be defined for counter service!';

        this.hikeDAO = hikeDAO;
        
    }


}

module.exports = HikeService;