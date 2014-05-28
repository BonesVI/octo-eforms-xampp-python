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
	createCanvas = function()
	{
		alert('WHATUP');
	}
	$(".template input[type='file']").bind('change', createCanvas);
	
	
});
