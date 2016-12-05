var gifts = {};
var user;

$(function(){
	$('body').fadeIn(700);
	user = Cookies.getJSON('loggedInUser');
	if(user!=null){
		$('#navigationBar').append('<li><a onclick="logout()" href="#">Logout</a></li>');
		$('#navigationBar').append('<li><a href="gift.html">Gift Point:'+user.point+'</a></li>');
		$('.panel-footer').html('You now have <b>'+user.point+'</b> points to redeem');
	}
	else{
		$('#navigationBar').append('<li><a href="register.html">Register</a></li>');
		$('#navigationBar').append('<li><a href="login.html">Login</a></li>');
	}
	parseProducts();
	
});
function onRedeem(price){
	if(user!=null){
		if(user.point - price < 0 ){
			BootstrapDialog.show({
	            title: 'Unable to redeem',
	            type :  BootstrapDialog.TYPE_WARNING,
	            message: 'You dont have enough points to redeem this item.',
	            buttons: [{
	                label: 'Close',
	                action: function(dialog) {
	                   dialog.close();
	                }
	            }]
	        });
		}
		else{
			BootstrapDialog.show({
	            title: 'Are you sure ?',
	            type :  BootstrapDialog.TYPE_SUCCESS,
	            message: price + ' points will be used to redeem this item.',
	            buttons: [{
	                label: 'Yes',
	                action: function(dialog) {
	                   dialog.close();
	                   BootstrapDialog.show({
				            title: 'Successfully redeemed',
				            type :  BootstrapDialog.TYPE_INFO,
				            message: 'You redeemed a gift with '+price+' points.',
				            buttons: [{
				                label: 'Close',
				                action: function(dialog) {
				                	deductPoint(price);
				                   dialog.close();
				                }
				            }]
				        });
	                }
	            },{
	                label: 'No',
	                action: function(dialog) {
	                   dialog.close();
	                }
	            }]
	        });
		}
	}
	else{
			BootstrapDialog.show({
		            title: 'Please login',
		            type :  BootstrapDialog.TYPE_WARNING,
		            message: 'You must login to redeem gifts.',
		            buttons: [{
		                label: 'Close',
		                action: function(dialog) {
		                   dialog.close();
		                }
		            }]
		        });
	}
}
function deductPoint(point){
	user.point -= point;
	saveUsers();
	location.reload();
}

function saveUsers(){
	userArr = Cookies.getJSON('user');
	if(userArr!=null){
			userArr.forEach(function(element,index,arr) {
				if(element.username == user.username){
					userArr[index] = user;
				}
			});
			Cookies.set('user',userArr);
			Cookies.set('loggedInUser',user);
	}
	
}
function logout(){
	Cookies.remove('loggedInUser');
	location.reload();
}
function parseProducts(){
	$.getJSON("http://dev.bu5hit.xyz/HCI/ajax/getGifts.php",function(data){
		gifts = data.gifts;
		appendProducts();
	});
}
function appendProducts(){
	var STRUCTURE = '<div class="col-sm-4 col-lg-4 col-md-4"><div class="thumbnail">'+
					'<img src="img/320/%%PHOTOID%%.png" alt=""><div class="caption">'+
					'<h4><a href="details.html?id=%%ITEMID%%">%%NAME%%</a></h4>'+
					'<p>%%DESC%%</p><button style="margin-bottom:8px;" onclick="onRedeem(\'%%ITEMPRICE%%\')" type="button" class="btn btn-success pull-right">%%PRICE%% Points</button>'+
					'</div></div></div>';
	
	$.each( gifts, function( key, val ) {
		    str = STRUCTURE.replace('%%ITEMID%%',val.itemId);
		    
		    str = str.replace('%%ITEMPRICE%%',val.itemPrice);
		    str = str.replace('%%PRICE%%',val.itemPrice);
		    str = str.replace('%%PHOTOID%%',val.itemId);
		    str = str.replace('%%NAME%%',val.itemName);
		    str = str.replace('%%DESC%%',val.itemShortDesc);
		    $('#productList').append(str);
	});
}