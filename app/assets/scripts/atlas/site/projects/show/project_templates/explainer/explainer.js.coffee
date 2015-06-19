@Atlas.module 'Projects.Show.Explainer', (Explainer, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		model = App.currentProjectModel
		Explainer.Controller.show()
		@