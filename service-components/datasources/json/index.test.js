/* IMPORTS **************************************************************** */
const Repository = require('./index.js');
const jsonRepo = Repository({
  datasourceConfig: {
    filePath: `${__dirname}/data.json`
  }
});

/* CONSTANTS **************************************************************** */
const testItemName = 'Indiana Pale Ale';
const testItemKind = 'ale'
const testItemUpdatedName = 'Indiana Pale Ale (Limited)';

/* MAIN **************************************************************** */


describe('Repository:JSON File-based Implementation', () => {
  let recordId;
  
  test('Create new record.', async() => {
    const result = await jsonRepo.add({
      name: testItemName,
      kind: testItemKind
    });
    const record = result["data"][0];
    recordId = record["_id"];

    expect(Object.keys(record).includes("_id")).toEqual(true);
    expect(Object.keys(record).includes("_createdAt")).toEqual(true);
    expect(Object.keys(record).includes("_lastModified")).toEqual(true);
  
    expect(record._id).toBeTruthy();
    expect(record._createdAt).toBeTruthy();
    expect(Object.keys(record).length).toEqual(5);
  });

  test('Find all records in the datastore.', async() => {
    const result = await jsonRepo.findAll();
    
    expect(Array.isArray(result["data"])).toEqual(true);
    expect(result["status"] === "ok").toEqual(true);
    expect(result["error"] === false).toEqual(true);
    expect(result["data"]["length"] > 0).toEqual(true);
  });

  test('Find a single record.', async() => {
    const result = await jsonRepo.findOne(recordId);
    const record = result["data"][0];
    
    expect(record._id).toBeTruthy();
    expect(record._id).toEqual(recordId);
  });

  test('Update a single record.', async() => {
    const result = await jsonRepo.updateOne(recordId, {
      name: testItemUpdatedName
    });
    const record = result["data"][0];

    expect(record._id === recordId).toEqual(true);
    expect(record.name === testItemUpdatedName).toEqual(true);
  });

  test('Remove a single record.', async() => {
    const result = await jsonRepo.removeOne(recordId, "default");
    expect(Object.keys(result.data).length === 0).toEqual(true);
    
  });
  
  test('Find a deleted record .', async() => {
    const result = await jsonRepo.findOne(recordId);

    expect(result.data.length === 0).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error === true).toEqual(true);
  });

  test('Create a UUID.', async() => {
    const result = await jsonRepo.createUUID();

    expect(typeof(result) === 'string').toEqual(true);
  });

  test('Create a custom id.', async() => {
    const result = await jsonRepo.createUUID('beerme!');

    expect(result === 'beerme!').toEqual(true);
  });

  test('Create a malformed record.', async() => {
    const result = await jsonRepo.add(2);

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error === true).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });

  test('Create a record in a non-existing collection.', async() => {
    const result = await jsonRepo.add({
      name: "Bleach Blonde Ale",
      kind: "ale"
    }, "undefined_collection");

    expect(Object.keys(result).includes("message")).toEqual(true);
    expect(!Object.keys(result).includes("_id")).toEqual(true);
    expect(result.error === true).toEqual(true);
    expect(result.status === "error").toEqual(true);
  });
  
  test('Update a single record in a non-existing collection.', async() => {
    const result = await jsonRepo.updateOne(recordId, {
      name: testItemUpdatedName
    }, "undefined_collection");

    expect(result.data.length === 0).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error === true).toEqual(true);
  });
  
  test('Find a record in a non-existing collection.', async() => {
    const result = await jsonRepo.findOne("foo", "undefined_collection");

    expect(Object.keys(result).includes("message")).toEqual(true);
    expect(!Object.keys(result).includes("_id")).toEqual(true);
    expect(result.error === true).toEqual(true);
    expect(result.status === "error").toEqual(true);
  });
  
  test('Find all records in a non-existing collection.', async() => {
    const result = await jsonRepo.findAll("undefined_collection");

    expect(Array.isArray(result.data)).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error === true).toEqual(true);
    expect(result.data.length === 0).toEqual(true);
  });
  
  test('Remove a single record from a non-existing collection.', async() => {
    const result = await jsonRepo.removeOne(recordId);
    
    expect(Object.keys(result).includes("message")).toEqual(true);
    expect(result.error === true).toEqual(true);
    expect(result.status === "error").toEqual(true);
  });

  test('Drop a collection.', async() => {
    const result = await jsonRepo.drop("drop_collection");
    expect(result.data.length === 0).toEqual(true);
  });
  
  test('Drop a non-existing collection.', async() => {
    const result = await jsonRepo.drop("undefined_collection");
    expect(result.data.length === 0).toEqual(true);
  });
  
  test('Close connection to the datastore.', async() => {
    const result = await jsonRepo.close();
    expect(result.data.length === 0).toEqual(true);
    expect(result.status).toEqual("ok");
    expect(result.error === false).toEqual(true);
  });

});
