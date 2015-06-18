@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->
	
	class Models.Image extends Backbone.Model

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


	class Models.Images extends Backbone.Collection

		model: Models.Image
		url: '/api/v1/images'