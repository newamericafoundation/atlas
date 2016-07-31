// Written in old JavaScript for gulp. To be replaced as needed.

import _ from 'underscore'
import Backbone from 'backbone'

class Model extends Backbone.Model {

}

class Collection extends Backbone.Collection {

	constructor(args) {
		super(args)
		this.type = 'FeatureCollection'
		this.features = []
	}

	get model() { return Model }

	onReady(next) {
		if (this.features.length > 0) {
			return next()
		}
		return this.on('sync', next)
	}
	
}


export default {
	Model: Model,
	Collection: Collection
}