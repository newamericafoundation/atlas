import React from 'react';

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
		return project.get('data').items.map((item) => {
			return (
				<p>{ item.get('name') }</p>
			);
		});
	}

}

export default List;