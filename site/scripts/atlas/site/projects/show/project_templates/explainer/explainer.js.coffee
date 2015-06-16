@Atlas.module 'Projects.Show.Explainer', (Explainer, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->

		Explainer.Controller.show()

		@