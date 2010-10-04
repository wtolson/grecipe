function getTitle() {
    return $('h2', $('#recipe1')).first().text();
}

function getSummary() {
    var viaText= 'Via <a href="http://www.foodandwine.com/">Food & Wine</a>';
    
    var recipeIntroText =  $('#teaser-border').html();
    var wineText = $('#recipeWines').clone();
    $('h2', wineText).remove();
    $('img', wineText).remove();
    
    return '<div>' + viaText + '</div><br /><div>' + recipeIntroText + '</div><br /><div>' + wineText.html() + '</div>';
}

function getIngredients() {
    var ingredients = $('#ingredients').clone();
    
    $('h3', ingredients).remove();
    
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('#directions').clone();
    
    $('h3', instructions).first().remove();
    
    $('ol', instructions).replaceWith($($('ol', instructions).html()));
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($('<p>' + $(this).text() + '</p>'));
    });
    
    $('br', instructions).remove();    
    $('p', instructions).after('<br />');
    $('br', instructions).last().remove();
    
    return instructions.html();
}

function pageHasRecipe () {
    return ($('#recipe1').size() != 0);
}
