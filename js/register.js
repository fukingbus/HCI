var product = {};

$(function(){
	
	$('body').fadeIn(700);
	user = Cookies.getJSON('loggedInUser');
	if(user!=null){
		$('#navigationBar').append('<li><a onclick="logout()" href="#">Logout</a></li>');
		$('#navigationBar').append('<li><a href="gift.html">Gift Point:'+user.point+'</a></li>');
	}
	$('#submitButton').on('click',function(){
		$('#regForm').validate();
		if($('#regForm').valid()){
			username = $('#usernameBox').val();
			email = $('#emailBox').val();
			password = $('#passwordBox').val();
			console.log(username);
			console.log(email);
			console.log(password);
			
			userArr = Cookies.getJSON('user');
			user = {
					username: username,
					email : email,
					password : password,
					point : (email.endsWith('vtc.edu.hk') ? 500 : 0)
			};
			if(userArr==null)
				userArr = [];
			userArr.push(user);
			Cookies.set('user', userArr);
			alert('Register successful!');
			location.href = 'index.html';
		}
	});
	$('#emailBox').on('change',function(){
		if($('#emailBox').val().endsWith('vtc.edu.hk')){
			$('body').fadeTo('fast', 0.3, function(){
				    $('body').css('background','url("img/ivety.png")');
					$('body').css('background-repeat','no-repeat');
					$('body').css('background-size','cover');
			}).fadeTo('fast', 1);
			
		}
		else{
			$('body').fadeTo('fast', 0.3, function(){
				    $('body').css('background','');
					$('body').css('background-repeat','');
					$('body').css('background-size','');
			}).fadeTo('fast', 1);
			
		}
	});
	$('#radioBtn a').on('click', function(){
		    var sel = $(this).data('title');
		    var tog = $(this).data('toggle');
		    $('#'+tog).prop('value', sel);
		    
		    $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
		    $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
		})
});

function parseProducts(callback){
	$.getJSON("http://dev.bu5hit.xyz/HCI/ajax/getProducts.php",function(data){
		products = data.products;
		arr = concatAll();
		$.each( arr, function( key, val ) {
			if(val.itemId == getParameterByName('id')){
		    	callback(val);
		    }
		});
	});
}
function concatAll(){
	sta =  products.sta;
	return sta.pen.concat(sta.highlightPen).concat(sta.pencil);
}
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}