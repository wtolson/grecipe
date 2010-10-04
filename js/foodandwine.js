function blank(str) {
    return (str == null || /^\s+$/.test(str));
}


function getTitle() {
    return $('h2', $('#recipe1')).first().text();
}

function getSummary() {
    var summary = '<div>Via <a href="http://www.foodandwine.com/">Food & Wine</a></div>';
    
    var recipeIntroText =  $('#teaser-border');
    var wineText = $('#recipeWines').clone();
    $('h2', wineText).remove();
    $('img', wineText).remove();
    
    if (!blank(recipeIntroText.text())) {
        summary = summary + '<br /><div>' + recipeIntroText.html() + '</div>';
    } else {
    }
    
    if (!blank(wineText.text())) {
        summary = summary + '<br /><div>' + wineText.html() + '</div>';
    }
    
    return summary;
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
