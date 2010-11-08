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
    return $('#itemTitle').text().trim();
}

function getSummary() {
    var viaText= 'Via <a href="'+document.URL+'">allrecipes.com</a><br>';
    
    var summary = $('.author-name').parent().clone();
    
    $('.author-name', summary).remove();
    
    return '<div>' + viaText + '</div><br /><div>' + summary.text() + '</div>';
}

function getIngredients() {
    var ingredients = $('.ingredients').clone();
    
    $('h3', ingredients).remove();
    
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('.directions').clone();
    
    $('h3', instructions).remove();
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($('<p>' + $(this).text() + '</p>'));
    });
    
    $('ol', instructions).replaceWith($('ol', instructions).html());
    
    
    $('p', instructions).after('<br />');
    
    return instructions.html();
}

function pageHasRecipe () {
    return ($('#itemTitle').size() != 0);
}
