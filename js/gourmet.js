GR_DEBUG = true;

function getTitle() {
    return $('div.headers', $('div.recipe')).text().trim();
}

function getSummary() {
    var summary = '<div>Via <a href="http://www.gourmet.com/">gourmet.com</a></div>';
    var recipeIntroText =  $("div.text", $('div.body', $('div.recipe'))).children().html();
    if ( !recipeIntroText.blank() ) {
        return summary += '<br /><div>' + recipeIntroText + '</div>';
    }
    return summary;
}

function getIngredients() {
	ingredients = $("div.ingredient-sets", $('div.body', $('div.recipe')));
	
	$('div.ingredient-set', ingredients).each(function(index) {
        $(this).replaceWith($(this).html());
    });
	
	appurtenance = $(".appurtenances", $('div.body', $('div.recipe'))).clone();
	if (appurtenance.text().blank()) {
		return ingredients.html().trim();
	}
	
	$('li', appurtenance).each(function(index) {
        $(this).replaceWith($(this).html());
    });
    
    $('div.text', appurtenance).each(function(index) {
        $(this).replaceWith("<p>" + $(this).html() + "</p>");
    });
    
    $('p', appurtenance).after('<br />');
    
    $('br', appurtenance).last().remove();
    
    return ingredients.html().trim() + appurtenance.html().trim();
	
	
}

function getInstructions() { 
    var instructions = $("div.preparation", $('div.body', $('div.recipe'))).clone();
    
    $('div.prep-steps', instructions).each(function(index) {
        $(this).replaceWith($(this).html());
    });
    
    $('div.presentation', instructions).each(function(index) {
        $(this).replaceWith($(this).html());
    });
    
    $('ul', instructions).each(function(index) {
        $(this).replaceWith($(this).html());
    });
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($(this).html());
    });
    
    $('div.text', instructions).each(function(index) {
        $(this).replaceWith("<p>" + $(this).html() + "</p>");
    });
    
    $('strong', instructions).each(function(index) {
        $(this).replaceWith($('<h3>' + $(this).text() + '</h3>'));
    });
    
    $('p', instructions).after('<br />');
    
    $('h3', instructions).each(function(index) {
        $(this).prev('br').remove();
    });
    
    return instructions.html().trim();
}

function pageHasRecipe() {
    return ($('div.recipe').size() != 0);
}
