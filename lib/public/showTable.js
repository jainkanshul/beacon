$(document).ready(function(){
  var state = document.readyState;
  var arrayResponse = []
  
    $.ajax({
      url: '/getemployeeListWeb',
      success: function(data,status)
      {
        arrayResponse = data;
        debugger
  
        createTableforEmployeeList(arrayResponse);
        createTableforEmployeeListdetails(arrayResponse);
        //enable the submit button
        $('#myBtn').css('cursor','pointer');$('#myBtn').html('Submit');$('#myBtn').removeAttr('disabled');
      },
      async:   true,
      dataType: 'json'
    }); 



 
  

  $("#btnSearch").click(function(e){
    var jsonData = {};
    
  var formData = $("#myform").serializeArray();


  $.ajax({
    data: formData,
    url: '/searchemployeeListWeb',
    success: function(data,status)
    {
        debugger;
      arrayResponse = data;

      createTableforEmployeeList(arrayResponse);
      createTableforEmployeeListdetails(arrayResponse);
      //enable the submit button
    },
    async:   true,
    dataType: 'json'
  });
});


// var data = [{"eName":"Anshul","beaconId":"RRZ1","locationName":"pune","eInTime":"8:00 AM","eOutTime":"5:00 PM","Date":"27/08/2018"},
// {"eName":"Vishal","beaconId":"Nmq9","locationName":"pune","eInTime":"8:00 AM","eOutTime":"5:00 PM","Date":"27/08/2018"},
// {"eName":"Santu Chakrabourty","beaconId":"Vu1P","locationName":"pune","eInTime":"8:00 AM","eOutTime":"5:00 PM","Date":"27/08/2018"},
// {"eName":"Ravi","beaconId":"xo9g","locationName":"PUNE","eInTime":"8:00 AM","eOutTime":"5:00 PM","Date":"27/08/2018"}]
		 
		// createTableforEmployeeList(data);
		//createTableforEmployeeListdetails(data);
		
        //enable the submit button
		
});




function createTableforEmployeeList(data)
{
  var eTable="<table class='table table-striped' id='myTable'><tbody>"
 
  for(var i=0; i<data.length;i++)
  {
    eTable += "<tr class='link3' id='myid'>";
    eTable += "<td class='td1'>"+data[i]['eName']+"</td>";
    eTable += "<td class='td2'>"+data[i]['eID']+"</td>";

    eTable += "<td class='td3'>"+data[i]['eInTime']+"</td>";
	eTable += "<td class='td4'>"+data[i]['eOutTime']+"</td>";
    eTable += "<td class='td5'>"+data[i]['locationName']+"</td>";
    eTable += "<td>"+data[i]['Date']+"</td>";
    eTable += "</tr>";
  }
   eTable +="</tbody></table>";
  $('#myTablediv').html(eTable);


  
}   

  
 function createTableforEmployeeListdetails(data){
	
	
       var tbl = document.getElementById("myTable");
        $("#myTable td").click(function() {     
     
            var row_num = parseInt( $(this).parent().index() );    
            alert(data[row_num]['beaconId']);

        });
    	 
 }
