@Atlas.module 'Util', (Util, App, Backbone, Marionette, $, _) ->

	Util.templateHelpers ?= {}

	Util.templateHelpers.addDashOnLongWord = (word) ->
		return word if (not word?)
		word = String(word)
		return word if word.length < 11
		return word.slice(0, -4) + '-' + word.slice(-4)