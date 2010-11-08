/************************
 * 
 * By Jim
 * 
 ***********************/
GR_DEBUG = true;

function getTitle() {
    return document.title;
}

function getSummary() {
    var viaText= 'Via <a href="'+document.URL+'">thepioneerwoman.com</a><br>';
    return '<div>' + viaText + '</div>';
}

function getIngredients() {	
    var ingredients = $('div.shortcode').clone();
	$('p',ingredients).remove('.select-a-size');
	$('img', ingredients).remove();
	$('label', ingredients).remove();
	$('h2', ingredients).remove();
	//  $('p', ingredients).after('<br />');
	$('.shortcode-box', ingredients).remove();
	$('h4', ingredients).remove();
	$('p', ingredients).remove();
          
    return ingredients.html();
}

function getInstructions() {
    var instructions = $('div.shortcode').clone();
	$('p',instructions).remove('.select-a-size');
	$('img', instructions).remove();
	$('label', instructions).remove();
	$('.shortcode-box', instructions).remove();
	$('ul', instructions).remove();           
	$('h2', instructions).remove();
	$('h4', instructions).remove();
	$('p', instructions).after('<br />');
    return instructions.html();
}

function pageHasRecipe () {
	return ($('div.shortcode').size() == 1);   
}
