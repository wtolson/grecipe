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
