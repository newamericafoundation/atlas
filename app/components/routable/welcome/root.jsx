Comp.Welcome = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hasImageLoaded: false
		};
	}

	render() {
		return (
			<div className="welcome" style={ this.getRootVisibilityStyle() }>
				<div className="welcome__terrain" style={ this.getBackgroundImageStyle() } /> 
				<div className="welcome__title">
					<h1 className="welcome__title__name">ATLAS</h1>
					<h1 className="welcome__title__alias c-2-0">=ANALYSIS</h1>
				</div>
				<div className="welcome__strip bg-c-2-0"></div>
				<div className="welcome__subtitle">
					{ "A policy analysis tool from New America's Education Program" }
				</div>
				<div className="welcome__main-nav">
					<a href="/menu" onClick={ this.navigate.bind(this) } className="bg-img-grid--off-white" id="welcome__main-nav__button"></a>
					<p className="center">View All Projects</p>
				</div>
			</div>
		);
	}

	getBackgroundImageStyle() {
		return { 'background-image': 'url("/assets/images/iStock_000065438623_720.jpg")' }
	}

	getRootVisibilityStyle() {
		if (this.state.hasImageLoaded === false) { return { display: 'none' }; }
		return { display: 'block' };
	}

	componentDidMount() {
		$('<img>').attr({ src: "/assets/images/iStock_000065438623_720.jpg" }).load(() => {
			this.setState({ hasImageLoaded: true });
		});
	}

	navigate(e) {
		App = this.props.App
		if (App == null) { return; }
		e.preventDefault();
		App.router.navigate('menu');
	}

}