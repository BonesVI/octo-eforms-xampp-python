$(document).ready(function(){
	var row_count = 0;
	var q_count = 0;
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
			ctx.drawImage(img,10,10);
		}
	}
	
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
	
	
});
