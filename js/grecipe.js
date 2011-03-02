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
 
(function(window, chrome, $, undefined) {

var tabs_ = {};
  
var grecipe = {
    
  settings: function(key, opt_value) {
    return storage_("grecipe." + key, opt_value);
  },

  grrMeta: function(id) {
    return grrMeta_(id);
  },
  
  setDefaults: function(update) {
    var defaults = {
      "version": grecipe.manifest.version,
      "openonsave": false,
      "sendanalytics": true,
    };
    
    for (setting in defaults) {
      if (!update ||  grecipe.settings(setting) == undefined) {
        grecipe.settings(setting, defaults[setting]);
      }
    }
    
    if (!update ||  storage_("grrids") == undefined) {
      grrIds_ = [];
      activeGrrs_ = [];
      saveGrr_("plugins/hrecipe.grr");
    }

    if (!update ||  storage_("template") == undefined) {
      $.ajax("templates/default.mus").then(function(template) {
        storage_("template", template);
      });
    }
  },
  
  openTab: function(url, callback) {
    chrome.tabs.create({"url": url}, callback);
  },
  
  hasAuth: function() {
    return gdocs.hasAuth();
  },
  
  authorize: function() {
    return gdocs.authorize();
  },
  
  unauthorize: function() {
    gdocs.unauthorize();
  },
  
  hasDefault: function(tabId) {
    //return (tabs_[tabId].grrs.length == 1);
    return true;
  },
  
  importRecipe: function(tabId, grrId) {
    if (!tabs_[tabId].deferred || tabs_[tabId].deferred.isResolved()) {
      grrId = grrId ? grrId : tabs_[tabId].grrs[0];
      tabs_[tabId].deferred = $.Deferred();
      tabs_[tabId].port.postMessage({
        type: "getrecipe",
        grrId: grrId,
      });
    }
    return tabs_[tabId].deferred.promise();
  },
};

function storage_(key, opt_value) {
  if (opt_value == undefined) {
    try {
      return JSON.parse(localStorage[key]);
    } catch (e) {
      return localStorage[key];
    }
  } else {
    localStorage[key] = JSON.stringify(opt_value);
  }
};

function grrMeta_(id, opt_grrObj) {
  return storage_("grr.meta."+id, opt_grrObj);
};

function grrString_(id, opt_grrStr) {
  return storage_("grr."+id, opt_grrStr);
};

function onConnect_(port) {
  console.assert(port.name == "grecipe");
  var tab = port.sender.tab;
  tabs_[tab.id] = {
    tab: tab,
    port: port,
  };
  port.onMessage.addListener(onMessage_);
  port.onDisconnect.addListener(onDisconnect_);
  
  var loadEvents = [];
  for (var i=0; i<activeGrrs_.length; i++) {
    var grrId = activeGrrs_[i];
    var pattern = grrMeta_(grrId).url;
    if (testUrl_(pattern, tab.url)) {
      var onLoad = $.Deferred();
      chrome.tabs.executeScript(tab.id, {
        code: "loadGrr('" + grrId + "'," + grrString_(grrId) + ");"
      }, onLoad.resolve);
      loadEvents.push(onLoad);
    }
  }
  $.when.apply(null, loadEvents).then(function() {
    port.postMessage({type: "grrloaded"});
  });
};

function onDisconnect_(port) {
  delete tabs_[port.sender.tab.id];
};

function onMessage_(msg, port) {
  var tab = port.sender.tab;
  switch (msg.type) {
    case "hasrecipe":
      onHasRecipe_(tab.id, msg.grrs);
      break;
    case "recipe":
      onRecipe_(tab.id, msg.recipe);
      break;
  }
};

function onRecipe_(tabId, recipe) {
  // Debugging...
  console.log("Recipe:", recipe);
  //return;
  var template = storage_("template");
  var doc = Mustache.to_html(template, recipe);
  gdocs.createDoc(recipe.name, doc, function(resp) {
    tabs_[tabId].deferred.resolveWith(null, [recipe, JSON.parse(resp)]);
  });
};

function onHasRecipe_(tabId, grrs) {
  tabs_[tabId].grrs = grrs;
  chrome.pageAction.show(tabId);
};

function saveGrr_(url) { 
  $.ajax(url).then(function(grr) {
    var id = sha1.toB64(grr);

    for(var i=0; i<grrIds_.length; i++) {
      if (id == grrIds_[i]) { return; }
    }
    
    var grrObj = new Function("return (" + grr + ");")();
    
    grrIds_.push(id);
    storage_("grrids", grrIds_);

    activeGrrs_.push(id);
    storage_("activegrrs", activeGrrs_);

    grrMeta_(id, grrObj);
    grrString_(id, grr);
    
  });
};

function testUrl_(test, url) {
  var specials = new RegExp("[.+?|()\\[\\]{}\\\\]", "g");
  return RegExp("^" + test.replace(specials, "\\$&").replace("*", ".*") + "$").test(url);
};

function setup_(manifest) {
  grecipe.manifest = manifest;
  var oldVersion = grecipe.settings("version");

  // Check if orginal install or version < 1.8.2
  if (oldVersion == undefined) {
    if (localStorage["sendAnalytics"] || localStorage["openOnSave"]) {
      oldVersion = "1.8.1";
    } else {
      grecipe.settings("version", oldVersion = manifest.version);
    }
  }

  if (oldVersion < manifest.version) {
    // Handle update
    if (oldVersion < "1.8.2") {
      grecipe.settings("sendanalytics", localStorage["sendAnalytics"]);
      localStorage.removeItem("sendAnalytics");
      grecipe.settings("openonsave", localStorage["openOnSave"]);
      localStorage.removeItem("openOnSave");
    }
    
    grecipe.settings("version", manifest.version);
  }
  
  chrome.extension.onConnect.addListener(onConnect_);

  // !!!For development!!! Reset Everything.
  //grecipe.setDefaults(true);
  //localStorage.clear();
  grecipe.setDefaults();
};

var grrIds_ = storage_("grrids");
var activeGrrs_ = storage_("activegrrs");

$.getJSON('manifest.json', setup_);

var _grecipe = window.grecipe;
window.grecipe = grecipe;
  
})(this, this.chrome, this.jQuery);
