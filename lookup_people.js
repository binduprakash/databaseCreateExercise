const pg = require("pg");
const settings = require("./settings"); // settings.json

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
  console.log(`Found ${persons.length} person(s) by the name" ${search}`);
  for(let i = 0; i < persons.length; i++){
    console.log(`- ${i+1}: ${persons[i].first_name} ${persons[i].last_name}, born '${formatDateInYYYYMMDDFormat(persons[i].birthdate)}'`);
  }
}

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT * FROM famous_people WHERE first_name=$1", [search], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    printPersonInformation(search,result.rows);
    client.end();
  });
});