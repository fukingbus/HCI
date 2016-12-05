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
			
			userArr = Cookies.getJSON('user');
			login(userArr,function(status,user){
				if(status){
					alert('Login successful');
					Cookies.set('loggedInUser',user);
					setTimeout(function(){ window.location.href ="index.html"; }, 1000);
				}
				else{
					$('#formContainer').effect('shake');
					$('#errorMsg').fadeIn();
				}
					
			});
		}
	});
		$('#radioBtn a').on('click', function(){
		    var sel = $(this).data('title');
		    var tog = $(this).data('toggle');
		    $('#'+tog).prop('value', sel);
				    
				    $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
				    $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
				});
});
function login(userArr,callback){
	if(userArr!=null){
					found = false;
					$.each( userArr, function( key, val ) {
						if(val.username == username && val.password==password){
							found = true;
							callback(true,val);
						}	
					});
					if(!found)
						callback(false);
			}
			else
				callback(false);
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