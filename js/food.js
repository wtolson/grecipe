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
    return $('h2.fn').text().trim();
}

function getSummary() {
    var summary = 'Via <a href="'+document.URL+'">food.com</a><br>';
    
    var recipeIntroText =  $('.summary').html();
    if (recipeIntroText != null) {
        return summary += '<br /><div>' + recipeIntroText + '</div>';
    }
    return summary;
}

function getIngredients() {
    var ingredients = $('.clr').clone();
    $('p', ingredients).remove();
    
    return '<ul>' + ingredients.html() + '</ul>';
}

function getInstructions() {
    var instructions = $('.instructions').clone();
    $('em', instructions).remove();
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($('<p>' + $(this).text() + '</p>'));
    });
    
    $('p', instructions).after('<br />');
    
    return $('ol', instructions).html();
}

function pageHasRecipe() {
    return ($('h2.fn').size() != 0);
}
