function getTitle() {
    return document.title;
}

function getSummary() {
    var viaText= 'Via <a href="'+document.URL+'">thepioneerwoman.com</a><br>';
    return '<div>' + viaText + '</div><br /><div>' +  '</div>';
}

function getIngredients() {
    var ingredients="";
    var divs = $('div').clone();
    for(var i = 0; i < divs.length; i++)
    {
      // check if this div has shortcode class
      if (divs[i].getAttribute('class') === 'shortcode')
      {
          var temp=divs[i]
          $('p',temp).remove('.select-a-size');
          $('img', temp).remove();
          $('label', temp).remove();
          $('h2', temp).remove();
        //  $('p', temp).after('<br />');
          $('.shortcode-box', temp).remove();
          $('h4', temp).remove();
          $('p', temp).remove();
          ingredients = new XMLSerializer().serializeToString(temp);
      }
    }
    return ingredients.toString();
}

function getInstructions() {
    var instructions="";
    var divs = $('div').clone();

    for(var i = 0; i < divs.length; i++)
    {
      // check if this div has shortcode class
      if (divs[i].getAttribute('class') === 'shortcode')
      {
 
          var temp=divs[i]
          $('p',temp).remove('.select-a-size');
          $('img', temp).remove();
          $('label', temp).remove();
          $('.shortcode-box', temp).remove();
          $('ul', temp).remove();           
          $('h2', temp).remove();
          $('h4', temp).remove();
          $('p', temp).after('<br />');           
          instructions = new XMLSerializer().serializeToString(temp);
      }
    }
    return instructions.toString();
}

function pageHasRecipe () {
    if($("div").find(".shortcode").length == 1)
       return 1;
    return 0;
    
}
