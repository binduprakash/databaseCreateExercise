const settings = require("./settings"); // settings.json
const knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : settings.hostname,
    user : settings.user,
    password : settings.password,
    database : settings.database
  }
});

let first_name = process.argv[2];
let last_name = process.argv[3];
let birthdate = process.argv[4];

knex('famous_people')
  .insert({first_name, last_name, birthdate})
  .asCallback((err, result) => {
    if(err){
      return console.error('Insert failed');
    }
    console.log(`Inserted ${result.rowCount} rows!`);
  })
  .finally(() => {
    knex.destroy();
  })
