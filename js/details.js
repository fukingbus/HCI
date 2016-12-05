var product = {};

$(function(){
	$('body').fadeIn(700);
	user = Cookies.getJSON('loggedInUser');
	if(user!=null){
		$('#navigationBar').append('<li><a onclick="logout()" href="#">Logout</a></li>');
		$('#navigationBar').append('<li><a href="gift.html">Gift Point:'+user.point+'</a></li>');
	}
	else{
		$('#navigationBar').append('<li><a href="register.html">Register</a></li>');
		$('#navigationBar').append('<li><a href="login.html">Login</a></li>');
	}
	parseProducts(function(data){
		product = data;
		$('#item-display').attr('src','img/640/'+product.itemId+'.png');
		$('.product-title').text(product.itemName);
		$('.product-desc').text(product.itemShortDesc);
		$('.product-price').text('$ '+product.itemPrice);
		$('.product-stock').text(product.itemStock!=0 ? "In Stock ("+product.itemStock+")" : "OUT OF STOCK");
		if(product.itemStock=='0')
			$('.product-stock').addClass('outOfStock');
		$('#itemInfo').html(product.itemLongDesc);
	});
	$('#addToCart').on('click',function(){
		shopCartArr = Cookies.getJSON('cart');
		if(shopCartArr==null)
			shopCartArr = [];
		shopCartArr.push(product.itemId);
		Cookies.set('cart',shopCartArr);
		$('#item-display').animate({left:50,bottom:600,width:0,height:0},500, function() {
		    
		    $('#item-display').attr('style','');
		    $('#item-display').hide().delay(500).fadeIn(500);
		  });
		  
	});
});
function logout(){
	Cookies.remove('loggedInUser');
	location.reload();
}
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
	ele = products.ele;
	return sta.pen.concat(sta.highlightPen).concat(sta.pencil).concat(ele.apple).concat(ele.lenovo);
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