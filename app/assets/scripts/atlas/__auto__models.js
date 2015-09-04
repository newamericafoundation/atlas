(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Do not bundle researcher.

'use strict';

window.M = {
	base: require('./base.js'),
	project: require('./project.js'),
	projectSection: require('./project_section.js'),
	projectTemplate: require('./project_template.js'),
	item: require('./item.js'),
	variable: require('./variable.js'),
	image: require('./image.js'),
	coreDatum: require('./core_datum.js'),
	filter: require('./filter.js')
};

},{"./base.js":2,"./core_datum.js":5,"./filter.js":6,"./image.js":7,"./item.js":8,"./project.js":9,"./project_section.js":10,"./project_template.js":11,"./variable.js":13}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _backbone = (window.Backbone);

var Backbone = _interopRequireWildcard(_backbone);

var _underscore = (window._);

var _ = _interopRequireWildcard(_underscore);

var _jquery = (window.$);

var _jquery2 = _interopRequireDefault(_jquery);

var Model = Backbone.Model.extend({

	/** 
  * Recognize and process data.
  * @param {object} data - Data as key-value pairs.
  * @returns {object} data - Modified data.
  */
	parse: function parse(data) {
		data = this._adaptMongoId(data);
		return data;
	},

	/*
  * Custom get function, accommodating a suffix, e.g. status_2012.
  * @param {string} field - Same as in Backbone.
  * @param {string} suffix - Custom suffix.
  * @returns {} value
  */
	get: function get(field, suffix) {
		var getFnc = Backbone.Model.prototype.get;
		if (suffix == null) {
			return getFnc.apply(this, [field]);
		}
		return getFnc.apply(this, [field + '_' + suffix]);
	},

	/**
  * Adds fields of a foreign collection, referenced by a foreign id within the model.
  * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
  *                                  the former references a single value, the latter an array.
  * @param {object} foreignCollection
  * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
  * @returns {object} this - The model instance, with 'model_name' field added.
  */
	addForeignField: function addForeignField(foreignIdKey, foreignCollection, fieldKey) {

		var newKey,
		    foreignModel,
		    foreignIds,
		    singleForeignIdKey,
		    // if foreignIdKey holds an array
		foreignFields = [];

		// belongs_to relationship with a single reference id
		if (foreignIdKey.slice(-2) === 'id') {

			newKey = foreignIdKey.slice(0, -2) + fieldKey;
			foreignModel = foreignCollection.findWhere({ id: this.get(foreignIdKey) });
			this.set(newKey, foreignModel.get(fieldKey));

			// has_many relationship with id references embedded in an array field
		} else if (foreignIdKey.slice(-3) === 'ids') {

				foreignIds = this.get(foreignIdKey);

				foreignIds.forEach(function (foreignId) {
					// simple pluralization
					newKey = foreignIdKey.slice(0, -3) + fieldKey + 's';
					foreignModel = foreignCollection.findWhere({ id: foreignId });
					if (foreignModel != null) {
						foreignFields.push(foreignModel.get(fieldKey));
					}
				});

				this.set(newKey, foreignFields);
			}

		return this;
	},

	/**
  * Finds and replaces key.
  * @param {object} data - Data as key-value pairs.
  * @param {string} standardKey
  * @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
  * @returns {boolean} found - Whether the key is found in the data.
  */
	_findAndReplaceKey: function _findAndReplaceKey(data, standardKey, keyFormatList) {
		var found, i, kf, len;
		found = false;
		if (keyFormatList == null) {
			keyFormatList = [standardKey];
		}
		for (i = 0, len = keyFormatList.length; i < len; i++) {
			kf = keyFormatList[i];
			if (data[kf]) {
				found = true;
				if (kf !== standardKey) {
					data[standardKey] = data[kf];
					delete data[kf];
				}
			}
		}
		return found;
	},

	/**
  * Adapts Mongoid ID.
  * @param {object} data - Data as key-value pairs.
  * @returns {object} data - Modified data.
  */
	_adaptMongoId: function _adaptMongoId(data) {
		if (data._id != null) {
			if (data._id.$oid != null) {
				data.id = String(data._id.$oid);
			} else {
				data.id = String(data._id);
			}
			delete data._id;
		} else if (data.id != null && data.id.$oid != null) {
			data.id = String(data.id.$oid);
		}
		return data;
	},

	/**
  * Remove the array wrapper, if response is one-member array.
  * @param {object} resp - Server resonse.
  * @returns {object} resp - Modified response.
  */
	_removeArrayWrapper: function _removeArrayWrapper(resp) {
		if (_.isArray(resp) && resp.length === 1) {
			resp = resp[0];
		}
		return resp;
	},

	/**
  * Remove all line breaks from field.
  * @param {object} resp - Server response.
  * @param {string} key - Response key.
  * @returns {object} resp - Modified response.
  */
	_removeLineBreaks: function _removeLineBreaks(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
		}
		return resp;
	},

	/**
  * Removes all spaces from field.
  * @param {object} resp - Server response.
  * @param {string} key - Response key.
  * @returns {object} resp - Modified response.
  */
	_removeSpaces: function _removeSpaces(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/\s+/g, '');
		}
		return resp;
	},

	/**
  * Process static html on a key.
  * @param {object} resp - Server response.
  * @param {string} key
  * @returns {object} resp - Modified response.
  */
	_processStaticHtml: function _processStaticHtml(resp, key) {
		var $html, html, newHtml;
		html = resp[key];
		$html = (0, _jquery2['default'])(html);
		$html.find('a').attr('target', '_blank');
		newHtml = (0, _jquery2['default'])('<div></div>').append($html.clone()).html();
		resp[key] = newHtml;
		return resp;
	},

	/**
  * Get markdown html.
  * @param {string} key
  * @returns {} newHtml
  */
	getMarkdownHtml: function getMarkdownHtml(key) {
		var $html, md, newHtml;
		md = this.get(key);
		if (md != null) {
			$html = (0, _jquery2['default'])(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = (0, _jquery2['default'])('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	},

	/**
  * Set table of contents for html data under a given key.
  * @param {string} key
  * @param {string} saveKey - Key under which the modified html snippet is placed.
  * @returns {object} this
  */
	setHtmlToc: function setHtmlToc(key, saveKey) {

		var html, $containedHtml, arr;

		saveKey = saveKey || key;

		html = this.get(key);
		if (html == null) {
			return;
		}

		arr = [];

		$containedHtml = (0, _jquery2['default'])('<div></div>').append((0, _jquery2['default'])(html));

		$containedHtml.children().each(function () {

			var $el = (0, _jquery2['default'])(this),
			    tagName = $el.prop('tagName'),
			    content = $el.html(),
			    tocId = content.replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase();

			if (tagName.toLowerCase == null) {
				return;
			}
			tagName = tagName.toLowerCase();

			if (['h1', 'h2'].indexOf(tagName) > -1) {
				(0, _jquery2['default'])('<span id="toc-' + tocId + '"></span>').insertBefore($el);
				arr.push({
					id: tocId,
					tagName: tagName,
					content: content
				});
			}
		});

		this.set(saveKey, $containedHtml.html());
		this.set(saveKey + '_toc', arr);
	}

});

var Collection = Backbone.Collection.extend({

	model: Model,

	buildQueryString: function buildQueryString(query) {

		var queryString = '?';

		if (query == null) {
			return '';
		}

		for (var key in query) {
			var value = query[key];
			queryString += key + '=' + value + '&';
		}

		queryString = queryString.slice(0, -1);

		return queryString;
	},

	// Fetch instances on the client.
	// TODO: customize to include a req object.
	getClientFetchPromise: function getClientFetchPromise(query) {
		var _this = this;

		var isQueried = query != null;

		return new Promise(function (resolve, reject) {

			if (!isQueried) {

				// Small, seeded collections are resolved immediately.
				if (_this.dbSeed) {
					_this.reset(_this.dbSeed);
					return resolve(_this);
				}

				// Cached collections are resolved immediately.
				if (_this.dbCache) {
					_this.reset(_this.dbCache);
					return resolve(_this);
				}
			}

			var url = _this.apiUrl + _this.buildQueryString(query);

			_jquery2['default'].ajax({
				url: url,
				type: 'get',
				success: function success(data) {
					// Set database cache.
					if (!isQueried) {
						_this.dbCache = data;
					}
					_this.reset(data);
					resolve(_this);
				},
				error: function error(err) {
					reject(err);
				}
			});
		});
	},

	/**
  * Recognize and process server response by applying the corresponding model's parse method.
  * @param {object} resp - Server response.
  * @returns {object} resp - Modified response.
  */
	parse: function parse(resp) {
		var i, max, item;
		var model = new this.model(),
		    modelParseMethod = model.parse.bind(model);
		if (modelParseMethod == null) {
			return resp;
		}
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = modelParseMethod(item);
		}
		return resp;
	}

});

module.exports = {
	Model: Model,
	Collection: Collection
};

},{}],3:[function(require,module,exports){
// Compiled from Marionette.Accountant

'use strict';

var Backbone = (window.Backbone),
    _ = (window._),
    $ = (window.$);

exports.Model = Backbone.Model.extend({

    constructor: function constructor() {
        Backbone.Model.apply(this, arguments);
        this.children = [];
        this.doAccounting();
    },

    /*
     * Find key that holds array values within model.
     *
     */
    _getChildrenKey: function _getChildrenKey() {
        var key, ref, value;
        ref = this.attributes;
        for (key in ref) {
            value = ref[key];
            if (_.isArray(value)) {
                return key;
            }
        }
    },

    doAccounting: function doAccounting() {
        var ChildModelConstructor, child, childModel, children, childrenKey, i, j, len, max, results;
        childrenKey = this._getChildrenKey();
        ChildModelConstructor = _.isFunction(this.childModel) ? this.childModel : Backbone.Model;
        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            children = this.get(childrenKey);
            this.unset(childrenKey);
            max = children.length;
            results = [];
            for (i = j = 0, len = children.length; j < len; i = ++j) {
                child = children[i];
                childModel = new ChildModelConstructor(child);
                childModel.parent = this;
                childModel.set('_index', i);
                results.push(this.children.push(childModel));
            }
            return results;
        }
    },

    /*
     * Separate 
     */
    createModelTree: function createModelTree() {
        var self = this,
            ChildModelConstructor,
            childModel,
            children,
            childrenKey;
        childrenKey = this._getChildrenKey();
        ChildModelConstructor = _.isFunction(this.childModel) ? this.childModel : Backbone.Model;
        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            children = this.get(childrenKey);
            this.unset(childrenKey);
            children.forEach(function (child, i) {
                var childModel = new ChildModelConstructor(child);
                childModel.parent = self;
                childModel.set('_index', i);
                self.children.push(childModel);
            });
        }
    },

    toJSON: function toJSON() {
        return Backbone.Model.prototype.toJSON.apply(this);
    },

    toNestedJSON: function toNestedJSON() {
        var child, childrenKey, j, json, len, nestedJson, ref;
        json = this.toJSON();
        if (typeof json['_index'] !== 'undefined') {
            delete json['_index'];
        }
        if (this.children) {
            childrenKey = this.get('_childrenKey');
            json[childrenKey] = [];
            ref = this.children;
            for (j = 0, len = ref.length; j < len; j++) {
                child = ref[j];
                nestedJson = child.toNestedJSON != null ? child.toNestedJSON() : child.toJSON();
                delete nestedJson['_index'];
                json[childrenKey].push(nestedJson);
            }
            delete json['_childrenKey'];
        }
        return json;
    },

    getChildIndex: function getChildIndex() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1;
    },

    getSiblingCount: function getSiblingCount() {
        if (this.parent) {
            return this.parent.children.length;
        }
        return -1;
    },

    getNextSibling: function getNextSibling() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if (ci !== -1 && sc !== -1 && ci < sc) {
            return this.parent.children[ci + 1];
        }
    },

    getPreviousSibling: function getPreviousSibling() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if (ci !== -1 && sc !== -1 && ci > 0) {
            return this.parent.children[ci - 1];
        }
    }

});

},{}],4:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    base = require('./base.js');

exports.Model = base.Model.extend({

	/** Activates model. Takes no collection filter logic into consideration - hence internal only. */
	activate: function activate() {
		return this.set('_isActive', true);
	},

	/** Deactivates model. Takes no collection filter logic into consideration - hence internal only. */
	deactivate: function deactivate() {
		return this.set('_isActive', false);
	},

	/** Toggle the model's active state. */
	toggleActiveState: function toggleActiveState() {
		if (this.isActive()) {
			if (!(this.collection != null && this.collection.hasSingleActiveChild)) {
				return this.deactivate();
			}
		} else {
			this.activate();
			if (this.collection != null && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this);
			}
		}
	},

	/** Get active state. */
	isActive: function isActive() {
		return this.get('_isActive');
	},

	/** 
  * Tests whether a tested model satisfies a belongs_to relation with the model instance under a specified foreign key. 
  * Example: this.get('id') === testedModel.get('user_id') if the foreign key is 'user'.
  * @param {object} testedModel
  * @param {string} foreignKey
  * @returns {boolean}
  */
	test: function test(testedModel, foreignKey) {
		var foreignId, foreignIds, id;
		if (!this.isActive()) {
			return false;
		}
		id = this.get('id');
		// If there is a single id, test for equality.
		foreignId = testedModel.get(foreignKey + '_id');
		if (foreignId != null) {
			return id === foreignId;
		}
		// If there are multiple ids, test for inclusion.
		foreignIds = testedModel.get(foreignKey + '_ids');
		if (foreignIds != null) {
			return foreignIds.indexOf(id) >= 0;
		}
		return false;
	}

});

exports.Collection = base.Collection.extend({

	model: exports.Model,

	/** Initializes active state of the collection's models. */
	initialize: function initialize() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	},

	hasSingleActiveChild: false,

	/**
  * Deactivate all siblings of an active child element.
  * @param {} activeChild - Active child model instance from where the method is usually called
  * @returns {array} results
  */
	deactivateSiblings: function deactivateSiblings(activeChild) {
		var i, len, model, ref, results;
		ref = this.models;
		results = [];
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model !== activeChild) {
				results.push(model.deactivate());
			} else {
				results.push(void 0);
			}
		}
		return results;
	},

	/** 
  * Set and initialize active state of the collection's models. 
  * If the hasSingleActiveChild is set to true on the collection instance, the first model is set as active and all others are set as inactive.
  * Otherwise, all models are set as active. 
  */
	initializeActiveStates: function initializeActiveStates() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : index === 0 ? true : false);
		}
		return this.trigger('initialize:active:states');
	},

	/**
  * 
  * @param {object} testedModel - 
  * @param {string} foreignKey - 
  * @returns {boolean}
  */
	test: function test(testedModel, foreignKey) {
		var i, len, model, ref;
		ref = this.models;
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model.test(testedModel, foreignKey)) {
				return true;
			}
		}
		return false;
	}

});

},{"./base.js":2}],5:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    base = require('./base.js');

exports.Model = base.Model.extend({

	urlRoot: '/api/v1/core_data',

	/** 
  * Fetches core data model url by name key 
  * @returns {string} - Url plus name
  */
	url: function url() {
		return this.urlRoot + ("?name=" + this.get('name'));
	},

	/** URL METHOD REWRITTEN ABOVE BY JM TO MIRROR IMAGE.JS URL METHOD FORMAT */
	// url: function() {
	// 	return this.urlRoot + "?" + $.param({
	// 		name: this.get('name')
	// 	});
	// },

	/** 
  * Recognize and process server response.
  * @param {object} resp - Server response.
  * @returns {object} resp - Modified response.
  */
	parse: function parse(resp) {
		return resp = this._removeArrayWrapper(resp);
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: 'api/v1/core_data'
});

},{"./base.js":2}],6:[function(require,module,exports){
'use strict';

var base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
    baseComposite = require('./base_composite.js');

var LocalBaseModel = baseComposite.Model.extend({

    isActive: function isActive() {
        return this.get('_isActive');
    },

    activate: function activate() {
        this.set('_isActive', true);
        return this;
    },

    deactivate: function deactivate() {
        this.set('_isActive', false);
        return this;
    },

    toggle: function toggle() {
        this.set('_isActive', !this.isActive());
        return this;
    },

    activateAllChildren: function activateAllChildren() {
        this.children.forEach(function (child) {
            child.activate();
        });
        return this;
    },

    deactivateAllChildren: function deactivateAllChildren() {
        this.children.forEach(function (child) {
            child.deactivate();
        });
        return this;
    },

    toggleAllChildren: function toggleAllChildren() {
        this.children.forEach(function (child) {
            child.toggle();
        });
        return this;
    },

    /*
     * Deactivate all siblings, not including self.
     *
     */
    deactivateSiblings: function deactivateSiblings() {
        var self = this,
            siblingsIncludingSelf;
        if (this.parent == null) {
            return;
        }
        siblingsIncludingSelf = this.parent.children;
        siblingsIncludingSelf.forEach(function (sibling) {
            if (sibling !== self) {
                sibling.deactivate();
            }
        });
    },

    /*
     * Get sibling index.
     *
     */
    getSiblingIndex: function getSiblingIndex() {
        var siblingsIncludingSelf = this.parent.children;
        return siblingsIncludingSelf.indexOf(this);
    },

    /* 
     * If every sibling in order got integer indeces between 1 and n, interpolate for instance.
     * @param {number} n - Top friendly integer.
     * @returns {number}
     */
    getFriendlySiblingIndex: function getFriendlySiblingIndex(n) {
        var i = this.getSiblingIndex(),
            max = this.getSiblingCountIncludingSelf();
        return Math.round(i * (n - 1) / (max - 1) + 1);
    },

    getSiblingCountIncludingSelf: function getSiblingCountIncludingSelf() {
        return this.parent.children.length;
    }

});

// Copied from client.

exports.FilterValue = LocalBaseModel.extend({

    test: function test(d, options) {
        var j, key, len, res, val, value;
        if (d == null) {
            return false;
        }
        if (!this.get('_isActive') && !(options != null && options.ignoreState)) {
            return false;
        }
        res = false;
        key = this.parent.get('variable_id');
        value = d[key];
        if (!_.isArray(value)) {
            value = [value];
        }
        for (j = 0, len = value.length; j < len; j++) {
            val = value[j];
            res = res || this.testValue(val);
        }
        return res;
    },

    testValue: function testValue(value) {
        var res;
        res = false;
        if (this._isNumericFilter()) {
            if (value < this.get('max') && value >= this.get('min')) {
                res = true;
            }
        } else {
            if (value === this.get('value')) {
                res = true;
            }
        }
        return res;
    },

    _isNumericFilter: function _isNumericFilter() {
        return this.get('min') != null && this.get('max') != null;
    },

    isParentActive: function isParentActive() {
        return this.parent === this.parent.parent.getActiveChild();
    },

    handleClick: function handleClick() {
        var activeKeyIndex, keyIndex;
        this.toggle();
        keyIndex = this.parent.get('_index');
        return activeKeyIndex = this.parent.parent.get('activeIndex');
    }

});

exports.FilterKey = LocalBaseModel.extend({

    childModel: exports.FilterValue,

    /*
     * Toggle item as it were 'clicked on'. 
     * If the value is being activated, all its siblings need to be deactivated.
     *
     */
    clickToggle: function clickToggle() {
        if (this.isActive()) {
            return;
        } else {
            this.deactivateSiblings();
            this.activate();
        }
    },

    /*
     * When deactivating, activate all children back.
     *
     */
    deactivate: function deactivate() {
        this.set('_isActive', false);
        this.children.forEach(function (childModel) {
            childModel.activate();
        });
        return this;
    },

    toggleOne: function toggleOne(childIndex) {
        return this.children[childIndex].toggle();
    },

    getValueIndeces: function getValueIndeces(model) {
        var child, data, dataIndeces, i, j, len, ref;
        data = model != null && _.isFunction(model.toJSON) ? model.toJSON() : model;
        dataIndeces = [];
        ref = this.children;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            child = ref[i];
            if (child.test(data)) {
                dataIndeces.push(i);
            }
        }
        return dataIndeces;
    },

    getValue: function getValue(index) {
        return this.children[index].get('value');
    },

    test: function test(data, options) {
        var child, j, len, ref, result;
        result = false;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            if (child.test(data, options)) {
                result = true;
            }
        }
        return result;
    }

});

exports.FilterTree = LocalBaseModel.extend({

    childModel: exports.FilterKey,

    test: function test(data) {
        return this.getActiveChild().test(data);
    },

    /*
     * 
     *
     */
    setActiveChildByIndex: function setActiveChildByIndex(activeChildIndex) {
        if (this.children[activeChildIndex] !== this.getActiveChild()) {
            this.getActiveChild().deactivate();
            this.children[activeChildIndex].activate();
            return true;
        }
        return false;
    },

    /*
     * Return active child.
     *
     */
    getActiveChild: function getActiveChild() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            if (child.isActive()) {
                return child;
            }
        }
    },

    /*
     * Get 
     *
     */
    getMatchingValue: function getMatchingValue(model) {
        var ind;
        ind = this.getValueIndeces(model)[0];
        if (this.getActiveChild().children[ind] == null) {
            return;
        }
        return this.getActiveChild().children[ind].get('value');
    },

    /*
     *
     *
     */
    getValueCountOnActiveKey: function getValueCountOnActiveKey() {
        return this.getActiveChild().children.length;
    },

    getValueIndeces: function getValueIndeces(model) {
        var ach;
        ach = this.getActiveChild();
        return ach.getValueIndeces(model);
    },

    /*
     * Get 'friendly', integer-formatted key and value indeces, used for coloring.
     *
     */
    getFriendlyIndeces: function getFriendlyIndeces(model, scaleMax) {
        var maxIndex, valueIndeces;
        valueIndeces = this.getValueIndeces(model);
        maxIndex = this.getValueCountOnActiveKey();
        return valueIndeces.map(function (valIndex) {
            var friendlyIndex;
            friendlyIndex = Math.round(valIndex * (scaleMax - 1) / (maxIndex - 1) + 1);
            return friendlyIndex;
        });
    }

});

},{"./../utilities/formatters.js":14,"./base.js":2,"./base_composite.js":3}],7:[function(require,module,exports){
'use strict';

var base = require('./base.js');

exports.Model = base.Model.extend({

	fields: [],

	/**
  * Recognize and process server response.
  * @param {object} resp - Server response.
  * @return {object} resp - Modified response.
  */
	parse: function parse(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},

	/** Gets encoded url to use as a CSS background-image. */
	getUrl: function getUrl() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},

	/** Gets html attribute. */
	getAttributionHtml: function getAttributionHtml() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({

	model: exports.Model,

	apiUrl: '/api/v1/images'

});

},{"./base.js":2}],8:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    base = require('./base.js'),
    rgf = require('./rich_geo_feature.js'),
    states = require('./../../db/seeds/states.json');

var indexOf = [].indexOf || function (item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

/** 
 * @constructor
 * Note on methods toLatLongPoint, toRichGeoJson: these methods assume that the model instance has a lat and long fields. 
 */
exports.Model = base.Model.extend({
	/** 
  * Recognize and process data.
  * @param {object} data
  * @returns {object} data - Modified data.
  */
	parse: function parse(data) {
		this._processValues(data);
		this._checkPindrop(data);
		this._checkState(data);
		return data;
	},

	/** 
  * Splits up values separated by '|' and removes leading and trailing whitespaces.
  * Values are not split if there is a return character (assume text).
  * Values are converted into arrays only if there is a '|' character.
  * @param {object} data - Data object with key-value pairs.
  * @returns {object} data - Modified data.
  */
	_processValues: function _processValues(data) {
		var key, value;
		for (key in data) {
			value = data[key];
			if (_.isString(value)) {
				if (value.indexOf("|") > -1 && value.indexOf("\n") === -1) {
					data[key] = _.map(value.split('|'), function (item) {
						return item.trim();
					});
				} else {
					data[key] = value.trim();
				}
			}
		}
		return data;
	},

	/** 
  * Recognizes, validates and returns a pindrop item.
  * @param {object} data
  * @returns {object} - Validation summary object.
  */
	_checkPindrop: function _checkPindrop(data) {
		var errors, foundLat, foundLong;
		errors = [];
		foundLat = this._findAndReplaceKey(data, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
		foundLong = this._findAndReplaceKey(data, 'long', ['longitude', 'Longitude', 'long', 'Long']);
		if (foundLat && foundLong) {
			data._itemType = 'pindrop';
			return {
				recognized: true,
				errors: []
			};
		} else if (foundLat || foundLong) {
			return {
				recognized: true,
				errors: ['Latitude or longitude not found.']
			};
		}
		return {
			recognized: false
		};
	},

	/** 
  * Recognizes, validates and returns a US state.
  * @param {object} data
  * @returns {object} - Validation summary object.
  */
	_checkState: function _checkState(data) {
		var errors, stateData;
		errors = [];
		if (data.name != null) {
			stateData = _.where(states, {
				name: data.name
			});
			if (stateData != null && stateData.length > 0) {
				data.id = stateData[0].id;
				data.code = stateData[0].code;
				data._itemType = 'state';
			} else {
				errors.push(data.name + ' not recognized as a state. Possibly a typo.');
			}
			return {
				recognized: true,
				errors: errors
			};
		}
		return {
			recognized: false
		};
	},

	/** 
  * Get and format image name.
  * @returns {string} name - Lower-cased name without line breaks.
  */
	getImageName: function getImageName() {
		if (this.get('image') != null) {
			return this.get('image');
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
	},

	/** 
  * Sets latitude and longitude as a simple array.
  * @returns {array} - Spatial data point as simple array [Lat, Long].
  */
	toLatLongPoint: function toLatLongPoint() {
		var lat, long;
		lat = this.get('lat');
		long = this.get('long');
		if (lat == null) {
			lat = -37.8602828;
		}
		if (long == null) {
			long = 145.0796161;
		}
		return [lat, long];
	},

	/** 
  * Reverses [Lat, Long] point and sets longitude and latitude as a simple array.
  * @returns {array} - Spatial data point as simple array [Long, Lat].
  */
	toLongLatPoint: function toLongLatPoint() {
		return this.toLatLongPoint().reverse();
	},

	/**
  * Creates geoJson object from current model.
  * @returns {object} geoJson.
  */
	toRichGeoJsonFeature: function toRichGeoJsonFeature() {
		var geoJson;
		geoJson = {
			type: 'Feature',
			_model: this,
			geometry: {
				type: 'Point',
				coordinates: this.toLongLatPoint()
			}
		};
		return geoJson;
	},

	/**
  * Returns display state.
  * @param {}
  * @returns {string} displayState - Element of [ 'neutral', 'highlighted', 'inactive' ]
  */
	getDisplayState: function getDisplayState(filter, searchTerm, currentDisplayMode) {

		var filterIndeces, valueHoverIndex, isFiltered;

		if (currentDisplayMode === 'filter') {

			filterIndeces = filter.getValueIndeces(this);
			valueHoverIndex = filter.state.valueHoverIndex;
			isFiltered = filterIndeces.length > 0;

			if (!isFiltered) {
				return 'inactive';
			}

			if (filterIndeces.indexOf(valueHoverIndex) > -1) {
				return 'highlighted';
			}

			return;
		}

		if (this.matchesSearchTerm(searchTerm)) {
			return 'neutral';
		}
		return 'inactive';
	},

	/** 
  * Returns layer classnames to be applied on the model.
  * Classnames consist of group classes and element classes.
  * Group classes specifiy generic styles such as highlighted, inactive, neutral.
  * Element classes style components of the graphics corresponding to the item. E.g. map-pin dividers
  * @param {object} filter - Filter object.
  * @param {object} valueHoverIndex - Index of hovered value.
  * @param {string} searchTerm
  * @param {string} baseClass - Base class.
  * @param {} currentDisplayMode
  * @returns {object} layerClasses - Object with three keys: group, element base, and elements (array)
  */
	getLayerClasses: function getLayerClasses(filter, searchTerm, baseClass, currentDisplayMode) {

		var filterIndeces, layerClasses, displayState;

		if (baseClass == null) {
			baseClass = 'map-region';
		}

		layerClasses = {
			group: baseClass,
			elementBase: baseClass + '__element'
		};

		displayState = this.getDisplayState(filter, searchTerm, currentDisplayMode);
		if (displayState != null) {
			layerClasses.group += ' ' + baseClass + '--' + displayState;
		}

		return layerClasses;
	},

	/** 
  * Evaluates whether the name attribute matches a search term.
  * @param {string} searchTerm
  * @returns {boolean} - Match result.
  */
	matchesSearchTerm: function matchesSearchTerm(searchTerm) {
		var name;
		name = this.get('name');
		if (searchTerm == null || searchTerm.toLowerCase == null) {
			return false;
		}
		if (name == null || name.toLowerCase == null) {
			return false;
		}
		if (searchTerm === "") {
			return true;
		}
		name = name.toLowerCase();
		searchTerm = searchTerm.toLowerCase();
		if (name === "") {
			return false;
		}
		if (name.indexOf(searchTerm) === -1) {
			return false;
		}
		return true;
	}

});

exports.Collection = base.Collection.extend({
	model: exports.Model,

	/** 
  * Gets item type first model in a collection.
  * @returns {string} itemType
  */
	getItemType: function getItemType() {
		var itemType;
		itemType = this.models[0].get('_itemType');
		return itemType;
	},

	/** 
  * Set active model under collection active field.
  * @param {} activeModel - Active model or its id.
  * @returns {object} this
  */
	setActive: function setActive(activeModel) {
		var id;
		if (_.isObject(activeModel) && indexOf.call(this.models, activeModel) >= 0) {
			this.active = activeModel;
		} else {
			id = parseInt(activeModel, 10);
			this.active = id === -1 ? void 0 : this.findWhere({
				id: id
			});
		}
		return this;
	},

	/** 
  * Set hovered model under collection hovered field.
  * @param {} hoveredModel - Hovered model or its id.
  * @returns {object} this
  */
	setHovered: function setHovered(hoveredModel) {
		var id;
		if (_.isObject(hoveredModel) && indexOf.call(this.models, hoveredModel) >= 0) {
			this.hovered = hoveredModel;
		} else {
			id = parseInt(hoveredModel, 10);
			this.hovered = id === -1 ? undefined : this.findWhere({
				id: id
			});
		}
		return this;
	},

	/** 
  * Gets lists of values for a given key.
  * @param {string} key - Any key in models.
  * @returns {array} valueList - List of values for specified key.
  */
	getValueList: function getValueList(key) {
		var j, l, len, len1, model, ref, val, value, valueList;
		valueList = [];
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			value = model.get(key);
			if (_.isArray(value)) {
				for (l = 0, len1 = value.length; l < len1; l++) {
					val = value[l];
					if (indexOf.call(valueList, val) < 0) {
						valueList.push(val);
					}
				}
			} else {
				if (indexOf.call(valueList, value) < 0) {
					valueList.push(value);
				}
			}
		}
		return valueList;
	},

	/** TODO: Gets value list sorted by frequency in the data. */
	getSortedValueList: function getSortedValueList(key) {},

	/** 
  * Assumes the model has a latitude and longitude fields.
  * Must first go through parse method to make sure these fields are named correctly.
  * @returns {array} array of arrays - Latitude and longitude bounds, two arrays with two elements each.
  */
	getLatLongBounds: function getLatLongBounds() {
		var j, lat, len, long, maxLat, maxLong, minLat, minLong, model, ref;
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			lat = model.get('lat');
			long = model.get('long');
			if (typeof minLat === "undefined" || minLat === null || minLat > lat) {
				minLat = lat;
			}
			if (typeof maxLat === "undefined" || maxLat === null || maxLat < lat) {
				maxLat = lat;
			}
			if (typeof minLong === "undefined" || minLong === null || minLong > long) {
				minLong = long;
			}
			if (typeof maxLong === "undefined" || maxLong === null || maxLong < long) {
				maxLong = long;
			}
		}
		return [[minLat, minLong], [maxLat, maxLong]];
	},

	/** 
  * Creates single array from lat, long arrays of each model into one array (array of arrays).
  * @returns {array} res - Returns array of arrays. E.g. [[lat, long], [lat, long]]
  */
	toLatLongMultiPoint: function toLatLongMultiPoint() {
		var j, len, model, ref, res;
		res = [];
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			res.push(model.toLatLongPoint());
		}
		return res;
	},

	richGeoJsonBuilders: {

		state: function state(collection, baseGeoData) {
			var data, richGeoJson, setup;
			richGeoJson = new rgf.Collection();
			setup = function (data) {
				var feature, item, j, len, ref;
				richGeoJson.features = topojson.feature(data, data.objects.states).features;
				ref = richGeoJson.features;
				for (j = 0, len = ref.length; j < len; j++) {
					feature = ref[j];
					item = collection.findWhere({
						id: feature.id
					});
					feature._model = item;
				}
				return richGeoJson.trigger('sync');
			};
			setup(baseGeoData);
			return richGeoJson;
		},

		pindrop: function pindrop(collection) {
			var item, j, len, ref, richGeoJson;
			richGeoJson = new rgf.Collection();
			ref = collection.models;
			for (j = 0, len = ref.length; j < len; j++) {
				item = ref[j];
				richGeoJson.features.push(item.toRichGeoJsonFeature());
			}
			richGeoJson.trigger('sync');
			return richGeoJson;
		}

	},

	/** 
  * The feature is either ready to use or triggers a sync event on itself once it is.
  * @returns {} - Generic Rich GeoJson feature.
  */
	getRichGeoJson: function getRichGeoJson(baseGeoData) {
		var type;
		type = this.getItemType();
		return this.richGeoJsonBuilders[type](this, baseGeoData);
	}

});

},{"./../../db/seeds/states.json":17,"./base.js":2,"./rich_geo_feature.js":12}],9:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    formatters = require('./../utilities/formatters.js'),
    base = require('./base.js'),
    filter = require('./filter.js'),
    variable = require('./variable.js'),
    item = require('./item.js');

exports.Model = base.Model.extend({

    fields: [{
        id: 'title',
        formComponentName: 'Text',
        formComponentProps: {
            id: 'title',
            labelText: 'Project Title',
            hint: '',
            placeholder: 'Enter Project Title'
        }
    }, {
        id: 'author',
        formComponentName: 'Text',
        formComponentProps: {
            id: 'author',
            labelText: 'Author',
            hint: '',
            placeholder: 'Enter Author'
        }
    }, {
        id: 'is_section_overview',
        formComponentName: 'Radio',
        formComponentProps: {
            id: 'is_section_overview',
            labelText: 'Is section overview.',
            hint: 'Each section has one overview project - check if this is one of them:',
            options: ['Yes', 'No'],
            defaultOption: 'Yes'
        }
    }, {
        id: 'is_live',
        formComponentName: 'Radio',
        formComponentProps: {
            id: 'is_live',
            labelText: 'Is live.',
            hint: 'Please specify whether this project is viewable on the live site. Changes take effect immediately.',
            options: ['Yes', 'No'],
            defaultOption: 'Yes'
        }
    }, {
        id: 'project_section_ids',
        name: 'Project Sections',
        formComponentName: 'MultipleSelect',
        foreignModelName: 'ProjectSection',
        formComponentProps: {
            id: 'project_section_ids',
            labelText: 'Project Sections',
            hint: ''
        }
    }, {
        id: 'project_template_id',
        formComponentName: 'SingleSelect',
        formComponentProps: {
            id: 'project_template_id',
            labelText: 'Project Template',
            hint: 'Determines how data is displayed, e.g. Explainer'
        },
        foreignModelName: 'ProjectTemplate'
    }, {
        id: 'tags',
        formComponentName: 'SelectizeText',
        formComponentProps: {
            id: 'tags',
            labelText: 'Tags',
            hint: 'Tags'
        }
    }, {
        id: 'body_text',
        formComponentName: 'CKEditor',
        formComponentProps: {
            id: 'body_text',
            labelText: 'Body Text'
        }
    }, {
        id: 'data',
        formComponentName: 'SpreadsheetFile',
        formComponentProps: {
            id: 'data',
            labelText: 'Data file',
            hint: '',
            worksheets: ['data', 'variables']
        }
    }, {
        id: 'image',
        formComponentName: 'ImageFile',
        formComponentProps: {
            id: 'image',
            labelText: 'Image File',
            hint: ''
        }
    }, {
        id: 'image_credit',
        formComponentName: 'Text',
        formComponentProps: {
            id: 'image_credit',
            labelText: 'Image Credit',
            hint: "Single URL or Markdown, e.g. 'Image supplied by [Image Corporation](http://www.imgcrp.com)':"
        }
    }],

    urlRoot: '/api/v1/projects',

    /** API queries that need to be handled custom. For every key, there is a this.is_#{key} method that filters a model. */
    customQueryKeys: ['related_to'],

    /** 
     * Returns the URL of the Atlas API that holds the data for the project. 
     * @returns {string} url
     */
    url: function url() {
        return this.urlRoot + ("?atlas_url=" + this.get('atlas_url'));
    },

    /** 
     * Returns the URL of the Build.Atlas API that holds the data for the project. 
     * @returns {string} buildUrl
     */
    buildUrl: function buildUrl() {
        return "http://build.atlas.newamerica.org/projects/" + this.get('id') + "/edit";
    },

    /** 
     * Conversts model object to json
     * Checks if it has mandatory fields (id and more than one key). 
     * returns {boolean} - Whether madatory fields exist
     */
    exists: function exists() {
        var json, key, keyCount;
        keyCount = 0;
        json = this.toJSON();
        for (key in json) {
            keyCount += 1;
        }
        return keyCount !== 1 && json.id != null;
    },

    /**
     * Recognize and process JSON data.
     * @param {object} resp - JSON response.
     * @returns {object} resp - Modified JSON response.
     */
    parse: function parse(resp) {
        resp = this._adaptMongoId(resp);
        resp = this._removeArrayWrapper(resp);
        resp = this._removeSpaces(resp, 'template_name');
        resp = this._processStaticHtml(resp, 'body_text');
        return resp;
    },

    getImageUrl: function getImageUrl() {
        var encodedImage = this.get('encoded_image');
        if (encodedImage == null) {
            return;
        }
        encodedImage = encodedImage.replace(/(\r\n|\n|\r)/gm, '');
        if (encodedImage.indexOf('base64') > -1) {
            return "url(" + encodedImage + ")";
        }
        return "url('data:image/png;base64," + encodedImage + "')";
    },

    /** 
     * Filters a project by two filterable collections that it belongs to.
     * @param {object} projectSections
     * @param {object} projectTemplates
     * @returns {boolean} filter - Whether both project sections and templates are in filter variable.
     */
    compositeFilter: function compositeFilter(projectSections, projectTemplates) {
        var filter, sectionsFilter, templatesFilter;
        sectionsFilter = this.filter(projectSections, 'project_section');
        templatesFilter = this.filter(projectTemplates, 'project_template');
        filter = sectionsFilter && templatesFilter;
        return filter;
    },

    /*
     * Custom query method to find related projects based on tags.
     * @param {string} project - Project Id.
     * @returns {boolean} - Related status.
     */
    isRelatedTo: function isRelatedTo(project) {
        var self = this,
            prj,
            tags0,
            tags1,
            i,
            max;
        if (this === project) {
            return false;
        }
        tags0 = this.get('tags');
        tags1 = project.get('tags');
        if (tags0 === '' || tags1 === '') {
            return false;
        }
        tags0 = tags0.split(',');
        tags1 = tags1.split(',');
        for (i = 0, max = tags0.length; i < max; i += 1) {
            if (tags1.indexOf(tags0[i]) > -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * Filter collection by its foreign key.
     * @param {object} collection
     * @param {string} foreignKey
     * @returns {boolean}
     */
    filter: function filter(collection, foreignKey) {
        if (collection != null && collection.test != null) {
            return collection.test(this, foreignKey);
        }
        return true;
    },

    /** Get imgage attribution html. */
    getImageAttributionHtml: function getImageAttributionHtml() {
        return this.getMarkdownHtml('image_credit');
    },

    /** If there is a data field, convert to appropriate collections. */
    buildData: function buildData() {
        var data;
        data = this.get('data');
        if (data != null) {
            data.variables = new variable.Collection(data.variables, {
                parse: true
            });
            data.items = new item.Collection(data.items, {
                parse: true
            });
            this.buildFilterTree();
        }
    },

    buildFilterTree: function buildFilterTree(items, variables, filters) {

        var self = this,
            filterTree,
            filterVariables,
            data = this.get('data'),
            items = data.items,
            variables = data.variables,
            filters = data.filters;

        if (filters == null) {
            filters = [];
        }

        var fv = variables.getFilterVariables();

        filterVariables = fv.map(function (variable, index) {

            var formatter, nd, o, variable;

            if (variable.get('format') != null) {
                formatter = formatters[variable.get('format')];
            }

            o = {
                variable: variable,
                variable_id: variable.get('id'),
                display_title: variable.get('display_title'),
                short_description: variable.get('short_description'),
                long_description: variable.getMarkdownHtml('long_description'),
                type: variable.get('filter_type'),
                _isActive: index === 0 ? true : false
            };

            nd = variable.get('numerical_filter_dividers');

            if (nd != null) {
                o.values = variable.getNumericalFilter(formatter);
            } else {
                o.values = _.map(items.getValueList(variable.get('id')), function (item) {
                    if (formatter != null) {
                        item = formatter(item);
                    }
                    return {
                        value: item
                    };
                });
            }

            _.map(o.values, function (val) {
                val._isActive = true;
                return val;
            });

            return o;
        });

        filterTree = {
            variables: filterVariables
        };

        data.filter = new filter.FilterTree(filterTree);
        data.filter.state = {};
    },

    /**
     * Prepares model on the client.
     * @param {object} App - Marionette application instance. 
     */
    prepOnClient: function prepOnClient() {
        this.buildData();
        this.setHtmlToc('body_text');
    }

});

exports.Collection = base.Collection.extend({

    dbCollection: 'projects',

    apiUrl: '/api/v1/projects',

    model: exports.Model,

    /**
     * Used to compare two models when sorting.
     * @param {object} model1
     * @param {object} model2
     * @returns {number} comparator - A comparator whose sign determines the sorting order.
     */
    comparator: function comparator(model1, model2) {
        var i1, i2;
        i1 = model1.get('is_section_overview') === 'Yes' ? 10 : 0;
        i2 = model2.get('is_section_overview') === 'Yes' ? 10 : 0;
        if (model1.get('title') < model2.get('title')) {
            i1 += 1;
        } else {
            i2 += 1;
        }
        return i2 - i1;
    },

    /** 
     * Filter all children by project sections and templates.
     * @param {collection} projectSections
     * @param {collection} projectTemplates
     * @returns {object} this
     */
    filter: function filter(projectSections, projectTemplates) {
        var i, len, model, ref;
        if (projectSections.models == null || projectSections.models.length === 0) {
            return;
        }
        if (projectTemplates.models == null || projectTemplates.models.length === 0) {
            return;
        }
        if (this.models.length === 0) {
            return;
        }
        ref = this.models;
        for (i = 0, len = ref.length; i < len; i++) {
            model = ref[i];
            model.compositeFilter(projectSections, projectTemplates);
        }
        return this;
    },

    /**
     * Recognize and process server response.
     * @param {object} resp - Server response.
     * @returns {object} resp - Modified response.
     */
    parse: function parse(resp) {
        var i, max, item;
        if (exports.Model.prototype.parse == null) {
            return resp;
        }
        for (i = 0, max = resp.length; i < max; i += 1) {
            item = resp[i];
            resp[i] = exports.Model.prototype.parse(item);
        }
        return resp;
    }

});

},{"./../utilities/formatters.js":14,"./base.js":2,"./filter.js":6,"./item.js":8,"./variable.js":13}],10:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    baseFilter = require('./base_filter'),
    seed = require('./../../db/seeds/project_sections.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

exports.Collection = baseFilter.Collection.extend({

	dbCollection: 'project_sections',

	dbSeed: seed,

	model: exports.Model,

	url: '/api/v1/project_sections',

	hasSingleActiveChild: false,

	initializeActiveStatesOnReset: true,

	initialize: function initialize() {
		this.reset(seed);
	}

});

},{"./../../db/seeds/project_sections.json":15,"./base_filter":4}],11:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    baseFilter = require('./base_filter.js'),
    seed = require('./../../db/seeds/project_templates.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_templates'
});

exports.Collection = baseFilter.Collection.extend({

	dbCollection: 'project_templates',

	dbSeed: seed,

	model: exports.Model,

	url: '/api/v1/project_templates',

	hasSingleActiveChild: true,

	initializeActiveStatesOnReset: true,

	comparator: 'order',

	initialize: function initialize() {
		this.reset(seed);
	}

});

},{"./../../db/seeds/project_templates.json":16,"./base_filter.js":4}],12:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone);

exports.Model = Backbone.Model.extend({});

exports.Collection = Backbone.Collection.extend({

	initialize: function initialize() {
		_.extend(this, Backbone.Events);
		this.type = 'FeatureCollection';
		return this.features = [];
	},

	model: exports.Model,

	onReady: function onReady(next) {
		if (this.features.length > 0) {
			next();
			return;
		}
		return this.on('sync', next);
	}

});

},{}],13:[function(require,module,exports){
'use strict';

var _ = (window._),
    Backbone = (window.Backbone),
    base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
    $ = (window.$);

exports.Model = base.Model.extend({

    /*
     * Return the field of an item corresponding to the variable, applying 
     * formatting as needed.
     * @param {object} item
     * @returns {string} formattedField
     */
    getFormattedField: function getFormattedField(item) {
        var rawField = item.get(this.get('id')),
            format = this.get('format');
        if (format == null || formatters[format] == null) {
            return rawField;
        }
        return formatters[format](rawField);
    },

    /*
        * Set a numerical filter, splitting up |10|20|30| type numerical divider strings into
        *   presentable and testable objects. See specs for example.
        * @param {function} formatter - Optional formatter function for values.
        */
    getNumericalFilter: function getNumericalFilter(formatter) {

        var i,
            len,
            numericalFilter,
            values,
            numericalDividers = this.get('numerical_filter_dividers');

        if (formatter == null) {
            formatter = formatters['number'];
        }

        values = _.map(numericalDividers.split('|'), function (member, index) {
            if (member === "") {
                if (index === 0) {
                    return -1000000000;
                }
                return +1000000000;
            }
            return parseInt(member, 10);
        });

        numericalFilter = [];

        for (i = 0, len = values.length; i < len - 1; i += 1) {
            numericalFilter.push(this.getNumericalFilterValue(values[i], values[i + 1], formatter));
        }

        return numericalFilter;
    },

    /*
     * Returns single numerical filter value.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @param {function} formatter - Formatter function.
     * @returns {object}
     */
    getNumericalFilterValue: function getNumericalFilterValue(min, max, formatter) {
        var filterValue, maxDisplay, minDisplay;
        filterValue = {
            min: min,
            max: max
        };
        minDisplay = min;
        maxDisplay = max;
        minDisplay = formatter(minDisplay);
        maxDisplay = formatter(maxDisplay);
        if (min === -1000000000) {
            filterValue.value = "Less than " + maxDisplay;
        } else if (max === +1000000000) {
            filterValue.value = "Greater than " + minDisplay;
        } else {
            filterValue.value = "Between " + minDisplay + " and " + maxDisplay;
        }
        return filterValue;
    }

});

exports.Collection = base.Collection.extend({

    model: exports.Model,

    getFilterVariables: function getFilterVariables() {
        var models;
        models = this.filter(function (item) {
            return item.get('filter_menu_order') != null;
        });
        models.sort(function (a, b) {
            return a.get('filter_menu_order') - b.get('filter_menu_order');
        });
        return models;
    }

});

},{"./../utilities/formatters.js":14,"./base.js":2}],14:[function(require,module,exports){
'use strict';

var numeral = require('numeral'),
    marked = require('marked'),
    $ = (window.$);

var formatters = {

	currency: function currency(v) {
		var formatter;
		if (typeof numeral === "undefined" || numeral === null) {
			return v;
		}
		formatter = v > 999 ? '($0a)' : '($0)';
		return numeral(v).format(formatter);
	},

	number: function number(v) {
		var formatter;
		if (typeof numeral === "undefined" || numeral === null) {
			return v;
		}
		formatter = v > 99999 ? '(0a)' : '(0)';
		return numeral(v).format(formatter);
	},

	percent: function percent(v) {
		return v + '%';
	},

	html: function html(_html) {
		var $html, newHtml;
		$html = $(_html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
		return newHtml;
	},

	atlasArray: function atlasArray(_atlasArray) {
		var arr;
		arr = _atlasArray.split("|");
		arr = _.map(arr, function (item) {
			return item.trim();
		});
		return arr;
	},

	removeLineBreaks: function removeLineBreaks(string) {
		string = String(string);
		return string.replace(/(\r\n|\n|\r)/gm, '');
	},

	removeSpaces: function removeSpaces(string) {
		string = String(string);
		return string.replace(/\s+/g, '');
	},

	hyphenate: function hyphenate(string) {
		string = String(string);
		return string.replace('ommunication', 'ommuni-cation');
	},

	markdown: function markdown(string) {
		var html;
		if (string != null) {
			html = marked(string);
		}
		return html;
	},

	// deprecated
	mdToHtml: function mdToHtml(string) {
		return this.markdown(string);
	}

};

module.exports = formatters;

},{"marked":18,"numeral":19}],15:[function(require,module,exports){
module.exports=[
	{ "id": "0", "name": "Early Education" },
	{ "id": "1", "name": "PreK-12 Education" },
	{ "id": "2", "name": "Higher Education" },
	{ "id": "3", "name": "Learning Technologies" },
	{ "id": "4", "name": "Dual Language Learners" },
	{ "id": "5", "name": "Workforce Development" },
	{ "id": "6", "name": "Federal Education Budget" }
]
},{}],16:[function(require,module,exports){
module.exports=[
	{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" },
	{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" },
	{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" },
	{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
]
},{}],17:[function(require,module,exports){
module.exports=[
  {
    "id": 1,
    "name": "Alabama",
    "code": "AL"
  }, {
    "id": 2,
    "name": "Alaska",
    "code": "AK"
  }, {
    "id": 60,
    "name": "American Samoa",
    "code": "AS"
  }, {
    "id": 4,
    "name": "Arizona",
    "code": "AZ"
  }, {
    "id": 5,
    "name": "Arkansas",
    "code": "AR"
  }, {
    "id": 6,
    "name": "California",
    "code": "CA"
  }, {
    "id": 8,
    "name": "Colorado",
    "code": "CO"
  }, {
    "id": 9,
    "name": "Connecticut",
    "code": "CT"
  }, {
    "id": 10,
    "name": "Delaware",
    "code": "DE"
  }, {
    "id": 11,
    "name": "District of Columbia",
    "code": "DC"
  }, {
    "id": 12,
    "name": "Florida",
    "code": "FL"
  }, {
    "id": 13,
    "name": "Georgia",
    "code": "GA"
  }, {
    "id": 66,
    "name": "Guam",
    "code": "GU"
  }, {
    "id": 15,
    "name": "Hawaii",
    "code": "HI"
  }, {
    "id": 16,
    "name": "Idaho",
    "code": "ID"
  }, {
    "id": 17,
    "name": "Illinois",
    "code": "IL"
  }, {
    "id": 18,
    "name": "Indiana",
    "code": "IN"
  }, {
    "id": 19,
    "name": "Iowa",
    "code": "IA"
  }, {
    "id": 20,
    "name": "Kansas",
    "code": "KS"
  }, {
    "id": 21,
    "name": "Kentucky",
    "code": "KY"
  }, {
    "id": 22,
    "name": "Louisiana",
    "code": "LA"
  }, {
    "id": 23,
    "name": "Maine",
    "code": "ME"
  }, {
    "id": 24,
    "name": "Maryland",
    "code": "MD"
  }, {
    "id": 25,
    "name": "Massachusetts",
    "code": "MA"
  }, {
    "id": 26,
    "name": "Michigan",
    "code": "MI"
  }, {
    "id": 27,
    "name": "Minnesota",
    "code": "MN"
  }, {
    "id": 28,
    "name": "Mississippi",
    "code": "MS"
  }, {
    "id": 29,
    "name": "Missouri",
    "code": "MO"
  }, {
    "id": 30,
    "name": "Montana",
    "code": "MT"
  }, {
    "id": 31,
    "name": "Nebraska",
    "code": "NE"
  }, {
    "id": 32,
    "name": "Nevada",
    "code": "NV"
  }, {
    "id": 33,
    "name": "New Hampshire",
    "code": "NH"
  }, {
    "id": 34,
    "name": "New Jersey",
    "code": "NJ"
  }, {
    "id": 35,
    "name": "New Mexico",
    "code": "NM"
  }, {
    "id": 36,
    "name": "New York",
    "code": "NY"
  }, {
    "id": 37,
    "name": "North Carolina",
    "code": "NC"
  }, {
    "id": 38,
    "name": "North Dakota",
    "code": "ND"
  }, {
    "id": 39,
    "name": "Ohio",
    "code": "OH"
  }, {
    "id": 40,
    "name": "Oklahoma",
    "code": "OK"
  }, {
    "id": 41,
    "name": "Oregon",
    "code": "OR"
  }, {
    "id": 42,
    "name": "Pennsylvania",
    "code": "PA"
  }, {
    "id": 72,
    "name": "Puerto Rico",
    "code": "PR"
  }, {
    "id": 44,
    "name": "Rhode Island",
    "code": "RI"
  }, {
    "id": 45,
    "name": "South Carolina",
    "code": "SC"
  }, {
    "id": 46,
    "name": "South Dakota",
    "code": "SD"
  }, {
    "id": 47,
    "name": "Tennessee",
    "code": "TN"
  }, {
    "id": 48,
    "name": "Texas",
    "code": "TX"
  }, {
    "id": 49,
    "name": "Utah",
    "code": "UT"
  }, {
    "id": 50,
    "name": "Vermont",
    "code": "VT"
  }, {
    "id": 51,
    "name": "Virginia",
    "code": "VA"
  }, {
    "id": 78,
    "name": "Virgin Islands of the U.S.",
    "code": "VI"
  }, {
    "id": 53,
    "name": "Washington",
    "code": "WA"
  }, {
    "id": 54,
    "name": "West Virginia",
    "code": "WV"
  }, {
    "id": 55,
    "name": "Wisconsin",
    "code": "WI"
  }, {
    "id": 56,
    "name": "Wyoming",
    "code": "WY"
  }
]
},{}],18:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],19:[function(require,module,exports){
/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.5.3',
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',
        zeroFormat = null,
        defaultFormat = '0,0',
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;
            
        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number
                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            output;

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
        } else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
        } else {
            format = format.replace('$', '');
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        // position the symbol
        if (symbolIndex <= 1) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                spliceIndex = 1;
                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                    // the symbol appears before the "(" or "-"
                    spliceIndex = 0;
                }
                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
            } else {
                output = languages[currentLanguage].currency.symbol + space + output;
            }
        } else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
            } else {
                output = output + space + languages[currentLanguage].currency.symbol;
            }
        }

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);
        
        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key]) {
                throw new Error('Unknown language : ' + key);
            }
            currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };
    
    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }
        
        if (!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }
        
        return languages[key];
    };

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    /************************************
        Floating-point helpers
    ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';
            
            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }

    
    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
        return mp > mn ? mp : mn;
        }, -Infinity);
    }        


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this, 
                  inputString ? inputString : defaultFormat, 
                  (roundingFunction !== undefined) ? roundingFunction : Math.round
              );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') { 
                return inputString; 
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;            
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);            
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
        });
    }
}).call(this);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGV0ZXJzemVyem8vRG9jdW1lbnRzL3Bzei9wcm9qZWN0cy93ZWIvYXRsYXMtYWxsL2F0bGFzL2FwcC9tb2RlbHMvX19jbGllbnRfXy5qcyIsIi9Vc2Vycy9wZXRlcnN6ZXJ6by9Eb2N1bWVudHMvcHN6L3Byb2plY3RzL3dlYi9hdGxhcy1hbGwvYXRsYXMvYXBwL21vZGVscy9iYXNlLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvbW9kZWxzL2Jhc2VfY29tcG9zaXRlLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvbW9kZWxzL2Jhc2VfZmlsdGVyLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvbW9kZWxzL2NvcmVfZGF0dW0uanMiLCIvVXNlcnMvcGV0ZXJzemVyem8vRG9jdW1lbnRzL3Bzei9wcm9qZWN0cy93ZWIvYXRsYXMtYWxsL2F0bGFzL2FwcC9tb2RlbHMvZmlsdGVyLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvbW9kZWxzL2ltYWdlLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvbW9kZWxzL2l0ZW0uanMiLCIvVXNlcnMvcGV0ZXJzemVyem8vRG9jdW1lbnRzL3Bzei9wcm9qZWN0cy93ZWIvYXRsYXMtYWxsL2F0bGFzL2FwcC9tb2RlbHMvcHJvamVjdC5qcyIsIi9Vc2Vycy9wZXRlcnN6ZXJ6by9Eb2N1bWVudHMvcHN6L3Byb2plY3RzL3dlYi9hdGxhcy1hbGwvYXRsYXMvYXBwL21vZGVscy9wcm9qZWN0X3NlY3Rpb24uanMiLCIvVXNlcnMvcGV0ZXJzemVyem8vRG9jdW1lbnRzL3Bzei9wcm9qZWN0cy93ZWIvYXRsYXMtYWxsL2F0bGFzL2FwcC9tb2RlbHMvcHJvamVjdF90ZW1wbGF0ZS5qcyIsIi9Vc2Vycy9wZXRlcnN6ZXJ6by9Eb2N1bWVudHMvcHN6L3Byb2plY3RzL3dlYi9hdGxhcy1hbGwvYXRsYXMvYXBwL21vZGVscy9yaWNoX2dlb19mZWF0dXJlLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvbW9kZWxzL3ZhcmlhYmxlLmpzIiwiL1VzZXJzL3BldGVyc3plcnpvL0RvY3VtZW50cy9wc3ovcHJvamVjdHMvd2ViL2F0bGFzLWFsbC9hdGxhcy9hcHAvdXRpbGl0aWVzL2Zvcm1hdHRlcnMuanMiLCJkYi9zZWVkcy9wcm9qZWN0X3NlY3Rpb25zLmpzb24iLCJkYi9zZWVkcy9wcm9qZWN0X3RlbXBsYXRlcy5qc29uIiwiZGIvc2VlZHMvc3RhdGVzLmpzb24iLCJub2RlX21vZHVsZXMvbWFya2VkL2xpYi9tYXJrZWQuanMiLCJub2RlX21vZHVsZXMvbnVtZXJhbC9udW1lcmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0VBLE1BQU0sQ0FBQyxDQUFDLEdBQUc7QUFDVixLQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUMxQixRQUFPLEVBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUNoQyxlQUFjLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0FBQy9DLGdCQUFlLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixDQUFDO0FBQ2pELEtBQUksRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQzFCLFNBQVEsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ2xDLE1BQUssRUFBRSxPQUFPLENBQUMsWUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3J3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBEbyBub3QgYnVuZGxlIHJlc2VhcmNoZXIuXG5cbndpbmRvdy5NID0ge1xuXHRiYXNlOiByZXF1aXJlKCcuL2Jhc2UuanMnKSxcblx0cHJvamVjdDogcmVxdWlyZSgnLi9wcm9qZWN0LmpzJyksXG5cdHByb2plY3RTZWN0aW9uOiByZXF1aXJlKCcuL3Byb2plY3Rfc2VjdGlvbi5qcycpLFxuXHRwcm9qZWN0VGVtcGxhdGU6IHJlcXVpcmUoJy4vcHJvamVjdF90ZW1wbGF0ZS5qcycpLFxuXHRpdGVtOiByZXF1aXJlKCcuL2l0ZW0uanMnKSxcblx0dmFyaWFibGU6IHJlcXVpcmUoJy4vdmFyaWFibGUuanMnKSxcblx0aW1hZ2U6IHJlcXVpcmUoJy4vaW1hZ2UuanMnKSxcblx0Y29yZURhdHVtOiByZXF1aXJlKCcuL2NvcmVfZGF0dW0uanMnKSxcblx0ZmlsdGVyOiByZXF1aXJlKCcuL2ZpbHRlci5qcycpXG59OyIsImltcG9ydCAqIGFzIEJhY2tib25lIGZyb20gJ2JhY2tib25lJztcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG52YXIgTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG5cdC8qKiBcblx0ICogUmVjb2duaXplIGFuZCBwcm9jZXNzIGRhdGEuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gRGF0YSBhcyBrZXktdmFsdWUgcGFpcnMuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IGRhdGEgLSBNb2RpZmllZCBkYXRhLlxuXHQgKi9cblx0cGFyc2U6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRkYXRhID0gdGhpcy5fYWRhcHRNb25nb0lkKGRhdGEpO1xuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXG5cdC8qXG5cdCAqIEN1c3RvbSBnZXQgZnVuY3Rpb24sIGFjY29tbW9kYXRpbmcgYSBzdWZmaXgsIGUuZy4gc3RhdHVzXzIwMTIuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCAtIFNhbWUgYXMgaW4gQmFja2JvbmUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdWZmaXggLSBDdXN0b20gc3VmZml4LlxuXHQgKiBAcmV0dXJucyB7fSB2YWx1ZVxuXHQgKi9cblx0Z2V0OiBmdW5jdGlvbihmaWVsZCwgc3VmZml4KSB7XG5cdFx0dmFyIGdldEZuYyA9IEJhY2tib25lLk1vZGVsLnByb3RvdHlwZS5nZXQ7XG5cdFx0aWYgKHN1ZmZpeCA9PSBudWxsKSB7IHJldHVybiBnZXRGbmMuYXBwbHkodGhpcywgWyBmaWVsZCBdKTsgfVxuXHRcdHJldHVybiBnZXRGbmMuYXBwbHkodGhpcywgWyBmaWVsZCArICdfJyArIHN1ZmZpeCBdKTtcblx0fSxcblxuXHQvKipcblx0ICogQWRkcyBmaWVsZHMgb2YgYSBmb3JlaWduIGNvbGxlY3Rpb24sIHJlZmVyZW5jZWQgYnkgYSBmb3JlaWduIGlkIHdpdGhpbiB0aGUgbW9kZWwuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmb3JlaWduSWRLZXkgLSBGb3JlaWduIGlkIGtleSwgb2YgdGhlIGZvcm1hdCAnbW9kZWxfaWQnIG9yICdtb2RlbF9pZHMnLlxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9ybWVyIHJlZmVyZW5jZXMgYSBzaW5nbGUgdmFsdWUsIHRoZSBsYXR0ZXIgYW4gYXJyYXkuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBmb3JlaWduQ29sbGVjdGlvblxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZmllbGRLZXkgLSBUaGUgZmllbGQgb2YgdGhlIGZvcmVpZ24gbW9kZWwgdG8gYmUgY29waWVkIGluLCBlLmcuICduYW1lJy5cblx0ICogQHJldHVybnMge29iamVjdH0gdGhpcyAtIFRoZSBtb2RlbCBpbnN0YW5jZSwgd2l0aCAnbW9kZWxfbmFtZScgZmllbGQgYWRkZWQuXG5cdCAqL1xuXHRhZGRGb3JlaWduRmllbGQ6IGZ1bmN0aW9uKGZvcmVpZ25JZEtleSwgZm9yZWlnbkNvbGxlY3Rpb24sIGZpZWxkS2V5KSB7XG5cblx0XHR2YXIgbmV3S2V5LCBcblx0XHRcdGZvcmVpZ25Nb2RlbCwgZm9yZWlnbklkcyxcblx0XHRcdHNpbmdsZUZvcmVpZ25JZEtleSwgLy8gaWYgZm9yZWlnbklkS2V5IGhvbGRzIGFuIGFycmF5XG5cdFx0XHRmb3JlaWduRmllbGRzID0gW107XG5cblx0XHQvLyBiZWxvbmdzX3RvIHJlbGF0aW9uc2hpcCB3aXRoIGEgc2luZ2xlIHJlZmVyZW5jZSBpZFxuXHRcdGlmIChmb3JlaWduSWRLZXkuc2xpY2UoLTIpID09PSAnaWQnKSB7XG5cblx0XHRcdG5ld0tleSA9IGZvcmVpZ25JZEtleS5zbGljZSgwLCAtMikgKyBmaWVsZEtleTtcblx0XHRcdGZvcmVpZ25Nb2RlbCA9IGZvcmVpZ25Db2xsZWN0aW9uLmZpbmRXaGVyZSh7aWQ6IHRoaXMuZ2V0KGZvcmVpZ25JZEtleSl9KTtcblx0XHRcdHRoaXMuc2V0KG5ld0tleSwgZm9yZWlnbk1vZGVsLmdldChmaWVsZEtleSkpO1xuXG5cdFx0Ly8gaGFzX21hbnkgcmVsYXRpb25zaGlwIHdpdGggaWQgcmVmZXJlbmNlcyBlbWJlZGRlZCBpbiBhbiBhcnJheSBmaWVsZFxuXHRcdH0gZWxzZSBpZiAoZm9yZWlnbklkS2V5LnNsaWNlKC0zKSA9PT0gJ2lkcycpIHtcblxuXHRcdFx0Zm9yZWlnbklkcyA9IHRoaXMuZ2V0KGZvcmVpZ25JZEtleSk7XG5cblx0XHRcdGZvcmVpZ25JZHMuZm9yRWFjaChmdW5jdGlvbihmb3JlaWduSWQpIHtcblx0XHRcdFx0Ly8gc2ltcGxlIHBsdXJhbGl6YXRpb25cblx0XHRcdFx0bmV3S2V5ID0gZm9yZWlnbklkS2V5LnNsaWNlKDAsIC0zKSArIGZpZWxkS2V5ICsgJ3MnO1xuXHRcdFx0XHRmb3JlaWduTW9kZWwgPSBmb3JlaWduQ29sbGVjdGlvbi5maW5kV2hlcmUoe2lkOiBmb3JlaWduSWR9KTtcblx0XHRcdFx0aWYgKGZvcmVpZ25Nb2RlbCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0Zm9yZWlnbkZpZWxkcy5wdXNoKGZvcmVpZ25Nb2RlbC5nZXQoZmllbGRLZXkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuc2V0KG5ld0tleSwgZm9yZWlnbkZpZWxkcyk7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9LFxuXHRcblx0LyoqXG5cdCAqIEZpbmRzIGFuZCByZXBsYWNlcyBrZXkuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gRGF0YSBhcyBrZXktdmFsdWUgcGFpcnMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdGFuZGFyZEtleVxuXHQgKiBAcGFyYW0ge2FycmF5fSBrZXlGb3JtYXRMaXN0IC0gTGlzdCBvZiBwb3NzaWJsZSBrZXlzLCBlLmcuIFtsYXRpdHVkZSwgbGF0LCBMYXRpdHVkZV0gZm9yIGxhdGl0dWRlLlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gZm91bmQgLSBXaGV0aGVyIHRoZSBrZXkgaXMgZm91bmQgaW4gdGhlIGRhdGEuXG5cdCAqL1xuXHRfZmluZEFuZFJlcGxhY2VLZXk6IGZ1bmN0aW9uKGRhdGEsIHN0YW5kYXJkS2V5LCBrZXlGb3JtYXRMaXN0KSB7XG5cdFx0dmFyIGZvdW5kLCBpLCBrZiwgbGVuO1xuXHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0aWYgKGtleUZvcm1hdExpc3QgPT0gbnVsbCkge1xuXHRcdFx0a2V5Rm9ybWF0TGlzdCA9IFtzdGFuZGFyZEtleV07IFxuXHRcdH1cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBrZXlGb3JtYXRMaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRrZiA9IGtleUZvcm1hdExpc3RbaV07XG5cdFx0XHRpZiAoZGF0YVtrZl0pIHtcblx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoa2YgIT09IHN0YW5kYXJkS2V5KSB7XG5cdFx0XHRcdFx0ZGF0YVtzdGFuZGFyZEtleV0gPSBkYXRhW2tmXTtcblx0XHRcdFx0XHRkZWxldGUgZGF0YVtrZl07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZvdW5kO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBZGFwdHMgTW9uZ29pZCBJRC5cblx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBEYXRhIGFzIGtleS12YWx1ZSBwYWlycy5cblx0ICogQHJldHVybnMge29iamVjdH0gZGF0YSAtIE1vZGlmaWVkIGRhdGEuXG5cdCAqL1xuXHRfYWRhcHRNb25nb0lkOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0aWYgKChkYXRhLl9pZCAhPSBudWxsKSkge1xuXHRcdFx0aWYgKChkYXRhLl9pZC4kb2lkICE9IG51bGwpKSB7XG5cdFx0XHRcdGRhdGEuaWQgPSBTdHJpbmcoZGF0YS5faWQuJG9pZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkYXRhLmlkID0gU3RyaW5nKGRhdGEuX2lkKTtcblx0XHRcdH1cblx0XHRcdGRlbGV0ZSBkYXRhLl9pZDtcblx0XHR9IGVsc2UgaWYgKChkYXRhLmlkICE9IG51bGwpICYmIChkYXRhLmlkLiRvaWQgIT0gbnVsbCkpIHtcblx0XHRcdGRhdGEuaWQgPSBTdHJpbmcoZGF0YS5pZC4kb2lkKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbW92ZSB0aGUgYXJyYXkgd3JhcHBlciwgaWYgcmVzcG9uc2UgaXMgb25lLW1lbWJlciBhcnJheS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJlc3AgLSBTZXJ2ZXIgcmVzb25zZS5cblx0ICogQHJldHVybnMge29iamVjdH0gcmVzcCAtIE1vZGlmaWVkIHJlc3BvbnNlLlxuXHQgKi9cblx0X3JlbW92ZUFycmF5V3JhcHBlcjogZnVuY3Rpb24ocmVzcCkge1xuXHRcdGlmIChfLmlzQXJyYXkocmVzcCkgJiYgKHJlc3AubGVuZ3RoID09PSAxKSkge1xuXHRcdFx0cmVzcCA9IHJlc3BbMF07XG5cdFx0fVxuXHRcdHJldHVybiByZXNwO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgYWxsIGxpbmUgYnJlYWtzIGZyb20gZmllbGQuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZXNwIC0gU2VydmVyIHJlc3BvbnNlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gUmVzcG9uc2Uga2V5LlxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSByZXNwIC0gTW9kaWZpZWQgcmVzcG9uc2UuXG5cdCAqL1xuXHRfcmVtb3ZlTGluZUJyZWFrczogZnVuY3Rpb24ocmVzcCwga2V5KSB7XG5cdFx0aWYgKHJlc3Bba2V5XSAhPSBudWxsKSB7XG5cdFx0XHRyZXNwW2tleV0gPSByZXNwW2tleV0ucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSwgJycpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcDtcblx0fSxcblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgc3BhY2VzIGZyb20gZmllbGQuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZXNwIC0gU2VydmVyIHJlc3BvbnNlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gUmVzcG9uc2Uga2V5LlxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSByZXNwIC0gTW9kaWZpZWQgcmVzcG9uc2UuXG5cdCAqL1xuXHRfcmVtb3ZlU3BhY2VzOiBmdW5jdGlvbihyZXNwLCBrZXkpIHtcblx0XHRpZiAocmVzcFtrZXldICE9IG51bGwpIHtcblx0XHRcdHJlc3Bba2V5XSA9IHJlc3Bba2V5XS5yZXBsYWNlKC9cXHMrL2csICcnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3A7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3Mgc3RhdGljIGh0bWwgb24gYSBrZXkuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZXNwIC0gU2VydmVyIHJlc3BvbnNlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IHJlc3AgLSBNb2RpZmllZCByZXNwb25zZS5cblx0ICovXG5cdF9wcm9jZXNzU3RhdGljSHRtbDogZnVuY3Rpb24ocmVzcCwga2V5KSB7XG5cdFx0dmFyICRodG1sLCBodG1sLCBuZXdIdG1sO1xuXHRcdGh0bWwgPSByZXNwW2tleV07XG5cdFx0JGh0bWwgPSAkKGh0bWwpO1xuXHRcdCRodG1sLmZpbmQoJ2EnKS5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJyk7XG5cdFx0bmV3SHRtbCA9ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKCRodG1sLmNsb25lKCkpLmh0bWwoKTtcblx0XHRyZXNwW2tleV0gPSBuZXdIdG1sO1xuXHRcdHJldHVybiByZXNwO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgbWFya2Rvd24gaHRtbC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleVxuXHQgKiBAcmV0dXJucyB7fSBuZXdIdG1sXG5cdCAqL1xuXHRnZXRNYXJrZG93bkh0bWw6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHZhciAkaHRtbCwgbWQsIG5ld0h0bWw7XG5cdFx0bWQgPSB0aGlzLmdldChrZXkpO1xuXHRcdGlmIChtZCAhPSBudWxsKSB7XG5cdFx0XHQkaHRtbCA9ICQobWFya2VkKG1kKSk7XG5cdFx0XHQkaHRtbC5maW5kKCdhJykuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpO1xuXHRcdFx0bmV3SHRtbCA9ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKCRodG1sLmNsb25lKCkpLmh0bWwoKTtcblx0XHRcdHJldHVybiBuZXdIdG1sO1xuXHRcdH1cblx0fSxcblxuXG5cdC8qKlxuXHQgKiBTZXQgdGFibGUgb2YgY29udGVudHMgZm9yIGh0bWwgZGF0YSB1bmRlciBhIGdpdmVuIGtleS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc2F2ZUtleSAtIEtleSB1bmRlciB3aGljaCB0aGUgbW9kaWZpZWQgaHRtbCBzbmlwcGV0IGlzIHBsYWNlZC5cblx0ICogQHJldHVybnMge29iamVjdH0gdGhpc1xuXHQgKi9cblx0c2V0SHRtbFRvYzogZnVuY3Rpb24oa2V5LCBzYXZlS2V5KSB7XG5cblx0XHR2YXIgaHRtbCwgJGNvbnRhaW5lZEh0bWwsIGFycjtcblxuXHRcdHNhdmVLZXkgPSBzYXZlS2V5IHx8IGtleTtcblxuXHRcdGh0bWwgPSB0aGlzLmdldChrZXkpO1xuXHRcdGlmIChodG1sID09IG51bGwpIHsgcmV0dXJuOyB9XG5cblx0XHRhcnIgPSBbXTtcblxuXHRcdCRjb250YWluZWRIdG1sID0gJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoJChodG1sKSk7XG5cblx0XHQkY29udGFpbmVkSHRtbC5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XG5cblx0XHRcdHZhciAkZWwgPSAkKHRoaXMpLFxuXHRcdFx0XHR0YWdOYW1lID0gJGVsLnByb3AoJ3RhZ05hbWUnKSxcblx0XHRcdFx0Y29udGVudCA9ICRlbC5odG1sKCksXG5cdFx0XHRcdHRvY0lkID0gY29udGVudC5yZXBsYWNlKC9bXmEtejAtOV0vaWcsICcgJykucmVwbGFjZSgvXFxzKy9nLCAnLScpLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdGlmICh0YWdOYW1lLnRvTG93ZXJDYXNlID09IG51bGwpIHsgcmV0dXJuOyB9IFxuXHRcdFx0dGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTsgXG5cblx0XHRcdGlmIChbJ2gxJywgJ2gyJ10uaW5kZXhPZih0YWdOYW1lKSA+IC0xKSB7XG5cdFx0XHRcdCQoJzxzcGFuIGlkPVwidG9jLScgKyB0b2NJZCArICdcIj48L3NwYW4+JykuaW5zZXJ0QmVmb3JlKCRlbCk7XG5cdFx0XHRcdGFyci5wdXNoKHtcblx0XHRcdFx0XHRpZDogdG9jSWQsXG5cdFx0XHRcdFx0dGFnTmFtZTogdGFnTmFtZSxcblx0XHRcdFx0XHRjb250ZW50OiBjb250ZW50IFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zZXQoc2F2ZUtleSwgJGNvbnRhaW5lZEh0bWwuaHRtbCgpKTtcblx0XHR0aGlzLnNldChzYXZlS2V5ICsgJ190b2MnLCBhcnIpO1xuXG5cdH1cblxufSk7XG5cbnZhciBDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXHRcblx0bW9kZWw6IE1vZGVsLFxuXG5cdGJ1aWxkUXVlcnlTdHJpbmc6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cblx0XHR2YXIgcXVlcnlTdHJpbmcgPSAnPyc7XG5cblx0XHRpZiAocXVlcnkgPT0gbnVsbCkgeyByZXR1cm4gJyc7IH1cblxuXHRcdGZvciAobGV0IGtleSBpbiBxdWVyeSkge1xuXHRcdFx0bGV0IHZhbHVlID0gcXVlcnlba2V5XTtcblx0XHRcdHF1ZXJ5U3RyaW5nICs9IGAke2tleX09JHt2YWx1ZX0mYFxuXHRcdH1cblxuXHRcdHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmcuc2xpY2UoMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xuXG5cdH0sXG5cblx0Ly8gRmV0Y2ggaW5zdGFuY2VzIG9uIHRoZSBjbGllbnQuXG5cdC8vIFRPRE86IGN1c3RvbWl6ZSB0byBpbmNsdWRlIGEgcmVxIG9iamVjdC5cblx0Z2V0Q2xpZW50RmV0Y2hQcm9taXNlOiBmdW5jdGlvbihxdWVyeSkge1xuXG5cdFx0dmFyIGlzUXVlcmllZCA9IChxdWVyeSAhPSBudWxsKTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cblx0XHRcdGlmICghaXNRdWVyaWVkKSB7XG5cblx0XHRcdFx0Ly8gU21hbGwsIHNlZWRlZCBjb2xsZWN0aW9ucyBhcmUgcmVzb2x2ZWQgaW1tZWRpYXRlbHkuXG5cdFx0XHRcdGlmICh0aGlzLmRiU2VlZCkge1xuXHRcdFx0XHRcdHRoaXMucmVzZXQodGhpcy5kYlNlZWQpO1xuXHRcdFx0XHRcdHJldHVybiByZXNvbHZlKHRoaXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ2FjaGVkIGNvbGxlY3Rpb25zIGFyZSByZXNvbHZlZCBpbW1lZGlhdGVseS5cblx0XHRcdFx0aWYgKHRoaXMuZGJDYWNoZSkge1xuXHRcdFx0XHRcdHRoaXMucmVzZXQodGhpcy5kYkNhY2hlKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSh0aGlzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHZhciB1cmwgPSB0aGlzLmFwaVVybCArIHRoaXMuYnVpbGRRdWVyeVN0cmluZyhxdWVyeSk7XG5cblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHR0eXBlOiAnZ2V0Jyxcblx0XHRcdFx0c3VjY2VzczogKGRhdGEpID0+IHtcblx0XHRcdFx0XHQvLyBTZXQgZGF0YWJhc2UgY2FjaGUuXG5cdFx0XHRcdFx0aWYgKCFpc1F1ZXJpZWQpIHsgdGhpcy5kYkNhY2hlID0gZGF0YTsgfVxuXHRcdFx0XHRcdHRoaXMucmVzZXQoZGF0YSk7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0aGlzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IChlcnIpID0+IHtcblx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9KTtcblxuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZWNvZ25pemUgYW5kIHByb2Nlc3Mgc2VydmVyIHJlc3BvbnNlIGJ5IGFwcGx5aW5nIHRoZSBjb3JyZXNwb25kaW5nIG1vZGVsJ3MgcGFyc2UgbWV0aG9kLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gcmVzcCAtIFNlcnZlciByZXNwb25zZS5cblx0ICogQHJldHVybnMge29iamVjdH0gcmVzcCAtIE1vZGlmaWVkIHJlc3BvbnNlLlxuXHQgKi9cblx0cGFyc2U6IGZ1bmN0aW9uKHJlc3ApIHtcblx0XHR2YXIgaSwgbWF4LFxuXHRcdFx0aXRlbTtcblx0XHR2YXIgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbCgpLFxuXHRcdFx0bW9kZWxQYXJzZU1ldGhvZCA9IG1vZGVsLnBhcnNlLmJpbmQobW9kZWwpO1xuXHRcdGlmIChtb2RlbFBhcnNlTWV0aG9kID09IG51bGwpIHsgcmV0dXJuIHJlc3A7IH1cblx0XHRmb3IgKGkgPSAwLCBtYXggPSByZXNwLmxlbmd0aDsgaSA8IG1heDsgaSArPSAxKSB7XG5cdFx0XHRpdGVtID0gcmVzcFtpXTtcblx0XHRcdHJlc3BbaV0gPSBtb2RlbFBhcnNlTWV0aG9kKGl0ZW0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcDtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdE1vZGVsOiBNb2RlbCxcblx0Q29sbGVjdGlvbjogQ29sbGVjdGlvblxufTsiLCIvLyBDb21waWxlZCBmcm9tIE1hcmlvbmV0dGUuQWNjb3VudGFudFxuXG52YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxuICAgIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5leHBvcnRzLk1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgQmFja2JvbmUuTW9kZWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmRvQWNjb3VudGluZygpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEZpbmQga2V5IHRoYXQgaG9sZHMgYXJyYXkgdmFsdWVzIHdpdGhpbiBtb2RlbC5cbiAgICAgKlxuICAgICAqL1xuICAgIF9nZXRDaGlsZHJlbktleTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBrZXksIHJlZiwgdmFsdWU7XG4gICAgICAgIHJlZiA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlZltrZXldO1xuICAgICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRvQWNjb3VudGluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBDaGlsZE1vZGVsQ29uc3RydWN0b3IsIGNoaWxkLCBjaGlsZE1vZGVsLCBjaGlsZHJlbiwgY2hpbGRyZW5LZXksIGksIGosIGxlbiwgbWF4LCByZXN1bHRzO1xuICAgICAgICBjaGlsZHJlbktleSA9IHRoaXMuX2dldENoaWxkcmVuS2V5KCk7XG4gICAgICAgIENoaWxkTW9kZWxDb25zdHJ1Y3RvciA9IF8uaXNGdW5jdGlvbih0aGlzLmNoaWxkTW9kZWwpID8gdGhpcy5jaGlsZE1vZGVsIDogQmFja2JvbmUuTW9kZWw7XG4gICAgICAgIGlmIChjaGlsZHJlbktleSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoJ19jaGlsZHJlbktleScsIGNoaWxkcmVuS2V5KTtcbiAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXQoY2hpbGRyZW5LZXkpO1xuICAgICAgICAgICAgdGhpcy51bnNldChjaGlsZHJlbktleSk7XG4gICAgICAgICAgICBtYXggPSBjaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBjaGlsZE1vZGVsID0gbmV3IENoaWxkTW9kZWxDb25zdHJ1Y3RvcihjaGlsZCk7XG4gICAgICAgICAgICAgICAgY2hpbGRNb2RlbC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNoaWxkTW9kZWwuc2V0KCdfaW5kZXgnLCBpKTtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkTW9kZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogU2VwYXJhdGUgXG4gICAgICovXG4gICAgY3JlYXRlTW9kZWxUcmVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgQ2hpbGRNb2RlbENvbnN0cnVjdG9yLCBcbiAgICAgICAgICAgIGNoaWxkTW9kZWwsIFxuICAgICAgICAgICAgY2hpbGRyZW4sIFxuICAgICAgICAgICAgY2hpbGRyZW5LZXk7XG4gICAgICAgIGNoaWxkcmVuS2V5ID0gdGhpcy5fZ2V0Q2hpbGRyZW5LZXkoKTtcbiAgICAgICAgQ2hpbGRNb2RlbENvbnN0cnVjdG9yID0gXy5pc0Z1bmN0aW9uKHRoaXMuY2hpbGRNb2RlbCkgPyB0aGlzLmNoaWxkTW9kZWwgOiBCYWNrYm9uZS5Nb2RlbDtcbiAgICAgICAgaWYgKGNoaWxkcmVuS2V5KSB7XG4gICAgICAgICAgICB0aGlzLnNldCgnX2NoaWxkcmVuS2V5JywgY2hpbGRyZW5LZXkpO1xuICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldChjaGlsZHJlbktleSk7XG4gICAgICAgICAgICB0aGlzLnVuc2V0KGNoaWxkcmVuS2V5KTtcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQsIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRNb2RlbCA9IG5ldyBDaGlsZE1vZGVsQ29uc3RydWN0b3IoY2hpbGQpO1xuICAgICAgICAgICAgICAgIGNoaWxkTW9kZWwucGFyZW50ID0gc2VsZjtcbiAgICAgICAgICAgICAgICBjaGlsZE1vZGVsLnNldCgnX2luZGV4JywgaSk7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGlsZHJlbi5wdXNoKGNoaWxkTW9kZWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEJhY2tib25lLk1vZGVsLnByb3RvdHlwZS50b0pTT04uYXBwbHkodGhpcyk7XG4gICAgfSxcblxuICAgIHRvTmVzdGVkSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGlsZCwgY2hpbGRyZW5LZXksIGosIGpzb24sIGxlbiwgbmVzdGVkSnNvbiwgcmVmO1xuICAgICAgICBqc29uID0gdGhpcy50b0pTT04oKTtcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uWydfaW5kZXgnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBqc29uWydfaW5kZXgnXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgY2hpbGRyZW5LZXkgPSB0aGlzLmdldCgnX2NoaWxkcmVuS2V5Jyk7XG4gICAgICAgICAgICBqc29uW2NoaWxkcmVuS2V5XSA9IFtdO1xuICAgICAgICAgICAgcmVmID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gcmVmW2pdO1xuICAgICAgICAgICAgICAgIG5lc3RlZEpzb24gPSBjaGlsZC50b05lc3RlZEpTT04gIT0gbnVsbCA/IGNoaWxkLnRvTmVzdGVkSlNPTigpIDogY2hpbGQudG9KU09OKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG5lc3RlZEpzb25bJ19pbmRleCddO1xuICAgICAgICAgICAgICAgIGpzb25bY2hpbGRyZW5LZXldLnB1c2gobmVzdGVkSnNvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUganNvblsnX2NoaWxkcmVuS2V5J107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcblxuICAgIGdldENoaWxkSW5kZXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9LFxuXG4gICAgZ2V0U2libGluZ0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9LFxuXG4gICAgZ2V0TmV4dFNpYmxpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2ksIHNjO1xuICAgICAgICBjaSA9IHRoaXMuZ2V0Q2hpbGRJbmRleCgpO1xuICAgICAgICBzYyA9IHRoaXMuZ2V0U2libGluZ0NvdW50KCk7XG4gICAgICAgIGlmICgoY2kgIT09IC0xKSAmJiAoc2MgIT09IC0xKSAmJiAoY2kgPCBzYykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5jaGlsZHJlbltjaSArIDFdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFByZXZpb3VzU2libGluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaSwgc2M7XG4gICAgICAgIGNpID0gdGhpcy5nZXRDaGlsZEluZGV4KCk7XG4gICAgICAgIHNjID0gdGhpcy5nZXRTaWJsaW5nQ291bnQoKTtcbiAgICAgICAgaWYgKChjaSAhPT0gLTEpICYmIChzYyAhPT0gLTEpICYmIChjaSA+IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuY2hpbGRyZW5bY2kgLSAxXTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXG5cdGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuanMnKTtcblxuZXhwb3J0cy5Nb2RlbCA9IGJhc2UuTW9kZWwuZXh0ZW5kKHtcblxuXHQvKiogQWN0aXZhdGVzIG1vZGVsLiBUYWtlcyBubyBjb2xsZWN0aW9uIGZpbHRlciBsb2dpYyBpbnRvIGNvbnNpZGVyYXRpb24gLSBoZW5jZSBpbnRlcm5hbCBvbmx5LiAqL1xuXHRhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuc2V0KCdfaXNBY3RpdmUnLCB0cnVlKTtcblx0fSxcblx0XG5cdC8qKiBEZWFjdGl2YXRlcyBtb2RlbC4gVGFrZXMgbm8gY29sbGVjdGlvbiBmaWx0ZXIgbG9naWMgaW50byBjb25zaWRlcmF0aW9uIC0gaGVuY2UgaW50ZXJuYWwgb25seS4gKi9cblx0ZGVhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuc2V0KCdfaXNBY3RpdmUnLCBmYWxzZSk7XG5cdH0sXG5cdFxuXHQvKiogVG9nZ2xlIHRoZSBtb2RlbCdzIGFjdGl2ZSBzdGF0ZS4gKi9cblx0dG9nZ2xlQWN0aXZlU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmlzQWN0aXZlKCkpIHtcblx0XHRcdGlmICghKCh0aGlzLmNvbGxlY3Rpb24gIT0gbnVsbCkgJiYgdGhpcy5jb2xsZWN0aW9uLmhhc1NpbmdsZUFjdGl2ZUNoaWxkKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kZWFjdGl2YXRlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYWN0aXZhdGUoKTtcblx0XHRcdGlmICgodGhpcy5jb2xsZWN0aW9uICE9IG51bGwpICYmIHRoaXMuY29sbGVjdGlvbi5oYXNTaW5nbGVBY3RpdmVDaGlsZCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmRlYWN0aXZhdGVTaWJsaW5ncyh0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdFxuXHQvKiogR2V0IGFjdGl2ZSBzdGF0ZS4gKi9cblx0aXNBY3RpdmU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmdldCgnX2lzQWN0aXZlJyk7XG5cdH0sXG5cdFxuXHQvKiogXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSB0ZXN0ZWQgbW9kZWwgc2F0aXNmaWVzIGEgYmVsb25nc190byByZWxhdGlvbiB3aXRoIHRoZSBtb2RlbCBpbnN0YW5jZSB1bmRlciBhIHNwZWNpZmllZCBmb3JlaWduIGtleS4gXG5cdCAqIEV4YW1wbGU6IHRoaXMuZ2V0KCdpZCcpID09PSB0ZXN0ZWRNb2RlbC5nZXQoJ3VzZXJfaWQnKSBpZiB0aGUgZm9yZWlnbiBrZXkgaXMgJ3VzZXInLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGVzdGVkTW9kZWxcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZvcmVpZ25LZXlcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHR0ZXN0OiBmdW5jdGlvbih0ZXN0ZWRNb2RlbCwgZm9yZWlnbktleSkge1xuXHRcdHZhciBmb3JlaWduSWQsIGZvcmVpZ25JZHMsIGlkO1xuXHRcdGlmICghdGhpcy5pc0FjdGl2ZSgpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlkID0gdGhpcy5nZXQoJ2lkJyk7XG5cdFx0Ly8gSWYgdGhlcmUgaXMgYSBzaW5nbGUgaWQsIHRlc3QgZm9yIGVxdWFsaXR5LlxuXHRcdGZvcmVpZ25JZCA9IHRlc3RlZE1vZGVsLmdldChmb3JlaWduS2V5ICsgJ19pZCcpO1xuXHRcdGlmIChmb3JlaWduSWQgIT0gbnVsbCkgeyByZXR1cm4gKGlkID09PSBmb3JlaWduSWQpOyB9XG5cdFx0Ly8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIGlkcywgdGVzdCBmb3IgaW5jbHVzaW9uLlxuXHRcdGZvcmVpZ25JZHMgPSB0ZXN0ZWRNb2RlbC5nZXQoZm9yZWlnbktleSArICdfaWRzJyk7XG5cdFx0aWYgKGZvcmVpZ25JZHMgIT0gbnVsbCkgeyByZXR1cm4gKGZvcmVpZ25JZHMuaW5kZXhPZihpZCkgPj0gMCk7IH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxufSk7XG5cbmV4cG9ydHMuQ29sbGVjdGlvbiA9IGJhc2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG5cdG1vZGVsOiBleHBvcnRzLk1vZGVsLFxuXG5cdC8qKiBJbml0aWFsaXplcyBhY3RpdmUgc3RhdGUgb2YgdGhlIGNvbGxlY3Rpb24ncyBtb2RlbHMuICovXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmluaXRpYWxpemVBY3RpdmVTdGF0ZXNPblJlc2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vbigncmVzZXQnLCB0aGlzLmluaXRpYWxpemVBY3RpdmVTdGF0ZXMpO1xuXHRcdH1cblx0fSxcblxuXHRoYXNTaW5nbGVBY3RpdmVDaGlsZDogZmFsc2UsXG5cdFxuXHQvKipcblx0ICogRGVhY3RpdmF0ZSBhbGwgc2libGluZ3Mgb2YgYW4gYWN0aXZlIGNoaWxkIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSB7fSBhY3RpdmVDaGlsZCAtIEFjdGl2ZSBjaGlsZCBtb2RlbCBpbnN0YW5jZSBmcm9tIHdoZXJlIHRoZSBtZXRob2QgaXMgdXN1YWxseSBjYWxsZWRcblx0ICogQHJldHVybnMge2FycmF5fSByZXN1bHRzXG5cdCAqL1xuXHRkZWFjdGl2YXRlU2libGluZ3M6IGZ1bmN0aW9uKGFjdGl2ZUNoaWxkKSB7XG5cdFx0dmFyIGksIGxlbiwgbW9kZWwsIHJlZiwgcmVzdWx0cztcblx0XHRyZWYgPSB0aGlzLm1vZGVscztcblx0XHRyZXN1bHRzID0gW107XG5cdFx0Zm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRtb2RlbCA9IHJlZltpXTtcblx0XHRcdGlmIChtb2RlbCAhPT0gYWN0aXZlQ2hpbGQpIHtcblx0XHRcdFx0cmVzdWx0cy5wdXNoKG1vZGVsLmRlYWN0aXZhdGUoKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHRzLnB1c2godm9pZCAwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH0sXG5cblx0LyoqIFxuXHQgKiBTZXQgYW5kIGluaXRpYWxpemUgYWN0aXZlIHN0YXRlIG9mIHRoZSBjb2xsZWN0aW9uJ3MgbW9kZWxzLiBcblx0ICogSWYgdGhlIGhhc1NpbmdsZUFjdGl2ZUNoaWxkIGlzIHNldCB0byB0cnVlIG9uIHRoZSBjb2xsZWN0aW9uIGluc3RhbmNlLCB0aGUgZmlyc3QgbW9kZWwgaXMgc2V0IGFzIGFjdGl2ZSBhbmQgYWxsIG90aGVycyBhcmUgc2V0IGFzIGluYWN0aXZlLlxuXHQgKiBPdGhlcndpc2UsIGFsbCBtb2RlbHMgYXJlIHNldCBhcyBhY3RpdmUuIFxuXHQgKi9cblx0aW5pdGlhbGl6ZUFjdGl2ZVN0YXRlczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGksIGluZGV4LCBsZW4sIG1vZGVsLCByZWY7XG5cdFx0cmVmID0gdGhpcy5tb2RlbHM7XG5cdFx0Zm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuXHRcdFx0bW9kZWwgPSByZWZbaW5kZXhdO1xuXHRcdFx0bW9kZWwuc2V0KCdfaXNBY3RpdmUnLCAhdGhpcy5oYXNTaW5nbGVBY3RpdmVDaGlsZCA/IHRydWUgOiAoaW5kZXggPT09IDAgPyB0cnVlIDogZmFsc2UpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMudHJpZ2dlcignaW5pdGlhbGl6ZTphY3RpdmU6c3RhdGVzJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGVzdGVkTW9kZWwgLSBcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZvcmVpZ25LZXkgLSBcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHR0ZXN0OiBmdW5jdGlvbih0ZXN0ZWRNb2RlbCwgZm9yZWlnbktleSkge1xuXHRcdHZhciBpLCBsZW4sIG1vZGVsLCByZWY7XG5cdFx0cmVmID0gdGhpcy5tb2RlbHM7XG5cdFx0Zm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRtb2RlbCA9IHJlZltpXTtcblx0XHRcdGlmIChtb2RlbC50ZXN0KHRlc3RlZE1vZGVsLCBmb3JlaWduS2V5KSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXG5cdGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuanMnKTtcblxuXG5leHBvcnRzLk1vZGVsID0gYmFzZS5Nb2RlbC5leHRlbmQoe1xuXHRcblx0dXJsUm9vdDogJy9hcGkvdjEvY29yZV9kYXRhJyxcblx0XG5cdC8qKiBcblx0ICogRmV0Y2hlcyBjb3JlIGRhdGEgbW9kZWwgdXJsIGJ5IG5hbWUga2V5IFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSAtIFVybCBwbHVzIG5hbWVcblx0ICovXG5cdCB1cmw6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnVybFJvb3QgKyAoXCI/bmFtZT1cIiArICh0aGlzLmdldCgnbmFtZScpKSk7XG5cdH0sXG5cblx0LyoqIFVSTCBNRVRIT0QgUkVXUklUVEVOIEFCT1ZFIEJZIEpNIFRPIE1JUlJPUiBJTUFHRS5KUyBVUkwgTUVUSE9EIEZPUk1BVCAqL1xuXHQvLyB1cmw6IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHJldHVybiB0aGlzLnVybFJvb3QgKyBcIj9cIiArICQucGFyYW0oe1xuXHQvLyBcdFx0bmFtZTogdGhpcy5nZXQoJ25hbWUnKVxuXHQvLyBcdH0pO1xuXHQvLyB9LFxuXG5cdC8qKiBcblx0ICogUmVjb2duaXplIGFuZCBwcm9jZXNzIHNlcnZlciByZXNwb25zZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJlc3AgLSBTZXJ2ZXIgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IHJlc3AgLSBNb2RpZmllZCByZXNwb25zZS5cblx0ICovXG5cdHBhcnNlOiBmdW5jdGlvbihyZXNwKSB7XG5cdFx0cmV0dXJuIHJlc3AgPSB0aGlzLl9yZW1vdmVBcnJheVdyYXBwZXIocmVzcCk7XG5cdH1cbn0pO1xuXG5leHBvcnRzLkNvbGxlY3Rpb24gPSBiYXNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblx0bW9kZWw6IGV4cG9ydHMuTW9kZWwsXG5cdHVybDogJ2FwaS92MS9jb3JlX2RhdGEnXG59KTsiLCJ2YXIgYmFzZSA9IHJlcXVpcmUoJy4vYmFzZS5qcycpLFxuICAgIGZvcm1hdHRlcnMgPSByZXF1aXJlKCcuLy4uL3V0aWxpdGllcy9mb3JtYXR0ZXJzLmpzJyksXG4gICAgYmFzZUNvbXBvc2l0ZSA9IHJlcXVpcmUoJy4vYmFzZV9jb21wb3NpdGUuanMnKTtcblxudmFyIExvY2FsQmFzZU1vZGVsID0gYmFzZUNvbXBvc2l0ZS5Nb2RlbC5leHRlbmQoe1xuXG4gICAgaXNBY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJ19pc0FjdGl2ZScpO1xuICAgIH0sXG5cbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KCdfaXNBY3RpdmUnLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldCgnX2lzQWN0aXZlJywgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQoJ19pc0FjdGl2ZScsICF0aGlzLmlzQWN0aXZlKCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYWN0aXZhdGVBbGxDaGlsZHJlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgICAgY2hpbGQuYWN0aXZhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBkZWFjdGl2YXRlQWxsQ2hpbGRyZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICB0b2dnbGVBbGxDaGlsZHJlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgICAgY2hpbGQudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBEZWFjdGl2YXRlIGFsbCBzaWJsaW5ncywgbm90IGluY2x1ZGluZyBzZWxmLlxuICAgICAqXG4gICAgICovXG4gICAgZGVhY3RpdmF0ZVNpYmxpbmdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgc2libGluZ3NJbmNsdWRpbmdTZWxmO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgPT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICAgICAgc2libGluZ3NJbmNsdWRpbmdTZWxmID0gdGhpcy5wYXJlbnQuY2hpbGRyZW47XG4gICAgICAgIHNpYmxpbmdzSW5jbHVkaW5nU2VsZi5mb3JFYWNoKGZ1bmN0aW9uKHNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgc2libGluZy5kZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEdldCBzaWJsaW5nIGluZGV4LlxuICAgICAqXG4gICAgICovXG4gICAgZ2V0U2libGluZ0luZGV4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNpYmxpbmdzSW5jbHVkaW5nU2VsZiA9IHRoaXMucGFyZW50LmNoaWxkcmVuO1xuICAgICAgICByZXR1cm4gc2libGluZ3NJbmNsdWRpbmdTZWxmLmluZGV4T2YodGhpcyk7XG4gICAgfSxcblxuICAgIC8qIFxuICAgICAqIElmIGV2ZXJ5IHNpYmxpbmcgaW4gb3JkZXIgZ290IGludGVnZXIgaW5kZWNlcyBiZXR3ZWVuIDEgYW5kIG4sIGludGVycG9sYXRlIGZvciBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbiAtIFRvcCBmcmllbmRseSBpbnRlZ2VyLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RnJpZW5kbHlTaWJsaW5nSW5kZXg6IGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmdldFNpYmxpbmdJbmRleCgpLFxuICAgICAgICAgICAgbWF4ID0gdGhpcy5nZXRTaWJsaW5nQ291bnRJbmNsdWRpbmdTZWxmKCk7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGkgKiAobiAtIDEpIC8gKG1heCAtIDEpICsgMSk7XG4gICAgfSxcblxuICAgIGdldFNpYmxpbmdDb3VudEluY2x1ZGluZ1NlbGY6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIH1cblxufSk7XG5cblxuLy8gQ29waWVkIGZyb20gY2xpZW50LlxuXG5leHBvcnRzLkZpbHRlclZhbHVlID0gTG9jYWxCYXNlTW9kZWwuZXh0ZW5kKHtcblxuICAgIHRlc3Q6IGZ1bmN0aW9uKGQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGosIGtleSwgbGVuLCByZXMsIHZhbCwgdmFsdWU7XG4gICAgICAgIGlmIChkID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCF0aGlzLmdldCgnX2lzQWN0aXZlJykpICYmICghKChvcHRpb25zICE9IG51bGwpICYmIG9wdGlvbnMuaWdub3JlU3RhdGUpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGZhbHNlO1xuICAgICAgICBrZXkgPSB0aGlzLnBhcmVudC5nZXQoJ3ZhcmlhYmxlX2lkJyk7XG4gICAgICAgIHZhbHVlID0gZFtrZXldO1xuICAgICAgICBpZiAoIV8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmFsID0gdmFsdWVbal07XG4gICAgICAgICAgICByZXMgPSByZXMgfHwgdGhpcy50ZXN0VmFsdWUodmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG5cbiAgICB0ZXN0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIHJlcyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5faXNOdW1lcmljRmlsdGVyKCkpIHtcbiAgICAgICAgICAgIGlmICgodmFsdWUgPCB0aGlzLmdldCgnbWF4JykpICYmICh2YWx1ZSA+PSB0aGlzLmdldCgnbWluJykpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5nZXQoJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICByZXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSxcblxuICAgIF9pc051bWVyaWNGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ2V0KCdtaW4nKSAhPSBudWxsKSAmJiAodGhpcy5nZXQoJ21heCcpICE9IG51bGwpO1xuICAgIH0sXG5cbiAgICBpc1BhcmVudEFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudCA9PT0gdGhpcy5wYXJlbnQucGFyZW50LmdldEFjdGl2ZUNoaWxkKCk7XG4gICAgfSxcblxuICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdGl2ZUtleUluZGV4LCBrZXlJbmRleDtcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAga2V5SW5kZXggPSB0aGlzLnBhcmVudC5nZXQoJ19pbmRleCcpO1xuICAgICAgICByZXR1cm4gYWN0aXZlS2V5SW5kZXggPSB0aGlzLnBhcmVudC5wYXJlbnQuZ2V0KCdhY3RpdmVJbmRleCcpO1xuICAgIH1cblxufSk7XG5cblxuZXhwb3J0cy5GaWx0ZXJLZXkgPSBMb2NhbEJhc2VNb2RlbC5leHRlbmQoe1xuXG4gICAgY2hpbGRNb2RlbDogZXhwb3J0cy5GaWx0ZXJWYWx1ZSxcblxuICAgIC8qXG4gICAgICogVG9nZ2xlIGl0ZW0gYXMgaXQgd2VyZSAnY2xpY2tlZCBvbicuIFxuICAgICAqIElmIHRoZSB2YWx1ZSBpcyBiZWluZyBhY3RpdmF0ZWQsIGFsbCBpdHMgc2libGluZ3MgbmVlZCB0byBiZSBkZWFjdGl2YXRlZC5cbiAgICAgKlxuICAgICAqL1xuICAgIGNsaWNrVG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlU2libGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFdoZW4gZGVhY3RpdmF0aW5nLCBhY3RpdmF0ZSBhbGwgY2hpbGRyZW4gYmFjay5cbiAgICAgKlxuICAgICAqL1xuICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldCgnX2lzQWN0aXZlJywgZmFsc2UpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGRNb2RlbCkge1xuICAgICAgICAgICAgY2hpbGRNb2RlbC5hY3RpdmF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHRvZ2dsZU9uZTogZnVuY3Rpb24oY2hpbGRJbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltjaGlsZEluZGV4XS50b2dnbGUoKTtcbiAgICB9LFxuXG4gICAgZ2V0VmFsdWVJbmRlY2VzOiBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICB2YXIgY2hpbGQsIGRhdGEsIGRhdGFJbmRlY2VzLCBpLCBqLCBsZW4sIHJlZjtcbiAgICAgICAgZGF0YSA9IChtb2RlbCAhPSBudWxsKSAmJiBfLmlzRnVuY3Rpb24obW9kZWwudG9KU09OKSA/IG1vZGVsLnRvSlNPTigpIDogbW9kZWw7XG4gICAgICAgIGRhdGFJbmRlY2VzID0gW107XG4gICAgICAgIHJlZiA9IHRoaXMuY2hpbGRyZW47XG4gICAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHJlZltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC50ZXN0KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgZGF0YUluZGVjZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YUluZGVjZXM7XG4gICAgfSxcblxuICAgIGdldFZhbHVlOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF0uZ2V0KCd2YWx1ZScpO1xuICAgIH0sXG5cbiAgICB0ZXN0OiBmdW5jdGlvbihkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBjaGlsZCwgaiwgbGVuLCByZWYsIHJlc3VsdDtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHJlZiA9IHRoaXMuY2hpbGRyZW47XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgY2hpbGQgPSByZWZbal07XG4gICAgICAgICAgICBpZiAoY2hpbGQudGVzdChkYXRhLCBvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbn0pO1xuXG5cbmV4cG9ydHMuRmlsdGVyVHJlZSA9IExvY2FsQmFzZU1vZGVsLmV4dGVuZCh7XG5cbiAgICBjaGlsZE1vZGVsOiBleHBvcnRzLkZpbHRlcktleSxcblxuICAgIHRlc3Q6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlQ2hpbGQoKS50ZXN0KGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFxuICAgICAqXG4gICAgICovXG4gICAgc2V0QWN0aXZlQ2hpbGRCeUluZGV4OiBmdW5jdGlvbihhY3RpdmVDaGlsZEluZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2FjdGl2ZUNoaWxkSW5kZXhdICE9PSB0aGlzLmdldEFjdGl2ZUNoaWxkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0QWN0aXZlQ2hpbGQoKS5kZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2FjdGl2ZUNoaWxkSW5kZXhdLmFjdGl2YXRlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogUmV0dXJuIGFjdGl2ZSBjaGlsZC5cbiAgICAgKlxuICAgICAqL1xuICAgIGdldEFjdGl2ZUNoaWxkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoaWxkLCBqLCBsZW4sIHJlZjtcbiAgICAgICAgcmVmID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHJlZltqXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogR2V0IFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0TWF0Y2hpbmdWYWx1ZTogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgdmFyIGluZDtcbiAgICAgICAgaW5kID0gdGhpcy5nZXRWYWx1ZUluZGVjZXMobW9kZWwpWzBdO1xuICAgICAgICBpZiAodGhpcy5nZXRBY3RpdmVDaGlsZCgpLmNoaWxkcmVuW2luZF0gPT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlQ2hpbGQoKS5jaGlsZHJlbltpbmRdLmdldCgndmFsdWUnKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKlxuICAgICAqXG4gICAgICovXG4gICAgZ2V0VmFsdWVDb3VudE9uQWN0aXZlS2V5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlQ2hpbGQoKS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgfSxcblxuICAgIGdldFZhbHVlSW5kZWNlczogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgdmFyIGFjaDtcbiAgICAgICAgYWNoID0gdGhpcy5nZXRBY3RpdmVDaGlsZCgpO1xuICAgICAgICByZXR1cm4gYWNoLmdldFZhbHVlSW5kZWNlcyhtb2RlbCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogR2V0ICdmcmllbmRseScsIGludGVnZXItZm9ybWF0dGVkIGtleSBhbmQgdmFsdWUgaW5kZWNlcywgdXNlZCBmb3IgY29sb3JpbmcuXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXRGcmllbmRseUluZGVjZXM6IGZ1bmN0aW9uKG1vZGVsLCBzY2FsZU1heCkge1xuICAgICAgICB2YXIgbWF4SW5kZXgsIHZhbHVlSW5kZWNlcztcbiAgICAgICAgdmFsdWVJbmRlY2VzID0gdGhpcy5nZXRWYWx1ZUluZGVjZXMobW9kZWwpO1xuICAgICAgICBtYXhJbmRleCA9IHRoaXMuZ2V0VmFsdWVDb3VudE9uQWN0aXZlS2V5KCk7XG4gICAgICAgIHJldHVybiB2YWx1ZUluZGVjZXMubWFwKGZ1bmN0aW9uKHZhbEluZGV4KSB7XG4gICAgICAgICAgICB2YXIgZnJpZW5kbHlJbmRleDtcbiAgICAgICAgICAgIGZyaWVuZGx5SW5kZXggPSBNYXRoLnJvdW5kKHZhbEluZGV4ICogKHNjYWxlTWF4IC0gMSkgLyAobWF4SW5kZXggLSAxKSArIDEpO1xuICAgICAgICAgICAgcmV0dXJuIGZyaWVuZGx5SW5kZXg7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSk7IiwidmFyIGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuanMnKTtcblxuZXhwb3J0cy5Nb2RlbCA9IGJhc2UuTW9kZWwuZXh0ZW5kKHtcblx0XG5cdGZpZWxkczogW1xuXG5cdFx0XG5cblx0XSxcblxuXHQvKipcblx0ICogUmVjb2duaXplIGFuZCBwcm9jZXNzIHNlcnZlciByZXNwb25zZS5cblx0ICogQHBhcmFtIHtvYmplY3R9IHJlc3AgLSBTZXJ2ZXIgcmVzcG9uc2UuXG5cdCAqIEByZXR1cm4ge29iamVjdH0gcmVzcCAtIE1vZGlmaWVkIHJlc3BvbnNlLlxuXHQgKi9cblx0cGFyc2U6IGZ1bmN0aW9uKHJlc3ApIHtcblx0XHRyZXNwID0gdGhpcy5fcmVtb3ZlQXJyYXlXcmFwcGVyKHJlc3ApO1xuXHRcdHJlc3AgPSB0aGlzLl9yZW1vdmVMaW5lQnJlYWtzKHJlc3AsICdlbmNvZGVkJyk7XG5cdFx0cmV0dXJuIHJlc3A7XG5cdH0sXG5cblx0LyoqIEdldHMgZW5jb2RlZCB1cmwgdG8gdXNlIGFzIGEgQ1NTIGJhY2tncm91bmQtaW1hZ2UuICovXG5cdGdldFVybDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGVuY29kZWQ7XG5cdFx0ZW5jb2RlZCA9IHRoaXMuZ2V0KCdlbmNvZGVkJyk7XG5cdFx0aWYgKGVuY29kZWQgIT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIFwidXJsKCdkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBlbmNvZGVkICsgXCInKVwiO1xuXHRcdH1cblx0fSxcblxuXHQvKiogR2V0cyBodG1sIGF0dHJpYnV0ZS4gKi9cblx0Z2V0QXR0cmlidXRpb25IdG1sOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRNYXJrZG93bkh0bWwoJ2NyZWRpdCcpO1xuXHR9XG59KTtcblxuZXhwb3J0cy5Db2xsZWN0aW9uID0gYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cblx0bW9kZWw6IGV4cG9ydHMuTW9kZWwsXG5cblx0YXBpVXJsOiAnL2FwaS92MS9pbWFnZXMnXG5cbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXG5cdGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuanMnKSxcblx0cmdmID0gcmVxdWlyZSgnLi9yaWNoX2dlb19mZWF0dXJlLmpzJyksXG5cdHN0YXRlcyA9IHJlcXVpcmUoJy4vLi4vLi4vZGIvc2VlZHMvc3RhdGVzLmpzb24nKTtcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHtcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG5cdH1cblx0cmV0dXJuIC0xO1xufTtcblxuLyoqIFxuICogQGNvbnN0cnVjdG9yXG4gKiBOb3RlIG9uIG1ldGhvZHMgdG9MYXRMb25nUG9pbnQsIHRvUmljaEdlb0pzb246IHRoZXNlIG1ldGhvZHMgYXNzdW1lIHRoYXQgdGhlIG1vZGVsIGluc3RhbmNlIGhhcyBhIGxhdCBhbmQgbG9uZyBmaWVsZHMuIFxuICovXG5leHBvcnRzLk1vZGVsID0gYmFzZS5Nb2RlbC5leHRlbmQoe1xuXHQvKiogXG5cdCAqIFJlY29nbml6ZSBhbmQgcHJvY2VzcyBkYXRhLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSBkYXRhIC0gTW9kaWZpZWQgZGF0YS5cblx0ICovXG5cdHBhcnNlOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dGhpcy5fcHJvY2Vzc1ZhbHVlcyhkYXRhKTtcblx0XHR0aGlzLl9jaGVja1BpbmRyb3AoZGF0YSk7XG5cdFx0dGhpcy5fY2hlY2tTdGF0ZShkYXRhKTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fSxcblx0XG5cdC8qKiBcblx0ICogU3BsaXRzIHVwIHZhbHVlcyBzZXBhcmF0ZWQgYnkgJ3wnIGFuZCByZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2VzLlxuXHQgKiBWYWx1ZXMgYXJlIG5vdCBzcGxpdCBpZiB0aGVyZSBpcyBhIHJldHVybiBjaGFyYWN0ZXIgKGFzc3VtZSB0ZXh0KS5cblx0ICogVmFsdWVzIGFyZSBjb252ZXJ0ZWQgaW50byBhcnJheXMgb25seSBpZiB0aGVyZSBpcyBhICd8JyBjaGFyYWN0ZXIuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gRGF0YSBvYmplY3Qgd2l0aCBrZXktdmFsdWUgcGFpcnMuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IGRhdGEgLSBNb2RpZmllZCBkYXRhLlxuXHQgKi9cblx0X3Byb2Nlc3NWYWx1ZXM6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIga2V5LCB2YWx1ZTtcblx0XHRmb3IgKGtleSBpbiBkYXRhKSB7XG5cdFx0XHR2YWx1ZSA9IGRhdGFba2V5XTtcblx0XHRcdGlmIChfLmlzU3RyaW5nKHZhbHVlKSkge1xuXHRcdFx0XHRpZiAoKHZhbHVlLmluZGV4T2YoXCJ8XCIpID4gLTEpICYmICh2YWx1ZS5pbmRleE9mKFwiXFxuXCIpID09PSAtMSkpIHtcblx0XHRcdFx0XHRkYXRhW2tleV0gPSBfLm1hcCh2YWx1ZS5zcGxpdCgnfCcpLCBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS50cmltKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGF0YVtrZXldID0gdmFsdWUudHJpbSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXHRcblx0LyoqIFxuXHQgKiBSZWNvZ25pemVzLCB2YWxpZGF0ZXMgYW5kIHJldHVybnMgYSBwaW5kcm9wIGl0ZW0uXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IC0gVmFsaWRhdGlvbiBzdW1tYXJ5IG9iamVjdC5cblx0ICovXG5cdF9jaGVja1BpbmRyb3A6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgZXJyb3JzLCBmb3VuZExhdCwgZm91bmRMb25nO1xuXHRcdGVycm9ycyA9IFtdO1xuXHRcdGZvdW5kTGF0ID0gdGhpcy5fZmluZEFuZFJlcGxhY2VLZXkoZGF0YSwgJ2xhdCcsIFsnbGF0aXR1ZGUnLCAnTGF0aXR1ZGUnLCAnbGF0JywgJ0xhdCddKTtcblx0XHRmb3VuZExvbmcgPSB0aGlzLl9maW5kQW5kUmVwbGFjZUtleShkYXRhLCAnbG9uZycsIFsnbG9uZ2l0dWRlJywgJ0xvbmdpdHVkZScsICdsb25nJywgJ0xvbmcnXSk7XG5cdFx0aWYgKGZvdW5kTGF0ICYmIGZvdW5kTG9uZykge1xuXHRcdFx0ZGF0YS5faXRlbVR5cGUgPSAncGluZHJvcCc7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyZWNvZ25pemVkOiB0cnVlLFxuXHRcdFx0XHRlcnJvcnM6IFtdXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoZm91bmRMYXQgfHwgZm91bmRMb25nKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyZWNvZ25pemVkOiB0cnVlLFxuXHRcdFx0XHRlcnJvcnM6IFsnTGF0aXR1ZGUgb3IgbG9uZ2l0dWRlIG5vdCBmb3VuZC4nXVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlY29nbml6ZWQ6IGZhbHNlXG5cdFx0fTtcblx0fSxcblx0XG5cdC8qKiBcblx0ICogUmVjb2duaXplcywgdmFsaWRhdGVzIGFuZCByZXR1cm5zIGEgVVMgc3RhdGUuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IC0gVmFsaWRhdGlvbiBzdW1tYXJ5IG9iamVjdC5cblx0ICovXG5cdF9jaGVja1N0YXRlOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dmFyIGVycm9ycywgc3RhdGVEYXRhO1xuXHRcdGVycm9ycyA9IFtdO1xuXHRcdGlmIChkYXRhLm5hbWUgIT0gbnVsbCkge1xuXHRcdFx0c3RhdGVEYXRhID0gXy53aGVyZShzdGF0ZXMsIHtcblx0XHRcdFx0bmFtZTogZGF0YS5uYW1lXG5cdFx0XHR9KTtcblx0XHRcdGlmICgoc3RhdGVEYXRhICE9IG51bGwpICYmIHN0YXRlRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGRhdGEuaWQgPSBzdGF0ZURhdGFbMF0uaWQ7XG5cdFx0XHRcdGRhdGEuY29kZSA9IHN0YXRlRGF0YVswXS5jb2RlO1xuXHRcdFx0XHRkYXRhLl9pdGVtVHlwZSA9ICdzdGF0ZSc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlcnJvcnMucHVzaChkYXRhLm5hbWUgKyAnIG5vdCByZWNvZ25pemVkIGFzIGEgc3RhdGUuIFBvc3NpYmx5IGEgdHlwby4nKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlY29nbml6ZWQ6IHRydWUsXG5cdFx0XHRcdGVycm9yczogZXJyb3JzXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVjb2duaXplZDogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXHRcblx0LyoqIFxuXHQgKiBHZXQgYW5kIGZvcm1hdCBpbWFnZSBuYW1lLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIC0gTG93ZXItY2FzZWQgbmFtZSB3aXRob3V0IGxpbmUgYnJlYWtzLlxuXHQgKi9cblx0Z2V0SW1hZ2VOYW1lOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5nZXQoJ2ltYWdlJykgIT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0KCdpbWFnZScpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5nZXQoJ25hbWUnKS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuXHR9LFxuXHRcblx0LyoqIFxuXHQgKiBTZXRzIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgYXMgYSBzaW1wbGUgYXJyYXkuXG5cdCAqIEByZXR1cm5zIHthcnJheX0gLSBTcGF0aWFsIGRhdGEgcG9pbnQgYXMgc2ltcGxlIGFycmF5IFtMYXQsIExvbmddLlxuXHQgKi9cblx0dG9MYXRMb25nUG9pbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBsYXQsIGxvbmc7XG5cdFx0bGF0ID0gdGhpcy5nZXQoJ2xhdCcpO1xuXHRcdGxvbmcgPSB0aGlzLmdldCgnbG9uZycpO1xuXHRcdGlmIChsYXQgPT0gbnVsbCkge1xuXHRcdFx0bGF0ID0gLTM3Ljg2MDI4Mjg7XG5cdFx0fVxuXHRcdGlmIChsb25nID09IG51bGwpIHtcblx0XHRcdGxvbmcgPSAxNDUuMDc5NjE2MTtcblx0XHR9XG5cdFx0cmV0dXJuIFtsYXQsIGxvbmddO1xuXHR9LFxuXHRcblx0LyoqIFxuXHQgKiBSZXZlcnNlcyBbTGF0LCBMb25nXSBwb2ludCBhbmQgc2V0cyBsb25naXR1ZGUgYW5kIGxhdGl0dWRlIGFzIGEgc2ltcGxlIGFycmF5LlxuXHQgKiBAcmV0dXJucyB7YXJyYXl9IC0gU3BhdGlhbCBkYXRhIHBvaW50IGFzIHNpbXBsZSBhcnJheSBbTG9uZywgTGF0XS5cblx0ICovXG5cdHRvTG9uZ0xhdFBvaW50OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50b0xhdExvbmdQb2ludCgpLnJldmVyc2UoKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGdlb0pzb24gb2JqZWN0IGZyb20gY3VycmVudCBtb2RlbC5cblx0ICogQHJldHVybnMge29iamVjdH0gZ2VvSnNvbi5cblx0ICovXG5cdHRvUmljaEdlb0pzb25GZWF0dXJlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZ2VvSnNvbjtcblx0XHRnZW9Kc29uID0ge1xuXHRcdFx0dHlwZTogJ0ZlYXR1cmUnLFxuXHRcdFx0X21vZGVsOiB0aGlzLFxuXHRcdFx0Z2VvbWV0cnk6IHtcblx0XHRcdFx0dHlwZTogJ1BvaW50Jyxcblx0XHRcdFx0Y29vcmRpbmF0ZXM6IHRoaXMudG9Mb25nTGF0UG9pbnQoKVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmV0dXJuIGdlb0pzb247XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJldHVybnMgZGlzcGxheSBzdGF0ZS5cblx0ICogQHBhcmFtIHt9XG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IGRpc3BsYXlTdGF0ZSAtIEVsZW1lbnQgb2YgWyAnbmV1dHJhbCcsICdoaWdobGlnaHRlZCcsICdpbmFjdGl2ZScgXVxuXHQgKi9cblx0Z2V0RGlzcGxheVN0YXRlOiBmdW5jdGlvbihmaWx0ZXIsIHNlYXJjaFRlcm0sIGN1cnJlbnREaXNwbGF5TW9kZSkge1xuXG5cdFx0dmFyIGZpbHRlckluZGVjZXMsIHZhbHVlSG92ZXJJbmRleCwgaXNGaWx0ZXJlZDtcblxuXHRcdGlmIChjdXJyZW50RGlzcGxheU1vZGUgPT09ICdmaWx0ZXInKSB7XG5cblx0XHRcdGZpbHRlckluZGVjZXMgPSBmaWx0ZXIuZ2V0VmFsdWVJbmRlY2VzKHRoaXMpO1xuXHRcdFx0dmFsdWVIb3ZlckluZGV4ID0gZmlsdGVyLnN0YXRlLnZhbHVlSG92ZXJJbmRleDtcblx0XHRcdGlzRmlsdGVyZWQgPSAoZmlsdGVySW5kZWNlcy5sZW5ndGggPiAwKTtcblxuXHRcdFx0aWYgKCFpc0ZpbHRlcmVkKSB7IHJldHVybiAnaW5hY3RpdmUnOyB9XG5cblx0XHRcdGlmIChmaWx0ZXJJbmRlY2VzLmluZGV4T2YodmFsdWVIb3ZlckluZGV4KSA+IC0xKSB7XG5cdFx0XHRcdHJldHVybiAnaGlnaGxpZ2h0ZWQnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9XG5cblx0XHRpZiAodGhpcy5tYXRjaGVzU2VhcmNoVGVybShzZWFyY2hUZXJtKSkgeyByZXR1cm4gJ25ldXRyYWwnOyB9XG5cdFx0cmV0dXJuICdpbmFjdGl2ZSc7XG5cblx0fSxcblxuXHQvKiogXG5cdCAqIFJldHVybnMgbGF5ZXIgY2xhc3NuYW1lcyB0byBiZSBhcHBsaWVkIG9uIHRoZSBtb2RlbC5cblx0ICogQ2xhc3NuYW1lcyBjb25zaXN0IG9mIGdyb3VwIGNsYXNzZXMgYW5kIGVsZW1lbnQgY2xhc3Nlcy5cblx0ICogR3JvdXAgY2xhc3NlcyBzcGVjaWZpeSBnZW5lcmljIHN0eWxlcyBzdWNoIGFzIGhpZ2hsaWdodGVkLCBpbmFjdGl2ZSwgbmV1dHJhbC5cblx0ICogRWxlbWVudCBjbGFzc2VzIHN0eWxlIGNvbXBvbmVudHMgb2YgdGhlIGdyYXBoaWNzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGl0ZW0uIEUuZy4gbWFwLXBpbiBkaXZpZGVyc1xuXHQgKiBAcGFyYW0ge29iamVjdH0gZmlsdGVyIC0gRmlsdGVyIG9iamVjdC5cblx0ICogQHBhcmFtIHtvYmplY3R9IHZhbHVlSG92ZXJJbmRleCAtIEluZGV4IG9mIGhvdmVyZWQgdmFsdWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hUZXJtXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlQ2xhc3MgLSBCYXNlIGNsYXNzLlxuXHQgKiBAcGFyYW0ge30gY3VycmVudERpc3BsYXlNb2RlXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IGxheWVyQ2xhc3NlcyAtIE9iamVjdCB3aXRoIHRocmVlIGtleXM6IGdyb3VwLCBlbGVtZW50IGJhc2UsIGFuZCBlbGVtZW50cyAoYXJyYXkpXG5cdCAqL1xuXHRnZXRMYXllckNsYXNzZXM6IGZ1bmN0aW9uKGZpbHRlciwgc2VhcmNoVGVybSwgYmFzZUNsYXNzLCBjdXJyZW50RGlzcGxheU1vZGUpIHtcblxuXHRcdHZhciBmaWx0ZXJJbmRlY2VzLCBsYXllckNsYXNzZXMsIGRpc3BsYXlTdGF0ZTtcblxuXHRcdGlmIChiYXNlQ2xhc3MgPT0gbnVsbCkgeyBiYXNlQ2xhc3MgPSAnbWFwLXJlZ2lvbic7IH1cblxuXHRcdGxheWVyQ2xhc3NlcyA9IHtcblx0XHRcdGdyb3VwOiBiYXNlQ2xhc3MsXG5cdFx0XHRlbGVtZW50QmFzZTogYmFzZUNsYXNzICsgJ19fZWxlbWVudCdcblx0XHR9O1xuXG5cdFx0ZGlzcGxheVN0YXRlID0gdGhpcy5nZXREaXNwbGF5U3RhdGUoZmlsdGVyLCBzZWFyY2hUZXJtLCBjdXJyZW50RGlzcGxheU1vZGUpO1xuXHRcdGlmIChkaXNwbGF5U3RhdGUgIT0gbnVsbCkgeyBsYXllckNsYXNzZXMuZ3JvdXAgKz0gKCcgJyArIGJhc2VDbGFzcyArICctLScgKyBkaXNwbGF5U3RhdGUpOyB9XG5cblx0XHRyZXR1cm4gbGF5ZXJDbGFzc2VzO1xuXG5cdH0sXG5cdFxuXHQvKiogXG5cdCAqIEV2YWx1YXRlcyB3aGV0aGVyIHRoZSBuYW1lIGF0dHJpYnV0ZSBtYXRjaGVzIGEgc2VhcmNoIHRlcm0uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hUZXJtXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSAtIE1hdGNoIHJlc3VsdC5cblx0ICovXG5cdG1hdGNoZXNTZWFyY2hUZXJtOiBmdW5jdGlvbihzZWFyY2hUZXJtKSB7XG5cdFx0dmFyIG5hbWU7XG5cdFx0bmFtZSA9IHRoaXMuZ2V0KCduYW1lJyk7XG5cdFx0aWYgKHNlYXJjaFRlcm0gPT0gbnVsbCB8fCBzZWFyY2hUZXJtLnRvTG93ZXJDYXNlID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0aWYgKG5hbWUgPT0gbnVsbCB8fCBuYW1lLnRvTG93ZXJDYXNlID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0aWYgKHNlYXJjaFRlcm0gPT09IFwiXCIpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHNlYXJjaFRlcm0gPSBzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKG5hbWUgPT09IFwiXCIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0aWYgKG5hbWUuaW5kZXhPZihzZWFyY2hUZXJtKSA9PT0gLTEpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxufSk7XG5cblxuZXhwb3J0cy5Db2xsZWN0aW9uID0gYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cdG1vZGVsOiBleHBvcnRzLk1vZGVsLFxuXHRcblx0LyoqIFxuXHQgKiBHZXRzIGl0ZW0gdHlwZSBmaXJzdCBtb2RlbCBpbiBhIGNvbGxlY3Rpb24uXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IGl0ZW1UeXBlXG5cdCAqL1xuXHRnZXRJdGVtVHlwZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGl0ZW1UeXBlO1xuXHRcdGl0ZW1UeXBlID0gdGhpcy5tb2RlbHNbMF0uZ2V0KCdfaXRlbVR5cGUnKTtcblx0XHRyZXR1cm4gaXRlbVR5cGU7XG5cdH0sXG5cdFxuXHQvKiogXG5cdCAqIFNldCBhY3RpdmUgbW9kZWwgdW5kZXIgY29sbGVjdGlvbiBhY3RpdmUgZmllbGQuXG5cdCAqIEBwYXJhbSB7fSBhY3RpdmVNb2RlbCAtIEFjdGl2ZSBtb2RlbCBvciBpdHMgaWQuXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9IHRoaXNcblx0ICovXG5cdHNldEFjdGl2ZTogZnVuY3Rpb24oYWN0aXZlTW9kZWwpIHtcblx0XHR2YXIgaWQ7XG5cdFx0aWYgKChfLmlzT2JqZWN0KGFjdGl2ZU1vZGVsKSkgJiYgKGluZGV4T2YuY2FsbCh0aGlzLm1vZGVscywgYWN0aXZlTW9kZWwpID49IDApKSB7XG5cdFx0XHR0aGlzLmFjdGl2ZSA9IGFjdGl2ZU1vZGVsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZCA9IHBhcnNlSW50KGFjdGl2ZU1vZGVsLCAxMCk7XG5cdFx0XHR0aGlzLmFjdGl2ZSA9IGlkID09PSAtMSA/IHZvaWQgMCA6IHRoaXMuZmluZFdoZXJlKHtcblx0XHRcdFx0aWQ6IGlkXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdFxuXHQvKiogXG5cdCAqIFNldCBob3ZlcmVkIG1vZGVsIHVuZGVyIGNvbGxlY3Rpb24gaG92ZXJlZCBmaWVsZC5cblx0ICogQHBhcmFtIHt9IGhvdmVyZWRNb2RlbCAtIEhvdmVyZWQgbW9kZWwgb3IgaXRzIGlkLlxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGlzXG5cdCAqL1xuXHRzZXRIb3ZlcmVkOiBmdW5jdGlvbihob3ZlcmVkTW9kZWwpIHtcblx0XHR2YXIgaWQ7XG5cdFx0aWYgKChfLmlzT2JqZWN0KGhvdmVyZWRNb2RlbCkpICYmIChpbmRleE9mLmNhbGwodGhpcy5tb2RlbHMsIGhvdmVyZWRNb2RlbCkgPj0gMCkpIHtcblx0XHRcdHRoaXMuaG92ZXJlZCA9IGhvdmVyZWRNb2RlbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWQgPSBwYXJzZUludChob3ZlcmVkTW9kZWwsIDEwKTtcblx0XHRcdHRoaXMuaG92ZXJlZCA9IChpZCA9PT0gLTEpID8gdW5kZWZpbmVkIDogdGhpcy5maW5kV2hlcmUoe1xuXHRcdFx0XHRpZDogaWRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0XG5cdC8qKiBcblx0ICogR2V0cyBsaXN0cyBvZiB2YWx1ZXMgZm9yIGEgZ2l2ZW4ga2V5LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gQW55IGtleSBpbiBtb2RlbHMuXG5cdCAqIEByZXR1cm5zIHthcnJheX0gdmFsdWVMaXN0IC0gTGlzdCBvZiB2YWx1ZXMgZm9yIHNwZWNpZmllZCBrZXkuXG5cdCAqL1xuXHRnZXRWYWx1ZUxpc3Q6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHZhciBqLCBsLCBsZW4sIGxlbjEsIG1vZGVsLCByZWYsIHZhbCwgdmFsdWUsIHZhbHVlTGlzdDtcblx0XHR2YWx1ZUxpc3QgPSBbXTtcblx0XHRyZWYgPSB0aGlzLm1vZGVscztcblx0XHRmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcblx0XHRcdG1vZGVsID0gcmVmW2pdO1xuXHRcdFx0dmFsdWUgPSBtb2RlbC5nZXQoa2V5KTtcblx0XHRcdGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGZvciAobCA9IDAsIGxlbjEgPSB2YWx1ZS5sZW5ndGg7IGwgPCBsZW4xOyBsKyspIHtcblx0XHRcdFx0XHR2YWwgPSB2YWx1ZVtsXTtcblx0XHRcdFx0XHRpZiAoaW5kZXhPZi5jYWxsKHZhbHVlTGlzdCwgdmFsKSA8IDApIHtcblx0XHRcdFx0XHRcdHZhbHVlTGlzdC5wdXNoKHZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoaW5kZXhPZi5jYWxsKHZhbHVlTGlzdCwgdmFsdWUpIDwgMCkge1xuXHRcdFx0XHRcdHZhbHVlTGlzdC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWVMaXN0O1xuXHR9LFxuXHRcblx0LyoqIFRPRE86IEdldHMgdmFsdWUgbGlzdCBzb3J0ZWQgYnkgZnJlcXVlbmN5IGluIHRoZSBkYXRhLiAqL1xuXHRnZXRTb3J0ZWRWYWx1ZUxpc3Q6IGZ1bmN0aW9uKGtleSkge30sXG5cdFxuXHQvKiogXG5cdCAqIEFzc3VtZXMgdGhlIG1vZGVsIGhhcyBhIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgZmllbGRzLlxuXHQgKiBNdXN0IGZpcnN0IGdvIHRocm91Z2ggcGFyc2UgbWV0aG9kIHRvIG1ha2Ugc3VyZSB0aGVzZSBmaWVsZHMgYXJlIG5hbWVkIGNvcnJlY3RseS5cblx0ICogQHJldHVybnMge2FycmF5fSBhcnJheSBvZiBhcnJheXMgLSBMYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIGJvdW5kcywgdHdvIGFycmF5cyB3aXRoIHR3byBlbGVtZW50cyBlYWNoLlxuXHQgKi9cblx0Z2V0TGF0TG9uZ0JvdW5kczogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGosIGxhdCwgbGVuLCBsb25nLCBtYXhMYXQsIG1heExvbmcsIG1pbkxhdCwgbWluTG9uZywgbW9kZWwsIHJlZjtcblx0XHRyZWYgPSB0aGlzLm1vZGVscztcblx0XHRmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcblx0XHRcdG1vZGVsID0gcmVmW2pdO1xuXHRcdFx0bGF0ID0gbW9kZWwuZ2V0KCdsYXQnKTtcblx0XHRcdGxvbmcgPSBtb2RlbC5nZXQoJ2xvbmcnKTtcblx0XHRcdGlmICgodHlwZW9mIG1pbkxhdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBtaW5MYXQgPT09IG51bGwpIHx8IChtaW5MYXQgPiBsYXQpKSB7XG5cdFx0XHRcdG1pbkxhdCA9IGxhdDtcblx0XHRcdH1cblx0XHRcdGlmICgodHlwZW9mIG1heExhdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBtYXhMYXQgPT09IG51bGwpIHx8IChtYXhMYXQgPCBsYXQpKSB7XG5cdFx0XHRcdG1heExhdCA9IGxhdDtcblx0XHRcdH1cblx0XHRcdGlmICgodHlwZW9mIG1pbkxvbmcgPT09IFwidW5kZWZpbmVkXCIgfHwgbWluTG9uZyA9PT0gbnVsbCkgfHwgKG1pbkxvbmcgPiBsb25nKSkge1xuXHRcdFx0XHRtaW5Mb25nID0gbG9uZztcblx0XHRcdH1cblx0XHRcdGlmICgodHlwZW9mIG1heExvbmcgPT09IFwidW5kZWZpbmVkXCIgfHwgbWF4TG9uZyA9PT0gbnVsbCkgfHwgKG1heExvbmcgPCBsb25nKSkge1xuXHRcdFx0XHRtYXhMb25nID0gbG9uZztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFtcblx0XHRcdFttaW5MYXQsIG1pbkxvbmddLFxuXHRcdFx0W21heExhdCwgbWF4TG9uZ11cblx0XHRdO1xuXHR9LFxuXHRcblx0LyoqIFxuXHQgKiBDcmVhdGVzIHNpbmdsZSBhcnJheSBmcm9tIGxhdCwgbG9uZyBhcnJheXMgb2YgZWFjaCBtb2RlbCBpbnRvIG9uZSBhcnJheSAoYXJyYXkgb2YgYXJyYXlzKS5cblx0ICogQHJldHVybnMge2FycmF5fSByZXMgLSBSZXR1cm5zIGFycmF5IG9mIGFycmF5cy4gRS5nLiBbW2xhdCwgbG9uZ10sIFtsYXQsIGxvbmddXVxuXHQgKi9cblx0dG9MYXRMb25nTXVsdGlQb2ludDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGosIGxlbiwgbW9kZWwsIHJlZiwgcmVzO1xuXHRcdHJlcyA9IFtdO1xuXHRcdHJlZiA9IHRoaXMubW9kZWxzO1xuXHRcdGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuXHRcdFx0bW9kZWwgPSByZWZbal07XG5cdFx0XHRyZXMucHVzaChtb2RlbC50b0xhdExvbmdQb2ludCgpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlcztcblx0fSxcblx0XG5cdHJpY2hHZW9Kc29uQnVpbGRlcnM6IHtcblxuXHRcdHN0YXRlOiBmdW5jdGlvbihjb2xsZWN0aW9uLCBiYXNlR2VvRGF0YSkge1xuXHRcdFx0dmFyIGRhdGEsIHJpY2hHZW9Kc29uLCBzZXR1cDtcblx0XHRcdHJpY2hHZW9Kc29uID0gbmV3IHJnZi5Db2xsZWN0aW9uKCk7XG5cdFx0XHRzZXR1cCA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0dmFyIGZlYXR1cmUsIGl0ZW0sIGosIGxlbiwgcmVmO1xuXHRcdFx0XHRyaWNoR2VvSnNvbi5mZWF0dXJlcyA9IHRvcG9qc29uLmZlYXR1cmUoZGF0YSwgZGF0YS5vYmplY3RzLnN0YXRlcykuZmVhdHVyZXM7XG5cdFx0XHRcdHJlZiA9IHJpY2hHZW9Kc29uLmZlYXR1cmVzO1xuXHRcdFx0XHRmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcblx0XHRcdFx0XHRmZWF0dXJlID0gcmVmW2pdO1xuXHRcdFx0XHRcdGl0ZW0gPSBjb2xsZWN0aW9uLmZpbmRXaGVyZSh7XG5cdFx0XHRcdFx0XHRpZDogZmVhdHVyZS5pZFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGZlYXR1cmUuX21vZGVsID0gaXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmljaEdlb0pzb24udHJpZ2dlcignc3luYycpO1xuXHRcdFx0fTtcblx0XHRcdHNldHVwKGJhc2VHZW9EYXRhKTtcblx0XHRcdHJldHVybiByaWNoR2VvSnNvbjtcblx0XHR9LFxuXG5cdFx0cGluZHJvcDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuXHRcdFx0dmFyIGl0ZW0sIGosIGxlbiwgcmVmLCByaWNoR2VvSnNvbjtcblx0XHRcdHJpY2hHZW9Kc29uID0gbmV3IHJnZi5Db2xsZWN0aW9uKCk7XG5cdFx0XHRyZWYgPSBjb2xsZWN0aW9uLm1vZGVscztcblx0XHRcdGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuXHRcdFx0XHRpdGVtID0gcmVmW2pdO1xuXHRcdFx0XHRyaWNoR2VvSnNvbi5mZWF0dXJlcy5wdXNoKGl0ZW0udG9SaWNoR2VvSnNvbkZlYXR1cmUoKSk7XG5cdFx0XHR9XG5cdFx0XHRyaWNoR2VvSnNvbi50cmlnZ2VyKCdzeW5jJyk7XG5cdFx0XHRyZXR1cm4gcmljaEdlb0pzb247XG5cdFx0fVxuXG5cdH0sXG5cdFxuXHQvKiogXG5cdCAqIFRoZSBmZWF0dXJlIGlzIGVpdGhlciByZWFkeSB0byB1c2Ugb3IgdHJpZ2dlcnMgYSBzeW5jIGV2ZW50IG9uIGl0c2VsZiBvbmNlIGl0IGlzLlxuXHQgKiBAcmV0dXJucyB7fSAtIEdlbmVyaWMgUmljaCBHZW9Kc29uIGZlYXR1cmUuXG5cdCAqL1xuXHRnZXRSaWNoR2VvSnNvbjogZnVuY3Rpb24oYmFzZUdlb0RhdGEpIHtcblx0XHR2YXIgdHlwZTtcblx0XHR0eXBlID0gdGhpcy5nZXRJdGVtVHlwZSgpO1xuXHRcdHJldHVybiB0aGlzLnJpY2hHZW9Kc29uQnVpbGRlcnNbdHlwZV0odGhpcywgYmFzZUdlb0RhdGEpO1xuXHR9XG5cbn0pO1xuIiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG4gICAgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxuICAgIGZvcm1hdHRlcnMgPSByZXF1aXJlKCcuLy4uL3V0aWxpdGllcy9mb3JtYXR0ZXJzLmpzJyksXG4gICAgYmFzZSA9IHJlcXVpcmUoJy4vYmFzZS5qcycpLFxuICAgIGZpbHRlciA9IHJlcXVpcmUoJy4vZmlsdGVyLmpzJyksXG4gICAgdmFyaWFibGUgPSByZXF1aXJlKCcuL3ZhcmlhYmxlLmpzJyksXG4gICAgaXRlbSA9IHJlcXVpcmUoJy4vaXRlbS5qcycpO1xuXG5cbmV4cG9ydHMuTW9kZWwgPSBiYXNlLk1vZGVsLmV4dGVuZCh7XG5cbiAgICBmaWVsZHM6IFtcblxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3RpdGxlJyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnROYW1lOiAnVGV4dCcsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50UHJvcHM6IHtcbiAgICAgICAgICAgICAgICBpZDogJ3RpdGxlJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdQcm9qZWN0IFRpdGxlJyxcbiAgICAgICAgICAgICAgICBoaW50OiAnJyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIFByb2plY3QgVGl0bGUnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdhdXRob3InLFxuICAgICAgICAgICAgZm9ybUNvbXBvbmVudE5hbWU6ICdUZXh0JyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnRQcm9wczoge1xuICAgICAgICAgICAgICAgIGlkOiAnYXV0aG9yJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdBdXRob3InLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICcnLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRW50ZXIgQXV0aG9yJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnaXNfc2VjdGlvbl9vdmVydmlldycsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50TmFtZTogJ1JhZGlvJyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnRQcm9wczoge1xuICAgICAgICAgICAgICAgIGlkOiAnaXNfc2VjdGlvbl9vdmVydmlldycsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnSXMgc2VjdGlvbiBvdmVydmlldy4nLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdFYWNoIHNlY3Rpb24gaGFzIG9uZSBvdmVydmlldyBwcm9qZWN0IC0gY2hlY2sgaWYgdGhpcyBpcyBvbmUgb2YgdGhlbTonLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IFsgJ1llcycsICdObycgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9uOiAnWWVzJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnaXNfbGl2ZScsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50TmFtZTogJ1JhZGlvJyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnRQcm9wczoge1xuICAgICAgICAgICAgICAgIGlkOiAnaXNfbGl2ZScsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnSXMgbGl2ZS4nLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdQbGVhc2Ugc3BlY2lmeSB3aGV0aGVyIHRoaXMgcHJvamVjdCBpcyB2aWV3YWJsZSBvbiB0aGUgbGl2ZSBzaXRlLiBDaGFuZ2VzIHRha2UgZWZmZWN0IGltbWVkaWF0ZWx5LicsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogWyAnWWVzJywgJ05vJyBdLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb246ICdZZXMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdwcm9qZWN0X3NlY3Rpb25faWRzJyxcbiAgICAgICAgICAgIG5hbWU6ICdQcm9qZWN0IFNlY3Rpb25zJyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnROYW1lOiAnTXVsdGlwbGVTZWxlY3QnLFxuICAgICAgICAgICAgZm9yZWlnbk1vZGVsTmFtZTogJ1Byb2plY3RTZWN0aW9uJyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnRQcm9wczoge1xuICAgICAgICAgICAgICAgIGlkOiAncHJvamVjdF9zZWN0aW9uX2lkcycsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnUHJvamVjdCBTZWN0aW9ucycsXG4gICAgICAgICAgICAgICAgaGludDogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3Byb2plY3RfdGVtcGxhdGVfaWQnLFxuICAgICAgICAgICAgZm9ybUNvbXBvbmVudE5hbWU6ICdTaW5nbGVTZWxlY3QnLFxuICAgICAgICAgICAgZm9ybUNvbXBvbmVudFByb3BzOiB7XG4gICAgICAgICAgICAgICAgaWQ6ICdwcm9qZWN0X3RlbXBsYXRlX2lkJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdQcm9qZWN0IFRlbXBsYXRlJyxcbiAgICAgICAgICAgICAgICBoaW50OiAnRGV0ZXJtaW5lcyBob3cgZGF0YSBpcyBkaXNwbGF5ZWQsIGUuZy4gRXhwbGFpbmVyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcmVpZ25Nb2RlbE5hbWU6ICdQcm9qZWN0VGVtcGxhdGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICd0YWdzJyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnROYW1lOiAnU2VsZWN0aXplVGV4dCcsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50UHJvcHM6IHtcbiAgICAgICAgICAgICAgICBpZDogJ3RhZ3MnLFxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJ1RhZ3MnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdUYWdzJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnYm9keV90ZXh0JyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnROYW1lOiAnQ0tFZGl0b3InLFxuICAgICAgICAgICAgZm9ybUNvbXBvbmVudFByb3BzOiB7XG4gICAgICAgICAgICAgICAgaWQ6ICdib2R5X3RleHQnLFxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJ0JvZHkgVGV4dCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ2RhdGEnLFxuICAgICAgICAgICAgZm9ybUNvbXBvbmVudE5hbWU6ICdTcHJlYWRzaGVldEZpbGUnLFxuICAgICAgICAgICAgZm9ybUNvbXBvbmVudFByb3BzOiB7XG4gICAgICAgICAgICAgICAgaWQ6ICdkYXRhJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdEYXRhIGZpbGUnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICcnLFxuICAgICAgICAgICAgICAgIHdvcmtzaGVldHM6IFsgJ2RhdGEnLCAndmFyaWFibGVzJyBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdpbWFnZScsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50TmFtZTogJ0ltYWdlRmlsZScsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50UHJvcHM6IHtcbiAgICAgICAgICAgICAgICBpZDogJ2ltYWdlJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdJbWFnZSBGaWxlJyxcbiAgICAgICAgICAgICAgICBoaW50OiAnJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnaW1hZ2VfY3JlZGl0JyxcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnROYW1lOiAnVGV4dCcsXG4gICAgICAgICAgICBmb3JtQ29tcG9uZW50UHJvcHM6IHtcbiAgICAgICAgICAgICAgICBpZDogJ2ltYWdlX2NyZWRpdCcsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnSW1hZ2UgQ3JlZGl0JyxcbiAgICAgICAgICAgICAgICBoaW50OiBcIlNpbmdsZSBVUkwgb3IgTWFya2Rvd24sIGUuZy4gJ0ltYWdlIHN1cHBsaWVkIGJ5IFtJbWFnZSBDb3Jwb3JhdGlvbl0oaHR0cDovL3d3dy5pbWdjcnAuY29tKSc6XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgXSxcblxuICAgIHVybFJvb3Q6ICcvYXBpL3YxL3Byb2plY3RzJyxcblxuICAgIC8qKiBBUEkgcXVlcmllcyB0aGF0IG5lZWQgdG8gYmUgaGFuZGxlZCBjdXN0b20uIEZvciBldmVyeSBrZXksIHRoZXJlIGlzIGEgdGhpcy5pc18je2tleX0gbWV0aG9kIHRoYXQgZmlsdGVycyBhIG1vZGVsLiAqL1xuICAgIGN1c3RvbVF1ZXJ5S2V5czogWydyZWxhdGVkX3RvJ10sXG5cbiAgICAvKiogXG4gICAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBBdGxhcyBBUEkgdGhhdCBob2xkcyB0aGUgZGF0YSBmb3IgdGhlIHByb2plY3QuIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHVybFxuICAgICAqL1xuICAgIHVybDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFJvb3QgKyAoXCI/YXRsYXNfdXJsPVwiICsgKHRoaXMuZ2V0KCdhdGxhc191cmwnKSkpO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBCdWlsZC5BdGxhcyBBUEkgdGhhdCBob2xkcyB0aGUgZGF0YSBmb3IgdGhlIHByb2plY3QuIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGJ1aWxkVXJsXG4gICAgICovXG4gICAgYnVpbGRVcmw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJodHRwOi8vYnVpbGQuYXRsYXMubmV3YW1lcmljYS5vcmcvcHJvamVjdHMvXCIgKyAodGhpcy5nZXQoJ2lkJykpICsgXCIvZWRpdFwiO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogQ29udmVyc3RzIG1vZGVsIG9iamVjdCB0byBqc29uXG4gICAgICogQ2hlY2tzIGlmIGl0IGhhcyBtYW5kYXRvcnkgZmllbGRzIChpZCBhbmQgbW9yZSB0aGFuIG9uZSBrZXkpLiBcbiAgICAgKiByZXR1cm5zIHtib29sZWFufSAtIFdoZXRoZXIgbWFkYXRvcnkgZmllbGRzIGV4aXN0XG4gICAgICovXG4gICAgZXhpc3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGpzb24sIGtleSwga2V5Q291bnQ7XG4gICAgICAgIGtleUNvdW50ID0gMDtcbiAgICAgICAganNvbiA9IHRoaXMudG9KU09OKCk7XG4gICAgICAgIGZvciAoa2V5IGluIGpzb24pIHtcbiAgICAgICAgICAgIGtleUNvdW50ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChrZXlDb3VudCAhPT0gMSkgJiYgKGpzb24uaWQgIT0gbnVsbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlY29nbml6ZSBhbmQgcHJvY2VzcyBKU09OIGRhdGEuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlc3AgLSBKU09OIHJlc3BvbnNlLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHJlc3AgLSBNb2RpZmllZCBKU09OIHJlc3BvbnNlLlxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgIHJlc3AgPSB0aGlzLl9hZGFwdE1vbmdvSWQocmVzcCk7XG4gICAgICAgIHJlc3AgPSB0aGlzLl9yZW1vdmVBcnJheVdyYXBwZXIocmVzcCk7XG4gICAgICAgIHJlc3AgPSB0aGlzLl9yZW1vdmVTcGFjZXMocmVzcCwgJ3RlbXBsYXRlX25hbWUnKTtcbiAgICAgICAgcmVzcCA9IHRoaXMuX3Byb2Nlc3NTdGF0aWNIdG1sKHJlc3AsICdib2R5X3RleHQnKTtcbiAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgfSxcblxuICAgIGdldEltYWdlVXJsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVuY29kZWRJbWFnZSA9IHRoaXMuZ2V0KCdlbmNvZGVkX2ltYWdlJyk7XG4gICAgICAgIGlmIChlbmNvZGVkSW1hZ2UgPT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICAgICAgZW5jb2RlZEltYWdlID0gZW5jb2RlZEltYWdlLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sICcnKTtcbiAgICAgICAgaWYgKGVuY29kZWRJbWFnZS5pbmRleE9mKCdiYXNlNjQnKSA+IC0xKSB7IHJldHVybiBcInVybChcIiArIGVuY29kZWRJbWFnZSArIFwiKVwiOyB9XG4gICAgICAgIHJldHVybiBcInVybCgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgZW5jb2RlZEltYWdlICsgXCInKVwiO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogRmlsdGVycyBhIHByb2plY3QgYnkgdHdvIGZpbHRlcmFibGUgY29sbGVjdGlvbnMgdGhhdCBpdCBiZWxvbmdzIHRvLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9qZWN0U2VjdGlvbnNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvamVjdFRlbXBsYXRlc1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBmaWx0ZXIgLSBXaGV0aGVyIGJvdGggcHJvamVjdCBzZWN0aW9ucyBhbmQgdGVtcGxhdGVzIGFyZSBpbiBmaWx0ZXIgdmFyaWFibGUuXG4gICAgICovXG4gICAgY29tcG9zaXRlRmlsdGVyOiBmdW5jdGlvbihwcm9qZWN0U2VjdGlvbnMsIHByb2plY3RUZW1wbGF0ZXMpIHtcbiAgICAgICAgdmFyIGZpbHRlciwgc2VjdGlvbnNGaWx0ZXIsIHRlbXBsYXRlc0ZpbHRlcjtcbiAgICAgICAgc2VjdGlvbnNGaWx0ZXIgPSB0aGlzLmZpbHRlcihwcm9qZWN0U2VjdGlvbnMsICdwcm9qZWN0X3NlY3Rpb24nKTtcbiAgICAgICAgdGVtcGxhdGVzRmlsdGVyID0gdGhpcy5maWx0ZXIocHJvamVjdFRlbXBsYXRlcywgJ3Byb2plY3RfdGVtcGxhdGUnKTtcbiAgICAgICAgZmlsdGVyID0gc2VjdGlvbnNGaWx0ZXIgJiYgdGVtcGxhdGVzRmlsdGVyO1xuICAgICAgICByZXR1cm4gZmlsdGVyO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEN1c3RvbSBxdWVyeSBtZXRob2QgdG8gZmluZCByZWxhdGVkIHByb2plY3RzIGJhc2VkIG9uIHRhZ3MuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3QgLSBQcm9qZWN0IElkLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIFJlbGF0ZWQgc3RhdHVzLlxuICAgICAqL1xuICAgIGlzUmVsYXRlZFRvOiBmdW5jdGlvbihwcm9qZWN0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHByaiwgdGFnczAsIHRhZ3MxLCBpLCBtYXg7XG4gICAgICAgIGlmICh0aGlzID09PSBwcm9qZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGFnczAgPSB0aGlzLmdldCgndGFncycpO1xuICAgICAgICB0YWdzMSA9IHByb2plY3QuZ2V0KCd0YWdzJyk7XG4gICAgICAgIGlmICh0YWdzMCA9PT0gJycgfHwgdGFnczEgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGFnczAgPSB0YWdzMC5zcGxpdCgnLCcpO1xuICAgICAgICB0YWdzMSA9IHRhZ3MxLnNwbGl0KCcsJyk7XG4gICAgICAgIGZvciAoaSA9IDAsIG1heCA9IHRhZ3MwLmxlbmd0aDsgaSA8IG1heDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAodGFnczEuaW5kZXhPZih0YWdzMFtpXSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmlsdGVyIGNvbGxlY3Rpb24gYnkgaXRzIGZvcmVpZ24ga2V5LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZvcmVpZ25LZXlcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGZvcmVpZ25LZXkpIHtcbiAgICAgICAgaWYgKChjb2xsZWN0aW9uICE9IG51bGwpICYmIChjb2xsZWN0aW9uLnRlc3QgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLnRlc3QodGhpcywgZm9yZWlnbktleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKiBHZXQgaW1nYWdlIGF0dHJpYnV0aW9uIGh0bWwuICovXG4gICAgZ2V0SW1hZ2VBdHRyaWJ1dGlvbkh0bWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYXJrZG93bkh0bWwoJ2ltYWdlX2NyZWRpdCcpO1xuICAgIH0sXG5cbiAgICAvKiogSWYgdGhlcmUgaXMgYSBkYXRhIGZpZWxkLCBjb252ZXJ0IHRvIGFwcHJvcHJpYXRlIGNvbGxlY3Rpb25zLiAqL1xuICAgIGJ1aWxkRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBkYXRhID0gdGhpcy5nZXQoJ2RhdGEnKTtcbiAgICAgICAgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgZGF0YS52YXJpYWJsZXMgPSBuZXcgdmFyaWFibGUuQ29sbGVjdGlvbihkYXRhLnZhcmlhYmxlcywge1xuICAgICAgICAgICAgICAgIHBhcnNlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRhdGEuaXRlbXMgPSBuZXcgaXRlbS5Db2xsZWN0aW9uKGRhdGEuaXRlbXMsIHtcbiAgICAgICAgICAgICAgICBwYXJzZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkRmlsdGVyVHJlZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGJ1aWxkRmlsdGVyVHJlZTogZnVuY3Rpb24oaXRlbXMsIHZhcmlhYmxlcywgZmlsdGVycykge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGZpbHRlclRyZWUsIGZpbHRlclZhcmlhYmxlcyxcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdldCgnZGF0YScpLFxuICAgICAgICAgICAgaXRlbXMgPSBkYXRhLml0ZW1zLFxuICAgICAgICAgICAgdmFyaWFibGVzID0gZGF0YS52YXJpYWJsZXMsXG4gICAgICAgICAgICBmaWx0ZXJzID0gZGF0YS5maWx0ZXJzO1xuXG4gICAgICAgIGlmIChmaWx0ZXJzID09IG51bGwpIHtcbiAgICAgICAgICAgIGZpbHRlcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmdiA9IHZhcmlhYmxlcy5nZXRGaWx0ZXJWYXJpYWJsZXMoKTtcblxuICAgICAgICBmaWx0ZXJWYXJpYWJsZXMgPSBmdi5tYXAoZnVuY3Rpb24odmFyaWFibGUsIGluZGV4KSB7XG5cbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIsIG5kLCBvLCB2YXJpYWJsZTtcblxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlLmdldCgnZm9ybWF0JykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlciA9IGZvcm1hdHRlcnNbdmFyaWFibGUuZ2V0KCdmb3JtYXQnKV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG8gPSB7XG4gICAgICAgICAgICAgICAgdmFyaWFibGU6IHZhcmlhYmxlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlX2lkOiB2YXJpYWJsZS5nZXQoJ2lkJyksXG4gICAgICAgICAgICAgICAgZGlzcGxheV90aXRsZTogdmFyaWFibGUuZ2V0KCdkaXNwbGF5X3RpdGxlJyksXG4gICAgICAgICAgICAgICAgc2hvcnRfZGVzY3JpcHRpb246IHZhcmlhYmxlLmdldCgnc2hvcnRfZGVzY3JpcHRpb24nKSxcbiAgICAgICAgICAgICAgICBsb25nX2Rlc2NyaXB0aW9uOiB2YXJpYWJsZS5nZXRNYXJrZG93bkh0bWwoJ2xvbmdfZGVzY3JpcHRpb24nKSxcbiAgICAgICAgICAgICAgICB0eXBlOiB2YXJpYWJsZS5nZXQoJ2ZpbHRlcl90eXBlJyksXG4gICAgICAgICAgICAgICAgX2lzQWN0aXZlOiAoaW5kZXggPT09IDAgPyB0cnVlIDogZmFsc2UpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBuZCA9IHZhcmlhYmxlLmdldCgnbnVtZXJpY2FsX2ZpbHRlcl9kaXZpZGVycycpO1xuXG4gICAgICAgICAgICBpZiAobmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG8udmFsdWVzID0gdmFyaWFibGUuZ2V0TnVtZXJpY2FsRmlsdGVyKGZvcm1hdHRlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG8udmFsdWVzID0gXy5tYXAoaXRlbXMuZ2V0VmFsdWVMaXN0KHZhcmlhYmxlLmdldCgnaWQnKSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gZm9ybWF0dGVyKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLm1hcChvLnZhbHVlcywgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbztcblxuICAgICAgICB9KTtcblxuICAgICAgICBmaWx0ZXJUcmVlID0ge1xuICAgICAgICAgICAgdmFyaWFibGVzOiBmaWx0ZXJWYXJpYWJsZXNcbiAgICAgICAgfTtcblxuICAgICAgICBkYXRhLmZpbHRlciA9IG5ldyBmaWx0ZXIuRmlsdGVyVHJlZShmaWx0ZXJUcmVlKTtcbiAgICAgICAgZGF0YS5maWx0ZXIuc3RhdGUgPSB7fTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlcyBtb2RlbCBvbiB0aGUgY2xpZW50LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBBcHAgLSBNYXJpb25ldHRlIGFwcGxpY2F0aW9uIGluc3RhbmNlLiBcbiAgICAgKi9cbiAgICBwcmVwT25DbGllbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmJ1aWxkRGF0YSgpO1xuICAgICAgICB0aGlzLnNldEh0bWxUb2MoJ2JvZHlfdGV4dCcpO1xuICAgIH1cblxufSk7XG5cbmV4cG9ydHMuQ29sbGVjdGlvbiA9IGJhc2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG4gICAgZGJDb2xsZWN0aW9uOiAncHJvamVjdHMnLFxuXG4gICAgYXBpVXJsOiAnL2FwaS92MS9wcm9qZWN0cycsXG5cbiAgICBtb2RlbDogZXhwb3J0cy5Nb2RlbCxcblxuICAgIC8qKlxuICAgICAqIFVzZWQgdG8gY29tcGFyZSB0d28gbW9kZWxzIHdoZW4gc29ydGluZy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kZWwxXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1vZGVsMlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvbXBhcmF0b3IgLSBBIGNvbXBhcmF0b3Igd2hvc2Ugc2lnbiBkZXRlcm1pbmVzIHRoZSBzb3J0aW5nIG9yZGVyLlxuICAgICAqL1xuICAgIGNvbXBhcmF0b3I6IGZ1bmN0aW9uKG1vZGVsMSwgbW9kZWwyKSB7XG4gICAgICAgIHZhciBpMSwgaTI7XG4gICAgICAgIGkxID0gbW9kZWwxLmdldCgnaXNfc2VjdGlvbl9vdmVydmlldycpID09PSAnWWVzJyA/IDEwIDogMDtcbiAgICAgICAgaTIgPSBtb2RlbDIuZ2V0KCdpc19zZWN0aW9uX292ZXJ2aWV3JykgPT09ICdZZXMnID8gMTAgOiAwO1xuICAgICAgICBpZiAobW9kZWwxLmdldCgndGl0bGUnKSA8IG1vZGVsMi5nZXQoJ3RpdGxlJykpIHtcbiAgICAgICAgICAgIGkxICs9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpMiArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpMiAtIGkxO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogRmlsdGVyIGFsbCBjaGlsZHJlbiBieSBwcm9qZWN0IHNlY3Rpb25zIGFuZCB0ZW1wbGF0ZXMuXG4gICAgICogQHBhcmFtIHtjb2xsZWN0aW9ufSBwcm9qZWN0U2VjdGlvbnNcbiAgICAgKiBAcGFyYW0ge2NvbGxlY3Rpb259IHByb2plY3RUZW1wbGF0ZXNcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGlzXG4gICAgICovXG4gICAgZmlsdGVyOiBmdW5jdGlvbihwcm9qZWN0U2VjdGlvbnMsIHByb2plY3RUZW1wbGF0ZXMpIHtcbiAgICAgICAgdmFyIGksIGxlbiwgbW9kZWwsIHJlZjtcbiAgICAgICAgaWYgKChwcm9qZWN0U2VjdGlvbnMubW9kZWxzID09IG51bGwpIHx8IChwcm9qZWN0U2VjdGlvbnMubW9kZWxzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHByb2plY3RUZW1wbGF0ZXMubW9kZWxzID09IG51bGwpIHx8IChwcm9qZWN0VGVtcGxhdGVzLm1vZGVscy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlZiA9IHRoaXMubW9kZWxzO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG1vZGVsID0gcmVmW2ldO1xuICAgICAgICAgICAgbW9kZWwuY29tcG9zaXRlRmlsdGVyKHByb2plY3RTZWN0aW9ucywgcHJvamVjdFRlbXBsYXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlY29nbml6ZSBhbmQgcHJvY2VzcyBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlc3AgLSBTZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICogQHJldHVybnMge29iamVjdH0gcmVzcCAtIE1vZGlmaWVkIHJlc3BvbnNlLlxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgIHZhciBpLCBtYXgsXG4gICAgICAgICAgICBpdGVtO1xuICAgICAgICBpZiAoZXhwb3J0cy5Nb2RlbC5wcm90b3R5cGUucGFyc2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMCwgbWF4ID0gcmVzcC5sZW5ndGg7IGkgPCBtYXg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaXRlbSA9IHJlc3BbaV07XG4gICAgICAgICAgICByZXNwW2ldID0gZXhwb3J0cy5Nb2RlbC5wcm90b3R5cGUucGFyc2UoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgfVxuXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblx0QmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxuXHRiYXNlRmlsdGVyID0gcmVxdWlyZSgnLi9iYXNlX2ZpbHRlcicpLFxuXHRzZWVkID0gcmVxdWlyZSgnLi8uLi8uLi9kYi9zZWVkcy9wcm9qZWN0X3NlY3Rpb25zLmpzb24nKTtcblxuZXhwb3J0cy5Nb2RlbCA9IGJhc2VGaWx0ZXIuTW9kZWwuZXh0ZW5kKHtcblx0dXJsUm9vdDogJy9hcGkvdjEvcHJvamVjdF9zZWN0aW9ucydcbn0pO1xuXG5leHBvcnRzLkNvbGxlY3Rpb24gPSBiYXNlRmlsdGVyLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuXHRkYkNvbGxlY3Rpb246ICdwcm9qZWN0X3NlY3Rpb25zJyxcblxuXHRkYlNlZWQ6IHNlZWQsXG5cblx0bW9kZWw6IGV4cG9ydHMuTW9kZWwsXG5cblx0dXJsOiAnL2FwaS92MS9wcm9qZWN0X3NlY3Rpb25zJyxcblxuXHRoYXNTaW5nbGVBY3RpdmVDaGlsZDogZmFsc2UsXG5cblx0aW5pdGlhbGl6ZUFjdGl2ZVN0YXRlc09uUmVzZXQ6IHRydWUsXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZXNldChzZWVkKTtcblx0fVxuXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblx0QmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpLFxuXHRiYXNlRmlsdGVyID0gcmVxdWlyZSgnLi9iYXNlX2ZpbHRlci5qcycpLFxuXHRzZWVkID0gcmVxdWlyZSgnLi8uLi8uLi9kYi9zZWVkcy9wcm9qZWN0X3RlbXBsYXRlcy5qc29uJyk7XG5cbmV4cG9ydHMuTW9kZWwgPSBiYXNlRmlsdGVyLk1vZGVsLmV4dGVuZCh7XG5cdHVybFJvb3Q6ICcvYXBpL3YxL3Byb2plY3RfdGVtcGxhdGVzJ1xufSk7XG5cbmV4cG9ydHMuQ29sbGVjdGlvbiA9IGJhc2VGaWx0ZXIuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG5cdGRiQ29sbGVjdGlvbjogJ3Byb2plY3RfdGVtcGxhdGVzJyxcblxuXHRkYlNlZWQ6IHNlZWQsXG5cblx0bW9kZWw6IGV4cG9ydHMuTW9kZWwsXG5cblx0dXJsOiAnL2FwaS92MS9wcm9qZWN0X3RlbXBsYXRlcycsXG5cblx0aGFzU2luZ2xlQWN0aXZlQ2hpbGQ6IHRydWUsXG5cblx0aW5pdGlhbGl6ZUFjdGl2ZVN0YXRlc09uUmVzZXQ6IHRydWUsXG5cblx0Y29tcGFyYXRvcjogJ29yZGVyJyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlc2V0KHNlZWQpO1xuXHR9XG5cbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbmV4cG9ydHMuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe30pO1xuXG5leHBvcnRzLkNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0Xy5leHRlbmQodGhpcywgQmFja2JvbmUuRXZlbnRzKTtcblx0XHR0aGlzLnR5cGUgPSAnRmVhdHVyZUNvbGxlY3Rpb24nO1xuXHRcdHJldHVybiB0aGlzLmZlYXR1cmVzID0gW107XG5cdH0sXG5cblx0bW9kZWw6IGV4cG9ydHMuTW9kZWwsXG5cblx0b25SZWFkeTogZnVuY3Rpb24obmV4dCkge1xuXHRcdGlmICh0aGlzLmZlYXR1cmVzLmxlbmd0aCA+IDApIHtcblx0XHRcdG5leHQoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMub24oJ3N5bmMnLCBuZXh0KTtcblx0fVxuXHRcbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyksXG5cdGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuanMnKSxcbiAgICBmb3JtYXR0ZXJzID0gcmVxdWlyZSgnLi8uLi91dGlsaXRpZXMvZm9ybWF0dGVycy5qcycpLFxuXHQkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cblxuZXhwb3J0cy5Nb2RlbCA9IGJhc2UuTW9kZWwuZXh0ZW5kKHtcblxuICAgIC8qXG4gICAgICogUmV0dXJuIHRoZSBmaWVsZCBvZiBhbiBpdGVtIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHZhcmlhYmxlLCBhcHBseWluZyBcbiAgICAgKiBmb3JtYXR0aW5nIGFzIG5lZWRlZC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGZvcm1hdHRlZEZpZWxkXG4gICAgICovXG4gICAgZ2V0Rm9ybWF0dGVkRmllbGQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJhd0ZpZWxkID0gaXRlbS5nZXQodGhpcy5nZXQoJ2lkJykpLFxuICAgICAgICAgICAgZm9ybWF0ID0gdGhpcy5nZXQoJ2Zvcm1hdCcpO1xuICAgICAgICBpZiAoZm9ybWF0ID09IG51bGwgfHwgZm9ybWF0dGVyc1tmb3JtYXRdID09IG51bGwpIHsgcmV0dXJuIHJhd0ZpZWxkOyB9XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZXJzW2Zvcm1hdF0ocmF3RmllbGQpO1xuICAgIH0sXG5cblx0LypcbiAgICAgKiBTZXQgYSBudW1lcmljYWwgZmlsdGVyLCBzcGxpdHRpbmcgdXAgfDEwfDIwfDMwfCB0eXBlIG51bWVyaWNhbCBkaXZpZGVyIHN0cmluZ3MgaW50b1xuICAgICAqICAgcHJlc2VudGFibGUgYW5kIHRlc3RhYmxlIG9iamVjdHMuIFNlZSBzcGVjcyBmb3IgZXhhbXBsZS5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmb3JtYXR0ZXIgLSBPcHRpb25hbCBmb3JtYXR0ZXIgZnVuY3Rpb24gZm9yIHZhbHVlcy5cbiAgICAgKi9cbiAgICBnZXROdW1lcmljYWxGaWx0ZXI6IGZ1bmN0aW9uKGZvcm1hdHRlcikge1xuXG4gICAgICAgIHZhciBpLCBsZW4sIG51bWVyaWNhbEZpbHRlciwgdmFsdWVzLFxuICAgICAgICAgICAgbnVtZXJpY2FsRGl2aWRlcnMgPSB0aGlzLmdldCgnbnVtZXJpY2FsX2ZpbHRlcl9kaXZpZGVycycpO1xuXG4gICAgICAgIGlmIChmb3JtYXR0ZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZm9ybWF0dGVyID0gZm9ybWF0dGVyc1snbnVtYmVyJ107XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZXMgPSBfLm1hcChudW1lcmljYWxEaXZpZGVycy5zcGxpdCgnfCcpLCBmdW5jdGlvbihtZW1iZXIsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAobWVtYmVyID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTAwMDAwMDAwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICsxMDAwMDAwMDAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1lbWJlciwgMTApO1xuICAgICAgICB9KTtcblxuICAgICAgICBudW1lcmljYWxGaWx0ZXIgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB2YWx1ZXMubGVuZ3RoOyBpIDwgKGxlbiAtIDEpOyBpICs9IDEpIHtcbiAgICAgICAgICAgIG51bWVyaWNhbEZpbHRlci5wdXNoKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TnVtZXJpY2FsRmlsdGVyVmFsdWUodmFsdWVzW2ldLCB2YWx1ZXNbaSArIDFdLCBmb3JtYXR0ZXIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bWVyaWNhbEZpbHRlcjtcblxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgc2luZ2xlIG51bWVyaWNhbCBmaWx0ZXIgdmFsdWUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIE1pbmltdW0gdmFsdWUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIE1heGltdW0gdmFsdWUuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm9ybWF0dGVyIC0gRm9ybWF0dGVyIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICovXG4gICAgZ2V0TnVtZXJpY2FsRmlsdGVyVmFsdWU6IGZ1bmN0aW9uKG1pbiwgbWF4LCBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIGZpbHRlclZhbHVlLCBtYXhEaXNwbGF5LCBtaW5EaXNwbGF5O1xuICAgICAgICBmaWx0ZXJWYWx1ZSA9IHtcbiAgICAgICAgICAgIG1pbjogbWluLFxuICAgICAgICAgICAgbWF4OiBtYXhcbiAgICAgICAgfTtcbiAgICAgICAgbWluRGlzcGxheSA9IG1pbjtcbiAgICAgICAgbWF4RGlzcGxheSA9IG1heDtcbiAgICAgICAgbWluRGlzcGxheSA9IGZvcm1hdHRlcihtaW5EaXNwbGF5KTtcbiAgICAgICAgbWF4RGlzcGxheSA9IGZvcm1hdHRlcihtYXhEaXNwbGF5KTtcbiAgICAgICAgaWYgKG1pbiA9PT0gLTEwMDAwMDAwMDApIHtcbiAgICAgICAgICAgIGZpbHRlclZhbHVlLnZhbHVlID0gXCJMZXNzIHRoYW4gXCIgKyBtYXhEaXNwbGF5O1xuICAgICAgICB9IGVsc2UgaWYgKG1heCA9PT0gKzEwMDAwMDAwMDApIHtcbiAgICAgICAgICAgIGZpbHRlclZhbHVlLnZhbHVlID0gXCJHcmVhdGVyIHRoYW4gXCIgKyBtaW5EaXNwbGF5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyVmFsdWUudmFsdWUgPSBcIkJldHdlZW4gXCIgKyBtaW5EaXNwbGF5ICsgXCIgYW5kIFwiICsgbWF4RGlzcGxheTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyVmFsdWU7XG4gICAgfVxuXG59KTtcblxuZXhwb3J0cy5Db2xsZWN0aW9uID0gYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cblx0bW9kZWw6IGV4cG9ydHMuTW9kZWwsXG5cbiAgICBnZXRGaWx0ZXJWYXJpYWJsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbW9kZWxzO1xuICAgICAgICBtb2RlbHMgPSB0aGlzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gKGl0ZW0uZ2V0KCdmaWx0ZXJfbWVudV9vcmRlcicpICE9IG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgbW9kZWxzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIChhLmdldCgnZmlsdGVyX21lbnVfb3JkZXInKSAtIGIuZ2V0KCdmaWx0ZXJfbWVudV9vcmRlcicpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtb2RlbHM7XG4gICAgfVxuXG59KTsiLCJ2YXIgbnVtZXJhbCA9IHJlcXVpcmUoJ251bWVyYWwnKSxcblx0bWFya2VkID0gcmVxdWlyZSgnbWFya2VkJyksXG5cdCQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIGZvcm1hdHRlcnMgPSB7XG5cblx0Y3VycmVuY3k6IGZ1bmN0aW9uKHYpIHtcblx0ICAgIHZhciBmb3JtYXR0ZXI7XG5cdCAgICBpZiAodHlwZW9mIG51bWVyYWwgPT09IFwidW5kZWZpbmVkXCIgfHwgbnVtZXJhbCA9PT0gbnVsbCkge1xuXHQgICAgICAgIHJldHVybiB2O1xuXHQgICAgfVxuXHQgICAgZm9ybWF0dGVyID0gdiA+IDk5OSA/ICcoJDBhKScgOiAnKCQwKSc7XG5cdCAgICByZXR1cm4gbnVtZXJhbCh2KS5mb3JtYXQoZm9ybWF0dGVyKTtcblx0fSxcblxuXHRudW1iZXI6IGZ1bmN0aW9uKHYpIHtcblx0ICAgIHZhciBmb3JtYXR0ZXI7XG5cdCAgICBpZiAodHlwZW9mIG51bWVyYWwgPT09IFwidW5kZWZpbmVkXCIgfHwgbnVtZXJhbCA9PT0gbnVsbCkge1xuXHQgICAgICAgIHJldHVybiB2O1xuXHQgICAgfVxuXHQgICAgZm9ybWF0dGVyID0gdiA+IDk5OTk5ID8gJygwYSknIDogJygwKSc7XG5cdCAgICByZXR1cm4gbnVtZXJhbCh2KS5mb3JtYXQoZm9ybWF0dGVyKTtcblx0fSxcblxuXHRwZXJjZW50OiBmdW5jdGlvbih2KSB7XG5cdCAgICByZXR1cm4gdiArICclJztcblx0fSxcblxuXHRodG1sOiBmdW5jdGlvbihodG1sKSB7XG5cdCAgICB2YXIgJGh0bWwsIG5ld0h0bWw7XG5cdCAgICAkaHRtbCA9ICQoaHRtbCk7XG5cdCAgICAkaHRtbC5maW5kKCdhJykuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpO1xuXHQgICAgbmV3SHRtbCA9ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKCRodG1sLmNsb25lKCkpLmh0bWwoKTtcblx0ICAgIHJldHVybiBuZXdIdG1sO1xuXHR9LFxuXG5cdGF0bGFzQXJyYXk6IGZ1bmN0aW9uKGF0bGFzQXJyYXkpIHtcblx0ICAgIHZhciBhcnI7XG5cdCAgICBhcnIgPSBhdGxhc0FycmF5LnNwbGl0KFwifFwiKTtcblx0ICAgIGFyciA9IF8ubWFwKGFyciwgZnVuY3Rpb24oaXRlbSkge1xuXHQgICAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIGFycjtcblx0fSxcblxuXHRyZW1vdmVMaW5lQnJlYWtzOiBmdW5jdGlvbihzdHJpbmcpIHtcblx0ICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xuXHQgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCAnJyk7XG5cdH0sXG5cblx0cmVtb3ZlU3BhY2VzOiBmdW5jdGlvbihzdHJpbmcpIHtcblx0ICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xuXHQgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXHMrL2csICcnKTtcblx0fSxcblxuXHRoeXBoZW5hdGU6IGZ1bmN0aW9uKHN0cmluZykge1xuXHQgICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG5cdCAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoJ29tbXVuaWNhdGlvbicsICdvbW11bmktY2F0aW9uJyk7XG5cdH0sXG5cblx0bWFya2Rvd246IGZ1bmN0aW9uKHN0cmluZykge1xuXHQgICAgdmFyIGh0bWw7XG5cdCAgICBpZiAoc3RyaW5nICE9IG51bGwpIHtcblx0ICAgICAgICBodG1sID0gbWFya2VkKHN0cmluZyk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaHRtbDtcblx0fSxcblxuXHQvLyBkZXByZWNhdGVkXG5cdG1kVG9IdG1sOiBmdW5jdGlvbihzdHJpbmcpIHtcblx0ICAgIHJldHVybiB0aGlzLm1hcmtkb3duKHN0cmluZyk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXR0ZXJzOyIsIm1vZHVsZS5leHBvcnRzPVtcblx0eyBcImlkXCI6IFwiMFwiLCBcIm5hbWVcIjogXCJFYXJseSBFZHVjYXRpb25cIiB9LFxuXHR7IFwiaWRcIjogXCIxXCIsIFwibmFtZVwiOiBcIlByZUstMTIgRWR1Y2F0aW9uXCIgfSxcblx0eyBcImlkXCI6IFwiMlwiLCBcIm5hbWVcIjogXCJIaWdoZXIgRWR1Y2F0aW9uXCIgfSxcblx0eyBcImlkXCI6IFwiM1wiLCBcIm5hbWVcIjogXCJMZWFybmluZyBUZWNobm9sb2dpZXNcIiB9LFxuXHR7IFwiaWRcIjogXCI0XCIsIFwibmFtZVwiOiBcIkR1YWwgTGFuZ3VhZ2UgTGVhcm5lcnNcIiB9LFxuXHR7IFwiaWRcIjogXCI1XCIsIFwibmFtZVwiOiBcIldvcmtmb3JjZSBEZXZlbG9wbWVudFwiIH0sXG5cdHsgXCJpZFwiOiBcIjZcIiwgXCJuYW1lXCI6IFwiRmVkZXJhbCBFZHVjYXRpb24gQnVkZ2V0XCIgfVxuXSIsIm1vZHVsZS5leHBvcnRzPVtcblx0eyBcImlkXCI6IFwiMFwiLCBcIm9yZGVyXCI6IDAsIFwiZGlzcGxheV9uYW1lXCI6IFwiQW5hbHlzaXMgVG9vbHNcIiwgXCJuYW1lXCI6IFwiVGlsZW1hcFwiIH0sXG5cdHsgXCJpZFwiOiBcIjFcIiwgXCJvcmRlclwiOiAzLCBcImRpc3BsYXlfbmFtZVwiOiBcIkV4cGxhaW5lcnNcIiwgXCJuYW1lXCI6IFwiRXhwbGFpbmVyXCIgfSxcblx0eyBcImlkXCI6IFwiMlwiLCBcIm9yZGVyXCI6IDEsIFwiZGlzcGxheV9uYW1lXCI6IFwiUG9saWN5IEJyaWVmc1wiLCBcIm5hbWVcIjogXCJQb2xpY3kgQnJpZWZcIiB9LFxuXHR7IFwiaWRcIjogXCIzXCIsIFwib3JkZXJcIjogMiwgXCJkaXNwbGF5X25hbWVcIjogXCJQb2xsaW5nXCIsIFwibmFtZVwiOiBcIlBvbGxpbmdcIiB9XG5dIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJpZFwiOiAxLFxuICAgIFwibmFtZVwiOiBcIkFsYWJhbWFcIixcbiAgICBcImNvZGVcIjogXCJBTFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDIsXG4gICAgXCJuYW1lXCI6IFwiQWxhc2thXCIsXG4gICAgXCJjb2RlXCI6IFwiQUtcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA2MCxcbiAgICBcIm5hbWVcIjogXCJBbWVyaWNhbiBTYW1vYVwiLFxuICAgIFwiY29kZVwiOiBcIkFTXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNCxcbiAgICBcIm5hbWVcIjogXCJBcml6b25hXCIsXG4gICAgXCJjb2RlXCI6IFwiQVpcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA1LFxuICAgIFwibmFtZVwiOiBcIkFya2Fuc2FzXCIsXG4gICAgXCJjb2RlXCI6IFwiQVJcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA2LFxuICAgIFwibmFtZVwiOiBcIkNhbGlmb3JuaWFcIixcbiAgICBcImNvZGVcIjogXCJDQVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDgsXG4gICAgXCJuYW1lXCI6IFwiQ29sb3JhZG9cIixcbiAgICBcImNvZGVcIjogXCJDT1wiXG4gIH0sIHtcbiAgICBcImlkXCI6IDksXG4gICAgXCJuYW1lXCI6IFwiQ29ubmVjdGljdXRcIixcbiAgICBcImNvZGVcIjogXCJDVFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDEwLFxuICAgIFwibmFtZVwiOiBcIkRlbGF3YXJlXCIsXG4gICAgXCJjb2RlXCI6IFwiREVcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAxMSxcbiAgICBcIm5hbWVcIjogXCJEaXN0cmljdCBvZiBDb2x1bWJpYVwiLFxuICAgIFwiY29kZVwiOiBcIkRDXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMTIsXG4gICAgXCJuYW1lXCI6IFwiRmxvcmlkYVwiLFxuICAgIFwiY29kZVwiOiBcIkZMXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMTMsXG4gICAgXCJuYW1lXCI6IFwiR2VvcmdpYVwiLFxuICAgIFwiY29kZVwiOiBcIkdBXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNjYsXG4gICAgXCJuYW1lXCI6IFwiR3VhbVwiLFxuICAgIFwiY29kZVwiOiBcIkdVXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMTUsXG4gICAgXCJuYW1lXCI6IFwiSGF3YWlpXCIsXG4gICAgXCJjb2RlXCI6IFwiSElcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAxNixcbiAgICBcIm5hbWVcIjogXCJJZGFob1wiLFxuICAgIFwiY29kZVwiOiBcIklEXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMTcsXG4gICAgXCJuYW1lXCI6IFwiSWxsaW5vaXNcIixcbiAgICBcImNvZGVcIjogXCJJTFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDE4LFxuICAgIFwibmFtZVwiOiBcIkluZGlhbmFcIixcbiAgICBcImNvZGVcIjogXCJJTlwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDE5LFxuICAgIFwibmFtZVwiOiBcIklvd2FcIixcbiAgICBcImNvZGVcIjogXCJJQVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDIwLFxuICAgIFwibmFtZVwiOiBcIkthbnNhc1wiLFxuICAgIFwiY29kZVwiOiBcIktTXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMjEsXG4gICAgXCJuYW1lXCI6IFwiS2VudHVja3lcIixcbiAgICBcImNvZGVcIjogXCJLWVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDIyLFxuICAgIFwibmFtZVwiOiBcIkxvdWlzaWFuYVwiLFxuICAgIFwiY29kZVwiOiBcIkxBXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMjMsXG4gICAgXCJuYW1lXCI6IFwiTWFpbmVcIixcbiAgICBcImNvZGVcIjogXCJNRVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDI0LFxuICAgIFwibmFtZVwiOiBcIk1hcnlsYW5kXCIsXG4gICAgXCJjb2RlXCI6IFwiTURcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAyNSxcbiAgICBcIm5hbWVcIjogXCJNYXNzYWNodXNldHRzXCIsXG4gICAgXCJjb2RlXCI6IFwiTUFcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAyNixcbiAgICBcIm5hbWVcIjogXCJNaWNoaWdhblwiLFxuICAgIFwiY29kZVwiOiBcIk1JXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMjcsXG4gICAgXCJuYW1lXCI6IFwiTWlubmVzb3RhXCIsXG4gICAgXCJjb2RlXCI6IFwiTU5cIlxuICB9LCB7XG4gICAgXCJpZFwiOiAyOCxcbiAgICBcIm5hbWVcIjogXCJNaXNzaXNzaXBwaVwiLFxuICAgIFwiY29kZVwiOiBcIk1TXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMjksXG4gICAgXCJuYW1lXCI6IFwiTWlzc291cmlcIixcbiAgICBcImNvZGVcIjogXCJNT1wiXG4gIH0sIHtcbiAgICBcImlkXCI6IDMwLFxuICAgIFwibmFtZVwiOiBcIk1vbnRhbmFcIixcbiAgICBcImNvZGVcIjogXCJNVFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDMxLFxuICAgIFwibmFtZVwiOiBcIk5lYnJhc2thXCIsXG4gICAgXCJjb2RlXCI6IFwiTkVcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAzMixcbiAgICBcIm5hbWVcIjogXCJOZXZhZGFcIixcbiAgICBcImNvZGVcIjogXCJOVlwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDMzLFxuICAgIFwibmFtZVwiOiBcIk5ldyBIYW1wc2hpcmVcIixcbiAgICBcImNvZGVcIjogXCJOSFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDM0LFxuICAgIFwibmFtZVwiOiBcIk5ldyBKZXJzZXlcIixcbiAgICBcImNvZGVcIjogXCJOSlwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDM1LFxuICAgIFwibmFtZVwiOiBcIk5ldyBNZXhpY29cIixcbiAgICBcImNvZGVcIjogXCJOTVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDM2LFxuICAgIFwibmFtZVwiOiBcIk5ldyBZb3JrXCIsXG4gICAgXCJjb2RlXCI6IFwiTllcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAzNyxcbiAgICBcIm5hbWVcIjogXCJOb3J0aCBDYXJvbGluYVwiLFxuICAgIFwiY29kZVwiOiBcIk5DXCJcbiAgfSwge1xuICAgIFwiaWRcIjogMzgsXG4gICAgXCJuYW1lXCI6IFwiTm9ydGggRGFrb3RhXCIsXG4gICAgXCJjb2RlXCI6IFwiTkRcIlxuICB9LCB7XG4gICAgXCJpZFwiOiAzOSxcbiAgICBcIm5hbWVcIjogXCJPaGlvXCIsXG4gICAgXCJjb2RlXCI6IFwiT0hcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA0MCxcbiAgICBcIm5hbWVcIjogXCJPa2xhaG9tYVwiLFxuICAgIFwiY29kZVwiOiBcIk9LXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNDEsXG4gICAgXCJuYW1lXCI6IFwiT3JlZ29uXCIsXG4gICAgXCJjb2RlXCI6IFwiT1JcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA0MixcbiAgICBcIm5hbWVcIjogXCJQZW5uc3lsdmFuaWFcIixcbiAgICBcImNvZGVcIjogXCJQQVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDcyLFxuICAgIFwibmFtZVwiOiBcIlB1ZXJ0byBSaWNvXCIsXG4gICAgXCJjb2RlXCI6IFwiUFJcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA0NCxcbiAgICBcIm5hbWVcIjogXCJSaG9kZSBJc2xhbmRcIixcbiAgICBcImNvZGVcIjogXCJSSVwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDQ1LFxuICAgIFwibmFtZVwiOiBcIlNvdXRoIENhcm9saW5hXCIsXG4gICAgXCJjb2RlXCI6IFwiU0NcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA0NixcbiAgICBcIm5hbWVcIjogXCJTb3V0aCBEYWtvdGFcIixcbiAgICBcImNvZGVcIjogXCJTRFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDQ3LFxuICAgIFwibmFtZVwiOiBcIlRlbm5lc3NlZVwiLFxuICAgIFwiY29kZVwiOiBcIlROXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNDgsXG4gICAgXCJuYW1lXCI6IFwiVGV4YXNcIixcbiAgICBcImNvZGVcIjogXCJUWFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDQ5LFxuICAgIFwibmFtZVwiOiBcIlV0YWhcIixcbiAgICBcImNvZGVcIjogXCJVVFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDUwLFxuICAgIFwibmFtZVwiOiBcIlZlcm1vbnRcIixcbiAgICBcImNvZGVcIjogXCJWVFwiXG4gIH0sIHtcbiAgICBcImlkXCI6IDUxLFxuICAgIFwibmFtZVwiOiBcIlZpcmdpbmlhXCIsXG4gICAgXCJjb2RlXCI6IFwiVkFcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA3OCxcbiAgICBcIm5hbWVcIjogXCJWaXJnaW4gSXNsYW5kcyBvZiB0aGUgVS5TLlwiLFxuICAgIFwiY29kZVwiOiBcIlZJXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNTMsXG4gICAgXCJuYW1lXCI6IFwiV2FzaGluZ3RvblwiLFxuICAgIFwiY29kZVwiOiBcIldBXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNTQsXG4gICAgXCJuYW1lXCI6IFwiV2VzdCBWaXJnaW5pYVwiLFxuICAgIFwiY29kZVwiOiBcIldWXCJcbiAgfSwge1xuICAgIFwiaWRcIjogNTUsXG4gICAgXCJuYW1lXCI6IFwiV2lzY29uc2luXCIsXG4gICAgXCJjb2RlXCI6IFwiV0lcIlxuICB9LCB7XG4gICAgXCJpZFwiOiA1NixcbiAgICBcIm5hbWVcIjogXCJXeW9taW5nXCIsXG4gICAgXCJjb2RlXCI6IFwiV1lcIlxuICB9XG5dIiwiLyoqXG4gKiBtYXJrZWQgLSBhIG1hcmtkb3duIHBhcnNlclxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqL1xuXG47KGZ1bmN0aW9uKCkge1xuXG4vKipcbiAqIEJsb2NrLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgYmxvY2sgPSB7XG4gIG5ld2xpbmU6IC9eXFxuKy8sXG4gIGNvZGU6IC9eKCB7NH1bXlxcbl0rXFxuKikrLyxcbiAgZmVuY2VzOiBub29wLFxuICBocjogL14oICpbLSpfXSl7Myx9ICooPzpcXG4rfCQpLyxcbiAgaGVhZGluZzogL14gKigjezEsNn0pICooW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gIG5wdGFibGU6IG5vb3AsXG4gIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiAqKD18LSl7Mix9ICooPzpcXG4rfCQpLyxcbiAgYmxvY2txdW90ZTogL14oICo+W15cXG5dKyhcXG4oPyFkZWYpW15cXG5dKykqXFxuKikrLyxcbiAgbGlzdDogL14oICopKGJ1bGwpIFtcXHNcXFNdKz8oPzpocnxkZWZ8XFxuezIsfSg/ISApKD8hXFwxYnVsbCApXFxuKnxcXHMqJCkvLFxuICBodG1sOiAvXiAqKD86Y29tbWVudCAqKD86XFxufFxccyokKXxjbG9zZWQgKig/OlxcbnsyLH18XFxzKiQpfGNsb3NpbmcgKig/OlxcbnsyLH18XFxzKiQpKS8sXG4gIGRlZjogL14gKlxcWyhbXlxcXV0rKVxcXTogKjw/KFteXFxzPl0rKT4/KD86ICtbXCIoXShbXlxcbl0rKVtcIildKT8gKig/Olxcbit8JCkvLFxuICB0YWJsZTogbm9vcCxcbiAgcGFyYWdyYXBoOiAvXigoPzpbXlxcbl0rXFxuPyg/IWhyfGhlYWRpbmd8bGhlYWRpbmd8YmxvY2txdW90ZXx0YWd8ZGVmKSkrKVxcbiovLFxuICB0ZXh0OiAvXlteXFxuXSsvXG59O1xuXG5ibG9jay5idWxsZXQgPSAvKD86WyorLV18XFxkK1xcLikvO1xuYmxvY2suaXRlbSA9IC9eKCAqKShidWxsKSBbXlxcbl0qKD86XFxuKD8hXFwxYnVsbCApW15cXG5dKikqLztcbmJsb2NrLml0ZW0gPSByZXBsYWNlKGJsb2NrLml0ZW0sICdnbScpXG4gICgvYnVsbC9nLCBibG9jay5idWxsZXQpXG4gICgpO1xuXG5ibG9jay5saXN0ID0gcmVwbGFjZShibG9jay5saXN0KVxuICAoL2J1bGwvZywgYmxvY2suYnVsbGV0KVxuICAoJ2hyJywgJ1xcXFxuKyg/PVxcXFwxPyg/OlstKl9dICopezMsfSg/OlxcXFxuK3wkKSknKVxuICAoJ2RlZicsICdcXFxcbisoPz0nICsgYmxvY2suZGVmLnNvdXJjZSArICcpJylcbiAgKCk7XG5cbmJsb2NrLmJsb2NrcXVvdGUgPSByZXBsYWNlKGJsb2NrLmJsb2NrcXVvdGUpXG4gICgnZGVmJywgYmxvY2suZGVmKVxuICAoKTtcblxuYmxvY2suX3RhZyA9ICcoPyEoPzonXG4gICsgJ2F8ZW18c3Ryb25nfHNtYWxsfHN8Y2l0ZXxxfGRmbnxhYmJyfGRhdGF8dGltZXxjb2RlJ1xuICArICd8dmFyfHNhbXB8a2JkfHN1YnxzdXB8aXxifHV8bWFya3xydWJ5fHJ0fHJwfGJkaXxiZG8nXG4gICsgJ3xzcGFufGJyfHdicnxpbnN8ZGVsfGltZylcXFxcYilcXFxcdysoPyE6L3xbXlxcXFx3XFxcXHNAXSpAKVxcXFxiJztcblxuYmxvY2suaHRtbCA9IHJlcGxhY2UoYmxvY2suaHRtbClcbiAgKCdjb21tZW50JywgLzwhLS1bXFxzXFxTXSo/LS0+LylcbiAgKCdjbG9zZWQnLCAvPCh0YWcpW1xcc1xcU10rPzxcXC9cXDE+LylcbiAgKCdjbG9zaW5nJywgLzx0YWcoPzpcIlteXCJdKlwifCdbXiddKid8W14nXCI+XSkqPz4vKVxuICAoL3RhZy9nLCBibG9jay5fdGFnKVxuICAoKTtcblxuYmxvY2sucGFyYWdyYXBoID0gcmVwbGFjZShibG9jay5wYXJhZ3JhcGgpXG4gICgnaHInLCBibG9jay5ocilcbiAgKCdoZWFkaW5nJywgYmxvY2suaGVhZGluZylcbiAgKCdsaGVhZGluZycsIGJsb2NrLmxoZWFkaW5nKVxuICAoJ2Jsb2NrcXVvdGUnLCBibG9jay5ibG9ja3F1b3RlKVxuICAoJ3RhZycsICc8JyArIGJsb2NrLl90YWcpXG4gICgnZGVmJywgYmxvY2suZGVmKVxuICAoKTtcblxuLyoqXG4gKiBOb3JtYWwgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLm5vcm1hbCA9IG1lcmdlKHt9LCBibG9jayk7XG5cbi8qKlxuICogR0ZNIEJsb2NrIEdyYW1tYXJcbiAqL1xuXG5ibG9jay5nZm0gPSBtZXJnZSh7fSwgYmxvY2subm9ybWFsLCB7XG4gIGZlbmNlczogL14gKihgezMsfXx+ezMsfSlbIFxcLl0qKFxcUyspPyAqXFxuKFtcXHNcXFNdKj8pXFxzKlxcMSAqKD86XFxuK3wkKS8sXG4gIHBhcmFncmFwaDogL14vLFxuICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKyhbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpL1xufSk7XG5cbmJsb2NrLmdmbS5wYXJhZ3JhcGggPSByZXBsYWNlKGJsb2NrLnBhcmFncmFwaClcbiAgKCcoPyEnLCAnKD8hJ1xuICAgICsgYmxvY2suZ2ZtLmZlbmNlcy5zb3VyY2UucmVwbGFjZSgnXFxcXDEnLCAnXFxcXDInKSArICd8J1xuICAgICsgYmxvY2subGlzdC5zb3VyY2UucmVwbGFjZSgnXFxcXDEnLCAnXFxcXDMnKSArICd8JylcbiAgKCk7XG5cbi8qKlxuICogR0ZNICsgVGFibGVzIEJsb2NrIEdyYW1tYXJcbiAqL1xuXG5ibG9jay50YWJsZXMgPSBtZXJnZSh7fSwgYmxvY2suZ2ZtLCB7XG4gIG5wdGFibGU6IC9eICooXFxTLipcXHwuKilcXG4gKihbLTpdKyAqXFx8Wy18IDpdKilcXG4oKD86LipcXHwuKig/OlxcbnwkKSkqKVxcbiovLFxuICB0YWJsZTogL14gKlxcfCguKylcXG4gKlxcfCggKlstOl0rWy18IDpdKilcXG4oKD86ICpcXHwuKig/OlxcbnwkKSkqKVxcbiovXG59KTtcblxuLyoqXG4gKiBCbG9jayBMZXhlclxuICovXG5cbmZ1bmN0aW9uIExleGVyKG9wdGlvbnMpIHtcbiAgdGhpcy50b2tlbnMgPSBbXTtcbiAgdGhpcy50b2tlbnMubGlua3MgPSB7fTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG4gIHRoaXMucnVsZXMgPSBibG9jay5ub3JtYWw7XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnRhYmxlcykge1xuICAgICAgdGhpcy5ydWxlcyA9IGJsb2NrLnRhYmxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IGJsb2NrLmdmbTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvc2UgQmxvY2sgUnVsZXNcbiAqL1xuXG5MZXhlci5ydWxlcyA9IGJsb2NrO1xuXG4vKipcbiAqIFN0YXRpYyBMZXggTWV0aG9kXG4gKi9cblxuTGV4ZXIubGV4ID0gZnVuY3Rpb24oc3JjLCBvcHRpb25zKSB7XG4gIHZhciBsZXhlciA9IG5ldyBMZXhlcihvcHRpb25zKTtcbiAgcmV0dXJuIGxleGVyLmxleChzcmMpO1xufTtcblxuLyoqXG4gKiBQcmVwcm9jZXNzaW5nXG4gKi9cblxuTGV4ZXIucHJvdG90eXBlLmxleCA9IGZ1bmN0aW9uKHNyYykge1xuICBzcmMgPSBzcmNcbiAgICAucmVwbGFjZSgvXFxyXFxufFxcci9nLCAnXFxuJylcbiAgICAucmVwbGFjZSgvXFx0L2csICcgICAgJylcbiAgICAucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpXG4gICAgLnJlcGxhY2UoL1xcdTI0MjQvZywgJ1xcbicpO1xuXG4gIHJldHVybiB0aGlzLnRva2VuKHNyYywgdHJ1ZSk7XG59O1xuXG4vKipcbiAqIExleGluZ1xuICovXG5cbkxleGVyLnByb3RvdHlwZS50b2tlbiA9IGZ1bmN0aW9uKHNyYywgdG9wLCBicSkge1xuICB2YXIgc3JjID0gc3JjLnJlcGxhY2UoL14gKyQvZ20sICcnKVxuICAgICwgbmV4dFxuICAgICwgbG9vc2VcbiAgICAsIGNhcFxuICAgICwgYnVsbFxuICAgICwgYlxuICAgICwgaXRlbVxuICAgICwgc3BhY2VcbiAgICAsIGlcbiAgICAsIGw7XG5cbiAgd2hpbGUgKHNyYykge1xuICAgIC8vIG5ld2xpbmVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5uZXdsaW5lLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMF0ubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnc3BhY2UnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvZGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGNhcCA9IGNhcFswXS5yZXBsYWNlKC9eIHs0fS9nbSwgJycpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgID8gY2FwLnJlcGxhY2UoL1xcbiskLywgJycpXG4gICAgICAgICAgOiBjYXBcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZmVuY2VzIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZmVuY2VzLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgIGxhbmc6IGNhcFsyXSxcbiAgICAgICAgdGV4dDogY2FwWzNdIHx8ICcnXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGhlYWRpbmdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5oZWFkaW5nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgIGRlcHRoOiBjYXBbMV0ubGVuZ3RoLFxuICAgICAgICB0ZXh0OiBjYXBbMl1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgbm8gbGVhZGluZyBwaXBlIChnZm0pXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5ucHRhYmxlLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgIGhlYWRlcjogY2FwWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBjZWxsczogY2FwWzNdLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0uY2VsbHNbaV0gPSBpdGVtLmNlbGxzW2ldLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxoZWFkaW5nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGhlYWRpbmcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgZGVwdGg6IGNhcFsyXSA9PT0gJz0nID8gMSA6IDIsXG4gICAgICAgIHRleHQ6IGNhcFsxXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBoclxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmhyLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaHInXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGJsb2NrcXVvdGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5ibG9ja3F1b3RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdibG9ja3F1b3RlX3N0YXJ0J1xuICAgICAgfSk7XG5cbiAgICAgIGNhcCA9IGNhcFswXS5yZXBsYWNlKC9eICo+ID8vZ20sICcnKTtcblxuICAgICAgLy8gUGFzcyBgdG9wYCB0byBrZWVwIHRoZSBjdXJyZW50XG4gICAgICAvLyBcInRvcGxldmVsXCIgc3RhdGUuIFRoaXMgaXMgZXhhY3RseVxuICAgICAgLy8gaG93IG1hcmtkb3duLnBsIHdvcmtzLlxuICAgICAgdGhpcy50b2tlbihjYXAsIHRvcCwgdHJ1ZSk7XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmxvY2txdW90ZV9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGlzdFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxpc3QuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgYnVsbCA9IGNhcFsyXTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaXN0X3N0YXJ0JyxcbiAgICAgICAgb3JkZXJlZDogYnVsbC5sZW5ndGggPiAxXG4gICAgICB9KTtcblxuICAgICAgLy8gR2V0IGVhY2ggdG9wLWxldmVsIGl0ZW0uXG4gICAgICBjYXAgPSBjYXBbMF0ubWF0Y2godGhpcy5ydWxlcy5pdGVtKTtcblxuICAgICAgbmV4dCA9IGZhbHNlO1xuICAgICAgbCA9IGNhcC5sZW5ndGg7XG4gICAgICBpID0gMDtcblxuICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaXRlbSA9IGNhcFtpXTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaXRlbSdzIGJ1bGxldFxuICAgICAgICAvLyBzbyBpdCBpcyBzZWVuIGFzIHRoZSBuZXh0IHRva2VuLlxuICAgICAgICBzcGFjZSA9IGl0ZW0ubGVuZ3RoO1xuICAgICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9eICooWyorLV18XFxkK1xcLikgKy8sICcnKTtcblxuICAgICAgICAvLyBPdXRkZW50IHdoYXRldmVyIHRoZVxuICAgICAgICAvLyBsaXN0IGl0ZW0gY29udGFpbnMuIEhhY2t5LlxuICAgICAgICBpZiAofml0ZW0uaW5kZXhPZignXFxuICcpKSB7XG4gICAgICAgICAgc3BhY2UgLT0gaXRlbS5sZW5ndGg7XG4gICAgICAgICAgaXRlbSA9ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICAgID8gaXRlbS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14gezEsJyArIHNwYWNlICsgJ30nLCAnZ20nKSwgJycpXG4gICAgICAgICAgICA6IGl0ZW0ucmVwbGFjZSgvXiB7MSw0fS9nbSwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG5leHQgbGlzdCBpdGVtIGJlbG9uZ3MgaGVyZS5cbiAgICAgICAgLy8gQmFja3BlZGFsIGlmIGl0IGRvZXMgbm90IGJlbG9uZyBpbiB0aGlzIGxpc3QuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc21hcnRMaXN0cyAmJiBpICE9PSBsIC0gMSkge1xuICAgICAgICAgIGIgPSBibG9jay5idWxsZXQuZXhlYyhjYXBbaSArIDFdKVswXTtcbiAgICAgICAgICBpZiAoYnVsbCAhPT0gYiAmJiAhKGJ1bGwubGVuZ3RoID4gMSAmJiBiLmxlbmd0aCA+IDEpKSB7XG4gICAgICAgICAgICBzcmMgPSBjYXAuc2xpY2UoaSArIDEpLmpvaW4oJ1xcbicpICsgc3JjO1xuICAgICAgICAgICAgaSA9IGwgLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIGl0ZW0gaXMgbG9vc2Ugb3Igbm90LlxuICAgICAgICAvLyBVc2U6IC8oXnxcXG4pKD8hIClbXlxcbl0rXFxuXFxuKD8hXFxzKiQpL1xuICAgICAgICAvLyBmb3IgZGlzY291bnQgYmVoYXZpb3IuXG4gICAgICAgIGxvb3NlID0gbmV4dCB8fCAvXFxuXFxuKD8hXFxzKiQpLy50ZXN0KGl0ZW0pO1xuICAgICAgICBpZiAoaSAhPT0gbCAtIDEpIHtcbiAgICAgICAgICBuZXh0ID0gaXRlbS5jaGFyQXQoaXRlbS5sZW5ndGggLSAxKSA9PT0gJ1xcbic7XG4gICAgICAgICAgaWYgKCFsb29zZSkgbG9vc2UgPSBuZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogbG9vc2VcbiAgICAgICAgICAgID8gJ2xvb3NlX2l0ZW1fc3RhcnQnXG4gICAgICAgICAgICA6ICdsaXN0X2l0ZW1fc3RhcnQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlY3Vyc2UuXG4gICAgICAgIHRoaXMudG9rZW4oaXRlbSwgZmFsc2UsIGJxKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnbGlzdF9pdGVtX2VuZCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHRtbFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmh0bWwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICAgID8gJ3BhcmFncmFwaCdcbiAgICAgICAgICA6ICdodG1sJyxcbiAgICAgICAgcHJlOiAhdGhpcy5vcHRpb25zLnNhbml0aXplclxuICAgICAgICAgICYmIChjYXBbMV0gPT09ICdwcmUnIHx8IGNhcFsxXSA9PT0gJ3NjcmlwdCcgfHwgY2FwWzFdID09PSAnc3R5bGUnKSxcbiAgICAgICAgdGV4dDogY2FwWzBdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGRlZlxuICAgIGlmICgoIWJxICYmIHRvcCkgJiYgKGNhcCA9IHRoaXMucnVsZXMuZGVmLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5saW5rc1tjYXBbMV0udG9Mb3dlckNhc2UoKV0gPSB7XG4gICAgICAgIGhyZWY6IGNhcFsyXSxcbiAgICAgICAgdGl0bGU6IGNhcFszXVxuICAgICAgfTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRhYmxlIChnZm0pXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy50YWJsZS5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuXG4gICAgICBpdGVtID0ge1xuICAgICAgICB0eXBlOiAndGFibGUnLFxuICAgICAgICBoZWFkZXI6IGNhcFsxXS5yZXBsYWNlKC9eICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGFsaWduOiBjYXBbMl0ucmVwbGFjZSgvXiAqfFxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgY2VsbHM6IGNhcFszXS5yZXBsYWNlKC8oPzogKlxcfCAqKT9cXG4kLywgJycpLnNwbGl0KCdcXG4nKVxuICAgICAgfTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uYWxpZ24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5jZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtLmNlbGxzW2ldID0gaXRlbS5jZWxsc1tpXVxuICAgICAgICAgIC5yZXBsYWNlKC9eICpcXHwgKnwgKlxcfCAqJC9nLCAnJylcbiAgICAgICAgICAuc3BsaXQoLyAqXFx8ICovKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50b2tlbnMucHVzaChpdGVtKTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdG9wLWxldmVsIHBhcmFncmFwaFxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMucGFyYWdyYXBoLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgIHRleHQ6IGNhcFsxXS5jaGFyQXQoY2FwWzFdLmxlbmd0aCAtIDEpID09PSAnXFxuJ1xuICAgICAgICAgID8gY2FwWzFdLnNsaWNlKDAsIC0xKVxuICAgICAgICAgIDogY2FwWzFdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRleHRcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMoc3JjKSkge1xuICAgICAgLy8gVG9wLWxldmVsIHNob3VsZCBuZXZlciByZWFjaCBoZXJlLlxuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIHRleHQ6IGNhcFswXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICB0aHJvdyBuZXdcbiAgICAgICAgRXJyb3IoJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIHNyYy5jaGFyQ29kZUF0KDApKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy50b2tlbnM7XG59O1xuXG4vKipcbiAqIElubGluZS1MZXZlbCBHcmFtbWFyXG4gKi9cblxudmFyIGlubGluZSA9IHtcbiAgZXNjYXBlOiAvXlxcXFwoW1xcXFxgKnt9XFxbXFxdKCkjK1xcLS4hXz5dKS8sXG4gIGF1dG9saW5rOiAvXjwoW14gPl0rKEB8OlxcLylbXiA+XSspPi8sXG4gIHVybDogbm9vcCxcbiAgdGFnOiAvXjwhLS1bXFxzXFxTXSo/LS0+fF48XFwvP1xcdysoPzpcIlteXCJdKlwifCdbXiddKid8W14nXCI+XSkqPz4vLFxuICBsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXChocmVmXFwpLyxcbiAgcmVmbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFxzKlxcWyhbXlxcXV0qKVxcXS8sXG4gIG5vbGluazogL14hP1xcWygoPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXSkqKVxcXS8sXG4gIHN0cm9uZzogL15fXyhbXFxzXFxTXSs/KV9fKD8hXyl8XlxcKlxcKihbXFxzXFxTXSs/KVxcKlxcKig/IVxcKikvLFxuICBlbTogL15cXGJfKCg/OlteX118X18pKz8pX1xcYnxeXFwqKCg/OlxcKlxcKnxbXFxzXFxTXSkrPylcXCooPyFcXCopLyxcbiAgY29kZTogL14oYCspXFxzKihbXFxzXFxTXSo/W15gXSlcXHMqXFwxKD8hYCkvLFxuICBicjogL14gezIsfVxcbig/IVxccyokKS8sXG4gIGRlbDogbm9vcCxcbiAgdGV4dDogL15bXFxzXFxTXSs/KD89W1xcXFw8IVxcW18qYF18IHsyLH1cXG58JCkvXG59O1xuXG5pbmxpbmUuX2luc2lkZSA9IC8oPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXXxcXF0oPz1bXlxcW10qXFxdKSkqLztcbmlubGluZS5faHJlZiA9IC9cXHMqPD8oW1xcc1xcU10qPyk+Pyg/OlxccytbJ1wiXShbXFxzXFxTXSo/KVsnXCJdKT9cXHMqLztcblxuaW5saW5lLmxpbmsgPSByZXBsYWNlKGlubGluZS5saW5rKVxuICAoJ2luc2lkZScsIGlubGluZS5faW5zaWRlKVxuICAoJ2hyZWYnLCBpbmxpbmUuX2hyZWYpXG4gICgpO1xuXG5pbmxpbmUucmVmbGluayA9IHJlcGxhY2UoaW5saW5lLnJlZmxpbmspXG4gICgnaW5zaWRlJywgaW5saW5lLl9pbnNpZGUpXG4gICgpO1xuXG4vKipcbiAqIE5vcm1hbCBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5ub3JtYWwgPSBtZXJnZSh7fSwgaW5saW5lKTtcblxuLyoqXG4gKiBQZWRhbnRpYyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5wZWRhbnRpYyA9IG1lcmdlKHt9LCBpbmxpbmUubm9ybWFsLCB7XG4gIHN0cm9uZzogL15fXyg/PVxcUykoW1xcc1xcU10qP1xcUylfXyg/IV8pfF5cXCpcXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXl8oPz1cXFMpKFtcXHNcXFNdKj9cXFMpXyg/IV8pfF5cXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqKD8hXFwqKS9cbn0pO1xuXG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5nZm0gPSBtZXJnZSh7fSwgaW5saW5lLm5vcm1hbCwge1xuICBlc2NhcGU6IHJlcGxhY2UoaW5saW5lLmVzY2FwZSkoJ10pJywgJ358XSknKSgpLFxuICB1cmw6IC9eKGh0dHBzPzpcXC9cXC9bXlxcczxdK1tePC4sOjtcIicpXFxdXFxzXSkvLFxuICBkZWw6IC9efn4oPz1cXFMpKFtcXHNcXFNdKj9cXFMpfn4vLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS50ZXh0KVxuICAgICgnXXwnLCAnfl18JylcbiAgICAoJ3wnLCAnfGh0dHBzPzovL3wnKVxuICAgICgpXG59KTtcblxuLyoqXG4gKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5icmVha3MgPSBtZXJnZSh7fSwgaW5saW5lLmdmbSwge1xuICBicjogcmVwbGFjZShpbmxpbmUuYnIpKCd7Mix9JywgJyonKSgpLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS5nZm0udGV4dCkoJ3syLH0nLCAnKicpKClcbn0pO1xuXG4vKipcbiAqIElubGluZSBMZXhlciAmIENvbXBpbGVyXG4gKi9cblxuZnVuY3Rpb24gSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG4gIHRoaXMubGlua3MgPSBsaW5rcztcbiAgdGhpcy5ydWxlcyA9IGlubGluZS5ub3JtYWw7XG4gIHRoaXMucmVuZGVyZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyZXIgfHwgbmV3IFJlbmRlcmVyO1xuICB0aGlzLnJlbmRlcmVyLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgaWYgKCF0aGlzLmxpbmtzKSB7XG4gICAgdGhyb3cgbmV3XG4gICAgICBFcnJvcignVG9rZW5zIGFycmF5IHJlcXVpcmVzIGEgYGxpbmtzYCBwcm9wZXJ0eS4nKTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBpbmxpbmUuYnJlYWtzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gaW5saW5lLmdmbTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgdGhpcy5ydWxlcyA9IGlubGluZS5wZWRhbnRpYztcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBJbmxpbmUgUnVsZXNcbiAqL1xuXG5JbmxpbmVMZXhlci5ydWxlcyA9IGlubGluZTtcblxuLyoqXG4gKiBTdGF0aWMgTGV4aW5nL0NvbXBpbGluZyBNZXRob2RcbiAqL1xuXG5JbmxpbmVMZXhlci5vdXRwdXQgPSBmdW5jdGlvbihzcmMsIGxpbmtzLCBvcHRpb25zKSB7XG4gIHZhciBpbmxpbmUgPSBuZXcgSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpO1xuICByZXR1cm4gaW5saW5lLm91dHB1dChzcmMpO1xufTtcblxuLyoqXG4gKiBMZXhpbmcvQ29tcGlsaW5nXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKHNyYykge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGxpbmtcbiAgICAsIHRleHRcbiAgICAsIGhyZWZcbiAgICAsIGNhcDtcblxuICB3aGlsZSAoc3JjKSB7XG4gICAgLy8gZXNjYXBlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZXNjYXBlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSBjYXBbMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBhdXRvbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmF1dG9saW5rLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICB0ZXh0ID0gY2FwWzFdLmNoYXJBdCg2KSA9PT0gJzonXG4gICAgICAgICAgPyB0aGlzLm1hbmdsZShjYXBbMV0uc3Vic3RyaW5nKDcpKVxuICAgICAgICAgIDogdGhpcy5tYW5nbGUoY2FwWzFdKTtcbiAgICAgICAgaHJlZiA9IHRoaXMubWFuZ2xlKCdtYWlsdG86JykgKyB0ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgbnVsbCwgdGV4dCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB1cmwgKGdmbSlcbiAgICBpZiAoIXRoaXMuaW5MaW5rICYmIChjYXAgPSB0aGlzLnJ1bGVzLnVybC5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5saW5rKGhyZWYsIG51bGwsIHRleHQpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFnXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudGFnLmV4ZWMoc3JjKSkge1xuICAgICAgaWYgKCF0aGlzLmluTGluayAmJiAvXjxhIC9pLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICB0aGlzLmluTGluayA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5MaW5rICYmIC9ePFxcL2E+L2kudGVzdChjYXBbMF0pKSB7XG4gICAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXJcbiAgICAgICAgICA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIoY2FwWzBdKVxuICAgICAgICAgIDogZXNjYXBlKGNhcFswXSlcbiAgICAgICAgOiBjYXBbMF1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxpbmtcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5saW5rLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoY2FwLCB7XG4gICAgICAgIGhyZWY6IGNhcFsyXSxcbiAgICAgICAgdGl0bGU6IGNhcFszXVxuICAgICAgfSk7XG4gICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gcmVmbGluaywgbm9saW5rXG4gICAgaWYgKChjYXAgPSB0aGlzLnJ1bGVzLnJlZmxpbmsuZXhlYyhzcmMpKVxuICAgICAgICB8fCAoY2FwID0gdGhpcy5ydWxlcy5ub2xpbmsuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGxpbmsgPSAoY2FwWzJdIHx8IGNhcFsxXSkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgICAgbGluayA9IHRoaXMubGlua3NbbGluay50b0xvd2VyQ2FzZSgpXTtcbiAgICAgIGlmICghbGluayB8fCAhbGluay5ocmVmKSB7XG4gICAgICAgIG91dCArPSBjYXBbMF0uY2hhckF0KDApO1xuICAgICAgICBzcmMgPSBjYXBbMF0uc3Vic3RyaW5nKDEpICsgc3JjO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoY2FwLCBsaW5rKTtcbiAgICAgIHRoaXMuaW5MaW5rID0gZmFsc2U7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBzdHJvbmdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5zdHJvbmcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuc3Ryb25nKHRoaXMub3V0cHV0KGNhcFsyXSB8fCBjYXBbMV0pKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGVtXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZW0uZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuZW0odGhpcy5vdXRwdXQoY2FwWzJdIHx8IGNhcFsxXSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gY29kZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuY29kZXNwYW4oZXNjYXBlKGNhcFsyXSwgdHJ1ZSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYnJcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5ici5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5icigpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZGVsIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZGVsLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmRlbCh0aGlzLm91dHB1dChjYXBbMV0pKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRleHRcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnRleHQoZXNjYXBlKHRoaXMuc21hcnR5cGFudHMoY2FwWzBdKSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhyb3cgbmV3XG4gICAgICAgIEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29tcGlsZSBMaW5rXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dExpbmsgPSBmdW5jdGlvbihjYXAsIGxpbmspIHtcbiAgdmFyIGhyZWYgPSBlc2NhcGUobGluay5ocmVmKVxuICAgICwgdGl0bGUgPSBsaW5rLnRpdGxlID8gZXNjYXBlKGxpbmsudGl0bGUpIDogbnVsbDtcblxuICByZXR1cm4gY2FwWzBdLmNoYXJBdCgwKSAhPT0gJyEnXG4gICAgPyB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgdGl0bGUsIHRoaXMub3V0cHV0KGNhcFsxXSkpXG4gICAgOiB0aGlzLnJlbmRlcmVyLmltYWdlKGhyZWYsIHRpdGxlLCBlc2NhcGUoY2FwWzFdKSk7XG59O1xuXG4vKipcbiAqIFNtYXJ0eXBhbnRzIFRyYW5zZm9ybWF0aW9uc1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5zbWFydHlwYW50cyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMuc21hcnR5cGFudHMpIHJldHVybiB0ZXh0O1xuICByZXR1cm4gdGV4dFxuICAgIC8vIGVtLWRhc2hlc1xuICAgIC5yZXBsYWNlKC8tLS0vZywgJ1xcdTIwMTQnKVxuICAgIC8vIGVuLWRhc2hlc1xuICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxMycpXG4gICAgLy8gb3BlbmluZyBzaW5nbGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1wiXFxzXSknL2csICckMVxcdTIwMTgnKVxuICAgIC8vIGNsb3Npbmcgc2luZ2xlcyAmIGFwb3N0cm9waGVzXG4gICAgLnJlcGxhY2UoLycvZywgJ1xcdTIwMTknKVxuICAgIC8vIG9wZW5pbmcgZG91Ymxlc1xuICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcXHUyMDE4XFxzXSlcIi9nLCAnJDFcXHUyMDFjJylcbiAgICAvLyBjbG9zaW5nIGRvdWJsZXNcbiAgICAucmVwbGFjZSgvXCIvZywgJ1xcdTIwMWQnKVxuICAgIC8vIGVsbGlwc2VzXG4gICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpO1xufTtcblxuLyoqXG4gKiBNYW5nbGUgTGlua3NcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUubWFuZ2xlID0gZnVuY3Rpb24odGV4dCkge1xuICBpZiAoIXRoaXMub3B0aW9ucy5tYW5nbGUpIHJldHVybiB0ZXh0O1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGwgPSB0ZXh0Lmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIGNoO1xuXG4gIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2ggPSB0ZXh0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgIGNoID0gJ3gnICsgY2gudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgICBvdXQgKz0gJyYjJyArIGNoICsgJzsnO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmVuZGVyZXJcbiAqL1xuXG5mdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG59XG5cblJlbmRlcmVyLnByb3RvdHlwZS5jb2RlID0gZnVuY3Rpb24oY29kZSwgbGFuZywgZXNjYXBlZCkge1xuICBpZiAodGhpcy5vcHRpb25zLmhpZ2hsaWdodCkge1xuICAgIHZhciBvdXQgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KGNvZGUsIGxhbmcpO1xuICAgIGlmIChvdXQgIT0gbnVsbCAmJiBvdXQgIT09IGNvZGUpIHtcbiAgICAgIGVzY2FwZWQgPSB0cnVlO1xuICAgICAgY29kZSA9IG91dDtcbiAgICB9XG4gIH1cblxuICBpZiAoIWxhbmcpIHtcbiAgICByZXR1cm4gJzxwcmU+PGNvZGU+J1xuICAgICAgKyAoZXNjYXBlZCA/IGNvZGUgOiBlc2NhcGUoY29kZSwgdHJ1ZSkpXG4gICAgICArICdcXG48L2NvZGU+PC9wcmU+JztcbiAgfVxuXG4gIHJldHVybiAnPHByZT48Y29kZSBjbGFzcz1cIidcbiAgICArIHRoaXMub3B0aW9ucy5sYW5nUHJlZml4XG4gICAgKyBlc2NhcGUobGFuZywgdHJ1ZSlcbiAgICArICdcIj4nXG4gICAgKyAoZXNjYXBlZCA/IGNvZGUgOiBlc2NhcGUoY29kZSwgdHJ1ZSkpXG4gICAgKyAnXFxuPC9jb2RlPjwvcHJlPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuYmxvY2txdW90ZSA9IGZ1bmN0aW9uKHF1b3RlKSB7XG4gIHJldHVybiAnPGJsb2NrcXVvdGU+XFxuJyArIHF1b3RlICsgJzwvYmxvY2txdW90ZT5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmh0bWwgPSBmdW5jdGlvbihodG1sKSB7XG4gIHJldHVybiBodG1sO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmhlYWRpbmcgPSBmdW5jdGlvbih0ZXh0LCBsZXZlbCwgcmF3KSB7XG4gIHJldHVybiAnPGgnXG4gICAgKyBsZXZlbFxuICAgICsgJyBpZD1cIidcbiAgICArIHRoaXMub3B0aW9ucy5oZWFkZXJQcmVmaXhcbiAgICArIHJhdy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teXFx3XSsvZywgJy0nKVxuICAgICsgJ1wiPidcbiAgICArIHRleHRcbiAgICArICc8L2gnXG4gICAgKyBsZXZlbFxuICAgICsgJz5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmhyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMueGh0bWwgPyAnPGhyLz5cXG4nIDogJzxocj5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmxpc3QgPSBmdW5jdGlvbihib2R5LCBvcmRlcmVkKSB7XG4gIHZhciB0eXBlID0gb3JkZXJlZCA/ICdvbCcgOiAndWwnO1xuICByZXR1cm4gJzwnICsgdHlwZSArICc+XFxuJyArIGJvZHkgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS5saXN0aXRlbSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgcmV0dXJuICc8bGk+JyArIHRleHQgKyAnPC9saT5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLnBhcmFncmFwaCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgcmV0dXJuICc8cD4nICsgdGV4dCArICc8L3A+XFxuJztcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS50YWJsZSA9IGZ1bmN0aW9uKGhlYWRlciwgYm9keSkge1xuICByZXR1cm4gJzx0YWJsZT5cXG4nXG4gICAgKyAnPHRoZWFkPlxcbidcbiAgICArIGhlYWRlclxuICAgICsgJzwvdGhlYWQ+XFxuJ1xuICAgICsgJzx0Ym9keT5cXG4nXG4gICAgKyBib2R5XG4gICAgKyAnPC90Ym9keT5cXG4nXG4gICAgKyAnPC90YWJsZT5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLnRhYmxlcm93ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gJzx0cj5cXG4nICsgY29udGVudCArICc8L3RyPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUudGFibGVjZWxsID0gZnVuY3Rpb24oY29udGVudCwgZmxhZ3MpIHtcbiAgdmFyIHR5cGUgPSBmbGFncy5oZWFkZXIgPyAndGgnIDogJ3RkJztcbiAgdmFyIHRhZyA9IGZsYWdzLmFsaWduXG4gICAgPyAnPCcgKyB0eXBlICsgJyBzdHlsZT1cInRleHQtYWxpZ246JyArIGZsYWdzLmFsaWduICsgJ1wiPidcbiAgICA6ICc8JyArIHR5cGUgKyAnPic7XG4gIHJldHVybiB0YWcgKyBjb250ZW50ICsgJzwvJyArIHR5cGUgKyAnPlxcbic7XG59O1xuXG4vLyBzcGFuIGxldmVsIHJlbmRlcmVyXG5SZW5kZXJlci5wcm90b3R5cGUuc3Ryb25nID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gJzxzdHJvbmc+JyArIHRleHQgKyAnPC9zdHJvbmc+Jztcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS5lbSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgcmV0dXJuICc8ZW0+JyArIHRleHQgKyAnPC9lbT4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmNvZGVzcGFuID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gJzxjb2RlPicgKyB0ZXh0ICsgJzwvY29kZT4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmJyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMueGh0bWwgPyAnPGJyLz4nIDogJzxicj4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgcmV0dXJuICc8ZGVsPicgKyB0ZXh0ICsgJzwvZGVsPic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUubGluayA9IGZ1bmN0aW9uKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHByb3QgPSBkZWNvZGVVUklDb21wb25lbnQodW5lc2NhcGUoaHJlZikpXG4gICAgICAgIC5yZXBsYWNlKC9bXlxcdzpdL2csICcnKVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChwcm90LmluZGV4T2YoJ2phdmFzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCd2YnNjcmlwdDonKSA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuICB2YXIgb3V0ID0gJzxhIGhyZWY9XCInICsgaHJlZiArICdcIic7XG4gIGlmICh0aXRsZSkge1xuICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgfVxuICBvdXQgKz0gJz4nICsgdGV4dCArICc8L2E+JztcbiAgcmV0dXJuIG91dDtcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS5pbWFnZSA9IGZ1bmN0aW9uKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gIHZhciBvdXQgPSAnPGltZyBzcmM9XCInICsgaHJlZiArICdcIiBhbHQ9XCInICsgdGV4dCArICdcIic7XG4gIGlmICh0aXRsZSkge1xuICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgfVxuICBvdXQgKz0gdGhpcy5vcHRpb25zLnhodG1sID8gJy8+JyA6ICc+JztcbiAgcmV0dXJuIG91dDtcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogUGFyc2luZyAmIENvbXBpbGluZ1xuICovXG5cbmZ1bmN0aW9uIFBhcnNlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW4gPSBudWxsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5vcHRpb25zLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcjtcbiAgdGhpcy5yZW5kZXJlciA9IHRoaXMub3B0aW9ucy5yZW5kZXJlcjtcbiAgdGhpcy5yZW5kZXJlci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xufVxuXG4vKipcbiAqIFN0YXRpYyBQYXJzZSBNZXRob2RcbiAqL1xuXG5QYXJzZXIucGFyc2UgPSBmdW5jdGlvbihzcmMsIG9wdGlvbnMsIHJlbmRlcmVyKSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMsIHJlbmRlcmVyKTtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZShzcmMpO1xufTtcblxuLyoqXG4gKiBQYXJzZSBMb29wXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHNyYykge1xuICB0aGlzLmlubGluZSA9IG5ldyBJbmxpbmVMZXhlcihzcmMubGlua3MsIHRoaXMub3B0aW9ucywgdGhpcy5yZW5kZXJlcik7XG4gIHRoaXMudG9rZW5zID0gc3JjLnJldmVyc2UoKTtcblxuICB2YXIgb3V0ID0gJyc7XG4gIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgIG91dCArPSB0aGlzLnRvaygpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbiA9IHRoaXMudG9rZW5zLnBvcCgpO1xufTtcblxuLyoqXG4gKiBQcmV2aWV3IE5leHQgVG9rZW5cbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMudG9rZW5zLmxlbmd0aCAtIDFdIHx8IDA7XG59O1xuXG4vKipcbiAqIFBhcnNlIFRleHQgVG9rZW5zXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGJvZHkgPSB0aGlzLnRva2VuLnRleHQ7XG5cbiAgd2hpbGUgKHRoaXMucGVlaygpLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgIGJvZHkgKz0gJ1xcbicgKyB0aGlzLm5leHQoKS50ZXh0O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5saW5lLm91dHB1dChib2R5KTtcbn07XG5cbi8qKlxuICogUGFyc2UgQ3VycmVudCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUudG9rID0gZnVuY3Rpb24oKSB7XG4gIHN3aXRjaCAodGhpcy50b2tlbi50eXBlKSB7XG4gICAgY2FzZSAnc3BhY2UnOiB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNhc2UgJ2hyJzoge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaHIoKTtcbiAgICB9XG4gICAgY2FzZSAnaGVhZGluZyc6IHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhlYWRpbmcoXG4gICAgICAgIHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpLFxuICAgICAgICB0aGlzLnRva2VuLmRlcHRoLFxuICAgICAgICB0aGlzLnRva2VuLnRleHQpO1xuICAgIH1cbiAgICBjYXNlICdjb2RlJzoge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuY29kZSh0aGlzLnRva2VuLnRleHQsXG4gICAgICAgIHRoaXMudG9rZW4ubGFuZyxcbiAgICAgICAgdGhpcy50b2tlbi5lc2NhcGVkKTtcbiAgICB9XG4gICAgY2FzZSAndGFibGUnOiB7XG4gICAgICB2YXIgaGVhZGVyID0gJydcbiAgICAgICAgLCBib2R5ID0gJydcbiAgICAgICAgLCBpXG4gICAgICAgICwgcm93XG4gICAgICAgICwgY2VsbFxuICAgICAgICAsIGZsYWdzXG4gICAgICAgICwgajtcblxuICAgICAgLy8gaGVhZGVyXG4gICAgICBjZWxsID0gJyc7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy50b2tlbi5oZWFkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmxhZ3MgPSB7IGhlYWRlcjogdHJ1ZSwgYWxpZ246IHRoaXMudG9rZW4uYWxpZ25baV0gfTtcbiAgICAgICAgY2VsbCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlY2VsbChcbiAgICAgICAgICB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi5oZWFkZXJbaV0pLFxuICAgICAgICAgIHsgaGVhZGVyOiB0cnVlLCBhbGlnbjogdGhpcy50b2tlbi5hbGlnbltpXSB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBoZWFkZXIgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm93ID0gdGhpcy50b2tlbi5jZWxsc1tpXTtcblxuICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjZWxsICs9IHRoaXMucmVuZGVyZXIudGFibGVjZWxsKFxuICAgICAgICAgICAgdGhpcy5pbmxpbmUub3V0cHV0KHJvd1tqXSksXG4gICAgICAgICAgICB7IGhlYWRlcjogZmFsc2UsIGFsaWduOiB0aGlzLnRva2VuLmFsaWduW2pdIH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9keSArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIudGFibGUoaGVhZGVyLCBib2R5KTtcbiAgICB9XG4gICAgY2FzZSAnYmxvY2txdW90ZV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnYmxvY2txdW90ZV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuYmxvY2txdW90ZShib2R5KTtcbiAgICB9XG4gICAgY2FzZSAnbGlzdF9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJydcbiAgICAgICAgLCBvcmRlcmVkID0gdGhpcy50b2tlbi5vcmRlcmVkO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3QoYm9keSwgb3JkZXJlZCk7XG4gICAgfVxuICAgIGNhc2UgJ2xpc3RfaXRlbV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9pdGVtX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLnR5cGUgPT09ICd0ZXh0J1xuICAgICAgICAgID8gdGhpcy5wYXJzZVRleHQoKVxuICAgICAgICAgIDogdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgfVxuICAgIGNhc2UgJ2xvb3NlX2l0ZW1fc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfaXRlbV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgfVxuICAgIGNhc2UgJ2h0bWwnOiB7XG4gICAgICB2YXIgaHRtbCA9ICF0aGlzLnRva2VuLnByZSAmJiAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgID8gdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dClcbiAgICAgICAgOiB0aGlzLnRva2VuLnRleHQ7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5odG1sKGh0bWwpO1xuICAgIH1cbiAgICBjYXNlICdwYXJhZ3JhcGgnOiB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgodGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dCkpO1xuICAgIH1cbiAgICBjYXNlICd0ZXh0Jzoge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMucGFyc2VUZXh0KCkpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBIZWxwZXJzXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGh0bWwsIGVuY29kZSkge1xuICByZXR1cm4gaHRtbFxuICAgIC5yZXBsYWNlKCFlbmNvZGUgPyAvJig/ISM/XFx3KzspL2cgOiAvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShodG1sKSB7XG4gIHJldHVybiBodG1sLnJlcGxhY2UoLyYoWyNcXHddKyk7L2csIGZ1bmN0aW9uKF8sIG4pIHtcbiAgICBuID0gbi50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChuID09PSAnY29sb24nKSByZXR1cm4gJzonO1xuICAgIGlmIChuLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICByZXR1cm4gbi5jaGFyQXQoMSkgPT09ICd4J1xuICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobi5zdWJzdHJpbmcoMiksIDE2KSlcbiAgICAgICAgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKCtuLnN1YnN0cmluZygxKSk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2UocmVnZXgsIG9wdCkge1xuICByZWdleCA9IHJlZ2V4LnNvdXJjZTtcbiAgb3B0ID0gb3B0IHx8ICcnO1xuICByZXR1cm4gZnVuY3Rpb24gc2VsZihuYW1lLCB2YWwpIHtcbiAgICBpZiAoIW5hbWUpIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4LCBvcHQpO1xuICAgIHZhbCA9IHZhbC5zb3VyY2UgfHwgdmFsO1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKC8oXnxbXlxcW10pXFxeL2csICckMScpO1xuICAgIHJlZ2V4ID0gcmVnZXgucmVwbGFjZShuYW1lLCB2YWwpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cbm5vb3AuZXhlYyA9IG5vb3A7XG5cbmZ1bmN0aW9uIG1lcmdlKG9iaikge1xuICB2YXIgaSA9IDFcbiAgICAsIHRhcmdldFxuICAgICwga2V5O1xuXG4gIGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSB0YXJnZXRba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5cbi8qKlxuICogTWFya2VkXG4gKi9cblxuZnVuY3Rpb24gbWFya2VkKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICBpZiAoY2FsbGJhY2sgfHwgdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0O1xuICAgICAgb3B0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQgfHwge30pO1xuXG4gICAgdmFyIGhpZ2hsaWdodCA9IG9wdC5oaWdobGlnaHRcbiAgICAgICwgdG9rZW5zXG4gICAgICAsIHBlbmRpbmdcbiAgICAgICwgaSA9IDA7XG5cbiAgICB0cnkge1xuICAgICAgdG9rZW5zID0gTGV4ZXIubGV4KHNyYywgb3B0KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICB9XG5cbiAgICBwZW5kaW5nID0gdG9rZW5zLmxlbmd0aDtcblxuICAgIHZhciBkb25lID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIG9wdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3V0O1xuXG4gICAgICB0cnkge1xuICAgICAgICBvdXQgPSBQYXJzZXIucGFyc2UodG9rZW5zLCBvcHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnIgPSBlO1xuICAgICAgfVxuXG4gICAgICBvcHQuaGlnaGxpZ2h0ID0gaGlnaGxpZ2h0O1xuXG4gICAgICByZXR1cm4gZXJyXG4gICAgICAgID8gY2FsbGJhY2soZXJyKVxuICAgICAgICA6IGNhbGxiYWNrKG51bGwsIG91dCk7XG4gICAgfTtcblxuICAgIGlmICghaGlnaGxpZ2h0IHx8IGhpZ2hsaWdodC5sZW5ndGggPCAzKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cblxuICAgIGRlbGV0ZSBvcHQuaGlnaGxpZ2h0O1xuXG4gICAgaWYgKCFwZW5kaW5nKSByZXR1cm4gZG9uZSgpO1xuXG4gICAgZm9yICg7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIChmdW5jdGlvbih0b2tlbikge1xuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gJ2NvZGUnKSB7XG4gICAgICAgICAgcmV0dXJuIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhpZ2hsaWdodCh0b2tlbi50ZXh0LCB0b2tlbi5sYW5nLCBmdW5jdGlvbihlcnIsIGNvZGUpIHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gZG9uZShlcnIpO1xuICAgICAgICAgIGlmIChjb2RlID09IG51bGwgfHwgY29kZSA9PT0gdG9rZW4udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRva2VuLnRleHQgPSBjb2RlO1xuICAgICAgICAgIHRva2VuLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSkodG9rZW5zW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBpZiAob3B0KSBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQpO1xuICAgIHJldHVybiBQYXJzZXIucGFyc2UoTGV4ZXIubGV4KHNyYywgb3B0KSwgb3B0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGUubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZC4nO1xuICAgIGlmICgob3B0IHx8IG1hcmtlZC5kZWZhdWx0cykuc2lsZW50KSB7XG4gICAgICByZXR1cm4gJzxwPkFuIGVycm9yIG9jY3VyZWQ6PC9wPjxwcmU+J1xuICAgICAgICArIGVzY2FwZShlLm1lc3NhZ2UgKyAnJywgdHJ1ZSlcbiAgICAgICAgKyAnPC9wcmU+JztcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnNcbiAqL1xuXG5tYXJrZWQub3B0aW9ucyA9XG5tYXJrZWQuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdCkge1xuICBtZXJnZShtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG4gIHJldHVybiBtYXJrZWQ7XG59O1xuXG5tYXJrZWQuZGVmYXVsdHMgPSB7XG4gIGdmbTogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBicmVha3M6IGZhbHNlLFxuICBwZWRhbnRpYzogZmFsc2UsXG4gIHNhbml0aXplOiBmYWxzZSxcbiAgc2FuaXRpemVyOiBudWxsLFxuICBtYW5nbGU6IHRydWUsXG4gIHNtYXJ0TGlzdHM6IGZhbHNlLFxuICBzaWxlbnQ6IGZhbHNlLFxuICBoaWdobGlnaHQ6IG51bGwsXG4gIGxhbmdQcmVmaXg6ICdsYW5nLScsXG4gIHNtYXJ0eXBhbnRzOiBmYWxzZSxcbiAgaGVhZGVyUHJlZml4OiAnJyxcbiAgcmVuZGVyZXI6IG5ldyBSZW5kZXJlcixcbiAgeGh0bWw6IGZhbHNlXG59O1xuXG4vKipcbiAqIEV4cG9zZVxuICovXG5cbm1hcmtlZC5QYXJzZXIgPSBQYXJzZXI7XG5tYXJrZWQucGFyc2VyID0gUGFyc2VyLnBhcnNlO1xuXG5tYXJrZWQuUmVuZGVyZXIgPSBSZW5kZXJlcjtcblxubWFya2VkLkxleGVyID0gTGV4ZXI7XG5tYXJrZWQubGV4ZXIgPSBMZXhlci5sZXg7XG5cbm1hcmtlZC5JbmxpbmVMZXhlciA9IElubGluZUxleGVyO1xubWFya2VkLmlubGluZUxleGVyID0gSW5saW5lTGV4ZXIub3V0cHV0O1xuXG5tYXJrZWQucGFyc2UgPSBtYXJrZWQ7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBtYXJrZWQ7XG59IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBtYXJrZWQ7IH0pO1xufSBlbHNlIHtcbiAgdGhpcy5tYXJrZWQgPSBtYXJrZWQ7XG59XG5cbn0pLmNhbGwoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzIHx8ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCk7XG59KCkpO1xuIiwiLyohXG4gKiBudW1lcmFsLmpzXG4gKiB2ZXJzaW9uIDogMS41LjNcbiAqIGF1dGhvciA6IEFkYW0gRHJhcGVyXG4gKiBsaWNlbnNlIDogTUlUXG4gKiBodHRwOi8vYWRhbXdkcmFwZXIuZ2l0aHViLmNvbS9OdW1lcmFsLWpzL1xuICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0YW50c1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBudW1lcmFsLFxuICAgICAgICBWRVJTSU9OID0gJzEuNS4zJyxcbiAgICAgICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbGFuZ3VhZ2UgY29uZmlnIGZpbGVzXG4gICAgICAgIGxhbmd1YWdlcyA9IHt9LFxuICAgICAgICBjdXJyZW50TGFuZ3VhZ2UgPSAnZW4nLFxuICAgICAgICB6ZXJvRm9ybWF0ID0gbnVsbCxcbiAgICAgICAgZGVmYXVsdEZvcm1hdCA9ICcwLDAnLFxuICAgICAgICAvLyBjaGVjayBmb3Igbm9kZUpTXG4gICAgICAgIGhhc01vZHVsZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBOdW1lcmFsIHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBOdW1lcmFsIChudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcbiAgICAgKlxuICAgICAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09ICcwLjYxJykgdGhhdCBwcmVzZW50XG4gICAgICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9GaXhlZCAodmFsdWUsIHByZWNpc2lvbiwgcm91bmRpbmdGdW5jdGlvbiwgb3B0aW9uYWxzKSB7XG4gICAgICAgIHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pLFxuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwLFxuICAgICAgICAgICAgb3V0cHV0O1xuICAgICAgICAgICAgXG4gICAgICAgIC8vcm91bmRpbmdGdW5jdGlvbiA9IChyb3VuZGluZ0Z1bmN0aW9uICE9PSB1bmRlZmluZWQgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZCk7XG4gICAgICAgIC8vIE11bHRpcGx5IHVwIGJ5IHByZWNpc2lvbiwgcm91bmQgYWNjdXJhdGVseSwgdGhlbiBkaXZpZGUgYW5kIHVzZSBuYXRpdmUgdG9GaXhlZCgpOlxuICAgICAgICBvdXRwdXQgPSAocm91bmRpbmdGdW5jdGlvbih2YWx1ZSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cbiAgICAgICAgaWYgKG9wdGlvbmFscykge1xuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwID0gbmV3IFJlZ0V4cCgnMHsxLCcgKyBvcHRpb25hbHMgKyAnfSQnKTtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG9wdGlvbmFsc1JlZ0V4cCwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBkZXRlcm1pbmUgd2hhdCB0eXBlIG9mIGZvcm1hdHRpbmcgd2UgbmVlZCB0byBkb1xuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWVyYWwgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgb3V0cHV0O1xuXG4gICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hhdCBraW5kIG9mIGZvcm1hdCB3ZSBhcmUgZGVhbGluZyB3aXRoXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignJCcpID4gLTEpIHsgLy8gY3VycmVuY3khISEhIVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0Q3VycmVuY3kobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignJScpID4gLTEpIHsgLy8gcGVyY2VudGFnZVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0UGVyY2VudGFnZShuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCc6JykgPiAtMSkgeyAvLyB0aW1lXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRUaW1lKG4sIGZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHBsYWluIG9sJyBudW1iZXJzIG9yIGJ5dGVzXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIobi5fdmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gc3RyaW5nXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gcmV2ZXJ0IHRvIG51bWJlclxuICAgIGZ1bmN0aW9uIHVuZm9ybWF0TnVtZXJhbCAobiwgc3RyaW5nKSB7XG4gICAgICAgIHZhciBzdHJpbmdPcmlnaW5hbCA9IHN0cmluZyxcbiAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwLFxuICAgICAgICAgICAgbWlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIGJpbGxpb25SZWdFeHAsXG4gICAgICAgICAgICB0cmlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIHN1ZmZpeGVzID0gWydLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gZmFsc2UsXG4gICAgICAgICAgICBwb3dlcjtcblxuICAgICAgICBpZiAoc3RyaW5nLmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICAgICAgICBuLl92YWx1ZSA9IHVuZm9ybWF0VGltZShzdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN0cmluZyA9PT0gemVyb0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC9cXC4vZywnJykucmVwbGFjZShsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwsICcuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIGFiYnJldmlhdGlvbnMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQgKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIG1pbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICBiaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMuYmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgdHJpbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgYnl0ZXMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIGZvciAocG93ZXIgPSAwOyBwb3dlciA8PSBzdWZmaXhlcy5sZW5ndGg7IHBvd2VyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gKHN0cmluZy5pbmRleE9mKHN1ZmZpeGVzW3Bvd2VyXSkgPiAtMSkgPyBNYXRoLnBvdygxMDI0LCBwb3dlciArIDEpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGVzTXVsdGlwbGllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkbyBzb21lIG1hdGggdG8gY3JlYXRlIG91ciBudW1iZXJcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9ICgoYnl0ZXNNdWx0aXBsaWVyKSA/IGJ5dGVzTXVsdGlwbGllciA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaCh0aG91c2FuZFJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDMpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKG1pbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCA2KSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaChiaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgOSkgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2godHJpbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCAxMikgOiAxKSAqICgoc3RyaW5nLmluZGV4T2YoJyUnKSA+IC0xKSA/IDAuMDEgOiAxKSAqICgoKHN0cmluZy5zcGxpdCgnLScpLmxlbmd0aCArIE1hdGgubWluKHN0cmluZy5zcGxpdCgnKCcpLmxlbmd0aC0xLCBzdHJpbmcuc3BsaXQoJyknKS5sZW5ndGgtMSkpICUgMik/IDE6IC0xKSAqIE51bWJlcihzdHJpbmcucmVwbGFjZSgvW14wLTlcXC5dKy9nLCAnJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gcm91bmQgaWYgd2UgYXJlIHRhbGtpbmcgYWJvdXQgYnl0ZXNcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9IChieXRlc011bHRpcGxpZXIpID8gTWF0aC5jZWlsKG4uX3ZhbHVlKSA6IG4uX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuLl92YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRDdXJyZW5jeSAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzeW1ib2xJbmRleCA9IGZvcm1hdC5pbmRleE9mKCckJyksXG4gICAgICAgICAgICBvcGVuUGFyZW5JbmRleCA9IGZvcm1hdC5pbmRleE9mKCcoJyksXG4gICAgICAgICAgICBtaW51c1NpZ25JbmRleCA9IGZvcm1hdC5pbmRleE9mKCctJyksXG4gICAgICAgICAgICBzcGFjZSA9ICcnLFxuICAgICAgICAgICAgc3BsaWNlSW5kZXgsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSBvciBhZnRlciBjdXJyZW5jeVxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyAkJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnICQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJyQgJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCAnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCcsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvcm1hdCB0aGUgbnVtYmVyXG4gICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcihuLl92YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcblxuICAgICAgICAvLyBwb3NpdGlvbiB0aGUgc3ltYm9sXG4gICAgICAgIGlmIChzeW1ib2xJbmRleCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJygnKSA+IC0xIHx8IG91dHB1dC5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgc3BsaWNlSW5kZXggPSAxO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2xJbmRleCA8IG9wZW5QYXJlbkluZGV4IHx8IHN5bWJvbEluZGV4IDwgbWludXNTaWduSW5kZXgpe1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3ltYm9sIGFwcGVhcnMgYmVmb3JlIHRoZSBcIihcIiBvciBcIi1cIlxuICAgICAgICAgICAgICAgICAgICBzcGxpY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5zcGxpY2Uoc3BsaWNlSW5kZXgsIDAsIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlICsgb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnNwbGljZSgtMSwgMCwgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2w7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2UgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgc3BhY2UgPSAnJyxcbiAgICAgICAgICAgIG91dHB1dCxcbiAgICAgICAgICAgIHZhbHVlID0gbi5fdmFsdWUgKiAxMDA7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSAlXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignICUnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgJScsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCclJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKHZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSApIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICBvdXRwdXQuc3BsaWNlKC0xLCAwLCBzcGFjZSArICclJyk7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBzcGFjZSArICclJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSAobikge1xuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKG4uX3ZhbHVlLzYwLzYwKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmZsb29yKChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApKS82MCksXG4gICAgICAgICAgICBzZWNvbmRzID0gTWF0aC5yb3VuZChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApIC0gKG1pbnV0ZXMgKiA2MCkpO1xuICAgICAgICByZXR1cm4gaG91cnMgKyAnOicgKyAoKG1pbnV0ZXMgPCAxMCkgPyAnMCcgKyBtaW51dGVzIDogbWludXRlcykgKyAnOicgKyAoKHNlY29uZHMgPCAxMCkgPyAnMCcgKyBzZWNvbmRzIDogc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5mb3JtYXRUaW1lIChzdHJpbmcpIHtcbiAgICAgICAgdmFyIHRpbWVBcnJheSA9IHN0cmluZy5zcGxpdCgnOicpLFxuICAgICAgICAgICAgc2Vjb25kcyA9IDA7XG4gICAgICAgIC8vIHR1cm4gaG91cnMgYW5kIG1pbnV0ZXMgaW50byBzZWNvbmRzIGFuZCBhZGQgdGhlbSBhbGwgdXBcbiAgICAgICAgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIC8vIGhvdXJzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzBdKSAqIDYwICogNjApO1xuICAgICAgICAgICAgLy8gbWludXRlc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVsxXSkgKiA2MCk7XG4gICAgICAgICAgICAvLyBzZWNvbmRzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIE51bWJlcih0aW1lQXJyYXlbMl0pO1xuICAgICAgICB9IGVsc2UgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMF0pICogNjApO1xuICAgICAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBOdW1iZXIodGltZUFycmF5WzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTnVtYmVyKHNlY29uZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWJlciAodmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgbmVnUCA9IGZhbHNlLFxuICAgICAgICAgICAgc2lnbmVkID0gZmFsc2UsXG4gICAgICAgICAgICBvcHREZWMgPSBmYWxzZSxcbiAgICAgICAgICAgIGFiYnIgPSAnJyxcbiAgICAgICAgICAgIGFiYnJLID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byB0aG91c2FuZHNcbiAgICAgICAgICAgIGFiYnJNID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byBtaWxsaW9uc1xuICAgICAgICAgICAgYWJickIgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIGJpbGxpb25zXG4gICAgICAgICAgICBhYmJyVCA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gdHJpbGxpb25zXG4gICAgICAgICAgICBhYmJyRm9yY2UgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICBieXRlcyA9ICcnLFxuICAgICAgICAgICAgb3JkID0gJycsXG4gICAgICAgICAgICBhYnMgPSBNYXRoLmFicyh2YWx1ZSksXG4gICAgICAgICAgICBzdWZmaXhlcyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgbWluLFxuICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgcG93ZXIsXG4gICAgICAgICAgICB3LFxuICAgICAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICAgICAgdGhvdXNhbmRzLFxuICAgICAgICAgICAgZCA9ICcnLFxuICAgICAgICAgICAgbmVnID0gZmFsc2U7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgbnVtYmVyIGlzIHplcm8gYW5kIGEgY3VzdG9tIHplcm8gZm9ybWF0IGhhcyBiZWVuIHNldFxuICAgICAgICBpZiAodmFsdWUgPT09IDAgJiYgemVyb0Zvcm1hdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHplcm9Gb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzZWUgaWYgd2Ugc2hvdWxkIHVzZSBwYXJlbnRoZXNlcyBmb3IgbmVnYXRpdmUgbnVtYmVyIG9yIGlmIHdlIHNob3VsZCBwcmVmaXggd2l0aCBhIHNpZ25cbiAgICAgICAgICAgIC8vIGlmIGJvdGggYXJlIHByZXNlbnQgd2UgZGVmYXVsdCB0byBwYXJlbnRoZXNlc1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcoJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG5lZ1AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCcrJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNpZ25lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoL1xcKy9nLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiBhYmJyZXZpYXRpb24gaXMgd2FudGVkXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2EnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWJicmV2aWF0aW9uIGlzIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgIGFiYnJLID0gZm9ybWF0LmluZGV4T2YoJ2FLJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyTSA9IGZvcm1hdC5pbmRleE9mKCdhTScpID49IDA7XG4gICAgICAgICAgICAgICAgYWJickIgPSBmb3JtYXQuaW5kZXhPZignYUInKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJUID0gZm9ybWF0LmluZGV4T2YoJ2FUJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyRm9yY2UgPSBhYmJySyB8fCBhYmJyTSB8fCBhYmJyQiB8fCBhYmJyVDtcblxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWJiciA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBhJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdhJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhYnMgPj0gTWF0aC5wb3coMTAsIDEyKSAmJiAhYWJickZvcmNlIHx8IGFiYnJUKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCAxMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgMTIpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgOSkgJiYgIWFiYnJGb3JjZSB8fCBhYmJyQikge1xuICAgICAgICAgICAgICAgICAgICAvLyBiaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5iaWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDkpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgNikgJiYgIWFiYnJGb3JjZSB8fCBhYmJyTSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDYpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgMykgJiYgIWFiYnJGb3JjZSB8fCBhYmJySykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aG91c2FuZFxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQ7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgd2UgYXJlIGZvcm1hdHRpbmcgYnl0ZXNcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgYicsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYicsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHBvd2VyID0gMDsgcG93ZXIgPD0gc3VmZml4ZXMubGVuZ3RoOyBwb3dlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgucG93KDEwMjQsIHBvd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5wb3coMTAyNCwgcG93ZXIrMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSBieXRlcyArIHN1ZmZpeGVzW3Bvd2VyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgb3JkaW5hbCBpcyB3YW50ZWRcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIG8nLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ28nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkID0gb3JkICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0ub3JkaW5hbCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignWy5dJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG9wdERlYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ1suXScsICcuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHcgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBmb3JtYXQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHRob3VzYW5kcyA9IGZvcm1hdC5pbmRleE9mKCcsJyk7XG5cbiAgICAgICAgICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uLmluZGV4T2YoJ1snKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbi5yZXBsYWNlKCddJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24uc3BsaXQoJ1snKTtcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRvRml4ZWQodmFsdWUsIChwcmVjaXNpb25bMF0ubGVuZ3RoICsgcHJlY2lzaW9uWzFdLmxlbmd0aCksIHJvdW5kaW5nRnVuY3Rpb24sIHByZWNpc2lvblsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSB0b0ZpeGVkKHZhbHVlLCBwcmVjaXNpb24ubGVuZ3RoLCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3ID0gZC5zcGxpdCgnLicpWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGQuc3BsaXQoJy4nKVsxXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCArIGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdERlYyAmJiBOdW1iZXIoZC5zbGljZSgxKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdyA9IHRvRml4ZWQodmFsdWUsIG51bGwsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmb3JtYXQgbnVtYmVyXG4gICAgICAgICAgICBpZiAody5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIG5lZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aG91c2FuZHMgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnJDEnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy50aG91c2FuZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHcgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICgobmVnUCAmJiBuZWcpID8gJygnIDogJycpICsgKCghbmVnUCAmJiBuZWcpID8gJy0nIDogJycpICsgKCghbmVnICYmIHNpZ25lZCkgPyAnKycgOiAnJykgKyB3ICsgZCArICgob3JkKSA/IG9yZCA6ICcnKSArICgoYWJicikgPyBhYmJyIDogJycpICsgKChieXRlcykgPyBieXRlcyA6ICcnKSArICgobmVnUCAmJiBuZWcpID8gJyknIDogJycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBUb3AgTGV2ZWwgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgbnVtZXJhbCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICBpZiAobnVtZXJhbC5pc051bWVyYWwoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgPT09IDAgfHwgdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKCFOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IG51bWVyYWwuZm4udW5mb3JtYXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBOdW1lcmFsKE51bWJlcihpbnB1dCkpO1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG51bWVyYWwudmVyc2lvbiA9IFZFUlNJT047XG5cbiAgICAvLyBjb21wYXJlIG51bWVyYWwgb2JqZWN0XG4gICAgbnVtZXJhbC5pc051bWVyYWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBOdW1lcmFsO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsYW5ndWFnZXMgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbGFuZ3VhZ2UuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbGFuZ3VhZ2Uga2V5LlxuICAgIG51bWVyYWwubGFuZ3VhZ2UgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50TGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5ICYmICF2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudExhbmd1YWdlID0ga2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlcyB8fCAhbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICB9O1xuICAgIFxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBsb2FkZWQgbGFuZ3VhZ2UgZGF0YS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudFxuICAgIC8vIGdsb2JhbCBsYW5ndWFnZSBvYmplY3QuXG4gICAgbnVtZXJhbC5sYW5ndWFnZURhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2tleV07XG4gICAgfTtcblxuICAgIG51bWVyYWwubGFuZ3VhZ2UoJ2VuJywge1xuICAgICAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICAgICAgICB0aG91c2FuZHM6ICcsJyxcbiAgICAgICAgICAgIGRlY2ltYWw6ICcuJ1xuICAgICAgICB9LFxuICAgICAgICBhYmJyZXZpYXRpb25zOiB7XG4gICAgICAgICAgICB0aG91c2FuZDogJ2snLFxuICAgICAgICAgICAgbWlsbGlvbjogJ20nLFxuICAgICAgICAgICAgYmlsbGlvbjogJ2InLFxuICAgICAgICAgICAgdHJpbGxpb246ICd0J1xuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwO1xuICAgICAgICAgICAgcmV0dXJuICh+fiAobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICB9LFxuICAgICAgICBjdXJyZW5jeToge1xuICAgICAgICAgICAgc3ltYm9sOiAnJCdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbnVtZXJhbC56ZXJvRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICB6ZXJvRm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogbnVsbDtcbiAgICB9O1xuXG4gICAgbnVtZXJhbC5kZWZhdWx0Rm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICBkZWZhdWx0Rm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogJzAuMCc7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgSGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcykge1xuICAgICAgICBsYW5ndWFnZXNba2V5XSA9IHZhbHVlcztcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZsb2F0aW5nLXBvaW50IGhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBUaGUgZmxvYXRpbmctcG9pbnQgaGVscGVyIGZ1bmN0aW9ucyBhbmQgaW1wbGVtZW50YXRpb25cbiAgICAvLyBib3Jyb3dzIGhlYXZpbHkgZnJvbSBzaW5mdWwuanM6IGh0dHA6Ly9ndWlwbi5naXRodWIuaW8vc2luZnVsLmpzL1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkucHJvdG90eXBlLnJlZHVjZSBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IGl0XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvUmVkdWNlI0NvbXBhdGliaWxpdHlcbiAgICAgKi9cbiAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgb3B0X2luaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobnVsbCA9PT0gdGhpcyB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGUgbW9tZW50IGFsbCBtb2Rlcm4gYnJvd3NlcnMsIHRoYXQgc3VwcG9ydCBzdHJpY3QgbW9kZSwgaGF2ZVxuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlLiBGb3IgaW5zdGFuY2UsIElFOFxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IHN1cHBvcnQgc3RyaWN0IG1vZGUsIHNvIHRoaXMgY2hlY2sgaXMgYWN0dWFsbHkgdXNlbGVzcy5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUucmVkdWNlIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4LFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKDEgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvcHRfaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgbGVuZ3RoID4gaW5kZXg7ICsraW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmFsdWVTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNWYWx1ZVNldCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIFxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBtdWx0aXBsaWVyIG5lY2Vzc2FyeSB0byBtYWtlIHggPj0gMSxcbiAgICAgKiBlZmZlY3RpdmVseSBlbGltaW5hdGluZyBtaXNjYWxjdWxhdGlvbnMgY2F1c2VkIGJ5XG4gICAgICogZmluaXRlIHByZWNpc2lvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBsaWVyKHgpIHtcbiAgICAgICAgdmFyIHBhcnRzID0geC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMTAsIHBhcnRzWzFdLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB2YXJpYWJsZSBudW1iZXIgb2YgYXJndW1lbnRzLCByZXR1cm5zIHRoZSBtYXhpbXVtXG4gICAgICogbXVsdGlwbGllciB0aGF0IG11c3QgYmUgdXNlZCB0byBub3JtYWxpemUgYW4gb3BlcmF0aW9uIGludm9sdmluZ1xuICAgICAqIGFsbCBvZiB0aGVtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcnJlY3Rpb25GYWN0b3IoKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGFyZ3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBuZXh0KSB7XG4gICAgICAgICAgICB2YXIgbXAgPSBtdWx0aXBsaWVyKHByZXYpLFxuICAgICAgICAgICAgICAgIG1uID0gbXVsdGlwbGllcihuZXh0KTtcbiAgICAgICAgcmV0dXJuIG1wID4gbW4gPyBtcCA6IG1uO1xuICAgICAgICB9LCAtSW5maW5pdHkpO1xuICAgIH0gICAgICAgIFxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIE51bWVyYWwgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBudW1lcmFsLmZuID0gTnVtZXJhbC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXROdW1lcmFsKHRoaXMsIFxuICAgICAgICAgICAgICAgICAgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQsIFxuICAgICAgICAgICAgICAgICAgKHJvdW5kaW5nRnVuY3Rpb24gIT09IHVuZGVmaW5lZCkgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZFxuICAgICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0U3RyaW5nKSA9PT0gJ1tvYmplY3QgTnVtYmVyXScpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0U3RyaW5nOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmZvcm1hdE51bWVyYWwodGhpcywgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3Rvci5jYWxsKG51bGwsIHRoaXMuX3ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gKyBjb3JyRmFjdG9yICogY3VycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAwKSAvIGNvcnJGYWN0b3I7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yLmNhbGwobnVsbCwgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bSAtIGNvcnJGYWN0b3IgKiBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdmFsdWVdLnJlZHVjZShjYmFjaywgdGhpcy5fdmFsdWUgKiBjb3JyRmFjdG9yKSAvIGNvcnJGYWN0b3I7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBtdWx0aXBseSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgKiAoY3VyciAqIGNvcnJGYWN0b3IpIC9cbiAgICAgICAgICAgICAgICAgICAgKGNvcnJGYWN0b3IgKiBjb3JyRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpdmlkZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgLyAoY3VyciAqIGNvcnJGYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2spOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlmZmVyZW5jZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG51bWVyYWwodGhpcy5fdmFsdWUpLnN1YnRyYWN0KHZhbHVlKS52YWx1ZSgpKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTnVtZXJhbFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG51bWVyYWw7XG4gICAgfVxuXG4gICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICBpZiAodHlwZW9mIGVuZGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBoZXJlLCBgdGhpc2AgbWVhbnMgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gYWRkIGBudW1lcmFsYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gICAgICAgIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyICdhZHZhbmNlZCcgbW9kZVxuICAgICAgICB0aGlzWydudW1lcmFsJ10gPSBudW1lcmFsO1xuICAgIH1cblxuICAgIC8qZ2xvYmFsIGRlZmluZTpmYWxzZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICAgICAgfSk7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcbiJdfQ==
