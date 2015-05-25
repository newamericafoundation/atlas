@Atlas.module 'Site', (Site, App, Backbone, Marionette, $, _) ->

	@startWithParent = true

	App.swipeDirection = 'left'

	App.addRegions
		headerRegion: 
			selector: '#header'
			regionClass: Marionette.Region
		contentRegion: 
			selector: '#atl'
			regionClass: App.Base.Region

	App.reqres.setHandler 'isResearcherLoggedIn', ->
		$('meta[name="researcher-signed-in"]').attr('content') is 'true'