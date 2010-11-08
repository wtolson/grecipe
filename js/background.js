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


var DOCLIST_SCOPE = 'https://docs.google.com/feeds';
var DOCLIST_FEED = DOCLIST_SCOPE + '/default/private/full/';
var recipes = [];
var websites = {
	"www.epicurious.com":   "js/epicurious.js",
	"www.food.com":         "js/food.js",
	"www.foodandwine.com":  "js/foodandwine.js",
	"allrecipes.com":       "js/allrecipes.js",
	"www.bbc.co.uk":        "js/bbcfood.js",
	"www.gourmet.com":		"js/gourmet.js",
	"www.bbcgoodfood.com":	"js/bbcgoodfood.js",
	"www.foodnetwork.com":	"js/foodnetwork.js",
	"www.chow.com":			"js/chow.js",
	"thepioneerwoman.com":	"js/pioneerwoman.js"
};
	

if(typeof localStorage.openOnSave == "undefined") {
    localStorage.openOnSave = false;
}

if(typeof localStorage["sendAnalytics"] == "undefined") {
    localStorage.sendAnalytics = true;
}

var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key': 'anonymous',
    'consumer_secret': 'anonymous',
    'scope': DOCLIST_SCOPE,
    'app_name': 'gRecipe',
    'callback_page': 'lib/chrome_ex_oauth.html'
});

chrome.extension.onConnect.addListener(function(port) {
	console.assert(port.name == "grecipe");
	port.onMessage.addListener(function(msg) {
		if (msg.type == "host") {
			if ( websites[msg.host] != null ) {
				chrome.tabs.executeScript(port.sender.tab.id, {file: websites[msg.host]}, function() {
					port.postMessage({type: "getrecipe"});
				});				
			}
		}
		if (msg.type == "recipe") {
			chrome.pageAction.show(port.sender.tab.id);
			setRecipe(port.sender.tab.id, msg.recipe);
		}
	});
});

chrome.tabs.onRemoved.addListener(
    function(tabId) {
        setRecipe(tabId, null);
    }
);

function toBool(str) {
    if (str == 'false') {
        return false;
    } else {
        return str;
    }    
};

function shouldOpenOnSave () {
    return toBool(localStorage.openOnSave);
}

function shouldSendAnalytics () {
    return toBool(localStorage.sendAnalytics);
}

function setOpenOnSave (value) {
    localStorage.openOnSave = value;
}

function setSendAnalytics (value) {
    localStorage.sendAnalytics = value;
}

function setRecipe(id, recipe) {
    recipes['tab:' + id] = recipe;
}

function getRecipe(id) {
    return recipes['tab:' + id];
}

function logout() {
    chrome.tabs.create( {
        'url': 'https://www.google.com/accounts/b/0/RevokeAuthSubAccess?authsub_tokens=' + encodeURIComponent(oauth.getToken()) + '&authsub_target_label=oamfgnlpfakglicippbmceflfnicfhon&authsub_scope_label=Google+Docs'
    });
    oauth.clearTokens();
};
