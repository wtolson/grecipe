//GR_DEBUG = true;

function getTitle() {
    return $('h1.fn').text().trim();
}

function getSummary() {
	return "<div>Via <a href='"+document.URL+"'>Food Network</a></div>";
}

function getIngredients() {
	ingredients = $('div.body-text').clone();
	$('h2', ingredients).each( function() {
			if ( $(this).text() == 'Ingredients' || $(this).text() == 'Directions') {
				$(this).remove();
			} else {
				$(this).replaceWith('<h3>' + $(this).text() + '</h3>');
			}
	});
	$('script, div.instructions, div.next-recipe', ingredients).each( function() {
			$(this).remove()
	});
    return ingredients.html();
}

function getInstructions() {	
	ans = '';
	$('.instructions').each( function () {
		ans += $(this).html();
	});
    return ans;
}

function pageHasRecipe () {
    return ( $('body').hasClass('recipe-detail') );
}
