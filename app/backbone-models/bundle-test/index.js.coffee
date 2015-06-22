`
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Backbone = (window.Backbone),
	_ = (window._),
	$ = (window.$);

exports.Model = Backbone.Model.extend({
	_findAndReplaceKey: function(data, standardKey, keyFormatList) {
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
		_adaptMongoId: function(data) {
			if ((data._id != null)) {
				if ((data._id.$oid != null)) {
					data.id = String(data._id.$oid);
				} else {
					data.id = data._id;
				}
				delete data._id;
			} else if ((data.id != null) && (data.id.$oid != null)) {
				data.id = String(data.id.$oid);
			}
			return data;
		},
		_removeArrayWrapper: function(resp) {
			if (_.isArray(resp) && (resp.length === 1)) {
				resp = resp[0];
			}
			return resp;
		},
		_removeLineBreaks: function(resp, key) {
			if (resp[key] != null) {
				resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
			}
			return resp;
		},
		_removeSpaces: function(resp, key) {
			if (resp[key] != null) {
				resp[key] = resp[key].replace(/\s+/g, '');
			}
			return resp;
		},
		_processStaticHtml: function(resp, key) {
			var $html, html, newHtml;
			html = resp[key];
			$html = $(html);
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			resp[key] = newHtml;
			return resp;
		},
		getMarkdownHtml: function(key) {
			var $html, md, newHtml;
			md = this.get(key);
			if (md != null) {
				$html = $(marked(md));
				$html.find('a').attr('target', '_blank');
				newHtml = $('<div></div>').append($html.clone()).html();
				return newHtml;
			}
		}
	});

exports.Collection = Backbone.Collection.extend({
	model: exports.Model
});
},{}],2:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$),
	indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};

exports.Model = base.Model.extend({
	_activate: function() {
		return this.set('_isActive', true);
	},
	_deactivate: function() {
		return this.set('_isActive', false);
	},
	toggleActiveState: function() {
		if (this.isActive()) {
			if (!((this.collection != null) && this.collection.hasSingleActiveChild)) {
				return this._deactivate();
			}
		} else {
			this._activate();
			if ((this.collection != null) && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this);
			}
		}
	},
	isActive: function() {
		return this.get('_isActive');
	},
	test: function(testedModel, foreignKey) {
		var foreignId, foreignIds, id;
		if (!this.isActive()) {
			return false;
		}
		id = this.get('id');
		foreignId = testedModel.get(foreignKey + '_id');
		if (foreignId != null) {
			return id === foreignId;
		}
		foreignIds = testedModel.get(foreignKey + '_ids');
		if (foreignIds != null) {
			return (indexOf.call(foreignIds, id) >= 0);
		}
		return false;
	}
});

exports.Collection = base.Collection.extend({
	initialize: function() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	},
	model: exports.Model,
	hasSingleActiveChild: false,
	deactivateSiblings: function(activeChild) {
		var i, len, model, ref, results;
		ref = this.models;
		results = [];
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model !== activeChild) {
				results.push(model._deactivate());
			} else {
				results.push(void 0);
			}
		}
		return results;
	},
	initializeActiveStates: function() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : (index === 0 ? true : false));
		}
		return this.trigger('initialize:active:states');
	},
	test: function(testedModel, foreignKey) {
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
},{"./base":1}],3:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	urlRoot: '/api/v1/core_data',
	url: function() {
		return this.urlRoot + "?" + $.param({
			name: this.get('name')
		});
	},
	parse: function(resp) {
		return resp = this._removeArrayWrapper(resp);
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: 'api/v1/core_data'
});
},{"./base":1}],4:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	getVariableModel: function(variables) {
		return variables.findWhere({
			id: this.get('variable_id')
		});
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":1}],5:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	urlRoot: '/api/v1/images',
	url: function() {
		return this.urlRoot + ("?name=" + (this.get('name')));
	},
	parse: function(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},
	getBackgroundImageCss: function() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: '/api/v1/images'
});
},{"./base":1}],6:[function(require,module,exports){
var base = require('./base'),
	baseFilter = require('./base_filter'),
	coreDatum = require('./core_datum'),
	filter = require('./filter'),
	image = require('./image'),
	infoBoxSection = require('./info_box_section');

window.Models = {

	BaseModel: base.Model,
	BaseCollection: base.Collection,

	BaseFilterModel: baseFilter.Model,
	BaseFilterCollection: baseFilter.Collection,

	CoreDatum: coreDatum.Model,
	CoreData: coreDatum.Collection,

	Filter: filter.Model,
	Filters: filter.Collection

};
},{"./base":1,"./base_filter":2,"./core_datum":3,"./filter":4,"./image":5,"./info_box_section":7}],7:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);


exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});

},{"./base":1}]},{},[6]);

`