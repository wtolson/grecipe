/**
 * Lawnchair
 * =========
 * A lightweight JSON document store.
 *
 */
var Lawnchair = function(opts, cb) {
    if (typeof cb == 'undefined') throw "Please provide a callback as second parameter to Lawnchair constructor; this shit's async, yo.";
    if (!JSON || !JSON.stringify) throw "Native JSON functions unavailable - please include http://www.json.org/json2.js or run on a decent browser :P";
	this.init(opts);
	cb.call(this);
}

Lawnchair.prototype = {
	
	init:function(opts) {
		var adaptors = {
			'webkit':window.WebkitSQLiteAdaptor,
			'gears':window.GearsSQLiteAdaptor,
			'dom':window.DOMStorageAdaptor,
			'cookie':window.CookieAdaptor,
			'air':window.AIRSQLiteAdaptor,
			'userdata':window.UserDataAdaptor,
			'air-async':window.AIRSQLiteAsyncAdaptor,
			'blackberry':window.BlackBerryPersistentStorageAdaptor,
            'couch':window.CouchAdaptor,
            'server':window.ServerAdaptor
		};
		this.adaptor = opts.adaptor ? new adaptors[opts.adaptor](opts) : new DOMStorageAdaptor(opts);
	},
	
	// Save an object to the store. If a key is present then update. Otherwise create a new record.
	save:function(obj, callback) {this.adaptor.save(obj, callback)},
	
	// Invokes a callback on an object with the matching key.
	get:function(key, callback) {this.adaptor.get(key, callback)},

	// Returns whether a key exists to a callback.
	exists:function(callback) {this.adaptor.exists(callback)},
	
	// Returns all rows to a callback.
	all:function(callback) {this.adaptor.all(callback)},
	
	// Removes a json object from the store.
	remove:function(keyOrObj, callback) {this.adaptor.remove(keyOrObj, callback)},
	
	// Removes all documents from a store and returns self.
	nuke:function(callback) {this.adaptor.nuke(callback);return this},
	
	// Returns a page of results based on offset provided by user and perPage option
	paged:function(page, callback) {this.adaptor.paged(page, callback)},
	
	/**
	 * Iterator that accepts two paramters (methods or eval strings):
	 *
	 * - conditional test for a record
	 * - callback to invoke on matches
	 *
	 */
	find:function(condition, callback) {
		var is = (typeof condition == 'string') ? function(r){return eval(condition)} : condition
		  , cb = this.adaptor.terseToVerboseCallback(callback);
	
		this.each(function(record, index) {
			if (is(record)) cb(record, index); // thats hot
		});
	},


	/**
	 * Classic iterator.
	 * - Passes the record and the index as the second parameter to the callback.
	 * - Accepts a string for eval or a method to be invoked for each document in the collection.
	 */
	each:function(callback) {
		var cb = this.adaptor.terseToVerboseCallback(callback);
		this.all(function(results) {
			var l = results.length;
			for (var i = 0; i < l; i++) {
				cb(results[i], i);
			}
		});
	}
// --
};
/**
 * LawnchairAdaptorHelpers
 * =======================
 * Useful helpers for creating Lawnchair stores. Used as a mixin.
 *
 */
var LawnchairAdaptorHelpers = {
	// merging default properties with user defined args
	merge: function(defaultOption, userOption) {
		return (userOption == undefined || userOption == null) ? defaultOption: userOption;
	},

	// awesome shorthand callbacks as strings. this is shameless theft from dojo.
	terseToVerboseCallback: function(callback) {
		return (typeof arguments[0] == 'string') ?
		function(r, i) {
			eval(callback);
		}: callback;
	},

	// Returns current datetime for timestamps.
	now: function() {
		return new Date().getTime();
	},

	// Returns a unique identifier
	uuid: function(len, radix) {
		// based on Robert Kieffer's randomUUID.js at http://www.broofa.com
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [];
		radix = radix || chars.length;

		if (len) {
			for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (var i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8: r];
				}
			}
		}
		return uuid.join('');
	},

	// Serialize a JSON object as a string.
	serialize: function(obj) {
		var r = '';
		r = JSON.stringify(obj);
		return r;
	},

	// Deserialize JSON.
	deserialize: function(json) {
		return eval('(' + json + ')');
	}
};
/**
 * WebkitSQLiteAdaptor
 * ===================
 * Sqlite implementation for Lawnchair.
 *
 */
var WebkitSQLiteAdaptor = function(options) {
	for (var i in LawnchairAdaptorHelpers) {
		this[i] = LawnchairAdaptorHelpers[i];
	}
	this.init(options);
};


WebkitSQLiteAdaptor.prototype = {
	init:function(options) {
		var that = this;
		var merge = that.merge;
		var opts = (typeof arguments[0] == 'string') ? {table:options} : options;

		// default properties
		this.name		= merge('Lawnchair', opts.name	  	);
		this.version	= merge('1.0',       opts.version 	);
		this.table 		= merge('field',     opts.table	  	);
		this.display	= merge('shed',      opts.display 	);
		this.max		= merge(65536,       opts.max	  	);
		this.db			= merge(null,        opts.db		);
		this.perPage    = merge(10,          opts.perPage   );

		// default sqlite callbacks
		this.onError = function(){};
		this.onData  = function(){};

		if("onError" in opts) {
			this.onError = opts.onError;
		}
		
		if(typeof opts.callback !== 'function') opts.callback = function(){};
		
		// error out on shit browsers
		if (!window.openDatabase)
			throw('Lawnchair, "This browser does not support sqlite storage."');
		// instantiate the store
		if(!WebkitSQLiteAdaptor.globaldb) WebkitSQLiteAdaptor.globaldb = openDatabase(this.name, this.version, this.display, this.max);

		this.db = WebkitSQLiteAdaptor.globaldb;

		// create a default database and table if one does not exist
		that.db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS "+ that.table + " (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)", [], opts.callback, that.onError);
		});
	},
	save:function(obj, callback) {
		var that = this;
	
		var update = function(id, obj, callback) {
			that.db.transaction(function(t) {
				t.executeSql(
					"UPDATE " + that.table + " SET value=?, timestamp=? WHERE id=?",
					[that.serialize(obj), that.now(), id],
					function() {
						if (callback != undefined) {
							obj.key = id;
							that.terseToVerboseCallback(callback)(obj);
						}
					},
					that.onError
				);
			});
		};
		var insert = function(obj, callback) {
			that.db.transaction(function(t) {
				var id = (obj.key == undefined) ? that.uuid() : obj.key;
				delete(obj.key);
				t.executeSql(
					"INSERT INTO " + that.table + " (id, value,timestamp) VALUES (?,?,?)",
					[id, that.serialize(obj), that.now()],
					function() {
						if (callback != undefined) {
							obj.key = id;
							that.terseToVerboseCallback(callback)(obj);
						}
					},
					that.onError
				);
			});
		};
		if (obj.key == undefined) {
			insert(obj, callback);
		} else {
			this.get(obj.key, function(r) {
				var isUpdate = (r != null);
	
				if (isUpdate) {
					var id = obj.key;
					delete(obj.key);
					update(id, obj, callback);
				} else {
					insert(obj, callback);
				}
			});
		}
	},
	get:function(key, callback) {
		var that = this;
		this.db.transaction(function(t) {
			t.executeSql(
				"SELECT value FROM " + that.table + " WHERE id = ?",
				[key],
				function(tx, results) {
					if (results.rows.length == 0) {
						that.terseToVerboseCallback(callback)(null);
					} else {
						var o = that.deserialize(results.rows.item(0).value);
						o.key = key;
						that.terseToVerboseCallback(callback)(o);
					}
				},
				this.onError
			);
		});
	},
	all:function(callback) {
		var cb = this.terseToVerboseCallback(callback);
		var that = this;
		this.db.transaction(function(t) {
			t.executeSql("SELECT * FROM " + that.table, [], function(tx, results) {
				if (results.rows.length == 0 ) {
					cb([]);
				} else {
					var r = [];
					for (var i = 0, l = results.rows.length; i < l; i++) {
						var raw = results.rows.item(i).value;
						var obj = that.deserialize(raw);
						obj.key = results.rows.item(i).id;
						r.push(obj);
					}
					cb(r);
				}
			},
			that.onError);
		});
	},
	paged:function(page, callback) {
		var cb = this.terseToVerboseCallback(callback);
		var that = this;
		this.db.transaction(function(t) {
		    var offset = that.perPage * (page - 1); // a little offset math magic so users don't have to be 0-based
		    var sql = "SELECT * FROM " + that.table + " ORDER BY timestamp ASC LIMIT ? OFFSET ?";
			t.executeSql(sql, [that.perPage, offset], function(tx, results) {
				if (results.rows.length == 0 ) {
					cb([]);
				} else {
					var r = [];
					for (var i = 0, l = results.rows.length; i < l; i++) {
						var raw = results.rows.item(i).value;
						var obj = that.deserialize(raw);
						obj.key = results.rows.item(i).id;
						r.push(obj);
					}
					cb(r);
				}
			},
			that.onError);
		});
	},
	remove:function(keyOrObj, callback) {
		var that = this;
        if (callback)
            callback = that.terseToVerboseCallback(callback);
		this.db.transaction(function(t) {
			t.executeSql(
				"DELETE FROM " + that.table + " WHERE id = ?",
				[(typeof keyOrObj == 'string') ? keyOrObj : keyOrObj.key],
				callback || that.onData,
				that.onError
			);
		});
	},
	nuke:function(callback) {
		var that = this;
        if (callback)
            callback = that.terseToVerboseCallback(callback);
		this.db.transaction(function(tx) {
			tx.executeSql(
				"DELETE FROM " + that.table,
				[],
				callback || that.onData,
				that.onError
			);
		});
	}
};
