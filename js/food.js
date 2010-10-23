function getTitle() {
    return $('h2.fn').text().trim();
}

function getSummary() {
    var summary = '<div>Via <a href="http://www.food.com/">food.com</a></div>';
    
    var recipeIntroText =  $('.summary').html();
    if (recipeIntroText != null) {
        return summary += '<br /><div>' + recipeIntroText + '</div>';
    }
    return summary;
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

function pageHasRecipe() {
    return ($('h2.fn').size() != 0);
}
