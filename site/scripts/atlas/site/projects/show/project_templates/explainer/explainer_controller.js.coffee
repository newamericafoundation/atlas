@Atlas.module 'Projects.Show.Explainer', (Explainer, App, Backbone, Marionette, $, _) ->

	Explainer.Controller = 

		show: ->
			rootView = @getRootView()
			App.appContentRegion.show rootView
			relatedPagesView = @getRelatedPagesView()
			rootView.getRegion('related').show relatedPagesView

		getRootView: ->
			view = new Explainer.RootView
				model: App.currentProjectModel
			view

		getRelatedPagesView: ->
			id = App.currentProjectModel.id
			coll = App.reqres.request 'project:entities', { queryString: "related_to=#{id}", cache: false }
			new Explainer.RelatedPagesView
				collection: coll