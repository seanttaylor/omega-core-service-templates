/* IMPORTS **************************************************************** */
const Repository = require('./index.js');
const inMemoryRepo = Repository();

/* CONSTANTS **************************************************************** */
const testItemName = 'Indiana Pale Ale';
const testItemKind = 'ale'
const testItemUpdatedName = 'Indiana Pale Ale (Limited)';

/* MAIN **************************************************************** */

describe('Repository:In-Memory Implementation', () => {
  let recordId;
  
  test('Create new record.', async() => {
    const result = await inMemoryRepo.add({
      name: testItemName,
      kind: testItemKind
    });
    const record = result.data[0];
    recordId = record._id;
  
    expect(Object.keys(record).includes('_id')).toEqual(true);
    expect(Object.keys(record).includes('_createdAt')).toEqual(true);
    expect(Object.keys(record).includes('_lastModified')).toEqual(true);

    expect(record._createdAt).toBeTruthy();
    expect(record._id).toBeTruthy();
    expect(Object.keys(record).length).toEqual(5);
  });

  test('Find all records in the datastore.', async() => {
    const result = await inMemoryRepo.findAll();
    
    expect(Array.isArray(result.data)).toEqual(true);
    expect(result.data.length > 0).toEqual(true);
  });

  test('Read a single record.', async() => {
    const result = await inMemoryRepo.findOne(recordId);
    const record = result.data[0];
    
    expect(record._id).toBeTruthy();
    expect(record._id).toEqual(recordId);
  });

  test('Update a single record.', async() => {
    const result = await inMemoryRepo.updateOne(recordId, {
      name: testItemUpdatedName
    });
    const record = result.data[0];

    expect(record._id === recordId).toEqual(true);
    expect(record.name === testItemUpdatedName).toEqual(true);
    expect(record._lastModified).toBeTruthy();
  });

  test('Remove a single record.', async() => {
    const result = await inMemoryRepo.removeOne(recordId);
    expect(result.data.length === 0).toEqual(true);
  });

  test('Create a UUID.', async() => {
    const result = await inMemoryRepo.createUUID();

    expect(typeof(result) === 'string').toEqual(true);
  });

  test('Create a custom id.', async() => {
    const result = await inMemoryRepo.createUUID('beerme!');

    expect(result === 'beerme!').toEqual(true);
  });

  test('Create a malformed record.', async() => {
    const result = await inMemoryRepo.add(2);

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });

  test('Create a record in a non-existing collection.', async() => {
    const result = await inMemoryRepo.add({
      name: "Bleach Blonde Ale",
      kind: "ale"
    }, "undefined_table");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Update a record in a non-existing collection.', async() => {
    const result = await inMemoryRepo.updateOne("foo", {
      name: "Bleach Blonde Ale",
      kind: "ale"
    }, "undefined_collection");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Remove a record in a non-existing collection.', async() => {
    const result = await inMemoryRepo.removeOne("foo", "undefined_collection");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Find all records in a non-existing collection.', async() => {
    const result = await inMemoryRepo.findAll("undefined_collection");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Find a single record in a non-existing collection.', async() => {
    const result = await inMemoryRepo.findOne("foo","undefined_collection");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });

  test('Drop a collection.', async() => {
    const result = await inMemoryRepo.drop('test_drop_collection');
    
    expect(result.data.length === 0).toEqual(true);
    expect(result.status === "ok").toEqual(true);
    
  });
  
  test('Drop a non-existing collection.', async() => {
    const result = await inMemoryRepo.drop("undefined_collection");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Find all records in a dropped (non-existing) collection.', async() => {
    const result = await inMemoryRepo.findAll("test_drop_collection");

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(result.status === "error").toEqual(true);
    expect(result.error).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Close a database connection', async() => {
    const result = await inMemoryRepo.close();
    expect(result.data.length === 0).toEqual(true);
    expect(result.status === "ok").toEqual(true);
  });

  

});
