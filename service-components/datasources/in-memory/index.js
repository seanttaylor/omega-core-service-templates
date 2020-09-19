function defaultDatastore() {
  const datastore = {
    default: {
      "5db1de2c6b6517a970e47994": {
        foo: "bar",
        "_id": "5db1de2c6b6517a970e47994"
      }
    },
    widgets: {
      "5db1de2c6b6517a970e47994": {
        foo: "bar",
        "_id": "5db1de2c6b6517a970e47994"
      }
    },
    test_drop_collection: {
      
    }
  };

  /**
   * A a document to the database.
   * @params {String} data - document to add to the database.
   * @params {String} collectionName - Name of collection to add to.
   * @params {String} customId - An optional custom id to use for document lookup. 
   * @returns {Object}
   */

  function add(data, collectionName = "default", customId) {
    if (typeof(data) !== "object") {
      return Promise.resolve({
        data: [],
        status: "error",
        message: `Malformed record. Record should be of type [Object] but is ${typeof(data)} instead.`,
        error: true
      });
    }

    const _id = createUUID(customId);
    const record = Object.assign(data, {
      _id,
      _createdAt: new Date().toISOString(),
      _lastModified: null
    });

    if (datastore[collectionName]) {
      datastore[collectionName][_id] = record;
    } else {
      return Promise.resolve({
        data: [],
        status: "error",
        message: `Collection (${collectionName}) does NOT exist.`,
        error: true
      });
    }

    return Promise.resolve({
      data: [record],
      status: "ok",
      message: null,
      error: false
    });
  }

  /**
   * Update a document in the database BY ID ONLY.
   * @params {String} _id - Id of the document in the database.
   * @params {String} doc - Update document.
   * @params {String} collectionName - Collection to update. 
   * @returns {Object}
   */

  function updateOne(_id, doc, collectionName = "default") {
    if (datastore[collectionName] && datastore[collectionName][_id]) {
      datastore[collectionName][_id] = Object.assign(datastore[collectionName][_id], {
      ...doc,
      _lastModified: new Date().toISOString()
      });
      
      return Promise.resolve({
        data: [datastore[collectionName][_id]],
        status: "ok",
        message: null,
        error: false
      });
    } 
    return Promise.resolve({
      data: [],
      status: "error",
      message: `Collection (${collectionName}) or record _id (${_id}) does NOT exist.`,
        error: true
    });
  }

  /**
   * Remove a document from a collection BY ID ONLY.
   * @params {String} _id - Id of the document in the database.
   * @params {String} collectionName - Collection to from from. 
   * @returns {Object}
   */

  function removeOne(_id, collectionName = "default") {
    if (datastore[collectionName] && datastore[collectionName][_id]) {
      delete datastore[collectionName][_id];
      return Promise.resolve({
        data: [],
        status: "ok",
        message: null,
        error: false
      });
    }
    
    return Promise.resolve({
      data: [],
      status: "error",
      message: `Collection (${collectionName}) or record _id (${_id} does NOT exist.)`,
      error: true
    });
  }

  /**
   * Find all documents in a collection.
   * @params {String} collectionName - Collection to pull from. 
   * @returns {Object}
   */

  function findAll(collectionName = "default") {
    if (datastore[collectionName]) {
      return Promise.resolve({
        data: Object.values(datastore[collectionName]),
        status: "ok",
        message: null,
        error: false
      });
    } 
    
    return Promise.resolve({
      data: [],
      status: "error",
      message: `Collection (${collectionName}) does NOT exist.`,
      error: true
    });
  }

  /**
   * Find a document in a collection BY ID ONLY.
   * @params {String} _id - Id of the document. 
   * @params {String} collectionName - Collection to pull from. 
   * @returns {Object}
   */

  function findOne(_id, collectionName = "default") {
    if (datastore[collectionName] && datastore[collectionName][_id]) {
      return Promise.resolve({
        data: [datastore[collectionName][_id]],
        status: "ok",
        message: null,
        error: false
      });
    } else {
      return Promise.resolve({
        data: [],
        status: "error",
        message: `Collection (${collectionName}) or record _id (${_id}) does NOT exist.`,
        error: true
      });
    }
  }

  /**
   * Drop a collection from the database.
   * @params {String} collectionName - Collection to drop. 
   * @returns
   */

  function drop(collectionName) {
    if (datastore[collectionName]) {
      delete datastore[collectionName];
      return Promise.resolve({
        data: [],
        status: "ok",
        message: null,
        error: false
      });
    }
    
    return Promise.resolve({
      data: [],
      status: "error",
      message: `Collection (${collectionName}) does NOT exist.`,
      error: true
    });
  }
  
  /**
   * Closes an existing connection to the database.
   * @returns
   */
  
  function close() {
    //This implementation does nothing as there is no database server connection.
     return Promise.resolve({
      data: [],
      status: "ok",
      message: null,
      error: false
    });
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

module.exports = defaultDatastore;
