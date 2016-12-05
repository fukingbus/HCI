var products = {};
var card;
var loggedInUser = {};
$(function(){
	$('body').fadeIn(700);
	shouldPayAmount = Cookies.get('shouldPayAmount');
	loggedInUser = Cookies.getJSON('loggedInUser');
	if(loggedInUser!=null){
		bpoint = Math.floor(shouldPayAmount * 20/100);
		addUserPoint(bpoint);
		$('#navigationBar').append('<li><a onclick="logout()" href="#">Logout</a></li>');
		$('#navigationBar').append('<li><a href="gift.html">Gift Point:'+loggedInUser.point+'</a></li>');
		$('#loggedInUserText').text(loggedInUser.username);		
		$('#userGiftPointInfo').text('You earned '+bpoint+' bonus point from this order as you are a IVE student');
		$('#points').text(loggedInUser.point);
	}
	else{
		$('#navigationBar').append('<li><a href="register.html">Register</a></li>');
		$('#navigationBar').append('<li><a href="login.html">Login</a></li>');
		$('#loginDesc').text('Sign up to get discount offer!');
	}
	STRUCTURE = '<tr><td class="col-sm-8 col-md-6"><div class="media"><a class="thumbnail pull-left" href="details.html?id=%%IMGLINK%%">'+
				'<img class="media-object" src="img/320/%%IMGID%%.png" style="width: 72px; height: 72px;"> </a>'+
		'<div class="media-body"><h4 class="media-heading listTitle"><a href="details.html?id=%%ITEMID%%">%%NAME%%</a></h4>'+
		'</div></div></td><td class="col-sm-1 col-md-1" style="text-align: center">'+
		'<td id="multiPrice"class="col-sm-1 col-md-1 text-center"><strong>$%%MUL_PRICE%%</strong></td>'+
		'</tr>';
		
		
	parseProducts(function(){
			cart = Cookies.getJSON('cart');
			$.each( cart, function( key, val ) {
				findProducts(val ,function(item){
					str = STRUCTURE.replace('%%IMGID%%',item.itemId);
					str = str.replace('%%IMGLINK%%',item.itemId);
					str = str.replace('%%ITEMID%%',item.itemId);
					str = str.replace('%%NAME%%',item.itemName);
					str = str.replace('%%MUL_PRICE%%',item.itemPrice);
					$('#itemList').append(str);
				});
			});
			Cookies.remove('shouldPayAmount');
			Cookies.remove('cart');
	});
	
	
});

function addUserPoint(point){
	loggedInUser.point += point;
	saveUsers();
}

function saveUsers(){
	userArr = Cookies.getJSON('user');
	if(userArr!=null){
			userArr.forEach(function(element,index,arr) {
				if(element.username == loggedInUser.username){
					userArr[index] = loggedInUser;
				}
			});
			Cookies.set('user',userArr);
			Cookies.set('loggedInUser',loggedInUser);
	}
	
}
function logout(){
	Cookies.remove('loggedInUser');
	location.reload();
}
function parseProducts(callback){
	$.getJSON("http://dev.bu5hit.xyz/HCI/ajax/getProducts.php",function(data){
		products = data.products;
		callback();
	});
}
function concatAll(){
	sta =  products.sta;
	ele = products.ele;
	return sta.pen.concat(sta.highlightPen).concat(sta.pencil).concat(ele.apple).concat(ele.lenovo);
}
function findProducts(id,callback){
	arr = concatAll()
	$.each(arr , function( key, val ) {
			if(val.itemId == id){
			
		    	callback(val);
		    }
		});
}
