@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.ImageModel extends Marionette.Accountant.FilterModel

		urlRoot: '/api/v1/images'

		url: ->
			@urlRoot + "?name=#{@get 'name'}"

		parse: (resp) ->
			parsers = App.Util.parsers
			resp = parsers.removeArrayWrapper resp
			resp = parsers.removeLineBreaks resp, 'encoded'
			resp

		getBackgroundImageCss: () ->
			encoded = @get('encoded')
			if encoded?
				"url('data:image/png;base64,#{encoded}')"

		getAttributionHtml: () ->
			credit = @get 'credit'
			if credit?
				$html = $(marked(credit))
				$html.find('a').attr 'target', '_blank'
				return $html.html()


	class Entities.ImageCollection extends Marionette.Accountant.FilterCollection

		model: Entities.ProjectSectionModel
		url: '/api/v1/images'


	entityManager = new App.Base.EntityManager
		entityConstructor: Entities.ImageModel
		entitiesConstructor: Entities.ImageCollection
			
	App.reqres.setHandler 'image:entities', (options) ->
		entityManager.getEntities(options)

	App.reqres.setHandler 'image:entity', (name) ->
		entityManager.getEntity { name: name }