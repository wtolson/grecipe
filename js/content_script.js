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

util.debug = function (msg) {
	if (GR_DEBUG) {
		console.log('gR Debug: ' + msg)
	}
};

util.blank = function (str) {
    return (str == null || /^\s+$/.test(str) || str == "");
};
