function getTitle() {
    return $('.fn').text().trim();
}

function getSummary() {
	return "<div>Via <a href='http://www.bbcgoodfood.com/'>BBC Good Food</a></div><br><div>" + $(".summary").html().trim() + "</div>";
}

function getIngredients() {
	ingredients = $('#ingredients').clone();
	
	$('h3', ingredients).each( function() {
		$(this).remove();
	});
	
	$('form', ingredients).each( function() {
		$(this).remove();
	});
	
	$('h4', ingredients).each( function() {
		$(this).replaceWith("<h3>" + $(this).html() + "</h3>");
	});
	
	
    return ingredients.html().trim();
}

function getInstructions() {
	instructions = $('#method').clone();
	
	$('h3', instructions).each( function() {
		$(this).remove();
	});
	
	$('ol', instructions).each( function() {
		$(this).replaceWith($(this).html());
	});	
	
	$('li', instructions).each( function() {
		$(this).replaceWith("<p>" + $(this).html() + "</p>");
	});
	$('p', instructions).after('<br />');
	
    return instructions.html();
}

function pageHasRecipe () {
    return ($('div.hrecipe').size() != 0);
}
