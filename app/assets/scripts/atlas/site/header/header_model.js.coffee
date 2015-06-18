@Atlas.module 'Header', (Header, App, Backbone, Marionette, $, _) ->

	Header.navCirclesCollection = new Backbone.Collection [
		{ url: '/welcome' }
		{ url: '/menu' }
		{ url: '/show' }
		# { url: '/about' }
	]