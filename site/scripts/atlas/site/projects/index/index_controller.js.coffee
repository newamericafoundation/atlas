@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	Index.Controller =

		showIndex: ->
			rootView = new Index.RootView()
			App.contentRegion.show rootView

			projectsView = @getProjectsView()
			navView = new Index.NavView()

			rootView.getRegion('banner').show navView
			rootView.getRegion('projects').show projectsView
			rootView.getRegion('sideBar').show(new Index.SideBarView())

			navView.getRegion('sectionFilter').show @getProjectSectionsView()
			navView.getRegion('templateFilter').show @getProjectTemplatesView()			

		getProjectsView: () ->
			projects = App.request "project:entities", { cache: true }
			projects.filter()
			new Index.ProjectsView
				collection: projects

		getProjectSectionsView: ->
			projectSections = App.request "project:section:entities", { cache: true }
			projectSections.initializeActiveStates()
			new Index.ProjectSectionsView
				collection: projectSections

		getProjectTemplatesView: ->
			projectTemplates = App.request "project:template:entities", { cache: true }
			projectTemplates.initializeActiveStates()
			new Index.ProjectTemplatesView
				collection: projectTemplates