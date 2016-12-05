var products = {};

$(function(){
	$('body').fadeIn(700);
	user = Cookies.getJSON('loggedInUser');
	if(user!=null){
		console.log(user);
		$('#navigationBar').append('<li><a onclick="logout()" href="#">Logout</a></li>');
		$('#navigationBar').append('<li><a href="gift.html">Gift Point:'+user.point+'</a></li>');
		$('#loggedInUserText').text(user.username);
	}
	else{
		$('#navigationBar').append('<li><a href="register.html">Register</a></li>');
		$('#navigationBar').append('<li><a href="login.html">Login</a></li>');
		$('#loginDesc').text('Sign up to get discount offer!');
	}
	
		STRUCTURE = '<tr><td class="col-sm-8 col-md-6"><div class="media"><a class="thumbnail pull-left" href="#">'+
				'<img class="media-object" src="img/320/%%IMGID%%.png" style="width: 72px; height: 72px;"> </a>'+
		'<div class="media-body"><h4 class="media-heading listTitle">%%NAME%%</a></h4>'+
		'</div></div></td><td class="col-sm-1 col-md-1" style="text-align: center">'+
		' <input type="number" class="form-control" id="qty" onchange="updatePrice()" value="1" min="0"></td>'+
		'<td id="singlePrice" class="col-sm-1 col-md-1 text-center"><strong>$%%PRICE%%</strong></td>'+
		'<td id="multiPrice"class="col-sm-1 col-md-1 text-center"><strong>%%MUL_PRICE%%</strong></td>'+
		'<td class="col-sm-1 col-md-1"><button id="removeFromCart" onclick="removeItem(\'%%ITEMID%%\',$(this))" type="button" class="btn btn-danger">'+
		'<span class="glyphicon glyphicon-remove"></span> Remove'+
		'</button></td></tr>';
		
		
	parseProducts(function(){
			cart = Cookies.getJSON('cart');
			$.each( cart, function( key, val ) {
				findProducts(val ,function(item){
					str = STRUCTURE.replace('%%IMGID%%',item.itemId);
					str = str.replace('%%ITEMID%%',item.itemId);
					str = str.replace('%%NAME%%',item.itemName);
					str = str.replace('%%PRICE%%',item.itemPrice);
					str = str.replace('%%MUL_PRICE%%',item.itemPrice);
					$('#itemList').append(str);
				});
			});
			updatePrice();
	});
	
	$('#continue').on('click',function(){
		if(cart!=null){
			Cookies.set('shouldPayAmount',getShouldPayAmount());
			window.location.href = "payment.html";
		}
		else
			alert('You dont have any item can be purchase');
	});
			
	
});
function getShouldPayAmount(){
	return $('#totalPrice').text().replace('$','');
}
function removeItem(id,jqObj){
	if(id==-1){
		Cookies.remove('cart');
		location.reload();
	}
	else{
		cart = Cookies.getJSON('cart');
		var index = cart.indexOf(id);
		if(index != -1)
		    cart.splice( index, 1 );
		Cookies.set('cart',cart);
		console.log($(jqObj));
		$(jqObj).parent().parent().fadeOut();
	}
	//
}
function updatePrice(){
	var total = 0;
	$.each( $('tbody > tr'), function( key, val ) {
		qty = $(val).find('input#qty').val();
		singlePrice = $(val).find('#singlePrice').text().replace('$','');
		multiPrice = parseInt(qty) * parseInt(singlePrice);
		$(val).find('#multiPrice').text('$'+multiPrice);
		total += multiPrice;
	});
	$('#totalPrice').text('$'+total);
	/**
	for(i=0;i<.length;i++){
		qty = $('input#qty')[i];
		singlePrice = $('tbody > tr > #singlePrice')[i];
		multiPrice = $('tbody > tr > #multiPrice')[i];
		
	}**/
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