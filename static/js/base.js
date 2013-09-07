/*jslint browser: true*/
/*global $, jQuery*/
/*jshint multistr: true */

jQuery(document).ready(function(){

	$('.selectpicker').selectpicker();
	$('#n_c_info').tooltip({
		container:'body',
		placement:'right',
	});
	//cartridge color mouseover change
	$(document).on('mouseover','.color-option-style-01',function(){
		$(this).children('span').width($(this).width());
		$(this).children('span').addClass('selected');
	}).on('mouseleave','.color-option-style-01',function(){
		$(this).children('span').removeClass('selected');
	});
	//printer unit number change
	$('#printer_unit').change(function(e){
		$this=$(e.target);
		var value=$(this).val()*$('#printer_unit_price').text();
		$('#printer_price').text(value);
		if($('#printer_order').attr('title')=="remove"){
			$('#printer_update_order').css({display:'',});
		}
	});

	$('#printer_unit').trigger('change');

	//print order button click
	$('#printer_order,#printer_update_order').click(function(){
		
		var button_title=$(this).attr('title');
		if(button_title=="order"){
			removePrinterItem();
			var printer_price=$('#printer_price').text();
			$('#cart_printer').css({
				display: '',
			});
			addItemPrice(printer_price);
			$('#p_printer').text(toCurrency(printer_price));
			$('#n_printer').text($('#printer_name').attr('title'));
			$('#u_printer').text('x'+$('#printer_unit').val());
			$('#printer_order').removeClass("btn-primary").addClass("btn-default").text("Remove Order").attr('title','remove');
		}
		else if(button_title=="remove"){
			removePrinterItem();
		}
	});

	//slider
	$('.slider').click(function(){
		var slider_class=$(this).find('.slider_img').attr('class');
		if (slider_class.indexOf("down")>=0){
			$(this).find('.slider_img').attr('class',slider_class.replace('down','up'));
		}
		else{
			$(this).find('.slider_img').attr('class',slider_class.replace('up','down'));
		}
	});

	$('.buc,.car').click(function(){
		$('.carousel').carousel('next');
		$('.carousel').carousel('pause');
	});
	//choose cartridge type
	
	$('.cartridge_type').click(function(){
		var types=$(this).attr('id');
		$('#cartridge_type').val(types);
		if(types=="PLA"){
			$('.c_ABS').css({display:'none'});
			$('.c_PLA').css({display:''});
		}
		else if(types=="ABS"){
			$('.c_PLA').css({display:'none'});
			$('.c_ABS').css({display:''});
		}
	});
	//setup default value for cartridge
	$('#PLA').click();

	//select cartridge
	$('#car .color-option-style-01').on('click',function(){
		var c_type= $('#cartridge_type').val();
		var c_price=$(this).parent().siblings('.c_price').val();
		var c_color=$(this).next().text();
		var c_group=$(this).parents('.c_types').attr('id');
		$('#cart_cartridge').css({
				display: '',
			});
		$('#p_cartridge').text(toCurrency(sum(c_price,removeCurrency($('#p_cartridge').text()))));
		var html=($(this).outerHTML()).replace('selected',c_type);
		var c_options=$(this).parent('div').attr('class');
		var abs,pla,active_abs="",active_pla="";
		if (c_options.toLowerCase().indexOf("abs") >= 0)
			abs=1;
		if (c_options.toLowerCase().indexOf("pla") >= 0)
			pla=1;
		if (c_type.toLowerCase()=="abs")
			active_abs="active";
		if (c_type.toLowerCase()=="pla")
			active_pla="active";
		if (abs==1 && pla==1){
			popover_buttons='<div class="btn-group" data-toggle="buttons"> \
				<label class="btn btn-default col-md-6 plaactive summary_cart '+active_pla+'"> \
					<input type="radio" name="options" value="PLA">PLA</label>\
				<label class="btn btn-default col-md-6 absactive summary_cart '+active_abs+'"> \
					<input type="radio" name="options" value="ABS">ABS</label></div>';
		}else{
			popover_buttons='('+c_type+')';
		}
		popover_buttons=popover_buttons+'<input type="hidden" class="c_cartridge_price" value="'+c_price+'">'+
							'<input type="hidden" class="c_cartridge_color" value="'+c_color+'">'+
							'<input type="hidden" class="c_cartridge_group" value="'+c_group+'">';

		var a= $(html).popover({
			placement: 'bottom',
			html: 'true',
			trigger:'manual',
			
			content : '<button class="btn btn-danger remove_car_order" title="remove">Remove Order</button> \
						<a type="button" class="pull-right close">&times;</a><br>'+
						c_color+'($'+c_price+') - '+c_group+' cartridges \n'+popover_buttons,
			});

		$('#display_cartridge').append(a);
		a.children('span').width(a.width());
		addItemPrice(c_price);
		$(html).popover('show');
	});

	$(document).on('click','#cart_cartridge .color-option-style-01',function(e){
		$('#cart_cartridge .color-option-style-01').not(this).each(function() {
			$(this).popover('hide');
		});
		$(this).popover('show');
	});


	$(document).on('click', '.summary_cart', function (evente) {
		types=$(this).children('input').val();
		$(this).parents('.popover').prev().children('span').removeClass('PLA').removeClass('ABS').addClass(types);
		var content_extract=($('.summary_cart').removeClass('active','').parent().children().children('input[value='+types+']').parent().addClass('active').parent().parent().html());
		

		get_class=$(this).parents('.popover').prev();
		(get_class).popover('destroy');
		(get_class).popover({
			placement: 'bottom',
			html: 'true',
			trigger:'manual',
			content:content_extract,
		});
		(get_class).popover('show');
	});

	$(document).on('click', '.remove_car_order', function (evente) {
		price=$(this).siblings('.c_cartridge_price').val();
		removeItem(price);
		$('#p_cartridge').text(toCurrency(diff(removeCurrency($('#p_cartridge').text()),price)));
		get_class=$(this).parents('.popover').prev();
		$(get_class).popover('destroy');
		$(get_class).remove();
	});




	$(document).on('click', function(event) {
    var target = $(event.target); // One jQuery object instead of 3

    // Compare length with an integer rather than with negation
    if ( ! target.hasClass('.color-option-style-01') && target.parent('.color-option-style-01').length === 0 && target.parent('.popover').length === 0) {
        hideAllPopovers();
		}
	});

	$('#buy_now').on('click', function(){
		var i_group="",i_color="",i_price="",i_category="";
		$('#display_cartridge .color-option-style-01').each(function() {
			$(this).popover('show');
			i_group=$(this).next().find('input.c_cartridge_group').val()+","+i_group;
			i_color=$(this).next().find('input.c_cartridge_color').val()+","+i_color;
			i_price=$(this).next().find('input.c_cartridge_price').val()+","+i_price;
			i_category=($(this).children('span').attr('class')).replace('check-space ','')+","+i_category;
			$(this).popover('hide');
        });
		cartridge_total_price=removeCurrency($('#p_cartridge').text());
		printer_units=$('#u_printer').text();
		printer_total_price=removeCurrency($('#p_printer').text());
		total_cost=removeCurrency($('#p_total').text());
		$.ajax({
			type: "POST",
			dataType:"json",
			url: '/',
			data : {
				'total_cost': total_cost,
				'printer_total_price': printer_total_price,
				'printer_units': printer_units,
				'cartridge_total_price': cartridge_total_price,
				'i_category': i_category,
				'i_price': i_price,
				'i_color': i_color,
				'i_group': i_group,
				},
			success: buyerhandler,
		});
    });
	
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
});