@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->
	
	Models.Image = Models.BaseModel.extend

		urlRoot: '/api/v1/images'

		url: ->
			@urlRoot + "?name=#{@get 'name'}"

		parse: (resp) ->
			resp = @_removeArrayWrapper resp
			resp = @_removeLineBreaks resp, 'encoded'
			resp

		getBackgroundImageCss: () ->
			encoded = @get('encoded')
			if encoded?
				"url('data:image/png;base64,#{encoded}')"

		getAttributionHtml: () ->
			@getMarkdownHtml('credit')


	Models.Images = Models.BaseCollection.extend

		model: Models.Image
		url: '/api/v1/images'