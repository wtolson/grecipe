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
    return $('h2', $('#recipe1')).first().text().trim();
}

function getSummary() {
    var summary = 'Via <a href="'+document.URL+'">Food and Wine</a><br>';
    
    var recipeIntroText =  $('#teaser-border');
    var wineText = $('#recipeWines').clone();
    $('h2', wineText).remove();
    $('img', wineText).remove();
    
    if (!recipeIntroText.text().blank()) {
        summary = summary + '<br /><div>' + recipeIntroText.html() + '</div>';
    } else {
    }
    
    if (!wineText.text().blank()) {
        summary = summary + '<br /><div>' + wineText.html() + '</div>';
    }
    
    return summary;
}

function getIngredients() {
    var ingredients = $('#ingredients').clone();
    
    $('h3', ingredients).remove();
    
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('#directions').clone();
    
    $('h3', instructions).first().remove();
    
    $('ol', instructions).replaceWith($($('ol', instructions).html()));
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($('<p>' + $(this).text() + '</p>'));
    });
    
    $('br', instructions).remove();    
    $('p', instructions).after('<br />');
    $('br', instructions).last().remove();
    
    return instructions.html();
}

function pageHasRecipe () {
    return ($('#recipe1').size() != 0);
}
