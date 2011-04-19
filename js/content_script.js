/***********************************************************************
 * 
 *     This file is part of gRecipes.
 *
 *     gRecipes is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     gRecipes is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with gRecipes.  If not, see <http://www.gnu.org/licenses/>.
 * 
 **********************************************************************/

(function(window, chrome, undefined) {

var grrs_ = {};
  
function onMessage_(msg) {
  switch (msg.type) {
    case "grrloaded":
      checkGrrs_();
      break;
    case "getrecipe":
      getRecipe_(msg.grrId);
      break;
  }
};

function loadGrr(id, grr) {
  grrs_[id] = grrify(grr);
};

function checkGrrs_() {
  var ids = [];
  for (id in grrs_) {
    if (grrs_[id].hasRecipe()) {
      ids.push(id);
    }
  }
  
  if (ids.length) {
    port.postMessage({
      type: "hasrecipe",
      grrs: ids,
    });
  }
};

function getRecipe_(grrId) {
  port.postMessage({
    type: "recipe",
    recipe: grrs_[grrId].makeRecipe(),
  });
};

function Grr() {};
Grr.prototype.getName =
Grr.prototype.getRecipeType =
Grr.prototype.getPhoto =
Grr.prototype.getPublished =
Grr.prototype.getSummary =
Grr.prototype.getReview =
Grr.prototype.getPrepTime =
Grr.prototype.getCookTime =
Grr.prototype.getTotalTime =
Grr.prototype.getNutrition =
Grr.prototype.getInstructions =
Grr.prototype.getYield =
Grr.prototype.getIngredients =
Grr.prototype.getAuthor =
Grr.prototype.getClosing = 
function() {return undefined;};

Grr.prototype.makeRecipe = function() {
  return {
    name: this.getName(),
    recipeType: this.getRecipeType(),
    photo: this.getPhoto(),
    published: this.getPublished(),
    summary: this.getSummary(),
    review: this.getReview(),
    prepTime: this.getPrepTime(),
    cookTime: this.getCookTime(),
    totalTime: this.getTotalTime(),
    nutrition: this.getNutrition(),
    instructions: this.getInstructions(),
    yield: this.getYield(),
    ingredients: this.getIngredients(),
    author: this.getAuthor(),
    closing: this.getClosing(),
    host: location.host,
    url: location.href,
  };
};

function grrify(obj) {
  obj.__proto__ = Grr.prototype;
  obj.__super = Grr;
  obj.constructor();
  return obj;
};


window.loadGrr = loadGrr;
var port = chrome.extension.connect({name: "grecipe"});
port.onMessage.addListener(onMessage_);

})(this, this.chrome);
