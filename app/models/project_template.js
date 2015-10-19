import Backbone from 'backbone';
import _ from 'underscore';
import baseFilter from './base_filter';
import seed from './../../db/seeds/project_templates.json';


class Model extends baseFilter.Model {
	get apiUrlRoot() { return '/api/v1/project_templates'; }

	getEditUrl() { return null; }
	getNewUrl() { return null; }
	getDeleteUrl() { return null; }
}


class Collection extends baseFilter.Collection {

	get dbSeed() { return seed; }

	get model() { return Model; }

	get hasSingleActiveChild() { return true; }

	get initializeActiveStatesOnReset() { return true; }

	get comparator() { return 'order'; }

	initialize() {
		this.reset(seed);
	}

}

export default {
	Model: Model,
	Collection: Collection
}