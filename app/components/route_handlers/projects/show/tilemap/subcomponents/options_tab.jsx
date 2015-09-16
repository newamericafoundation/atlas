import React from 'react';
import classNames from 'classnames';
import { No } from './../../../../../general/icons.jsx';

class OptionsTab extends React.Component {

	render() {
		return (
			<div className='atl__options-tab'>
				<a href='#' className='atl__options-tab__close' onClick={ this.close.bind(this) }>
					<No />
				</a>
				<div className='atl__options-tab__content'>
					<ul>
						{ this.renderKeyGroups() }
					</ul>
				</div>
			</div>
		);
	}

	close(e) {
		e.preventDefault();
		this.props.setUiState({ isOptionsTabActive: false });
	}

	renderKeyGroups() {
		var keys = this.props.filter.children;
		var groups = _.groupBy(keys, (key) => { return key.get('variable').get('group_name') || 'Variables'; });
		console.log(groups);
		return Object.keys(groups).map((groupName) => {
			var group = groups[groupName];
			return (
				<li>
					<p className='title'>{ groupName }</p>
					{ this.renderKeys(group) }
				</li>
			);
		});
	}

	// Render only three around the current active key.
	renderKeys(keys) {
		return keys.map((key, i) => {
			return (
				<FilterKey App={this.props.App} filterKey={key} key={i} />
			);
		});
	}

}

class FilterKey extends React.Component {

	render() {
		var cls = classNames({
			'button': 'true',
			'button--active': this.props.filterKey.isActive()
		});
		return (
			<li className={ cls } onClick={ this.toggle.bind(this) }>
				<p>
					{ this.getContent() }
				</p>
			</li>
		);
	}

	getContent() {
		return this.props.filterKey.get('variable').get('display_title');
	}

	toggle() {
		var App = this.props.App;
		this.props.filterKey.clickToggle();
		if (App == null) { return; }
		App.commands.execute('update:tilemap');
	}

}

export default OptionsTab;