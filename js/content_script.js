var port = chrome.extension.connect({name: "grecipe"});
port.postMessage({type: "host", host: location.host});
port.onMessage.addListener(function(msg) {
	if ( msg.type == "getrecipe" ) {
		if (pageHasRecipe()) {
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
