function getTitle() {
    return $('#itemTitle').text();
}

function getSummary() {
    var viaText= 'Via <a href="http://www.allrecipes.com/">allrecipes.com</a>';
    
    var summary = $('.author-name').parent().clone();
    
    $('.author-name', summary).remove();
    
    return '<div>' + viaText + '</div><br /><div>' + summary.text() + '</div>';
}

function getIngredients() {
    var ingredients = $('.ingredients').clone();
    
    $('h3', ingredients).remove();
    
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('.directions').clone();
    
    $('h3', instructions).remove();
    
    $('li', instructions).each(function(index) {
        $(this).replaceWith($('<p>' + $(this).text() + '</p>'));
    });
    
    $('ol', instructions).replaceWith($('ol', instructions).html());
    
    
    $('p', instructions).after('<br />');
    
    return instructions.html();
}

function pageHasRecipe () {
    return ($('#itemTitle').size() != 0);
}
