const fs = require("fs");
const { promisify } = require("util");
const writeToFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

function JSONDatastore({ datasourceConfig }) {
    const fileDatastore = require(datasourceConfig.filePath);

    /**
     * A a document to the database.
     * @params {String} data - document to add to the database.
     * @params {String} collectionName - Name of collection to add to.
     * @params {String} customId - An optional custom id to use for document lookup. 
     * @returns {Object}
     */

    async function add(doc, collectionName = "default", customId) {
        
        if (typeof(doc) !== "object") {
            return Promise.resolve({
                data: [],
                status: "error",
                message: `Malformed record. Record should be of type [Object] but is ${typeof(doc)} instead.`,
                error: true
            });
        }

        try {
            const fileDB = await readFile(datasourceConfig.filePath, "utf-8");
            const data = JSON.parse(fileDB);
            const _id = createUUID(customId);
            const _createdAt = new Date().toISOString();
            const _lastModified = null
            const record = Object.assign(doc, { _id, _createdAt, _lastModified });
            
            data[collectionName][_id] = record;
            await writeToFile(datasourceConfig.filePath, JSON.stringify(data, null, 2));
             
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
                message: `${e.message} || Does Collection (${collectionName}) exist?`,
                error: true
            }   
        }
    }

    /**
     * Update a document in the database BY ID ONLY.
     * @params {String} _id - Id of the document in the database.
     * @params {String} doc - Update document.
     * @params {String} collectionName - Collection to update. 
     * @returns {Object}
     */

    async function updateOne(_id, doc, collectionName = "default") {
        try {
            const fileDB = await readFile(datasourceConfig.filePath, "utf-8");
            const data = JSON.parse(fileDB);
            const record = Object.assign(data[collectionName][_id], {
                _lastModified: new Date().toISOString(),
                ...doc
            });
            
            data[collectionName][_id] = record;
            await writeToFile(datasourceConfig.filePath, JSON.stringify(data, null, 2));
            
            return {
                data:[record],
                status: "ok",
                message: null,
                error: false
            }
        } catch(e) {
            return {
                data:[],
                status: "error",
                message: `${e.message} || Does Collection (${collectionName}) or record Id (${_id})`,
                error: true
            }
        }
    }

    /**
     * Remove a document from a collection BY ID ONLY.
     * @params {String} _id - Id of the document in the database.
     * @params {String} collectionName - Collection to from from. 
     * @returns {Object}
     */

    async function removeOne(_id, collectionName) {
        try {
            const fileDB = await readFile(datasourceConfig.filePath, "utf-8");
            const data = JSON.parse(fileDB);
            delete data[collectionName][_id];
            await writeToFile(datasourceConfig.filePath, JSON.stringify(data, null, 2));
            
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
                message: `${e.message} || Does Collection (${collectionName}) or record Id (${_id}) exist?`,
                error: true
            }
        }
    }

    /**
     * Find all documents in a collection.
     * @params {String} collectionName - Collection to pull from. 
     * @returns {Object}
     */

    async function findAll(collectionName = "default") {
        try {
            const fileDB = await readFile(datasourceConfig.filePath, "utf-8");
            const data = JSON.parse(fileDB);
            return {
                data: Object.values(data[collectionName]),
                status: "ok",
                message: null,
                error: false
            }
        } catch(e) {
            return {
                data: [],
                status: "error",
                message: `${e.message} || Does Collection (${collectionName}) exist?`,
                error: true
            }
        }
    }

    /**
     * Find a document in a collection BY ID ONLY.
     * @params {String} _id - Id of the document. 
     * @params {String} collectionName - Collection to pull from. 
     * @returns {Object}
     */

    async function findOne(_id, collectionName = "default") {
        try {
            const fileDB = await readFile(datasourceConfig.filePath, "utf-8");
            const data = JSON.parse(fileDB);
            
            if (!data[collectionName][_id]) {
                throw new Error("NotFoundError");
            }
            
            return {
                data: [data[collectionName][_id]], 
                status: "ok",
                message: null,
                error: false
            };
            
        } catch(e) {
            return  {
                data: [],
                status: "error",
                message: `${e.message} || Does Collection (${collectionName}) and record Id (${_id}) exist?` ,
                error: true
            }
        }
    }

    /**
     * Creates a UUID for a document.
     * @params {String} customId - [optional] custom id for the document.
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
     * Drop a collection from the database.
     * @params {String} collectionName - Collection to drop. 
     * @returns
     */

    async function drop(collectionName) {
        delete fileDatastore[collectionName];
        await writeToFile(datasourceConfig.filePath, JSON.stringify(fileDatastore, null, 2));
        return {
            data: [],
            status: "ok",
            message: null,
            error: false
        }
    }
    
    /**
     * Closes an existing connection to the database.
     * @returns
     */
    async function close() {
    //This implementation does nothing as there is no database server connection.
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
        createUUID, //exported for unit tests ONLY
        close
    };
}

module.exports = JSONDatastore;
