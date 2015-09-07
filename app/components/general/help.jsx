import React from 'react';
import classNames from 'classnames';

// Render a help text segment that displays when help is activated.
// Parent needs to be relatively positioned for this to work.
class Help extends React.Component {

	render() {
		var modifierClass = (this.props.position) ? `atl__help--${this.props.position}` : '',
			id = this.props.id ? `atl__help__${this.props.id}` : undefined;
		return (
			<div className={ 'atl__help ' + modifierClass } id={ id } >
				{ this.props.text }
			</div>
		);
	}

}

export default Help;