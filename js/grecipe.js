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

var tabs_ = {},
    recipe_template_,
    loadGrr_template_,
    defaults_,
    manifest_,
    Grr;

var grecipe = {
  settings: function(key, opt_value) {
    return storage_("grecipe." + key, opt_value);
  },
  
  setDefaults: function(update) {
    grecipe.settings("version", manifest_.version);
    
    for (setting in defaults_.settings) {
      if (!update ||  grecipe.settings(setting) == undefined) {
        grecipe.settings(setting, defaults_.settings[setting]);
      }
    }

    var allGrrs = Grr.all();
    allGrrs.count(function(count) {
      if (!update ||  count == 0) {
        allGrrs.destroyAll(function() {
          defaults_.grrs.forEach(function(g) {
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
      tabs_[tabId].deferred = $.Deferred();
      tabs_[tabId].port.postMessage({
        type: "getrecipe",
        grrId: grrId,
      });      
    }
    return tabs_[tabId].deferred.promise();
  },

  log: function() {
    if (grecipe.debug) {
      grecipe.log.history = grecipe.log.history || [];
      grecipe.log.history.push(arguments);
      console.log.apply(console, arguments);
    }
  },

  set debug(val) {
    grecipe.settings("debug", !!val);
  },

  get debug() {
    return grecipe.settings("debug");
  },

  get manifest() {
    return manifest_;
  },

  get defaults() {
    return defaults_;
  }
};

var log_ = grecipe.log;

function storage_(key, opt_value) {
  if (opt_value == undefined) {
    try {
      return JSON.parse(localStorage[key]);
    } catch (e) {
      return localStorage[key];
    }
  } else {
    log_("Storage: '%s' set as", key, opt_value);
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

  port.postMessage({type: "debug", debug: grecipe.debug});
  
  Grr
    .all()
    .filter("active", "=", true)
    .order('priority', true)
    .list(function(results) {
      var matches = results.filter(function(grr) {
        return grr.testUrl(tab.url);
      });

      if (matches.length) {
        port.postMessage({type: "loadgrrs", grrs: matches});
      }
    });
};

function onDisconnect_(port) {
  delete tabs_[port.sender.tab.id];
};

function onMessage_(msg, port) {
  var tab = port.sender.tab;
  log_("Recived Msg:", port, msg);
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
  recipe_template_ = recipe_template_ || Handlebars.compile(storage_("template"));
  var doc = recipe_template_(recipe);
  log_(doc);
  gdocs.createDoc(recipe.name, doc, function(resp) {
    tabs_[tabId].deferred.resolveWith(null, [recipe, JSON.parse(resp)]);
  });
};

function onHasRecipe_(tabId, grrs) {
  tabs_[tabId].grrs = grrs;
  chrome.pageAction.show(tabId);
};

function setup_(manifest, defaults) {
  manifest_ = manifest[0];
  defaults_ = defaults[0];
  Object.freeze(manifest_);
  Object.freeze(defaults_);
  
  grecipe.Grr = Grr = initGrr_();
  
  update_();
  // !!!For development!!! Reset Everything.
  //grecipe.setDefaults(true);  // <--- Change back to this.
  grecipe.setDefaults();

  chrome.extension.onConnect.addListener(onConnect_);
  window.grecipe = grecipe;
};

function update_() {
  var oldVersion = grecipe.settings("version");

  // Check if orginal install or version < 1.8.2
  if (oldVersion == undefined) {
    if (localStorage["sendAnalytics"] || localStorage["openOnSave"]) {
      oldVersion = "1.8.1";
    } else {
      grecipe.settings("version", oldVersion = manifest_.version);
    }
  }

  if (oldVersion < manifest_.version) {
    // Handle update
    if (oldVersion < "1.8.2") {
      grecipe.settings("sendanalytics", localStorage["sendAnalytics"]);
      localStorage.removeItem("sendAnalytics");
      grecipe.settings("openonsave", localStorage["openOnSave"]);
      localStorage.removeItem("openOnSave");
    }
    
    grecipe.settings("version", manifest_.version);
  }
};

function initGrr_() {
  persistence.debug = grecipe.debug != undefined ? !!grecipe.debug : defaults_.debug;
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

  persistence.schemaSync();

  return Grr;
};

$.when($.getJSON('manifest.json'), $.getJSON('defaults.json')).then(setup_);
  
})(this, this.chrome, this.jQuery);
