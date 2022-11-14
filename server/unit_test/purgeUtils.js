'use strict'

module.exports.purgeAllTables = async function (db) {
    const queryGetTables = 'SELECT tbl_name as t_name FROM sqlite_master WHERE type = "table" and name NOT IN ("sqlite_sequence");';

    const tableNames = (await db.get(queryGetTables, [])).map(t => t.t_name);

    for (let tableName of tableNames) {
        await module.exports.purgeTable(db, tableName);
    }

    await module.exports.purgeSequences(db);
}

module.exports.purgeTable = async function (db, tableName) {
    const queryPurgeTable = `DELETE FROM ${tableName};`;
    const params = [];
    await db.query(queryPurgeTable, params);
}

module.exports.purgeSequences = async function (db) {
    const queryPurgeSeq = `UPDATE sqlite_sequence SET seq = 0;`;
    const params = [];
    
    await db.query(queryPurgeSeq, params);
}