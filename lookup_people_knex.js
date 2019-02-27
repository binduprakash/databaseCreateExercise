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

let search = process.argv[2];

function formatDateInYYYYMMDDFormat(date) {
   let month = date.getMonth() + 1;
   let day = date.getDate();
   let year = date.getFullYear();
   if (month < 10) {
      month = '0' + month;
   }
   if (day < 10){
      day = '0' + day;
   }
   return `${year}-${month}-${day}`;
}

function printPersonInformation(search, persons){
  console.log("Searching...");
  console.log(`Found ${persons.length} person(s) by the name '${search}'`);
  for(let i = 0; i < persons.length; i++){
    console.log(`- ${i+1}: ${persons[i].first_name} ${persons[i].last_name}, born '${formatDateInYYYYMMDDFormat(persons[i].birthdate)}'`);
  }
}

knex.select()
  .from('famous_people')
  .where('first_name', search)
  .asCallback((err, rows) => {
    if(err){
      return console.error('Select query failed');
    }
    printPersonInformation(search, rows);
  })
  .finally(() => {
    knex.destroy();
  })
