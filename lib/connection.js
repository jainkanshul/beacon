var mysql = require('mysql2');

function Connection() 
{
const con = mysql.createConnection({
  host: 'beacondatabase.mysql.database.azure.com',
  user: "root_azure@beacondatabase",
  password: "Fujitsu@123",
  database: 'beacondatabase',
  port: 3306,
  ssl: true

});


con.connect(function(err) {
  if (err) throw err;
  /*Create a database named "mydb":*/

  //CREATE DATABASE IF NOT EXISTS DBName;
  con.query("CREATE DATABASE IF NOT EXISTS beacondatabase", function (err, result) {
    if (err) throw err;
    console.log("CREATE DATABASE IF NOT EXISTS BeaconDataBase");
  });
  con.query("USE beacondatabase", function (err, result) {
    if (err) throw err;
    console.log(result);
  });



   let createEmployeeDetail =  `create table if not exists employee(
    id int primary key auto_increment,
    beaconId varchar(255)not null,
    eName varchar(255)not null,
    eMobileNumber varchar(255),
    email varchar(255),
    eID varchar(255),
    status  TINYINT NULL


)`;

let GateWayLocation =  `create table if not exists gatewaylocationFiled(
  id int primary key auto_increment,
  gID varchar(255)not null,
  locationName varchar(255)not null
)`;


let createAttendence =  `create table if not exists AttendenceFinal(
  id int primary key auto_increment,
  beaconId varchar(255)not null,
  eInTime varchar(255)not null,
  eOutTime varchar(255)not null,
  locationID  varchar(255),
  Date varchar(255)
)`;

   // console.log(err.message);
 //var createAttendence = "DROP TABLE AttendenceFinal";


con.query(createEmployeeDetail, function(err, results, fields) {
  if (err) throw err;
    console.log("EmployeeDetail Table created if not exist ");

});

con.query(GateWayLocation, function(err, results, fields) {
  if (err) throw err;
    console.log("GateWayLocation Table created if not exist ");

});


con.query(createAttendence, function(err, results, fields) {
  if (err) throw err;
    console.log("createAttendence Table created if not exist ");

});
con.end(function (err) { 
  if (err) throw err;
  else  console.log('Done.') 
  });
});

this.acquire = function(callback) {
  
    const  con = mysql.createConnection({
      host: 'beacondatabase.mysql.database.azure.com',
      user: "root_azure@beacondatabase",
      password: "Fujitsu@123",
      database: 'beacondatabase',
      port: 3306,
      ssl: true
    
    });

    con.connect(function(err) {
      if (err) throw err;
      callback(con);
    });

  
};
 

}
module.exports = new Connection();


