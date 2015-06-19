@Atlas.module 'Projects.Show.Explainer', (Explainer, App, Backbone, Marionette, $, _) ->

	Explainer.Controller = 

		show: ->
			rootView = @getRootView()
			App.appContentRegion.show rootView
			relatedPagesView = @getRelatedPagesView()
			rootView.getRegion('related').show relatedPagesView
			# @getReactView()

		getReactView: ->

			model = App.currentProjectModel
			id = model.get 'id'

			coll = App.reqres.request 'project:entities', { queryString: "related_to=#{id}", cache: false }

			c = React.createElement Comp.Projects.Show.Explainer,
				model: model
				collection: coll

		getRootView: ->
			view = new Explainer.RootView
				model: App.currentProjectModel
			view

		getRelatedPagesView: ->
			id = App.currentProjectModel.id
			coll = App.reqres.request 'project:entities', { queryString: "related_to=#{id}", cache: false }
			new Explainer.RelatedPagesView
				collection: coll