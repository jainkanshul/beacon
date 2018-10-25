var mqtt = require('mqtt');
var express = require('express');

var app = express();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connection = require('./connection');
var dateFormat = require('dateformat');
var securefile;
var bodyParser = require('body-parser');
var moment = require('moment-timezone');
var system_timezone = require('system-timezone');
//var sendgrid = require('@sendgrid/mail')('azure_33e53e7a844a2d56c18cedf0587ae40a', 'test@123');


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('');

// var email = new sendgrid.Email({
//     to: 'anshul.jainsm@gmail.com',
//     from: 'anshul.k.jain@in.fujitsu.com',
//     subject: 'test mail',
//     text: 'This is a sample email message.'
// });

// sendgrid.send(email, function(err, json){
//     if(err) { return console.error(err); }
//     console.log(json);
// });

var net = require('net')
var mqttCon = require('mqtt-connection')
var server = new net.Server()
 
// This is a slow, sync call.  It would be best to call it once at boot and cache the response
// If a timezone cannot be determined, an Error will be thrown.

var arrayOfRegisterID = [];
var    day;
const PORT = process.env.PORT || 5000



app.use(bodyParser.urlencoded({ extended: false }))

io.on('connection', function(clientSocket){
    console.log('a user connected');

    clientSocket.on('disconnect', function(){

    });


    clientSocket.on("exitUser", function(clientNickname){
        
    });




    clientSocket.on("connectUser", function(clientNickname) {
        var message = "User " + clientNickname + " was connected.";
        console.log(message);
    });


});


app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));






app.get('/', function(req, res){
    res.sendFile(__dirname + "/Server.html");
});

app.get('/Registration', function(req, res){
    res.set({
		'Access-Control-Allow-Origin' : '*'
	});
    return res.redirect('/public/index.html');

});


app.get('/GatewayRegistration', function(req, res){
    res.set({
		'Access-Control-Allow-Origin' : '*'
	});
    return res.redirect('/public/gatewayRegister.html');

});


app.post('/inserIntoGateway', function (req, res) 
{

    var values = [[req.body.gID, req.body.locationName]]; 

    connection.acquire(function(con)
    {
        var sqlse = "SELECT *FROM gatewaylocationFiled where gID = ?";
        con.query(sqlse,[req.body.gID] , function(err, result)
        {   
          if (err) throw err;
          con.end(function (err) { 
            if (err) throw err;
            else  console.log('Done.') 
            });

          if(result.length)
          {
            return res.redirect('/public/error.html');

            }
          else
          {
            
            
            var sql = "INSERT INTO gatewaylocationFiled (gID, locationName) VALUES ?";

            con.query(sql,[values] , function(err, rows, fields)
                  {   
                    if (err) throw err;

                      
                        return res.redirect('/public/successGateway.html');


                  })
            
          }
           
        })
        
                    });

});


app.get('/WebEmployeeList', function(req, res){
    res.set({
		'Access-Control-Allow-Origin' : '*'
	});
    return res.redirect('/public/Sample.html');

});


app.get('/changeStatusOfBeacon', function(req, res){

//     connection.acquire(function(con) 
//     {

//     var sqlUpdate = "UPDATE employee SET status = ? WHERE beaconId =?";
//     console.log(sqlUpdate,req.query.beaconId)
//     con.query(sqlUpdate, [req.query.status,req.query.beaconId],function (err, result) {
//       if (err) throw err;
//     res.send("ok");
//     });
      
      
//  })

day =  moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

 var dayTime = moment().tz('Asia/Kolkata').format('hh:mm a');

connection.acquire(function(con) 
{
   

    if(req.query.status ==1)

    {
          var sql = "INSERT INTO punches (intime, outtime, Date, locationID, beaconId) VALUES ?";
          var values = [  
              [dayTime, '-', day,req.query.gId ,req.query.beaconId]
              ]; 
      

          con.query(sql,[values] , function(err, rows, fields)
            {     
              if (err) throw err;
                  console.log ("Inserted succesfully",req.query.beaconId);
                  
                  con.end(function (err) { 
                    if (err) throw err;
                    else  console.log('Done.') 
                    });

                    console.log('Inserted succesfully.') 
            
           })

        }
        else
        {

            var sqlUpdate = "UPDATE punches SET outtime = ? WHERE beaconId =? and outtime =?";
          
            con.query(sqlUpdate, [dayTime, req.query.beaconId, '-'],function (err, result) {
              if (err) throw err;
             
              console.log(result.affectedRows + " record(s) updated");
              con.end(function (err) { 
                  if (err) throw err;
                  else  console.log('Done.') 
                  });
                  console.log('updated') 

  
              
            });
        }

  
});
 

   
          connection.acquire(function(con) 
          {
            // var sqlUpdate = "UPDATE employee SET status = ? WHERE beaconId =?";
            // con.query(sqlUpdate, [req.query.status,req.query.beaconId],function (err, result) {
            //     if (err) throw err;
            //   });
            //   console.log(req.query.beaconId);
            //   console.log(req.query.status);
              var sqlselect = "SELECT * FROM AttendenceFinal WHERE beaconId =? and Date =?";
              con.query(sqlselect,[req.query.beaconId,day], function (err, result)
          {     
         if (err) throw err;

         if(result.length>0)
      {

       

          var sqlUpdate = "UPDATE AttendenceFinal SET eOutTime = ? , locationID = ?  WHERE beaconId =? and Date =?";
          
          con.query(sqlUpdate, [dayTime,req.query.gId ,req.query.beaconId,day],function (err, result) {
            if (err) throw err;
           
            console.log(result.affectedRows + " record(s) updated");
            con.end(function (err) { 
                if (err) throw err;
                else  console.log('Done.') 
                });

                res.send("updated");

            
          });

      }

      else
      {
          var sql = "INSERT INTO AttendenceFinal (beaconId, locationID, Date, eInTime, eOutTime) VALUES ?";
          var values = [  
              [req.query.beaconId, req.query.gId, day,dayTime, dayTime]
              ]; 
      

          con.query(sql,[values] , function(err, rows, fields)
            {     
              if (err) throw err;
                  console.log ("Inserted succesfully",req.query.beaconId);

                  let enter =   req.query.empName + ' enter to the office at ' +dayTime;
                //  Vishal.Goyal@in.fujitsu.com
                  const msg = {
                    to: 'Vishal.Goyal@in.fujitsu.com',
                    from: 'noreply@in.fujitsu.com',
                  subject: 'User enter to the office',
                  text: enter
                };
                sgMail.send(msg);
                  
                  con.end(function (err) { 
                    if (err) throw err;
                    else  console.log('Done.') 
                    });
                  res.send("Inserted succesfully");

            
           })

      }
  })
   
  

 
    });

  
      


  


});




app.post('/employeeRegistration', function (req, res) {


    var values = [[req.body.beaconId, req.body.eName, req.body.eID, req.body.eMobileNumber,req.body.email]]; 

    connection.acquire(function(con)
    {
        var sqlse = "SELECT *FROM employee where beaconId = ?";
        con.query(sqlse,[req.body.beaconId] , function(err, result)
        {   
          if (err) throw err;

          if(result.length)
          {
            con.end(function (err) { 
                if (err) throw err;
                else  console.log('Done.') 
                });
            return res.redirect('/public/success.html');

            }
          else
          {
            
            
            var sql = "INSERT INTO employee (beaconId, eName, eID, eMobileNumber, email) VALUES ?";

            con.query(sql,[values] , function(err, rows, fields)
                  {   
                    if (err) throw err;


                    arrayOfRegisterID.push(req.body.beaconId,);

                    con.end(function (err) { 
                        if (err) throw err;
                        else  console.log('Done.') 
                        });
                        return res.redirect('/public/success.html');


                  })
            
          }
           
        })
       
       
                    });

});


app.post('/gatewayRegistration', function (req, res) {

    console.log(req.body.beaconId);
    console.log(req.body.eName);
    console.log(req.body.eID);




    var values = [[req.body.gID, req.body.locationName]]; 

    connection.acquire(function(con)
    {
        var sql = "INSERT INTO gatewaylocationFiled (gID, locationName) VALUES ?";

                con.query(sql,[values] , function(err, rows, fields)
                      {   
                        if (err) throw err;
                        arrayOfRegisterID.push.apply(arrayOfRegisterID, result);
                        con.end(function (err) { 
                            if (err) throw err;
                            else  console.log('Done.') 
                            });
                          res.send({
                            'status': 'OK'
                         });
                      })
                    
                    });

});


app.get('/getemployeeHistory', function(req, res){

    connection.acquire(function(con)
    {

    //   var sqlselect = "SELECT employee.beaconId,employee.eName,employee.eMobileNumber, employee.eID , AttendenceFinal.eInTime, AttendenceFinal.eOutTime,AttendenceFinal.locationID,AttendenceFinal.Date FROM employee JOIN AttendenceFinal ON employee.beaconId = AttendenceFinal.beaconId";

    var sqlselect =  "SELECT gatewaylocationFiled.locationName, AttendenceFinal.eInTime, AttendenceFinal.Date, AttendenceFinal.eOutTime FROM gatewaylocationFiled JOIN AttendenceFinal ON gatewaylocationFiled.gID = AttendenceFinal.locationID  where AttendenceFinal.beaconId = ?" 

      //  var sqlselect = "SELECT * FROM AttendenceFinal WHERE beaconId =?";
        console.log(sqlselect, req.query.beaconId)

        con.query(sqlselect,[req.query.beaconId], function (err, result)
{     
if (err) throw err;
if(result.length>0)
{
    con.end(function (err) { 
        if (err) throw err;
        else  console.log('Done.') 
        });


res.send(result)
}
                else
                {
                    con.end(function (err) { 
                        if (err) throw err;
                        else  console.log('Done.') 
                        });
            
        
                    res.send([]);
                }
    

            })




           
    

        });

});


app.post('/getemployeeDetail', function(req, res){

    connection.acquire(function(con)
    {

    //   var sqlselect = "SELECT employee.beaconId,employee.eName,employee.eMobileNumber, employee.eID , AttendenceFinal.eInTime, AttendenceFinal.eOutTime,AttendenceFinal.locationID,AttendenceFinal.Date FROM employee JOIN AttendenceFinal ON employee.beaconId = AttendenceFinal.beaconId";


    var sqlselect =  "SELECT gatewaylocationFiled.locationName, AttendenceFinal.eInTime, AttendenceFinal.eOutTime FROM gatewaylocationFiled JOIN AttendenceFinal ON gatewaylocationFiled.gID = AttendenceFinal.locationID  where AttendenceFinal.beaconId = ? and AttendenceFinal.Date = ?" 

      //  var sqlselect = "SELECT * FROM AttendenceFinal WHERE beaconId =?";
        console.log(sqlselect, req.body.beaconId)

        con.query(sqlselect,[req.body.beaconId,day], function (err, result)
{     
if (err) throw err;
con.end(function (err) { 
    if (err) throw err;
    else  console.log('Done.') 
    });
if(result.length>0)
{
                
res.send(result)
}
                else
                {

                    res.send([]);
                }
    

            })




    
    
        
    

        });

});



app.get('/getemployeeListWeb', function(req, res){

    connection.acquire(function(con)
    {
        

     //   var sqlselect = "SELECT employee.beaconId,employee.eName, AttendenceFinal.eInTime, AttendenceFinal.eOutTime,AttendenceFinal.locationID,AttendenceFinal.Date FROM employee JOIN AttendenceFinal ON employee.beaconId = AttendenceFinal.beaconId";
       // var sqlselect = "SELECT * FROM employee";
    

    //    var sqlselect =       `SELECT  employee.eName, employee.beaconId, AttendenceFinal.eInTime, AttendenceFinal.eOutTime,   AttendenceFinal.date, gatewaylocationFiled.locationName FROM employee 
	// LEFT OUTER JOIN AttendenceFinal ON
	// 	AttendenceFinal.beaconId=employee.beaconId
	// LEFT OUTER JOIN gatewaylocationFiled ON
    //     gatewaylocationFiled.gID=AttendenceFinal.locationID Where AttendenceFinal.date = ?`
        

    var sqlselect =   `SELECT 
    employee.eName, employee.beaconId,COALESCE(gatewaylocationFiled.locationName, '') as locationName , COALESCE(gatewaylocationFiled.a.eInTime, '') as eInTime , COALESCE(gatewaylocationFiled.a.eOutTime, '') as eOutTime ,COALESCE (a.Date,'')  as Date  FROM  employee
    LEFT JOIN 
       (
           SELECT   -- <----- this
          AttendenceFinal.eInTime, AttendenceFinal.eOutTime, AttendenceFinal.locationID , AttendenceFinal.beaconId,AttendenceFinal.Date  FROM AttendenceFinal
           WHERE AttendenceFinal.Date = ?
       ) AS a
   ON a.beaconId=employee.beaconId
       LEFT JOIN gatewaylocationFiled ON
           gatewaylocationFiled.gID=a.locationID` 


           


//         var sqlselect =   `SELECT 
// *FROM  employee
// LEFT JOIN 
//     (
//         SELECT   -- <----- this
//         *FROM AttendenceFinal
//         WHERE AttendenceFinal.Date = ?
//     ) AS a
// ON a.beaconId=employee.beaconId
//     LEFT JOIN gatewaylocationFiled ON
// 		gatewaylocationFiled.gID=a.locationID`


            con.query(sqlselect,[day], function (err, result)
        
            {

                if (err) throw err;
                if(result.length>0)
                {
    res.send(result);
                }
                else
                {

                    res.send([]);
                }
    

            })


            con.end(function (err) { 
                if (err) throw err;
                else  console.log('Done.') 
                });

    
    

    

        });

});


app.get('/getemployeeList', function(req, res){

    connection.acquire(function(con)
    {
        

        //var sqlselect = "SELECT employee.beaconId,employee.eName,employee.eMobileNumber, employee.eID , AttendenceFinal.eInTime, AttendenceFinal.eOutTime,AttendenceFinal.locationID,AttendenceFinal.Date FROM employee JOIN AttendenceFinal ON employee.beaconId = AttendenceFinal.beaconId";
        var sqlselect = "SELECT * FROM employee";
    
            con.query(sqlselect, function (err, result)
        
            {

                if (err) throw err;

                con.end(function (err) { 
                    if (err) throw err;
                    else  console.log('Done.') 
                    });
                if(result.length>0)
                {


    res.send(result);

                }
                else
                {

                    res.send([]);
                }
    

            })




    
           

    

        });

});


app.get('/getattendance', function(req, res){

    connection.acquire(function(con)
    {

       
            var sqlselect = "SELECT * FROM AttendenceFinal";
    
            con.query(sqlselect, function (err, result)
        
            {

                if (err) throw err;

                con.end(function (err) { 
                    if (err) throw err;
                    else  console.log('Done.') 
                    });
                if(result.length>0)
                {


    res.send(result);

                }
    

            })

            


    });
    

    



});

http.listen(PORT, function(){
    console.log(`Listening on ${ PORT }`);
});



fs.readFile('./lib/secure.json', 'utf-8', function (err, data) {
    if (err) throw err;
  

day =  moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

var dayTime = moment().tz('Asia/Kolkata').format('hh:mm a');



   // America/Los_Angeles
    securefile = JSON.parse(data);
    var isPerformingOperation = false;
//     var client = mqtt.connect(securefile.host, securefile);
// client.on('connect', function() { // When connected
//     console.log('connected');

//     connection.acquire(function(con)
//     {

       
//             var sqlselect = "SELECT beaconID FROM employee";

//             con.query(sqlselect, function (err, result)
//             {

//                 if (err) throw err;
//                 if(result.length>0)
//                 {
//                     for(var p = 0 ; p<result.length ; p++)
//                     {
//                         console.log(([result[p]["beaconID"]]));
//                         arrayOfRegisterID.push.apply(arrayOfRegisterID,[result[p]["beaconID"]])

//                     }


//                 }
//                 else
//                 {
   

//                 }
    

//             })

//         });


    

//     client.subscribe(securefile.subscribefile, function () {
//       // when a message arrives, do something with it
//       client.on('message', function (topic, message, packet) {
//       var messageres =  "" + message +  "";
//       messageres=    JSON.parse(messageres)
  

// day =  moment().tz('Asia/Kolkata').format('YYYY-MM-DD');

// var dayTime = moment().tz('Asia/Kolkata').format('hh:mm a');
// // var dayTime=dateFormat(dateHere, "h:MM TT");
//     //   day=dateFormat(dateHere, "yyyy-mm-dd");

//         if(!isPerformingOperation)
//         {
//          if(messageres.length>0)
//           {
//    if ("sourceId" in messageres[0])
//        {
//             var pending = messageres.length-1;
//             isPerformingOperation =true;
//             fireQuery(messageres.length-1);
//             function  fireQuery(pending)
//                 {
//         console.log(messageres[pending]["trackingId"]);
//             if(arrayOfRegisterID.includes(messageres[pending]["trackingId"]))
//            {
//            if(pending>=0)
//            {
//             if("sourceId" in messageres[pending] )
//             {
//                      console.log(messageres[pending]["sourceId"]); //GateWayID
//                      console.log(messageres[pending]["trackingId"]); // BeaconID
//                      console.log(day);

//                      connection.acquire(function(con) 
//                      {
//                          var sqlselect = "SELECT * FROM AttendenceFinal WHERE beaconId =? and Date =?";
//                          console.log(sqlselect, messageres[pending]["trackingId"])
//                          con.query(sqlselect,[messageres[pending]["trackingId"],day], function (err, result)
//                      {     
//                     if (err) throw err;
//                     console.log(result);
//                     if(result.length>0)
//                  {
     
//                      var sqlUpdate = "UPDATE AttendenceFinal SET eOutTime = ? , locationID = ?  WHERE beaconId =? and Date =?";
     

//                      console.log(sqlUpdate,dayTime,messageres[pending])
      
                     
//                      con.query(sqlUpdate, [dayTime,messageres[pending]["sourceId"] ,messageres[pending]["trackingId"],day],function (err, result) {
//                        if (err) throw err;
//                        if(0==pending)
//                        {
     
//                          isPerformingOperation = false;
//                        }
//                        else
//                        {
//                        --pending;
                      
//                        console.log(result.affectedRows + " record(s) updated");
     
//                        return fireQuery(pending);
     
//                        }
//                      });
     
//                  }
     
//                  else
//                  {
//                      var sql = "INSERT INTO AttendenceFinal (beaconId, locationID, Date, eInTime, eOutTime) VALUES ?";
//                      var values = [  
//                          [messageres[pending]["trackingId"], messageres[pending]["sourceId"], day , dayTime, dayTime]
//                          ];  
//                      con.query(sql,[values] , function(err, rows, fields)
//                        {     
//                          if (err) throw err;
//                          if(0==pending)
//                          {
//                            isPerformingOperation = false;
//                          }
//                          else
//                          {
//                              console.log ("Inserted succesfully",  messageres[pending]["trackingId"]);
//                          --pending;
//                          return fireQuery(pending);
//                          }
//                       })
     
//                  }
//              })
              
         
      
     
            
//                });
         
             
                 
     
     
             
//          }
//      }
//      else
//      {

//         --pending;

//         if(pending<0)
//         {

//             isPerformingOperation = false;

//         }
//         if(0==pending)
//         {

//           isPerformingOperation = false;
//         }
//         return fireQuery(pending);
//      }
     

//      }
//      else
//      {
//         --pending;

//         if(pending<0)
//         {

//             isPerformingOperation = false;

//         }
//         else
//         {
//         if(0==pending)
//         {

//           isPerformingOperation = false;
//         }
//         fireQuery(pending);


//     }


//      }

 
//                 }



     
//     }

// }
// else
// {
//     isPerformingOperation = false;

// }
// }



          
//       });
//   });
//     // subscribe to a topic
 
//     // publish a message to a topic
   

// });


// client.on('error', function(err) {
//   console.log(err);
// });

//});
});




