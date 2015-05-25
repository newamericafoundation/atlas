@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	Index.SideBarView = Marionette.ItemView.extend
		tagName: 'div'
		className: 'atl__side-bar fill-parent'
		template: 'projects/index/templates/side_bar'
		events: 
			'click a': 'navigate'

		navigate: (e) ->
			'1' is '2'



	class Index.RootView extends Marionette.LayoutView

		tagName: 'div'
		className: 'atl fill-parent'
		template: 'projects/index/templates/root'

		childViewContainer: '.project-container'
		regions:
			banner: '#atl__nav'
			projects: '#atl__projects'
			sideBar: '#atl__side-bar'