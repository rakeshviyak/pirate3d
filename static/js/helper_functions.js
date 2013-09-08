//helper functions
/*jshint multistr: true */

//clone the outer html for the element
jQuery.fn.outerHTML = function() {
	return jQuery('<div />').append(this.eq(0).clone()).html();
};

//check whether n is a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

//return Cart is empty if num is 0 else $num
function emptyCart(num){
	if(num===0)
		return "Cart is empty";
	else
		return toCurrency(num);
}

//add a dollar to the num
function toCurrency(num){
	return '$'+num;
}

//remove a dollar from the num
function removeCurrency(num){
	return num.replace('$','');
}

//add two number
function sum(num1,num2){
	if(isNumber(num1)===false){num1=0;}
	if(isNumber(num2)===false){num2=0;}
	return parseFloat(num1)+parseFloat(num2);
}

//subtract num1-num2
function diff(num1,num2){
	if(isNumber(num1)===false){num1=0;}
	if(isNumber(num2)===false){num2=0;}
	return parseFloat(num1)-parseFloat(num2);
}

//sum printer price to the total
function addItemPrice(item_price){
	var total_price=sum(item_price,removeCurrency($('#p_total').text()));
	$('#p_total').text(toCurrency(total_price));
	return false;
}

//remove the item from cart
function removeItem(item_price){
	var sub_price=diff(removeCurrency($('#p_total').text()),item_price);
	$('#p_total').text(emptyCart(sub_price));
}

//remove printer item from cart
function removePrinterItem(){
	$('#cart_printer').css({
			display: 'none',
		});
	removeItem(removeCurrency($('#p_printer').text()));
	$('#p_printer').text('0');
	$('#printer_order').removeClass("btn-default").addClass("btn-primary").text("Add to Order").attr('title','order');
	$('#printer_update_order').css({display:'none',});
}

//hide all popover used in cartridge cart summary
var hideAllPopovers = function() {
   $('#cart_cartridge .color-option-style-01').each(function() {
        $(this).popover('hide');
    });
};

//add the output json to the modal using pre
function output(inp) {
    $('#myModal').find('pre').text(inp);
    $('#myModal').modal();
}

//based on ajax output provide the message to the user for buy now
function buyerhandler(e){
	if (e.error==1){
		var alert_html='<div class="alert alert-warning"><a class="close" data-dismiss="alert" href="#">&times;</a> \
		<strong>'+e.message+'</strong></div>';
		$('#summary_cart').append(alert_html);
		window.setTimeout(function() { $(".alert").alert('close'); }, 5000);
	}else{
		var str=JSON.stringify(e.cart, undefined, 4);
		$('#myModal').find('.modal_message').text(e.message);
		output(str);
	}
}