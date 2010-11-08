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

var port = chrome.extension.connect({name: "grecipe"});
port.postMessage({type: "host", host: location.host});
port.onMessage.addListener(function(msg) {
	if ( msg.type == "getrecipe" ) {
		if (pageHasRecipe()) {
			
			util.debug( 'Title: ' + getTitle() );
			util.debug( 'Summary:\n' + getSummary() );
			util.debug( 'Ingredients:\n' + getIngredients() );
			util.debug( 'Instructions:\n' + getInstructions() );
			
			port.postMessage({
				type: "recipe",
				recipe: {
					title: getTitle(),
					summary: getSummary(),
					ingredients: getIngredients(),
					instructions: getInstructions()
				}
			});
		}
	}
});

// Yeah namespaces!
var util = {};
GR_DEBUG = false;

util.debug = function (msg) {
	if (GR_DEBUG) {
		console.log('gR Debug: ' + msg)
	}
};

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
};

String.prototype.blank = function () {
    return (this == null || /^\s+$/.test(this) || this == "");
};
