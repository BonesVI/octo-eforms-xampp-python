function Check(x, y){
	this.x = x;
	this.y = y;
	this.value = '';
	this.question = 0;
	var locations = [];
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
	remove = function(){
		if (confirm('Are you sure you want to delete this?'))
		{
			var row = $(this).closest('.group');
			row.hide();
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
				var span = $(this).parent('.clickfield').find('span');
				span.text(value);
				span.show();
				var temp = jQuery.data($(this).closest('.group'), 'row', row_count);
				rows = $(this).closest('.body').find('.group');
				for(var i = 0; i < rows.length; i++)
				{
					if(rows[i].is(':visible') && jQuery.data(rows[i], 'row', 'row_count') > temp)
					{
						rows[i].find('.clickfield').click();
						return false;
					}
				}
				$(this).closest('.collection').find('.add-answer').focus();
			return false;
		});
		return false;}
	$('.clickfield').click(clickme);
	$('.add-answer').click(function(){
		var answer = $(this).closest('.collection').find('.hidden');
		var field = answer.closest('.body');
		var clone = answer.clone().attr('class', 'group');
		field.append(clone);
		clone.find('.clickfield').bind('click', clickme);
		jQuery.data(clone.closest('.group'), 'row', row_count);
		clone.find('.remove').click(remove);
		row_count = row_count + 1;
		clone.find('.clickfield').click();
		return false;
	});
	createCanvas = function(filename)
	{
		var c=document.getElementById("myCanvas");
		var ctx=c.getContext("2d");
		var img= new Image;
		img.src = 'img?name=' + filename;
		img.onload = function(){
			ctx.canvas.height = img.height;
			ctx.canvas.width = img.width;
			ctx.drawImage(img,0,0);
		};
		$('#myCanvas').click(function(e){
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
				piece = new Check(left, top);
				checks.push(piece);
				var check = $('<input />', { type: 'checkbox', style: 'position:absolute;top:' + top + 'px;left:' + left + 'px;' , class: 'ui-widget-content'});
				$(this).closest('figure').append(check);
				check.drags();
			}
			return false;
		});
	};
	
	// alter the id here, as it will change when it becomes more dynamic
	$('#diagram-upload').click(function(){
		var button = $(this);
		// Change text
		$(this).html('Uploading...');
		
		// alter the file id, as it changes with how dynamic this builder
		// becomes
        var form_data = new FormData($("#builder")[0]);
		var file = $('#file').val();
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
		$(this).html('Submit');
		createCanvas(file.substring(12, file.length));
		return false;
	});
	
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
