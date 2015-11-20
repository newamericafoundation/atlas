import Backbone from 'backbone'
import _ from 'underscore'
import * as baseFilter from './base_filter'
import seed from './../../db/seeds/project_templates.json'


export class Model extends baseFilter.Model {
	get apiUrlRoot() { return '/api/v1/project_templates'; }

	getEditUrl() { return null; }
	getNewUrl() { return null; }
	getDeleteUrl() { return null; }
}


export class Collection extends baseFilter.Collection {

	get dbSeed() { return seed; }

	get model() { return Model; }

	get hasSingleActiveChild() { return true; }

	get initializeActiveStatesOnReset() { return true; }

	get comparator() { return 'order'; }

	initialize() {
		this.reset(seed);
	}

}