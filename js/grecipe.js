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
var recipe_template_;
  
var grecipe = {
    
  settings: function(key, opt_value) {
    return storage_("grecipe." + key, opt_value);
  },
  
  setDefaults: function(update) {
    var defaults = {
      "version": grecipe.manifest.version,
      "openonsave": false,
      "sendanalytics": true,
      "grrs": [{
          "file": "plugins/hrecipe.grr",
          "priority": 100
        }, {
          "file": "plugins/epicurious.grr",
          "priority": 10
        }]
    };
    
    for (setting in defaults) {
      if (!update ||  grecipe.settings(setting) == undefined) {
        grecipe.settings(setting, defaults[setting]);
      }
    }

    var allGrrs = Grr.all();
    allGrrs.count(function(count) {
      if (!update ||  count == 0) {
        allGrrs.destroyAll(function() {
          defaults.grrs.map(function(g) {
            Grr.fromUrl(g.file, {
              "priority": g.priority
            }).then(function(grr) {
              persistence.add(grr);
            });
          });
        });
      }
    });

    if (!update ||  storage_("template") == undefined) {
      $.ajax("templates/default.html").then(function(template) {
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
  
  importRecipe: function(tabId, grrId) {
    if (!tabs_[tabId].deferred || tabs_[tabId].deferred.isResolved()) {
      if (grrId == undefined) {
        var grrs = tabs_[tabId].grrs;
        var topGrr = Grr.all().filter('id', '=', grrs[0]);
        for(var i=1; i<grrs.length; i++) {
          var another = new persistence.PropertyFilter('id', '=', grrs[i]);
          topGrr = topGrr.or(another);
        }
        topGrr.order('priority', true).one(function(grr) {
          getRecipe_(tabId, grr.id);
        });
      } else {
        getRecipe_(tabId, grrId);
      }
      //grrId = grrId ? grrId : tabs_[tabId].grrs[0];
      tabs_[tabId].deferred = $.Deferred();
      
    }
    return tabs_[tabId].deferred.promise();
  }
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

function onConnect_(port) {
  console.assert(port.name == "grecipe");
  var tab = port.sender.tab;
  tabs_[tab.id] = {
    tab: tab,
    port: port,
  };
  port.onMessage.addListener(onMessage_);
  port.onDisconnect.addListener(onDisconnect_);
  
  Grr.all().filter("active", "=", true).list(function(results) {
    var loadEvents = [];
    
    results.map(function(grr) {
      if (grr.testUrl(tab.url)) {
        loadEvents.push( grr.load(tab.id) );
      }
    });

    $.when.apply(null, loadEvents).then(function() {
      port.postMessage({type: "grrloaded"});
    });
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

function getRecipe_(tabId, grrId) {
  tabs_[tabId].port.postMessage({
        type: "getrecipe",
        grrId: grrId,
  });
};

function onRecipe_(tabId, recipe) {
  // Debugging...
  console.log("Recipe:", recipe);
  //return;
  recipe_template_ = recipe_template_ | Handlebars.compile(storage_("template"));
  var doc = recipe_template_(recipe);
  gdocs.createDoc(recipe.name, doc, function(resp) {
    tabs_[tabId].deferred.resolveWith(null, [recipe, JSON.parse(resp)]);
  });
};

function onHasRecipe_(tabId, grrs) {
  tabs_[tabId].grrs = grrs;
  chrome.pageAction.show(tabId);
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
  //grecipe.setDefaults(true);  // <--- Change back to this.
  //localStorage.clear();
  grecipe.setDefaults();
};

//persistence.debug = false;
persistence.store.websql.config(persistence, 'grecipe', '', 5 * 1024 * 1024);

var Grr = persistence.define('Grr', {
  name: "TEXT",
  author: "TEXT",
  version: "TEXT",
  url: "TEXT",
  hash: "TEXT",
  script: "TEXT",
  priority: "INT",
  active: "BOOL"
});

Grr.index('hash',{unique:true});
Grr.index(['active', 'priority']);

Grr.fromUrl = function(url, options) {
  options = $.extend({
    "priority": 1000,
    "active": true
  }, options);
  
  var deferred = $.Deferred();
  $.ajax(url).then(function(content) {
    var grr = new Grr();
    grr.script = content;
    
    content = crunch(content);
    grr.hash = sha1.toB64(content);

    var meta = jsonParse(content);
    for (property in meta) {
      grr[property] = meta[property];
    }

    grr.active = options.active;
    grr.priority = options.priority;
    
    deferred.resolve(grr);
  });
  return deferred.promise();
};

Grr.prototype.testUrl = function (url) {
  var temp = this.url;
  var specials = new RegExp("[.+?|()\\[\\]{}\\\\]", "g");
  return RegExp("^" + temp.replace(specials, "\\$&").replace("*", ".*") + "$").test(url);
};

Grr.prototype.load = function (tabId) {
  var onLoad = $.Deferred();
  chrome.tabs.executeScript(tabId, {
      code: "loadGrr('" + this.id + "', (" + this.script + "));"
    }, onLoad.resolve);
  return onLoad.promise();
};

persistence.schemaSync();

$.getJSON('manifest.json', setup_);

grecipe.Grr = Grr;

var _grecipe = window.grecipe;
window.grecipe = grecipe;
  
})(this, this.chrome, this.jQuery);
