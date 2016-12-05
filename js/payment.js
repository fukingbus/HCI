var products = {};
var card;
$(function(){
	$('body').fadeIn(700);
	shouldPayAmount = Cookies.get('shouldPayAmount');
	if(shouldPayAmount!=null)
		$('#totalPayAmt').text('$'+shouldPayAmount);
	else
		window.location.href = "index.html";
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
	
	 card = new Card({
	    form: 'form',
	    container: '.card-wrapper',

	    placeholders: {
	        number: '**** **** **** ****',
	        name: 'CARD HOLDER',
	        expiry: '**/****',
	        cvc: '***'
		    },
		 formSelectors: {
		        numberInput: 'input#cardNumber', // optional — default input[name="number"]
		        expiryInput: 'input#cardExpiry', // optional — default input[name="expiry"]
		        cvcInput: 'input#cardCVC', // optional — default input[name="cvc"]
		        nameInput: 'input#cardName' // optional - defaults input[name="name"]
		    }
	});
	$('#continue').on('click',function(){
		if(card.cardType=='unknown' || card.cardType == null){
			$('.card-wrapper').effect( "shake" );
			$('#infoStr').text('Unknown card type').css('color','red');
		}
		else{
			waitingDialog.show('Establishing payment','This may take some time...', {dialogSize: 'sm'});
			setTimeout(function(){
				waitingDialog.hide();
				window.location.href = "confirm.html";
			},3000);
		}
	});
		
	parseProducts(function(){
			cart = Cookies.getJSON('cart');
	});
	
	$('#radioBtn a').on('click', function(){
		    var sel = $(this).data('title');
		    var tog = $(this).data('toggle');
		    $('#'+tog).prop('value', sel);
		    if(sel=='S')
		    	$('#deliveryAddr').fadeOut();
		    else
		    	$('#deliveryAddr').fadeIn();
		    
		    $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
		    $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
		});
	
});

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
var waitingDialog = waitingDialog || (function ($) {
    'use strict';

		// Creating modal dialog's DOM
		var $dialog = $(
			'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
			'<div class="modal-dialog modal-m">' +
			'<div class="modal-content">' +
				'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
				'<div class="modal-body"><h4 style="margin:0;"></h4></div>' +
				'<div class="modal-body">' +
					'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
				'</div>' +
			'</div></div></div>');

		return {
			/**
			 * Opens our dialog
			 * @param message Custom message
			 * @param options Custom options:
			 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
			 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
			 */
			show: function (message,msgbody, options) {
				// Assigning defaults
				if (typeof options === 'undefined') {
					options = {};
				}
				if (typeof message === 'undefined') {
					message = 'Loading';
				}
				var settings = $.extend({
					dialogSize: 'm',
					progressType: '',
					onHide: null // This callback runs after the dialog was hidden
				}, options);

				// Configuring dialog
				$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
				$dialog.find('.progress-bar').attr('class', 'progress-bar');
				if (settings.progressType) {
					$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
				}
				$dialog.find('h3').text(message);
				$dialog.find('h4').text(msgbody);
				// Adding callbacks
				if (typeof settings.onHide === 'function') {
					$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
						settings.onHide.call($dialog);
					});
				}
				// Opening dialog
				$dialog.modal();
			},
			/**
			 * Closes dialog
			 */
			hide: function () {
				$dialog.modal('hide');
			}
		};

	})(jQuery);
