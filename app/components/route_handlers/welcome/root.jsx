import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import Loader from './../../general/loader.jsx'
import { Grid } from './../../general/icons.jsx'

const IMAGE_URL = "/assets/images/iStock_000065438623_720.jpg"

/*
 *
 *
 */
class Welcome extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.state = { hasImageLoaded: false }
	}


	/*
	 *
	 *
	 */
	render() {
		if (!this.state.hasImageLoaded) { return (<Loader />); }
		return (
			<div className="welcome fill-parent" style={ this.getRootVisibilityStyle() }>
				<div className="welcome__background"></div>
				<div className="welcome__terrain" style={ { 'backgroundImage': `url('${IMAGE_URL}')` } } /> 
				<div className="welcome__title">
					<h1 className="welcome__title__name">ATLAS</h1>
					<h1 className="welcome__title__alias c-2-0">=ANALYSIS</h1>
				</div>
				<div className="welcome__strip bg-c-2-0"></div>
				<div className="welcome__subtitle">
					{ "A policy analysis tool from New America's Education Program" }
				</div>
				<div className="welcome__nav">
					<Link to="/menu">
						<Grid />
					</Link>
					<p className="center">View All Projects</p>
				</div>
			</div>
		)
	}


	/*
	 * Create an image element not attached to the dom to capture the load event of the hero image.
	 *
	 */
	componentDidMount() {
		$('<img>').attr({ src: IMAGE_URL }).load(() => {
			this.setState({ hasImageLoaded: true })
		})
		this.clearHeaderStripColoring()
	}


	/*
	 *
	 *
	 */
	getRootVisibilityStyle() {
		if (this.state.hasImageLoaded === false) { return { display: 'none' } }
		return { display: 'block' }
	}


	/*
	 *
	 *
	 */
	clearHeaderStripColoring() {
		var { radio } = this.props
		radio.commands.execute('set:header:strip:color', {})
	}

}

export default Welcome