Comp.Projects.Index = React.createClass

	displayName: 'Projects.Index'

	mixins: [ Comp.Mixins.BackboneEvents ]

	getInitialState: ->
		{

		}

	render: ->
		return (
			<div className="atl fill-parent">
				<Comp.SideBar buttons={[{title: 'Submit Comment', method: 'comment', reactIconName: 'Comment', isToggleable: false }]} />
				<div id="atl__main" className="-id-atl__main fill-parent">
					<div className="atl__main">
						<div className="atl__nav bg-c-off-white">
							<h1 className="title title--compact">Explore Atlas</h1>
							<Comp.Projects.Index.ProjectTemplates 
								App={this.props.App}
								projectTemplates={this.state.projectTemplates}
								updateProjectsIndex={this.forceUpdate.bind(this)}
							/>
							<Comp.Projects.Index.ProjectSections 
								App={this.props.App} 
								projectSections={this.state.projectSections}
								updateProjectsIndex={this.forceUpdate.bind(this)}
							/>
						</div>
						<Comp.Projects.Index.Projects 
							App={this.props.App} 
							projects={this.state.projects} 
							projectTemplates={this.state.projectTemplates} 
							projectSections={this.state.projectSections}
							updateProjectsIndex={this.forceUpdate.bind(this)}
						/>
					</div>
				</div>
			</div>
		)		

	componentDidMount: ->
		this.fetchProjects()
		this.fetchProjectSections()
		this.fetchProjectTemplates()

	fetchProjects: ->
		coll = new M.project.Collection()
		coll.getClientFetchPromise().then (coll) =>
			@setState { projects: coll }

	fetchProjectSections: ->
		coll = new M.projectSection.Collection()
		coll.getClientFetchPromise().then (coll) =>
			coll.initializeActiveStates();
			@setState { projectSections: coll }

	fetchProjectTemplates: ->
		coll = new M.projectTemplate.Collection()
		coll.getClientFetchPromise().then (coll) =>
			coll.initializeActiveStates();
			@setState { projectTemplates: coll }