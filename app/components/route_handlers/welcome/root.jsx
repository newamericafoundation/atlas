import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

class Welcome extends React.Component {

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
					<Link to="/menu" className="bg-img-grid--off-white" />
					<p className="center">View All Projects</p>
				</div>
			</div>
		);
	}

	getBackgroundImageStyle() {
		return { 'backgroundImage': 'url("/assets/images/iStock_000065438623_720.jpg")' }
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

}

Welcome.contextTypes = {
	router: React.PropTypes.func
};

export default Welcome;