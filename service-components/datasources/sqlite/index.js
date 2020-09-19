function sqlite({
    datasourceConfig
}) {
    const sqlite3 = require("sqlite3").verbose();
    const { promisify } = require("util");
    const db = new sqlite3.Database(datasourceConfig.databasePath);
    const dbFindAll = promisify(db.all.bind(db));
    const dbRun = promisify(db.run.bind(db));
    const dbGet = promisify(db.get.bind(db));

    /**
     * Formats incoming data as an an array of values to be injected in a SQL statement.
     * @params {Object} data - POJO containing data for the SQL statement.
     * @returns {Array}
     */

    function mapToSQLQueryDataList(data) {
        return Object.values(data);
    }

    /**
     * Formats placeholders for data in a SQL statement.
     * @params {Object} data - POJO containing data for the SQL statement.
     * @returns {Array}
     */

    function mapToSQLQueryPlaceholders(data) {
        return Object.keys(data).map((key) => '?').join(',');
    }

    /**
     * Formats placeholders for data in a SQL statement according to the node/sqlite3 package. For UPDATING rows in the database ONLY.
     * @info - https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
     * @params {Object} data - POJO containing data for the SQL statement.
     * @returns {Array}
     */

    function mapToSQLQueryString(data) {
        return Object.keys(data).map((key) => `${key} = $${key}`).join(", ");
    }

    /**
     * Formats data in a SQL statement according to the node/sqlite3 package. For UPDATING rows in the database ONLY.
     * @info - https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
     * @params {Object} data - POJO containing data for the SQL statement.
     * @returns {Array}
     */

    function mapToSQLUpdateQueryObject(data) {
        return Object.entries(data).reduce((res, [key, val]) => {
            res[`$${key}`] = val;
            return res;
        }, {});
    }

    /*function mapToSQLWhereClause(data) {
        NOT IMPLEMENTED YET
    }*/

    /**
     * Adds a row to the database.
     * @params {Object} data - POJO containing row data.
     * @params {String} tableName - Name of table to insert into.
     * @returns {Object}
     */

    async function add(data, tableName = "default_table") {
        if (typeof(data) !== "object") {
            return Promise.resolve({
                data: [],
                status: "error",
                message: `Malformed record. Record should be of type [Object] but is ${typeof(data)} instead.`,
                error: true
            });
        }
        
        try {
            const _id = createUUID();
            const _createdAt = new Date().toISOString();
            const _lastModified = null;
            const record = Object.assign(data, { _id, _createdAt, _lastModified });

            await dbRun(`INSERT INTO ${tableName} VALUES(${mapToSQLQueryPlaceholders(record)})`, mapToSQLQueryDataList(record));
            
            return {
                data: [record],
                status: "ok",
                message: null,
                error: false
            }
        } catch(e) {
            return {
                data: [],
                status: "error",
                message: e.message,
                error: true
            }
        } 
    
    }

    /**
     * Update a row in the database BY ID ONLY.
     * @params {String} _id - Id (Primary Key) of row to update.
     * @params {Object} doc - POJO containing update data for a row.
     * @returns 
     */

    async function updateOne(_id, doc, tableName = "default_table") {
        try {
            const record = { 
                ...doc, 
                _id,  
                _lastModified: new Date().toISOString()
            };
            
            await dbRun(`UPDATE ${tableName} SET ${mapToSQLQueryString(record)} WHERE _id = $_id`, mapToSQLUpdateQueryObject(record));
            return {
                data: [],
                status: "ok",
                message: null,
                error: false
            }
            
        } catch(e) {
            return {
                data: [],
                status: "error",
                message: `e.message || Does Table (${tableName}) or record Id (${_id}) exist?` ,
                error: true
            }
        }
    }

    /**
     * Remove a row from the database BY ID ONLY.
     * @params {String} id - Id of row to remove.
     * @params {String} tableName - Name of table to remove from.
     * @returns
     */

    async function removeOne(_id, tableName = "default_table") {
        try {
            await dbRun(`DELETE FROM ${tableName} WHERE _id = ?`, [_id]);
            
            return {
                data: [],
                status: "ok",
                message: null,
                error: false
            }
        } catch(e) {
            return {
                data: [],
                status: "error",
                message: `${e.message} || Does Table (${tableName}) or record Id (${_id})`,
                error: true
            }
        }
    }

    /**
     * Select all rows from a table in the database.
     * @params {String} tableName - Table to select from.
     * @returns {Object}
     */

    async function findAll(tableName = "default_table") {
        try {
            const records = await dbFindAll(`SELECT * FROM ${tableName}`);
            return {
                data: records,
                status: "ok",
                message: null,
                error: false
            }
        } catch(e) {
            return {
                data: [],
                status: "error",
                message: e.message,
                error: true
            }
        }
       
    }

    /**
     * Find a row in the database BY ID ONLY.
     * @params {String} _id - Id (Primary Key) of row in the database.
     * @params {String} tableName - Name of table to select from.
     * @returns {Object}
     */

    async function findOne(_id, tableName = "default_table") {
        try {
            const record = await dbGet(`SELECT * FROM ${tableName} WHERE _id = ?`, [_id]);
            return {
                data: record ? [record]: [],
                status: "ok",
                message: null,
                error: false
            }
        } catch(e) {
            return {
                data: [],
                status: "error",
                message: `${e.message} || Does Table (${tableName}) or record Id (${_id}) exist?`,
                error: true
            } 
        }
        
        
    }

    /**
     * Drop a table from the database.
     * @params {String} tableName - Name of table to drop.
     * @returns
     */

    async function drop(tableName) {
        /* WILL NOT BE IMPLEMENTED. Included to ensure interface methods are all documented. Tables should be dropped via migrations.
         */
    }

    /**
     * Creates a UUID (primarily for use as Primary Key) in a database row.
     * @params {String} customId - [optional] custom id for the record.
     * @returns {String}
     */

    function createUUID(customId) {
        if (customId && (typeof(customId) === "string")) {
            return customId;
        }

        const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
        return (
            timestamp +
            "xxxxxxxxxxxxxxxx"
            .replace(/[x]/g, function() {
                return ((Math.random() * 16) | 0).toString(16);
            })
            .toLowerCase()
        );
    }
    
    /**
     * Closes connection to the database.
     * @returns {Object}
     */
    
    function close() {
        return Promise.resolve({
            data: [],
            status: "ok",
            message: null,
            error: false
        });
    }

    return {
        add,
        removeOne,
        updateOne,
        findAll,
        findOne,
        drop,
        close,
        createUUID //exported for unit tests ONLY
    };
}

module.exports = sqlite;
