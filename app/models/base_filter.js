import _ from 'underscore';
import base from './base.js';

/*
 *
 *
 */
class Model extends base.Model {

	/** Activates model. Takes no collection filter logic into consideration - hence internal only. */
	activate() {
		return this.set('_isActive', true);
	}
	
	/** Deactivates model. Takes no collection filter logic into consideration - hence internal only. */
	deactivate() {
		return this.set('_isActive', false);
	}
	
	/** Toggle the model's active state. */
	toggleActiveState() {
		if (this.isActive()) {
			if (!((this.collection != null) && this.collection.hasSingleActiveChild)) {
				return this.deactivate();
			}
		} else {
			this.activate();
			if ((this.collection != null) && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this);
			}
		}
	}
	
	/** Get active state. */
	isActive() {
		return this.get('_isActive');
	}
	
	/** 
	 * Tests whether a tested model satisfies a belongs_to relation with the model instance under a specified foreign key. 
	 * Example: this.get('id') === testedModel.get('user_id') if the foreign key is 'user'.
	 * @param {object} testedModel
	 * @param {string} foreignKey
	 * @returns {boolean}
	 */
	test(testedModel, foreignKey) {
		var foreignId, foreignIds, id;
		if (!this.isActive()) { return false; }
		id = this.get('id');
		// If there is a single id, test for equality.
		foreignId = testedModel.get(foreignKey + '_id');
		if (foreignId != null) { return (id === foreignId); }
		// If there are multiple ids, test for inclusion.
		foreignIds = testedModel.get(foreignKey + '_ids');
		if (foreignIds != null) { return (foreignIds.indexOf(id) >= 0); }
		return false;
	}

}



/*
 *
 *
 */
class Collection extends base.Collection {

	get model() { return exports.Model; }

	get hasSingleActiveChild() { return false; }

	/** Initializes active state of the collection's models. */
	initialize() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	}
	

	/**
	 * Deactivate all siblings of an active child element.
	 * @param {} activeChild - Active child model instance from where the method is usually called
	 * @returns {array} results
	 */
	deactivateSiblings(activeChild) {
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
	}


	/** 
	 * Set and initialize active state of the collection's models. 
	 * If the hasSingleActiveChild is set to true on the collection instance, the first model is set as active and all others are set as inactive.
	 * Otherwise, all models are set as active. 
	 */
	initializeActiveStates() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : (index === 0 ? true : false));
		}
		return this.trigger('initialize:active:states');
	}


	/**
	 * 
	 * @param {object} testedModel - 
	 * @param {string} foreignKey - 
	 * @returns {boolean}
	 */
	test(testedModel, foreignKey) {
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

}

export default {
	Model: Model,
	Collection: Collection
}