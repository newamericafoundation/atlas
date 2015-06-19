Comp.Welcome = React.createClass
	render: ->
		<div className="welcome">
			<div id="welcome__terrain" className="-id-welcome__terrain"></div> 
			<div className="welcome__title">
				<h1 className="welcome__title__name">ATLAS</h1>
				<h1 className="welcome__title__alias c-2-0">=ANALYSIS</h1>
			</div>
			<div className="welcome__strip bg-c-2-0"></div>
			<div className="welcome__subtitle">
				A policy analysis tool from New America's Education Program
			</div>
			<Comp.Welcome.Nav app={this.props.app}/>
		</div>


Comp.Welcome.Nav = React.createClass 
	navigate: (e) ->
		app = this.props.app
		if app?
			e.preventDefault()
			app = this.props.app
			app.router.navigateApp 'menu'
	render: ->
		<div className="welcome__main-nav">
			<a href="/menu" onClick={@navigate} className="bg-img-grid--off-white" id="welcome__main-nav__button"></a>
			<p className="center">View All Projects</p>
		</div>