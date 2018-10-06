$(document).ready(function(){
  var state = document.readyState;

  var arrayResponse = []
//   $("#myTable td").click(function() {     


//     var column_num = parseInt( $(this).index() ) + 1;
//     var row_num = parseInt( $(this).parent().index() );    
   
// //     $.ajax({
// //       url: '/getemployeeList',
// //       success: function(resp,status)
// //       {
// //         //enable the submit button
// //         $.ajax({
// //           data: {
// //             beaconId:resp[row_num]['beaconId']
// //            },
// //           url: '/getemployeeHistory',
// //           success: function(data,status)
// //           {
        

// //             createTableforEmployeeDetail(data);

// //           },
// //           async:   true,
// //           dataType: 'json'
// //         }); 

// //       },
// //       async:   true,
// //       dataType: 'json'
// //     }); 

//  });
debugger;

if (state == 'complete') 
{


    //disable the submit button
    $.ajax({
      url: '/getemployeeListWeb',
      success: function(data,status)
      {
        arrayResponse = data;
        debugger

        createTableforEmployeeList(arrayResponse);
        //enable the submit button
        $('#myBtn').css('cursor','pointer');$('#myBtn').html('Submit');$('#myBtn').removeAttr('disabled');
      },
      async:   true,
      dataType: 'json'
    }); 
  
  }
 

});
 


function createTableforEmployeeList(data)
{
  var eTable="<script type='text/javascript' src='showTable.js'></script><table id = 'myTable'><tbody>"
  debugger
  for(var i=0; i<data.length;i++)
  {
    eTable += "<tr>";
    eTable += "<td class='cell100 column1'>"+data[i]['eName']+"</td>";
    eTable += "<td class='cell100 column2'>"+data[i]['beaconId']+"</td>";

    eTable += "<td class='cell100 column3'>"+data[i]['eInTime']+" - "+data[i]['eOutTime']+"</td>";
    eTable += "<td class='cell100 column4'>"+data[i]['locationName']+"</td>";
    eTable += "<td class='cell100 column5'>"+data[i]['Date']+"</td>";

    eTable += "</tr>";
  }
  eTable +="</tbody></table>";
  $('#myTabledeiv').html(eTable);
}


function createTableforEmployeeDetail(data)
{

  var eTable="<table id = 'myTable'> <tbody>"
  debugger
  for(var i=0; i<data.length;i++)
  {
    eTable += "<tr>";
    eTable += "<td class='cell100 column1'>"+data[i]['eName']+"</td>";
    eTable += "<td class='cell100 column2'>"+data[i]['beaconId']+"</td>";

 //   eTable += "<td class='cell100 column3'>"+data[i]['eInTime']+"-"+data[i]['eOutTime']+"</td>";
    eTable += "<td class='cell100 column4'>"+data[i]['Date']+"</td>";
    eTable += "<td class='cell100 column5'>"+data[i]['locationName']+"</td>";

    eTable += "</tr>";
  }
  eTable +="</tbody></table>";
  $('#myTabledeiv').html(eTable);
}
 
// function createTableByJqueryEach(data)
// {
 

//   var eTable="<script type='text/javascript' src='showTable.js'></script><table><thead><tr><th colspan='3'>Created by Jquery each</th></tr><tr><th>Name</th><th>Title</th><th>Salary</th</tr></thead><tbody>"
//   $.each(data,function(index, row){
//     // eTable += "<tr>";
//     // eTable += "<td>"+value['name']+"</td>";
//     // eTable += "<td>"+value['title']+"</td>";
//     // eTable += "<td>"+value['salary']+"</td>";
//     // eTable += "</tr>";
 
//     eTable += "<tr>";
//     $.each(row,function(key,value){
//       eTable += "<td>"+value+"</td>";
//     });
//     eTable += "</tr>";
//   });
//   eTable +="</tbody></table>";
//   $('#eachTable').html(eTable);
// }
