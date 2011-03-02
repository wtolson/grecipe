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
    return $('#title h1').text().trim();
}

function getSummary() {
	var ans = "<div>Via <a href='"+document.URL+"'>CHOW</a></div>";
	
	if($('#intro_full').size() != 0) {
		var intro = $('#intro_full');
		$('p', intro).each( function() {
			$(this).append('<br>');
		});
		ans += "<br><div>" +  $('#intro_full').html() + '</div>';
	}
	
	return ans;
}

function getIngredients() {
	var ans = "";
	
	if($('#ingredients').size() != 0) {
		ans += $('#ingredients').html();
	}
	
	return ans;
}

function getInstructions() {
	inst = $('#instructions').clone();
	$('ol', inst).each( function() {
		$(this).replaceWith($(this).html());
	});
	$('li', inst).each( function() {
		$(this).replaceWith('<p>' + $(this).html() + '</p><br>');
	});
    return inst.html();
}

function pageHasRecipe () {
    return ( $('body').hasClass('recipes_show') );
}
