@Atlas.module 'About', (About, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	el = $('#atl')[0] 

	@on 'start', ->
		c = React.createElement(Comp.About, { app: App })
		React.render c, el 

	@on 'stop', ->
		React.unmountComponentAtNode el
		@stopListening()