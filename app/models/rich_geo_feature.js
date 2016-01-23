// Written in old JavaScript for gulp. To be replaced as needed.

import _ from 'underscore'
import Backbone from 'backbone'

var Model = Backbone.Model.extend({})

var Collection = Backbone.Collection.extend({

	model: Model,

	/*
     *
     *
     */
	initialize: function() {
		_.extend(this, Backbone.Events)
		this.type = 'FeatureCollection'
		return this.features = []
	},


    /*
     *
     *
     */
	onReady: function(next) {
		if (this.features.length > 0) {
			return next()
		}
		return this.on('sync', next)
	}
	
})


export default {
	Model: Model,
	Collection: Collection
}