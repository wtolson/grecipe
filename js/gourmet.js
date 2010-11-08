/***********************************************************************
 * 
 *     This file is part of gRecipes.
 *
 *     gRecipes is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     gRecipes is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with gRecipes.  If not, see <http://www.gnu.org/licenses/>.
 * 
 **********************************************************************/


function getTitle() {
    return $('div.headers', $('div.recipe')).text().trim();
}

function getSummary() {
    var summary = 'Via <a href="'+document.URL+'">gourmet.com</a><br>';
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
