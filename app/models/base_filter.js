import _ from 'underscore'
import * as base from './base.js'

/*
 *
 *
 */
export class Model extends base.Model {

	activate() { 
		return this.set('_isActive', true) 
	}
	
	/** Deactivates model. Takes no collection filter logic into consideration - hence internal only. */
	deactivate() { 
		return this.set('_isActive', false) 
	}

	/** Get active state. */
	isActive() {
		return this.get('_isActive')
	}
	
	/** Toggle the model's active state. */
	toggleActiveState() {
		if (this.isActive()) {
			if (!((this.collection) && this.collection.hasSingleActiveChild)) {
				return this.deactivate()
			}
		} else {
			this.activate()
			if ((this.collection) && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this)
			}
		}
	}
	

	/** 
	 * Tests whether the model satisfies a belongs_to relation with the model instance under a specified foreign key. 
	 * Example: this.get('id') === testedModel.get('user_id') if the foreign key is 'user'.
	 * @param {object} testedModel
	 * @param {string} foreignKey
	 * @returns {boolean}
	 */
	test(testedModel, foreignKey) {
		var foreignId, foreignIds, id
		if (!this.isActive()) { return false }
		id = this.get('id')
		// If there is a single id, test for equality.
		foreignId = testedModel.get(foreignKey + '_id')
		if (foreignId != null) { return (id === foreignId) }
		// If there are multiple ids, test for inclusion.
		foreignIds = testedModel.get(foreignKey + '_ids')
		if (foreignIds) { return (foreignIds.indexOf(id) >= 0) }
		return false
	}

}



/*
 *
 *
 */
export class Collection extends base.Collection {

	get model() { return exports.Model }

	get hasSingleActiveChild() { return false }

	/** Initializes active state of the collection's models. */
	initialize() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates)
		}
	}
	

	/**
	 * Deactivate all siblings of an active child element.
	 * @param {} activeChild - Active child model instance from where the method is usually called
	 * @returns {array} results
	 */
	deactivateSiblings(activeChild) {
		return this.models.forEach((model) => {
			if (model !== activeChild) { model.deactivate() }
		})
	}


	/** 
	 * Set and initialize active state of the collection's models. 
	 * If the hasSingleActiveChild is set to true on the collection instance, the first model is set as active and all others are set as inactive.
	 * Otherwise, all models are set as active. 
	 */
	initializeActiveStates() {
		this.models.forEach((model, i) => {
			model.set('_isActive', !this.hasSingleActiveChild ? true : (i === 0 ? true : false))
		})
	}


	/**
	 * 
	 * @param {object} testedModel - 
	 * @param {string} foreignKey - 
	 * @returns {boolean}
	 */
	test(testedModel, foreignKey) {
		for (let model of this.models) {
			if (model.test(testedModel, foreignKey)) {
				return true
			}
		}
		return false
	}

}