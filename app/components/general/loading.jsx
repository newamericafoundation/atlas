import React from 'react';
import classNames from 'classnames';

class Loading extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='loader'>
				<img src="/assets/images/spinner.gif" />
			</div>
		);
	}

}

export default Loading;