//helper functions

jQuery.fn.outerHTML = function() {
	return jQuery('<div />').append(this.eq(0).clone()).html();
};
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function emptyCart(num){
	if(num===0)
		return "Cart is empty";
	else
		return toCurrency(num);
}
function toCurrency(num){
	return '$'+num;
}
function removeCurrency(num){
	return num.replace('$','');
}
function sum(num1,num2){
	if(isNumber(num1)===false){num1=0;}
	if(isNumber(num2)===false){num2=0;}
	return parseFloat(num1)+parseFloat(num2);
}
function diff(num1,num2){
	if(isNumber(num1)===false){num1=0;}
	if(isNumber(num2)===false){num2=0;}
	return parseFloat(num1)-parseFloat(num2);
}

function addItemPrice(item_price){
	var total_price=sum(item_price,removeCurrency($('#p_total').text()));
	$('#p_total').text(toCurrency(total_price));
	return false;
}
function removeItem(item_price){
	var sub_price=diff(removeCurrency($('#p_total').text()),item_price);
	$('#p_total').text(emptyCart(sub_price));
}
function removePrinterItem(){
	$('#cart_printer').css({
			display: 'none',
		});
	removeItem(removeCurrency($('#p_printer').text()));
	$('#p_printer').text('0');
	$('#printer_order').removeClass("btn-default").addClass("btn-primary").text("Add to Order").attr('title','order');
	$('#printer_update_order').css({display:'none',});
}


var hideAllPopovers = function() {
   $('#cart_cartridge .color-option-style-01').each(function() {
        $(this).popover('hide');
    });
};

function output(inp) {
    $('#myModal').find('pre').text(inp);
    $('#myModal').modal();
}