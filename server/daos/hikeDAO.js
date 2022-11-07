'use strict';

class HikeDAO {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DBManager must be defined for Counter dao!';
        this.dbManager = dbManager;
    }
}

module.exports = HikeDAO;