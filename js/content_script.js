if (pageHasRecipe()) {
    chrome.extension.sendRequest({
        hasRecipe: true,
        recipe: {
            title: getTitle(),
            summary: getSummary(),
            ingredients: getIngredients(),
            instructions: getInstructions()
        }
    });
} else {
    chrome.extension.sendRequest({ hasRecipe: false });
}

