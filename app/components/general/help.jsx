import React from 'react';
import classNames from 'classnames';

// Render a help text segment that displays when help is activated.
// Parent needs to be relatively positioned for this to work.
class Help extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		var className = classNames({
			'atl__help': true
		});
		className += ` atl__help--${this.props.position}`;
		var id = this.props.id ? `atl__help__${this.props.id}` : undefined;
		return (
			<div className={ className } id={ id } >
				{ this.props.text }
			</div>
		);
	}

}

export default Help;