'use strict';

const {fetchPaginatedGHResults} = require('./github-api-helpers') 

const url = process.argv[2];

Promise.resolve(fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN)).then(response => {
    console.log('return', response);
})

process.exit(0)
