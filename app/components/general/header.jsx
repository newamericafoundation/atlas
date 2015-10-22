import React from 'react';
import { Link } from 'react-router';
import { Naf } from './icons.jsx';
import classNames from 'classnames';

class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			stripColor: ''
		};
	}

	render() {
		var stripStyle = {
			'backgroundColor': this.state.stripColor
		};
		var className = classNames({
			'header': true,
			'bg-c-grey--base': (!this.props.isTransparent)
		});
		return (
			<div className={ className }>
				<div className="header__corner">
					<Link 
						id="header__welcome-link" 
						to="/menu" 
					>
						<Naf />
					</Link>
				</div>
				<div className="header__main">
					<h1 className="header__main__cursive-prefix"></h1>
					<h1 className="header__main__site-name">{this.props.title}</h1>
					<p className="header__main__title"></p>
				</div>
				{ this.renderAuth() }
				<div className="header__strip" style={stripStyle} />
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderAuth() {
		if (!global.window) { return; }
		var { researcher } = global.window;
		if (!researcher) { return; }
		return (
			<div className="header__auth">
				<img src={researcher.image.url} alt='Researcher Photo'></img>
				<p>{ `Hi, ${researcher.name.givenName}!` }</p>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		this.setStripHandler();
	}


	/*
	 *
	 *
	 */
	setStripHandler() {
		var { radio } = this.props;
		radio.commands.setHandler('set:header:strip:color', (options) => {
			if (options.color) {
				// reset class to original
				this.setState({ stripColor: options.color });
			} else {
				this.setState({ stripColor: undefined });
			}
		});
	}

}


export default Header;