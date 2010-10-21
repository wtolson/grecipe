function getTitle() {
    return $('.fn').text();
}

function getSummary() {
    var viaText= 'Via <a href="http://www.epicurious.com/">epicurious.com</a>';
    eval($('#recipeIntroText').children('script').text());
    if(typeof recipeIntroText == "undefined" || recipeIntroText instanceof HTMLDivElement) {
        var recipeIntroText =  $('#truncatedText').html();
        if (util.blank(recipeIntroText)) {
            return '<div>' + viaText + '</div>';
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

function pageHasRecipe() {
    return ($('#recipe_detail_module').size() != 0);
}
