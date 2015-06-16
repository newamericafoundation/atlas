@Atlas.module 'Util', (Util, App, Backbone, Marionette, $, _) ->

	App.commands.setHandler 'apply:route:specific:styling', (route, theme) ->
		$('body').attr 'class', 'atl-route--' + route
		$('.header__main h1').html ( if route is 'welcome_index' then 'NEW AMERICA' else 'ATLAS' )
		App.commands.execute 'set:header:strip:color'