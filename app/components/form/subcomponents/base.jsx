import React from 'react';

class Base extends React.Component {

	render() {
		return (
			<div />
		);
	}

	shouldComponentUpdate() {
		return true;
	}

}

export default Base;