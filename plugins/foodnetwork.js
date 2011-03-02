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


//GR_DEBUG = true;

function getTitle() {
    return $('h1.fn').text().trim();
}

function getSummary() {
	return "<div>Via <a href='"+document.URL+"'>Food Network</a></div>";
}

function getIngredients() {
	ingredients = $('div.body-text').clone();
	$('span',ingredients).remove('.nocoupons');
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
