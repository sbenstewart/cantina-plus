function transfer(){	
	var tablink;
	chrome.tabs.getSelected(null,function(tab) {
	   	tablink = tab.url;

		var xhr=new XMLHttpRequest();
		params="url="+tablink;
        //alert(params);
		var markup = "url="+tablink+"&html="+document.documentElement.innerHTML;
		xhr.open("POST","http://localhost/clientServer.php",false);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(markup);
		//alert(xhr.responseText);
		$("#div1").text(xhr.responseText);
		return xhr.responseText;
	});
}

function safe(){	
	var tablink;
	chrome.tabs.getSelected(null,function(tab) {
	   	tablink = tab.url;

		var xhr=new XMLHttpRequest();
		var markup = "url="+tablink;
		xhr.open("POST","http://localhost/updatewhitelist.php",false);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(markup);
		//alert(xhr.responseText);
		$("#div1").text(xhr.responseText);
		return xhr.responseText;
	});
}


$(document).ready(function(){
    $("#button").click(function(){	
		var val = transfer();
	});
	
	$("#button2").click(function(){	
		var val = safe();
    });
});

chrome.tabs.getSelected(null,function(tab) {
   	var tablink = tab.url;
	$("#p1").text("The URL being tested is - "+tablink);
});
