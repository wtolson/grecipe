function getTitle() {
    return $('h2.fn').text();
}

function getSummary() {
    var viaText= 'Via <a href="http://www.food.com/">food.com</a>';
    
    var recipeIntroText =  $('.summary').html();
    if (recipeIntroText == null) {
        return viaText;
    } else {
        return '<div>' + viaText + '</div><br /><div>' + recipeIntroText + '</div>';
    }
}

function getIngredients() {
    var ingredients = $('.clr').clone();
    $('p', ingredients).remove();
    
    return '<ul>' + ingredients.html() + '</ul>';
}

function getInstructions() {
    var instructions = $('.instructions').clone();
    $('em', instructions).remove();
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($('<p>' + $(this).text() + '</p>'));
    });
    
    $('p', instructions).after('<br />');
    
    return $('ol', instructions).html();
}

if ($('h2.fn').size() != 0) {    
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

