//GR_DEBUG = true;

function getTitle() {
    return $('#title h1').text().trim();
}

function getSummary() {
	var ans = "<div>Via <a href='"+document.URL+"'>CHOW</a></div>";
	
	if($('#intro_full').size() != 0) {
		var intro = $('#intro_full');
		$('p', intro).each( function() {
			$(this).append('<br>');
		});
		ans += "<br><div>" +  $('#intro_full').html() + '</div>';
	}
	
	return ans;
}

function getIngredients() {
	var ans = "";
	
	if($('#ingredients').size() != 0) {
		ans += $('#ingredients').html();
	}
	
	return ans;
}

function getInstructions() {
	inst = $('#instructions').clone();
	$('ol', inst).each( function() {
		$(this).replaceWith($(this).html());
	});
	$('li', inst).each( function() {
		$(this).replaceWith('<p>' + $(this).html() + '</p><br>');
	});
    return inst.html();
}

function pageHasRecipe () {
    return ( $('body').hasClass('recipes_show') );
}
