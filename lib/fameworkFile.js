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


app.post('/inserIntoGateway', function (req, res) {


    var values = [[req.body.gID, req.body.locationName]]; 

    connection.acquire(function(con)
    {
        var sqlse = "SELECT *FROM gatewaylocationFiled where gID = ?";
        con.query(sqlse,[req.body.gID] , function(err, result)
        {   
          if (err) throw err;

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

    connection.acquire(function(con) 
    {

    var sqlUpdate = "UPDATE employee SET status = ? WHERE beaconId =?";

    console.log(sqlUpdate,req.query.beaconId)

    con.query(sqlUpdate, [req.query.status,req.query.beaconId],function (err, result) {
      if (err) throw err;
    res.send("ok");
    });
      
      
 })


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
            return res.redirect('/public/success.html');

            }
          else
          {
            
            
            var sql = "INSERT INTO employee (beaconId, eName, eID, eMobileNumber, email) VALUES ?";

            con.query(sql,[values] , function(err, rows, fields)
                  {   
                    if (err) throw err;


                    arrayOfRegisterID.push(req.body.beaconId,);

                      
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
                
res.send(result)
}
                else
                {

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
    var dateHere =     new Date()

    day=dateFormat(dateHere, "yyyy-mm-dd");

    securefile = JSON.parse(data);
    var isPerformingOperation = false;
    var client = mqtt.connect(securefile.host, securefile);
client.on('connect', function() { // When connected
    console.log('connected');

    connection.acquire(function(con)
    {

       
            var sqlselect = "SELECT beaconID FROM employee";

            con.query(sqlselect, function (err, result)
            {

                if (err) throw err;
                if(result.length>0)
                {
                    for(var p = 0 ; p<result.length ; p++)
                    {
                        console.log(([result[p]["beaconID"]]));
                        arrayOfRegisterID.push.apply(arrayOfRegisterID,[result[p]["beaconID"]])

                    }


                }
                else
                {
   

                }
    

            })

        });




    client.subscribe(securefile.subscribefile, function () {
      // when a message arrives, do something with it
      client.on('message', function (topic, message, packet) {
      var messageres =  "" + message +  "";
      messageres=    JSON.parse(messageres)
      var dayTime=dateFormat(dateHere, "h:MM TT");
      dateHere =     new Date()
      day=dateFormat(dateHere, "yyyy-mm-dd");

        if(!isPerformingOperation)
        {
         if(messageres.length>0)
          {
   if ("sourceId" in messageres[0])
       {
            var pending = messageres.length-1;
            isPerformingOperation =true;
            fireQuery(messageres.length-1);
            function  fireQuery(pending)
                {
        console.log(messageres[pending]["trackingId"]);
            if(arrayOfRegisterID.includes(messageres[pending]["trackingId"]))
           {
           if(pending>=0)
           {
            if("sourceId" in messageres[pending] )
            {
                     console.log(messageres[pending]["sourceId"]); //GateWayID
                     console.log(messageres[pending]["trackingId"]); // BeaconID
                     console.log(day);

                     connection.acquire(function(con) 
                     {
                         var sqlselect = "SELECT * FROM AttendenceFinal WHERE beaconId =? and Date =?";
                         console.log(sqlselect, messageres[pending]["trackingId"])
                         con.query(sqlselect,[messageres[pending]["trackingId"],day], function (err, result)
                     {     
                    if (err) throw err;
                    console.log(result);
                    if(result.length>0)
                 {
     
                     var sqlUpdate = "UPDATE AttendenceFinal SET eOutTime = ? , locationID = ?  WHERE beaconId =? and Date =?";
     

                     console.log(sqlUpdate,dayTime,messageres[pending])
      
                     
                     con.query(sqlUpdate, [dayTime,messageres[pending]["sourceId"] ,messageres[pending]["trackingId"],day],function (err, result) {
                       if (err) throw err;
                       if(0==pending)
                       {
     
                         isPerformingOperation = false;
                       }
                       else
                       {
                       --pending;
                      
                       console.log(result.affectedRows + " record(s) updated");
     
                       return fireQuery(pending);
     
                       }
                     });
     
                 }
     
                 else
                 {
                     var sql = "INSERT INTO AttendenceFinal (beaconId, locationID, Date, eInTime, eOutTime) VALUES ?";
                     var values = [  
                         [messageres[pending]["trackingId"], messageres[pending]["sourceId"], day , dayTime, dayTime]
                         ];  
                     con.query(sql,[values] , function(err, rows, fields)
                       {     
                         if (err) throw err;
                         if(0==pending)
                         {
                           isPerformingOperation = false;
                         }
                         else
                         {
                             console.log ("Inserted succesfully",  messageres[pending]["trackingId"]);
                         --pending;
                         return fireQuery(pending);
                         }
                      })
     
                 }
             })
              
         
      
     
            
               });
         
             
                 
     
     
             
         }
     }
     else
     {

        --pending;

        if(pending<0)
        {

            isPerformingOperation = false;

        }
        if(0==pending)
        {

          isPerformingOperation = false;
        }
        return fireQuery(pending);
     }
     

     }
     else
     {
        --pending;

        if(pending<0)
        {

            isPerformingOperation = false;

        }
        else
        {
        if(0==pending)
        {

          isPerformingOperation = false;
        }
        fireQuery(pending);


    }


     }

 
                }



     
    }

}
else
{
    isPerformingOperation = false;

}
}



          
      });
  });
    // subscribe to a topic
 
    // publish a message to a topic
   
});


client.on('error', function(err) {
  console.log(err);
});

});






