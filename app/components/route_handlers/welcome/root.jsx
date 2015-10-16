import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import Loader from './../../general/loader.jsx';
import Icons from './../../general/icons.jsx';

var imageSource = "/assets/images/iStock_000065438623_720.jpg";

class Welcome extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			hasImageLoaded: false
		};
	}


	/*
	 *
	 *
	 */
	render() {
		var { Grid } = Icons;
		if (!this.state.hasImageLoaded) { return (<Loader />); }
		return (
			<div className="welcome fill-parent" style={ this.getRootVisibilityStyle() }>
				<div className="welcome__background"></div>
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
					<Link to="/menu">
						<Grid />
					</Link>
					<p className="center">View All Projects</p>
				</div>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		$('<img>').attr({ src: imageSource }).load(() => {
			this.setState({ hasImageLoaded: true });
		});
		this.clearHeaderStripColoring();
	}


	/*
	 *
	 *
	 */
	getBackgroundImageStyle() {
		return { 'backgroundImage': `url('${imageSource}')` }
	}


	/*
	 *
	 *
	 */
	getRootVisibilityStyle() {
		if (this.state.hasImageLoaded === false) { return { display: 'none' }; }
		return { display: 'block' };
	}


	/*
	 *
	 *
	 */
	clearHeaderStripColoring() {
		var { radio } = this.props;
		radio.commands.execute('set:header:strip:color', {});
	}

}

Welcome.contextTypes = {
	router: React.PropTypes.func
};

export default Welcome;