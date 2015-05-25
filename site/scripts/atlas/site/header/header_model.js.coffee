@Atlas.module 'Header', (Header, App, Backbone, Marionette, $, _) ->

	Header.navCirclesCollection = new Backbone.Collection [
		{ url: '/welcome' }
		{ url: '/menu' }
		{ url: '/pindrop' }
		{ url: '/about' }
	]