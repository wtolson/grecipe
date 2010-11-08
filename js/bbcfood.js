function getTitle() {
    return $('h1', $('#column-1')).first().text().trim();
}

function getSummary() {
	return 'Via <a href="'+document.URL+'">bbcfood.com</a><br>';
}

function getIngredients() {
	ingredients = $('#stages', $('#ingredients')).clone();
	$('.stage-title', ingredients).each( function() {
		if ( $(this).text().blank() ) {
			$(this).remove();
		} else {
			$(this).replaceWith($('<h3>' + $(this).text() + '</h3>'));
		}
	});
    return ingredients.html();
}

function getInstructions() {
	instructions = $('.instructions').clone();
	$('li', instructions).each( function() {
		$(this).replaceWith($(this).html());
	});
	$('p', instructions).after('<br />');
    return instructions.html();
}

function pageHasRecipe () {
    return ( $('body').hasClass('recipes-show') );
}
