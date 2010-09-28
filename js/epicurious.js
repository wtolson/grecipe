function getTitle() {
    return $('.fn').text();
}

function getSummary() {
    var viaText= 'Via <a href="http://www.epicurious.com/">epicurious.com</a>';
    eval($('#recipeIntroText').children('script').text());
    if(typeof recipeIntroText == "undefined" || recipeIntroText instanceof HTMLDivElement) {
        var recipeIntroText =  $('#truncatedText').html();
        if (recipeIntroText == null) {
            return viaText;
        } else {
            return '<div>' + viaText + '</div><br /><div>' + recipeIntroText + '</div>';
        }
    }
    
    return '<div>' + viaText + '</div><br /><div>' + recipeIntroText + '</div>';
}

function getIngredients() {
    var ingredients = $('#ingredients').clone();
    
    $('#ingredients_headline_wrapper', ingredients).remove();
    $('#printShoppingList', ingredients).remove();
    $('br', ingredients).remove();
    
    ingredients.children('strong').each(function(index) {
        $(this).replaceWith($('<h3>' + $(this).text() + '</h3>'));
    });
    
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('#preparation').clone();
    
    $('h2', instructions).remove();
    $('#addnoteLnk', instructions).remove();
    $('p', instructions).after('<br />');
    
    return instructions.html();
}

if ($('#recipe_detail_module').size() != 0) {    
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
