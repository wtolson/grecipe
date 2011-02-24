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
 *     Support for The Pioneer Woman brought to you by Jim <cutiger02@gmail.com>
 * 
 **********************************************************************/
 
//GR_DEBUG = true;

function getTitle() {
    return document.title;
}

function getSummary() {
    var viaText= 'Via <a href="'+document.URL+'">thepioneerwoman.com</a><br>';
    return '<div>' + viaText + '</div>';
}

function getIngredients() {	
    var ingredients = $('div.shortcode').clone();
	$('p',ingredients).remove('.select-a-size');
	$('img', ingredients).remove();
	$('label', ingredients).remove();
	$('h2', ingredients).remove();
	//  $('p', ingredients).after('<br />');
	$('.shortcode-box', ingredients).remove();
	$('h4', ingredients).remove();
	$('p', ingredients).remove();
          
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('div.shortcode').clone();
	$('p',instructions).remove('.select-a-size');
	$('img', instructions).remove();
	$('label', instructions).remove();
	$('.shortcode-box', instructions).remove();
	$('ul', instructions).remove();           
	$('h2', instructions).remove();
	$('h4', instructions).remove();
	$('p', instructions).after('<br />');
    return instructions.html();
}

function pageHasRecipe () {
	return ($('div.shortcode').size() == 1);   
}
