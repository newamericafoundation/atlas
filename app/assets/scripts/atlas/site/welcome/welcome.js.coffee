@Atlas.module 'Welcome', (Welcome, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	el = $('#atl')[0] 

	@on 'start', ->
		c = React.createElement(Comp.Welcome, { app: App })
		React.render c, el

	@on 'stop', ->
		React.unmountComponentAtNode el
		@stopListening()