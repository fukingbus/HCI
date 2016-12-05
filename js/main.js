var products = {};

$(function(){
	$('body').fadeIn(700);
	user = Cookies.getJSON('loggedInUser');
	if(user!=null){
		$('#navigationBar').append('<li><a onclick="logout()" href="#">Logout</a></li>');
		$('#navigationBar').append('<li><a href="gift.html">Gift redemption</a></li>');
	}
	else{
		$('#navigationBar').append('<li><a href="register.html">Register</a></li>');
		$('#navigationBar').append('<li><a href="login.html">Login</a></li>');
	}
	parseProducts();
	$('#searchBox').on('change',function(){
		keyword = $(this).val();
		
		findItem(keyword.toUpperCase(),function(arr){
			appendProducts(arr);
		});
	});
});
function findItem(keyword,callback){
	tempArr = [];
		$('#productList').html('');
		$('#productList').hide();
	$.each( concatAll(), function( key, val ) {
			if(val.itemName.toUpperCase().indexOf(keyword)!=-1 ||
				val.itemShortDesc.toUpperCase().indexOf(keyword)!=-1 ||
				val.itemLongDesc.toUpperCase().indexOf(keyword)!=-1){
				tempArr.push(val);
			}
	});
	callback(tempArr);
}

function logout(){
	Cookies.remove('loggedInUser');
	location.reload();
}
function parseProducts(){
	$.getJSON("http://dev.bu5hit.xyz/HCI/ajax/getProducts.php",function(data){
		products = data.products;
		appendProducts(concatAll());
	});
}
function concatAll(){
	sta =  products.sta;
	ele = products.ele;
	return sta.pen.concat(sta.highlightPen).concat(sta.pencil).concat(ele.apple).concat(ele.lenovo);
}
function onAddCart(id,element){
	shopCartArr = Cookies.getJSON('cart');
		if(shopCartArr==null)
			shopCartArr = [];
		shopCartArr.push(id);
		Cookies.set('cart',shopCartArr);
		img = $(element).parent().parent().find('img');
		$(img).css('position','absolute');
		$(img).animate({top:0,width:0,height:0},500, function() {
		    
		    $(img).attr('style','');
		    $(img).hide().delay(500).fadeIn(500);
		  });
		  
}
function appendProducts(category){

	var STRUCTURE = '<div class="col-sm-4 col-lg-4 col-md-4"><div class="thumbnail">'+
					'<a href="details.html?id=%%ITEMID%%"><img src="img/320/%%PHOTOID%%.png" alt=""><div class="caption">'+
					'<h4>%%NAME%%</a></h4>'+
					'<button style="margin-bottom:8px;" onclick="onAddCart(\'%%CARTITEMID%%\',$(this))" type="button" class="btn btn-success addToCartBtn pull-right"><span>$%%PRICE%%</span></button>'+
					'<p>%%DESC%%</p></div></div></div>';
	
	$.each( category, function( key, val ) {
		    str = STRUCTURE.replace('%%ITEMID%%',val.itemId);
		    str = str.replace('%%CARTITEMID%%',val.itemId);
		    str = str.replace('%%ITEMPRICE%%',val.itemPrice);
		    str = str.replace('%%PRICE%%',val.itemPrice);
		    str = str.replace('%%PHOTOID%%',val.itemId);
		    str = str.replace('%%NAME%%',val.itemName);
		    str = str.replace('%%DESC%%',val.itemShortDesc);
		    $('#productList').append(str);
	});
	
   $('#productList').fadeIn();
}