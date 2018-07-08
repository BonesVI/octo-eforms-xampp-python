function Check(x, y){
	this.x = x;
	this.y = y;
	this.value = '';
	this.question = 0;
	var locations = [];
	this.click_count = 0;
	this.location = function()
	{
		var array = [];
		array.push(this.x);
		array.push(this.y);
		return array;
	}
	
	this.set_location = function(x, y)
	{
		this.x = x;
		this.y = y;
		return;
	}
	
	this.set_value = function(value)
	{
		this.value = value;
		return;
	}
	
	this.set_question = function(q)
	{
		this.question = q;
		return;
	}
	
	this.print = function()
	{
		return 'Location: [' + this.x + ' ' + this.y + ']\nQuestion: ' + this.question + '\nValue: ' + this.value; 
	}
}

$(document).ready(function(){
	var locations = [];
	var row_count = 0;
	var q_count = 0;
	var checks = [];
	var check_count = 0;

	$('form .radio-template').hide();
	$('form .checkbox-template').hide();
	$('form .textarea-template').hide();
	$('form .diagram-template').hide();
	$('form .radio-template').removeClass('hidden');
	$('form .checkbox-template').removeClass('hidden');
	$('form .textarea-template').removeClass('hidden');
	$('form .diagram-template').removeClass('hidden');
	
	getNumber = function(id){
		var num = id.substring(8, id.length);
		return num;
	};
	$('#submit').click(function(){
		var line = [];
		var pre = [];
		line.push($('#title').text());
		line.push($('#title').text());
		line.push($('#description').text());
		$('form').each(function(index){
			if($(this).is(':visible')){
				line.push($(this).find('.header span').html());
				var type = $(this).find("input[name='type']:checked").val();
				pre.push($(this).find('.' + type + "-template input[name='name']").val());
				line.push(type);
				if(type == 'radio' || type == 'checkbox')
				{
					$(this).find('.' + type + '-template .coolio').each(function(){
						var string = $(this).find('.second input').val() + ', ' + $(this).find('.first span').text();
						if($(this).find('.third input').val() != '')
						{
							string = string + 'IMG:' + $(this).find('.third input').val() + 'NUM:2HEIGHT:100';
						}
						line.push(string);
					});
				}
				else if(type == 'textarea')
				{
					line.push('5, ' + $(this).find('textarea').val());
				}
				else if(type == 'diagram')
				{
					line.push($(this).find(".diagram-template .file").val().replace('C:\\fakepath\\', ''));
					$(this).find('.sidebar .clickfield').each(function(){
						if($(this).is(':visible')){
							var ur_mom = $(this).find('.value').html();
							ur_mom = ur_mom + ', ' + $(this).find('.position').html();
							line.push(ur_mom);
						}
					});
				}
				else
				{
					$(this).css('border', '1px solid red');
					$(this).append('Select a type!');
				}
				line.push('end');
			}
		});
		line.push('endquestions');
		for(var i = 0; i < pre.length; i++)
		{
			line.push(pre[i]);
		}
		var pieces = '';
		for(var i = 0; i < line.length; i++)
		{
			pieces = pieces + line[i] + '\n';
		}
		alert(pieces);
		$.ajax({
			type: 'POST',
			url: '/submit',
			data: {message:pieces},
			success: function(){
				console.log('File submitted');
				alert('Submission successful. Page will now refresh');
				location.reload();
			}
		});
	});
	$('#newq').click(function(){
		var clone = $('.builder.template').closest('.ui-state-default').clone();
		$('#questions').append(clone);
		clone.find('form').removeClass('hidden');
		clone.find('form').removeClass('template');
		q_count = q_count + 1;
		clone.find('form').attr('id', 'builder-' + q_count);
		refresh(q_count + '');
	});
	
	remove = function(){
		if (confirm('Are you sure you want to delete this?'))
		{
			var row = $(this).closest('.group');
			row.remove();
		}
		return false;
	}
	clickme = function(){
		var input = $(this).find("input[type='text']");
		input.show();
		$(this).find("span").hide();
		input.focus();
		input.keypress(function(e){
			var key = e.keyCode || e.which;
			if (key == '13'){
				$(this).blur();
				return false;
			}
			else{
				return true;
			}
		});
		// takes the value from the text box and copies it to the label
		input.blur(function(){
			$(this).hide();
			var value = $(this).val();
			var span = $(this).closest('.clickfield').find('span');
			var cl = span.closest('.clickfield').attr('class');
			if(cl.indexOf('check-') >= 0)
			{
				span.closest('figure').find('.' + cl.split(' ')[0]).val(value);
			}
			span.html(value);
			span.show();
			return false;
		});
		return false;}
	$('.clickfield').click(clickme);
	$('.add-answer').click(function(){
		var answer = $(this).closest('.collection').find('.hidden');
		var field = answer.closest('.body');
		var clone = answer.clone().removeClass('hidden');
		field.append(clone);
		clone.find('.clickfield').bind('click', clickme);
		jQuery.data(clone.closest('.group'), 'row', row_count);
		clone.find('.remove').click(remove);
		row_count = row_count + 1;
		clone.find('.clickfield').click();
		return false;
	});
	createCanvas = function(filename, id)
	{
		var c = $(".builder#" + id).find('.myCanvas');
 		var ctx= c[0].getContext('2d');
		var img= new Image;
		img.src = 'img?name=' + filename;
		img.onload = function(){
			ctx.canvas.height = img.height;
			ctx.canvas.width = img.width;
			ctx.drawImage(img,0,0);
		};
		$('.myCanvas').click(function(e){
			var left = (e.pageX - $(this).closest('figure').offset().left + 5); 
			var top = (e.pageY - $(this).closest('figure').offset().top + 65);
			var found = false;
			for(var i = 0; i < checks.length; i++)
			{
				if(left === checks[i].x && top === checks[i].y)
				{
					found = true;
				}
			}
			if(!found)
			{
				var piece = new Check(left, top);
				checks.push(piece);
				check_count = check_count + 1;
				var check = $('<input />', { type: 'checkbox', style: 'position:absolute;top:' + top + 'px;left:' + left + 'px;' , class: 'check-' + check_count});
				$(this).closest('figure').append(check);
				check.drags(); // makes draggable
				check.val(''); // defaults the value
				
				// shows input box on click
				check.click(function(){
					left = $(this).position().left + 10;
					top = $(this).position().top - 20;
					value = $(this).val();
					var input = $('<input />', { type: 'input', style: 'position:absolute;top:' + top + 'px;left:' + left + 'px;' , class: 'ui-widget-content'});
					input.css('z-index', '100');
					$(this).closest('figure').append(input);
					input.focus();
					input.val(value);
					var check = $(this);
					input.blur(function(){
						check.val($(this).val());
						part = check.closest('figure').find('.sidebar .' + check.attr('class'));
						part.find('.value').html($(this).val());
						part.find('.position').html(check.css('left').replace('px', '') + ', ' + check.css('top').replace('px', ''));
						$(this).remove();
						return false;
					});
					input.keypress(function(e){
						var key = e.keyCode || e.which;
						if (key == '13'){
							$(this).blur();
							return false;
						}
						else{
							return true;
						}
					});
					
					return false;
				});
				var sidebar = $(this).closest('figure').find('.sidebar');
				var clone_check = sidebar.find('.template').clone();
				var cl = 'check-' + check_count
				clone_check.attr('class', cl + ' clickfield');
				clone_check.click(clickme);
				clone_check.find('.remove-check').click(function(){
					clone_check.closest('figure').find('.' + cl).remove();
					clone_check.remove();
					
					return false;
				});
				sidebar.append(clone_check);
				check.click();
			}
			return false;
		});
	};

	refresh = function(id){
		var form = $('#builder-'+id);
		form.find('input.select').bind('click', function(){
			$('input[name="' + $(this).attr('name') + '"]').not($(this)).trigger('change');
		});
		form.find('.delete-form').click(function(){
			form.remove();
			return false;
		});
		form.find('.show-rad').change(function(){
			if($(this).is(':checked'))
			{
				$(this).closest('form').find('.radio-template').show();
			}
			else
			{
				$(this).closest('form').find('.radio-template').hide();
			}
		});
		form.find('.show-chk').change(function(){
			if($(this).is(':checked'))
			{
				$(this).closest('form').find('.checkbox-template').show();
			}
			else
			{
				$(this).closest('form').find('.checkbox-template').hide();
			}
		});
		form.find('.show-text').change(function(){
			if($(this).is(':checked'))
			{
				$(this).closest('form').find('.textarea-template').show();
			}
			else
			{
				$(this).closest('form').find('.textarea-template').hide();
			}
		});
		form.find('.show-diag').change(function(){
			if($(this).is(':checked'))
			{
				$('form .diagram-template').removeClass('hidden');
				$(this).closest('form').find('.diagram-template').show();
			}
			else
			{
				$(this).closest('form').find('.diagram-template').hide();
			}
		});
		// alter the id here, as it will change when it becomes more dynamic
		form.find('.diagram-upload').click(function(){
			var button = $(this);
			// Change text
			$(this).html('Uploading...');
			
			// alter the file id, as it changes with how dynamic this builder
			// becomes
			var form_data = new FormData($(this).closest(".builder")[0]);
			var file = $(this).closest('.builder').find('.file').val();
			$.ajax({
				type: 'POST',
				url: '/upload',
				data: form_data,
				contentType: false,
				cache: false,
				processData: false,
				async: false,
				success: function(data) {
					console.log('Success!');
				},
			});
			$(this).html('Upload Photo');
			createCanvas(file.substring(12, file.length), $(this).closest('.builder').attr('id'));
			return false;
		});
		form.find('.clickfield').click(clickme);
		form.find('.add-answer').click(function(){
			var answer = $(this).closest('.collection').find('.hidden');
			var field = answer.closest('.body');
			var clone = answer.clone();
			clone.attr('class', 'group coolio');
			field.append(clone.first());
			clone.find('.clickfield').bind('click', clickme);
			clone.find('.remove').click(remove);
			clone.find('.clickfield').click();
			return false;
		});
	};
	refresh('0');	
	(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);
});
