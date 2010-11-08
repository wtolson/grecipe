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
    return $('.fn').text().trim();
}

function getSummary() {
	return 'Via <a href="'+document.URL+'">BBC Good Food</a><br><div>' + $(".summary").html().trim() + "</div>";
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
