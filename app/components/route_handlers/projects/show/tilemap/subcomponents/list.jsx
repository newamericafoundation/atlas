import React from 'react';
import classNames from 'classnames';

class List extends React.Component {

	render() {
		return (
			<div className='atl__list fill-parent bg-c-off-white'>
				{ this.renderItems() }
			</div>
		);
	}

	renderItems() {
		var project = this.props.project;
		if (project == null) { return; }
		return project.get('data').items.map((item, i) => {
			return (
				<p key={i}>{ item.get('name') }</p>
			);
		});
	}

}

export default List;