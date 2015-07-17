var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');
	
var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

exports.Model = base.Model.extend({
	/** Activates model. Takes no collection filter logic into consideration - hence internal only. */
	_activate: function() {
		return this.set('_isActive', true);
	},
	
	/** Deactivates model. Takes no collection filter logic into consideration - hence internal only. */
	_deactivate: function() {
		return this.set('_isActive', false);
	},
	
	/** Toggle the model's active state. */
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
	
	/** Get active state. */
	isActive: function() {
		return this.get('_isActive');
	},
	
	/** 
	 * Tests whether a tested model satisfies a belongs_to relation with the model instance under a specified foreign key. 
	 * Example: this.get('id') === testedModel.get('user_id') if the foreign key is 'user'.
	 * @param {object} testedModel
	 * @param {string} foreignKey
	 * @returns {boolean}
	 */
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
	/** Initializes active state of the collection's models. */
	initialize: function() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	},
	model: exports.Model,
	hasSingleActiveChild: false,
	
	/**
	 * Deactivate all siblings of an active child element.
	 * @param {} activeChild - Active child model instance from where the method is usually called
	 * @returns {array} results
	 */
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

	/** 
	 * Set and initialize active state of the collection's models. 
	 * If the hasSingleActiveChild is set to true on the collection instance, the first model is set as active and all others are set as inactive.
	 * Otherwise, all models are set as active. 
	 */
	initializeActiveStates: function() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : (index === 0 ? true : false));
		}
		return this.trigger('initialize:active:states');
	},

	/**
	 * 
	 * @param {object} testedModel - 
	 * @param {string} foreignKey - 
	 * @returns {boolean}
	 */
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