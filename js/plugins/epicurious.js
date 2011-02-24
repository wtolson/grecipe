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
    var viaText= 'Via <a href="'+document.URL+'">epicurious.com</a><br>';
    
    eval($('#recipeIntroText').children('script').text());
    if(typeof recipeIntroText == "undefined" || recipeIntroText instanceof HTMLDivElement) {
        var recipeIntroText =  $('#truncatedText').html();
        if (recipeIntroText.blank()) {
            return '<div>' + viaText + '</div>';
        } else {
            return '<div>' + viaText + '</div><br /><div>' + recipeIntroText + '</div>';
        }
    }
    
    return '<div>' + viaText + '</div><br /><div>' + recipeIntroText + '</div>';
}

function getIngredients() {
    var ingredients = $('#ingredients').clone();
    
    $('#ingredients_headline_wrapper', ingredients).remove();
    $('#printShoppingList', ingredients).remove();
    $('br', ingredients).remove();
    
    ingredients.children('strong').each(function(index) {
        $(this).replaceWith($('<h3>' + $(this).text() + '</h3>'));
    });
    
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('#preparation').clone();
    
    $('h2', instructions).remove();
    $('#addnoteLnk', instructions).remove();
    $('p', instructions).after('<br />');
    
    return instructions.html();
}

function pageHasRecipe() {
    return ($('#recipe_detail_module').size() != 0);
}
