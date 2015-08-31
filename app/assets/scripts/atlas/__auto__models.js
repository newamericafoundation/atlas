(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Do not bundle researcher.

'use strict';

var base = require('./base.js'),
    baseFilter = require('./base_filter.js'),
    coreDatum = './core_datum.js',
    filter = require('./filter.js'),
    image = require('./image.js'),
    item = require('./item.js'),
    project = require('./project.js'),
    projectSection = require('./project_section.js'),
    projectTemplate = require('./project_template.js'),
    richGeoFeature = require('./rich_geo_feature.js'),
    variable = require('./variable.js');

window.Atlas.module('Models', function (Models) {

	Models.BaseModel = base.Model;
	Models.BaseCollection = base.Collection;

	Models.BaseFilterModel = baseFilter.Model;
	Models.BaseFilterCollection = baseFilter.Collection;

	Models.CoreDatum = coreDatum.Model;
	Models.CoreData = coreDatum.Collection;

	Models.Filter = filter.Model;
	Models.Filters = filter.Collection;

	Models.Image = image.Model;
	Models.Images = image.Collection;

	Models.Item = item.Model;
	Models.Items = item.Collection;

	Models.Project = project.Model;
	Models.Projects = project.Collection;

	Models.ProjectSection = projectSection.Model;
	Models.ProjectSections = projectSection.Collection;

	Models.ProjectTemplate = projectTemplate.Model;
	Models.ProjectTemplates = projectTemplate.Collection;

	Models.RichGeoFeature = richGeoFeature.Model;
	Models.RichGeoFeatures = richGeoFeature.Collection;

	Models.Variable = variable.Model;
	Models.Variables = variable.Collection;
});

},{"./base.js":2,"./base_filter.js":4,"./filter.js":5,"./image.js":6,"./item.js":7,"./project.js":8,"./project_section.js":9,"./project_template.js":10,"./rich_geo_feature.js":11,"./variable.js":12}],2:[function(require,module,exports){
'use strict';

var Backbone = window.Backbone,
    _ = window._,
    $ = window.$;

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
		$html = $(html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
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
			$html = $(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	},

	/**
  * Set table of contents for html data under a given key.
  * @param {string} key
  * @returns {object} this
  */
	setHtmlToc: function setHtmlToc(key) {

		var html, $containedHtml, arr;

		html = this.get(key);
		if (html == null) {
			return;
		}

		arr = [];

		$containedHtml = $('<div></div>').append($(html));

		$containedHtml.children().each(function () {

			var $el = $(this),
			    tagName = $el.prop('tagName'),
			    content = $el.html(),
			    tocId = content.replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase();

			if (tagName.toLowerCase == null) {
				return;
			}
			tagName = tagName.toLowerCase();

			if (['h1', 'h2'].indexOf(tagName) > -1) {
				$('<span id="toc-' + tocId + '"></span>').insertBefore($el);
				arr.push({
					id: tocId,
					tagName: tagName,
					content: content
				});
			}
		});

		this.set(key, $containedHtml.html());
		this.set(key + '_toc', arr);
	}

});

var Collection = Backbone.Collection.extend({

	model: Model,

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

var Backbone = window.Backbone,
    _ = window._,
    $ = window.$;

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

var _ = window._,
    Backbone = window.Backbone,
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

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js'),
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

},{"./../utilities/formatters.js":13,"./base.js":2,"./base_composite.js":3}],6:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js');

exports.Model = base.Model.extend({

	urlRoot: '/api/v1/images',

	fields: [],

	/** 
  * Fetches image model url by name key
  * @returns {string} - Url plus name
  */
	url: function url() {
		return this.urlRoot + ("?name=" + this.get('name'));
	},

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

	/** Gets encoded url to use in CSS background-image. */
	getBackgroundImageCss: function getBackgroundImageCss() {
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
	url: '/api/v1/images'
});

},{"./base.js":2}],7:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
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

},{"./../../db/seeds/states.json":16,"./base.js":2,"./rich_geo_feature.js":11}],8:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
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

    /**
     * Initializes collection
     */
    // initialize: function() {
    //     return this.on('reset', this.filter);
    // },

    model: exports.Model,

    /**
     * Creates new URL using base API path and query.
     * @returns {string} base - Modified root URL.
     */
    url: function url() {
        var base;
        base = '/api/v1/projects';
        if (this.queryString != null) {
            return base + "?" + this.queryString;
        }
        return base;
    },

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

},{"./../utilities/formatters.js":13,"./base.js":2,"./filter.js":5,"./item.js":7,"./variable.js":12}],9:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    baseFilter = require('./base_filter'),
    seed = require('./../../db/seeds/project_sections.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_sections',
	hasSingleActiveChild: false,
	initializeActiveStatesOnReset: true,
	initialize: function initialize() {
		this.reset(seed);
	}
});

},{"./../../db/seeds/project_sections.json":14,"./base_filter":4}],10:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    baseFilter = require('./base_filter.js'),
    seed = require('./../../db/seeds/project_templates.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_templates'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_templates',
	hasSingleActiveChild: true,
	initializeActiveStatesOnReset: true,
	comparator: 'order',
	initialize: function initialize() {
		this.reset(seed);
	}
});

},{"./../../db/seeds/project_templates.json":15,"./base_filter.js":4}],11:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone;

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

},{}],12:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
    $ = window.$;

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

},{"./../utilities/formatters.js":13,"./base.js":2}],13:[function(require,module,exports){
'use strict';

var numeral = require('numeral'),
    marked = require('marked'),
    $ = window.$;

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

},{"marked":17,"numeral":18}],14:[function(require,module,exports){
module.exports=[
	{ "id": "0", "name": "Early Education" },
	{ "id": "1", "name": "PreK-12 Education" },
	{ "id": "2", "name": "Higher Education" },
	{ "id": "3", "name": "Learning Technologies" },
	{ "id": "4", "name": "Dual Language Learners" },
	{ "id": "5", "name": "Workforce Development" },
	{ "id": "6", "name": "Federal Education Budget" }
]
},{}],15:[function(require,module,exports){
module.exports=[
	{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" },
	{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" },
	{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" },
	{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
]
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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

},{}]},{},[1]);
