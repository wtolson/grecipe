var port = chrome.extension.connect({name: "grecipe"});
port.postMessage({type: "host", host: location.host});
port.onMessage.addListener(function(msg) {
	if ( msg.type == "getrecipe" ) {
		if (pageHasRecipe()) {
			
			grdebug( 'Title: ' + getTitle() );
			grdebug( 'Summary:\n' + getSummary() );
			grdebug( 'Ingredients:\n' + getIngredients() );
			grdebug( 'Instructions:\n' + getInstructions() );
			
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


function grdebug(msg) {
	if (GR_DEBUG) {
		console.log('gR Debug: ' + msg)
	}
}

function blank(str) {
    return (str == null || /^\s+$/.test(str) || str == "");
}
