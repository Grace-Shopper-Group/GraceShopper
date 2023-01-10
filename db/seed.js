const client = require('./client');
const { rebuildDB, testDB} = require('./seedData');

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());