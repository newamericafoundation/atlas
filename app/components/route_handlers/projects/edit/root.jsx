import React from 'react';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';
import Loading from './../../../general/loading.jsx';

import project from './../../../../models/project.js';

class Edit extends Static {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className='atl atl--explainer'>
				<div className='atl__main fill-parent' onScroll={ this.setStickyPageNav.bind(this) }>
					{ this.renderTitleBar('solid') }
					{ this.renderContentBar() }
				</div>
			</div>
		);
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>Edit Project</h1>
				<ul>
					<li>Updated: {  }</li>
				</ul>
			</div>
		);
	}

	renderPageNavContent() {
		return (
			<div>
				<p>I navigate the page!</p>
			</div>
		);
	}

	renderPageContent() {
		var bulk = this.state.project ? <Form model={ this.state.project } /> : <Loading />
		return (
			<div className="static-content">
				{ bulk }
			</div>
		);
	}

	componentDidMount() {
		if(!this.state.project) {
			this.fetchProject();
		}
	}

	fetchProject() {
		if (!this.props.params) { return; }
		var id = this.props.params.id;
		new project.Collection().getClientFetchPromise({ id: id }).then((coll) => {
			console.log(coll);
		});
	}

}

Edit.contextTypes = {
	router: React.PropTypes.func
};

export default Edit;