## SQLite3 Repository

This module is intended for use with the `@omegalabs/repo-core` package (shortened as `repo-core` below.) When used with the `repo-core` package this module provides an implementation of the `repo-core` interface for a SQLite3 database. 


#### Installation and Use

1. Do an `npm install @omegalabs/repo-sqlite` (shortened as `repo-sqlite` below) to install the package on your local machine. 
2. Require the package in your project along with the `@omegalabs/repo-core` package.
3. Instantiate the `repo-sqlite` package with options (see Configuration Options below.)
4. Instantiate the `repo-core` package, providing the `repo-sqlite` as an argument.

_For detailed explanation of the API the `repository-core` documentation._

#### Tests

Run the unit tests for `repo-sqlite` with the `npm test` command. The test suite will produce a report afer the test run is complete.

#### Example Usage 

```
const config = {
    datasourceConfig: {
        databasePath = './path/to/database/database.db'
    },
    connectTimeout: 30
};
const sqliteRepo = require('@seanttaylor/sqlite-repo)(config);
const Repository = require('@seanttaylor/repository-core)
const beerRepo = Repository(sqliteRepo);
const beer = {
    name: 'Indiana Pale Ale',
    kind: 'ale'
}

const result = await beerRepo.add(beer, 'beers_table');
/*{
    error: null,
    status: 'ok',
    data: [
        {
            _id: '5e2f99c9fa38672ff424622b'
            name: 'Indiana Pale Ale',
            kind: 'ale',
            _createdAt: '2020-01-28T02:19:33Z'
        }
    ]
}*/

const searchResult = await beerRepo.findOne('5e2f99c9fa38672ff424622b', 'beers_table);
/*
    Same output as above.
*/

```

#### Configuration Options

Fields and acceptable values for the options object of `repo-sqlite`.

|    option    | type   |       description                                    |
|:------------:|--------|:----------------------------------------------------:|
| `datasourceConfig` | object | Configuration options for the datasource. |

##### Datasource Configuration

|    option    | type   |       description                                    |
|:------------:|--------|:----------------------------------------------------:|
| `databasePath` | string | Path to a *.db file that will persist the SQLite3 database. Defaults to ./default.db. |
