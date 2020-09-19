/* IMPORTS **************************************************************** */
const Repository = require('./index.js');
const sqliteRepo = Repository({ 
  datasourceConfig: {
    databasePath: `./data/default.db`
  }
});

/* CONSTANTS **************************************************************** */
const testItemName = 'Indiana Pale Ale';
const testItemKind = 'ale'
const testItemUpdatedName = 'Indiana Pale Ale (Limited)';

/* MAIN **************************************************************** */

describe('Repository:SQLite Implementation', () => {
  let recordId;

  test('Create new record.', async() => {
    const result = await sqliteRepo.add({
      item: testItemName,
      kind: testItemKind
    });
    
    const record = result["data"][0];
    recordId = record._id;

    expect(Object.keys(record).includes('_id')).toEqual(true);
    expect(Object.keys(record).includes('_createdAt')).toEqual(true);
    expect(record._createdAt).toBeTruthy();
    expect(record._id).toBeTruthy();
    expect(Object.keys(record).length).toEqual(5);
  });
  
  test('Find all records in the datastore.', async() => {
    const result = await sqliteRepo.findAll();

    expect(Array.isArray(result.data)).toEqual(true);
    expect(result.data.length > 0).toEqual(true);
  });
  
  test('Find all records in the datastore from non-existing table.', async() => {
    const result = await sqliteRepo.findAll('doesnt_exist');

    expect(Array.isArray(result.data)).toEqual(true);
    expect(result.data.length === 0).toEqual(true);
    expect(result.error === true).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });

  test('Read a single record.', async() => {
    const result = await sqliteRepo.findOne(recordId);
    const record = result["data"][0];
    
    expect(record._id).toBeTruthy();
    expect(record._id).toEqual(recordId);
  });
  
  test('Read a single record form non-existing table.', async() => {
    const result = await sqliteRepo.findOne('doesnt_exist', 'nope');
    
    expect(result.error === true).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });

  test('Update a single record.', async() => {
    await sqliteRepo.updateOne(recordId, {
      item: testItemUpdatedName
    });
    const result = await sqliteRepo.findOne(recordId);
    const record = result["data"][0];

    expect(record._id === recordId).toEqual(true);
    expect(record.item === testItemUpdatedName).toEqual(true);
  });
  
  test('Update a single (non-existing) record.', async() => {
    const result = await sqliteRepo.updateOne('doesnt_exist', {
      fooBar: testItemUpdatedName
    }, 'nope');
    

    expect(result.error === true).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });

  test('Remove a single record.', async() => {
    const result = await sqliteRepo.removeOne(recordId);
    const record = await sqliteRepo.findOne(recordId);

    expect(result.data.length === 0).toEqual(true);
    expect(record.data.length === 0).toEqual(true);
  });
  
  test('Remove a single (non-existing) record.', async() => {
    const result = await sqliteRepo.removeOne("doesnt_exist", "nope");
    
    expect(result.data.length === 0).toEqual(true);
    expect(result.error === true).toEqual(true);
  });
  
  test('Create a UUID.', async() => {
    const result = await sqliteRepo.createUUID();

    expect(typeof(result) === 'string').toEqual(true);
  });

  test('Create a custom id.', async() => {
    const result = await sqliteRepo.createUUID('beerme!');

    expect(result === 'beerme!').toEqual(true);
  });

  test('Create a malformed record.', async() => {
    const result = await sqliteRepo.add(2);

    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(!Object.keys(result).includes('_id')).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
  });
  
  test('Create invalid record.', async() => {
    const result = await sqliteRepo.add({
      foo: 'bar',
      pickles: false,
      mayo: true
    });
    
    expect(Object.keys(result).includes('message')).toEqual(true);
    expect(typeof(result.message) === 'string').toEqual(true);
    expect(result.error === true).toEqual(true);

  });

  test('Drop a table.', async() => {
    const result = await sqliteRepo.drop('undefined_table');
    expect(result).toBeUndefined();
  });
  
  test('Close connection to the database.', async() => {
    const result = await sqliteRepo.close();
    
    expect(result.status === 'ok').toEqual(true);
    expect(result.error === false).toEqual(true);
  });
});
