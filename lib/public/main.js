
/* User management page tr link to detail page*/
		  $(document).ready(function() {

				$('tr.link3').click(function () {
				  window.location.href = 'details.html';	
				});
				

	
/* Date picker */
	$(function () {
		$("#datepicker").datepicker({ dateFormat: 'yy-mm-dd' });

         $("#datepicker1").datepicker({ dateFormat: 'yy-mm-dd' });
	});

/* for pop up */
  $("#submit").click(function(){
		  showpopup();
		 });
		 $("#cancel_button").click(function(){
		  hidepopup();
		 });
		 $("#close_button").click(function(){
		  hidepopup();
		 });
	
		function showpopup()
		{
		 $("#popup_box").fadeToggle();
		 $("#popup_box").css({"visibility":"visible","display":"block"});
		}

		function hidepopup()
		{
		 $("#popup_box").fadeToggle();
		 $("#popup_box").css({"visibility":"hidden","display":"none"});
		}
		
	/* redirecting to user management page
	$('#login').click(function(){		
	 document.location = 'UserManagement.html';		
	});*/
	
	/* redirecting to Forget password page
	$('#forget_password').click(function(){	
	 document.location = 'forgetPassword1.html';		
	});*/
		
		
		
 
/* Employee registration page validation
	$(".btn").click(function(){
    var name = $("#eName").val();              
    var emailadd = $("#emailId").val(); 
    var beconid = $("#BeconId").val(); 
    var empid =  $("#empid").val();
    var phonenumber = $("#phonenumber").val();
   if(name=='' && emailadd=='' && beconid=='' && empid=='' && phonenumber=='')
	{
	alert("Please fill out the details");
	}
	if(name=='' && emailadd !=='' && beconid !=='' && empid!=='' && phonenumber!=='')
	{
	alert("Please enter the Name");
	}
	if(name!=='' && emailadd =='' && beconid !=='' && empid!=='' && phonenumber!=='')
	{
	alert("Please enter the Email Address");
	}
	if(name!=='' && emailadd !=='' && beconid =='' && empid!=='' && phonenumber!=='')
	{
	alert("Please enter Becon-ID");
	}
	if(name!=='' && emailadd !=='' && beconid !=='' && empid =='' && phonenumber!=='')
	{
	alert("Please enter Employee-ID");
	}
	if(name!=='' && emailadd !=='' && beconid !=='' && empid!=='' && phonenumber =='')
	{
	alert("Please enter Phone Number");
	}
	if(name!=='' && emailadd !=='' && beconid !=='' && empid!=='' && phonenumber !=='')
	{
		showpopup();
		hidepopup();
	}
	});*/


/* to store textfeild data in json object after clicking on search button*/

});

