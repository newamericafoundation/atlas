@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->

	Base.Entity = Backbone.Model.extend

		# Finds model id within the common Mongoid return format: 
		#   { id: { $oid: "the actual id Backbone needs" } }.
		#   { _id: "the actual id Backbone needs" }
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		_adaptMongoId: (resp) ->
			if (resp.id? and resp.id.$oid? and _.isObject(resp.id))
				resp.id = resp.id['$oid'] 
				return resp
			if (resp._id? and not resp.id?)
				resp.id = resp._id
				delete resp._id
				return resp