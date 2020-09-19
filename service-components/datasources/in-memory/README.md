## In-Memory Repository

This module is intended for use with the `omega-repository-core` package. When used with the `omega-repository-core` package this module provides an implementation of the `omega-repository-core` interface for a JSON file-based database. 


#### Installation and Use

1. Do an `npm install @seanttaylor/omega-repo-inmemory` to install the package on your local machine. 
2. Require the package in your project along with the  `@seanttaylor/omega-repository-core` package.
3. Instantiate the `omega-repo-inmemory` package with options (see Configuration Options below.)
4. Instantiate the `omega-repository-core` package, providing the `omega-repo-inmemory` as an argument.

_For detailed explanation of the API see the `repository-core` documentation._

#### Tests

Run the unit tests for `omega-repo-inmemory` with the `npm test` command. The test suite will produce a report afer the test run is complete.

#### Example Usage 

```
const inMemoryRepo = require('@seanttaylor/omega-repo-inmemory)();
const Repository = require('@seanttaylor/omega-repository-core)
const beerRepo = Repository(inMemoryRepo);
const beer = {
    name: 'Indiana Pale Ale',
    kind: 'ale'
}

const result = await beerRepo.add(beer, 'beers_collection');
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

Fields and acceptable values for the options object of `omega-repo-inmemory`.

|  option  | type   | default     |             description             |
|:--------:|--------|-------------|:-----------------------------------:|
|  |  |  | Currently no configuration options available for this repo.|

